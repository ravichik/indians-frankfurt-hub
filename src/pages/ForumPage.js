import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, FiUser, FiClock, FiEye, FiHeart, 
  FiPlus, FiSearch, FiLock, FiTrendingUp, FiBookmark,
  FiAlertCircle, FiFilter, FiChevronDown, FiTag, FiX,
  FiEdit2, FiShield
} from 'react-icons/fi';
import { RiPushpinFill, RiPushpinLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { forumAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import ShareButton from '../components/ShareButton';
import { getPostShareData } from '../utils/shareUtils';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownDisplay from '../components/MarkdownDisplay';
import UserBadge from '../components/UserBadge';
import EnhancedSEO from '../components/EnhancedSEO';
import { generatePageSEO } from '../utils/seoUtils';

const ForumPage = () => {
  const { user, isAuthenticated } = useAuth();
  const seoData = generatePageSEO('forum');
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterPinned, setFilterPinned] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
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

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator';
  const canModerate = isAdmin || isModerator;

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

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Title and content are required');
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

  // Handle pin/unpin post
  const handlePinPost = async (e, postId, isPinned) => {
    e.stopPropagation();
    try {
      await forumAPI.pinPost(postId, !isPinned);
      toast.success(isPinned ? 'Post unpinned' : 'Post pinned');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to update pin status');
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
      <EnhancedSEO {...seoData} />
      {/* Mobile-optimized Header Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-6 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-5xl font-display font-bold mb-2 md:mb-4">
              Community Forum
            </h1>
            <p className="text-sm md:text-xl text-white/90">
              Connect and share with the community
            </p>
          </motion.div>
          
          {/* Mobile Action Bar */}
          <div className="flex gap-2 mt-4 md:hidden">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="flex-1 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg text-white flex items-center justify-center gap-2"
            >
              <FiSearch className="w-4 h-4" />
              Search
            </button>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex-1 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg text-white flex items-center justify-center gap-2"
            >
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white/30 backdrop-blur-sm px-3 py-2 rounded-lg text-white"
              >
                <FiPlus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>
      
      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b md:hidden overflow-hidden"
          >
            <div className="p-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Filters */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b md:hidden overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Categories */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowMobileFilters(false);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        selectedCategory === category.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sort Options */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Sort by</p>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setShowMobileFilters(false);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Viewed</option>
                  <option value="mostLiked">Most Liked</option>
                  <option value="mostReplies">Most Replies</option>
                </select>
              </div>
              
              {/* Pinned Filter */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filterPinned}
                  onChange={(e) => {
                    setFilterPinned(e.target.checked);
                    setShowMobileFilters(false);
                  }}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Show pinned only</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Mobile Stats Bar */}
        <div className="md:hidden bg-white rounded-lg shadow-sm p-3 mb-4">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{processedPosts.length}</p>
              <p className="text-xs text-gray-500">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {posts.filter(p => {
                  const date = new Date(p.createdAt);
                  const today = new Date();
                  return date.toDateString() === today.toDateString();
                }).length}
              </p>
              <p className="text-xs text-gray-500">Today</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(posts.map(p => p.author?._id)).size}
              </p>
              <p className="text-xs text-gray-500">Members</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:col-span-1">
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
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-100 p-4 mb-6">
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
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-100 p-4 mb-6">
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
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-100 p-4 mb-6">
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

          {/* Main Content - Full width on mobile */}
          <div className="col-span-1 lg:col-span-3">
            {/* Desktop Toolbar - Hidden on mobile */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm p-4 mb-6">
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
            
            {/* Mobile Category Pills */}
            <div className="md:hidden mb-4 -mx-4 px-4 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm transition-all flex-shrink-0 ${
                      selectedCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts List */}
            {loading ? (
              <div className="flex justify-center py-8 md:py-12">
                <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : processedPosts.length === 0 ? (
              <div className="text-center py-8 md:py-12 bg-white rounded-lg md:rounded-xl shadow-sm">
                <FiMessageSquare className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-300 mb-3 md:mb-4" />
                <p className="text-gray-600 text-base md:text-lg">No posts found</p>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-3 md:mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm md:text-base"
                  >
                    Be the first to post
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {processedPosts.map((post, index) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-3 sm:p-4 md:p-6 cursor-pointer border border-gray-100 hover:border-primary-200 group"
                    onClick={() => navigate(`/forum/post/${post._id}`)}
                  >
                    <div className="flex flex-col w-full">
                      {/* Tags and Category Section */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {post.isPinned && (
                          <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            📌 Pinned
                          </span>
                        )}
                        {post.isLocked && (
                          <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            <FiLock className="mr-1" />
                            Locked
                          </span>
                        )}
                        <span className="inline-flex items-center bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded">
                          {categories.find(c => c.id === post.category)?.name || post.category}
                        </span>
                      </div>
                      
                      {/* Title and Content */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 pr-2">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors break-words">
                            {post.title}
                          </h3>
                          <div className="text-sm md:text-base text-gray-600">
                            <MarkdownDisplay content={post.content} className="line-clamp-2" truncate={true} />
                          </div>
                        </div>
                      
                        {/* Admin/Moderator Actions */}
                        {(isAdmin || (isModerator && !post.isPinned)) && (
                          <div className="flex items-center space-x-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          {isAdmin && (
                            <button
                              onClick={(e) => handlePinPost(e, post._id, post.isPinned)}
                              className={`p-1.5 rounded transition-colors ${
                                post.isPinned 
                                  ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                                  : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                              }`}
                              title={post.isPinned ? 'Unpin' : 'Pin'}
                            >
                              {post.isPinned ? <RiPushpinFill className="w-4 h-4" /> : <RiPushpinLine className="w-4 h-4" />}
                            </button>
                          )}
                          {(isAdmin || post.author?._id === user?.id || post.author?._id === user?.userId || post.author?._id === user?._id) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/forum/edit/${post._id}`);
                              }}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          )}
                          {canModerate && (
                            <span className="ml-1 text-xs text-purple-600" title={isAdmin ? 'Admin' : 'Moderator'}>
                              <FiShield className="w-3 h-3" />
                            </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Post Metadata */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <FiUser className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">{post.author?.username || 'Anonymous'}</span>
                          </div>
                          <UserBadge user={post.author} size="xs" showPoints={false} />
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          <span>
                            {post.createdAt ? 
                              formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }).replace('about ', '') :
                              'Recently'
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiEye className="w-3 h-3" />
                          <span>{post.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiMessageSquare className="w-3 h-3" />
                          <span>{post.replies?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiHeart className="w-3 h-3" />
                          <span>{post.likes?.length || 0}</span>
                        </div>
                        {post.thanks && post.thanks.length > 0 && (
                          <div className="flex items-center gap-1 text-green-600">
                            <span>👏</span>
                            <span>{post.thanks.length}</span>
                          </div>
                        )}
                        {post.isSolution && (
                          <span className="inline-flex items-center bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                            ✓ Solution
                          </span>
                        )}
                        <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                          <ShareButton 
                            shareData={getPostShareData(post)}
                            buttonText=""
                            showLabel={false}
                            buttonClass="p-1 hover:bg-gray-100 rounded transition-colors"
                            dropdownPosition="bottom-right"
                          />
                        </div>
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {post.tags.slice(0, 4).map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 4 && (
                            <span className="inline-flex items-center text-xs text-gray-500 px-1">+{post.tags.length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating Action Button for Mobile */}
      {isAuthenticated && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200 flex items-center justify-center z-40 hover:scale-110"
        >
          <FiPlus className="w-6 h-6" />
        </button>
      )}

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
              className="bg-white/95 backdrop-blur-md rounded-t-2xl md:rounded-2xl max-w-3xl w-full md:max-h-[90vh] h-full md:h-auto overflow-y-auto fixed md:relative bottom-0 md:bottom-auto shadow-2xl border border-neutral-100"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold flex items-center">
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

              <form onSubmit={handleCreatePost} className="p-4 md:p-6 space-y-4 md:space-y-5 pb-safe">
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
                    Content *
                  </label>
                  <MarkdownEditor
                    value={newPost.content}
                    onChange={(value) => setNewPost({ ...newPost, content: value })}
                    placeholder="Share your thoughts, questions, or experiences...\n\nYou can use **bold**, *italic*, [links](url), and more!"
                    height="250px"
                    maxLength={2000}
                  />
                  <div className="flex items-start space-x-2 mt-2">
                    <FiAlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">
                      Please be respectful and follow community guidelines. Use markdown for formatting.
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
                      <div className="text-gray-600 text-sm">
                        <MarkdownDisplay content={newPost.content || 'Your post content will appear here...'} className="line-clamp-3" truncate={true} />
                      </div>
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