import os
import sys

# Ensure backend path is in sys.path for Vercel Serverless
file_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(file_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

from config.wsgi import application

app = application
