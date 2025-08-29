import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, FiUser, FiClock, FiEye, FiHeart, 
  FiArrowLeft, FiLock, FiCornerDownRight, FiAlertCircle,
  FiEdit2, FiTrash2, FiShield
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { forumAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import EnhancedSEO from '../components/EnhancedSEO';
import { generateForumPostSEO } from '../utils/seoUtils';

const ForumPostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await forumAPI.getPost(id);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to reply');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    setSubmitting(true);
    try {
      await forumAPI.replyToPost(post._id, replyContent);
      toast.success('Reply posted successfully!');
      setReplyContent('');
      setShowReplyForm(false);
      fetchPost(); // Refresh to show new reply
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to post reply. Please check your content.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const response = await forumAPI.likePost(post._id);
      setPost({ ...post, likes: response.data.likes });
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSubmitting(true);
    try {
      await forumAPI.updatePost(post._id, {
        title: editTitle,
        content: editContent
      });
      toast.success('Post updated successfully');
      setIsEditing(false);
      fetchPost(); // Refresh the post
    } catch (error) {
      toast.error('Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await forumAPI.deletePost(post._id);
        toast.success('Post deleted successfully');
        navigate('/forum');
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        await forumAPI.deleteReply(post._id, replyId);
        toast.success('Reply deleted successfully');
        fetchPost(); // Refresh to show updated replies
      } catch (error) {
        toast.error('Failed to delete reply');
      }
    }
  };

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator';
  const canModerate = isAdmin || isModerator;
  const isAuthor = user?.id === post?.author?._id || user?.userId === post?.author?._id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Post not found</p>
          <Link to="/forum" className="text-primary-600 hover:text-primary-700">
            Return to Forum
          </Link>
        </div>
      </div>
    );
  }

  const categories = {
    'general': { name: 'General', icon: '💬' },
    'settling-in': { name: 'Settling In', icon: '🏠' },
    'cultural-events': { name: 'Cultural Events', icon: '🎉' },
    'jobs': { name: 'Jobs & Career', icon: '💼' },
    'housing': { name: 'Housing', icon: '🏘️' },
    'marketplace': { name: 'Marketplace', icon: '🛒' }
  };

  const category = categories[post.category] || { name: post.category, icon: '📌' };

  const seoData = post ? generateForumPostSEO(post) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {seoData && <EnhancedSEO {...seoData} />}
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/forum')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Forum</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{category.icon}</span>
              <span className="bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full">
                {category.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm"
        >
          {/* Post Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {post.isPinned && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-2">
                    📌 Pinned
                  </span>
                )}
                {post.isLocked && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-2 ml-2">
                    <FiLock className="inline mr-1" />
                    Locked
                  </span>
                )}
                {isEditing ? (
                  <div className="space-y-3 mb-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Post title"
                    />
                  </div>
                ) : (
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {post.title}
                  </h1>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="font-medium">{post.author?.username || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiClock className="w-4 h-4" />
                    <span>
                      {post.createdAt ? 
                        formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) :
                        'Recently'
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiEye className="w-4 h-4" />
                    <span>{post.views || 0} views</span>
                  </div>
                </div>
              </div>
              {/* Admin Controls */}
              {(canModerate || isAuthor) && !isEditing && (
                <div className="flex items-center space-x-2">
                  {canModerate && (
                    <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      <FiShield className="mr-1" />
                      {isAdmin ? 'Admin' : 'Moderator'}
                    </span>
                  )}
                  <button
                    onClick={handleEdit}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Post"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  {canModerate && (
                    <button
                      onClick={handleDelete}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Post"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={submitting}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={submitting}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            {isEditing ? (
              <div className="mb-6">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Post content"
                />
              </div>
            ) : (
              <div className="prose max-w-none text-gray-700 mb-6">
                <p className="whitespace-pre-wrap text-base leading-relaxed">
                  {post.content}
                </p>
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between py-4 border-t border-b">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <FiHeart 
                    className={`w-5 h-5 ${
                      post.likes?.includes(user?.id) ? 'fill-current text-red-500' : ''
                    }`} 
                  />
                  <span>{post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiMessageSquare className="w-5 h-5" />
                  <span>{post.replies?.length || 0} {post.replies?.length === 1 ? 'Reply' : 'Replies'}</span>
                </div>
              </div>
              {!post.isLocked && isAuthenticated && !showReplyForm && (
                <button
                  onClick={() => setShowReplyForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FiCornerDownRight className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              )}
            </div>

            {/* Reply Form */}
            <AnimatePresence>
              {showReplyForm && !post.isLocked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <form onSubmit={handleReply} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Reply
                      </label>
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Share your thoughts..."
                        disabled={submitting}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Be respectful and constructive. Inappropriate content will be moderated.
                      </p>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowReplyForm(false);
                          setReplyContent('');
                        }}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting || !replyContent.trim()}
                      >
                        {submitting ? 'Posting...' : 'Post Reply'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Replies Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Replies ({post.replies?.length || 0})
              </h2>

              {post.isLocked && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center text-yellow-800">
                    <FiLock className="w-5 h-5 mr-2" />
                    <p className="text-sm">This discussion has been locked. No new replies can be added.</p>
                  </div>
                </div>
              )}

              {post.replies && post.replies.length > 0 ? (
                <div className="space-y-4">
                  {post.replies.map((reply, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FiUser className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between mb-2">
                            <div>
                              <span className="font-medium text-gray-900">
                                {reply.author?.username || 'Anonymous'}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {reply.createdAt ? 
                                  formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true }) :
                                  'Recently'
                                }
                              </span>
                            </div>
                            {canModerate && (
                              <button
                                onClick={() => handleDeleteReply(reply._id || index)}
                                className="text-red-600 hover:text-red-700 p-1"
                                title="Delete Reply"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {reply.content}
                          </p>
                          {reply.likes && reply.likes.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                              {reply.likes.length} {reply.likes.length === 1 ? 'like' : 'likes'}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FiMessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No replies yet</p>
                  {isAuthenticated && !post.isLocked && (
                    <p className="text-sm text-gray-400 mt-2">Be the first to share your thoughts!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.article>

        {/* Community Guidelines Reminder */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <FiAlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Community Guidelines</p>
              <p>Please keep discussions respectful and on-topic. Report any inappropriate content to moderators.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPostView;