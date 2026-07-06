from django.contrib import admin

from django.contrib.auth.admin import UserAdmin
from .models import User, Subscription

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('membership', 'is_test_user')}),
    )
    list_display = UserAdmin.list_display + ('membership', 'is_test_user')

admin.site.register(User, CustomUserAdmin)
admin.site.register(Subscription)
