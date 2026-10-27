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
    plan = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'membership', 'role', 'agent', 'is_test_user', 'is_superuser', 'is_active', 'subscription_details', 'has_completed_onboarding', 'plan', 'plan_expires_at', 'plan_period', 'lifetime_plan')

    def get_plan(self, obj):
        from .plans import plan_summary
        return plan_summary(obj)

    def get_subscription_details(self, obj):
        latest_sub = obj.subscriptions.order_by('-created_at').first()
        if latest_sub:
            return SubscriptionSerializer(latest_sub).data
        return None

    # Only admins may change these; for everyone else they are read-only (previously anyone
    # could PATCH themselves to is_superuser or a paid membership).
    ADMIN_ONLY_FIELDS = ('membership', 'role', 'agent', 'is_test_user', 'is_superuser', 'is_active', 'has_completed_onboarding', 'plan_expires_at', 'plan_period', 'lifetime_plan')

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if not (request and request.user.is_authenticated and request.user.is_superuser):
            for name in self.ADMIN_ONLY_FIELDS:
                if name in fields:
                    fields[name].read_only = True
            # Email is the Google identity (google_login finds the account by it); letting a
            # user rename theirs to someone else's would hand them that person's sign-in.
            # Passwords change through the reset email, not a bare PATCH from a session.
            fields['email'].read_only = True
            fields.pop('password', None)
        return fields

    def validate_password(self, value):
        from django.contrib.auth.password_validation import validate_password
        validate_password(value)
        return value

    def update(self, instance, validated_data):
        # Hash new passwords instead of storing them as plain text.
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save(update_fields=['password'])
        return instance

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
