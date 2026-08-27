"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
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
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
