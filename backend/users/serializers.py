from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Notification, NotificationMessage

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'membership', 'is_superuser', 'is_active')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class NotificationMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = NotificationMessage
        fields = ('id', 'notification', 'sender', 'sender_name', 'content', 'created_at')
        read_only_fields = ('sender',)

class NotificationSerializer(serializers.ModelSerializer):
    messages = NotificationMessageSerializer(many=True, read_only=True)

    class Meta:
        model = Notification
        fields = ('id', 'user', 'title', 'message', 'is_read', 'created_at', 'notification_type', 'messages')
