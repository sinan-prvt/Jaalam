import requests
import json
import logging
import re

logger = logging.getLogger(__name__)

OLLAMA_API_URL = "http://localhost:11434/api/generate"
DEFAULT_MODEL = "llama3:latest" # Using the user's installed model

def generate_website_json(name: str, description: str, contact: str, vibe: str, category: str) -> dict:
    """
    Calls the local Ollama instance to generate website JSON structure based on the structured inputs.
    """
    system_prompt = f"""
    You are an expert web designer AI. Your task is to generate a JSON structure for a website in the '{category}' category.
    You must return ONLY valid JSON and absolutely no markdown formatting, no explanations, and no backticks.
    
    The user provided the following business details:
    Business Name: {name}
    Description: {description}
    Contact Info: {contact}
    Design Vibe/Tone: {vibe}
    
    The JSON structure MUST follow this exact schema containing all sections of the website:
    {{
        "theme": "dark" | "light" | "modern" | "minimal",
        "accent": "amber" | "rose" | "purple" | "emerald" | "indigo" | "sky",
        "hero": {{
            "tagline": "A short 2-3 word tagline",
            "slogan": "A compelling 5-8 word hero slogan",
            "description": "A short engaging paragraph for the hero section",
            "cta_button": "Text for main button (e.g. Get Started)"
        }},
        "about": {{
            "title": "About section title",
            "content": "A detailed 2-3 paragraph backstory and mission statement.",
            "features": ["Feature 1", "Feature 2", "Feature 3"]
        }},
        "services": [
            {{
                "name": "Service Name",
                "desc": "Short description of service",
                "price": "$XX.XX (optional)",
                "icon": "Lucide icon name (e.g. Sparkles, Star, Zap)"
            }}
        ],
        "menus": [
            {{
                "category_name": "Category (e.g. Starters, Packages)",
                "items": [
                    {{"name": "Item Name", "desc": "Item description", "price": "$XX.XX"}}
                ]
            }}
        ],
        "gallery": ["search term 1", "search term 2", "search term 3"],
        "contact": {{
            "address": "Generated or provided address",
            "phone": "Generated or provided phone",
            "email": "Generated or provided email",
            "hours": "Operating hours string"
        }},
        "footer": {{
            "tagline": "Short footer text",
            "social_links": ["Facebook", "Instagram", "Twitter"]
        }}
    }}
    
    Be extremely creative and ensure the tone matches '{vibe}'.
    """

    payload = {
        "model": DEFAULT_MODEL,
        "prompt": "Please generate the JSON for my website.",
        "system": system_prompt,
        "stream": False,
        "format": "json" # Enforce JSON format in Ollama if supported
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=300)
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
