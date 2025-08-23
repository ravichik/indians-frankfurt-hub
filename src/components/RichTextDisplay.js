import React from 'react';
import DOMPurify from 'dompurify';

const RichTextDisplay = ({ content, className = '' }) => {
  // Configure DOMPurify to allow safe HTML tags and attributes
  const cleanHTML = DOMPurify.sanitize(content, {
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

  return (
    <div 
      className={`rich-text-display ${className}`}
      dangerouslySetInnerHTML={{ __html: processedHTML }}
    >
      <style jsx>{`
        .rich-text-display {
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          word-wrap: break-word;
        }
        
        .rich-text-display h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
          color: #111827;
        }
        
        .rich-text-display h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.83em 0;
          color: #111827;
        }
        
        .rich-text-display h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 1em 0;
          color: #111827;
        }
        
        .rich-text-display p {
          margin: 1em 0;
        }
        
        .rich-text-display ul,
        .rich-text-display ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }
        
        .rich-text-display li {
          margin: 0.5em 0;
        }
        
        .rich-text-display ul li {
          list-style-type: disc;
        }
        
        .rich-text-display ol li {
          list-style-type: decimal;
        }
        
        .rich-text-display blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          color: #6b7280;
          font-style: italic;
        }
        
        .rich-text-display pre {
          background: #f3f4f6;
          border-radius: 0.375rem;
          padding: 1em;
          margin: 1em 0;
          overflow-x: auto;
          font-family: monospace;
        }
        
        .rich-text-display code {
          background: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }
        
        .rich-text-display pre code {
          background: none;
          padding: 0;
        }
        
        .rich-text-display a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .rich-text-display a:hover {
          color: #1d4ed8;
        }
        
        .rich-text-display strong {
          font-weight: bold;
        }
        
        .rich-text-display em {
          font-style: italic;
        }
        
        .rich-text-display u {
          text-decoration: underline;
        }
        
        .rich-text-display s {
          text-decoration: line-through;
        }
        
        /* Mobile styles */
        @media (max-width: 640px) {
          .rich-text-display {
            font-size: 14px;
          }
          
          .rich-text-display h1 {
            font-size: 1.5em;
          }
          
          .rich-text-display h2 {
            font-size: 1.25em;
          }
          
          .rich-text-display h3 {
            font-size: 1.1em;
          }
        }
      `}</style>
    </div>
  );
};

export default RichTextDisplay;