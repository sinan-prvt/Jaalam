from decouple import config
from google import genai

try:
    api_key = config("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model='gemini-3.5-flash',
        contents='hello'
    )
    print("SUCCESS")
    print(response.text)
except Exception as e:
    print("ERROR:", e)
