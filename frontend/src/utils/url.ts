export const getWebsiteUrl = (slug: string) => {
  const host = window.location.host;
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
     if (parts.length >= 2 && parts[0] !== 'localhost' && parts[0] !== '127') {
         parts.shift();
     }
     const baseHost = parts.join('.') + (window.location.port ? `:${window.location.port}` : '');
     return `${protocol}//${slug}.${baseHost}`;
  }
  
  // VERCEL FREE DOMAIN LIMITATION:
  // Vercel DOES NOT allow wildcard subdomains (*.jaalam.vercel.app) on their free .vercel.app domains.
  // It only works for custom domains (*.jaalam.com).
  // So if we are on a .vercel.app domain, we MUST use path-based routing (/slug).
  if (hostname.endsWith('.vercel.app')) {
    let baseHost = host;
    // If somehow we are on a subdomain of vercel.app, strip it to get the root
    if (parts.length >= 4) {
      parts.shift();
      baseHost = parts.join('.') + (window.location.port ? `:${window.location.port}` : '');
    }
    return `${protocol}//${baseHost}/${slug}`;
  } 
  
  // CUSTOM DOMAINS (e.g. jaalam.com) -> use subdomain routing (slug.jaalam.com)
  let baseHost = host;
  if (parts.length >= 3 && parts[0] !== 'www') {
    parts.shift();
    baseHost = parts.join('.') + (window.location.port ? `:${window.location.port}` : '');
  } else if (parts[0] === 'www') {
    parts.shift();
    baseHost = parts.join('.') + (window.location.port ? `:${window.location.port}` : '');
  }
  
  return `${protocol}//${slug}.${baseHost}`;
};
