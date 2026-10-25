"""Subscription plans: the single source of truth for prices, limits and features.

Every check (backend permission, frontend upgrade prompt, Pricing page) reads from here,
via `plan_summary()` on /api/users/me/ and the catalog at /api/users/subscriptions/plans/.

Plan codes match User.membership ('TEST' is the free plan, shown as "Free").
Paid plans run for a billing period and expire; after a short grace period the account
falls back to its lifetime plan (bought under the old one-time pricing) or to Free,
until it is renewed (see `effective_plan`).
"""
from datetime import timedelta
from decimal import Decimal

from django.utils import timezone

FREE = 'TEST'
PERIOD_DAYS = {'MONTHLY': 30, 'YEARLY': 365}
GRACE_DAYS = 3
REMINDER_DAYS = (7, 3, 1)

# Feature flags (what a plan may use)
CRM = 'crm'                          # leads from contact forms, customer list
INVOICES = 'invoices'                # Billing page: create/send invoices
ANALYTICS = 'analytics'              # visitor stats
CUSTOM_DOMAIN = 'custom_domain'
REMOVE_BRANDING = 'remove_branding'  # hide "Crafted on Jaalam" on published sites
AI_MARKETING = 'ai_marketing'        # AI copy + poster generator
CLIENT_ACCOUNTS = 'client_accounts'  # agency: create client logins
PREMIUM_TEMPLATES = 'premium_templates'
PRIORITY_SUPPORT = 'priority_support'
LOYALTY = 'loyalty'                  # QR stamp cards ("buy 9, get the 10th free")

# Themes that need the premium_templates feature. Existing sites keep their theme after a
# downgrade; the check only applies when a theme is chosen.
PREMIUM_THEMES = {'Glassmorphism', 'Aurora Gradient', 'Bento Grid', 'Editorial', 'Midnight Luxe'}

UNLIMITED = None

PLANS = {
    FREE: {
        'name': 'Free',
        'monthly_paise': 0,
        'yearly_paise': 0,
        'limits': {'websites': 1, 'ai_generations': 0},
        'features': [CRM],
        'highlights': ['1 website', 'All standard templates', 'Free hosting & SSL', 'QR code & contact form', 'Lead inbox'],
    },
    'STARTER': {
        'name': 'Starter',
        'monthly_paise': 19900,
        'yearly_paise': 199000,
        'limits': {'websites': 2, 'ai_generations': 0},
        'features': [CRM, INVOICES, ANALYTICS, CUSTOM_DOMAIN],
        'highlights': ['2 websites', 'All standard templates', 'GST invoices', 'Visitor analytics', 'Custom domain', 'Email support'],
    },
    'BUSINESS': {
        'name': 'Business',
        'monthly_paise': 49900,
        'yearly_paise': 499000,
        'limits': {'websites': 10, 'ai_generations': 50},
        'features': [CRM, INVOICES, ANALYTICS, CUSTOM_DOMAIN, REMOVE_BRANDING, AI_MARKETING, CLIENT_ACCOUNTS, LOYALTY, PRIORITY_SUPPORT],
        'highlights': ['10 websites', 'Remove Jaalam branding', 'AI marketing (50 / month)', 'Loyalty stamp cards', 'Client accounts for agencies', 'Everything in Starter', 'Priority support'],
        'badge': 'Popular',
    },
    'PREMIUM': {
        'name': 'Premium',
        'monthly_paise': 99900,
        'yearly_paise': 999000,
        'limits': {'websites': UNLIMITED, 'ai_generations': 300},
        'features': [CRM, INVOICES, ANALYTICS, CUSTOM_DOMAIN, REMOVE_BRANDING, AI_MARKETING, CLIENT_ACCOUNTS, LOYALTY, PREMIUM_TEMPLATES, PRIORITY_SUPPORT],
        'highlights': ['Unlimited websites', 'Premium modern templates', 'AI marketing (300 / month)', 'Everything in Business', '24/7 premium support'],
    },
}

PLAN_ORDER = [FREE, 'STARTER', 'BUSINESS', 'PREMIUM']


def is_unrestricted(user):
    """Admins and test users get every feature with no limits."""
    return bool(user.is_superuser or getattr(user, 'is_test_user', False))


def _rank(code):
    return PLAN_ORDER.index(code) if code in PLAN_ORDER else 0


def subscription_plan(user, now=None):
    """The time-limited plan, if still active (including the grace period), else Free."""
    now = now or timezone.now()
    code = user.membership if user.membership in PLANS else FREE
    if code == FREE or not user.plan_expires_at:
        return FREE
    return code if now <= user.plan_expires_at + timedelta(days=GRACE_DAYS) else FREE


def effective_plan(user, now=None):
    """The plan the user may use right now: the better of their active subscription and
    their lifetime plan. Legacy paid accounts with no expiry count as lifetime."""
    lifetime = getattr(user, 'lifetime_plan', '') or ''
    if not lifetime and user.membership in PLANS and user.membership != FREE and not user.plan_expires_at:
        lifetime = user.membership
    lifetime = lifetime if lifetime in PLANS else FREE
    return max(subscription_plan(user, now), lifetime, key=_rank)


def has_feature(user, feature):
    return is_unrestricted(user) or feature in PLANS[effective_plan(user)]['features']


def limit(user, name):
    """Numeric limit, or None for unlimited."""
    if is_unrestricted(user):
        return UNLIMITED
    return PLANS[effective_plan(user)]['limits'][name]


def theme_allowed(user, theme):
    return theme not in PREMIUM_THEMES or has_feature(user, PREMIUM_TEMPLATES)


def required_plan_for(feature):
    """Cheapest plan that includes a feature (for upgrade messages)."""
    return next((PLANS[c]['name'] for c in PLAN_ORDER if feature in PLANS[c]['features']), 'Premium')


def price_paise(plan_code, period):
    return PLANS[plan_code]['yearly_paise' if period == 'YEARLY' else 'monthly_paise']


def new_period_end(user, plan_code, period, now=None):
    """Expiry for a new payment.

    Renewing the same plan extends from the current expiry (no days lost by paying early).
    Switching plans starts now, and the unused value of the current paid plan is converted
    into extra days on the new plan (pro-rata), so upgrading mid-month is fair.
    """
    now = now or timezone.now()
    days = PERIOD_DAYS[period]
    current = subscription_plan(user, now)
    expires = user.plan_expires_at
    if current == plan_code and expires and expires > now:
        return expires + timedelta(days=days)
    end = now + timedelta(days=days)
    if current != FREE and expires and expires > now:
        old_daily = Decimal(PLANS[current]['monthly_paise']) / 30
        new_daily = Decimal(PLANS[plan_code]['monthly_paise']) / 30
        if new_daily > 0:
            remaining = Decimal((expires - now).total_seconds()) / 86400
            end += timedelta(days=float(remaining * old_daily / new_daily))
    return end


def plan_summary(user, now=None):
    """Everything the frontend needs to show the plan and gate features."""
    from websites.models import Website
    from .models import UsageCounter

    now = now or timezone.now()
    code = effective_plan(user, now)
    plan = PLANS[code]
    unrestricted = is_unrestricted(user)
    sub = subscription_plan(user, now)
    # Lifetime when the plan in use is not the time-limited one.
    lifetime = code != FREE and (sub != code or not user.plan_expires_at)
    expires = None if lifetime else (user.plan_expires_at if user.membership != FREE else None)
    days_left = (expires - now).days if expires else None
    lapsed = user.membership in PLANS and user.membership != FREE and bool(user.plan_expires_at) and sub == FREE
    return {
        'code': code,
        'name': 'Unlimited (admin/test)' if unrestricted else plan['name'],
        'paid_plan': user.membership if user.membership in PLANS else FREE,
        'is_paid': code != FREE,
        'period': 'LIFETIME' if lifetime else (user.plan_period or None) if code != FREE else None,
        'expires_at': expires.isoformat() if expires else None,
        'days_left': days_left,
        # A time-limited plan ran out (the user may still have a lifetime plan underneath).
        'expired': lapsed,
        'in_grace': bool(expires and now > expires and sub != FREE),
        'unrestricted': unrestricted,
        'features': sorted({f for p in PLANS.values() for f in p['features']}) if unrestricted else plan['features'],
        'limits': {k: limit(user, k) for k in plan['limits']},
        'usage': {
            'websites': Website.objects.filter(user=user).count(),
            'ai_generations': UsageCounter.current(user, 'ai_generations'),
        },
        'premium_themes': sorted(PREMIUM_THEMES),
    }


def catalog():
    return [
        {
            'code': code,
            'name': PLANS[code]['name'],
            'monthly_price': PLANS[code]['monthly_paise'] / 100,
            'yearly_price': PLANS[code]['yearly_paise'] / 100,
            'limits': PLANS[code]['limits'],
            'features': PLANS[code]['features'],
            'highlights': PLANS[code]['highlights'],
            'badge': PLANS[code].get('badge'),
        }
        for code in PLAN_ORDER
    ]
