"""Subscription lifecycle: activating payments, renewal reminders and expiry notices."""
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone

from . import plans
from .models import Subscription, User
from .notifications import create_notification


def _notify(user, title, message):
    create_notification(user=user, title=title, message=message, notification_type='subscription')
    if user.email:
        try:
            send_mail(title, message, getattr(settings, 'DEFAULT_FROM_EMAIL', None), [user.email], fail_silently=True)
        except Exception:
            pass


@transaction.atomic
def activate_subscription(subscription, payment_id=None):
    """Mark a paid order as successful and give the user its plan (idempotent)."""
    subscription = Subscription.objects.select_for_update().get(pk=subscription.pk)
    if subscription.status == 'SUCCESS':
        return subscription
    user = User.objects.select_for_update().get(pk=subscription.user_id)
    end = plans.new_period_end(user, subscription.plan_type, subscription.billing_period)

    subscription.status = 'SUCCESS'
    subscription.period_end = end
    if payment_id:
        subscription.razorpay_payment_id = payment_id
    subscription.save()

    user.membership = subscription.plan_type
    user.plan_period = subscription.billing_period
    user.plan_expires_at = end
    user.plan_reminders_sent = []
    user.has_completed_onboarding = True
    user.save(update_fields=['membership', 'plan_period', 'plan_expires_at', 'plan_reminders_sent', 'has_completed_onboarding'])

    name = plans.PLANS[subscription.plan_type]['name']
    _notify(user, f'{name} plan active', f"Thank you! Your {name} plan is active until {timezone.localtime(end):%d %b %Y}.")
    return subscription


def switch_to_free(user):
    user.membership = plans.FREE
    user.plan_period = ''
    user.plan_expires_at = None
    user.plan_reminders_sent = []
    user.has_completed_onboarding = True
    user.save(update_fields=['membership', 'plan_period', 'plan_expires_at', 'plan_reminders_sent', 'has_completed_onboarding'])


def sync_plan_status(user, now=None):
    """Send any due renewal reminder or expiry notice (each one once per period).

    Called when the user loads the app (/api/users/me/) and by the daily
    `manage.py sync_subscriptions` command, so it works with or without a cron job.
    """
    if user.membership == plans.FREE or not user.plan_expires_at or plans.is_unrestricted(user):
        return  # free, lifetime (no expiry) or unrestricted: nothing to remind
    now = now or timezone.now()
    sent = list(user.plan_reminders_sent or [])
    name = plans.PLANS.get(user.membership, {}).get('name', user.membership)
    expires = user.plan_expires_at
    days_left = (expires - now).total_seconds() / 86400
    due = None

    if plans.subscription_plan(user, now) == plans.FREE:
        if 'downgraded' not in sent:
            fallback = plans.PLANS[plans.effective_plan(user, now)]['name']
            due = ('downgraded', f'{name} plan expired',
                   f"Your {name} plan has ended and your account is now on the {fallback} plan. "
                   f"Websites over the {fallback} limit are paused until you renew. Renew any time from Pricing.")
    elif days_left <= 0:
        if 'expired' not in sent:
            grace_end = expires + timedelta(days=plans.GRACE_DAYS)
            due = ('expired', f'{name} plan expired — renew to keep your features',
                   f"Your {name} plan expired. Your features stay on until {timezone.localtime(grace_end):%d %b %Y}; "
                   "renew before then to avoid interruption.")
    else:
        for days in plans.REMINDER_DAYS:  # (7, 3, 1): send the closest one not yet sent
            if days_left <= days and str(days) not in sent:
                due = (str(days), f'{name} plan renews soon',
                       f"Your {name} plan expires in {max(1, round(days_left))} day(s), on "
                       f"{timezone.localtime(expires):%d %b %Y}. Renew now to keep your websites and features running.")
        if due:
            # Mark every longer reminder as sent too, so a late sync doesn't send several at once.
            sent += [str(d) for d in plans.REMINDER_DAYS if d >= int(due[0]) and str(d) not in sent]

    if due:
        if due[0] not in sent:
            sent.append(due[0])
        user.plan_reminders_sent = sent
        user.save(update_fields=['plan_reminders_sent'])
        _notify(user, due[1], due[2])
