from datetime import timedelta
from io import StringIO

from django.contrib.auth import get_user_model
from django.core import mail
from django.core.cache import cache
from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone

from users.models import Notification
from websites.models import Website
from .models import Activity, Customer

User = get_user_model()


class CrmTests(TestCase):
    def setUp(self):
        cache.clear()  # throttle counters
        self.owner = User.objects.create_user(username='shop', email='shop@example.com', password='x')
        self.site = Website.objects.create(user=self.owner, slug='spice-route', business_type='Restaurant', published=True)
        self.other = User.objects.create_user(username='other', email='o@example.com', password='x')
        self.other_site = Website.objects.create(user=self.other, slug='other-shop', business_type='Cafe', published=True)

    def lead(self, client=None, **extra):
        body = {'website': self.site.id, 'name': 'Ravi', 'email': 'ravi@example.com', 'message': 'Table for 4?', **extra}
        return (client or self.client).post('/api/customers/lead/', body, content_type='application/json')

    def test_public_lead_only_sets_contact_fields(self):
        response = self.lead(status='COMPLETED', notes='hacked', source='REFERRAL', value='99')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), {'status': 'received'})  # nothing about the CRM leaks back
        customer = Customer.objects.get()
        self.assertEqual((customer.status, customer.source, customer.message, customer.notes, customer.value),
                         ('NEW', 'WEBSITE', 'Table for 4?', None, None))
        self.assertTrue(Notification.objects.filter(user=self.owner, notification_type='new_lead').exists())
        self.assertEqual(mail.outbox[0].to, ['ravi@example.com'])

    def test_old_contact_form_still_works(self):
        # Anonymous POST to the collection with the message in `notes`, as the old frontend sends it.
        response = self.client.post('/api/customers/', {'website': self.site.id, 'name': 'Old', 'notes': 'Hi', 'status': 'LOST'},
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual((Customer.objects.get().message, Customer.objects.get().status), ('Hi', 'NEW'))

    def test_logged_in_visitor_can_message_another_site(self):
        self.client.force_login(self.other)
        self.assertEqual(self.lead().status_code, 201)

    def test_unpublished_site_rejects_leads(self):
        Website.objects.filter(id=self.site.id).update(published=False)
        self.assertEqual(self.lead().status_code, 400)

    def test_public_form_is_rate_limited(self):
        codes = [self.lead().status_code for _ in range(21)]
        self.assertEqual(codes[-1], 429)

    def test_owner_cannot_move_lead_to_someone_elses_site(self):
        self.lead()
        customer = Customer.objects.get()
        self.client.force_login(self.owner)
        response = self.client.patch(f'/api/customers/{customer.id}/', {'website': self.other_site.id}, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.client.post('/api/customers/', {'website': self.other_site.id, 'name': 'X'}, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_other_users_cannot_see_leads(self):
        self.lead()
        self.client.force_login(self.other)
        self.assertEqual(self.client.get('/api/customers/').json(), [])

    def test_status_and_follow_up_changes_are_logged(self):
        self.lead()
        customer = Customer.objects.get()
        self.client.force_login(self.owner)
        when = (timezone.now() + timedelta(days=1)).isoformat()
        self.client.patch(f'/api/customers/{customer.id}/', {'status': 'IN_PROGRESS', 'follow_up_at': when, 'follow_up_note': 'Send menu'},
                          content_type='application/json')
        kinds = list(Activity.objects.values_list('kind', flat=True).order_by('id'))
        self.assertEqual(kinds, ['STATUS', 'FOLLOW_UP'])
        self.assertIn('New → In Progress', Activity.objects.get(kind='STATUS').text)
        self.assertIn('Send menu', Activity.objects.get(kind='FOLLOW_UP').text)

    def test_logging_a_call_marks_new_lead_contacted(self):
        self.lead()
        customer = Customer.objects.get()
        self.client.force_login(self.owner)
        response = self.client.post(f'/api/customers/{customer.id}/activities/', {'kind': 'CALL', 'text': 'Booked for Friday'},
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)
        customer.refresh_from_db()
        self.assertEqual(customer.status, 'CONTACTED')
        timeline = self.client.get(f'/api/customers/{customer.id}/activities/').json()
        self.assertEqual([a['kind'] for a in timeline], ['STATUS', 'CALL'])
        # Automatic kinds can't be faked, and an empty note is refused.
        self.assertEqual(self.client.post(f'/api/customers/{customer.id}/activities/', {'kind': 'STATUS', 'text': 'x'},
                                          content_type='application/json').status_code, 400)
        self.assertEqual(self.client.post(f'/api/customers/{customer.id}/activities/', {'kind': 'NOTE', 'text': ' '},
                                          content_type='application/json').status_code, 400)

    def test_follow_up_reminders_sent_once(self):
        self.lead()
        customer = Customer.objects.get()
        Customer.objects.filter(id=customer.id).update(follow_up_at=timezone.now() - timedelta(hours=1), follow_up_note='Call back')
        Customer.objects.create(website=self.site, name='Done', status='COMPLETED', follow_up_at=timezone.now())
        Customer.objects.create(website=self.site, name='Later', follow_up_at=timezone.now() + timedelta(days=3))
        mail.outbox.clear()
        call_command('send_follow_up_reminders', stdout=StringIO())
        note = Notification.objects.get(notification_type='follow_up')
        self.assertEqual(note.title, '1 follow-up due today')
        self.assertIn('Ravi – Call back', note.message)
        self.assertEqual(mail.outbox[0].to, ['shop@example.com'])
        call_command('send_follow_up_reminders', stdout=StringIO())
        self.assertEqual(Notification.objects.filter(notification_type='follow_up').count(), 1)

        # A new date re-arms the reminder.
        self.client.force_login(self.owner)
        self.client.patch(f'/api/customers/{customer.id}/', {'follow_up_at': timezone.now().isoformat()}, content_type='application/json')
        call_command('send_follow_up_reminders', stdout=StringIO())
        self.assertEqual(Notification.objects.filter(notification_type='follow_up').count(), 2)
