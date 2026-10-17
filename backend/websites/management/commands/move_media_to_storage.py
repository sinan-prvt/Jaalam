"""Copy locally stored uploads to the configured storage (S3/R2...) and update every link to them.

Run once after setting AWS_STORAGE_BUCKET_NAME and friends:
    python manage.py move_media_to_storage --dry-run   # show what would change
    python manage.py move_media_to_storage
Safe to run again: files already in the bucket are not uploaded twice.
"""
import json
import os
import re

from django.conf import settings
from django.core.files import File
from django.core.files.storage import default_storage
from django.core.management.base import BaseCommand, CommandError

from marketing.models import Blog
from websites.models import WebsiteContent

CONTENT_FIELDS = ('hero_title', 'about_text', 'custom_html', 'custom_css', 'services_json', 'gallery_json',
                  'contact_info', 'custom_blocks_json', 'products_json', 'settings_json')


def rewrite(value, url_for):
    """Replace .../media/<name> URLs inside a string or JSON value."""
    as_text = value if isinstance(value, str) else json.dumps(value)
    new_text = re.sub(r'https?://[^\s"\'()<>]+?/media/([\w.\-]+)', lambda m: url_for(m.group(1)) or m.group(0), as_text)
    if new_text == as_text:
        return value, False
    return (new_text if isinstance(value, str) else json.loads(new_text)), True


class Command(BaseCommand):
    help = 'Upload files from MEDIA_ROOT to the default storage and rewrite links to them in site content.'

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Only report what would change.')

    def handle(self, *args, dry_run=False, **options):
        if not getattr(settings, 'AWS_STORAGE_BUCKET_NAME', ''):
            raise CommandError('Configure AWS_STORAGE_BUCKET_NAME (and keys) first; uploads are still on local disk.')
        root = settings.MEDIA_ROOT
        names = sorted(n for n in os.listdir(root) if os.path.isfile(os.path.join(root, n))) if os.path.isdir(root) else []

        urls = {}
        for name in names:
            if not dry_run and not default_storage.exists(name):
                with open(os.path.join(root, name), 'rb') as fh:
                    saved = default_storage.save(name, File(fh))
                if saved != name:
                    self.stderr.write(f'{name} was stored as {saved}')
                name_in_storage = saved
            else:
                name_in_storage = name
            urls[name] = default_storage.url(name_in_storage)
        self.stdout.write(f'{len(urls)} file(s) {"would be" if dry_run else ""} available in storage.')

        changed = 0
        for content in WebsiteContent.objects.all():
            dirty = []
            for field in CONTENT_FIELDS:
                new, did = rewrite(getattr(content, field), urls.get)
                if did:
                    setattr(content, field, new)
                    dirty.append(field)
            if dirty:
                changed += 1
                if not dry_run:
                    content.save(update_fields=dirty)
        for blog in Blog.objects.exclude(image_url__isnull=True).exclude(image_url=''):
            new, did = rewrite(blog.image_url, urls.get)
            if did:
                changed += 1
                if not dry_run:
                    blog.image_url = new
                    blog.save(update_fields=['image_url'])
        self.stdout.write(self.style.SUCCESS(f'{"Would update" if dry_run else "Updated"} links in {changed} record(s).'))
