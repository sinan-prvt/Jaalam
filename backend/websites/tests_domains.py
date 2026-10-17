from unittest import mock

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from websites import domains
from websites.models import Website, WebsiteContent


class NormalizeDomainTests(TestCase):
    def test_strips_scheme_www_path_and_case(self):
        self.assertEqual(domains.normalize_domain('https://WWW.MyShop.com/about?x=1'), 'myshop.com')
        self.assertEqual(domains.normalize_domain(' shop.co.in. '), 'shop.co.in')

    def test_validation(self):
        self.assertIsNone(domains.validate_domain('mybakery.co.in'))
        self.assertIsNotNone(domains.validate_domain('not a domain'))
        self.assertIsNotNone(domains.validate_domain('localhost'))
        self.assertIsNotNone(domains.validate_domain('demo.jaalam.app'))


@override_settings(CUSTOM_DOMAIN_A_RECORD='76.76.21.21', CUSTOM_DOMAIN_CNAME='cname.vercel-dns.com', VERCEL_TOKEN='', VERCEL_PROJECT_ID='')
class DomainFlowTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.owner = User.objects.create_user(username='owner', password='pw')
        self.other = User.objects.create_user(username='other', password='pw')
        self.site = Website.objects.create(user=self.owner, slug='bakery', business_type='Cafe / Bakery', theme='Cozy Cafe', published=True)
        WebsiteContent.objects.create(website=self.site)
        self.client = APIClient()
        self.client.force_authenticate(self.owner)

    def _dns(self, txt=(), apex=(), www_cname=(), www_a=()):
        table = {
            ('_jaalam.mybakery.com', 'TXT'): list(txt),
            ('mybakery.com', 'A'): list(apex),
            ('www.mybakery.com', 'CNAME'): list(www_cname),
            ('www.mybakery.com', 'A'): list(www_a),
        }
        return mock.patch.object(domains, '_lookup', side_effect=lambda name, rtype: table.get((name, rtype), []))

    def test_connect_verify_and_serve(self):
        r = self.client.post('/api/websites/bakery/domain/', {'domain': 'https://www.MyBakery.com'}, format='json')
        self.assertEqual(r.status_code, 200, r.content)
        self.assertEqual(r.data['domain'], 'mybakery.com')
        self.assertFalse(r.data['verified'])
        token = Website.objects.get(pk=self.site.pk).domain_token
        self.assertEqual([rec['type'] for rec in r.data['records']], ['TXT', 'A', 'CNAME'])

        # Not served before verification
        self.assertEqual(APIClient().get('/api/websites/by-domain/', {'host': 'mybakery.com'}).status_code, 404)

        # Ownership only: still pending
        with self._dns(txt=[token]):
            r = self.client.post('/api/websites/bakery/domain/verify/')
        self.assertTrue(r.data['check']['ownership'])
        self.assertFalse(r.data['verified'])

        # Ownership + routing: verified
        with self._dns(txt=[token], apex=['76.76.21.21'], www_cname=['cname.vercel-dns.com']):
            r = self.client.post('/api/websites/bakery/domain/verify/')
        self.assertTrue(r.data['verified'], r.data)

        public = APIClient().get('/api/websites/by-domain/', {'host': 'www.mybakery.com'})
        self.assertEqual(public.status_code, 200)
        self.assertEqual(public.data['slug'], 'bakery')

    def test_cannot_set_domain_through_regular_update(self):
        self.client.patch('/api/websites/bakery/', {'custom_domain': 'hijack.com', 'domain_verified': True}, format='json')
        self.site.refresh_from_db()
        self.assertIsNone(self.site.custom_domain)
        self.assertFalse(self.site.domain_verified)

    def test_domain_taken_and_ownership(self):
        Website.objects.create(user=self.other, slug='other', business_type='Other', custom_domain='mybakery.com')
        r = self.client.post('/api/websites/bakery/domain/', {'domain': 'mybakery.com'}, format='json')
        self.assertEqual(r.status_code, 400)

        intruder = APIClient()
        intruder.force_authenticate(self.other)
        self.assertIn(intruder.post('/api/websites/bakery/domain/', {'domain': 'x.com'}, format='json').status_code, (403, 404))

    def test_disconnect(self):
        self.client.post('/api/websites/bakery/domain/', {'domain': 'mybakery.com'}, format='json')
        r = self.client.delete('/api/websites/bakery/domain/')
        self.assertIsNone(r.data['domain'])
        self.site.refresh_from_db()
        self.assertIsNone(self.site.custom_domain)
