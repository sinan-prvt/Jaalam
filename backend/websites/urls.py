from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter
from .views import WebsiteViewSet, upload_image, PhysicalOrderViewSet

router = DefaultRouter()
router.register(r'', WebsiteViewSet, basename='website')

orders_router = SimpleRouter()
orders_router.register(r'physical-orders', PhysicalOrderViewSet, basename='physicalorder')

urlpatterns = [
    path('upload/', upload_image, name='upload_image'),
    path('', include(orders_router.urls)),
    path('', include(router.urls)),
]
