import os
import json
import logging
from rest_framework.views import APIView
from rest_framework.throttling import UserRateThrottle
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, BasePermission
from rest_framework import generics
from users import plans
from users.models import UsageCounter

logger = logging.getLogger(__name__)


class AiThrottle(UserRateThrottle):
    scope = 'ai'


def ai_access_error(user):
    """Response explaining why the user can't generate (plan or monthly quota), else None."""
    if not plans.has_feature(user, plans.AI_MARKETING):
        return Response({'error': f'AI marketing needs the {plans.required_plan_for(plans.AI_MARKETING)} plan or higher.', 'upgrade': True}, status=403)
    quota = plans.limit(user, 'ai_generations')
    if quota is not None and UsageCounter.current(user, 'ai_generations') >= quota:
        return Response({'error': f'You have used all {quota} AI generations for this month. They reset on the 1st, or upgrade for more.', 'upgrade': True}, status=403)
    return None

class IsAdminUserOrReadOnly(BasePermission):
    """
    Custom permission to only allow admins to edit it.
    """
    def has_permission(self, request, view):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return request.user and request.user.is_authenticated and request.user.is_superuser

from google import genai

class GenerateMarketingCopyView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AiThrottle]

    def post(self, request):
        denied = ai_access_error(request.user)
        if denied:
            return denied

        try:
            from decouple import config
            api_key = config("GEMINI_API_KEY", default=None)
        except ImportError:
            api_key = os.environ.get("GEMINI_API_KEY")

        if not api_key:
            return Response({'error': 'GEMINI_API_KEY is not configured on the server.'}, status=500)

        client = genai.Client(api_key=api_key)
        
        # Lengths capped: these go into a paid AI prompt
        business_name = str(request.data.get('business_name') or 'My Business')[:150]
        business_type = str(request.data.get('business_type') or 'Business')[:80]
        promotion_details = str(request.data.get('promotion_details') or 'General brand awareness')[:1500]
        language = str(request.data.get('language') or 'English')[:40]
        
        prompt = f"""
        You are an expert digital marketer. 
        Create a marketing campaign for a {business_type} named "{business_name}".
        The campaign focus/promotion is: "{promotion_details}".

        Generate high-converting, engaging copy for the following channels.
        IMPORTANT: All marketing copy MUST be written natively in the {language} language.
        Respond ONLY with a valid JSON object matching exactly this schema, with no markdown formatting or extra text outside the JSON:
        {{
            "instagram": "Engaging instagram caption with emojis and hashtags",
            "facebook": "Professional yet engaging facebook post",
            "whatsapp": "Short, punchy whatsapp broadcast message",
            "email_subject": "Catchy email subject line",
            "email_body": "Full email body (can use basic HTML like <br> or <strong>)",
            "sms": "Very short SMS text (under 160 chars)",
            "banner_text": "Short catchy headline for a banner image",
            "video_script": "A 15-second TikTok/Reels video script with visual directions and a catchy hook"
        }}
        """

        try:
            response = client.models.generate_content(
                model='gemini-3.5-flash',
                contents=prompt
            )
            
            text_response = response.text
            # Clean up markdown if the model accidentally included it
            if text_response.startswith("```json"):
                text_response = text_response[7:-3]
            elif text_response.startswith("```"):
                text_response = text_response[3:-3]
                
            data = json.loads(text_response.strip())
            UsageCounter.increment(request.user, 'ai_generations')
            return Response(data)
            
        except Exception:
            logger.exception('AI copy generation failed')
            return Response({'error': 'Failed to generate content. Please try again.'}, status=500)

import requests
import base64

import urllib.parse

class GeneratePosterView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AiThrottle]

    def post(self, request):
        denied = ai_access_error(request.user)
        if denied:
            return denied

        prompt = str(request.data.get('prompt', '')).strip()[:1000]
        if not prompt:
            return Response({'error': 'Prompt is required.'}, status=400)

        try:
            # Using Pollinations.ai instead of Hugging Face to bypass local DNS resolution blocks
            encoded_prompt = urllib.parse.quote(prompt)
            API_URL = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true"

            # A timeout, so a slow image service can't hold a server worker forever
            response = requests.get(API_URL, timeout=60)
            if response.status_code != 200 or not response.headers.get('Content-Type', '').startswith('image/'):
                logger.warning('Image API error %s', response.status_code)
                return Response({'error': 'Failed to generate poster. Service may be busy.'}, status=502)

            base64_img = base64.b64encode(response.content).decode('utf-8')
            UsageCounter.increment(request.user, 'ai_generations')
            return Response({'image': f'data:image/jpeg;base64,{base64_img}'})
        except requests.RequestException:
            logger.exception('Poster generation failed')
            return Response({'error': 'Could not reach the image generator. Please try again.'}, status=502)

from .models import Blog, PosterDraft
from .serializers import BlogSerializer, PosterDraftListSerializer, PosterDraftSerializer

class BlogListCreateView(generics.ListCreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        # Admin sees all, public sees only published
        if self.request.user and self.request.user.is_authenticated and self.request.user.is_superuser:
            return Blog.objects.all().order_by('-created_at')
        return Blog.objects.filter(published=True).order_by('-created_at')

class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = 'id'


class PosterDraftListCreateView(generics.ListCreateAPIView):
    """The signed-in user's saved posters (newest first), and saving a new one."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PosterDraft.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        return PosterDraftListSerializer if self.request.method == 'GET' else PosterDraftSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PosterDraftDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PosterDraftSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return PosterDraft.objects.filter(user=self.request.user)
