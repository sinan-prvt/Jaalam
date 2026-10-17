import json
from datetime import timedelta
from unittest import mock

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from websites.models import Website, WebsiteContent

from . import plans
from .models import Notification, Subscription, UsageCounter
from .subscriptions import activate_subscription, sync_plan_status

User = get_user_model()


class PlanRulesTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='u', email='u@example.com', password='x')

    def give(self, code, days=30):
        self.user.membership = code
        self.user.plan_period = 'MONTHLY'
        self.user.plan_expires_at = timezone.now() + timedelta(days=days)
        self.user.save()

    def test_free_by_default(self):
        self.assertEqual(plans.effective_plan(self.user), plans.FREE)
        self.assertEqual(plans.limit(self.user, 'websites'), 1)
        self.assertFalse(plans.has_feature(self.user, plans.INVOICES))

    def test_paid_plan_features(self):
        self.give('BUSINESS')
        self.assertTrue(plans.has_feature(self.user, plans.AI_MARKETING))
        self.assertFalse(plans.has_feature(self.user, plans.PREMIUM_TEMPLATES))
        self.assertEqual(plans.limit(self.user, 'websites'), 10)

    def test_expired_plan_keeps_features_during_grace_then_falls_back(self):
        self.give('PREMIUM', days=-1)  # expired yesterday: still in grace
        self.assertEqual(plans.effective_plan(self.user), 'PREMIUM')
        self.give('PREMIUM', days=-(plans.GRACE_DAYS + 1))
        self.assertEqual(plans.effective_plan(self.user), plans.FREE)
        self.assertTrue(plans.plan_summary(self.user)['expired'])

    def test_legacy_paid_users_keep_plan_for_life(self):
        self.user.membership = 'BUSINESS'  # bought under "pay once, lifetime" pricing
        self.user.save()
        self.assertEqual(plans.effective_plan(self.user, timezone.now() + timedelta(days=3650)), 'BUSINESS')
        self.assertEqual(plans.plan_summary(self.user)['period'], 'LIFETIME')

    def test_lifetime_user_falls_back_to_lifetime_plan_after_monthly_upgrade(self):
        self.user.lifetime_plan = 'STARTER'
        self.give('PREMIUM', days=-(plans.GRACE_DAYS + 1))  # monthly Premium on top has lapsed
        self.assertEqual(plans.effective_plan(self.user), 'STARTER')
        self.assertTrue(plans.plan_summary(self.user)['expired'])

    def test_admins_and_test_users_unrestricted(self):
        self.user.is_test_user = True
        self.assertIsNone(plans.limit(self.user, 'websites'))
        self.assertTrue(plans.has_feature(self.user, plans.PREMIUM_TEMPLATES))

    def test_renewing_same_plan_extends_from_current_expiry(self):
        self.give('STARTER', days=10)
        end = plans.new_period_end(self.user, 'STARTER', 'MONTHLY')
        self.assertAlmostEqual((end - timezone.now()).days, 40, delta=1)

    def test_upgrade_credits_unused_days(self):
        self.give('STARTER', days=30)  # 30 days of ₹199/month left
        end = plans.new_period_end(self.user, 'PREMIUM', 'MONTHLY')
        # 30 new days + 30 * 199/999 ≈ 6 days of credit
        self.assertAlmostEqual((end - timezone.now()).days, 35, delta=1)


class EnforcementTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='u', email='u@example.com', password='x', has_completed_onboarding=True)
        self.client.force_login(self.user)

    def create_site(self, slug, theme='Classic'):
        return self.client.post('/api/websites/', {'slug': slug, 'business_type': 'Wedding Invitation', 'theme': theme}, content_type='application/json')

    def test_website_limit(self):
        self.assertEqual(self.create_site('one').status_code, 201)
        response = self.create_site('two')
        self.assertEqual(response.status_code, 400)
        self.assertTrue(response.json().get('upgrade'))

    def test_premium_theme_needs_premium(self):
        self.assertEqual(self.create_site('lux', theme='Midnight Luxe').status_code, 400)
        self.assertEqual(self.create_site('classic').status_code, 201)
        response = self.client.patch('/api/websites/classic/', {'theme': 'Glassmorphism'}, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.user.membership, self.user.plan_expires_at = 'PREMIUM', timezone.now() + timedelta(days=30)
        self.user.save()
        self.assertEqual(self.client.patch('/api/websites/classic/', {'theme': 'Glassmorphism'}, content_type='application/json').status_code, 200)

    def test_invoices_need_starter(self):
        site = Website.objects.create(user=self.user, slug='s', business_type='Restaurant')
        body = {'website': site.id, 'customer_name': 'A', 'items': []}
        self.assertEqual(self.client.post('/api/billing/invoices/', body, content_type='application/json').status_code, 403)

    def test_ai_needs_business_and_respects_quota(self):
        self.assertEqual(self.client.post('/api/marketing/generate/', {}, content_type='application/json').status_code, 403)
        self.user.membership, self.user.plan_expires_at = 'BUSINESS', timezone.now() + timedelta(days=30)
        self.user.save()
        UsageCounter.objects.create(user=self.user, key='ai_generations', period=UsageCounter.this_month(), count=50)
        response = self.client.post('/api/marketing/poster/', {'prompt': 'x'}, content_type='application/json')
        self.assertEqual(response.status_code, 403)
        self.assertIn('50 AI generations', response.json()['error'])

    def test_sites_over_limit_pause_after_downgrade_and_branding_shows(self):
        self.user.membership, self.user.plan_expires_at = 'STARTER', timezone.now() + timedelta(days=30)
        self.user.save()
        for slug in ('first', 'second'):
            self.assertEqual(self.create_site(slug).status_code, 201)
            Website.objects.filter(slug=slug).update(published=True)
        self.user.plan_expires_at = timezone.now() - timedelta(days=plans.GRACE_DAYS + 1)  # lapsed -> Free (1 site)
        self.user.save()
        self.client.logout()
        first = self.client.get('/api/websites/first/public/')
        self.assertEqual(first.status_code, 200)
        self.assertTrue(first.json()['show_branding'])
        self.assertEqual(self.client.get('/api/websites/second/public/').json()['error'], 'paused')

    def test_me_includes_plan(self):
        plan = self.client.get('/api/users/me/').json()['plan']
        self.assertEqual(plan['code'], plans.FREE)
        self.assertEqual(plan['limits']['websites'], 1)
        self.assertEqual(plan['usage']['websites'], 0)

    def test_plan_fields_not_self_editable(self):
        self.client.patch('/api/users/me/', json.dumps({'plan_expires_at': '2099-01-01T00:00:00Z', 'membership': 'PREMIUM'}), content_type='application/json')
        self.user.refresh_from_db()
        self.assertIsNone(self.user.plan_expires_at)
        self.assertEqual(self.user.membership, plans.FREE)

    def test_catalog_is_public(self):
        self.client.logout()
        data = self.client.get('/api/users/subscriptions/plans/').json()
        self.assertEqual([p['code'] for p in data['plans']], plans.PLAN_ORDER)


class PaymentTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='payer', email='p@example.com', password='x')
        self.other = User.objects.create_user(username='other', email='o@example.com', password='x')

    def test_activation_sets_expiry_and_is_idempotent(self):
        sub = Subscription.objects.create(user=self.user, plan_type='BUSINESS', billing_period='YEARLY', razorpay_order_id='order_1', amount=4990)
        activate_subscription(sub, 'pay_1')
        activate_subscription(sub, 'pay_1')  # replayed: no double extension
        self.user.refresh_from_db()
        self.assertEqual(self.user.membership, 'BUSINESS')
        self.assertAlmostEqual((self.user.plan_expires_at - timezone.now()).days, 365, delta=1)

    @mock.patch('users.subscription_views.razorpay_client')
    def test_cannot_verify_someone_elses_order(self, client):
        Subscription.objects.create(user=self.user, plan_type='PREMIUM', razorpay_order_id='order_2', amount=999)
        self.client.force_login(self.other)
        response = self.client.post('/api/users/subscriptions/verify_payment/', {'razorpay_order_id': 'order_2', 'razorpay_payment_id': 'pay_2', 'razorpay_signature': 'sig'}, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.other.refresh_from_db()
        self.assertEqual(self.other.membership, plans.FREE)

    @mock.patch('users.subscription_views.razorpay_client')
    def test_verify_own_order(self, client):
        Subscription.objects.create(user=self.user, plan_type='STARTER', razorpay_order_id='order_3', amount=199)
        self.client.force_login(self.user)
        response = self.client.post('/api/users/subscriptions/verify_payment/', {'razorpay_order_id': 'order_3', 'razorpay_payment_id': 'pay_3', 'razorpay_signature': 'sig'}, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['plan']['code'], 'STARTER')


class ReminderTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='r', email='r@example.com', password='x', membership='STARTER')

    def expire_in(self, days):
        self.user.plan_expires_at = timezone.now() + timedelta(days=days)
        self.user.save()

    def titles(self):
        return list(Notification.objects.filter(user=self.user).values_list('title', flat=True))

    def test_reminders_sent_once_each(self):
        self.expire_in(6.5)
        sync_plan_status(self.user)
        sync_plan_status(self.user)
        self.assertEqual(len(self.titles()), 1)
        self.expire_in(0.5)
        sync_plan_status(self.user)
        self.assertEqual(len(self.titles()), 2)  # skipped straight to the 1-day reminder, no backlog

    def test_expired_then_downgraded_notices(self):
        self.expire_in(-1)
        sync_plan_status(self.user)
        self.expire_in(-(plans.GRACE_DAYS + 1))
        sync_plan_status(self.user)
        self.assertEqual(len(self.titles()), 2)
        self.assertIn('Starter plan expired', self.titles()[-1])


class AdminSetPlanTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(username='admin', email='a@example.com', password='x')
        self.user = User.objects.create_user(username='cust', email='c@example.com', password='x')

    def post(self, body, as_user=None):
        self.client.force_login(as_user or self.admin)
        return self.client.post(f'/api/users/{self.user.id}/set_plan/', body, content_type='application/json')

    def test_admin_grants_days_lifetime_and_free(self):
        self.assertEqual(self.post({'plan': 'BUSINESS', 'days': 30}).json()['plan']['code'], 'BUSINESS')
        data = self.post({'plan': 'PREMIUM', 'lifetime': True}).json()
        self.assertEqual(data['plan']['period'], 'LIFETIME')
        self.assertEqual(self.post({'plan': 'TEST'}).json()['plan']['code'], plans.FREE)

    def test_only_admins(self):
        self.assertEqual(self.post({'plan': 'PREMIUM', 'lifetime': True}, as_user=self.user).status_code, 403)
