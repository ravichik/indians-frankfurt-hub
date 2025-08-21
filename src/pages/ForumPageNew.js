import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, FiUser, FiClock, FiEye, FiHeart, 
  FiReply, FiPlus, FiFilter, FiSearch, FiLock,
  FiTrendingUp, FiChevronRight, FiAlertCircle, FiEdit
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { forumAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const ForumPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });

  const categories = [
    { id: 'all', name: 'All Posts', icon: '📚' },
    { id: 'general', name: 'General', icon: '💬' },
    { id: 'settling-in', name: 'Settling In', icon: '🏠' },
    { id: 'cultural-events', name: 'Cultural Events', icon: '🎉' },
    { id: 'jobs', name: 'Jobs & Career', icon: '💼' },
    { id: 'housing', name: 'Housing', icon: '🏘️' },
    { id: 'marketplace', name: 'Marketplace', icon: '🛒' }
  ];

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await forumAPI.getPosts(params);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single post with replies
  const fetchPostDetails = async (postId) => {
    try {
      const response = await forumAPI.getPost(postId);
      setSelectedPost(response.data);
    } catch (error) {
      console.error('Error fetching post details:', error);
      toast.error('Failed to load post details');
    }
  };

  // Create new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to create a post');
      return;
    }

    try {
      const postData = {
        ...newPost,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await forumAPI.createPost(postData);
      toast.success('Post created successfully!');
      setShowCreateModal(false);
      setNewPost({ title: '', content: '', category: 'general', tags: '' });
      fetchPosts();
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to create post. Please check your content.');
      }
    }
  };

  // Reply to post
  const handleReply = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to reply');
      return;
    }

    if (!selectedPost) return;

    try {
      await forumAPI.replyToPost(selectedPost._id, { content: replyContent });
      toast.success('Reply posted successfully!');
      setShowReplyModal(false);
      setReplyContent('');
      fetchPostDetails(selectedPost._id);
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to post reply. Please check your content.');
      }
    }
  };

  // Like/Unlike post
  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const response = await forumAPI.likePost(postId);
      
      // Update local state
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost({ ...selectedPost, likes: response.data.likes });
      }
      
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: response.data.likes } : post
      ));
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  // Filter posts based on search
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Community Forum
            </h1>
            <p className="text-xl text-white/90">
              Connect, share, and learn from 67,000+ Indians in Frankfurt
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Create Post Button */}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="w-full mb-6 bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <FiPlus className="mr-2" />
                Create New Post
              </motion.button>
            )}

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                      selectedCategory === category.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Forum Guidelines */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                <FiAlertCircle className="mr-2" />
                Community Guidelines
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Be respectful and courteous</li>
                <li>• No hate speech or discrimination</li>
                <li>• No spam or self-promotion</li>
                <li>• Keep content family-friendly</li>
                <li>• Help fellow community members</li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Posts List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <FiMessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg">No posts found</p>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Be the first to post
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer"
                    onClick={() => fetchPostDetails(post._id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {post.isPinned && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                              📌 Pinned
                            </span>
                          )}
                          {post.isLocked && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              <FiLock className="inline mr-1" />
                              Locked
                            </span>
                          )}
                          <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded">
                            {categories.find(c => c.id === post.category)?.name || post.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <FiUser className="w-4 h-4" />
                          <span>{post.author?.username || 'Anonymous'}</span>
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
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <FiEye className="w-4 h-4" />
                          <span>{post.views || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiMessageSquare className="w-4 h-4" />
                          <span>{post.replies?.length || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiHeart className="w-4 h-4" />
                          <span>{post.likes?.length || 0}</span>
                        </div>
                      </div>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter a descriptive title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.filter(c => c.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Share your thoughts, questions, or experiences..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Please be respectful. Inappropriate content will be moderated.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. visa, housing, jobs"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Create Post
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Details Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Post Header */}
              <div className="sticky top-0 bg-white border-b p-6 z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded">
                        {categories.find(c => c.id === selectedPost.category)?.name || selectedPost.category}
                      </span>
                      {selectedPost.isLocked && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          <FiLock className="inline mr-1" />
                          Locked
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedPost.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiUser className="w-4 h-4" />
                        <span>{selectedPost.author?.username || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiClock className="w-4 h-4" />
                        <span>
                          {selectedPost.createdAt ? 
                            formatDistanceToNow(new Date(selectedPost.createdAt), { addSuffix: true }) :
                            'Recently'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiEye className="w-4 h-4" />
                        <span>{selectedPost.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="prose max-w-none mb-6">
                  <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                </div>

                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedPost.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-4 pb-6 border-b">
                  <button
                    onClick={() => handleLike(selectedPost._id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <FiHeart className={`w-5 h-5 ${selectedPost.likes?.includes(user?.id) ? 'fill-current text-red-500' : ''}`} />
                    <span>{selectedPost.likes?.length || 0} Likes</span>
                  </button>
                  {!selectedPost.isLocked && isAuthenticated && (
                    <button
                      onClick={() => setShowReplyModal(true)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <FiReply className="w-5 h-5" />
                      <span>Reply</span>
                    </button>
                  )}
                </div>

                {/* Replies */}
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Replies ({selectedPost.replies?.length || 0})
                  </h3>
                  
                  {selectedPost.replies && selectedPost.replies.length > 0 ? (
                    <div className="space-y-4">
                      {selectedPost.replies.map((reply, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <FiUser className="w-4 h-4 text-primary-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {reply.author?.username || 'Anonymous'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {reply.createdAt ? 
                                    formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true }) :
                                    'Recently'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {reply.content}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No replies yet. Be the first to reply!
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowReplyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-2xl w-full p-6"
            >
              <h3 className="text-xl font-bold mb-4">Reply to Post</h3>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Share your thoughts..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Please be respectful. Inappropriate content will be moderated.
                  </p>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowReplyModal(false)}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Post Reply
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForumPage;