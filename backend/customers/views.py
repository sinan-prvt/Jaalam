import logging

from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from users.notifications import create_notification
from .models import Activity, Customer
from .serializers import ActivitySerializer, CustomerSerializer, PublicLeadSerializer

logger = logging.getLogger(__name__)


class LeadThrottle(AnonRateThrottle):
    scope = 'public_form'


def site_name(website):
    content = getattr(website, 'content', None)
    return ((content.settings_json or {}).get('website_name') if content else None) or website.slug.replace('-', ' ').title()


def notify_site_team(website, title, message, notification_type):
    """The site's owner (agency) and, when it has one, the shop's own client login."""
    create_notification(website.user, title, message, notification_type=notification_type)
    if website.client_id and website.client_id != website.user_id:
        create_notification(website.client, title, message, notification_type=notification_type)


class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Customer.objects.select_related('website').order_by('-created_at')
        if getattr(user, 'role', 'AGENT') == 'CLIENT':
            return qs.filter(website__client=user)
        return qs.filter(website__user=user)

    def create(self, request, *args, **kwargs):
        # Old frontends post the public contact form here without a login.
        if not request.user.is_authenticated:
            return self._public_lead(request)
        return super().create(request, *args, **kwargs)

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]  # create() itself sends anonymous posts down the public path
        return super().get_permissions()

    def get_throttles(self):
        if self.action == 'create' and not self.request.user.is_authenticated:
            return [LeadThrottle()]
        return super().get_throttles()

    # No session: the public form needs no CSRF token, even for a logged-in visitor.
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny],
            authentication_classes=[], throttle_classes=[LeadThrottle])
    def lead(self, request):
        """Contact-form submission from a published website (no login)."""
        return self._public_lead(request)

    def _public_lead(self, request):
        serializer = PublicLeadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer = serializer.save()
        website = customer.website
        notify_site_team(
            website, f'New enquiry from {customer.name}',
            (customer.message or 'Sent from your website contact form.')[:300], 'new_lead')
        if customer.email:
            try:
                send_mail(
                    f'Thank you for contacting {site_name(website)}!',
                    f'Hi {customer.name},\n\nThank you for reaching out! We have received your message and will be in touch shortly.\n\n'
                    f'Best regards,\n{site_name(website)}',
                    None, [customer.email], fail_silently=True,
                )
            except Exception:  # never lose the lead over an email problem
                logger.exception('Could not send the lead confirmation email')
        return Response({'status': 'received'}, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(source=serializer.validated_data.get('source') or 'OTHER')

    def perform_update(self, serializer):
        old = serializer.instance
        old_status, old_follow_up = old.status, old.follow_up_at
        extra = {}
        new_follow_up = serializer.validated_data.get('follow_up_at', old_follow_up)
        if new_follow_up != old_follow_up:
            extra['follow_up_reminded_at'] = None  # remind again for the new date
        customer = serializer.save(**extra)
        user = self.request.user
        if customer.status != old_status:
            Activity.objects.create(customer=customer, kind='STATUS', created_by=user,
                                    text=f'{dict(Customer.STATUS_CHOICES)[old_status]} → {customer.get_status_display()}')
        if customer.follow_up_at != old_follow_up:
            text = (f"Follow-up set for {timezone.localtime(customer.follow_up_at):%d %b %Y, %I:%M %p}"
                    if customer.follow_up_at else 'Follow-up cleared')
            if customer.follow_up_at and customer.follow_up_note:
                text += f': {customer.follow_up_note}'
            Activity.objects.create(customer=customer, kind='FOLLOW_UP', text=text, created_by=user)

    @action(detail=True, methods=['get', 'post'])
    def activities(self, request, pk=None):
        customer = self.get_object()
        if request.method == 'GET':
            return Response(ActivitySerializer(customer.activities.select_related('created_by'), many=True).data)
        serializer = ActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        activity = serializer.save(customer=customer, created_by=request.user)
        if activity.kind in Activity.CONTACT_KINDS:
            customer.last_contact_date = timezone.now()
            fields = ['last_contact_date', 'updated_at']
            if customer.status == 'NEW':
                customer.status = 'CONTACTED'
                fields.append('status')
                Activity.objects.create(customer=customer, kind='STATUS', text='New → Contacted', created_by=request.user)
            customer.save(update_fields=fields)
        return Response(ActivitySerializer(activity).data, status=status.HTTP_201_CREATED)
