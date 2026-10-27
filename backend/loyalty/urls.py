from django.urls import path

from . import views

urlpatterns = [
    path('public/<slug:slug>/', views.public_program_view),
    path('public/<slug:slug>/join/', views.join_view),
    path('public/<slug:slug>/self-stamp/', views.self_stamp_view),
    path('counter/<str:key>/', views.counter_view),
    path('cards/<str:code>/', views.card_view),
    path('cards/<str:code>/stamp/', views.stamp_view),
    path('cards/<str:code>/redeem/', views.redeem_view),
    path('cards/<str:code>/undo/', views.undo_view),
    path('sites/', views.sites_overview_view),
    path('sites/<slug:slug>/', views.site_program_view),
    path('sites/<slug:slug>/members/', views.site_members_view),
    path('sites/<slug:slug>/reset-counter/', views.reset_counter_view),
]
