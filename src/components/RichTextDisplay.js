import React from 'react';
import DOMPurify from 'dompurify';
import './RichTextDisplay.css';

const RichTextDisplay = ({ content, className = '' }) => {
  // Configure DOMPurify to allow safe HTML tags and attributes
  const cleanHTML = DOMPurify.sanitize(content || '', {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'blockquote', 'pre', 'code',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
    ALLOWED_SCHEMES: ['http', 'https', 'mailto'],
    ADD_ATTR: ['target', 'rel'] // Add target="_blank" and rel="noopener" to links
  });

  // Add target="_blank" to all links
  const processedHTML = cleanHTML.replace(
    /<a\s+href=/g,
    '<a target="_blank" rel="noopener noreferrer" href='
  );

  if (!processedHTML || processedHTML.trim() === '') {
    return <div className={`rich-text-display ${className}`}>No content available</div>;
  }

  return (
    <div 
      className={`rich-text-display ${className}`}
      dangerouslySetInnerHTML={{ __html: processedHTML }}
    />
  );
};

export default RichTextDisplay;