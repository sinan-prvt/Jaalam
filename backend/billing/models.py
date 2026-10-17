import uuid

from django.db import models
from django.contrib.auth import get_user_model
from websites.models import Website

User = get_user_model()

class BusinessProfile(models.Model):
    """Seller details printed on every invoice (saved once, reused)."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='business_profile')
    legal_name = models.CharField(max_length=255, blank=True)
    gstin = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    state_code = models.CharField(max_length=2, blank=True)  # GST state code, see billing/gst.py
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    upi_id = models.CharField(max_length=100, blank=True)
    logo_url = models.URLField(max_length=500, blank=True)
    invoice_prefix = models.CharField(max_length=10, default='INV')
    terms = models.TextField(blank=True)  # default notes / terms printed on invoices

    def __str__(self):
        return self.legal_name or self.user.username


class Invoice(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('UNPAID', 'Unpaid'),
        ('PAID', 'Paid'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    website = models.ForeignKey(Website, on_delete=models.CASCADE, related_name='invoices')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField(blank=True, null=True)
    customer_phone = models.CharField(max_length=50, blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UNPAID')

    # Invoice number, e.g. INV/2026-27/0007: sequential per business owner and financial year.
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='owned_invoices')
    invoice_number = models.CharField(max_length=40, blank=True)
    financial_year = models.CharField(max_length=7, blank=True)
    sequence = models.PositiveIntegerField(null=True, blank=True)
    issue_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)

    customer_gstin = models.CharField(max_length=15, blank=True)
    customer_address = models.TextField(blank=True)
    place_of_supply = models.CharField(max_length=2, blank=True)  # GST state code
    notes = models.TextField(blank=True)

    # Seller details copied from the business profile when the invoice is created, so later
    # profile edits don't change issued invoices.
    seller_name = models.CharField(max_length=255, blank=True)
    seller_gstin = models.CharField(max_length=15, blank=True)
    seller_address = models.TextField(blank=True)
    seller_state = models.CharField(max_length=2, blank=True)
    seller_phone = models.CharField(max_length=50, blank=True)
    seller_email = models.EmailField(blank=True)
    seller_upi = models.CharField(max_length=100, blank=True)
    seller_logo = models.URLField(max_length=500, blank=True)

    # Tax split (computed on the server): INTRA = CGST + SGST, INTER = IGST
    tax_type = models.CharField(max_length=5, blank=True)
    cgst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sgst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    igst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Secret for the shareable "view & pay" link (/invoice/<token>)
    public_token = models.UUIDField(default=uuid.uuid4, editable=False, null=True, unique=True)
    
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=18.0)
    gst_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['owner', 'financial_year', 'sequence'], name='unique_invoice_number_per_owner_year'),
        ]

    def __str__(self):
        return f"Invoice {self.invoice_number or self.id} - {self.customer_name}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    hsn_sac = models.CharField(max_length=10, blank=True)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # % (falls back to the invoice rate)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.description} ({self.invoice.id})"
