"""Digital stamp cards: "buy 9, get the 10th free".

A shop (website) runs one program. Customers join by scanning the counter QR and
get a card with its own secret code; staff scan the card's QR to add a stamp or
give the reward. Every change is kept as a StampEvent.
"""
import secrets

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from customers.models import Customer
from websites.models import Website


def new_card_code():
    # Unguessable: the code is what lets a customer open their card
    return secrets.token_urlsafe(9)


def new_counter_key():
    return secrets.token_urlsafe(12)


class LoyaltyProgram(models.Model):
    # How a visit earns a stamp. In the self modes the customer scans and gets the stamp
    # with no staff action; what stops stamping without buying is the 4-digit code the
    # cashier says after payment (new every day), the counter screen's code changing every
    # 30 seconds, or the phone's location matching the shop.
    STAMP_MODES = [
        ('CODE', "Customer scans the printed QR and enters today's code"),
        ('STAFF', 'Staff scan the customer'),
        ('SCREEN', 'Customer scans the counter screen'),
        ('PRINTED', 'Customer scans the printed QR (location check)'),
    ]

    ICON_CHOICES = [
        ('coffee', 'Coffee'),
        ('food', 'Food'),
        ('pizza', 'Pizza'),
        ('cake', 'Cake'),
        ('icecream', 'Ice cream'),
        ('scissors', 'Salon'),
        ('sparkles', 'Beauty'),
        ('dumbbell', 'Fitness'),
        ('shopping', 'Shopping'),
        ('shirt', 'Clothing'),
        ('gem', 'Jewellery'),
        ('book', 'Books'),
        ('pill', 'Pharmacy'),
        ('car', 'Car'),
        ('wrench', 'Repairs'),
        ('paw', 'Pets'),
        ('flower', 'Flowers'),
        ('gift', 'Gift'),
        ('heart', 'Heart'),
        ('star', 'Star'),
    ]

    website = models.OneToOneField(Website, on_delete=models.CASCADE, related_name='loyalty')
    reward = models.CharField(max_length=120, default='Free coffee')
    stamps_required = models.PositiveSmallIntegerField(default=9, validators=[MinValueValidator(2), MaxValueValidator(30)])
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default='star')
    color = models.CharField(max_length=9, default='#ea580c')
    max_stamps_per_day = models.PositiveSmallIntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(10)])
    terms = models.CharField(max_length=300, blank=True)
    is_active = models.BooleanField(default=True)
    stamp_mode = models.CharField(max_length=10, choices=STAMP_MODES, default='CODE')
    # Opens the counter screen without a login, so it is kept secret and can be reset.
    # It also seeds today's code, so resetting it gives a new code at once.
    counter_key = models.CharField(max_length=24, unique=True, default=new_counter_key)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    radius_m = models.PositiveSmallIntegerField(default=150, validators=[MinValueValidator(50), MaxValueValidator(2000)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.website.slug}: {self.reward} after {self.stamps_required}'


class LoyaltyCard(models.Model):
    program = models.ForeignKey(LoyaltyProgram, on_delete=models.CASCADE, related_name='cards')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='loyalty_cards')
    phone = models.CharField(max_length=15)  # digits only; one card per phone per shop
    code = models.CharField(max_length=24, unique=True, default=new_card_code)
    stamps = models.PositiveSmallIntegerField(default=0)
    rewards_redeemed = models.PositiveIntegerField(default=0)
    last_stamp_at = models.DateTimeField(null=True, blank=True)
    # Wrong "today's code" tries, so a card can't guess the 4 digits
    code_fails = models.PositiveSmallIntegerField(default=0)
    code_fail_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['program', 'phone'], name='one_card_per_phone')]
        ordering = ['-last_stamp_at', '-created_at']

    @property
    def reward_ready(self):
        return self.stamps >= self.program.stamps_required

    def __str__(self):
        return f'{self.customer.name} ({self.stamps}/{self.program.stamps_required})'


class StampEvent(models.Model):
    KIND_CHOICES = [
        ('STAMP', 'Stamp added'),
        ('REDEEM', 'Reward given'),
        ('UNDO', 'Stamp removed'),
    ]

    card = models.ForeignKey(LoyaltyCard, on_delete=models.CASCADE, related_name='events')
    kind = models.CharField(max_length=10, choices=KIND_CHOICES)
    self_scan = models.BooleanField(default=False)  # the customer scanned; no staff involved
    by_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at', '-id']
