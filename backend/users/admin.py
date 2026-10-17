from django.contrib import admin

from django.contrib.auth.admin import UserAdmin
from .models import User, Subscription, UsageCounter

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Plan', {'fields': ('membership', 'plan_period', 'plan_expires_at', 'lifetime_plan', 'plan_reminders_sent', 'is_test_user')}),
    )
    list_display = UserAdmin.list_display + ('membership', 'plan_expires_at', 'is_test_user')
    list_filter = UserAdmin.list_filter + ('membership',)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan_type', 'billing_period', 'amount', 'status', 'period_end', 'created_at')
    list_filter = ('status', 'plan_type', 'billing_period')
    search_fields = ('user__username', 'user__email', 'razorpay_order_id', 'razorpay_payment_id')


@admin.register(UsageCounter)
class UsageCounterAdmin(admin.ModelAdmin):
    list_display = ('user', 'key', 'period', 'count')
    list_filter = ('key', 'period')


admin.site.register(User, CustomUserAdmin)
