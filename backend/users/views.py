from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import authenticate, login, logout, get_user_model
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .serializers import UserSerializer

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
            return Response(serializer.data)
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
        return Response({"status": "blocked" if not user.is_active else "unblocked"})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def toggle_role(self, request, pk=None):
        user = self.get_object()
        if user == request.user:
            return Response({"error": "Cannot change your own role"}, status=400)
        user.is_superuser = not user.is_superuser
        user.is_staff = user.is_superuser
        user.save()
        return Response({"role": "Admin" if user.is_superuser else "User"})

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
            
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
