from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("loyalty", "0002_self_scan"),
    ]

    operations = [
        migrations.AlterField(
            model_name="loyaltyprogram",
            name="stamp_mode",
            field=models.CharField(choices=[
                ("CODE", "Customer scans the printed QR and enters today's code"),
                ("STAFF", "Staff scan the customer"),
                ("SCREEN", "Customer scans the counter screen"),
                ("PRINTED", "Customer scans the printed QR (location check)"),
            ], default="CODE", max_length=10),
        ),
        migrations.AddField(
            model_name="loyaltycard",
            name="code_fails",
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="loyaltycard",
            name="code_fail_date",
            field=models.DateField(blank=True, null=True),
        ),
    ]
