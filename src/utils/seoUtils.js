// SEO utility functions for generating metadata and structured data

export const generateForumPostSEO = (post) => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  return {
    title: post.title,
    description: post.content.substring(0, 160).replace(/[#*\n]/g, ''),
    keywords: `${post.category}, Frankfurt Indian forum, ${post.tags?.join(', ') || ''}`,
    image: `${apiUrl}/api/og/forum/${post._id}`,
    type: 'article',
    author: post.author?.name,
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt,
    section: post.category,
    tags: post.tags || [],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "DiscussionForumPosting",
      "headline": post.title,
      "text": post.content,
      "author": {
        "@type": "Person",
        "name": post.author?.name
      },
      "datePublished": post.createdAt,
      "dateModified": post.updatedAt,
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/ViewAction",
          "userInteractionCount": post.views
        },
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/LikeAction",
          "userInteractionCount": post.likes?.length || 0
        },
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/CommentAction",
          "userInteractionCount": post.replies?.length || 0
        }
      ]
    }
  };
};

export const generateEventSEO = (event) => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://www.frankfurtindians.com';
  
  return {
    title: event.title,
    description: event.description.substring(0, 160),
    keywords: `${event.category}, Frankfurt Indian events, ${event.tags?.join(', ') || ''}`,
    image: `${apiUrl}/api/og/event/${event._id}`,
    type: 'website',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.title,
      "description": event.description,
      "startDate": event.date,
      "endDate": event.endDate || event.date,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": event.isOnline ? 
        "https://schema.org/OnlineEventAttendanceMode" : 
        "https://schema.org/OfflineEventAttendanceMode",
      "location": event.isOnline ? {
        "@type": "VirtualLocation",
        "url": event.meetingLink || siteUrl
      } : {
        "@type": "Place",
        "name": event.venue,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": event.address,
          "addressLocality": "Frankfurt",
          "addressRegion": "Hessen",
          "addressCountry": "DE"
        }
      },
      "organizer": {
        "@type": "Organization",
        "name": "Frankfurt Indians",
        "url": siteUrl
      },
      "offers": {
        "@type": "Offer",
        "price": event.price || "0",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": `${siteUrl}/events/${event._id}`
      },
      "image": `${apiUrl}/api/og/event/${event._id}`,
      "performer": event.speakers?.map(speaker => ({
        "@type": "Person",
        "name": speaker
      }))
    }
  };
};

export const generateResourceSEO = (resource) => {
  return {
    title: resource.title,
    description: resource.description,
    keywords: `${resource.category}, Frankfurt Indian resources, expat resources Germany`,
    type: 'article',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": resource.title,
      "description": resource.description,
      "author": {
        "@type": "Organization",
        "name": "Frankfurt Indians"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Frankfurt Indians",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.frankfurtindians.com/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.frankfurtindians.com/resources/${resource.category}`
      }
    }
  };
};

export const generateProfileSEO = (user) => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  return {
    title: `${user.name} - Profile`,
    description: `View ${user.name}'s profile on Frankfurt Indians community platform`,
    image: `${apiUrl}/api/og/profile/${user._id}`,
    type: 'profile',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": user.name,
      "email": user.email,
      "memberOf": {
        "@type": "Organization",
        "name": "Frankfurt Indians"
      },
      "url": `https://www.frankfurtindians.com/profile/${user._id}`
    }
  };
};

export const generatePageSEO = (pageName) => {
  const pages = {
    home: {
      title: 'Frankfurt Indians - Indian Community in Frankfurt',
      description: 'Join the largest Indian community platform in Frankfurt. Connect with fellow Indians, find events, resources, jobs, and housing tips for expats in Germany.',
      keywords: 'Frankfurt Indians, Indian community Frankfurt, Indian expats Germany, Indians in Frankfurt am Main',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Frankfurt Indians",
        "url": "https://www.frankfurtindians.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.frankfurtindians.com/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }
    },
    forum: {
      title: 'Community Forum',
      description: 'Discuss topics, ask questions, and share experiences with the Indian community in Frankfurt. Get help on settling in, jobs, housing, and more.',
      keywords: 'Frankfurt Indian forum, Indian community discussions, expat forum Germany'
    },
    events: {
      title: 'Indian Events in Frankfurt',
      description: 'Discover upcoming Indian cultural events, festivals, meetups, and networking opportunities in Frankfurt and surrounding areas.',
      keywords: 'Indian events Frankfurt, Diwali Frankfurt, Holi Frankfurt, Indian festivals Germany'
    },
    resources: {
      title: 'Resources for Indians in Frankfurt',
      description: 'Essential resources for Indian expats in Frankfurt - visa guidance, housing tips, job search, healthcare, education, and settling-in help.',
      keywords: 'Indian expat resources Frankfurt, settling in Germany, Frankfurt expat guide'
    },
    jobs: {
      title: 'Jobs for Indians in Frankfurt',
      description: 'Find job opportunities for Indian professionals in Frankfurt. IT jobs, finance positions, and career opportunities for Indian expats.',
      keywords: 'Jobs Frankfurt Indians, Indian professionals Germany, IT jobs Frankfurt'
    },
    housing: {
      title: 'Housing Guide for Indians in Frankfurt',
      description: 'Complete guide to finding accommodation in Frankfurt for Indian expats. Tips on renting, areas to live, and housing search.',
      keywords: 'Frankfurt housing Indians, Indian accommodation Frankfurt, expat housing Germany'
    },
    blog: {
      title: 'Blog - Frankfurt Indians',
      description: 'Read the latest articles, stories, and insights from the Indian community in Frankfurt. Culture, lifestyle, career tips, and expat experiences.',
      keywords: 'Indian blog Frankfurt, Indian expat stories, Frankfurt Indian articles, Indian community blog Germany'
    }
  };

  return pages[pageName] || pages.home;
};

// Generate meta tags for social sharing
export const generateSocialMeta = (title, description, image) => {
  return {
    // WhatsApp
    'og:title': title,
    'og:description': description,
    'og:image': image,
    
    // LinkedIn
    'linkedin:title': title,
    'linkedin:description': description,
    'linkedin:image': image,
    
    // Telegram
    'telegram:title': title,
    'telegram:description': description,
    'telegram:image': image
  };
};

// Generate rich snippets for search results
export const generateRichSnippets = (type, data) => {
  switch (type) {
    case 'faq':
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.questions.map(q => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer
          }
        }))
      };
    
    case 'howto':
      return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": data.title,
        "description": data.description,
        "step": data.steps.map((step, index) => ({
          "@type": "HowToStep",
          "position": index + 1,
          "name": step.title,
          "text": step.description
        }))
      };
    
    case 'review':
      return {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
          "@type": data.itemType || "Thing",
          "name": data.itemName
        },
        "author": {
          "@type": "Person",
          "name": data.authorName
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": data.rating,
          "bestRating": "5"
        },
        "reviewBody": data.reviewText
      };
    
    default:
      return null;
  }
};