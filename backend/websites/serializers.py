from rest_framework import serializers
from .models import Website, WebsiteContent, PhysicalOrder, Rsvp

class WebsiteContentSerializer(serializers.ModelSerializer):
    # Fields the editors and themes use that have no model column (hero subtitle,
    # event date, invitation hero). They are kept in settings_json['content_extra']
    # and returned at the top level, so a save no longer drops them.
    EXTRA_FIELDS = ('hero_description', 'hero_text', 'hero_subtitle', 'date', 'hero')

    class Meta:
        model = WebsiteContent
        fields = '__all__'
        read_only_fields = ('website',)

    def to_internal_value(self, data):
        extra = {k: data[k] for k in self.EXTRA_FIELDS if k in data}
        validated = super().to_internal_value(data)
        if extra:
            current = self.instance.settings_json if self.instance else {}
            settings = dict(validated.get('settings_json', current) or {})
            settings['content_extra'] = {**(settings.get('content_extra') or {}), **extra}
            validated['settings_json'] = settings
        return validated

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        for key, value in ((instance.settings_json or {}).get('content_extra') or {}).items():
            if key in self.EXTRA_FIELDS:
                rep.setdefault(key, value)
        return rep

class WebsiteSerializer(serializers.ModelSerializer):
    content = WebsiteContentSerializer(read_only=True)
    # "Crafted on Jaalam" credit is shown unless the owner's plan removes branding.
    show_branding = serializers.SerializerMethodField()

    def get_show_branding(self, obj):
        from users.plans import REMOVE_BRANDING, has_feature
        return not has_feature(obj.user, REMOVE_BRANDING)
    
    class Meta:
        model = Website
        fields = '__all__'
        # Domains change only through the verified connect flow (/domain/ endpoints); the client
        # only through assign_client (agency's own clients); blocking only by an admin
        # (toggle_block); visitors only by real visits.
        read_only_fields = ('user', 'custom_domain', 'domain_token', 'domain_verified', 'domain_verified_at',
                            'client', 'is_blocked', 'visitors_count')

class PhysicalOrderSerializer(serializers.ModelSerializer):
    website_slug = serializers.CharField(source='website.slug', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = PhysicalOrder
        fields = '__all__'
        read_only_fields = ('user',)

    # Payment and delivery are set by the Razorpay check and by admins, never by the
    # customer (who could otherwise mark their own order paid or delivered).
    STAFF_ONLY_FIELDS = ('status', 'payment_status', 'razorpay_order_id', 'razorpay_payment_id')

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if not (request and request.user.is_superuser):
            for name in self.STAFF_ONLY_FIELDS:
                fields[name].read_only = True
        return fields

    def validate_website(self, website):
        user = self.context['request'].user
        if not (user.is_superuser or website.user_id == user.id or website.client_id == user.id):
            raise serializers.ValidationError('You can only order stickers for your own website.')
        return website


class RsvpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rsvp
        fields = ('id', 'name', 'attending', 'message', 'answers', 'created_at')
        read_only_fields = ('created_at',)
        extra_kwargs = {'message': {'max_length': 2000}}

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Please enter your name.')
        return value

    def validate_answers(self, value):
        # Free-form extra fields from the theme's form ("Dietary needs": "None"); keep it small.
        if not isinstance(value, dict) or len(value) > 10:
            raise serializers.ValidationError('Too many answers.')
        cleaned = {}
        for key, answer in value.items():
            if not isinstance(answer, (str, int, float, bool)):
                raise serializers.ValidationError('Answers must be plain text.')
            cleaned[str(key).strip()[:80]] = str(answer).strip()[:500]
        return cleaned
