from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    MEMBERSHIP_CHOICES = [
        ('TEST', 'Free'),
        ('STARTER', 'Starter'),
        ('BUSINESS', 'Business'),
        ('PREMIUM', 'Premium'),
    ]
    
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('AGENT', 'Agent'),
        ('CLIENT', 'Client'),
    ]

    membership = models.CharField(max_length=20, choices=MEMBERSHIP_CHOICES, default='TEST')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='AGENT')
    agent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='clients')
    is_test_user = models.BooleanField(default=False)
    has_completed_onboarding = models.BooleanField(default=False)
    # True once Google confirmed this person owns the email (see google_login)
    email_verified = models.BooleanField(default=False)
    # Paid plans run until plan_expires_at (see users/plans.py); empty on the free plan.
    plan_expires_at = models.DateTimeField(null=True, blank=True)
    plan_period = models.CharField(max_length=10, blank=True, default='')  # MONTHLY / YEARLY
    # Plan bought under the old "pay once, lifetime" pricing; never expires. A time-limited
    # higher plan can sit on top of it, and the user falls back to this one afterwards.
    lifetime_plan = models.CharField(max_length=20, blank=True, default='')
    # Renewal reminders already sent for the current period, e.g. ["7", "1", "expired"]
    plan_reminders_sent = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.username

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan_type = models.CharField(max_length=20, choices=User.MEMBERSHIP_CHOICES)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, default='PENDING') # PENDING, SUCCESS, FAILED
    billing_period = models.CharField(max_length=10, default='MONTHLY')  # MONTHLY / YEARLY
    period_end = models.DateTimeField(null=True, blank=True)  # set when the payment succeeds
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan_type} - {self.status}"


class UsageCounter(models.Model):
    """Monthly usage of metered features (e.g. AI generations), per user."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='usage_counters')
    key = models.CharField(max_length=50)
    period = models.CharField(max_length=7)  # YYYY-MM
    count = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('user', 'key', 'period')

    @staticmethod
    def this_month():
        from django.utils import timezone
        return timezone.now().strftime('%Y-%m')

    @classmethod
    def current(cls, user, key):
        row = cls.objects.filter(user=user, key=key, period=cls.this_month()).first()
        return row.count if row else 0

    @classmethod
    def increment(cls, user, key, by=1):
        from django.db.models import F
        row, _ = cls.objects.get_or_create(user=user, key=key, period=cls.this_month())
        cls.objects.filter(pk=row.pk).update(count=F('count') + by)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    notification_type = models.CharField(max_length=50, default='system')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"

class NotificationMessage(models.Model):
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Reply by {self.sender.username} on {self.notification.title}"

class SystemSettings(models.Model):
    maintenance_mode = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
