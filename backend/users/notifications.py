from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()

def create_notification(user, title, message, notification_type='system'):
    Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type
    )

def notify_all_admins(title, message, notification_type='admin_alert'):
    admins = User.objects.filter(is_superuser=True)
    notifications = [
        Notification(user=admin, title=title, message=message, notification_type=notification_type)
        for admin in admins
    ]
    Notification.objects.bulk_create(notifications)
