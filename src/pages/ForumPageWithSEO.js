import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EnhancedSEO from '../components/EnhancedSEO';
import { generateForumPostSEO, generatePageSEO } from '../utils/seoUtils';
import api from '../services/api';

// Example implementation showing how to use the enhanced SEO components

const ForumPageWithSEO = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    if (postId) {
      // Fetch individual post
      fetchPost();
    } else {
      // Set SEO for forum listing page
      setSeoData(generatePageSEO('forum'));
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/forum/posts/${postId}`);
      setPost(response.data);
      
      // Generate SEO data for the specific post
      const postSEO = generateForumPostSEO(response.data);
      setSeoData(postSEO);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  // Early return with SEO while loading
  if (loading) {
    return (
      <>
        <EnhancedSEO {...(seoData || generatePageSEO('forum'))} />
        <div className="loading">Loading...</div>
      </>
    );
  }

  return (
    <>
      {/* SEO Component with all metadata */}
      <EnhancedSEO
        {...seoData}
        url={`https://www.frankfurtindians.com/forum${postId ? `/post/${postId}` : ''}`}
      />

      {/* Your existing forum UI components */}
      <div className="forum-page">
        {post ? (
          <article>
            <h1>{post.title}</h1>
            <div className="post-meta">
              <span>By {post.author?.name}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>{post.views} views</span>
            </div>
            <div className="post-content">
              {post.content}
            </div>
          </article>
        ) : (
          <div className="forum-listing">
            {/* Forum listing UI */}
          </div>
        )}
      </div>
    </>
  );
};

export default ForumPageWithSEO;