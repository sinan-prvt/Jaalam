from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.core.files.storage import default_storage
import uuid
from django.shortcuts import get_object_or_404
from .models import Website, WebsiteContent
from .serializers import WebsiteSerializer, WebsiteContentSerializer
from .ai_service import generate_website_json, modify_website_json
from users.notifications import create_notification, notify_all_admins

class WebsiteViewSet(viewsets.ModelViewSet):
    serializer_class = WebsiteSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        if self.action in ['public', 'retrieve', 'toggle_block']:
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
        
        notify_all_admins(
            title="New Website Created",
            message=f"User {self.request.user.username} created a new website: {website.slug}",
            notification_type="new_website"
        )

    def perform_destroy(self, instance):
        if self.request.user.is_superuser and instance.user != self.request.user:
            create_notification(
                user=instance.user,
                title="Website Deleted",
                message=f"Your website '{instance.slug}' has been permanently deleted by an administrator.",
                notification_type="website_deleted"
            )
        super().perform_destroy(instance)

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def public(self, request, slug=None):
        website = self.get_object()
        
        if not website.published:
            return Response({'error': 'Website is not published'}, status=403)
            
        if getattr(website, 'is_blocked', False):
            return Response({'error': 'Website is suspended'}, status=403)
            
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
        
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_block(self, request, slug=None):
        if not request.user.is_superuser:
            return Response(status=status.HTTP_403_FORBIDDEN)
        website = self.get_object()
        website.is_blocked = not getattr(website, 'is_blocked', False)
        website.save()
        
        status_text = "suspended" if website.is_blocked else "restored"
        create_notification(
            user=website.user,
            title=f"Website {status_text.capitalize()}",
            message=f"Your website '{website.slug}' has been {status_text} by an administrator.",
            notification_type="website_status"
        )
        
        return Response({"status": "blocked" if website.is_blocked else "unblocked"})

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

@api_view(['POST'])
def generate_website(request):
    name = request.data.get('name')
    description = request.data.get('description')
    contact = request.data.get('contact', '')
    vibe = request.data.get('vibe', 'Modern')
    category = request.data.get('category', 'Other')
    
    if not description or not name:
        return Response({'error': 'Name and description are required'}, status=400)
        
    try:
        data = generate_website_json(name, description, contact, vibe, category)
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def chat_website(request):
    prompt = request.data.get('prompt')
    current_content = request.data.get('current_content')
    image_urls = request.data.get('image_urls', [])
    
    # Backwards compatibility if frontend still sends single image_url
    single_image_url = request.data.get('image_url')
    if single_image_url and single_image_url not in image_urls:
        image_urls.append(single_image_url)
    
    if not prompt or not current_content:
        return Response({'error': 'Prompt and current_content are required'}, status=400)
        
    try:
        data = modify_website_json(prompt, current_content, image_urls)
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
