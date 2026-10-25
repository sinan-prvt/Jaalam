from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import Client, TestCase
from django.utils import timezone

from customers.models import Customer
from users.models import Notification
from websites.models import Website
from . import views
from .models import LoyaltyCard, LoyaltyProgram, StampEvent
from .serializers import normalize_phone

User = get_user_model()


class LoyaltyTests(TestCase):
    def setUp(self):
        cache.clear()  # throttle counters
        self.owner = User.objects.create_user(username='cafe', email='cafe@example.com', password='x',
                                              membership='BUSINESS', plan_expires_at=timezone.now() + timedelta(days=30))
        self.site = Website.objects.create(user=self.owner, slug='bean-house', business_type='Cafe', published=True)
        self.other = User.objects.create_user(username='other', email='o@example.com', password='x',
                                              membership='BUSINESS', plan_expires_at=timezone.now() + timedelta(days=30))
        self.client.force_login(self.owner)

    def setup_program(self, **extra):
        body = {'reward': 'Free coffee', 'stamps_required': 3, 'icon': 'coffee', 'color': '#7c2d12', **extra}
        return self.client.put('/api/loyalty/sites/bean-house/', body, content_type='application/json')

    def join(self, name='Asha', phone='+91 98470 12345'):
        return Client().post('/api/loyalty/public/bean-house/join/', {'name': name, 'phone': phone}, content_type='application/json')

    def act(self, code, what, client=None):
        return (client or self.client).post(f'/api/loyalty/cards/{code}/{what}/')

    def test_phone_normalising(self):
        self.assertEqual(normalize_phone('+91 98470 12345'), '9847012345')
        self.assertEqual(normalize_phone('098470-12345'), '9847012345')
        self.assertEqual(normalize_phone('abc'), '')

    def test_setup_and_public_page(self):
        res = self.client.get('/api/loyalty/sites/bean-house/').json()
        self.assertFalse(res['exists'])
        self.assertTrue(res['allowed'])
        self.assertEqual(Client().get('/api/loyalty/public/bean-house/').status_code, 404)

        res = self.setup_program()
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()['exists'])
        self.assertEqual(res.json()['stats']['members'], 0)

        public = Client().get('/api/loyalty/public/bean-house/').json()
        self.assertEqual(public['reward'], 'Free coffee')
        self.assertEqual(public['stamps_required'], 3)

        self.assertEqual(self.setup_program(color='red').status_code, 400)
        self.setup_program(is_active=False)
        self.assertEqual(Client().get('/api/loyalty/public/bean-house/').status_code, 404)

    def test_free_plan_cannot_run_a_program(self):
        self.owner.membership, self.owner.plan_expires_at = 'TEST', None
        self.owner.save()
        res = self.setup_program()
        self.assertEqual(res.status_code, 403)
        self.assertTrue(res.json()['upgrade_required'])
        self.assertFalse(LoyaltyProgram.objects.exists())

    def test_join_makes_customer_card_and_notification_once(self):
        self.setup_program()
        res = self.join()
        self.assertEqual(res.status_code, 201)
        code = res.json()['code']
        customer = Customer.objects.get(website=self.site)
        self.assertEqual((customer.source, customer.phone), ('LOYALTY', '9847012345'))
        self.assertTrue(Notification.objects.filter(user=self.owner, notification_type='new_lead').exists())

        again = self.join(phone='098470 12345')
        self.assertEqual(again.status_code, 200)
        self.assertEqual(again.json(), {'code': code, 'existing': True})
        self.assertEqual(LoyaltyCard.objects.count(), 1)

        self.assertEqual(self.join(phone='12').status_code, 400)

    def test_card_page_hides_staff_details_from_the_public(self):
        self.setup_program()
        code = self.join().json()['code']
        public = Client().get(f'/api/loyalty/cards/{code}/').json()
        self.assertEqual(public['stamps'], 0)
        self.assertFalse(public['can_manage'])
        self.assertNotIn('phone', public)

        staff = self.client.get(f'/api/loyalty/cards/{code}/').json()
        self.assertTrue(staff['can_manage'])
        self.assertEqual(staff['phone'], '9847012345')
        self.assertEqual(Client().get('/api/loyalty/cards/not-a-code/').status_code, 404)

    def test_stamp_daily_limit_redeem_and_undo(self):
        self.setup_program(max_stamps_per_day=2)
        code = self.join().json()['code']

        self.assertEqual(self.act(code, 'stamp').json()['stamps'], 1)
        self.assertEqual(self.act(code, 'stamp').json()['stamps'], 2)
        res = self.act(code, 'stamp')
        self.assertEqual(res.status_code, 400)
        self.assertIn('today', res.json()['detail'])

        # Undo frees today's slot again
        self.assertEqual(self.act(code, 'undo').json()['stamps'], 1)
        self.assertEqual(self.act(code, 'redeem').status_code, 400)  # not full yet
        self.act(code, 'stamp')
        StampEvent.objects.update(created_at=timezone.now() - timedelta(days=1))  # a new day
        card = self.act(code, 'stamp').json()
        self.assertTrue(card['reward_ready'])
        self.assertEqual(self.act(code, 'stamp').status_code, 400)  # full: give the reward first

        card = self.act(code, 'redeem').json()
        self.assertEqual((card['stamps'], card['rewards_redeemed'], card['reward_ready']), (0, 1, False))
        self.assertEqual(self.act(code, 'undo').status_code, 400)

        stats = self.client.get('/api/loyalty/sites/bean-house/').json()['stats']
        self.assertEqual((stats['members'], stats['rewards_given'], stats['ready_now']), (1, 1, 0))

    def test_only_the_shop_can_stamp(self):
        self.setup_program()
        code = self.join().json()['code']
        stranger = Client()
        stranger.force_login(self.other)
        self.assertEqual(self.act(code, 'stamp', stranger).status_code, 403)
        self.assertEqual(self.act(code, 'stamp', Client()).status_code, 401)  # not logged in
        self.assertEqual(stranger.get('/api/loyalty/sites/bean-house/').status_code, 404)
        self.assertEqual(LoyaltyCard.objects.get().stamps, 0)

        # The shop's client login can stamp
        client_user = User.objects.create_user(username='cafeclient', email='c@example.com', password='x', role='CLIENT')
        self.site.client = client_user
        self.site.save()
        c = Client()
        c.force_login(client_user)

        # Agency overview lists the owner's shops with their client; the client sees only its own
        Website.objects.create(user=self.owner, slug='second-shop', business_type='Salon / Spa', published=True)
        overview = {row['slug']: row for row in self.client.get('/api/loyalty/sites/').json()}
        self.assertEqual(set(overview), {'bean-house', 'second-shop'})
        self.assertEqual(overview['bean-house']['client'], 'cafeclient')
        self.assertEqual(overview['bean-house']['stats']['members'], 1)
        self.assertIsNone(overview['second-shop']['program'])
        self.assertEqual([row['slug'] for row in c.get('/api/loyalty/sites/').json()], ['bean-house'])
        self.assertEqual(stranger.get('/api/loyalty/sites/').json(), [])
        self.assertEqual(self.act(code, 'stamp', c).json()['stamps'], 1)
        site = c.get('/api/loyalty/sites/bean-house/').json()
        self.assertEqual((site['allowed'], site['is_owner']), (True, False))  # uses the owner's plan
        self.assertEqual(c.put('/api/loyalty/sites/bean-house/', {'reward': 'a free haircut', 'icon': 'scissors'},
                               content_type='application/json').json()['program']['icon'], 'scissors')

    def self_stamp(self, code, **body):
        return Client().post('/api/loyalty/public/bean-house/self-stamp/', {'code': code, **body}, content_type='application/json')

    def test_counter_screen_self_scan(self):
        self.setup_program(stamp_mode='SCREEN')
        code = self.join().json()['code']
        key = self.client.get('/api/loyalty/sites/bean-house/').json()['counter_key']

        screen = Client().get(f'/api/loyalty/counter/{key}/').json()
        self.assertEqual(screen['reward'], 'Free coffee')
        self.assertNotIn('latitude', screen)

        # No code, a made-up code, or one from 5 minutes ago (a photo taken earlier) fail
        self.assertTrue(self.self_stamp(code).json()['expired'])
        self.assertTrue(self.self_stamp(code, token='0123456789ab').json()['expired'])
        program = LoyaltyProgram.objects.get()
        old = views.counter_token(program, views._window() - 10)
        self.assertEqual(self.self_stamp(code, token=old).status_code, 400)

        res = self.self_stamp(code, token=screen['token'])
        self.assertEqual(res.status_code, 200)
        self.assertEqual((res.json()['stamps'], res.json()['stamped']), (1, True))
        self.assertFalse(res.json()['can_manage'])
        self.assertTrue(StampEvent.objects.get().self_scan)

        again = self.self_stamp(code, token=screen['token'])  # once a day
        self.assertEqual(again.status_code, 400)
        self.assertTrue(again.json()['already'])
        self.assertEqual(again.json()['card']['stamps'], 1)

        # Resetting the screen link makes the old screen stop working
        self.client.post('/api/loyalty/sites/bean-house/reset-counter/')
        self.assertEqual(Client().get(f'/api/loyalty/counter/{key}/').status_code, 404)

    def test_todays_code_from_the_cashier(self):
        self.setup_program(stamp_mode='CODE')
        code = self.join().json()['code']
        today = self.client.get('/api/loyalty/sites/bean-house/').json()['today_code']
        self.assertRegex(today, r'^\d{4}$')
        self.assertEqual(Client().get('/api/loyalty/public/bean-house/').json().get('today_code'), None)  # never public

        self.assertTrue(self.self_stamp(code).json()['need_code'])
        wrong = str((int(today) + 1) % 10000).zfill(4)
        res = self.self_stamp(code, pin=wrong)
        self.assertEqual(res.json()['detail'], 'Wrong code. 4 tries left today.')

        res = self.self_stamp(code, pin=today)
        self.assertEqual((res.json()['stamps'], res.json()['stamped']), (1, True))
        self.assertTrue(self.self_stamp(code, pin=today).json()['already'])  # once a day, even with the right code

        # The code is different on other days
        program = LoyaltyProgram.objects.get()
        days = {views.daily_code(program, timezone.localdate() + timedelta(days=d)) for d in range(5)}
        self.assertGreater(len(days), 1)

        # "New code now": yesterday's/old code stops working
        new = self.client.post('/api/loyalty/sites/bean-house/reset-counter/').json()['today_code']
        self.assertEqual(new, self.client.get('/api/loyalty/sites/bean-house/').json()['today_code'])

    def test_guessing_the_code_locks_the_card_for_the_day(self):
        self.setup_program(stamp_mode='CODE')
        code = self.join().json()['code']
        today = self.client.get('/api/loyalty/sites/bean-house/').json()['today_code']
        wrong = str((int(today) + 1) % 10000).zfill(4)
        for _ in range(4):
            self.self_stamp(code, pin=wrong)
        res = self.self_stamp(code, pin=wrong)
        self.assertTrue(res.json()['locked'])
        res = self.self_stamp(code, pin=today)  # even the right code is refused now
        self.assertTrue(res.json()['locked'])
        self.assertEqual(LoyaltyCard.objects.get().stamps, 0)

        # Next day the card can try again
        LoyaltyCard.objects.update(code_fail_date=timezone.localdate() - timedelta(days=1))
        self.assertEqual(self.self_stamp(code, pin=today).json()['stamps'], 1)

    def test_printed_qr_needs_the_phone_at_the_shop(self):
        self.assertEqual(self.setup_program(stamp_mode='PRINTED').status_code, 400)  # no shop location yet
        self.setup_program(stamp_mode='PRINTED', latitude=10.0159, longitude=76.3419, radius_m=150)
        code = self.join().json()['code']

        self.assertTrue(self.self_stamp(code).json()['need_location'])
        self.assertTrue(self.self_stamp(code, latitude=10.0300, longitude=76.3419).json()['too_far'])  # ~1.5 km
        res = self.self_stamp(code, latitude=10.0162, longitude=76.3421)  # ~40 m away
        self.assertEqual(res.json()['stamps'], 1)

    def test_staff_mode_and_wrong_shop_refuse_self_scan(self):
        self.setup_program(stamp_mode='STAFF')
        code = self.join().json()['code']
        self.assertEqual(self.self_stamp(code, token='x').status_code, 400)
        other = Website.objects.create(user=self.other, slug='other-cafe', business_type='Cafe', published=True)
        LoyaltyProgram.objects.create(website=other)
        res = Client().post('/api/loyalty/public/other-cafe/self-stamp/', {'code': code}, content_type='application/json')
        self.assertEqual(res.status_code, 404)
        self.assertEqual(LoyaltyCard.objects.get().stamps, 0)

    def test_members_search(self):
        self.setup_program()
        self.join('Asha', '9847012345')
        self.join('Biju', '9000000001')
        self.assertEqual(len(self.client.get('/api/loyalty/sites/bean-house/members/').json()), 2)
        found = self.client.get('/api/loyalty/sites/bean-house/members/', {'q': 'biju'}).json()
        self.assertEqual([m['name'] for m in found], ['Biju'])
        found = self.client.get('/api/loyalty/sites/bean-house/members/', {'q': '12345'}).json()
        self.assertEqual([m['name'] for m in found], ['Asha'])
