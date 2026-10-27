import django.core.validators
from django.db import migrations, models

import loyalty.models


def fill_counter_keys(apps, schema_editor):
    LoyaltyProgram = apps.get_model('loyalty', 'LoyaltyProgram')
    for program in LoyaltyProgram.objects.all():
        program.counter_key = loyalty.models.new_counter_key()
        program.save(update_fields=['counter_key'])


class Migration(migrations.Migration):

    dependencies = [
        ("loyalty", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="loyaltyprogram",
            name="stamp_mode",
            field=models.CharField(choices=[
                ("STAFF", "Staff scan the customer"),
                ("SCREEN", "Customer scans the counter screen"),
                ("PRINTED", "Customer scans the printed QR (location check)"),
            ], default="SCREEN", max_length=10),
        ),
        # Unique per program: added empty, filled one by one, then made unique
        migrations.AddField(
            model_name="loyaltyprogram",
            name="counter_key",
            field=models.CharField(max_length=24, null=True),
        ),
        migrations.RunPython(fill_counter_keys, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="loyaltyprogram",
            name="counter_key",
            field=models.CharField(default=loyalty.models.new_counter_key, max_length=24, unique=True),
        ),
        migrations.AddField(
            model_name="loyaltyprogram",
            name="latitude",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="loyaltyprogram",
            name="longitude",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="loyaltyprogram",
            name="radius_m",
            field=models.PositiveSmallIntegerField(default=150, validators=[
                django.core.validators.MinValueValidator(50), django.core.validators.MaxValueValidator(2000)]),
        ),
        migrations.AddField(
            model_name="stampevent",
            name="self_scan",
            field=models.BooleanField(default=False),
        ),
    ]
