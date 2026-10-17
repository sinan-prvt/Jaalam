from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter
from .views import WebsiteViewSet, upload_image, PhysicalOrderViewSet
from .share import share_preview

router = DefaultRouter()
router.register(r'', WebsiteViewSet, basename='website')

orders_router = SimpleRouter()
orders_router.register(r'physical-orders', PhysicalOrderViewSet, basename='physicalorder')

urlpatterns = [
    path('upload/', upload_image, name='upload_image'),
    # Link-preview HTML for crawlers (WhatsApp, Facebook...); see share.py and frontend/vercel.json
    path('share/<slug:slug>/', share_preview, name='share_preview'),
    path('', include(orders_router.urls)),
    path('', include(router.urls)),
]
