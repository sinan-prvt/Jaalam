from django.core.management.base import BaseCommand

from websites.models import Website
from websites.snapshots import refresh


class Command(BaseCommand):
    help = "Rewrite every site's backup copy in file storage (and remove copies of sites that aren't live)."

    def handle(self, *args, **options):
        count = 0
        for website in Website.objects.select_related('content', 'user'):
            refresh(website)
            count += 1
        self.stdout.write(self.style.SUCCESS(f'Refreshed backup copies for {count} sites.'))
