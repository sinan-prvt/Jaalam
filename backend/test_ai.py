import sys
sys.path.append('c:\\Users\\ADMIN\\Desktop\\WebBuilder\\backend')
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from websites.ai_service import generate_website_json

try:
    print("Calling generate_website_json...")
    res = generate_website_json('test', 'Restaurant')
    print("SUCCESS:")
    print(res)
except Exception as e:
    import traceback
    traceback.print_exc()
