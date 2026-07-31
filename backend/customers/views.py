from rest_framework import viewsets, permissions
from django.core.mail import send_mail
from .models import Customer
from .serializers import CustomerSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Return customers for websites owned by the current user OR assigned to the current client
        if getattr(self.request.user, 'role', 'AGENT') == 'CLIENT':
            return Customer.objects.filter(website__client=self.request.user).order_by('-created_at')
        return Customer.objects.filter(website__user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # The frontend will send the website ID.
        customer = serializer.save()
        
        # Send automated thank you email if email is provided
        if customer.email:
            website_name = getattr(customer.website, 'slug', 'Our Team')
            try:
                send_mail(
                    subject=f"Thank you for contacting {website_name}!",
                    message=f"Hi {customer.name},\n\nThank you for reaching out! We have received your message and will be in touch shortly.\n\nBest regards,\n{website_name}",
                    from_email="noreply@jaalam.com",
                    recipient_list=[customer.email],
                    fail_silently=True
                )
            except Exception as e:
                pass
