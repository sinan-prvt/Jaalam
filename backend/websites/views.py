from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, parser_classes, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.core.files.storage import default_storage
import uuid
from django.shortcuts import get_object_or_404
from .models import Website, WebsiteContent
from .serializers import WebsiteSerializer, WebsiteContentSerializer
from rest_framework.exceptions import ValidationError
from users.notifications import create_notification, notify_all_admins
from users import plans


def check_theme_allowed(owner, theme):
    if theme and not plans.theme_allowed(owner, theme):
        raise ValidationError({"error": f"'{theme}' is a premium template. Upgrade to {plans.required_plan_for(plans.PREMIUM_TEMPLATES)} to use it.", "upgrade": True})


def is_paused(website):
    """Sites beyond the owner's plan limit (after a downgrade) are paused, newest first."""
    limit = plans.limit(website.user, 'websites')
    if limit is None:
        return False
    live_ids = Website.objects.filter(user=website.user).order_by('created_at', 'id').values_list('id', flat=True)[:limit]
    return website.id not in set(live_ids)

class WebsiteViewSet(viewsets.ModelViewSet):
    serializer_class = WebsiteSerializer
    lookup_field = 'slug'
    # Logged-in by default; public actions (public, wish) opt out below.
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # 'retrieve' used to return every site to anyone, exposing unpublished drafts;
        # it now goes through the owner/client filter below like list/update.
        if self.action in ['public', 'wish', 'toggle_block']:
            return Website.objects.all()
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser and (self.request.query_params.get('all') == 'true' or self.action == 'retrieve'):
                return Website.objects.all()
            if getattr(self.request.user, 'role', 'AGENT') == 'CLIENT':
                return Website.objects.filter(client=self.request.user)
            return Website.objects.filter(user=self.request.user)
        return Website.objects.none()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def assign_client(self, request, slug=None):
        website = self.get_object()
        if website.user != request.user and not request.user.is_superuser:
            return Response(status=status.HTTP_403_FORBIDDEN)
            
        client_id = request.data.get('client_id')
        if not client_id:
            website.client = None
            website.save()
            return Response({'status': 'Client assignment removed'})
            
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            client = User.objects.get(id=client_id, agent=request.user, role='CLIENT')
            website.client = client
            website.save()
            return Response({'status': 'Client assigned successfully'})
        except User.DoesNotExist:
            return Response({'error': 'Client not found or you do not have permission'}, status=400)

    def perform_create(self, serializer):
        user = self.request.user
        limit = plans.limit(user, 'websites')
        if limit is not None and Website.objects.filter(user=user).count() >= limit:
            raise ValidationError({"error": f"Your {plans.PLANS[plans.effective_plan(user)]['name']} plan allows {limit} website(s). Upgrade to create more.", "upgrade": True})
        check_theme_allowed(user, serializer.validated_data.get('theme'))

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

    def perform_update(self, serializer):
        # Plan rules follow the site owner (a client editing an assigned site uses the owner's plan).
        theme = serializer.validated_data.get('theme')
        if theme and theme != serializer.instance.theme:
            check_theme_allowed(serializer.instance.user, theme)
        serializer.save()

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
            # Allow the owner to view their own unpublished site
            if not (request.user.is_authenticated and request.user == website.user):
                return Response({'error': 'Website is not published'}, status=403)
            
        if getattr(website, 'is_blocked', False):
            return Response({'error': 'Website is suspended'}, status=403)

        if is_paused(website) and not (request.user.is_authenticated and request.user == website.user):
            return Response({'error': 'paused', 'message': 'This website is temporarily paused.'}, status=403)
            
        if not hasattr(website, 'content'):
            # Auto-create content if missing even on public view to prevent crashes
            WebsiteContent.objects.create(website=website)
            
        # Increment visitor count
        website.visitors_count += 1
        website.save(update_fields=['visitors_count'])
            
        serializer = WebsiteSerializer(website)
        return Response(serializer.data)

    # No authentication: guests tap this anonymously, and it must also work for a logged-in
    # owner viewing their own invitation (session auth would demand a CSRF token).
    @action(detail=True, methods=['get', 'post'], permission_classes=[permissions.AllowAny], authentication_classes=[])
    def wish(self, request, slug=None):
        website = self.get_object()
        if not hasattr(website, 'content'):
            content = WebsiteContent.objects.create(website=website)
        else:
            content = website.content
            
        settings = content.settings_json or {}
        wedding = settings.get('wedding', {})
        current_count = wedding.get('wish_count', 48)

        if request.method == 'POST':
            increment = int(request.data.get('increment', 1))
            current_count = max(0, current_count + increment)
            wedding['wish_count'] = current_count
            settings['wedding'] = wedding
            content.settings_json = settings
            content.save(update_fields=['settings_json'])

        return Response({'wish_count': current_count})

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

# Uploads are served back from /media/, so only real images and audio are accepted: anything
# else (HTML, SVG, scripts) could be used to host pages or scripts on the site's own domain.
IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp', 'gif'}
AUDIO_EXTENSIONS = {'mp3', 'wav', 'ogg', 'm4a', 'aac'}
MAX_IMAGE_BYTES = 15 * 1024 * 1024
MAX_AUDIO_BYTES = 25 * 1024 * 1024


def _validate_upload(file_obj):
    ext = file_obj.name.rsplit('.', 1)[-1].lower() if '.' in file_obj.name else ''
    if ext in IMAGE_EXTENSIONS:
        if file_obj.size > MAX_IMAGE_BYTES:
            return None, 'Image is too large (max 15 MB).'
        try:
            from PIL import Image
            with Image.open(file_obj) as img:
                img.verify()
        except Exception:
            return None, 'This file is not a valid image.'
        file_obj.seek(0)
        return ext, None
    if ext in AUDIO_EXTENSIONS:
        if file_obj.size > MAX_AUDIO_BYTES:
            return None, 'Audio file is too large (max 25 MB).'
        if not (file_obj.content_type or '').startswith(('audio/', 'video/mp4', 'application/octet-stream')):
            return None, 'This file is not a valid audio file.'
        return ext, None
    return None, 'Only images (JPG, PNG, WebP, GIF) and audio (MP3, WAV, OGG, M4A) can be uploaded.'


MAX_IMAGE_SIDE = 2000  # px; plenty for full-screen covers, and keeps invitations fast on mobile data


def _optimize_image(file_obj, ext):
    """Shrink big photos and re-compress them. Returns (file, ext); unchanged if not worth it."""
    if ext == 'gif':
        return file_obj, ext  # may be animated
    from io import BytesIO
    from django.core.files.base import ContentFile
    from PIL import Image, ImageOps
    try:
        with Image.open(file_obj) as img:
            img = ImageOps.exif_transpose(img)  # phone photos: apply the camera's rotation
            if max(img.size) > MAX_IMAGE_SIDE:
                img.thumbnail((MAX_IMAGE_SIDE, MAX_IMAGE_SIDE), Image.LANCZOS)
            out = BytesIO()
            if ext in ('jpg', 'jpeg'):
                img.convert('RGB').save(out, 'JPEG', quality=82, optimize=True, progressive=True)
            elif ext == 'webp':
                img.save(out, 'WEBP', quality=82, method=4)
            else:  # png
                img.save(out, 'PNG', optimize=True)
    except Exception:
        file_obj.seek(0)
        return file_obj, ext
    if out.tell() >= file_obj.size:
        file_obj.seek(0)
        return file_obj, ext  # already well compressed
    return ContentFile(out.getvalue()), ext


@api_view(['POST'])
@parser_classes([MultiPartParser])
@permission_classes([permissions.IsAuthenticated])
def upload_image(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No image provided'}, status=400)

    file_obj = request.FILES['image']
    ext, error = _validate_upload(file_obj)
    if error:
        return Response({'error': error}, status=400)
    if ext in IMAGE_EXTENSIONS:
        file_obj, ext = _optimize_image(file_obj, ext)
    filename = f"{uuid.uuid4()}.{ext}"

    saved_path = default_storage.save(filename, file_obj)
    file_url = request.build_absolute_uri(default_storage.url(saved_path))
    
    return Response({'url': file_url})

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
