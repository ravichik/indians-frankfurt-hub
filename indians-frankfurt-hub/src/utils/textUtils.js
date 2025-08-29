import React from 'react';

// Function to detect and convert URLs to clickable links
export const linkifyText = (text) => {
  if (!text) return text;
  
  // Comprehensive URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]*\.(com|org|net|edu|gov|mil|int|co|uk|de|in|io|app|dev|ai|tech|xyz|website|site|online|info|biz|me|tv|cc|ws|mobi|asia|name|pro|travel|museum|aero|coop|jobs|tel|xxx|ac|ad|ae|af|ag|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bl|bm|bn|bo|bq|br|bs|bt|bv|bw|by|bz|ca|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tw|tz|ua|ug|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)(?:\/[^\s]*)?)/gi;
  
  const parts = text.split(urlPattern);
  
  return parts.map((part, index) => {
    if (part && part.match(urlPattern)) {
      let href = part;
      // Add https:// if no protocol is specified
      if (!part.startsWith('http://') && !part.startsWith('https://')) {
        if (part.startsWith('www.')) {
          href = 'https://' + part;
        } else if (part.includes('.') && !part.startsWith('@')) {
          // Check if it looks like a domain
          href = 'https://' + part;
        }
      }
      
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 underline break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

// Function to render text with clickable links (preserving line breaks)
export const renderTextWithLinks = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  return lines.map((line, lineIndex) => (
    <React.Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {linkifyText(line)}
    </React.Fragment>
  ));
};

// Extract domain from URL for display
export const extractDomain = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
};

// Validate if string is a valid URL
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    // Try adding https:// and check again
    try {
      new URL('https://' + string);
      return true;
    } catch {
      return false;
    }
  }
};