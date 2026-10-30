"""Visitor analytics: one DailyVisit row per site per day, and the summary the Analytics page shows."""
from datetime import timedelta
from urllib.parse import urlparse

from django.db import IntegrityError, transaction
from django.db.models import Count, F
from django.utils import timezone

from .models import DailyVisit

BOTS = ('bot', 'crawl', 'spider', 'slurp', 'headless', 'lighthouse')
MOBILE = ('mobi', 'android', 'iphone', 'ipad')
# Referrer host fragment -> source shown on the Analytics page
SOURCES = (
    (('google.', 'bing.', 'yahoo.', 'duckduckgo.', 'ecosia.'), 'search'),
    (('whatsapp', 'wa.me'), 'whatsapp'),
    (('instagram.',), 'instagram'),
    (('facebook.', 'fb.com', 'fb.me'), 'facebook'),
    (('youtube.', 'youtu.be'), 'youtube'),
    (('t.co', 'twitter.', 'x.com'), 'x'),
)
SOURCE_NAMES = ['direct', 'qr', 'search', 'whatsapp', 'instagram', 'facebook', 'youtube', 'x', 'other']


def is_bot(request):
    agent = request.META.get('HTTP_USER_AGENT', '').lower()
    return not agent or any(b in agent for b in BOTS)


def visit_source(request):
    """Where a visitor came from: ?src=qr on the printed QR code, else the page's referrer."""
    if request.query_params.get('src') == 'qr':
        return 'qr'
    host = (urlparse(request.query_params.get('ref', '')).hostname or '').lower()
    if not host:
        return 'direct'
    for fragments, name in SOURCES:
        if any(f in host for f in fragments):
            return name
    # Moving between pages of the site itself, or from the builder
    own = (urlparse(request.build_absolute_uri()).hostname or '').lower()
    return 'direct' if host == own or host.endswith('jaalam.app') or host in ('localhost', '127.0.0.1') else 'other'


def record_visit(website, request):
    agent = request.META.get('HTTP_USER_AGENT', '').lower()
    mobile = int(any(m in agent for m in MOBILE))
    source = visit_source(request)
    today = timezone.localdate()
    try:
        DailyVisit.objects.get_or_create(website=website, date=today)
    except IntegrityError:  # created by a visit at the same moment
        pass
    with transaction.atomic():
        visit = DailyVisit.objects.select_for_update().get(website=website, date=today)
        visit.count = F('count') + 1
        visit.mobile = F('mobile') + mobile
        visit.sources = {**visit.sources, source: visit.sources.get(source, 0) + 1}
        visit.save(update_fields=['count', 'mobile', 'sources'])


def build_analytics(websites, days):
    """Totals for the period and the one before it, visits per day, sources, devices and per site."""
    from customers.models import Customer

    today = timezone.localdate()
    start = today - timedelta(days=days - 1)
    prev_start = start - timedelta(days=days)
    site_ids = [w.id for w in websites]
    visits = DailyVisit.objects.filter(website_id__in=site_ids, date__gte=prev_start)

    per_day = {d: 0 for d in (start + timedelta(days=i) for i in range(days))}
    sources = {name: 0 for name in SOURCE_NAMES}
    per_site = {i: {'period': 0} for i in site_ids}
    period = previous = mobile = 0
    for v in visits:
        if v.date < start:
            previous += v.count
            continue
        period += v.count
        mobile += v.mobile
        per_day[v.date] = per_day.get(v.date, 0) + v.count
        per_site[v.website_id]['period'] += v.count
        for name, n in (v.sources or {}).items():
            sources[name if name in sources else 'other'] += n

    leads = (Customer.objects.filter(website_id__in=site_ids, source='WEBSITE', created_at__date__gte=start)
             .values('website_id').annotate(n=Count('id')))
    from .models import Rsvp
    rsvps = (Rsvp.objects.filter(website_id__in=site_ids, created_at__date__gte=start)
             .values('website_id').annotate(n=Count('id')))
    enquiries = {i: 0 for i in site_ids}
    for row in [*leads, *rsvps]:
        enquiries[row['website_id']] += row['n']

    return {
        'days': days,
        'totals': {
            'visitors': period,
            'previous': previous,
            'today': per_day.get(today, 0),
            'all_time': sum(w.visitors_count for w in websites),
            'enquiries': sum(enquiries.values()),
            'live_sites': sum(1 for w in websites if w.published),
            'sites': len(websites),
        },
        'daily': [{'date': d.isoformat(), 'visitors': n} for d, n in sorted(per_day.items())],
        'sources': sorted(({'source': k, 'visitors': n} for k, n in sources.items() if n), key=lambda r: -r['visitors']),
        'devices': {'mobile': mobile, 'desktop': period - mobile},
        'sites': sorted((
            {
                'slug': w.slug,
                'name': (getattr(w, 'content', None) and (w.content.settings_json or {}).get('website_name')) or w.slug,
                'business_type': w.business_type,
                'published': w.published,
                'visitors': per_site[w.id]['period'],
                'all_time': w.visitors_count,
                'enquiries': enquiries[w.id],
            } for w in websites), key=lambda s: (-s['visitors'], -s['all_time'])),
    }
