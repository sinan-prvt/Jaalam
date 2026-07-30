export const getWebsiteUrl = (slug: string) => {
  const host = window.location.host;
  const protocol = window.location.protocol;
  
  // If we are already on a subdomain (e.g. demo.jaalam.vercel.app), we should replace it.
  // But generally the dashboard is accessed from the root domain (jaalam.vercel.app or localhost:5173).
  // So we just prepend the slug to the host.
  const parts = window.location.hostname.split('.');
  
  // Check if it's already a subdomain (e.g., parts.length >= 4 for vercel.app, or >= 3 for custom domain)
  let baseHost = host;
  if (parts.length >= 4 && host.includes('vercel.app')) {
    // Already on a subdomain like something.jaalam.vercel.app
    // We want to replace the first part.
    parts.shift();
    baseHost = parts.join('.') + (window.location.port ? `:${window.location.port}` : '');
  } else if (parts.length >= 3 && !host.includes('localhost') && !host.includes('127.0.0.1')) {
     parts.shift();
     baseHost = parts.join('.') + (window.location.port ? `:${window.location.port}` : '');
  }
  
  return `${protocol}//${slug}.${baseHost}`;
};
