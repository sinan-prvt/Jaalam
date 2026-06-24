from rest_framework import serializers
from .models import Website, WebsiteContent

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
