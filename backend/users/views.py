import logging

from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.middleware.csrf import get_token
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.throttling import SimpleRateThrottle

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .serializers import UserSerializer, NotificationSerializer
from .models import Notification
from .notifications import create_notification
from .subscriptions import sync_plan_status, switch_to_free
from datetime import timedelta
from django.utils import timezone
from . import plans

User = get_user_model()
logger = logging.getLogger(__name__)


def frontend_base_url(request):
    """Where emailed links should point. Uses the configured FRONTEND_URL; for local development
    without it, a trusted local origin. Never the request's Host headers, which can be forged.
    `request` may be None (management commands)."""
    if settings.FRONTEND_URL:
        return settings.FRONTEND_URL
    origin = request.headers.get('Origin', '') if request is not None else ''
    if origin and origin in settings.CORS_ALLOWED_ORIGINS:
        return origin
    if settings.DEBUG:
        return settings.LOCAL_ORIGINS[0]
    return ''


class LoginThrottle(SimpleRateThrottle):
    """Per-IP limit on password logins (rates in REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'])."""
    scope = 'login'

    def get_cache_key(self, request, view):
        return self.cache_format % {'scope': self.scope, 'ident': self.get_ident(request)}


class PasswordResetThrottle(LoginThrottle):
    scope = 'password_reset'


def unique_username(base):
    """A free username from an email's first part (two people can both be "john@...")."""
    from django.contrib.auth.validators import UnicodeUsernameValidator
    import re
    base = re.sub(r'[^\w.@+-]', '', base)[:140] or 'user'
    UnicodeUsernameValidator()(base)
    name, n = base, 1
    while User.objects.filter(username__iexact=name).exists():
        n += 1
        name = f'{base}{n}'
    return name


def set_client_websites(agency, client, slugs):
    """Give a client access to exactly these websites of the agency (and take it away from
    the agency's other sites it had). A site has one client, so choosing a site that another
    client had moves it to this one. Returns an error message, or None."""
    from websites.models import Website
    if not isinstance(slugs, list) or not all(isinstance(s, str) for s in slugs):
        return 'Choose the websites as a list.'
    own = Website.objects.filter(user=agency)
    chosen = own.filter(slug__in=slugs)
    if chosen.count() != len(set(slugs)):
        return 'You can only give access to your own websites.'
    own.filter(client=client).exclude(slug__in=slugs).update(client=None)
    chosen.update(client=client)
    return None


def client_login_problem(username, password, email):
    """What's wrong with a client login an agency is creating or editing, or None.
    `password` is None when it isn't being changed."""
    from django.contrib.auth.validators import UnicodeUsernameValidator
    from django.core.validators import validate_email
    try:
        UnicodeUsernameValidator()(username)
    except DjangoValidationError:
        return 'Username can only have letters, numbers and @ . + - _ (no spaces).'
    if len(username) > 150:
        return 'Username is too long.'
    if password is not None and len(password) < 6:
        return 'Password must be at least 6 characters.'
    if email:
        try:
            validate_email(email)
        except DjangoValidationError:
            return 'Enter a valid email address, or leave it empty.'
    return None


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['list', 'destroy', 'create']:
            return [permissions.IsAdminUser()]
        if self.action in ['retrieve', 'update', 'partial_update']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        # Users may only read or edit their own account (admins: anyone).
        user = self.request.user
        if self.action in ['retrieve', 'update', 'partial_update'] and not user.is_superuser:
            return User.objects.filter(pk=user.pk)
        return User.objects.all()

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny], authentication_classes=[])
    def csrf(self, request):
        # get_token() also makes Django set the csrftoken cookie. The token is returned too, so
        # the frontend can send it in the X-CSRFToken header even when calling from another origin.
        return Response({'csrfToken': get_token(request)})

    # Sign-up is "Continue with Google" only. Open password sign-up let anyone register with
    # someone else's email and be waiting in that account when the real owner arrived via
    # Google, so only an admin can create a password account here.
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        login(request, user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny], throttle_classes=[LoginThrottle])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny], authentication_classes=[], throttle_classes=[PasswordResetThrottle])
    def password_reset(self, request):
        """Email a reset link. Always answers the same way, so it can't reveal which emails exist."""
        email = (request.data.get('email') or '').strip()
        if email:
            for user in User.objects.filter(email__iexact=email, is_active=True):
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)
                base = frontend_base_url(request)
                if not base:
                    logger.error('FRONTEND_URL is not set; cannot email password reset links.')
                    break
                link = f"{base}/reset-password?uid={uid}&token={token}"
                send_mail(
                    'Reset your Jaalam password',
                    f"Hi {user.username},\n\nUse this link to choose a new password (it works once and expires in 3 days):\n{link}\n\n"
                    "If you didn't ask for this, you can ignore this email.",
                    None, [user.email], fail_silently=True,
                )
        return Response({'status': 'If an account uses that email, a reset link has been sent.'})

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny], authentication_classes=[], throttle_classes=[PasswordResetThrottle])
    def password_reset_confirm(self, request):
        try:
            user = User.objects.get(pk=force_str(urlsafe_base64_decode(request.data.get('uid', ''))))
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            user = None
        if not user or not default_token_generator.check_token(user, request.data.get('token', '')):
            return Response({'error': 'This reset link is invalid or has expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)
        password = request.data.get('new_password') or ''
        try:
            validate_password(password, user)
        except DjangoValidationError as e:
            return Response({'error': ' '.join(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(password)
        user.save(update_fields=['password'])
        return Response({'status': 'Password updated. You can sign in now.'})

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def google_login(self, request):
        credential = request.data.get('credential')
        if not credential:
            return Response({"error": "No credential provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # audience: only tokens issued to this app's Google client (not another site's)
            idinfo = id_token.verify_oauth2_token(credential, google_requests.Request(), audience=settings.GOOGLE_CLIENT_ID)
        except ValueError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        email = (idinfo.get('email') or '').strip()
        if not email or not idinfo.get('email_verified'):
            return Response({"error": "Your Google account's email is not verified."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email__iexact=email).order_by('id').first()
        created = user is None
        if created:
            user = User.objects.create_user(username=unique_username(email.split('@')[0]), email=email)
            user.set_unusable_password()
        elif not user.is_active:
            # login() doesn't check this itself: blocked accounts stayed reachable through Google
            return Response({"error": "This account has been blocked. Please contact support."}, status=status.HTTP_403_FORBIDDEN)
        elif not user.email_verified and user.has_usable_password():
            # The email was typed in by someone (old sign-up, or an agency creating a client),
            # never proven. Whoever set that password may not be this person, so it stops
            # working, and changing it also signs out every other session of the account.
            user.set_unusable_password()
        user.email_verified = True
        user.save()

        login(request, user)
        data = self.get_serializer(user).data
        data['is_new_user'] = created
        return Response(data)
            
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def logout(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def toggle_block(self, request, pk=None):
        user = self.get_object()
        if user == request.user:
            return Response({"error": "Cannot block yourself"}, status=400)
        user.is_active = not user.is_active
        user.save()
        
        status_text = "blocked" if not user.is_active else "unblocked"
        create_notification(
            user=user, 
            title=f"Account {status_text.capitalize()}", 
            message=f"Your account has been {status_text} by an administrator.",
            notification_type="account_status"
        )
        
        return Response({"status": status_text})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def toggle_role(self, request, pk=None):
        user = self.get_object()
        if user == request.user:
            return Response({"error": "Cannot change your own role"}, status=400)
        user.is_superuser = not user.is_superuser
        user.is_staff = user.is_superuser
        user.save()
        
        role_text = "Admin" if user.is_superuser else "User"
        create_notification(
            user=user, 
            title="Role Updated", 
            message=f"Your account role has been changed to {role_text}.",
            notification_type="role_update"
        )
        
        return Response({"role": role_text})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def toggle_test_user(self, request, pk=None):
        user = self.get_object()
        user.is_test_user = not getattr(user, 'is_test_user', False)
        user.save()
        
        status_text = "Test User" if user.is_test_user else "Regular User"
        create_notification(
            user=user, 
            title="Account Status Updated", 
            message=f"Your account has been set to {status_text} by an administrator.",
            notification_type="account_status"
        )
        
        return Response({"is_test_user": user.is_test_user})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def set_plan(self, request, pk=None):
        """Admin: grant or change a plan by hand (e.g. after a cash or bank payment).
        Body: {"plan": "BUSINESS", "days": 30}, {"plan": "BUSINESS", "lifetime": true},
        or {"plan": "TEST"} for Free (also removes a lifetime plan)."""
        user = self.get_object()
        code = request.data.get('plan')
        if code not in plans.PLANS:
            return Response({"error": "Unknown plan"}, status=status.HTTP_400_BAD_REQUEST)
        if code == plans.FREE:
            switch_to_free(user)
            user.lifetime_plan = ''
            user.save(update_fields=['lifetime_plan'])
        elif request.data.get('lifetime'):
            user.membership = code
            user.lifetime_plan = code
            user.plan_period = 'LIFETIME'
            user.plan_expires_at = None
            user.plan_reminders_sent = []
            user.has_completed_onboarding = True
            user.save()
        else:
            try:
                days = int(request.data.get('days', 30))
            except (TypeError, ValueError):
                return Response({"error": "days must be a number"}, status=status.HTTP_400_BAD_REQUEST)
            if not 1 <= days <= 3660:
                return Response({"error": "days must be between 1 and 3660"}, status=status.HTTP_400_BAD_REQUEST)
            user.membership = code
            user.plan_period = 'YEARLY' if days >= 365 else 'MONTHLY'
            user.plan_expires_at = timezone.now() + timedelta(days=days)
            user.plan_reminders_sent = []
            user.has_completed_onboarding = True
            user.save()
        create_notification(
            user=user,
            title="Plan updated",
            message=f"An administrator set your plan to {plans.PLANS[code]['name']}.",
            notification_type="subscription",
        )
        return Response(self.get_serializer(user).data)

    @action(detail=False, methods=['get', 'put', 'patch', 'delete'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            sync_plan_status(request.user)
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)

        if request.method == 'DELETE':
            # "Delete account" in the dashboard (this method was missing, so it always failed).
            user = request.user
            logout(request)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['get', 'post'], permission_classes=[permissions.IsAuthenticated])
    def clients(self, request):
        if request.user.role != 'AGENT' and not request.user.is_superuser:
            return Response({"error": "Only agents can manage clients"}, status=status.HTTP_403_FORBIDDEN)
            
        if request.method == 'GET':
            clients = User.objects.filter(agent=request.user, role='CLIENT').prefetch_related('client_websites__content')
            return Response([self._client_row(client) for client in clients])
            
        if request.method == 'POST':
            if not plans.has_feature(request.user, plans.CLIENT_ACCOUNTS):
                return Response({"error": f"Client accounts need the {plans.required_plan_for(plans.CLIENT_ACCOUNTS)} plan.", "upgrade": True}, status=status.HTTP_403_FORBIDDEN)
            # Create a new client
            username = (request.data.get('username') or '').strip()
            password = request.data.get('password') or ''
            email = (request.data.get('email') or '').strip()

            if not username or not password:
                return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
            problem = client_login_problem(username, password, email)
            if problem:
                return Response({"error": problem}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(username__iexact=username).exists():
                return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

            client_user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role='CLIENT',
                agent=request.user,
                has_completed_onboarding=True,  # nothing to set up: the agency's plan applies
            )
            if 'websites' in request.data:
                problem = set_client_websites(request.user, client_user, request.data.get('websites'))
                if problem:
                    client_user.delete()
                    return Response({"error": problem}, status=status.HTTP_400_BAD_REQUEST)
            return Response(self._client_row(client_user), status=status.HTTP_201_CREATED)

    def _client_row(self, client):
        """A client as the Clients page shows it, with the agency's websites it can manage."""
        row = self.get_serializer(client).data
        row['websites'] = [
            {'slug': w.slug, 'name': ((getattr(w, 'content', None) and w.content.settings_json) or {}).get('website_name') or w.slug}
            for w in client.client_websites.all() if w.user_id == client.agent_id
        ]
        return row

    @action(detail=True, methods=['put', 'delete'], permission_classes=[permissions.IsAuthenticated])
    def manage_client(self, request, pk=None):
        if request.user.role != 'AGENT' and not request.user.is_superuser:
            return Response({"error": "Only agents can manage clients"}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            client = User.objects.get(pk=pk, agent=request.user, role='CLIENT')
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
            
        if request.method == 'DELETE':
            client.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        if request.method == 'PUT':
            username = (request.data.get('username') or '').strip()
            email = request.data.get('email')
            email = email.strip() if isinstance(email, str) else email
            password = request.data.get('password') or ''

            problem = client_login_problem(username or client.username, password or None, email or '')
            if problem:
                return Response({"error": problem}, status=status.HTTP_400_BAD_REQUEST)
            if username and User.objects.filter(username__iexact=username).exclude(pk=pk).exists():
                return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

            if 'websites' in request.data:
                problem = set_client_websites(request.user, client, request.data.get('websites'))
                if problem:
                    return Response({"error": problem}, status=status.HTTP_400_BAD_REQUEST)
            if username:
                client.username = username
            if email is not None:
                client.email = email
            if password:
                client.set_password(password)
            client.save()
            return Response(self._client_row(client))

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser and self.request.query_params.get('all') == 'true':
            # Admin "Support Tickets": conversations with users (support threads, and older
            # messages typed by people), not everyone's automatic notifications, which carry
            # their customers' names and phone numbers.
            return Notification.objects.filter(notification_type__in=('support', 'SYSTEM'))
        return self.request.user.notifications.all()

    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        # Only admins address messages to other people. Anyone else can only write into their
        # own inbox (the "message support" thread), never into someone else's: that allowed
        # fake "administrator" messages to any user.
        if not self.request.user.is_superuser and hasattr(serializer, 'fields'):
            serializer.fields['user'].read_only = True
        return serializer

    def perform_create(self, serializer):
        if self.request.user.is_superuser and serializer.validated_data.get('user'):
            serializer.save()
        else:
            serializer.save(user=self.request.user, notification_type='support')

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        notification = self.get_object()
        content = request.data.get('content')
        if not content:
            return Response({"error": "Content is required"}, status=400)
        
        from .models import NotificationMessage
        NotificationMessage.objects.create(
            notification=notification,
            sender=request.user,
            content=content
        )
        
        # Always mark the thread as unread so it bumps up in the inbox
        notification.is_read = False
        notification.save()

        return Response({"status": "replied"})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({"status": "read"})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({"status": "all read"})

from .models import SystemSettings

class SystemSettingsViewSet(viewsets.ViewSet):
    # The maintenance flag is read before anyone logs in; only admins change it (create)
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        settings = SystemSettings.load()
        return Response({"maintenance_mode": settings.maintenance_mode})
        
    def create(self, request):
        if not request.user.is_superuser:
            return Response(status=status.HTTP_403_FORBIDDEN)
        settings = SystemSettings.load()
        settings.maintenance_mode = bool(request.data.get('maintenance_mode', settings.maintenance_mode))
        settings.save()
        return Response({"maintenance_mode": settings.maintenance_mode})

