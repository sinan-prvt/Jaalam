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
  
  let baseHost = host;
  if (hostname.endsWith('.vercel.app')) {
    // Base domain is something.vercel.app (3 parts)
    if (parts.length >= 4) {
      parts.shift();
      baseHost = parts.join('.') + (window.location.port ? `:${window.location.port}` : '');
    }
  } else {
    // Base domain is something.com (2 parts)
    if (parts.length >= 3 && parts[0] !== 'www') {
      parts.shift();
      baseHost = parts.join('.') + (window.location.port ? `:${window.location.port}` : '');
    } else if (parts[0] === 'www') {
      parts.shift();
      baseHost = parts.join('.') + (window.location.port ? `:${window.location.port}` : '');
    }
  }
  
  return `${protocol}//${slug}.${baseHost}`;
};
