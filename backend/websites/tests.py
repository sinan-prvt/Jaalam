from django.contrib.auth import get_user_model
from django.test import TestCase

from .models import Website, WebsiteContent


class SharePreviewTests(TestCase):
    """Link-preview page served to WhatsApp/Facebook/etc. crawlers (websites/share.py)."""

    def setUp(self):
        self.user = get_user_model().objects.create_user(username='host', email='host@example.com', password='x')

    def make(self, slug, business_type, published=True, **content):
        website = Website.objects.create(user=self.user, slug=slug, business_type=business_type, published=published)
        WebsiteContent.objects.create(website=website, **content)
        return website

    def get(self, slug):
        return self.client.get(f'/api/websites/share/{slug}/', HTTP_X_FORWARDED_HOST='jaalam.app', HTTP_X_FORWARDED_PROTO='https')

    def test_wedding_card_uses_names_date_venue_and_photo(self):
        self.make('arjun-weds-diya', 'Wedding Invitation', hero_title='Arjun & Diya', settings_json={'wedding': {
            'date': '2026-12-12', 'time': '10:30 AM', 'venue': 'Bolgatty Palace', 'mainPhoto': 'https://cdn.example.com/couple.jpg',
        }})
        html = self.get('arjun-weds-diya').content.decode()
        self.assertIn('<meta property="og:title" content="Arjun &amp; Diya — Wedding Invitation">', html)
        self.assertIn('Saturday, 12 December 2026 · 10:30 AM · Bolgatty Palace', html)
        self.assertIn('content="https://cdn.example.com/couple.jpg"', html)
        self.assertIn('content="https://jaalam.app/arjun-weds-diya"', html)

    def test_unpublished_site_reveals_nothing(self):
        self.make('secret-party', 'Kids Birthday', published=False, hero_title='Private Name')
        response = self.get('secret-party')
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('Private Name', response.content.decode())

    def test_unknown_slug_gets_generic_card(self):
        response = self.get('does-not-exist')
        self.assertEqual(response.status_code, 200)
        self.assertIn('og:title" content="Jaalam"', response.content.decode())

    def test_markup_in_content_is_escaped(self):
        self.make('xss', 'Wedding Invitation', hero_title='<script>alert(1)</script>')
        html = self.get('xss').content.decode()
        self.assertNotIn('<script>alert(1)</script>', html)


class RsvpTests(TestCase):
    def setUp(self):
        from django.core.cache import cache
        cache.clear()
        User = get_user_model()
        self.owner = User.objects.create_user(username='couple', email='c@example.com', password='x')
        self.site = Website.objects.create(user=self.owner, slug='anu-weds-ravi', business_type='Wedding', published=True)

    def reply(self, **body):
        return self.client.post('/api/websites/anu-weds-ravi/rsvp/', {'name': 'Meera', 'attending': 'YES', **body},
                                content_type='application/json')

    def test_guest_reply_is_saved_and_owner_notified(self):
        from users.models import Notification
        response = self.reply(message='See you!', answers={'Dietary needs': 'Vegetarian'})
        self.assertEqual(response.status_code, 201)
        rsvp = self.site.rsvps.get()
        self.assertEqual((rsvp.name, rsvp.attending, rsvp.answers), ('Meera', 'YES', {'Dietary needs': 'Vegetarian'}))
        self.assertEqual(Notification.objects.get(user=self.owner).title, 'RSVP: Meera is attending')

    def test_logged_in_guest_needs_no_csrf_token(self):
        from django.test import Client
        guest = get_user_model().objects.create_user(username='g', password='x')
        client = Client(enforce_csrf_checks=True)
        client.force_login(guest)
        response = client.post('/api/websites/anu-weds-ravi/rsvp/', {'name': 'G', 'attending': 'NO'}, content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_validation(self):
        self.assertEqual(self.reply(name='  ').status_code, 400)
        self.assertEqual(self.reply(attending='MAYBE').status_code, 400)
        self.assertEqual(self.reply(answers={str(i): 'x' for i in range(11)}).status_code, 400)
        Website.objects.filter(id=self.site.id).update(published=False)
        self.assertEqual(self.reply().status_code, 403)

    def test_owner_sees_guest_list_others_do_not(self):
        self.reply()
        self.reply(name='Arun', attending='NO')
        self.assertEqual(self.client.get('/api/websites/anu-weds-ravi/rsvps/').status_code, 401)  # not logged in
        self.client.force_login(get_user_model().objects.create_user(username='stranger', password='x'))
        self.assertEqual(self.client.get('/api/websites/anu-weds-ravi/rsvps/').status_code, 404)
        self.client.force_login(self.owner)
        data = self.client.get('/api/websites/anu-weds-ravi/rsvps/').json()
        self.assertEqual(data['summary'], {'total': 2, 'attending': 1, 'declined': 1})
        rsvp_id = data['results'][0]['id']
        self.assertEqual(self.client.delete(f'/api/websites/anu-weds-ravi/rsvps/{rsvp_id}/').status_code, 204)
        self.assertEqual(self.site.rsvps.count(), 1)

    def test_wish_counter_moves_one_at_a_time(self):
        response = self.client.post('/api/websites/anu-weds-ravi/wish/', {'increment': 100000}, content_type='application/json')
        self.assertEqual(response.json()['wish_count'], 49)


class AnalyticsTests(TestCase):
    PHONE = 'Mozilla/5.0 (Linux; Android 14) Mobile Safari/537.36'
    COMPUTER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0'

    def setUp(self):
        User = get_user_model()
        self.owner = User.objects.create_user(username='shop', email='shop@example.com', password='x')
        self.site = Website.objects.create(user=self.owner, slug='spice', business_type='Restaurant', published=True)
        self.other = Website.objects.create(user=User.objects.create_user(username='other', password='x'),
                                            slug='other', business_type='Cafe', published=True)

    def visit(self, slug='spice', agent=COMPUTER, client=None, **params):
        return (client or self.client).get(f'/api/websites/{slug}/public/', params, HTTP_USER_AGENT=agent)

    def test_visits_counted_by_day_source_and_device(self):
        self.visit(agent=self.PHONE, ref='https://l.instagram.com/?u=x')
        self.visit(src='qr', agent=self.PHONE)
        self.visit(ref='https://www.google.com/')
        self.visit()
        self.visit(agent='Googlebot/2.1')  # bots don't count
        self.client.force_login(self.owner)
        self.visit(client=self.client)  # nor the owner previewing their site
        data = self.client.get('/api/websites/analytics/?days=7').json()
        self.assertEqual(data['totals']['visitors'], 4)
        self.assertEqual(data['totals']['today'], 4)
        self.assertEqual(data['devices'], {'mobile': 2, 'desktop': 2})
        self.assertEqual({r['source']: r['visitors'] for r in data['sources']},
                         {'instagram': 1, 'qr': 1, 'search': 1, 'direct': 1})
        self.assertEqual(len(data['daily']), 7)
        self.site.refresh_from_db()
        self.assertEqual(self.site.visitors_count, 4)

    def test_only_own_sites(self):
        self.visit('other')
        self.client.force_login(self.owner)
        data = self.client.get('/api/websites/analytics/').json()
        self.assertEqual([s['slug'] for s in data['sites']], ['spice'])
        self.assertEqual(data['totals']['visitors'], 0)
        self.assertEqual(data['days'], 30)


class SiteBackupTests(TestCase):
    """Copies of live sites in file storage, for when the API is down (websites/snapshots.py)."""

    def setUp(self):
        import tempfile
        from django.test import override_settings
        self.media = tempfile.mkdtemp()
        self.override = override_settings(MEDIA_ROOT=self.media, STORAGES={
            'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
            'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
        })
        self.override.enable()
        self.owner = get_user_model().objects.create_user(username='shop', email='shop@example.com', password='x')

    def tearDown(self):
        import shutil
        self.override.disable()
        shutil.rmtree(self.media, ignore_errors=True)

    def copy(self, name):
        import json
        import os
        path = os.path.join(self.media, 'snapshots', name)
        return json.load(open(path, encoding='utf-8')) if os.path.exists(path) else None

    def make(self, **fields):
        with self.captureOnCommitCallbacks(execute=True):
            site = Website.objects.create(user=self.owner, slug='spice', business_type='Restaurant', **fields)
            WebsiteContent.objects.create(website=site, hero_title='Spice Route')
        return site

    def test_live_site_is_copied_and_follows_edits(self):
        site = self.make(published=True)
        data = self.copy('sites/spice.json')
        self.assertEqual((data['slug'], data['content']['hero_title']), ('spice', 'Spice Route'))
        for private in ('user', 'client', 'domain_token', 'visitors_count'):
            self.assertNotIn(private, data)
        with self.captureOnCommitCallbacks(execute=True):
            site.content.hero_title = 'New Title'
            site.content.save()
        self.assertEqual(self.copy('sites/spice.json')['content']['hero_title'], 'New Title')

    def test_draft_unpublished_and_deleted_sites_have_no_copy(self):
        site = self.make(published=False)
        self.assertIsNone(self.copy('sites/spice.json'))
        with self.captureOnCommitCallbacks(execute=True):
            site.published = True
            site.save()
        self.assertIsNotNone(self.copy('sites/spice.json'))
        with self.captureOnCommitCallbacks(execute=True):
            site.published = False
            site.save()
        self.assertIsNone(self.copy('sites/spice.json'))
        with self.captureOnCommitCallbacks(execute=True):
            site.published = True
            site.save()
        with self.captureOnCommitCallbacks(execute=True):
            site.delete()
        self.assertIsNone(self.copy('sites/spice.json'))

    def test_custom_domain_and_renamed_slug(self):
        site = self.make(published=True, custom_domain='spice.example.com', domain_verified=True)
        self.assertEqual(self.copy('domains/spice.example.com.json')['slug'], 'spice')
        with self.captureOnCommitCallbacks(execute=True):
            site.slug = 'spice-route'
            site.custom_domain = None
            site.domain_verified = False
            site.save()
        self.assertIsNone(self.copy('sites/spice.json'))
        self.assertIsNone(self.copy('domains/spice.example.com.json'))
        self.assertEqual(self.copy('sites/spice-route.json')['slug'], 'spice-route')
