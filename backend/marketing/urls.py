from django.urls import path
from .views import GenerateMarketingCopyView, GeneratePosterView

urlpatterns = [
    path('generate/', GenerateMarketingCopyView.as_view(), name='generate-marketing'),
    path('poster/', GeneratePosterView.as_view(), name='generate-poster'),
]
