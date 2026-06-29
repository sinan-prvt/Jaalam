from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WebsiteViewSet, upload_image, generate_website, chat_website

router = DefaultRouter()
router.register(r'', WebsiteViewSet, basename='website')

urlpatterns = [
    path('generate/', generate_website, name='generate_website'),
    path('chat/', chat_website, name='chat_website'),
    path('upload/', upload_image, name='upload_image'),
    path('', include(router.urls)),
]
