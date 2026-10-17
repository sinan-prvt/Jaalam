from rest_framework import serializers
from .models import Website, WebsiteContent, PhysicalOrder

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
