import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const EnhancedSEO = ({ 
  title = 'Frankfurt Indians',
  description = 'Connect with the Indian community in Frankfurt. Find events, resources, jobs, housing tips, and networking opportunities.',
  keywords = 'Indians in Frankfurt, Indian community Frankfurt, Indian expats Germany, Frankfurt Indian events, Indian restaurants Frankfurt',
  image,
  imageAlt = 'Frankfurt Indians Community',
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  structuredData,
  noindex = false,
  canonical,
  alternates = [],
  twitterHandle = '@frankfurtindians'
}) => {
  const location = useLocation();
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://www.frankfurtindians.com';
  
  // Generate full URL if not provided
  const fullUrl = url || `${siteUrl}${location.pathname}`;
  
  // Generate canonical URL
  const canonicalUrl = canonical || fullUrl;
  
  // Generate dynamic OG image URL if not provided
  const ogImage = image || `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/og/default`;
  
  // Format title
  const formattedTitle = title === 'Frankfurt Indians' ? title : `${title} | Frankfurt Indians`;
  
  // Default structured data for organization
  const defaultOrgStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Frankfurt Indians",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "sameAs": [
      "https://www.facebook.com/frankfurtindians",
      "https://twitter.com/frankfurtindians",
      "https://www.instagram.com/frankfurtindians",
      "https://www.linkedin.com/company/frankfurt-indians"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+49-xxx-xxx-xxxx",
      "contactType": "customer service",
      "availableLanguage": ["en", "de", "hi"]
    }
  };

  // Breadcrumb structured data
  const breadcrumbStructuredData = location.pathname !== '/' ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": location.pathname.split('/').filter(Boolean).map((segment, index, array) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      "item": `${siteUrl}/${array.slice(0, index + 1).join('/')}`
    }))
  } : null;

  // Combine all structured data
  const allStructuredData = [
    defaultOrgStructuredData,
    breadcrumbStructuredData,
    structuredData
  ].filter(Boolean);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="title" content={formattedTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Control indexing */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate language versions */}
      {alternates.map((alt, index) => (
        <link 
          key={index} 
          rel="alternate" 
          hrefLang={alt.lang} 
          href={alt.url} 
        />
      ))}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:site_name" content="Frankfurt Indians" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={formattedTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:image:alt" content={imageAlt} />
      {twitterHandle && <meta property="twitter:site" content={twitterHandle} />}
      {author && <meta property="twitter:creator" content={author} />}
      
      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1a1a2e" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Structured Data / JSON-LD */}
      {allStructuredData.map((data, index) => (
        <script 
          key={index}
          type="application/ld+json"
        >
          {JSON.stringify(data)}
        </script>
      ))}
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {process.env.REACT_APP_API_URL && (
        <link rel="preconnect" href={process.env.REACT_APP_API_URL} />
      )}
    </Helmet>
  );
};

export default EnhancedSEO;