import requests
import json
import logging
import re

logger = logging.getLogger(__name__)

OLLAMA_API_URL = "http://localhost:11434/api/generate"
DEFAULT_MODEL = "qwen:0.5b" # Faster model to prevent long wait times

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
    
    The JSON structure MUST follow this schema containing an array of dynamic layout blocks:
    {{
        "theme": "dark" | "light",
        "primary_color": "tailwind color name (e.g. indigo-600, emerald-500, rose-500)",
        "font": "sans" | "serif",
        "blocks": [
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
        "format": "json"
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

def modify_website_json(prompt: str, current_content: dict) -> dict:
    system_prompt = f"""
    You are an expert web designer AI. The user wants to modify their website layout.
    
    Here is the CURRENT JSON structure of the website:
    {json.dumps(current_content)}
    
    The user's requested modification is:
    "{prompt}"
    
    Update the JSON structure to apply the user's request. Keep the identical schema format (theme, primary_color, font, blocks).
    You must return ONLY valid JSON and absolutely no markdown formatting, no explanations, and no backticks.
    """

    payload = {
        "model": DEFAULT_MODEL,
        "prompt": "Apply the requested modifications and return the updated JSON.",
        "system": system_prompt,
        "stream": False,
        "format": "json"
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
        return updated_data
    except Exception as e:
        logger.error(f"Ollama modify error: {e}")
        raise Exception(f"Failed to modify website: {str(e)}")
