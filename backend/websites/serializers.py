from rest_framework import serializers
from .models import Website, WebsiteContent, PhysicalOrder

class WebsiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteContent
        fields = '__all__'
        read_only_fields = ('website',)

class WebsiteSerializer(serializers.ModelSerializer):
    content = WebsiteContentSerializer(read_only=True)
    
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
