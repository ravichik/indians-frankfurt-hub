import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCalendar, FiUser, FiClock, FiTag, FiHeart, FiShare2,
  FiEye, FiMessageCircle, FiArrowLeft, FiEdit2, FiTrash2,
  FiBookmark, FiTwitter, FiFacebook, FiLinkedin
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { blogAPI } from '../services/api';
import { format } from 'date-fns';
import EnhancedSEO from '../components/EnhancedSEO';
import MarkdownDisplay from '../components/MarkdownDisplay';
import ShareButton from '../components/ShareButton';
import toast from 'react-hot-toast';

const BlogPostView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchRelatedPosts();
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await blogAPI.getPostBySlug(slug);
      setPost(response.data);
      setLiked(response.data.likes?.includes(user?.userId));
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load blog post');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const response = await blogAPI.getRelatedPosts(slug);
      setRelatedPosts(response.data);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      navigate('/login');
      return;
    }

    try {
      const response = await blogAPI.likePost(post._id);
      setLiked(response.data.liked);
      setPost(prev => ({
        ...prev,
        likes: prev.likes.length + (response.data.liked ? 1 : -1)
      }));
      toast.success(response.data.liked ? 'Post liked!' : 'Like removed');
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to update like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await blogAPI.addComment(post._id, { content: commentText });
      setPost(prev => ({
        ...prev,
        comments: [...prev.comments, response.data]
      }));
      setCommentText('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogAPI.deletePost(post._id);
        toast.success('Post deleted successfully');
        navigate('/blog');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <Link to="/blog" className="text-primary-600 hover:text-primary-700">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const seoData = {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords?.join(', ') || post.tags?.join(', '),
    image: post.featuredImage,
    type: 'article',
    author: post.author?.name,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt
  };

  return (
    <div className="min-h-screen bg-white">
      <EnhancedSEO {...seoData} />
      
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Blog
            </button>
            
            {user?.role === 'admin' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/admin/blog/edit/${post._id}`)}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
              {post.category}
            </span>
            <span className="flex items-center">
              <FiClock className="mr-1" />
              {post.readingTime} min read
            </span>
            <span className="flex items-center">
              <FiEye className="mr-1" />
              {post.views} views
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between pb-6 border-b">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                {post.author?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author?.name}</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  liked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiHeart className={`mr-2 ${liked ? 'fill-current' : ''}`} />
                {post.likes?.length || 0}
              </button>
              
              <ShareButton
                url={window.location.href}
                title={post.title}
                description={post.excerpt}
              />
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        {post.featuredImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full rounded-lg shadow-lg"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <MarkdownDisplay content={post.content} />
        </motion.div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
              >
                <FiTag className="inline mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Section */}
        {post.allowComments && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Comments ({post.comments?.length || 0})
            </h3>
            
            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleComment} className="mb-8">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="4"
                />
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="mt-3 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-2">Please login to leave a comment</p>
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Login to Comment
                </Link>
              </div>
            )}
            
            {/* Comments List */}
            <div className="space-y-6">
              {post.comments?.map((comment, index) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex space-x-3"
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold">
                    {comment.author?.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">
                          {comment.author?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relPost => (
                <Link
                  key={relPost._id}
                  to={`/blog/${relPost.slug}`}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {relPost.featuredImage && (
                      <div className="h-32 overflow-hidden">
                        <img
                          src={relPost.featuredImage}
                          alt={relPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {relPost.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {relPost.excerpt}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-3">
                        <FiClock className="mr-1" />
                        {relPost.readingTime} min read
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default BlogPostView;