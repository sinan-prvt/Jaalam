/**
 * Decides what to show for the current hostname:
 *  - the Jaalam app itself (landing page, dashboard, editors)
 *  - a website by its platform subdomain (bakery.jaalam.app, bakery.localhost)
 *  - a website on its own custom domain (mybakery.com), looked up via the API
 *
 * Set VITE_PLATFORM_DOMAINS (comma separated, e.g. "jaalam.app,jaalam.in") to the domains the
 * app is served from, so those hosts never trigger a custom-domain lookup.
 */
export type HostMode =
  | { mode: 'app' }
  | { mode: 'site'; slug: string }
  | { mode: 'custom'; host: string; fallbackSlug: string | null };

const PLATFORM_DOMAINS = ((import.meta.env.VITE_PLATFORM_DOMAINS as string | undefined) || 'jaalam.app')
  .split(',')
  .map(d => d.trim().toLowerCase())
  .filter(Boolean);

const NOT_CUSTOM_KEY = 'jaalam_not_custom_domain';

/** Hosts we already know are not a connected custom domain (saved after a failed lookup). */
const knownNotCustom = (host: string) => {
  try { return sessionStorage.getItem(NOT_CUSTOM_KEY) === host; } catch { return false; }
};
export const rememberNotCustom = (host: string) => {
  try { sessionStorage.setItem(NOT_CUSTOM_KEY, host); } catch { /* storage unavailable */ }
};

/** Previous heuristic: first label of a 3+ label host is a website slug. */
const legacySubdomain = (host: string) => {
  const parts = host.split('.');
  return parts.length >= 3 && parts[0] !== 'www' ? parts[0] : null;
};

export function resolveHost(hostname: string = window.location.hostname): HostMode {
  const host = hostname.toLowerCase();

  if (host === 'localhost' || host.endsWith('.localhost') || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    const parts = host.split('.');
    return parts.length >= 2 && parts[0] !== 'localhost' && !/^\d+$/.test(parts[0]) ? { mode: 'site', slug: parts[0] } : { mode: 'app' };
  }

  if (host.endsWith('.vercel.app') || host.endsWith('.onrender.com')) {
    const parts = host.split('.');
    return parts.length >= 4 ? { mode: 'site', slug: parts[0] } : { mode: 'app' };
  }

  const platform = PLATFORM_DOMAINS.find(d => host === d || host.endsWith('.' + d));
  if (platform) {
    const sub = host.slice(0, -platform.length).replace(/\.$/, '');
    return sub && sub !== 'www' ? { mode: 'site', slug: sub.split('.').pop() as string } : { mode: 'app' };
  }

  // Any other host may be a customer's own domain
  const fallbackSlug = legacySubdomain(host);
  if (knownNotCustom(host)) return fallbackSlug ? { mode: 'site', slug: fallbackSlug } : { mode: 'app' };
  return { mode: 'custom', host, fallbackSlug };
}
