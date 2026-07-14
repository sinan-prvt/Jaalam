from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import authenticate, login, logout, get_user_model
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .serializers import UserSerializer, NotificationSerializer
from .models import Notification
from .notifications import create_notification

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['list', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        login(request, user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def google_login(self, request):
        credential = request.data.get('credential')
        if not credential:
            return Response({"error": "No credential provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            idinfo = id_token.verify_oauth2_token(credential, google_requests.Request())
            email = idinfo.get('email')
            if not email:
                return Response({"error": "No email from Google"}, status=status.HTTP_400_BAD_REQUEST)
                
            username = email.split('@')[0]
            
            user, created = User.objects.get_or_create(email=email, defaults={'username': username})
            
            login(request, user)
            serializer = self.get_serializer(user)
            data = serializer.data
            data['is_new_user'] = created
            return Response(data)
        except ValueError as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
            
    @action(detail=False, methods=['post'])
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

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
            
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser and self.request.query_params.get('all') == 'true':
            return Notification.objects.all()
        return self.request.user.notifications.all()

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
    def list(self, request):
        settings = SystemSettings.load()
        return Response({"maintenance_mode": settings.maintenance_mode})
        
    def create(self, request):
        if not request.user.is_superuser:
            return Response(status=status.HTTP_403_FORBIDDEN)
        settings = SystemSettings.load()
        settings.maintenance_mode = request.data.get('maintenance_mode', settings.maintenance_mode)
        settings.save()
        return Response({"maintenance_mode": settings.maintenance_mode})

