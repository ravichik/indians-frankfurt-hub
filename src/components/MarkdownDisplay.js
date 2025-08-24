import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MarkdownDisplay.css';

const MarkdownDisplay = ({ content, className = '', truncate = false }) => {
  if (!content || content.trim() === '') {
    return <div className={`markdown-display ${className}`}>No content available</div>;
  }

  // For truncation, we'll limit the content length
  const displayContent = truncate && content.length > 200 
    ? content.substring(0, 200) + '...' 
    : content;

  return (
    <div className={`markdown-display ${className} ${truncate ? 'truncated' : ''}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Make all links open in new tab
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          // Prevent images from breaking layout
          img: ({ node, ...props }) => (
            <img {...props} style={{ maxWidth: '100%', height: 'auto' }} alt={props.alt || ''} />
          ),
          // Style code blocks
          pre: ({ node, ...props }) => (
            <pre className="code-block" {...props} />
          ),
          // Style inline code
          code: ({ node, inline, ...props }) => (
            inline 
              ? <code className="inline-code" {...props} />
              : <code {...props} />
          ),
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay;