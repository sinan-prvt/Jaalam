from rest_framework import serializers

from .models import Activity, Customer


def owns_website(user, website):
    return user.is_superuser or website.user_id == user.id or website.client_id == user.id


class ActivitySerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ('id', 'kind', 'text', 'created_at', 'created_by_name')
        read_only_fields = ('created_at',)

    def get_created_by_name(self, obj):
        return obj.created_by.username if obj.created_by else ''

    def validate(self, attrs):
        if attrs.get('kind') in ('STATUS', 'FOLLOW_UP'):
            raise serializers.ValidationError({'kind': 'Status and follow-up entries are added automatically.'})
        if attrs.get('kind', 'NOTE') == 'NOTE' and not attrs.get('text', '').strip():
            raise serializers.ValidationError({'text': 'Write a note.'})
        return attrs


class CustomerSerializer(serializers.ModelSerializer):
    """The owner's view of a lead."""

    class Meta:
        model = Customer
        exclude = ('follow_up_reminded_at',)
        read_only_fields = ('created_at', 'updated_at', 'last_contact_date')

    def validate_website(self, website):
        if not owns_website(self.context['request'].user, website):
            raise serializers.ValidationError('You can only add leads to your own websites.')
        return website

    def validate_value(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError('The value cannot be negative.')
        return value


class PublicLeadSerializer(serializers.ModelSerializer):
    """What a visitor can send from a website's contact form."""
    # The old contact form sent its message as `notes`.
    notes = serializers.CharField(write_only=True, required=False, allow_blank=True, max_length=5000)

    class Meta:
        model = Customer
        fields = ('website', 'name', 'email', 'phone', 'message', 'notes')
        extra_kwargs = {'message': {'max_length': 5000}}

    def validate_website(self, website):
        if not website.published or website.is_blocked:
            raise serializers.ValidationError('This website is not accepting messages.')
        return website

    def create(self, validated_data):
        legacy = validated_data.pop('notes', '')
        validated_data['message'] = validated_data.get('message') or legacy
        return Customer.objects.create(source='WEBSITE', status='NEW', **validated_data)
