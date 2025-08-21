import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiShield, FiMessageSquare, FiThumbsUp, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    posts: 0,
    replies: 0,
    events: 0,
    likes: 0,
    connections: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id || user?.userId) {
      fetchUserStats();
    }
  }, [user]);

  // Refresh stats when page gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id || user?.userId) {
        fetchUserStats();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    // Also refresh every 30 seconds if page is active
    const interval = setInterval(() => {
      if (!document.hidden && (user?.id || user?.userId)) {
        fetchUserStats();
      }
    }, 30000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const userId = user.id || user.userId;
      const response = await userAPI.getUserStats(userId);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Set some default values if API fails
      setStats({
        posts: 0,
        replies: 0,
        events: 0,
        likes: 0,
        connections: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-32"></div>
          
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {user.username?.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
                <p className="text-gray-600">@{user.username}</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
                
                <div className="flex items-center space-x-3">
                  <FiUser className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{user.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FiShield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">
                      {user.joinedDate ? format(new Date(user.joinedDate), 'MMMM d, yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Bio</h2>
                <p className="text-gray-600">
                  {user.bio || 'No bio added yet. Edit your profile to add a bio.'}
                </p>
                
                <button className="btn-primary w-full sm:w-auto">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section with Refresh Button */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Statistics</h2>
            <button
              onClick={fetchUserStats}
              disabled={loading}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${
                loading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
              }`}
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Posts</h3>
              <FiMessageSquare className="text-primary-500" />
            </div>
            <p className="text-3xl font-bold text-primary-600">
              {loading ? '...' : stats.posts}
            </p>
            <p className="text-sm text-gray-600">Forum posts</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Replies</h3>
              <FiMessageSquare className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {loading ? '...' : stats.replies}
            </p>
            <p className="text-sm text-gray-600">Comments made</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Likes</h3>
              <FiThumbsUp className="text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">
              {loading ? '...' : stats.likes}
            </p>
            <p className="text-sm text-gray-600">Received</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Events</h3>
              <FiCalendar className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {loading ? '...' : stats.events}
            </p>
            <p className="text-sm text-gray-600">Attended</p>
          </div>
          </motion.div>
        </div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Total Forum Contributions</span>
              <span className="font-semibold text-gray-900">
                {loading ? '...' : stats.posts + stats.replies}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Community Engagement</span>
              <span className="font-semibold text-gray-900">
                {loading ? '...' : `${stats.likes} likes received`}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Member Status</span>
              <span className="font-semibold text-primary-600">
                {stats.posts >= 10 ? 'Active Contributor' : 
                 stats.posts >= 5 ? 'Regular Member' : 
                 stats.posts >= 1 ? 'New Member' : 'Getting Started'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;