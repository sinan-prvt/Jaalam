"""Regression tests for the security review: each test is an attack that must keep failing."""
from unittest import mock

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import Client, TestCase, override_settings

from users.models import Notification
from websites.models import PhysicalOrder, Website, WebsiteContent

User = get_user_model()


class SecurityTests(TestCase):
    def setUp(self):
        cache.clear()
        self.alice = User.objects.create_user(username='alice', email='alice@example.com', password='Str0ng-pass!')
        self.bob = User.objects.create_user(username='bob', email='bob@example.com', password='Str0ng-pass!')
        self.admin = User.objects.create_superuser(username='boss', email='boss@example.com', password='Str0ng-pass!')
        self.site = Website.objects.create(user=self.alice, slug='alice-cafe', business_type='Cafe', published=True)
        WebsiteContent.objects.create(website=self.site)
        self.client.force_login(self.alice)

    def as_user(self, user):
        c = Client()
        c.force_login(user)
        return c

    # --- Accounts ------------------------------------------------------------------------

    def test_cannot_make_yourself_admin_or_change_email_or_password(self):
        res = self.client.patch('/api/users/me/', {
            'is_superuser': True, 'membership': 'PREMIUM', 'role': 'AGENT', 'email': 'bob@example.com',
            'password': 'hacked-123', 'first_name': 'Al',
        }, content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.alice.refresh_from_db()
        self.assertFalse(self.alice.is_superuser)
        self.assertEqual(self.alice.membership, 'TEST')
        self.assertEqual(self.alice.email, 'alice@example.com')
        self.assertTrue(self.alice.check_password('Str0ng-pass!'))
        self.assertEqual(self.alice.first_name, 'Al')  # normal fields still save

    def test_cannot_read_or_edit_other_accounts(self):
        self.assertEqual(self.client.get(f'/api/users/{self.bob.id}/').status_code, 404)
        self.assertEqual(self.client.patch(f'/api/users/{self.bob.id}/', {'first_name': 'x'}, content_type='application/json').status_code, 404)
        self.assertEqual(self.client.get('/api/users/').status_code, 403)
        self.assertEqual(self.client.post(f'/api/users/{self.bob.id}/set_plan/', {'plan': 'PREMIUM'}, content_type='application/json').status_code, 403)
        self.assertEqual(self.client.post(f'/api/users/{self.alice.id}/toggle_role/').status_code, 403)

    def test_open_password_signup_is_closed(self):
        res = Client().post('/api/users/register/', {'username': 'eve', 'email': 'victim@gmail.com', 'password': 'Str0ng-pass!'},
                            content_type='application/json')
        self.assertEqual(res.status_code, 401)
        self.assertFalse(User.objects.filter(username='eve').exists())
        res = self.client.post('/api/users/register/', {'username': 'eve', 'email': 'victim@gmail.com', 'password': 'Str0ng-pass!'},
                               content_type='application/json')
        self.assertEqual(res.status_code, 403)  # nor for a normal logged-in user

    # --- Google sign-in ------------------------------------------------------------------

    def google(self, **claims):
        info = {'email': 'carol@gmail.com', 'email_verified': True, **claims}
        with mock.patch('users.views.id_token.verify_oauth2_token', return_value=info) as verify:
            res = Client().post('/api/users/google_login/', {'credential': 'tok'}, content_type='application/json')
        return res, verify

    @override_settings(GOOGLE_CLIENT_ID='our-client-id')
    def test_google_token_must_be_for_this_app(self):
        _, verify = self.google()
        self.assertEqual(verify.call_args.kwargs['audience'], 'our-client-id')

    def test_google_needs_a_verified_email(self):
        res, _ = self.google(email_verified=False)
        self.assertEqual(res.status_code, 400)

    def test_google_new_user_gets_a_free_username(self):
        User.objects.create_user(username='carol', email='other@example.com', password='x')
        res, _ = self.google()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['username'], 'carol2')
        self.assertFalse(User.objects.get(username='carol2').has_usable_password())

    def test_google_refuses_blocked_accounts(self):
        self.bob.is_active = False
        self.bob.save()
        res, _ = self.google(email='bob@example.com')
        self.assertEqual(res.status_code, 403)

    def test_google_disables_a_password_someone_else_may_have_set(self):
        # Someone typed bob's email into an account with a password; Google proves the real owner
        res, _ = self.google(email='BOB@example.com')
        self.assertEqual(res.status_code, 200)
        self.bob.refresh_from_db()
        self.assertTrue(self.bob.email_verified)
        self.assertFalse(self.bob.has_usable_password())

    # --- Notifications -------------------------------------------------------------------

    def test_users_cannot_message_other_users(self):
        res = self.client.post('/api/users/notifications/', {'user': self.bob.id, 'title': 'Admin: verify your card', 'message': 'http://evil'},
                               content_type='application/json')
        self.assertEqual(res.status_code, 201)
        self.assertFalse(Notification.objects.filter(user=self.bob).exists())
        self.assertTrue(Notification.objects.filter(user=self.alice, title='Admin: verify your card').exists())  # own inbox only

        mine = Notification.objects.get(user=self.alice)
        self.client.patch(f'/api/users/notifications/{mine.id}/', {'user': self.bob.id}, content_type='application/json')
        mine.refresh_from_db()
        self.assertEqual(mine.user, self.alice)

        # Admins can write to anyone
        self.as_user(self.admin).post('/api/users/notifications/', {'user': self.bob.id, 'title': 'Hi', 'message': 'From admin'},
                                      content_type='application/json')
        self.assertTrue(Notification.objects.filter(user=self.bob, title='Hi').exists())

    def test_cannot_read_other_peoples_notifications(self):
        theirs = Notification.objects.create(user=self.bob, title='Private', message='x')
        self.assertEqual(self.client.get(f'/api/users/notifications/{theirs.id}/').status_code, 404)
        self.assertEqual(self.client.get('/api/users/notifications/', {'all': 'true'}).json(), [])

    def test_admin_support_inbox_shows_tickets_not_private_notifications(self):
        Notification.objects.create(user=self.bob, title='New enquiry from Ravi', message='9847012345', notification_type='new_lead')
        self.as_user(self.bob).post('/api/users/notifications/', {'title': 'Help', 'message': 'My site is down'}, content_type='application/json')
        titles = [n['title'] for n in self.as_user(self.admin).get('/api/users/notifications/', {'all': 'true'}).json()]
        self.assertEqual(titles, ['Help'])

    def test_anonymous_requests_get_401_so_the_app_logs_out(self):
        self.assertEqual(Client().get('/api/users/me/').status_code, 401)
        self.assertEqual(self.client.post(f'/api/users/{self.bob.id}/toggle_block/').status_code, 403)  # logged in, not allowed

    # --- Sticker orders ------------------------------------------------------------------

    def test_cannot_mark_your_own_order_paid(self):
        res = self.client.post('/api/websites/physical-orders/', {
            'website': self.site.id, 'name': 'Al', 'phone': '9847012345', 'email': 'a@example.com', 'address': 'Kochi',
            'payment_status': 'PAID', 'status': 'DELIVERED',
        }, content_type='application/json')
        self.assertEqual(res.status_code, 201)
        order = PhysicalOrder.objects.get()
        self.assertEqual((order.payment_status, order.status), ('PENDING', 'PENDING'))
        self.client.patch(f'/api/websites/physical-orders/{order.id}/', {'payment_status': 'PAID'}, content_type='application/json')
        order.refresh_from_db()
        self.assertEqual(order.payment_status, 'PENDING')

    def test_cannot_order_for_someone_elses_site(self):
        bobs = Website.objects.create(user=self.bob, slug='bob-shop', business_type='Cafe')
        res = self.client.post('/api/websites/physical-orders/', {
            'website': bobs.id, 'name': 'Al', 'phone': '1', 'email': 'a@example.com', 'address': 'x',
        }, content_type='application/json')
        self.assertEqual(res.status_code, 400)

    # --- Websites ------------------------------------------------------------------------

    def test_strangers_cannot_touch_a_website(self):
        bob = self.as_user(self.bob)
        self.assertEqual(bob.get('/api/websites/alice-cafe/').status_code, 404)
        self.assertEqual(bob.patch('/api/websites/alice-cafe/', {'theme': 'X'}, content_type='application/json').status_code, 404)
        self.assertEqual(bob.put('/api/websites/alice-cafe/content/', {'hero_title': 'Hacked'}, content_type='application/json').status_code, 404)
        self.assertEqual(bob.delete('/api/websites/alice-cafe/').status_code, 404)
        self.assertEqual(bob.post('/api/websites/alice-cafe/toggle_block/').status_code, 403)  # admins only
        self.site.refresh_from_db()
        self.assertFalse(self.site.is_blocked)
        self.assertNotEqual(self.site.theme, 'X')
        self.assertNotEqual(WebsiteContent.objects.get(website=self.site).hero_title, 'Hacked')
        self.assertTrue(Website.objects.filter(pk=self.site.pk).exists())

    def test_owner_cannot_unblock_a_suspended_site(self):
        Website.objects.filter(pk=self.site.pk).update(is_blocked=True)
        self.client.patch('/api/websites/alice-cafe/', {'is_blocked': False}, content_type='application/json')
        self.site.refresh_from_db()
        self.assertTrue(self.site.is_blocked)

    def test_client_can_save_content_of_assigned_site(self):
        client_user = User.objects.create_user(username='shop', email='', password='x', role='CLIENT', agent=self.alice)
        Website.objects.filter(pk=self.site.pk).update(client=client_user)
        res = self.as_user(client_user).put('/api/websites/alice-cafe/content/', {'hero_title': 'Fresh coffee'}, content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(WebsiteContent.objects.get(website=self.site).hero_title, 'Fresh coffee')

    def test_uploads_must_be_real_images(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        fake = SimpleUploadedFile('evil.png', b'<script>alert(1)</script>', content_type='image/png')
        self.assertEqual(self.client.post('/api/websites/upload/', {'image': fake}).status_code, 400)
        html = SimpleUploadedFile('page.html', b'<h1>x</h1>', content_type='text/html')
        self.assertEqual(self.client.post('/api/websites/upload/', {'image': html}).status_code, 400)

    def test_share_preview_ignores_forged_hosts(self):
        res = Client().get('/api/websites/share/alice-cafe/', HTTP_X_FORWARDED_HOST='evil.example')
        self.assertNotIn(b'evil.example', res.content)

    # --- Anonymous visitors --------------------------------------------------------------

    def test_anonymous_gets_nothing_private(self):
        anon = Client()
        for url in ['/api/websites/', '/api/customers/', '/api/billing/invoices/', '/api/users/me/', '/api/users/notifications/',
                    '/api/loyalty/sites/', '/api/users/clients/', '/api/marketing/poster-drafts/']:
            self.assertIn(anon.get(url).status_code, (401, 403), url)
        self.assertEqual(anon.get('/api/users/system-settings/').status_code, 200)  # maintenance flag is public
        self.assertEqual(anon.get('/api/websites/alice-cafe/public/').status_code, 200)
