import requests
import json
import logging
import re

logger = logging.getLogger(__name__)

OLLAMA_API_URL = "http://localhost:11434/api/generate"
DEFAULT_MODEL = "phi:latest" # Smarter model required for complex layouts

def generate_website_json(name: str, description: str, contact: str, vibe: str, category: str) -> dict:
    """
    Calls the local Ollama instance to generate website JSON structure based on the structured inputs.
    """
    system_prompt = f"""
    You are an expert web designer AI. Your task is to generate a JSON structure for a completely custom website layout based on the user's prompt.
    You must return ONLY valid JSON and absolutely no markdown formatting, no explanations, and no backticks.
    
    The user provided the following business details:
    Business Name: {name}
    Description: {description}
    Contact Info: {contact}
    Design Vibe/Tone: {vibe}
    
    CRITICAL INSTRUCTION FOR IMAGES: 
    If the user asks for specific images (e.g., "a logo for a bakery", "a picture of a kitchen"), you MUST generate an image URL using the free Pollinations API format:
    "https://image.pollinations.ai/prompt/[url-encoded-descriptive-prompt]?width=800&height=600&nologo=true"
    For example: "https://image.pollinations.ai/prompt/a+minimalist+modern+logo+for+a+bakery?width=800&height=600&nologo=true"
    Use these URLs in fields like `logo_text`, `image_url`, or inside `search_terms`.
    
    The JSON structure MUST follow this schema containing an array of dynamic layout blocks:
    {{
        "theme": "dark" | "light",
        "primary_color": "tailwind color name (e.g. indigo-600, emerald-500, rose-500)",
        "font": "sans" | "serif",
        "blocks": [
            {{
                "type": "Navbar",
                "bg_color": "tailwind background class (e.g. bg-white)",
                "text_color": "tailwind text class",
                "logo_text": "Logo text",
                "links": ["Home", "About", "Contact"]
            }},
            {{
                "type": "Hero",
                "bg_color": "tailwind background class (e.g. bg-slate-900 or bg-white)",
                "text_color": "tailwind text class",
                "title": "Main Hero Title",
                "subtitle": "Subtitle text",
                "cta_text": "Button Text"
            }},
            {{
                "type": "Features",
                "bg_color": "tailwind background class",
                "text_color": "tailwind text class",
                "title": "Section Title",
                "items": [
                    {{"title": "Feature 1", "desc": "Description 1", "icon": "Star"}},
                    {{"title": "Feature 2", "desc": "Description 2", "icon": "Zap"}}
                ]
            }},
            {{
                "type": "Content",
                "layout": "image-left" | "image-right" | "center",
                "bg_color": "tailwind background class",
                "text_color": "tailwind text class",
                "title": "Content Title",
                "content": "A detailed paragraph of text."
            }},
            {{
                "type": "Gallery",
                "bg_color": "tailwind background class",
                "title": "Our Work",
                "search_terms": ["term1", "term2", "term3"]
            }},
            {{
                "type": "Contact",
                "bg_color": "tailwind background class",
                "text_color": "tailwind text class",
                "title": "Get in Touch",
                "address": "Address",
                "email": "Email",
                "phone": "Phone"
            }}
        ]
    }}
    
    You must assemble a creative combination of blocks (minimum 4 blocks) to design the perfect website matching the description. Be very creative!
    """

    payload = {
        "model": DEFAULT_MODEL,
        "prompt": "Please generate the JSON for my website.",
        "system": system_prompt,
        "stream": False,
        "format": "json",
        "keep_alive": "1h"
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=600)
        response.raise_for_status()
        result = response.json()
        
        # Parse the JSON returned by the model
        response_text = result.get("response", "")
        
        # Try to extract the JSON block robustly
        match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if match:
            response_text = match.group(0)
            
        website_data = json.loads(response_text)
        return website_data

    except requests.exceptions.HTTPError as e:
        error_detail = ""
        try:
            error_detail = e.response.json().get('error', '')
        except:
            pass
        logger.error(f"Ollama API HTTP error: {e} - {error_detail}")
        if "not found" in error_detail.lower():
            raise Exception(f"Model '{DEFAULT_MODEL}' is not installed in Ollama. Please run: 'ollama run {DEFAULT_MODEL}'")
        raise Exception(f"AI service error: {error_detail or str(e)}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Ollama API request failed: {e}")
        raise Exception(f"Failed to connect to local AI service. Ensure Ollama is running.")
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Ollama JSON response: {e}\nResponse: {response_text}")
        raise Exception("AI returned invalid data format.")

def modify_website_json(prompt: str, current_content: dict, image_urls: list = None) -> dict:
    image_context = ""
    if image_urls and len(image_urls) > 0:
        urls_str = ", ".join([f"'{u}'" for u in image_urls])
        image_context = f"\n\nCRITICAL INSTRUCTION: The user has uploaded {len(image_urls)} media file(s): {urls_str}\nYou MUST use these exact URLs in the layout where requested (e.g., set logo_text to a URL, or use them for bg_image, or inside gallery search_terms, or image_url). DO NOT make up placeholder text!"
    
    system_prompt = f"""
    You are an expert web designer AI. The user wants to modify their website layout.
    
    Here is the CURRENT JSON structure of the website:
    {json.dumps(current_content)}
    
    The user's requested modification is:
    "{prompt}"
    {image_context}
    
    Update the JSON structure to apply the user's request. Keep the identical schema format.
    You must return ONLY valid JSON and absolutely no markdown formatting, no explanations, and no backticks.
    
    CRITICAL INSTRUCTIONS TO PREVENT DATA LOSS:
    1. DO NOT remove, delete, or empty out any existing blocks, titles, descriptions, or links unless the user explicitly asks to remove them.
    2. YOU MUST return the ENTIRE JSON structure with all previous data intact, only modifying the parts requested.
    3. If the user uploads an image and asks to use it as a logo, you MUST completely REPLACE the "logo_text" value with the uploaded image URL. DO NOT keep the old text.
    4. IF THE USER ASKS YOU TO "GENERATE" AN IMAGE (e.g. "generate a logo", "generate an image of a modern kitchen"):
       You MUST generate an image URL using the free Pollinations API format: "https://image.pollinations.ai/prompt/[url-encoded-descriptive-prompt]?width=800&height=600&nologo=true"
       Example: "https://image.pollinations.ai/prompt/a+professional+logo+for+luxe+haven+interiors?width=800&height=600&nologo=true"
       Set this URL wherever the image is requested in the JSON.
    
    The JSON structure MUST follow this schema containing an array of dynamic layout blocks:
    {{
        "theme": "dark" | "light",
        "primary_color": "tailwind color name (e.g. indigo-600, emerald-500, rose-500)",
        "font": "sans" | "serif",
        "blocks": [
            {{
                "type": "Navbar",
                "bg_color": "tailwind background class (e.g. bg-white)",
                "text_color": "tailwind text class",
                "logo_text": "Logo text or image URL",
                "links": ["Home", "About", "Contact"]
            }},
            {{
                "type": "Hero",
                "bg_color": "tailwind background class (e.g. bg-slate-900 or bg-white)",
                "text_color": "tailwind text class",
                "title": "Main Hero Title",
                "subtitle": "Subtitle text",
                "cta_text": "Button Text"
            }},
            {{
                "type": "Features",
                "bg_color": "tailwind background class",
                "text_color": "tailwind text class",
                "title": "Section Title",
                "items": [
                    {{"title": "Feature 1", "desc": "Description 1", "icon": "Star"}},
                    {{"title": "Feature 2", "desc": "Description 2", "icon": "Zap"}}
                ]
            }},
            {{
                "type": "Content",
                "layout": "image-left" | "image-right" | "center",
                "bg_color": "tailwind background class",
                "text_color": "tailwind text class",
                "title": "Content Title",
                "content": "A detailed paragraph of text."
            }},
            {{
                "type": "Gallery",
                "bg_color": "tailwind background class",
                "title": "Our Work",
                "search_terms": ["term1", "term2", "term3"]
            }},
            {{
                "type": "Contact",
                "bg_color": "tailwind background class",
                "text_color": "tailwind text class",
                "title": "Get in Touch",
                "address": "Address",
                "email": "Email",
                "phone": "Phone"
            }}
        ]
    }}
    """

    payload = {
        "model": DEFAULT_MODEL,
        "prompt": "Apply the requested modifications and return the updated JSON.",
        "system": system_prompt,
        "stream": False,
        "format": "json",
        "keep_alive": "1h"
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=600)
        response.raise_for_status()
        result = response.json()
        
        response_text = result.get("response", "")
        match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if match:
            response_text = match.group(0)
            
        updated_data = json.loads(response_text)
        
        # Heuristic override for weak LLMs failing to apply logo
        if image_urls and 'logo' in prompt.lower():
            for block in updated_data.get('blocks', []):
                if block.get('type') == 'Navbar':
                    block['logo_text'] = image_urls[0]
                    
        return updated_data
    except Exception as e:
        logger.error(f"Ollama modify error: {e}")
        raise Exception(f"Failed to modify website: {str(e)}")
