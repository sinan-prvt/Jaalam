from django.core.management.base import BaseCommand

from users.models import User
from users.plans import FREE
from users.subscriptions import sync_plan_status


class Command(BaseCommand):
    help = 'Send due renewal reminders and expiry notices for paid plans (run daily, e.g. as a Render cron job).'

    def handle(self, *args, **options):
        users = User.objects.exclude(membership=FREE).exclude(plan_expires_at__isnull=True)
        for user in users.iterator():
            sync_plan_status(user)
        self.stdout.write(self.style.SUCCESS(f'Checked {users.count()} paid account(s).'))
