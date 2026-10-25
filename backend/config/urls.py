"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.urls import re_path
from django.views.static import serve
from django.http import JsonResponse

def home_view(request):
    return JsonResponse({
        "status": "online",
        "message": "Jaalam Backend API is running successfully!",
        "database": "Connected to Neon PostgreSQL"
    })

urlpatterns = [
    path('', home_view),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/websites/', include('websites.urls')),
    path('api/customers/', include('customers.urls')),
    path('api/billing/', include('billing.urls')),
    path('api/marketing/', include('marketing.urls')),
    path('api/loyalty/', include('loyalty.urls')),
]

# Uploaded photos/music. Served in every mode: uploads are limited to images and audio
# (websites/views.py), so this can't host scripts or HTML.
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
