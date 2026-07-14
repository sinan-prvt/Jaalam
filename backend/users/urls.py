from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, NotificationViewSet, SystemSettingsViewSet
from .subscription_views import SubscriptionViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'system-settings', SystemSettingsViewSet, basename='system-settings')
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]
