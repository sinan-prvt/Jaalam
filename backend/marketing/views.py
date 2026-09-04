import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, BasePermission
from rest_framework import generics

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
        # Allow only paid users or admins
        if request.user.membership not in ['BUSINESS', 'PREMIUM'] and not request.user.is_superuser and not request.user.is_test_user:
            return Response({'error': 'Upgrade to Business or Premium to use the AI Marketing Center.'}, status=403)

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
        if request.user.membership not in ['BUSINESS', 'PREMIUM'] and not request.user.is_superuser and not request.user.is_test_user:
            return Response({'error': 'Upgrade to Business or Premium to use the AI Poster Generator.'}, status=403)

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
