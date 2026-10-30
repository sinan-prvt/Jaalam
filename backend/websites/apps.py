from django.apps import AppConfig


class WebsitesConfig(AppConfig):
    name = 'websites'

    def ready(self):
        from . import snapshots  # noqa: F401  (connects the backup-copy signals)
