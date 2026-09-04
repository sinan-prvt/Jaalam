from django.urls import path
from .views import GenerateMarketingCopyView, GeneratePosterView, BlogListCreateView, BlogDetailView

urlpatterns = [
    path('generate/', GenerateMarketingCopyView.as_view(), name='generate-marketing'),
    path('poster/', GeneratePosterView.as_view(), name='generate-poster'),
    path('blogs/', BlogListCreateView.as_view(), name='blog-list-create'),
    path('blogs/<int:id>/', BlogDetailView.as_view(), name='blog-detail'),
]
