from datetime import datetime, timedelta
from decimal import Decimal, InvalidOperation

from django.utils import timezone

from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action, api_view, authentication_classes, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle

from users import plans
from users.views import frontend_base_url
from . import gst
from websites.models import Website
from .models import BusinessProfile, Invoice, Product
from .serializers import BusinessProfileSerializer, InvoiceSerializer, ProductSerializer, PublicInvoiceSerializer, billing_owner


class InvoiceEmailThrottle(UserRateThrottle):
    # The customer's address is typed in by the user, so this caps how much mail one account
    # can make the server send (it can't become a spam relay).
    scope = 'invoice_email'


def managed_website(request):
    """The ?website=<id> the request is about, if it's one this login manages.
    Returns (website or None, error response or None)."""
    website_id = request.query_params.get('website')
    if not website_id and request.method != 'GET' and hasattr(request.data, 'get'):
        website_id = request.data.get('website')
    if not website_id:
        return None, None
    user = request.user
    try:
        website = Website.objects.select_related('user', 'client').get(pk=int(website_id))
    except (Website.DoesNotExist, TypeError, ValueError):
        return None, Response({'error': 'Website not found.'}, status=status.HTTP_404_NOT_FOUND)
    if not (user.is_superuser or user.id in (website.user_id, website.client_id)):
        return None, Response({'error': 'Website not found.'}, status=status.HTTP_404_NOT_FOUND)
    return website, None


class ProductViewSet(viewsets.ModelViewSet):
    """A shop's saved products. ?website=<id> picks the shop (its billing owner's list)."""
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def owners(self):
        """Whose products this login may see and change: its own, and those of the client
        shops on its websites."""
        user = self.request.user
        ids = {user.id} | set(Website.objects.filter(user=user, client__isnull=False).values_list('client_id', flat=True))
        return ids

    def list(self, request, *args, **kwargs):
        _, error = managed_website(request)
        return error or super().list(request, *args, **kwargs)

    def get_queryset(self):
        qs = Product.objects.filter(owner_id__in=self.owners())
        if self.action == 'list':
            website, _ = managed_website(self.request)
            qs = qs.filter(owner=billing_owner(website) if website else self.request.user)
            if self.request.query_params.get('all') != 'true':
                qs = qs.filter(is_active=True)
        return qs

    def perform_create(self, serializer):
        if not plans.has_feature(self.request.user, plans.INVOICES):
            raise PermissionDenied(f"Products and invoices need the {plans.required_plan_for(plans.INVOICES)} plan or higher.")
        website, error = managed_website(self.request)
        if error:
            raise PermissionDenied('You can only add products to your own shops.')
        serializer.save(owner=billing_owner(website) if website else self.request.user)


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Invoice.objects.prefetch_related('items').order_by('-created_at')
        if user.is_superuser:
            return qs
        if getattr(user, 'role', 'AGENT') == 'CLIENT':
            return qs.filter(website__client=user)
        return qs.filter(website__user=user)

    def perform_create(self, serializer):
        # Creating invoices is a paid feature of the site owner's plan (a client working on an
        # assigned site uses the owner's plan); existing invoices stay viewable after a downgrade.
        owner = serializer.validated_data['website'].user
        if not plans.has_feature(owner, plans.INVOICES):
            raise PermissionDenied(f"Invoices need the {plans.required_plan_for(plans.INVOICES)} plan or higher.")
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def record_payment(self, request, pk=None):
        """Add a (part) payment. Body: {"amount": "500.00"}; the invoice becomes PAID once fully paid."""
        invoice = self.get_object()
        try:
            amount = gst.money(Decimal(str(request.data.get('amount', ''))))
        except (InvalidOperation, ValueError):
            return Response({'error': 'Enter the amount received.'}, status=status.HTTP_400_BAD_REQUEST)
        if amount <= 0:
            return Response({'error': 'The amount must be more than zero.'}, status=status.HTTP_400_BAD_REQUEST)
        if invoice.status == 'CANCELLED':
            return Response({'error': 'This invoice is cancelled.'}, status=status.HTTP_400_BAD_REQUEST)
        invoice.amount_paid = min(invoice.total_amount, invoice.amount_paid + amount)
        if invoice.amount_paid >= invoice.total_amount:
            invoice.status = 'PAID'
        elif invoice.status == 'DRAFT':
            invoice.status = 'UNPAID'
        invoice.save(update_fields=['amount_paid', 'status', 'updated_at'])
        return Response(self.get_serializer(invoice).data)

    @action(detail=True, methods=['post'], throttle_classes=[InvoiceEmailThrottle])
    def send_email(self, request, pk=None):
        """Email the customer a link to view, download and pay the invoice."""
        invoice = self.get_object()
        if not invoice.customer_email:
            return Response({'error': 'Add the customer\'s email to the invoice first.'}, status=status.HTTP_400_BAD_REQUEST)
        base = frontend_base_url(request)
        if not base:
            return Response({'error': 'Email links are not configured on the server (FRONTEND_URL).'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        link = f"{base}/invoice/{invoice.public_token}"
        send_mail(
            f"Invoice {invoice.invoice_number} from {invoice.seller_name}",
            f"Hi {invoice.customer_name},\n\nPlease find invoice {invoice.invoice_number} for ₹{invoice.total_amount}"
            f"{f', due on {invoice.due_date:%d %b %Y}' if invoice.due_date else ''}.\n\n"
            f"View, download or pay online: {link}\n\nThank you,\n{invoice.seller_name}",
            None, [invoice.customer_email], fail_silently=False,
        )
        return Response({'status': 'sent'})

    @action(detail=False, methods=['get'])
    def report(self, request):
        """One month's invoices with totals, for the monthly PDF.
        ?month=2026-10 (default: this month), &website=<id> for one shop."""
        month = request.query_params.get('month') or timezone.localdate().strftime('%Y-%m')
        try:
            start = datetime.strptime(month, '%Y-%m').date()
        except ValueError:
            return Response({'error': 'Month must look like 2026-10.'}, status=status.HTTP_400_BAD_REQUEST)
        end = (start.replace(day=28) + timedelta(days=4)).replace(day=1)

        invoices = self.get_queryset().filter(issue_date__gte=start, issue_date__lt=end).order_by('issue_date', 'sequence')
        website, error = managed_website(request)
        if error:
            return error
        if website:
            invoices = invoices.filter(website=website)
        profile = BusinessProfile.objects.filter(user=billing_owner(website) if website else request.user).first()

        counted = [i for i in invoices if i.status not in ('DRAFT', 'CANCELLED')]
        zero = Decimal('0')
        totals = {
            'count': len(counted),
            'cancelled': sum(1 for i in invoices if i.status == 'CANCELLED'),
            'taxable': sum((i.subtotal for i in counted), zero),
            'gst': sum((i.gst_amount for i in counted), zero),
            'cgst': sum((i.cgst_amount for i in counted), zero),
            'sgst': sum((i.sgst_amount for i in counted), zero),
            'igst': sum((i.igst_amount for i in counted), zero),
            'total': sum((i.total_amount for i in counted), zero),
            'received': sum((i.amount_paid for i in counted), zero),
        }
        totals['due'] = totals['total'] - totals['received']

        by_day, items = {}, {}
        for inv in counted:
            day = by_day.setdefault(inv.issue_date.isoformat(), {'date': inv.issue_date.isoformat(), 'count': 0, 'total': zero})
            day['count'] += 1
            day['total'] += inv.total_amount
            for item in inv.items.all():
                row = items.setdefault(item.description.strip().lower(), {'description': item.description, 'quantity': 0, 'amount': zero})
                row['quantity'] += item.quantity
                row['amount'] += item.total

        rupees = lambda value: str(gst.money(value))  # "150.00", like every other amount in the API
        return Response({
            'month': month,
            'label': start.strftime('%B %Y'),
            'business': BusinessProfileSerializer(profile).data if profile else None,
            'website': website.id if website else None,
            'invoices': [{
                'id': i.id, 'invoice_number': i.invoice_number, 'issue_date': i.issue_date,
                'customer_name': i.customer_name, 'status': i.status,
                'subtotal': rupees(i.subtotal), 'gst_amount': rupees(i.gst_amount), 'total_amount': rupees(i.total_amount),
                'amount_paid': rupees(i.amount_paid), 'balance_due': rupees(max(zero, i.total_amount - i.amount_paid)),
            } for i in invoices],
            'totals': {k: (v if isinstance(v, int) else rupees(v)) for k, v in totals.items()},
            'by_day': [{**d, 'total': rupees(d['total'])} for d in by_day.values()],
            'top_items': [{**r, 'amount': rupees(r['amount'])}
                          for r in sorted(items.values(), key=lambda r: r['amount'], reverse=True)[:10]],
        })

    @action(detail=False, methods=['get', 'put', 'patch'])
    def profile(self, request):
        """Business details printed on invoices. With ?website=<id>, the details of that shop's
        seller (its client login, or the owner), so they match what its invoices print."""
        website, error = managed_website(request)
        if error:
            return error
        profile, _ = BusinessProfile.objects.get_or_create(user=billing_owner(website) if website else request.user)
        if request.method == 'GET':
            return Response(BusinessProfileSerializer(profile).data)
        serializer = BusinessProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def states(self, request):
        return Response([{'code': c, 'name': n} for c, n in gst.STATES.items()])


@api_view(['GET'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def public_invoice(request, token):
    """Shared 'view & pay' link for the customer; the random token is the only key."""
    invoice = get_object_or_404(Invoice.objects.prefetch_related('items'), public_token=token)
    return Response(PublicInvoiceSerializer(invoice).data)
