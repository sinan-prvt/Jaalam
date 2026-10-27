from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from websites.models import Website, WebsiteContent


class ContentExtraFieldsTests(TestCase):
    """Editor fields without a model column must survive a save and reach the public site."""

    def setUp(self):
        self.owner = get_user_model().objects.create_user(username='owner', password='pw')
        self.site = Website.objects.create(user=self.owner, slug='spice', business_type='Restaurant', theme='Casual Eats', published=True)
        WebsiteContent.objects.create(website=self.site, settings_json={'upi_id': 'shop@okaxis'})
        self.client = APIClient()
        self.client.force_authenticate(self.owner)

    def save(self, body, method='patch'):
        return getattr(self.client, method)('/api/websites/spice/content/', body, format='json')

    def test_hero_subtitle_survives_save_and_is_public(self):
        r = self.save({'hero_title': 'Spice', 'hero_description': 'Kerala food', 'hero_text': 'Kerala food'})
        self.assertEqual(r.status_code, 200, r.content)
        self.assertEqual(r.data['hero_description'], 'Kerala food')

        public = APIClient().get('/api/websites/spice/public/').data['content']
        self.assertEqual(public['hero_description'], 'Kerala food')
        self.assertEqual(public['hero_text'], 'Kerala food')

    def test_existing_settings_are_kept(self):
        self.save({'date': '12 March 2026'})
        settings = WebsiteContent.objects.get(website=self.site).settings_json
        self.assertEqual(settings['upi_id'], 'shop@okaxis')
        self.assertEqual(settings['content_extra']['date'], '12 March 2026')

    def test_editor_round_trip_with_full_content(self):
        # Editors PUT the whole content they loaded, settings_json included
        loaded = self.save({'hero_subtitle': 'Annual fest', 'hero': {'image': 'https://x.test/a.jpg'}}).data
        loaded['hero_subtitle'] = 'Tech fest 2026'
        r = self.save(loaded, method='put')
        self.assertEqual(r.status_code, 200, r.content)
        self.assertEqual(r.data['hero_subtitle'], 'Tech fest 2026')
        self.assertEqual(r.data['hero'], {'image': 'https://x.test/a.jpg'})
        self.assertEqual(r.data['settings_json']['upi_id'], 'shop@okaxis')
