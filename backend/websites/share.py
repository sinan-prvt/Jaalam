"""Link-preview pages for WhatsApp, Facebook, Telegram, X and other link crawlers.

The frontend is a single-page app, so crawlers (which don't run JavaScript) only ever
saw the generic index.html. The frontend host rewrites crawler requests for
/<slug> to this view, which returns a tiny HTML page with Open Graph tags built
from the site's own content: names, date, venue and photo.
"""
import json
from datetime import datetime
from html import escape

from django.http import HttpResponse

from .models import Website

INVITATION_FAMILIES = {
    'wedding': [
        'Wedding Invitation', 'Islamic Invitation', 'South Indian Wedding', 'Kerala Traditional',
        'Punjabi Traditional', 'Bengali Wedding', 'Christian Invitation', 'Engagement Invitation',
        'Classic Engagement', 'Modern Engagement',
    ],
    'birthday': ['Kids Birthday', '1st Birthday', 'Sweet 16 Birthday', 'Adult Birthday'],
    'housewarming': ['Traditional Housewarming', 'Modern Housewarming'],
    'religious_event': ['Mosque Event', 'Church Event', 'Temple Event'],
}

DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
CATEGORY_IMAGES = {
    'birthday': 'https://images.unsplash.com/photo-1530103862676-de3c9da59c6b?auto=format&fit=crop&w=1200&q=80',
    'housewarming': 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=1200&q=80',
    'religious_event': 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
    'business': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
}


def family_for(business_type):
    for family, categories in INVITATION_FAMILIES.items():
        if business_type in categories:
            return family
    return 'business'


def _first_url(*candidates):
    """First candidate that is an absolute http(s) URL (crawlers can't use data: or relative URLs)."""
    for c in candidates:
        if isinstance(c, list):
            c = next((x if isinstance(x, str) else (x or {}).get('url') for x in c if x), None)
        if isinstance(c, dict):
            c = c.get('url') or c.get('image')
        if isinstance(c, str) and c.startswith(('http://', 'https://')):
            return c
    return None


def _ordinal(n):
    n = int(n)
    suffix = 'th' if 10 <= n % 100 <= 20 else {1: 'st', 2: 'nd', 3: 'rd'}.get(n % 10, 'th')
    return f"{n}{suffix}"


def _format_date(data):
    raw = data.get('date') or data.get('countdownDate') or ''
    for fmt in ('%Y-%m-%dT%H:%M', '%Y-%m-%d', '%d %B %Y', '%B %d, %Y', '%A, %B %d, %Y'):
        try:
            return datetime.strptime(raw.strip(), fmt).strftime('%A, %d %B %Y')
        except (ValueError, AttributeError):
            continue
    parts = [data.get('dateWeekday'), ' '.join(p for p in [data.get('dateDay'), data.get('dateMonth'), data.get('dateYear')] if p)]
    return ', '.join(p for p in parts if p) or raw


def build_preview(website):
    """Returns (title, description, image) for a website's share card."""
    content = getattr(website, 'content', None)
    settings = (content.settings_json if content else None) or {}
    hero_title = (content.hero_title if content else '') or ''
    about = (content.about_text if content else '') or ''
    address = ((content.contact_info if content else None) or {}).get('address') or ''
    if isinstance(address, dict):
        address = ', '.join(str(v) for v in address.values() if v)
    family = family_for(website.business_type)
    data = settings.get(family, {}) if family != 'business' else {}

    if family == 'wedding':
        names = hero_title or 'Our Wedding'
        is_engagement = 'Engagement' in website.business_type
        title = f"{names} — {'Engagement' if is_engagement else 'Wedding'} Invitation"
        image = _first_url(data.get('mainPhoto'), data.get('venuePhoto'), data.get('gallery'), data.get('bridePhoto'), data.get('groomPhoto'))
        venue = data.get('venue') or address
    elif family == 'birthday':
        name = hero_title or data.get('name') or 'Birthday'
        age = str(data.get('age') or '').strip()
        title = f"{name}'s {_ordinal(age)} Birthday" if age.isdigit() else f"{name}'s Birthday Celebration"
        image = _first_url(data.get('mainPhoto'), data.get('gallery'), data.get('venuePhoto'))
        venue = data.get('venue') or address
    elif family == 'housewarming':
        host = data.get('hostName') or hero_title or 'Our Family'
        title = f"{host} — Housewarming Invitation"
        image = _first_url(data.get('venuePhoto'), data.get('hostPhoto'), data.get('gallery'))
        venue = data.get('venue') or address
    elif family == 'religious_event':
        title = data.get('organization_name') or hero_title or website.business_type
        image = _first_url(data.get('cover_image'), data.get('gallery'))
        venue = address
    else:
        title = settings.get('website_name') or hero_title or website.slug.replace('-', ' ').title()
        image = _first_url(content.gallery_json if content else None)
        venue = ''

    if family == 'business' or family == 'religious_event':
        description = data.get('tagline') if family == 'religious_event' else ''
        description = description or about or f"Welcome to {title}."
    else:
        when = ' · '.join(p for p in [_format_date(data), data.get('time')] if p)
        description = ' · '.join(p for p in [when, venue] if p) or 'You are invited! Tap to view the invitation.'

    image = image or CATEGORY_IMAGES.get(family, DEFAULT_IMAGE)
    return title.strip(), description.strip()[:200], image


def share_preview(request, slug):
    host = request.headers.get('X-Forwarded-Host') or request.get_host()
    scheme = request.headers.get('X-Forwarded-Proto') or ('https' if request.is_secure() else 'http')
    page_url = f"{scheme}://{host}/{slug}"

    website = Website.objects.select_related('content').filter(slug=slug).first()
    if website and website.published and not website.is_blocked:
        title, description, image = build_preview(website)
    else:
        # Unknown, unpublished or suspended: a neutral card that reveals nothing private.
        title, description, image = 'Jaalam', 'Create beautiful websites and digital invitations in minutes.', DEFAULT_IMAGE

    t, d, i, u = (escape(x, quote=True) for x in (title, description, image, page_url))
    js_url = json.dumps(page_url).replace('<', '\\u003c')
    html = f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<title>{t}</title>
<meta name="description" content="{d}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Jaalam">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:image" content="{i}">
<meta property="og:image:alt" content="{t}">
<meta property="og:url" content="{u}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{t}">
<meta name="twitter:description" content="{d}">
<meta name="twitter:image" content="{i}">
<link rel="canonical" href="{u}">
</head><body>
<h1>{t}</h1><p>{d}</p><p><a href="{u}">Open</a></p>
<script>location.replace({js_url});</script>
</body></html>"""
    response = HttpResponse(html, content_type='text/html; charset=utf-8')
    response['Cache-Control'] = 'public, max-age=300'
    return response
