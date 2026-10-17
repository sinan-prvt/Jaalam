import requests

import os
API_TOKEN = os.environ.get("HF_TOKEN", "")
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
headers = {"Authorization": f"Bearer {API_TOKEN}"}

response = requests.post(API_URL, headers=headers, json={"inputs": "A test prompt"})
print("Status Code:", response.status_code)
if response.status_code != 200:
    print("Response text:", response.text)
else:
    print("Success, length of bytes:", len(response.content))
