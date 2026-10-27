from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import loyalty.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("customers", "0003_customer_loyalty_source"),
        ("websites", "0012_merge_rsvp_custom_domain"),
    ]

    operations = [
        migrations.CreateModel(
            name="LoyaltyProgram",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("reward", models.CharField(default="Free coffee", max_length=120)),
                ("stamps_required", models.PositiveSmallIntegerField(default=9, validators=[
                    django.core.validators.MinValueValidator(2), django.core.validators.MaxValueValidator(30)])),
                ("icon", models.CharField(choices=[
                    ("coffee", "Coffee"), ("food", "Food"), ("pizza", "Pizza"), ("cake", "Cake"),
                    ("icecream", "Ice cream"), ("scissors", "Salon"), ("sparkles", "Beauty"), ("dumbbell", "Fitness"),
                    ("shopping", "Shopping"), ("shirt", "Clothing"), ("gem", "Jewellery"), ("book", "Books"),
                    ("pill", "Pharmacy"), ("car", "Car"), ("wrench", "Repairs"), ("paw", "Pets"),
                    ("flower", "Flowers"), ("gift", "Gift"), ("heart", "Heart"), ("star", "Star"),
                ], default="star", max_length=20)),
                ("color", models.CharField(default="#ea580c", max_length=9)),
                ("max_stamps_per_day", models.PositiveSmallIntegerField(default=1, validators=[
                    django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(10)])),
                ("terms", models.CharField(blank=True, max_length=300)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("website", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="loyalty", to="websites.website")),
            ],
        ),
        migrations.CreateModel(
            name="LoyaltyCard",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("phone", models.CharField(max_length=15)),
                ("code", models.CharField(default=loyalty.models.new_card_code, max_length=24, unique=True)),
                ("stamps", models.PositiveSmallIntegerField(default=0)),
                ("rewards_redeemed", models.PositiveIntegerField(default=0)),
                ("last_stamp_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("customer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="loyalty_cards", to="customers.customer")),
                ("program", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="cards", to="loyalty.loyaltyprogram")),
            ],
            options={
                "ordering": ["-last_stamp_at", "-created_at"],
            },
        ),
        migrations.CreateModel(
            name="StampEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("kind", models.CharField(choices=[("STAMP", "Stamp added"), ("REDEEM", "Reward given"), ("UNDO", "Stamp removed")], max_length=10)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("by_user", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ("card", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="events", to="loyalty.loyaltycard")),
            ],
            options={
                "ordering": ["-created_at", "-id"],
            },
        ),
        migrations.AddConstraint(
            model_name="loyaltycard",
            constraint=models.UniqueConstraint(fields=("program", "phone"), name="one_card_per_phone"),
        ),
    ]
