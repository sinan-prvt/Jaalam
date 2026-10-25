from decimal import Decimal, InvalidOperation

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
from .models import BusinessProfile, Invoice
from .serializers import BusinessProfileSerializer, InvoiceSerializer, PublicInvoiceSerializer


class InvoiceEmailThrottle(UserRateThrottle):
    # The customer's address is typed in by the user, so this caps how much mail one account
    # can make the server send (it can't become a spam relay).
    scope = 'invoice_email'


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

    @action(detail=False, methods=['get', 'put', 'patch'])
    def profile(self, request):
        """The signed-in user's business details used on their invoices."""
        profile, _ = BusinessProfile.objects.get_or_create(user=request.user)
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
