from rest_framework import viewsets, permissions
from .models import Customer
from .serializers import CustomerSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return customers for websites owned by the current user
        return Customer.objects.filter(website__user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # We generally won't create customers from the dashboard manually first, 
        # but if we do, we need to pass the website ID. 
        # The frontend will send the website ID.
        serializer.save()
