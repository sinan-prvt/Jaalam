import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
}

export default function SEOHead({ title, description, imageUrl, url }: SEOHeadProps) {
  // A clean, high-quality default fallback image for social sharing
  const defaultImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'; 
  const finalImage = imageUrl || defaultImage;
  
  // Get current URL if not provided
  const siteUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // Truncate description for SEO best practices (~160 chars)
  const cleanDescription = description.replace(/(<([^>]+)>)/gi, ""); // Strip any HTML
  const metaDescription = cleanDescription.length > 160 
    ? cleanDescription.substring(0, 157) + '...' 
    : cleanDescription;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={metaDescription} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={finalImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={finalImage} />
    </Helmet>
  );
}
