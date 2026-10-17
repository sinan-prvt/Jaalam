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
