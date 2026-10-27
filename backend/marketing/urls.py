from django.urls import path
from .views import GenerateMarketingCopyView, GeneratePosterView, BlogListCreateView, BlogDetailView, PosterDraftListCreateView, PosterDraftDetailView

urlpatterns = [
    path('generate/', GenerateMarketingCopyView.as_view(), name='generate-marketing'),
    path('poster/', GeneratePosterView.as_view(), name='generate-poster'),
    path('blogs/', BlogListCreateView.as_view(), name='blog-list-create'),
    path('poster-drafts/', PosterDraftListCreateView.as_view(), name='poster-draft-list'),
    path('poster-drafts/<int:id>/', PosterDraftDetailView.as_view(), name='poster-draft-detail'),
    path('blogs/<int:id>/', BlogDetailView.as_view(), name='blog-detail'),
]
