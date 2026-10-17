from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InvoiceViewSet, public_invoice

router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet, basename='invoice')

urlpatterns = [
    path('public/<uuid:token>/', public_invoice, name='public_invoice'),
    path('', include(router.urls)),
]
