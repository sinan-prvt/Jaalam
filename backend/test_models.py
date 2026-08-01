from decouple import config
from google import genai

try:
    api_key = config("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    for model in client.models.list():
        print(model.name)
except Exception as e:
    print("ERROR:", e)
