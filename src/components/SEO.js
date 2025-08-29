import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Frankfurt Indians', 
  description = 'Connect with the Indian community in Frankfurt. Find events, resources, jobs, housing tips, and networking opportunities.',
  keywords = 'Indians in Frankfurt, Indian community Frankfurt, Indian expats Germany',
  image = 'https://www.frankfurtindians.com/og-image.jpg',
  url = 'https://www.frankfurtindians.com',
  type = 'website'
}) => {
  const siteTitle = title === 'Frankfurt Indians' ? title : `${title} | Frankfurt Indians`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;