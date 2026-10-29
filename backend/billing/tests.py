from datetime import date, timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase, override_settings
from django.utils import timezone

from websites.models import Website
from .gst import financial_year, gstin_error
from .models import BusinessProfile, Invoice

User = get_user_model()


class GstinTests(TestCase):
    def test_valid_and_invalid(self):
        self.assertIsNone(gstin_error('27AAPFU0939F1ZV'))
        self.assertIn('check digit', gstin_error('27AAPFU0939F1ZX'))
        self.assertIn('state code', gstin_error('99AAPFU0939F1ZV'))


class InvoiceTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username='shop', email='shop@example.com', password='x',
                                              membership='STARTER', plan_expires_at=timezone.now() + timedelta(days=30))
        self.site = Website.objects.create(user=self.owner, slug='spice-route', business_type='Restaurant')
        BusinessProfile.objects.create(user=self.owner, legal_name='Spice Route LLP', gstin='27AAPFU0939F1ZV',
                                       state_code='27', upi_id='spice@upi', address='Mumbai')
        self.client.force_login(self.owner)

    def create(self, **extra):
        body = {
            'website': self.site.id, 'customer_name': 'Ravi', 'gst_percentage': '18',
            'items': [{'description': 'Catering', 'hsn_sac': '996334', 'quantity': 2, 'price': '500.00'},
                      {'description': 'Delivery', 'quantity': 1, 'price': '100.00', 'gst_rate': '5'}],
            # Totals sent by a client are ignored:
            'subtotal': '1', 'gst_amount': '1', 'total_amount': '1',
            **extra,
        }
        response = self.client.post('/api/billing/invoices/', body, content_type='application/json')
        self.assertEqual(response.status_code, 201, response.content)
        return response.json()

    def test_server_computes_intra_state_cgst_sgst(self):
        inv = self.create()  # place of supply defaults to the seller's state (27)
        self.assertEqual(inv['subtotal'], '1100.00')
        self.assertEqual(inv['gst_amount'], '185.00')  # 18% of 1000 + 5% of 100
        self.assertEqual((inv['tax_type'], inv['cgst_amount'], inv['sgst_amount'], inv['igst_amount']), ('INTRA', '92.50', '92.50', '0.00'))
        self.assertEqual(inv['total_amount'], '1285.00')
        self.assertEqual(inv['seller_gstin'], '27AAPFU0939F1ZV')

    def test_other_state_customer_gets_igst(self):
        inv = self.create(customer_gstin='29AAGCB7383J1Z4')  # Karnataka customer
        self.assertEqual(inv['place_of_supply'], '29')
        self.assertEqual((inv['tax_type'], inv['igst_amount'], inv['cgst_amount']), ('INTER', '185.00', '0.00'))

    def test_sequential_numbers_per_financial_year(self):
        a, b = self.create(), self.create()
        fy = financial_year(timezone.localdate())
        self.assertEqual(a['invoice_number'], f'INV/{fy}/0001')
        self.assertEqual(b['invoice_number'], f'INV/{fy}/0002')

    def test_issue_date_sets_financial_year(self):
        inv = self.create(issue_date='2027-03-31', due_date='2027-04-15')
        self.assertEqual((inv['issue_date'], inv['financial_year']), ('2027-03-31', '2026-27'))
        self.assertEqual(self.create(issue_date='2027-04-01')['invoice_number'], 'INV/2027-28/0001')

    def test_cannot_invoice_someone_elses_site(self):
        other = User.objects.create_user(username='o', email='o@example.com', password='x',
                                         membership='STARTER', plan_expires_at=timezone.now() + timedelta(days=30))
        self.client.force_login(other)
        response = self.client.post('/api/billing/invoices/', {'website': self.site.id, 'customer_name': 'X', 'items': []}, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_invalid_customer_gstin_rejected(self):
        response = self.client.post('/api/billing/invoices/', {'website': self.site.id, 'customer_name': 'X', 'customer_gstin': '27AAPFU0939F1ZX', 'items': []}, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('customer_gstin', response.json())

    def test_walk_in_sale_needs_no_customer_name(self):
        self.assertEqual(self.create(customer_name='')['customer_name'], '')

    def test_invoice_design_defaults_to_last_used(self):
        self.assertEqual(self.create()['theme'], 'classic')
        self.assertEqual(self.create(theme='elegant')['theme'], 'elegant')
        self.assertEqual(self.create()['theme'], 'elegant')  # remembered for the next invoice
        invoice = self.create()
        response = self.client.patch(f"/api/billing/invoices/{invoice['id']}/", {'theme': 'receipt'}, content_type='application/json')
        self.assertEqual(response.json()['theme'], 'receipt')
        self.assertEqual(response.json()['total_amount'], invoice['total_amount'])  # totals untouched
        self.assertEqual(self.create()['theme'], 'receipt')
        response = self.client.patch(f"/api/billing/invoices/{invoice['id']}/", {'theme': 'nope'}, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_invalid_customer_phone_rejected(self):
        response = self.client.post('/api/billing/invoices/', {'website': self.site.id, 'customer_name': 'X', 'customer_phone': 'xyz', 'items': []}, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('customer_phone', response.json())
        self.assertEqual(self.create(customer_phone='+91 98470 12345')['customer_phone'], '+91 98470 12345')

    def test_part_payments_then_paid(self):
        inv = self.create()
        url = f"/api/billing/invoices/{inv['id']}/record_payment/"
        half = self.client.post(url, {'amount': '600'}, content_type='application/json').json()
        self.assertEqual((half['display_status'], half['balance_due']), ('PARTIALLY_PAID', '685.00'))
        done = self.client.post(url, {'amount': '685'}, content_type='application/json').json()
        self.assertEqual(done['status'], 'PAID')

    def test_overdue_status(self):
        inv = self.create(due_date=str(date.today() - timedelta(days=1)))
        self.assertEqual(inv['display_status'], 'OVERDUE')

    def test_public_link_shows_invoice_without_internal_ids(self):
        inv = self.create()
        self.client.logout()
        data = self.client.get(f"/api/billing/public/{inv['public_token']}/").json()
        self.assertEqual(data['invoice_number'], inv['invoice_number'])
        self.assertEqual(data['seller_upi'], 'spice@upi')
        self.assertNotIn('website', data)
        self.assertNotIn('owner', data)

    def test_profile_edit_does_not_change_issued_invoice(self):
        inv = self.create()
        self.client.patch('/api/billing/invoices/profile/', {'legal_name': 'New Name'}, content_type='application/json')
        self.assertEqual(Invoice.objects.get(pk=inv['id']).seller_name, 'Spice Route LLP')

    def test_profile_rejects_bad_gstin_and_state_mismatch(self):
        bad = self.client.patch('/api/billing/invoices/profile/', {'gstin': '27AAPFU0939F1ZX'}, content_type='application/json')
        self.assertEqual(bad.status_code, 400)
        mismatch = self.client.patch('/api/billing/invoices/profile/', {'gstin': '27AAPFU0939F1ZV', 'state_code': '32'}, content_type='application/json')
        self.assertEqual(mismatch.status_code, 400)

    @override_settings(FRONTEND_URL='https://jaalam.app')
    def test_send_email(self):
        inv = self.create(customer_email='ravi@example.com')
        self.assertEqual(self.client.post(f"/api/billing/invoices/{inv['id']}/send_email/").status_code, 200)
        self.assertIn(f"https://jaalam.app/invoice/{inv['public_token']}", mail.outbox[0].body)

    def test_free_plan_cannot_create(self):
        self.owner.membership, self.owner.plan_expires_at = 'TEST', None
        self.owner.save()
        response = self.client.post('/api/billing/invoices/', {'website': self.site.id, 'customer_name': 'X', 'items': []}, content_type='application/json')
        self.assertEqual(response.status_code, 403)


class PosAndReportTests(TestCase):
    """Saved products (POS billing), the right seller for client shops, and the monthly report."""

    def setUp(self):
        self.agency = User.objects.create_user(username='agency', email='a@example.com', password='x',
                                               membership='BUSINESS', plan_expires_at=timezone.now() + timedelta(days=30))
        self.shop_login = User.objects.create_user(username='shopowner', email='s@example.com', password='x', role='CLIENT', agent=self.agency)
        self.site = Website.objects.create(user=self.agency, slug='resto', business_type='Restaurant', client=self.shop_login)
        self.own_site = Website.objects.create(user=self.agency, slug='agency-own', business_type='Cafe')
        self.client.force_login(self.shop_login)

    def test_client_shop_is_the_seller_with_its_own_numbers(self):
        self.client.patch(f'/api/billing/invoices/profile/?website={self.site.id}', {'legal_name': 'Resto', 'invoice_prefix': 'RST'},
                          content_type='application/json')
        res = self.client.post('/api/billing/invoices/', {'website': self.site.id, 'customer_name': 'Ravi',
                                                          'items': [{'description': 'Meals', 'quantity': 2, 'price': '150'}]},
                               content_type='application/json')
        self.assertEqual(res.status_code, 201, res.content)
        self.assertEqual(res.json()['seller_name'], 'Resto')
        self.assertTrue(res.json()['invoice_number'].startswith('RST/'))
        # The agency editing that shop sees and edits the same details
        agency = self.client_class()
        agency.force_login(self.agency)
        self.assertEqual(agency.get(f'/api/billing/invoices/profile/?website={self.site.id}').json()['legal_name'], 'Resto')
        self.assertEqual(agency.get('/api/billing/invoices/profile/').json()['legal_name'], '')  # its own, separate

    def test_products_per_shop(self):
        res = self.client.post(f'/api/billing/products/?website={self.site.id}', {'name': 'Biryani', 'price': '180', 'gst_rate': '5'},
                               content_type='application/json')
        self.assertEqual(res.status_code, 201, res.content)
        self.assertEqual(self.client.post('/api/billing/products/', {'name': ' ', 'price': '-1'}, content_type='application/json').status_code, 400)
        self.assertEqual([p['name'] for p in self.client.get(f'/api/billing/products/?website={self.site.id}').json()], ['Biryani'])

        agency = self.client_class()
        agency.force_login(self.agency)
        self.assertEqual(len(agency.get(f'/api/billing/products/?website={self.site.id}').json()), 1)  # agency manages the shop
        self.assertEqual(agency.get(f'/api/billing/products/?website={self.own_site.id}').json(), [])  # different seller

        stranger = User.objects.create_user(username='x', email='x@example.com', password='x')
        other = self.client_class()
        other.force_login(stranger)
        self.assertEqual(other.get(f'/api/billing/products/?website={self.site.id}').status_code, 404)
        pid = res.json()['id']
        self.assertEqual(other.delete(f'/api/billing/products/{pid}/').status_code, 404)
        self.assertEqual(self.client.patch(f'/api/billing/products/{pid}/', {'price': '200'}, content_type='application/json').json()['price'], '200.00')

    def test_monthly_report_totals(self):
        def make(day, price, status=None):
            res = self.client.post('/api/billing/invoices/', {
                'website': self.site.id, 'customer_name': 'C', 'issue_date': day, 'gst_percentage': '0',
                'items': [{'description': 'Meals', 'quantity': 1, 'price': price}]}, content_type='application/json')
            if status:
                self.client.patch(f"/api/billing/invoices/{res.json()['id']}/", {'status': status}, content_type='application/json')
            return res.json()
        a = make('2026-10-03', '100')
        make('2026-10-03', '50')
        make('2026-10-20', '200', status='CANCELLED')
        make('2026-11-01', '999')  # next month
        self.client.post(f"/api/billing/invoices/{a['id']}/record_payment/", {'amount': '100'}, content_type='application/json')

        rep = self.client.get(f'/api/billing/invoices/report/?month=2026-10&website={self.site.id}').json()
        self.assertEqual(rep['label'], 'October 2026')
        self.assertEqual(len(rep['invoices']), 3)  # cancelled is listed...
        t = rep['totals']
        self.assertEqual((t['count'], t['cancelled'], t['total'], t['received'], t['due']), (2, 1, '150.00', '100.00', '50.00'))  # ...not counted
        self.assertEqual(rep['by_day'], [{'date': '2026-10-03', 'count': 2, 'total': '150.00'}])
        self.assertEqual(rep['top_items'][0]['quantity'], 2)
        self.assertEqual(self.client.get('/api/billing/invoices/report/?month=oct').status_code, 400)
