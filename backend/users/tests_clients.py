from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import Client, TestCase
from django.utils import timezone

from users.models import Notification
from websites.models import Website, WebsiteContent

User = get_user_model()


class ClientAccountTests(TestCase):
    """An agency's client logins: creating, editing, deleting, and what a client may do."""

    def setUp(self):
        cache.clear()
        self.agency = User.objects.create_user(username='agency', email='a@example.com', password='x', role='AGENT',
                                               membership='BUSINESS', plan_expires_at=timezone.now() + timedelta(days=30))
        self.site = Website.objects.create(user=self.agency, slug='spice-route', business_type='Restaurant', published=True)
        WebsiteContent.objects.create(website=self.site)
        self.client.force_login(self.agency)

    def create(self, **body):
        data = {'username': 'cafeowner', 'password': 'secret12', 'email': 'owner@example.com', **body}
        return self.client.post('/api/users/clients/', data, content_type='application/json')

    def make_client(self):
        res = self.create()
        client = User.objects.get(pk=res.json()['id'])
        self.client.post(f'/api/websites/{self.site.slug}/assign_client/', {'client_id': client.id}, content_type='application/json')
        browser = Client()
        browser.force_login(client)
        return client, browser

    def test_create_validates_input(self):
        self.assertEqual(self.create(username='cafe owner').status_code, 400)  # space
        self.assertEqual(self.create(password='123').json()['error'], 'Password must be at least 6 characters.')
        self.assertEqual(self.create(email='not-an-email').status_code, 400)
        res = self.create(username='  CafeOwner  ', email='')
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.json()['username'], 'CafeOwner')
        created = User.objects.get(username='CafeOwner')
        self.assertEqual((created.role, created.agent), ('CLIENT', self.agency))
        self.assertEqual(self.create(username='cafeowner').json()['error'], 'Username already exists')  # any case
        self.assertEqual(len(self.client.get('/api/users/clients/').json()), 1)

    def test_choose_websites_when_creating_and_editing(self):
        second = Website.objects.create(user=self.agency, slug='second-shop', business_type='Cafe', published=True)
        other = User.objects.create_user(username='other', email='o@example.com', password='x', role='AGENT')
        Website.objects.create(user=other, slug='not-mine', business_type='Cafe')

        self.assertEqual(self.create(websites=['not-mine']).status_code, 400)  # someone else's site
        self.assertFalse(User.objects.filter(username='cafeowner').exists())

        res = self.create(websites=['spice-route'])
        self.assertEqual(res.status_code, 201)
        self.assertEqual([w['slug'] for w in res.json()['websites']], ['spice-route'])
        client = User.objects.get(username='cafeowner')
        self.assertTrue(client.has_completed_onboarding)

        url = f'/api/users/{client.id}/manage_client/'
        res = self.client.put(url, {'websites': ['second-shop']}, content_type='application/json')
        self.assertEqual([w['slug'] for w in res.json()['websites']], ['second-shop'])
        self.site.refresh_from_db()
        second.refresh_from_db()
        self.assertEqual((self.site.client_id, second.client_id), (None, client.id))
        self.assertEqual(self.client.put(url, {'websites': ['not-mine']}, content_type='application/json').status_code, 400)
        self.client.put(url, {'websites': []}, content_type='application/json')
        second.refresh_from_db()
        self.assertIsNone(second.client_id)

    def test_free_plan_cannot_create_clients(self):
        self.agency.membership, self.agency.plan_expires_at = 'TEST', None
        self.agency.save()
        self.assertEqual(self.create().status_code, 403)

    def test_edit_and_delete_client(self):
        client, _ = self.make_client()
        listed = self.client.get('/api/users/clients/').json()
        self.assertEqual(listed[0]['websites'], [{'slug': 'spice-route', 'name': 'spice-route'}])
        url = f'/api/users/{client.id}/manage_client/'
        self.assertEqual(self.client.put(url, {'username': 'bad name'}, content_type='application/json').status_code, 400)
        self.assertEqual(self.client.put(url, {'password': '12'}, content_type='application/json').status_code, 400)
        res = self.client.put(url, {'username': 'cafe.owner', 'email': '', 'password': ''}, content_type='application/json')
        self.assertEqual(res.status_code, 200)
        client.refresh_from_db()
        self.assertEqual(client.username, 'cafe.owner')
        self.assertTrue(client.check_password('secret12'))  # blank password keeps the old one

        # Another agency can't touch it
        other = User.objects.create_user(username='other', email='o@example.com', password='x', role='AGENT')
        stranger = Client()
        stranger.force_login(other)
        self.assertEqual(stranger.delete(url).status_code, 404)

        self.assertEqual(self.client.delete(url).status_code, 204)
        self.site.refresh_from_db()
        self.assertIsNone(self.site.client)  # the website stays with the agency
        self.assertTrue(Website.objects.filter(slug='spice-route').exists())

    def test_client_cannot_delete_create_or_take_over_sites(self):
        client, browser = self.make_client()
        self.assertEqual([w['slug'] for w in browser.get('/api/websites/').json()], ['spice-route'])

        self.assertEqual(browser.delete('/api/websites/spice-route/').status_code, 403)
        self.assertTrue(Website.objects.filter(slug='spice-route').exists())
        res = browser.post('/api/websites/', {'slug': 'my-own', 'business_type': 'Cafe', 'theme': 'Modern'}, content_type='application/json')
        self.assertEqual(res.status_code, 403)

        # Editing works, but not the protected fields
        res = browser.patch('/api/websites/spice-route/', {'is_blocked': True, 'visitors_count': 9999, 'client': None, 'theme': 'Classic'},
                            content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.site.refresh_from_db()
        self.assertEqual((self.site.is_blocked, self.site.visitors_count, self.site.client_id, self.site.theme),
                         (False, 0, client.id, 'Classic'))

        # Assigning clients is the agency's job
        self.assertEqual(browser.post('/api/websites/spice-route/assign_client/', {'client_id': None},
                                      content_type='application/json').status_code, 403)

    def test_client_sees_the_agency_plan(self):
        client, browser = self.make_client()
        plan = browser.get('/api/users/me/').json()['plan']
        self.assertEqual(plan['name'], 'Business')
        self.assertTrue(plan['via_agency'])
        self.assertIn('invoices', plan['features'])
        self.assertIsNone(plan['expires_at'])

    def test_client_can_preview_its_unpublished_site(self):
        _, browser = self.make_client()
        Website.objects.filter(pk=self.site.pk).update(published=False)
        self.assertEqual(browser.get('/api/websites/spice-route/public/').status_code, 200)
        self.assertEqual(Client().get('/api/websites/spice-route/public/').status_code, 403)

    def test_new_enquiry_notifies_agency_and_client(self):
        client, _ = self.make_client()
        Client().post('/api/customers/lead/', {'website': self.site.id, 'name': 'Ravi', 'phone': '9847012345', 'message': 'Table for 4?'},
                      content_type='application/json')
        self.assertTrue(Notification.objects.filter(user=self.agency, notification_type='new_lead').exists())
        self.assertTrue(Notification.objects.filter(user=client, notification_type='new_lead').exists())
