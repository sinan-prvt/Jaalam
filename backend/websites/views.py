from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.core.files.storage import default_storage
import uuid
from django.shortcuts import get_object_or_404
from .models import Website, WebsiteContent
from .serializers import WebsiteSerializer, WebsiteContentSerializer

class WebsiteViewSet(viewsets.ModelViewSet):
    serializer_class = WebsiteSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        if self.action in ['public', 'retrieve']:
            return Website.objects.all()
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser and self.request.query_params.get('all') == 'true':
                return Website.objects.all()
            return Website.objects.filter(user=self.request.user)
        return Website.objects.none()

    def perform_create(self, serializer):
        website = serializer.save(user=self.request.user)
        # Create default content
        WebsiteContent.objects.create(
            website=website,
            hero_title=f"Welcome to {website.slug}",
            about_text="Add your business description here."
        )

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def public(self, request, slug=None):
        website = self.get_object()
        
        if not website.published:
            return Response({'error': 'Website is not published'}, status=403)
            
        if not hasattr(website, 'content'):
            # Auto-create content if missing even on public view to prevent crashes
            WebsiteContent.objects.create(website=website)
            
        # Increment visitor count
        website.visitors_count += 1
        website.save(update_fields=['visitors_count'])
            
        serializer = WebsiteSerializer(website)
        return Response(serializer.data)

    @action(detail=True, methods=['put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def content(self, request, slug=None):
        website = self.get_object()
        if website.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
            
        if not hasattr(website, 'content'):
            content = WebsiteContent.objects.create(website=website)
        else:
            content = website.content
            
        serializer = WebsiteContentSerializer(content, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_image(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No image provided'}, status=400)
    
    file_obj = request.FILES['image']
    ext = file_obj.name.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    
    saved_path = default_storage.save(filename, file_obj)
    file_url = request.build_absolute_uri(default_storage.url(saved_path))
    
    return Response({'url': file_url})
