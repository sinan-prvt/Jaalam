from django.conf import settings
from django.db import models
from websites.models import Website


class Customer(models.Model):
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('CONTACTED', 'Contacted'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('LOST', 'Lost'),
    ]
    SOURCE_CHOICES = [
        ('WEBSITE', 'Website form'),
        ('WHATSAPP', 'WhatsApp'),
        ('CALL', 'Phone call'),
        ('WALK_IN', 'Walk-in'),
        ('REFERRAL', 'Referral'),
        ('SOCIAL', 'Social media'),
        ('LOYALTY', 'Loyalty card'),
        ('OTHER', 'Other'),
    ]

    website = models.ForeignKey(Website, on_delete=models.CASCADE, related_name='customers')
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    whatsapp = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='WEBSITE')
    message = models.TextField(blank=True)  # what the visitor wrote on the contact form
    notes = models.TextField(blank=True, null=True)  # the owner's private notes
    value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)  # expected deal value (₹)
    last_contact_date = models.DateTimeField(auto_now_add=True)
    follow_up_at = models.DateTimeField(null=True, blank=True)
    follow_up_note = models.CharField(max_length=200, blank=True)
    follow_up_reminded_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.website.slug}"


class Activity(models.Model):
    """Timeline entry on a lead: something the owner did, or a change we logged for them."""
    KIND_CHOICES = [
        ('NOTE', 'Note'),
        ('CALL', 'Call'),
        ('WHATSAPP', 'WhatsApp'),
        ('EMAIL', 'Email'),
        ('MEETING', 'Meeting'),
        ('STATUS', 'Status change'),
        ('FOLLOW_UP', 'Follow-up'),
    ]
    CONTACT_KINDS = ('CALL', 'WHATSAPP', 'EMAIL', 'MEETING')

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='activities')
    kind = models.CharField(max_length=20, choices=KIND_CHOICES, default='NOTE')
    text = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at', '-id']
        verbose_name_plural = 'activities'
