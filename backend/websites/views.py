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
        user = self.request.user
        current_count = Website.objects.filter(user=user).count()
        
        limit = {
            'TEST': 1,
            'STARTER': 2,
            'BUSINESS': 10,
            'PREMIUM': float('inf')
        }.get(user.membership, 1)

        if current_count >= limit and not user.is_test_user and not user.is_superuser:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"error": f"Website limit reached for your plan."})

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

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def check_slug(self, request):
        slug = request.query_params.get('slug')
        if not slug:
            return Response({'error': 'Slug parameter is required'}, status=400)
        
        exists = Website.objects.filter(slug=slug).exists()
        return Response({'available': not exists})

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

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser], permission_classes=[permissions.IsAuthenticated])
    def upload_template(self, request, slug=None):
        website = self.get_object()
        if website.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
            
        if 'template' not in request.FILES:
            return Response({'error': 'No template file provided'}, status=400)
            
        file_obj = request.FILES['template']
        if not file_obj.name.endswith('.json'):
            return Response({'error': 'Only JSON templates are supported'}, status=400)
            
        try:
            import json
            template_data = json.loads(file_obj.read().decode('utf-8'))
            
            if not isinstance(template_data, dict):
                return Response({'error': 'Invalid template format'}, status=400)
                
            if not hasattr(website, 'content'):
                content = WebsiteContent.objects.create(website=website)
            else:
                content = website.content
                
            allowed_fields = ['settings_json', 'custom_blocks_json', 'custom_css', 'custom_html', 'hero_title', 'about_text', 'services_json', 'gallery_json', 'contact_info', 'products_json']
            for field in allowed_fields:
                if field in template_data:
                    setattr(content, field, template_data[field])
            
            content.save()
            
            website_updated = False
            if 'theme' in template_data and template_data['theme']:
                website.theme = template_data['theme']
                website_updated = True
            if 'business_type' in template_data and template_data['business_type']:
                website.business_type = template_data['business_type']
                website_updated = True
                
            if website_updated:
                website.save()
                
            serializer = WebsiteContentSerializer(content)
            website_serializer = WebsiteSerializer(website)
            return Response({
                'message': 'Template applied successfully', 
                'content': serializer.data,
                'website': website_serializer.data
            })
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON file'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

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

class PhysicalOrderViewSet(viewsets.ModelViewSet):
    serializer_class = __import__('websites.serializers', fromlist=['PhysicalOrderSerializer']).PhysicalOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        from .models import PhysicalOrder
        if self.request.user.is_superuser:
            return PhysicalOrder.objects.all().order_by('-created_at')
        return PhysicalOrder.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        # Notify admins
        from users.notifications import notify_all_admins
        notify_all_admins(
            title="New Physical Order",
            message=f"User {self.request.user.username} placed a new QR code sticker order.",
            notification_type="new_order"
        )
