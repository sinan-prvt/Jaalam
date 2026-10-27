from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("customers", "0002_followups_and_activity"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customer",
            name="source",
            field=models.CharField(
                choices=[
                    ("WEBSITE", "Website form"),
                    ("WHATSAPP", "WhatsApp"),
                    ("CALL", "Phone call"),
                    ("WALK_IN", "Walk-in"),
                    ("REFERRAL", "Referral"),
                    ("SOCIAL", "Social media"),
                    ("LOYALTY", "Loyalty card"),
                    ("OTHER", "Other"),
                ],
                default="WEBSITE",
                max_length=20,
            ),
        ),
    ]
