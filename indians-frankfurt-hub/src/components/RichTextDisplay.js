import React from 'react';
import DOMPurify from 'dompurify';
import './RichTextDisplay.css';

const RichTextDisplay = ({ content, className = '' }) => {
  // Sanitize HTML to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'], // Allow iframes for videos
    ADD_ATTR: ['target', 'rel', 'frameborder', 'allowfullscreen', 'allow'], // Allow additional attributes
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'blockquote', 'pre', 'code',
      'ul', 'ol', 'li',
      'a', 'img', 'video', 'iframe',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
      'sub', 'sup',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'width', 'height',
      'class', 'id', 'style', 'target', 'rel',
      'data-*', 'frameborder', 'allowfullscreen', 'allow'
    ],
    ALLOWED_STYLES: {
      '*': [
        'color', 'background-color', 'background',
        'font-size', 'font-weight', 'font-style', 'font-family',
        'text-align', 'text-decoration', 'text-indent',
        'padding', 'padding-*', 'margin', 'margin-*',
        'border', 'border-*', 'width', 'height', 'max-width', 'max-height',
        'line-height', 'display', 'float', 'clear'
      ]
    }
  });

  if (!content || content.trim() === '') {
    return <div className={`rich-text-display ${className}`}>No content available</div>;
  }

  return (
    <div 
      className={`rich-text-display ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default RichTextDisplay;