# Joins the two 0011 migrations from parallel branches (RSVPs and custom domains).

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("websites", "0011_rsvp"),
        ("websites", "0011_website_custom_domain"),
    ]

    operations = []
