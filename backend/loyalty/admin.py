from django.contrib import admin

from .models import LoyaltyCard, LoyaltyProgram, StampEvent


@admin.register(LoyaltyProgram)
class LoyaltyProgramAdmin(admin.ModelAdmin):
    list_display = ('website', 'reward', 'stamps_required', 'is_active', 'created_at')
    search_fields = ('website__slug', 'reward')


@admin.register(LoyaltyCard)
class LoyaltyCardAdmin(admin.ModelAdmin):
    list_display = ('customer', 'program', 'phone', 'stamps', 'rewards_redeemed', 'last_stamp_at')
    search_fields = ('customer__name', 'phone', 'code', 'program__website__slug')
    readonly_fields = ('code',)


@admin.register(StampEvent)
class StampEventAdmin(admin.ModelAdmin):
    list_display = ('card', 'kind', 'by_user', 'created_at')
    list_filter = ('kind',)
