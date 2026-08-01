from django.urls import path
from .views import GenerateMarketingCopyView

urlpatterns = [
    path('generate/', GenerateMarketingCopyView.as_view(), name='generate-marketing'),
]
