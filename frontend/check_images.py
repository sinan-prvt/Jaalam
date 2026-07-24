import urllib.request
import re

file_path = 'c:/Users/ADMIN/Desktop/WebBuilder/frontend/src/utils/templateData.ts'

with open(file_path, 'r') as f:
    content = f.read()

urls = set(re.findall(r'https://images\.unsplash\.com/photo-[a-zA-Z0-9\-]+', content))

broken = []
for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
    except Exception as e:
        broken.append(url)
        print(f"Broken: {url} - {e}")

if not broken:
    print("All images are working.")
