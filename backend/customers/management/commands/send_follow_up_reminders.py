"""Remind owners about lead follow-ups due today (or overdue). Run daily, e.g. each morning:

    python manage.py send_follow_up_reminders

Each follow-up is reminded once; setting a new date on the lead re-arms it.
"""
from collections import defaultdict
from datetime import datetime, time, timedelta

from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from django.utils import timezone

from customers.models import Customer
from users.notifications import create_notification
from users.views import frontend_base_url


class Command(BaseCommand):
    help = 'Notify owners about CRM follow-ups that are due today or overdue.'

    def handle(self, *args, **options):
        end_of_today = timezone.make_aware(datetime.combine(timezone.localdate() + timedelta(days=1), time.min))
        due = (Customer.objects
               .filter(follow_up_at__lt=end_of_today, follow_up_reminded_at__isnull=True)
               .exclude(status__in=['COMPLETED', 'LOST'])
               .select_related('website__user')
               .order_by('follow_up_at'))
        by_owner = defaultdict(list)
        for customer in due:
            by_owner[customer.website.user].append(customer)

        base = frontend_base_url(None)
        for owner, customers in by_owner.items():
            lines = [f"• {c.name}{f' – {c.follow_up_note}' if c.follow_up_note else ''} "
                     f"({timezone.localtime(c.follow_up_at):%d %b, %I:%M %p})" for c in customers]
            title = f"{len(customers)} follow-up{'s' if len(customers) != 1 else ''} due today"
            create_notification(owner, title, '\n'.join(lines)[:1000], notification_type='follow_up')
            if owner.email:
                send_mail(
                    title,
                    f"Hi {owner.username},\n\nThese leads are waiting to hear from you:\n\n" + '\n'.join(lines)
                    + (f"\n\nOpen your customers: {base}/dashboard" if base else ''),
                    None, [owner.email], fail_silently=True,
                )
            Customer.objects.filter(id__in=[c.id for c in customers]).update(follow_up_reminded_at=timezone.now())
        self.stdout.write(f"Reminded {len(by_owner)} owner(s) about {sum(map(len, by_owner.values()))} follow-up(s).")
