from rest_framework import serializers
from .models import Website, WebsiteContent, PhysicalOrder, Rsvp

class WebsiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteContent
        fields = '__all__'
        read_only_fields = ('website',)

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
        read_only_fields = ('user',)

class PhysicalOrderSerializer(serializers.ModelSerializer):
    website_slug = serializers.CharField(source='website.slug', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = PhysicalOrder
        fields = '__all__'
        read_only_fields = ('user',)


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
