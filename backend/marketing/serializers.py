from rest_framework import serializers
from .models import Blog, PosterDraft

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'
        read_only_fields = ('id', 'slug', 'created_at', 'updated_at')


class PosterDraftListSerializer(serializers.ModelSerializer):
    """Library grid: everything but the (large) content."""
    class Meta:
        model = PosterDraft
        fields = ('id', 'name', 'template_id', 'format', 'thumbnail', 'created_at', 'updated_at')


class PosterDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosterDraft
        fields = ('id', 'name', 'template_id', 'format', 'content', 'thumbnail', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
