from django.db import models
from django.conf import settings

class Website(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='websites')
    slug = models.SlugField(unique=True)
    theme = models.CharField(max_length=50, default='Modern')
    business_type = models.CharField(max_length=100)
    published = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    visitors_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.slug

class WebsiteContent(models.Model):
    website = models.OneToOneField(Website, on_delete=models.CASCADE, related_name='content')
    hero_title = models.CharField(max_length=200, blank=True)
    about_text = models.TextField(blank=True)
    services_json = models.JSONField(default=list, blank=True)
    gallery_json = models.JSONField(default=list, blank=True)
    contact_info = models.JSONField(default=dict, blank=True)
    custom_html = models.TextField(blank=True)
    custom_css = models.TextField(blank=True)
    custom_blocks_json = models.JSONField(default=list, blank=True)
    products_json = models.JSONField(default=list, blank=True)
    settings_json = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Content for {self.website.slug}"

class PhysicalOrder(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled')
    ]
    
    website = models.ForeignKey(Website, on_delete=models.CASCADE, related_name='physical_orders')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='physical_orders')
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=50)
    email = models.EmailField()
    address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} for {self.website.slug}"
