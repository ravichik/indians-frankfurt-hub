import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, FiUser, FiClock, FiEye, FiHeart, 
  FiPlus, FiSearch, FiLock, FiTrendingUp, FiBookmark,
  FiAlertCircle, FiFilter, FiChevronDown, FiTag, FiX
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { forumAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const ForumPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterPinned, setFilterPinned] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  // Filter and sort posts
  const processedPosts = useMemo(() => {
    let filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Filter pinned posts if needed
    if (filterPinned) {
      filtered = filtered.filter(post => post.isPinned);
    }

    // Sort posts
    const sorted = [...filtered].sort((a, b) => {
      // Always show pinned posts first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'mostLiked':
          return (b.likes?.length || 0) - (a.likes?.length || 0);
        case 'mostReplies':
          return (b.replies?.length || 0) - (a.replies?.length || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [posts, searchTerm, sortBy, filterPinned]);

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
              Connect, share experiences, and get answers from the community
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

            {/* Trending Topics */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <FiTrendingUp className="mr-2 text-primary-600" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {posts.slice(0, 5).map((post, idx) => (
                  <div 
                    key={post._id}
                    className="text-sm cursor-pointer hover:text-primary-600 transition-colors"
                    onClick={() => navigate(`/forum/post/${post._id}`)}
                  >
                    <p className="font-medium line-clamp-2">{post.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {post.replies?.length || 0} replies • {post.views || 0} views
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <FiTag className="mr-2 text-primary-600" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(posts.flatMap(p => p.tags || [])))
                  .slice(0, 10)
                  .map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 px-3 py-1 rounded-full cursor-pointer transition-colors"
                      onClick={() => setSearchTerm(tag)}
                    >
                      #{tag}
                    </span>
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
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts, tags, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Viewed</option>
                    <option value="mostLiked">Most Liked</option>
                    <option value="mostReplies">Most Replies</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                
                {/* Filter Pinned */}
                <button
                  onClick={() => setFilterPinned(!filterPinned)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    filterPinned 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FiBookmark className="w-4 h-4" />
                  Pinned Only
                </button>
              </div>
              
              {/* Stats Bar */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FiMessageSquare className="w-4 h-4" />
                  {processedPosts.length} Posts
                </span>
                <span className="flex items-center gap-1">
                  <FiTrendingUp className="w-4 h-4" />
                  {posts.filter(p => {
                    const date = new Date(p.createdAt);
                    const today = new Date();
                    return date.toDateString() === today.toDateString();
                  }).length} Today
                </span>
                <span className="flex items-center gap-1">
                  <FiUser className="w-4 h-4" />
                  {new Set(posts.map(p => p.author?._id)).size} Contributors
                </span>
              </div>
            </div>

            {/* Posts List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : processedPosts.length === 0 ? (
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
                {processedPosts.map((post, index) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-primary-200 group"
                    onClick={() => navigate(`/forum/post/${post._id}`)}
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
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
              className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                  <FiMessageSquare className="mr-2 text-primary-600" />
                  Create New Post
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="p-6 space-y-5">
                {/* Title and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        value={newPost.category}
                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                      >
                        {categories.filter(c => c.id !== 'all').map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title * <span className="text-xs text-gray-500">({newPost.title.length}/100)</span>
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value.slice(0, 100) })}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter a descriptive title"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content * <span className="text-xs text-gray-500">({newPost.content.length}/2000)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value.slice(0, 2000) })}
                      required
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Share your thoughts, questions, or experiences...\n\nYou can format your post with line breaks for better readability."
                    />
                    {/* Character count indicator */}
                    <div className={`absolute bottom-2 right-2 text-xs ${
                      newPost.content.length > 1800 ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {2000 - newPost.content.length} characters remaining
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 mt-2">
                    <FiAlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">
                      Please be respectful and follow community guidelines. Posts with inappropriate content will be moderated.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags <span className="text-xs text-gray-500">(Optional, comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. visa, housing, jobs, community"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tags help others find your post. Use relevant keywords.
                  </p>
                </div>

                {/* Preview Section */}
                {(newPost.title || newPost.content) && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded">
                          {categories.find(c => c.id === newPost.category)?.name || 'General'}
                        </span>
                        {newPost.tags && newPost.tags.split(',').filter(t => t.trim()).map((tag, idx) => (
                          <span key={idx} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            #{tag.trim()}
                          </span>
                        )).slice(0, 3)}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {newPost.title || 'Your post title'}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {newPost.content || 'Your post content will appear here...'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-xs text-gray-500">
                    * Required fields
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setNewPost({ title: '', content: '', category: 'general', tags: '' });
                      }}
                      className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newPost.title.trim() || !newPost.content.trim()}
                      className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <FiPlus className="mr-2" />
                      Create Post
                    </button>
                  </div>
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