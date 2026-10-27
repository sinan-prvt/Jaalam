from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InvoiceViewSet, ProductViewSet, public_invoice

router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('public/<uuid:token>/', public_invoice, name='public_invoice'),
    path('', include(router.urls)),
]
