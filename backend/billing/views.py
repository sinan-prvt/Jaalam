from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from users import plans
from .models import Invoice
from .serializers import InvoiceSerializer

class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Invoice.objects.all().order_by('-created_at')
            
        if getattr(user, 'role', 'AGENT') == 'CLIENT':
            return Invoice.objects.filter(website__client=user).order_by('-created_at')
            
        return Invoice.objects.filter(website__user=user).order_by('-created_at')

    def perform_create(self, serializer):
        # Creating invoices is a paid feature; existing invoices stay viewable after a downgrade.
        if not plans.has_feature(self.request.user, plans.INVOICES):
            raise PermissionDenied(f"Invoices need the {plans.required_plan_for(plans.INVOICES)} plan or higher.")
        serializer.save(created_by=self.request.user)
