import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { forumAPI } from '../services/api';
import toast from 'react-hot-toast';
import MarkdownEditor from '../components/MarkdownEditor';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator';

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await forumAPI.getPost(id);
      const postData = response.data;
      
      // Check authorization
      const isAuthor = user?.id === postData.author?._id || 
                      user?.userId === postData.author?._id || 
                      user?._id === postData.author?._id;
      
      if (!isAdmin && !isModerator && !isAuthor) {
        toast.error('You are not authorized to edit this post');
        navigate(`/forum/post/${id}`);
        return;
      }

      setPost(postData);
      setFormData({
        title: postData.title,
        content: postData.content,
        category: postData.category,
        tags: postData.tags ? postData.tags.join(', ') : ''
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        title: formData.title.trim(),
        content: formData.content.trim()
      };

      // Add category and tags if admin/moderator
      if (isAdmin || isModerator) {
        updateData.category = formData.category;
        
        // Parse tags from comma-separated string
        if (formData.tags) {
          updateData.tags = formData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        } else {
          updateData.tags = [];
        }
      }

      await forumAPI.updatePost(id, updateData);
      toast.success('Post updated successfully!');
      navigate(`/forum/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.response?.data?.error || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
      navigate(`/forum/post/${id}`);
    }
  };

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
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/forum/post/${id}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors text-sm md:text-base"
          >
            <FiArrowLeft className="mr-2" />
            Back to Post
          </button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Edit Post
            </h1>
            {isAdmin && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                Admin Edit
              </span>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter post title"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/200 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              {(isAdmin || isModerator) ? (
                <>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="settling-in">Settling In</option>
                    <option value="cultural-events">Cultural Events</option>
                    <option value="jobs">Jobs & Career</option>
                    <option value="housing">Housing</option>
                    <option value="marketplace">Marketplace</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    As an admin/moderator, you can change the category
                  </p>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={formData.category}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Category cannot be changed after post creation
                  </p>
                </>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Write your post content...\n\nYou can use **bold**, *italic*, [links](url), and more!"
                height="300px"
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use markdown formatting for rich text
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              {(isAdmin || isModerator) ? (
                <>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter tags separated by commas (e.g., visa, jobs, housing)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    As an admin/moderator, you can change the tags (separate with commas)
                  </p>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={formData.tags}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    placeholder="No tags"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tags cannot be changed after post creation
                  </p>
                </>
              )}
            </div>

            {/* Last Edited Info */}
            {post.lastEdited && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <FiAlertCircle className="text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Previously edited</p>
                    <p className="text-xs mt-1">
                      Last edited on {new Date(post.lastEdited).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                <FiX className="inline mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !formData.title.trim() || !formData.content.trim()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="inline mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditPostPage;