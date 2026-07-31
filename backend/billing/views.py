from rest_framework import viewsets, permissions
from rest_framework.response import Response
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
        serializer.save(created_by=self.request.user)
