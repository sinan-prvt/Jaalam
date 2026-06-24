from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    MEMBERSHIP_CHOICES = [
        ('FREE', 'Free'),
        ('BASIC', 'Basic'),
        ('PRO', 'Pro'),
        ('AGENCY', 'Agency'),
    ]
    membership = models.CharField(max_length=20, choices=MEMBERSHIP_CHOICES, default='FREE')

    def __str__(self):
        return self.username
