import os
import django
from django.core.management import call_command

# Setup django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

print("Dumping data using strict UTF-8 encoding...")

# Force UTF-8 encoding when opening the file
with open('db_backup.json', 'w', encoding='utf-8') as f:
    call_command(
        'dumpdata',
        natural_foreign=True,
        natural_primary=True,
        exclude=['contenttypes', 'auth.Permission', 'admin.logentry'],
        indent=4,
        stdout=f
    )

print("Data exported successfully to db_backup.json without any encoding errors!")
