"""Backup copies of each live site's public data in file storage (Cloudflare R2 in production).

R2 doesn't go down with this server, so when the API can't be reached the frontend loads
snapshots/sites/<slug>.json (or snapshots/domains/<host>.json for a custom domain) and the
customer's website stays up; only its forms wait for the server (see PublicWebsite.tsx).

A copy is written whenever a site or its content is saved, and removed when the site is
unpublished, blocked, paused or deleted. `manage.py refresh_site_backups` rebuilds them all
(run it once at launch, and daily so plan pauses are picked up).
"""
import json
import logging

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.serializers.json import DjangoJSONEncoder
from django.db import transaction
from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from .models import Website, WebsiteContent

logger = logging.getLogger(__name__)

# Not needed to show a site, so not copied to a public file
PRIVATE_FIELDS = ('user', 'client', 'domain_token', 'visitors_count')


def site_path(slug):
    return f'snapshots/sites/{slug}.json'


def domain_path(host):
    return f'snapshots/domains/{host}.json'


def _write(path, data):
    # Storage keeps existing names (AWS_S3_FILE_OVERWRITE is off), so replace explicitly
    if default_storage.exists(path):
        default_storage.delete(path)
    default_storage.save(path, ContentFile(json.dumps(data, cls=DjangoJSONEncoder).encode()))


def _remove(path):
    if default_storage.exists(path):
        default_storage.delete(path)


def is_live(website):
    from .views import is_paused
    return website.published and not website.is_blocked and not is_paused(website)


def refresh(website, old_slug=None, old_domain=None):
    """Write or remove the site's copies. Never raises: a storage problem must not block saving."""
    try:
        domain = website.custom_domain if website.domain_verified else None
        for stale in {old_slug} - {website.slug, None}:
            _remove(site_path(stale))
        for stale in {old_domain} - {domain, None}:
            _remove(domain_path(stale))
        if is_live(website):
            from .serializers import WebsiteSerializer
            data = {k: v for k, v in WebsiteSerializer(website).data.items() if k not in PRIVATE_FIELDS}
            _write(site_path(website.slug), data)
            if domain:
                _write(domain_path(domain), data)
        else:
            _remove(site_path(website.slug))
            if domain:
                _remove(domain_path(domain))
    except Exception:
        logger.exception('Could not update the backup copy of %s', website.slug)


@receiver(pre_save, sender=Website)
def _remember_address(sender, instance, **kwargs):
    old = Website.objects.filter(pk=instance.pk).values('slug', 'custom_domain', 'domain_verified').first() if instance.pk else None
    instance._backup_old = (old['slug'], old['custom_domain'] if old['domain_verified'] else None) if old else (None, None)


@receiver(post_save, sender=Website)
def _website_saved(sender, instance, update_fields=None, **kwargs):
    if update_fields and set(update_fields) <= {'visitors_count', 'updated_at'}:
        return
    old_slug, old_domain = getattr(instance, '_backup_old', (None, None))
    transaction.on_commit(lambda: refresh(instance, old_slug, old_domain))


@receiver(post_save, sender=WebsiteContent)
def _content_saved(sender, instance, **kwargs):
    transaction.on_commit(lambda: refresh(Website.objects.select_related('content').get(pk=instance.website_id)))


@receiver(post_delete, sender=Website)
def _website_deleted(sender, instance, **kwargs):
    domain = instance.custom_domain if instance.domain_verified else None

    def remove():
        try:
            _remove(site_path(instance.slug))
            if domain:
                _remove(domain_path(domain))
        except Exception:
            logger.exception('Could not remove the backup copy of %s', instance.slug)
    transaction.on_commit(remove)
