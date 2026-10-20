"""
Custom domain helpers: normalising user input, DNS verification and (optionally)
registering verified domains with the Vercel project that serves the frontend.

Flow:
  1. Owner enters a domain  -> we store it with a random token (status: pending).
  2. Owner adds two DNS records at their registrar:
       TXT  _jaalam.<domain>  = <token>        (proves they own the domain)
       A    @                 = CUSTOM_DOMAIN_A_RECORD   (routes the apex)
       CNAME www              = CUSTOM_DOMAIN_CNAME      (routes www)
  3. Owner clicks "Verify" -> we look the records up; when ownership is proven and the
     domain routes to us, it is marked verified and (if configured) added to Vercel.
"""
from __future__ import annotations

import re
import secrets

import requests
from django.conf import settings

try:
    import dns.resolver
    import dns.exception
except ImportError:  # pragma: no cover - dnspython is in requirements.txt
    dns = None

VERIFY_PREFIX = '_jaalam'
DOMAIN_RE = re.compile(r'^(?=.{4,253}$)(?!-)([a-z0-9-]{1,63}(?<!-)\.)+[a-z]{2,63}$')
# Hosts that belong to the platform itself and can never be claimed
RESERVED_SUFFIXES = ('jaalam.app', 'vercel.app', 'onrender.com', 'localhost')


def normalize_domain(value: str) -> str:
    """'https://WWW.MyShop.com/about' -> 'myshop.com'."""
    d = (value or '').strip().lower()
    d = re.sub(r'^[a-z]+://', '', d)
    d = d.split('/')[0].split('?')[0].split('#')[0].split(':')[0].rstrip('.')
    if d.startswith('www.'):
        d = d[4:]
    return d


def validate_domain(domain: str) -> str | None:
    """Returns an error message, or None when the domain is acceptable."""
    if not domain:
        return 'Please enter a domain, e.g. mybusiness.com'
    if not DOMAIN_RE.match(domain):
        return 'That does not look like a valid domain. Use a format like mybusiness.com'
    if any(domain == s or domain.endswith('.' + s) for s in RESERVED_SUFFIXES):
        return 'This domain belongs to the platform and cannot be connected.'
    return None


def new_token() -> str:
    return 'jaalam-verify=' + secrets.token_hex(16)


def dns_records(domain: str, token: str) -> list[dict]:
    """The records the owner must add at their registrar."""
    return [
        {'type': 'TXT', 'name': VERIFY_PREFIX, 'host': f'{VERIFY_PREFIX}.{domain}', 'value': token, 'purpose': 'Proves you own the domain'},
        {'type': 'A', 'name': '@', 'host': domain, 'value': settings.CUSTOM_DOMAIN_A_RECORD, 'purpose': f'Points {domain} to your website'},
        {'type': 'CNAME', 'name': 'www', 'host': f'www.{domain}', 'value': settings.CUSTOM_DOMAIN_CNAME, 'purpose': f'Points www.{domain} to your website'},
    ]


def _resolver():
    r = dns.resolver.Resolver()
    r.timeout = 4
    r.lifetime = 8
    return r


def _lookup(name: str, rtype: str) -> list[str]:
    try:
        answers = _resolver().resolve(name, rtype)
    except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer, dns.resolver.NoNameservers, dns.exception.Timeout):
        return []
    out = []
    for a in answers:
        if rtype == 'TXT':
            out.append(b''.join(a.strings).decode(errors='ignore'))
        else:
            out.append(a.to_text().rstrip('.').lower())
    return out


def check_dns(domain: str, token: str) -> dict:
    """
    Looks up the verification and routing records.
    Returns {'ownership': bool, 'apex': bool, 'www': bool, 'found': {...}, 'verified': bool}.
    """
    if dns is None:
        return {'ownership': False, 'apex': False, 'www': False, 'found': {}, 'verified': False,
                'error': 'DNS lookups are not available on the server (dnspython missing).'}

    txt = _lookup(f'{VERIFY_PREFIX}.{domain}', 'TXT')
    apex_a = _lookup(domain, 'A')
    www_cname = _lookup(f'www.{domain}', 'CNAME')
    www_a = _lookup(f'www.{domain}', 'A') if not www_cname else []

    target_ip = settings.CUSTOM_DOMAIN_A_RECORD
    target_cname = settings.CUSTOM_DOMAIN_CNAME.rstrip('.').lower()

    ownership = token in txt
    apex_ok = target_ip in apex_a
    www_ok = target_cname in www_cname or target_ip in www_a
    return {
        'ownership': ownership,
        'apex': apex_ok,
        'www': www_ok,
        'found': {'txt': txt, 'apex_a': apex_a, 'www_cname': www_cname, 'www_a': www_a},
        # Ownership is required; routing needs at least the apex or www to point at us
        'verified': ownership and (apex_ok or www_ok),
    }


def _vercel_params():
    return {'teamId': settings.VERCEL_TEAM_ID} if settings.VERCEL_TEAM_ID else {}


def vercel_enabled() -> bool:
    return bool(settings.VERCEL_TOKEN and settings.VERCEL_PROJECT_ID)


def vercel_add_domain(domain: str) -> dict:
    """Adds the apex and www to the Vercel project so Vercel routes them and issues SSL."""
    if not vercel_enabled():
        return {'enabled': False}
    url = f'https://api.vercel.com/v10/projects/{settings.VERCEL_PROJECT_ID}/domains'
    headers = {'Authorization': f'Bearer {settings.VERCEL_TOKEN}'}
    results = {}
    for name in (domain, f'www.{domain}'):
        try:
            resp = requests.post(url, params=_vercel_params(), headers=headers, json={'name': name}, timeout=15)
            # 409 = already added to this project, which is fine
            results[name] = resp.status_code in (200, 201, 409)
            if not results[name]:
                results[f'{name}_error'] = resp.json().get('error', {}).get('message', resp.text[:200])
        except requests.RequestException as exc:
            results[name] = False
            results[f'{name}_error'] = str(exc)
    return {'enabled': True, **results}


def vercel_remove_domain(domain: str) -> None:
    if not vercel_enabled():
        return
    headers = {'Authorization': f'Bearer {settings.VERCEL_TOKEN}'}
    for name in (domain, f'www.{domain}'):
        try:
            requests.delete(
                f'https://api.vercel.com/v9/projects/{settings.VERCEL_PROJECT_ID}/domains/{name}',
                params=_vercel_params(), headers=headers, timeout=15,
            )
        except requests.RequestException:
            pass
