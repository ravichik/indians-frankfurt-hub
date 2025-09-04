import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, FiUser, FiClock, FiTag, FiSearch,
  FiTrendingUp, FiBookOpen, FiHeart, FiEye, FiPlus, FiMail, FiCheck
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { blogAPI, subscriptionAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import EnhancedSEO from '../components/EnhancedSEO';
import { generatePageSEO } from '../utils/seoUtils';
import toast from 'react-hot-toast';

const SubscribeSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await subscriptionAPI.subscribe({ 
        email, 
        type: 'blog' 
      });
      
      if (response.data.success) {
        setSubscribed(true);
        setEmail('');
        toast.success(response.data.message || 'Successfully subscribed!');
      } else {
        toast.error(response.data.message || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-green-50 rounded-lg p-6 text-center">
        <FiCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-sm text-gray-600">
          You're now subscribed to our blog newsletter.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-primary-50 rounded-lg p-6">
      <h3 className="font-bold text-gray-900 mb-2 flex items-center">
        <FiMail className="mr-2" />
        Stay Updated
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Get the latest articles delivered to your inbox
      </p>
      <form onSubmit={handleSubscribe}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
};

const BlogPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const seoData = generatePageSEO('blog');

  const categories = [
    { value: 'all', label: 'All Posts', icon: '📚' },
    { value: 'culture', label: 'Culture', icon: '🎭' },
    { value: 'lifestyle', label: 'Lifestyle', icon: '🌟' },
    { value: 'career', label: 'Career', icon: '💼' },
    { value: 'events', label: 'Events', icon: '📅' },
    { value: 'food', label: 'Food', icon: '🍛' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'education', label: 'Education', icon: '📖' },
    { value: 'technology', label: 'Technology', icon: '💻' }
  ];

  useEffect(() => {
    fetchPosts();
    fetchFeaturedPosts();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 9,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      };

      const response = await blogAPI.getPosts(params);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedPosts = async () => {
    try {
      const response = await blogAPI.getPosts({ featured: true, limit: 3 });
      setFeaturedPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedSEO {...seoData} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frankfurt Indians Blog
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Stories, insights, and experiences from the Indian community in Frankfurt
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full px-6 py-4 pr-12 text-gray-900 bg-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Admin Button */}
            {user?.role === 'admin' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/blog/new')}
                className="mt-6 inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-full font-semibold hover:bg-primary-50 transition-colors"
              >
                <FiPlus className="mr-2" />
                Write New Article
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <FiTrendingUp className="text-primary-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400"></div>
                    )}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="flex items-center mr-4">
                      <FiCalendar className="mr-1" />
                      {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                    </span>
                    <span className="flex items-center">
                      <FiClock className="mr-1" />
                      {post.readingTime} min read
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.value}
                        onClick={() => {
                          setSelectedCategory(category.value);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                          selectedCategory === category.value
                            ? 'bg-primary-100 text-primary-700'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <SubscribeSection />
              </div>
            </aside>

            {/* Blog Posts Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {posts.map((post, index) => (
                        <motion.article
                          key={post._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                          onClick={() => navigate(`/blog/${post.slug}`)}
                        >
                          {post.featuredImage && (
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                              <span className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 text-gray-900 text-xs font-semibold rounded-full">
                                {categories.find(c => c.value === post.category)?.label}
                              </span>
                            </div>
                          )}
                          
                          <div className="p-6">
                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                              {post.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center">
                                  <FiUser className="mr-1" />
                                  {post.author?.name}
                                </span>
                                <span className="flex items-center">
                                  <FiClock className="mr-1" />
                                  {post.readingTime} min
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center">
                                  <FiEye className="mr-1" />
                                  {post.views}
                                </span>
                                <span className="flex items-center">
                                  <FiHeart className="mr-1" />
                                  {post.likes?.length || 0}
                                </span>
                              </div>
                            </div>
                            
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {post.tags.slice(0, 3).map(tag => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-4 py-2 rounded-lg shadow-sm ${
                            currentPage === i + 1
                              ? 'bg-primary-600 text-white'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <FiBookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'Check back later for new content'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;