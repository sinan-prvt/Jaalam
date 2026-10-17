import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, BasePermission
from rest_framework import generics
from users import plans
from users.models import UsageCounter


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
        
        business_name = request.data.get('business_name', 'My Business')
        business_type = request.data.get('business_type', 'Business')
        promotion_details = request.data.get('promotion_details', 'General brand awareness')
        language = request.data.get('language', 'English')
        
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
            
        except Exception as e:
            print("AI Generation Error:", e)
            return Response({'error': 'Failed to generate content. Please try again.'}, status=500)

import requests
import base64

import urllib.parse

class GeneratePosterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        denied = ai_access_error(request.user)
        if denied:
            return denied

        prompt = request.data.get('prompt', '')
        if not prompt:
            return Response({'error': 'Prompt is required.'}, status=400)
            
        try:
            # Using Pollinations.ai instead of Hugging Face to bypass local DNS resolution blocks
            encoded_prompt = urllib.parse.quote(prompt)
            API_URL = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true"
            
            response = requests.get(API_URL)
            if response.status_code != 200:
                print("Image API Error:", response.text)
                return Response({'error': 'Failed to generate poster. Service may be busy.'}, status=500)
                
            image_bytes = response.content
            base64_img = base64.b64encode(image_bytes).decode('utf-8')
            UsageCounter.increment(request.user, 'ai_generations')
            return Response({'image': f'data:image/jpeg;base64,{base64_img}'})
        except Exception as e:
            print("Poster Generation Error:", e)
            return Response({'error': f'Failed to connect to image generator: {str(e)}'}, status=500)

from .models import Blog
from .serializers import BlogSerializer

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
