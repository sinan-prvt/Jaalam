import requests
import json

payload = {
    "model": "llama3:latest",
    "prompt": "return empty json object {}",
    "format": "json",
    "stream": False
}
print(requests.post('http://localhost:11434/api/generate', json=payload).text)
