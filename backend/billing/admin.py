from django.contrib import admin

from .models import BusinessProfile, Invoice, InvoiceItem


class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 0


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'customer_name', 'owner', 'total_amount', 'amount_paid', 'status', 'issue_date', 'due_date')
    list_filter = ('status', 'tax_type', 'financial_year')
    search_fields = ('invoice_number', 'customer_name', 'customer_email', 'owner__username')
    inlines = [InvoiceItemInline]


@admin.register(BusinessProfile)
class BusinessProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'legal_name', 'gstin', 'state_code')
    search_fields = ('user__username', 'legal_name', 'gstin')
