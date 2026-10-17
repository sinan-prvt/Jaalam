from django.contrib import admin

from .models import Activity, Customer


class ActivityInline(admin.TabularInline):
    model = Activity
    extra = 0


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'website', 'status', 'source', 'follow_up_at', 'created_at')
    list_filter = ('status', 'source')
    search_fields = ('name', 'email', 'phone', 'website__slug')
    inlines = [ActivityInline]
