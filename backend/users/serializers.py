from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Notification, NotificationMessage, Subscription

User = get_user_model()

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    subscription_details = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'membership', 'is_test_user', 'is_superuser', 'is_active', 'subscription_details', 'has_completed_onboarding')

    def get_subscription_details(self, obj):
        latest_sub = obj.subscriptions.order_by('-created_at').first()
        if latest_sub:
            return SubscriptionSerializer(latest_sub).data
        return None

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
