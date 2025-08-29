// Social media sharing utilities

const SITE_URL = window.location.origin;
const SITE_NAME = 'Frankfurt Indians';

export const shareOptions = {
  whatsapp: {
    name: 'WhatsApp',
    icon: '💬',
    color: '#25D366',
    getUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`
  },
  facebook: {
    name: 'Facebook',
    icon: '👍',
    color: '#1877F2',
    getUrl: (url, text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
  },
  twitter: {
    name: 'Twitter',
    icon: '🐦',
    color: '#1DA1F2',
    getUrl: (url, text) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&hashtags=IndiansInFrankfurt`
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    getUrl: (url, text) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`
  },
  telegram: {
    name: 'Telegram',
    icon: '✈️',
    color: '#0088cc',
    getUrl: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  },
  email: {
    name: 'Email',
    icon: '✉️',
    color: '#EA4335',
    getUrl: (url, text, title) => `mailto:?subject=${encodeURIComponent(title || 'Check this out from Frankfurt Indians')}&body=${encodeURIComponent(text + '\n\n' + url)}`
  },
  copy: {
    name: 'Copy Link',
    icon: '🔗',
    color: '#6B7280',
    action: async (url, toast) => {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        return true;
      } catch (err) {
        toast.error('Failed to copy link');
        return false;
      }
    }
  }
};

export const shareContent = (platform, { url, title, text }) => {
  const shareUrl = url || window.location.href;
  const shareText = text || title || 'Check this out!';
  
  if (platform === 'copy') {
    return shareOptions.copy.action(shareUrl);
  }
  
  const shareOption = shareOptions[platform];
  if (shareOption && shareOption.getUrl) {
    const targetUrl = shareOption.getUrl(shareUrl, shareText, title);
    window.open(targetUrl, '_blank', 'width=600,height=400');
  }
};

// Generate share data for a forum post
export const getPostShareData = (post) => {
  const url = `${SITE_URL}/forum/post/${post._id}`;
  const title = post.title;
  const text = `${post.title} - Join the discussion at ${SITE_NAME}`;
  
  return { url, title, text };
};

// Generate share data for an event
export const getEventShareData = (event) => {
  const url = `${SITE_URL}/events/${event._id}`;
  const title = event.title;
  const text = `${event.title} on ${new Date(event.startDate).toLocaleDateString()} at ${event.location.venue}. Join us! #IndiansInFrankfurt`;
  
  return { url, title, text };
};

// Generate share data for a resource
export const getResourceShareData = (resource) => {
  const url = `${SITE_URL}/resources#${resource.category}`;
  const title = resource.title || 'Helpful Resource';
  const text = `${title} - Useful resource from Frankfurt Indians`;
  
  return { url, title, text };
};

// Native Web Share API (for mobile)
export const nativeShare = async (data) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url
      });
      return true;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
      return false;
    }
  }
  return false;
};