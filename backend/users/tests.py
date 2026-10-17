import json
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase, override_settings

from websites.models import Website, WebsiteContent

User = get_user_model()


def patch_json(client, url, data, **extra):
    return client.patch(url, json.dumps(data), content_type='application/json', **extra)


class AccountSecurityTests(TestCase):
    def setUp(self):
        self.victim = User.objects.create_user(username='victim', email='victim@example.com', password='pw-12345!')
        self.attacker = User.objects.create_user(username='attacker', email='attacker@example.com', password='pw-12345!')

    def test_anonymous_cannot_read_or_edit_accounts(self):
        self.assertEqual(self.client.get(f'/api/users/{self.victim.id}/').status_code, 403)
        patch_json(self.client, f'/api/users/{self.victim.id}/', {'email': 'hacked@evil.com'})
        self.victim.refresh_from_db()
        self.assertEqual(self.victim.email, 'victim@example.com')

    def test_users_cannot_edit_other_accounts(self):
        self.client.force_login(self.attacker)
        self.assertEqual(patch_json(self.client, f'/api/users/{self.victim.id}/', {'email': 'hacked@evil.com'}).status_code, 404)

    def test_users_cannot_grant_themselves_admin_or_paid_plans(self):
        self.client.force_login(self.attacker)
        for url in (f'/api/users/{self.attacker.id}/', '/api/users/me/'):
            patch_json(self.client, url, {'is_superuser': True, 'membership': 'PREMIUM', 'role': 'AGENT'})
        self.attacker.refresh_from_db()
        self.assertFalse(self.attacker.is_superuser)
        self.assertNotEqual(self.attacker.membership, 'PREMIUM')

    def test_profile_edit_still_works_and_hashes_password(self):
        self.client.force_login(self.attacker)
        response = patch_json(self.client, '/api/users/me/', {'first_name': 'Ravi', 'password': 'new-pass-789!'})
        self.assertEqual(response.status_code, 200)
        self.attacker.refresh_from_db()
        self.assertEqual(self.attacker.first_name, 'Ravi')
        self.assertTrue(self.attacker.check_password('new-pass-789!'))

    def test_delete_account(self):
        self.client.force_login(self.attacker)
        self.assertEqual(self.client.delete('/api/users/me/').status_code, 204)
        self.assertFalse(User.objects.filter(pk=self.attacker.pk).exists())


class CsrfTests(TestCase):
    """Real browser flow with CSRF checks on (Django's test client skips them by default)."""

    def setUp(self):
        User.objects.create_user(username='owner', email='owner@example.com', password='pw-12345!')
        self.client = Client(enforce_csrf_checks=True)

    def login(self):
        response = self.client.post('/api/users/login/', {'username': 'owner', 'password': 'pw-12345!'}, content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_logged_in_write_without_token_is_rejected(self):
        self.login()
        self.assertEqual(patch_json(self.client, '/api/users/me/', {'first_name': 'X'}).status_code, 403)

    def test_logged_in_write_with_token_works(self):
        self.login()
        token = self.client.get('/api/users/csrf/').json()['csrfToken']
        self.assertEqual(patch_json(self.client, '/api/users/me/', {'first_name': 'X'}, HTTP_X_CSRFTOKEN=token).status_code, 200)

    def proxied_patch(self, origin):
        """A write as it arrives through the Vercel -> Render proxy for the jaalam.app frontend."""
        token = self.client.get('/api/users/csrf/').json()['csrfToken']
        return patch_json(
            self.client, '/api/users/me/', {'first_name': 'X'}, HTTP_X_CSRFTOKEN=token, HTTP_ORIGIN=origin,
            HTTP_HOST='jaalam-backend.onrender.com', HTTP_X_FORWARDED_HOST='jaalam.app', HTTP_X_FORWARDED_PROTO='https',
        )

    def test_custom_domain_behind_proxy_works_without_extra_settings(self):
        self.login()
        self.assertEqual(self.proxied_patch('https://jaalam.app').status_code, 200)

    def test_other_origin_rejected_even_with_token(self):
        self.login()
        self.assertEqual(self.proxied_patch('https://evil.example').status_code, 403)

    def test_wish_counter_needs_no_token(self):
        user = User.objects.get(username='owner')
        Website.objects.create(user=user, slug='a-weds-b', business_type='Wedding Invitation', published=True)
        self.login()
        self.assertEqual(self.client.post('/api/websites/a-weds-b/wish/', {'increment': 1}, content_type='application/json').status_code, 200)

    def test_other_sites_are_not_allowed_by_cors(self):
        response = self.client.get('/api/users/csrf/', HTTP_ORIGIN='https://evil.example')
        self.assertIsNone(response.get('Access-Control-Allow-Origin'))
        response = self.client.get('/api/users/csrf/', HTTP_ORIGIN='http://localhost:5173')
        self.assertEqual(response.get('Access-Control-Allow-Origin'), 'http://localhost:5173')


class WebsitePrivacyTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username='owner', email='owner@example.com', password='x')
        site = Website.objects.create(user=self.owner, slug='private-draft', business_type='Wedding Invitation', published=False)
        WebsiteContent.objects.create(website=site, hero_title='Secret Couple')

    def test_anonymous_cannot_read_site_details(self):
        response = self.client.get('/api/websites/private-draft/')
        self.assertIn(response.status_code, (401, 403))
        self.assertNotIn('Secret Couple', response.content.decode())

    def test_other_users_cannot_read_site_details(self):
        other = User.objects.create_user(username='other', email='other@example.com', password='x')
        self.client.force_login(other)
        self.assertEqual(self.client.get('/api/websites/private-draft/').status_code, 404)

    def test_owner_can_read_site_details(self):
        self.client.force_login(self.owner)
        self.assertEqual(self.client.get('/api/websites/private-draft/').status_code, 200)

    def test_unpublished_public_page_stays_hidden(self):
        self.assertEqual(self.client.get('/api/websites/private-draft/public/').status_code, 403)


@override_settings(MEDIA_ROOT=tempfile.mkdtemp())
class UploadTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='owner', email='owner@example.com', password='x')

    def upload(self, name, data, content_type):
        return self.client.post('/api/websites/upload/', {'image': SimpleUploadedFile(name, data, content_type=content_type)})

    def test_anonymous_upload_rejected(self):
        self.assertIn(self.upload('a.png', b'x', 'image/png').status_code, (401, 403))

    def test_html_and_svg_rejected(self):
        self.client.force_login(self.user)
        self.assertEqual(self.upload('evil.html', b'<script>alert(1)</script>', 'text/html').status_code, 400)
        self.assertEqual(self.upload('evil.svg', b'<svg onload="alert(1)"/>', 'image/svg+xml').status_code, 400)

    def test_fake_image_rejected(self):
        self.client.force_login(self.user)
        self.assertEqual(self.upload('evil.png', b'<script>alert(1)</script>', 'image/png').status_code, 400)

    def test_real_image_and_audio_accepted(self):
        from io import BytesIO
        from PIL import Image
        buf = BytesIO()
        Image.new('RGB', (4, 4), 'red').save(buf, format='PNG')
        self.client.force_login(self.user)
        response = self.upload('photo.png', buf.getvalue(), 'image/png')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['url'].endswith('.png'))
        self.assertEqual(self.upload('song.mp3', b'ID3' + b'\x00' * 64, 'audio/mpeg').status_code, 200)
