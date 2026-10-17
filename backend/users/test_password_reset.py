import re

from django.contrib.auth import get_user_model
from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings

User = get_user_model()


@override_settings(FRONTEND_URL='https://jaalam.app')
class PasswordLoginAndResetTests(TestCase):
    def setUp(self):
        cache.clear()  # login/reset rate limits live in the cache
        self.user = User.objects.create_user(username='client1', email='client@example.com', password='Old-pass-123')

    def request_reset(self, email='client@example.com'):
        return self.client.post('/api/users/password_reset/', {'email': email}, content_type='application/json',
                                HTTP_X_FORWARDED_HOST='jaalam.app', HTTP_X_FORWARDED_PROTO='https')

    def test_password_login(self):
        response = self.client.post('/api/users/login/', {'username': 'client1', 'password': 'Old-pass-123'}, content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_full_reset_flow(self):
        self.assertEqual(self.request_reset().status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        link = re.search(r'https://jaalam\.app/reset-password\?uid=(\S+)&token=(\S+)', mail.outbox[0].body)
        self.assertIsNotNone(link, mail.outbox[0].body)
        uid, token = link.groups()
        response = self.client.post('/api/users/password_reset_confirm/', {'uid': uid, 'token': token, 'new_password': 'New-pass-456!'}, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('New-pass-456!'))
        # The link works only once
        again = self.client.post('/api/users/password_reset_confirm/', {'uid': uid, 'token': token, 'new_password': 'Other-pass-789!'}, content_type='application/json')
        self.assertEqual(again.status_code, 400)

    def test_unknown_email_gives_same_answer_and_sends_nothing(self):
        known, unknown = self.request_reset(), self.request_reset('nobody@example.com')
        self.assertEqual(known.json(), unknown.json())
        self.assertEqual(len(mail.outbox), 1)

    def test_weak_password_and_bad_token_rejected(self):
        self.request_reset()
        uid, token = re.search(r'uid=(\S+)&token=(\S+)', mail.outbox[0].body).groups()
        weak = self.client.post('/api/users/password_reset_confirm/', {'uid': uid, 'token': token, 'new_password': '123'}, content_type='application/json')
        self.assertEqual(weak.status_code, 400)
        bad = self.client.post('/api/users/password_reset_confirm/', {'uid': uid, 'token': 'nope', 'new_password': 'New-pass-456!'}, content_type='application/json')
        self.assertEqual(bad.status_code, 400)

    def test_forged_host_headers_do_not_change_the_link(self):
        self.client.post('/api/users/password_reset/', {'email': 'client@example.com'}, content_type='application/json',
                         HTTP_HOST='evil.example', HTTP_X_FORWARDED_HOST='evil.example', HTTP_ORIGIN='https://evil.example')
        self.assertIn('https://jaalam.app/reset-password', mail.outbox[0].body)
        self.assertNotIn('evil.example', mail.outbox[0].body)

    @override_settings(FRONTEND_URL='', DEBUG=False)
    def test_no_link_without_frontend_url_in_production(self):
        self.request_reset()
        self.assertEqual(len(mail.outbox), 0)

    def test_reset_requests_are_rate_limited(self):
        codes = [self.request_reset().status_code for _ in range(6)]
        self.assertEqual(codes[-1], 429)
