from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WebsiteViewSet, upload_image

router = DefaultRouter()
router.register(r'', WebsiteViewSet, basename='website')

urlpatterns = [
    path('upload/', upload_image, name='upload_image'),
    path('', include(router.urls)),
]
