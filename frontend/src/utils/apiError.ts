/** First readable message from a DRF validation error. */
export function apiError(err: unknown, fallback: string): string {
  const data = (err as { response?: { data?: unknown } })?.response?.data;
  if (typeof data === 'string' && data.trimStart().startsWith('<')) return fallback; // server error page
  const find = (v: unknown, key = ''): string | null => {
    if (typeof v === 'string') return key && !['error', 'detail', 'non_field_errors'].includes(key) ? `${key.replace(/_/g, ' ')}: ${v}` : v;
    if (Array.isArray(v)) { for (const x of v) { const m = find(x, key); if (m) return m; } return null; }
    if (v && typeof v === 'object') { for (const [k, x] of Object.entries(v)) { const m = find(x, /^\d+$/.test(k) ? key : k); if (m) return m; } }
    return null;
  };
  return find(data) || fallback;
}
