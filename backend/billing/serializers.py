from decimal import Decimal

from django.db import transaction
from django.db.models import Max
from django.utils import timezone
from rest_framework import serializers

from . import gst
from .models import BusinessProfile, Invoice, InvoiceItem, Product


def billing_owner(website):
    """Who is the seller on a website's invoices: the shop's own client login if it has one
    (their business name, GSTIN and their own invoice numbers), otherwise the site owner."""
    return website.client or website.user


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'gst_rate', 'hsn_sac', 'is_active', 'created_at')
        read_only_fields = ('created_at',)

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Enter the product name.')
        return value

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError('Price cannot be negative.')
        return value

    def validate_gst_rate(self, value):
        if value is not None and not 0 <= value <= 28:
            raise serializers.ValidationError('GST rate must be between 0 and 28%.')
        return value

    def validate_hsn_sac(self, value):
        value = (value or '').strip()
        if value and not value.isdigit():
            raise serializers.ValidationError('HSN/SAC is numbers only.')
        return value


class BusinessProfileSerializer(serializers.ModelSerializer):
    state_name = serializers.SerializerMethodField()

    class Meta:
        model = BusinessProfile
        exclude = ('id', 'user')

    def get_state_name(self, obj):
        return gst.STATES.get(obj.state_code, '')

    def validate_gstin(self, value):
        value = (value or '').strip().upper()
        if value and (error := gst.gstin_error(value)):
            raise serializers.ValidationError(error)
        return value

    def validate_state_code(self, value):
        if value and value not in gst.STATES:
            raise serializers.ValidationError('Unknown state.')
        return value

    def validate(self, attrs):
        gstin, state = attrs.get('gstin'), attrs.get('state_code')
        if gstin and not state:
            attrs['state_code'] = gstin[:2]
        elif gstin and state and gstin[:2] != state:
            raise serializers.ValidationError({'state_code': 'The state must match the first two digits of the GSTIN.'})
        return attrs


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ('id', 'description', 'hsn_sac', 'gst_rate', 'quantity', 'price', 'total')
        read_only_fields = ('total',)

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError('Quantity must be at least 1.')
        return value

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError('Price cannot be negative.')
        return value

    def validate_gst_rate(self, value):
        if value is not None and not 0 <= value <= 28:
            raise serializers.ValidationError('GST rate must be between 0 and 28%.')
        return value


# Computed on the server from the items; whatever a client sends for these is ignored.
COMPUTED = ('subtotal', 'gst_amount', 'total_amount', 'tax_type', 'cgst_amount', 'sgst_amount', 'igst_amount')
SELLER = ('seller_name', 'seller_gstin', 'seller_address', 'seller_state', 'seller_phone', 'seller_email', 'seller_upi', 'seller_logo')


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, required=False)
    display_status = serializers.SerializerMethodField()
    balance_due = serializers.SerializerMethodField()
    place_of_supply_name = serializers.SerializerMethodField()
    seller_state_name = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'created_by', 'owner', 'invoice_number', 'financial_year',
                            'sequence', 'public_token', 'amount_paid') + COMPUTED + SELLER

    def get_display_status(self, obj):
        if obj.status == 'UNPAID' and obj.due_date and obj.due_date < timezone.localdate():
            return 'OVERDUE'
        if obj.status == 'UNPAID' and obj.amount_paid > 0:
            return 'PARTIALLY_PAID'
        return obj.status

    def get_balance_due(self, obj):
        return str(max(Decimal('0'), obj.total_amount - obj.amount_paid))

    def get_place_of_supply_name(self, obj):
        return gst.STATES.get(obj.place_of_supply, '')

    def get_seller_state_name(self, obj):
        return gst.STATES.get(obj.seller_state, '')

    def validate_website(self, website):
        user = self.context['request'].user
        if not (user.is_superuser or website.user_id == user.id or website.client_id == user.id):
            raise serializers.ValidationError('You can only create invoices for your own websites.')
        return website

    def validate_customer_gstin(self, value):
        value = (value or '').strip().upper()
        if value and (error := gst.gstin_error(value)):
            raise serializers.ValidationError(error)
        return value

    def validate_place_of_supply(self, value):
        if value and value not in gst.STATES:
            raise serializers.ValidationError('Unknown state.')
        return value

    def validate_gst_percentage(self, value):
        if not 0 <= value <= 28:
            raise serializers.ValidationError('GST rate must be between 0 and 28%.')
        return value

    @staticmethod
    def _apply_totals(invoice, items_data):
        """Recalculate item totals, GST and the CGST/SGST or IGST split; returns item rows."""
        rows, subtotal, tax = [], Decimal('0'), Decimal('0')
        for data in items_data:
            line = gst.money(Decimal(data.get('quantity') or 1) * Decimal(data['price']))
            rate = data.get('gst_rate')
            rate = invoice.gst_percentage if rate is None else rate
            subtotal += line
            tax += gst.money(line * Decimal(rate) / 100)
            rows.append({**data, 'total': line})
        if not invoice.place_of_supply:
            # Customer's GSTIN tells their state; otherwise assume a local (same-state) sale.
            invoice.place_of_supply = invoice.customer_gstin[:2] if invoice.customer_gstin else invoice.seller_state
        invoice.subtotal = gst.money(subtotal)
        invoice.gst_amount = gst.money(tax)
        invoice.tax_type, invoice.cgst_amount, invoice.sgst_amount, invoice.igst_amount = gst.split_tax(
            tax, invoice.seller_state, invoice.place_of_supply)
        invoice.total_amount = invoice.subtotal + invoice.gst_amount
        return rows

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        website = validated_data['website']
        owner = billing_owner(website)
        # Locking the owner's profile row serialises numbering, so two invoices saved at the
        # same moment can't get the same number.
        BusinessProfile.objects.get_or_create(user=owner)
        profile = BusinessProfile.objects.select_for_update().get(user=owner)

        issue_date = validated_data.pop('issue_date', None) or timezone.localdate()
        fy = gst.financial_year(issue_date)
        last = Invoice.objects.filter(owner=owner, financial_year=fy).aggregate(m=Max('sequence'))['m'] or 0
        invoice = Invoice(
            **validated_data,
            owner=owner,
            issue_date=issue_date,
            financial_year=fy,
            sequence=last + 1,
            invoice_number=f"{profile.invoice_prefix or 'INV'}/{fy}/{last + 1:04d}",
            seller_name=profile.legal_name or website.slug.replace('-', ' ').title(),
            seller_gstin=profile.gstin,
            seller_address=profile.address,
            seller_state=profile.state_code,
            seller_phone=profile.phone,
            seller_email=profile.email,
            seller_upi=profile.upi_id,
            seller_logo=profile.logo_url,
        )
        if not invoice.notes and profile.terms:
            invoice.notes = profile.terms
        rows = self._apply_totals(invoice, items_data)
        invoice.save()
        InvoiceItem.objects.bulk_create([InvoiceItem(invoice=invoice, **row) for row in rows])
        return invoice

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        validated_data.pop('website', None)  # an issued invoice stays with its website
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if items_data is None:
            items_data = [InvoiceItemSerializer(i).data for i in instance.items.all()]
            for row in items_data:
                row.pop('id', None)
                row.pop('total', None)
                row['price'] = Decimal(row['price'])
                row['gst_rate'] = None if row['gst_rate'] is None else Decimal(row['gst_rate'])
        rows = self._apply_totals(instance, items_data)
        instance.save()
        instance.items.all().delete()
        InvoiceItem.objects.bulk_create([InvoiceItem(invoice=instance, **row) for row in rows])
        return instance


class PublicInvoiceSerializer(InvoiceSerializer):
    """What a customer sees on the shared invoice link (no internal ids)."""

    class Meta(InvoiceSerializer.Meta):
        fields = None
        exclude = ('website', 'created_by', 'owner', 'sequence')
