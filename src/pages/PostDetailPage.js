import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiUser, FiClock, FiEye, FiHeart, 
  FiMessageSquare, FiEdit2, FiTrash2, FiLock, 
  FiUnlock, FiShield, FiBookmark,
  FiChevronDown, FiAlertCircle, FiThumbsUp, FiCheckCircle
} from 'react-icons/fi';
import { RiPushpinFill, RiPushpinLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { forumAPI } from '../services/api';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';
import ShareButton from '../components/ShareButton';
import { getPostShareData } from '../utils/shareUtils';
import MarkdownDisplay from '../components/MarkdownDisplay';
import UserBadge from '../components/UserBadge';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [editingReply, setEditingReply] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingReplyId, setDeletingReplyId] = useState(null);
  const [sortReplies, setSortReplies] = useState('oldest');
  const [hasUserThanked, setHasUserThanked] = useState(false);
  const [thanksCount, setThanksCount] = useState(0);

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator';
  const canModerate = isAdmin || isModerator;
  const isAuthor = user?.id === post?.author?._id || user?.userId === post?.author?._id || user?._id === post?.author?._id;

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await forumAPI.getPost(id);
      const postData = response.data;
      setPost(postData);
      
      // Set thanks data
      if (postData.thanks) {
        setThanksCount(postData.thanks.length);
        if (user) {
          const userId = user.id || user.userId || user._id;
          setHasUserThanked(postData.thanks.includes(userId));
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      await forumAPI.likePost(id);
      fetchPost();
      toast.success('Post liked!');
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleThank = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to thank posts');
      return;
    }

    try {
      const response = await forumAPI.thankPost(id);
      setHasUserThanked(response.data.thanked);
      setThanksCount(response.data.thanksCount);
      toast.success(response.data.thanked ? 'Thank you added!' : 'Thank you removed');
    } catch (error) {
      toast.error('Failed to thank post');
    }
  };

  const handleMarkSolution = async () => {
    if (!canModerate) return;
    
    try {
      const response = await forumAPI.markSolution(id);
      toast.success(response.data.message);
      fetchPost();
    } catch (error) {
      toast.error('Failed to mark as solution');
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

    try {
      await forumAPI.replyToPost(id, replyContent);
      toast.success('Reply posted!');
      setReplyContent('');
      fetchPost();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to post reply');
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await forumAPI.deleteReply(id, replyId);
      toast.success('Reply deleted');
      setDeletingReplyId(null);
      fetchPost();
    } catch (error) {
      toast.error('Failed to delete reply');
    }
  };

  const handleLockToggle = async () => {
    try {
      await forumAPI.lockPost(id, !post.isLocked);
      toast.success(post.isLocked ? 'Post unlocked' : 'Post locked');
      fetchPost();
    } catch (error) {
      toast.error('Failed to update post lock status');
    }
  };

  const handlePinToggle = async () => {
    try {
      await forumAPI.pinPost(id, !post.isPinned);
      toast.success(post.isPinned ? 'Post unpinned' : 'Post pinned');
      fetchPost();
    } catch (error) {
      toast.error('Failed to update post pin status');
    }
  };

  const handleDeletePost = async () => {
    try {
      await forumAPI.deletePost(id);
      toast.success('Post deleted');
      navigate('/forum');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const sortedReplies = post?.replies ? [...post.replies].sort((a, b) => {
    switch (sortReplies) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'likes':
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      default:
        return 0;
    }
  }) : [];

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <button onClick={() => navigate('/forum')} className="text-primary-600 hover:text-primary-700">
            Return to Forum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Back Navigation */}
        <button
          onClick={() => navigate('/forum')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 md:mb-6 transition-colors text-sm md:text-base"
        >
          <FiArrowLeft className="mr-2" />
          Back to Forum
        </button>

        {/* Main Post */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg md:rounded-xl shadow-lg overflow-hidden mb-6 md:mb-8"
        >
          {/* Post Header */}
          <div className="p-4 md:p-6 border-b">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  {post.isPinned && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                      📌 Pinned
                    </span>
                  )}
                  {post.isLocked && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center">
                      <FiLock className="mr-1" />
                      Locked
                    </span>
                  )}
                  <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  {post.tags?.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                  {post.isSolution && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <FiCheckCircle className="mr-1" />
                      Solution
                    </span>
                  )}
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                  {post.title}
                </h1>
              </div>
              
              {/* Action Buttons */}
              {(canModerate || isAuthor) && (
                <div className="flex items-center space-x-2">
                  {isAdmin && (
                    <button
                      onClick={handlePinToggle}
                      className={`p-2 rounded-lg transition-colors ${
                        post.isPinned 
                          ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title={post.isPinned ? 'Unpin Post' : 'Pin Post'}
                    >
                      {post.isPinned ? <RiPushpinFill /> : <RiPushpinLine />}
                    </button>
                  )}
                  {canModerate && (
                    <>
                      <button
                        onClick={handleLockToggle}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={post.isLocked ? 'Unlock Post' : 'Lock Post'}
                      >
                        {post.isLocked ? <FiUnlock /> : <FiLock />}
                      </button>
                      <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        <FiShield className="mr-1" />
                        {isAdmin ? 'Admin' : 'Moderator'}
                      </span>
                    </>
                  )}
                  {(isAdmin || isAuthor) && (
                    <button
                      onClick={() => navigate(`/forum/edit/${id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <FiEdit2 />
                    </button>
                  )}
                  {(canModerate || isAuthor) && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Post"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${post.author?.username}&background=random`}
                  alt={post.author?.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{post.author?.username}</p>
                    {post.author && <UserBadge user={post.author} size="xs" showPoints={false} />}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              {/* Post Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <FiEye className="mr-1" />
                  {post.views || 0} views
                </span>
                <span className="flex items-center">
                  <FiMessageSquare className="mr-1" />
                  {post.replies?.length || 0} replies
                </span>
                <span className="flex items-center">
                  <FiHeart className="mr-1" />
                  {post.likes?.length || 0} likes
                </span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-4 md:p-6">
            <div className="prose prose-sm md:prose-base max-w-none">
              <MarkdownDisplay content={post.content} />
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    post.likes?.includes(user?.id || user?.userId || user?._id)
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FiHeart className={post.likes?.includes(user?.id || user?.userId || user?._id) ? 'fill-current' : ''} />
                  <span>{post.likes?.length || 0}</span>
                </button>
                <button
                  onClick={handleThank}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    hasUserThanked
                      ? 'bg-green-50 text-green-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Thank this post"
                >
                  <FiThumbsUp className={hasUserThanked ? 'fill-current' : ''} />
                  <span>{thanksCount}</span>
                </button>
                {canModerate && (
                  <button
                    onClick={handleMarkSolution}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      post.isSolution
                        ? 'bg-purple-50 text-purple-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Mark as solution"
                  >
                    <FiCheckCircle className={post.isSolution ? 'fill-current' : ''} />
                    <span>Solution</span>
                  </button>
                )}
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <FiBookmark />
                  <span>Save</span>
                </button>
                <ShareButton 
                  shareData={getPostShareData(post)}
                  buttonText="Share"
                  dropdownPosition="bottom-left"
                />
              </div>
              {post.updatedAt !== post.createdAt && (
                <p className="text-xs text-gray-500">
                  Edited {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                </p>
              )}
            </div>
          </div>
        </motion.article>

        {/* Replies Section */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Replies ({post.replies?.length || 0})
            </h2>
            {post.replies?.length > 0 && (
              <div className="relative">
                <select
                  value={sortReplies}
                  onChange={(e) => setSortReplies(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="oldest">Oldest First</option>
                  <option value="newest">Newest First</option>
                  <option value="likes">Most Liked</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Reply Form */}
          {!post.isLocked && isAuthenticated ? (
            <form onSubmit={handleReply} className="mb-6">
              <div className="flex items-start space-x-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.username}&background=random`}
                  alt={user?.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Be respectful and helpful in your response
                    </p>
                    <button
                      type="submit"
                      disabled={!replyContent.trim()}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : post.isLocked ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center">
              <FiLock className="mr-2 text-gray-500" />
              <p className="text-gray-600">This post is locked and no longer accepting replies.</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-600">
                <button onClick={() => navigate('/login')} className="text-primary-600 hover:text-primary-700 font-medium">
                  Login
                </button> to reply to this post
              </p>
            </div>
          )}

          {/* Replies List */}
          <div className="space-y-4">
            {sortedReplies.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No replies yet. Be the first to reply!</p>
            ) : (
              sortedReplies.map((reply) => {
                const isReplyAuthor = user?.id === reply.author?._id || user?.userId === reply.author?._id || user?._id === reply.author?._id;
                
                return (
                  <motion.div
                    key={reply._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-l-2 border-gray-200 pl-4 py-3 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <img
                          src={`https://ui-avatars.com/api/?name=${reply.author?.username}&background=random`}
                          alt={reply.author?.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{reply.author?.username}</span>
                            {reply.author && <UserBadge user={reply.author} size="xs" showPoints={false} />}
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          {editingReply === reply._id ? (
                            <div>
                              <textarea
                                defaultValue={reply.content}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                rows={3}
                              />
                              <div className="flex space-x-2 mt-2">
                                <button className="text-sm text-primary-600 hover:text-primary-700">
                                  Save
                                </button>
                                <button 
                                  onClick={() => setEditingReply(null)}
                                  className="text-sm text-gray-600 hover:text-gray-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-700">
                              <MarkdownDisplay content={reply.content} />
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-4 mt-2">
                            <button className="text-sm text-gray-500 hover:text-primary-600 flex items-center">
                              <FiHeart className="mr-1" />
                              {reply.likes?.length || 0}
                            </button>
                            {!post.isLocked && isAuthenticated && (
                              <button className="text-sm text-gray-500 hover:text-primary-600">
                                Reply
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {(canModerate || isReplyAuthor) && (
                        <div className="flex items-center space-x-1">
                          {isReplyAuthor && !post.isLocked && (
                            <button
                              onClick={() => setEditingReply(reply._id)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          )}
                          {(canModerate || isReplyAuthor) && (
                            <button
                              onClick={() => {
                                setDeletingReplyId(reply._id);
                                handleDeleteReply(reply._id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Delete Post Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="flex items-center mb-4 text-red-600">
                <FiAlertCircle className="mr-2 w-6 h-6" />
                <h3 className="text-xl font-bold">Delete Post</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostDetailPage;