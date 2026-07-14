from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    MEMBERSHIP_CHOICES = [
        ('TEST', 'Test Mode'),
        ('STARTER', 'Starter'),
        ('BUSINESS', 'Business'),
        ('PREMIUM', 'Premium'),
    ]
    membership = models.CharField(max_length=20, choices=MEMBERSHIP_CHOICES, default='TEST')
    is_test_user = models.BooleanField(default=False)
    has_completed_onboarding = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan_type = models.CharField(max_length=20, choices=User.MEMBERSHIP_CHOICES)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, default='PENDING') # PENDING, SUCCESS, FAILED
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan_type} - {self.status}"

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
