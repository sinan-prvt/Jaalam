import re

from rest_framework import serializers

from .models import LoyaltyProgram


class LoyaltyProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyProgram
        fields = ['reward', 'stamps_required', 'icon', 'color', 'max_stamps_per_day', 'terms', 'is_active',
                  'stamp_mode', 'latitude', 'longitude', 'radius_m']

    def validate(self, attrs):
        mode = attrs.get('stamp_mode', getattr(self.instance, 'stamp_mode', 'SCREEN'))
        lat = attrs.get('latitude', getattr(self.instance, 'latitude', None))
        lng = attrs.get('longitude', getattr(self.instance, 'longitude', None))
        if mode == 'PRINTED' and (lat is None or lng is None):
            raise serializers.ValidationError('Set the shop location first: the printed QR only stamps phones at the shop.')
        if lat is not None and not -90 <= lat <= 90 or lng is not None and not -180 <= lng <= 180:
            raise serializers.ValidationError('That location is not valid.')
        return attrs

    def validate_color(self, value):
        if not re.fullmatch(r'#[0-9a-fA-F]{6}', value):
            raise serializers.ValidationError('Use a colour like #ea580c.')
        return value

    def validate_reward(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Say what the reward is, e.g. "Free coffee".')
        return value


class SelfStampSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=24)
    token = serializers.CharField(max_length=32, required=False, allow_blank=True)
    pin = serializers.CharField(max_length=8, required=False, allow_blank=True)  # today's code from the cashier
    latitude = serializers.FloatField(required=False, min_value=-90, max_value=90)
    longitude = serializers.FloatField(required=False, min_value=-180, max_value=180)


class JoinSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=30)

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Please enter your name.')
        return value

    def validate_phone(self, value):
        phone = normalize_phone(value)
        if not phone:
            raise serializers.ValidationError('Please enter a valid phone number.')
        return phone


def normalize_phone(value):
    """Digits only, without the India country code or a leading 0, so "+91 98470 12345",
    "098470 12345" and "9847012345" are the same card. Empty when it isn't a phone number."""
    digits = re.sub(r'\D', '', value or '')
    if len(digits) == 12 and digits.startswith('91'):
        digits = digits[2:]
    elif len(digits) == 11 and digits.startswith('0'):
        digits = digits[1:]
    return digits if 7 <= len(digits) <= 15 else ''
