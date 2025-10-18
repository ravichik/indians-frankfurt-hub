import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers, FiFileText, FiCalendar, FiAlertTriangle,
  FiTrendingUp, FiSettings, FiBarChart2, FiLock,
  FiUnlock, FiTrash2, FiEye, FiCheck, FiX,
  FiRefreshCw, FiMessageSquare, FiSearch, FiDownload, FiChevronUp, FiChevronDown
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    flaggedContent: 0,
    newUsersToday: 0,
    postsToday: 0,
    pendingReports: 0,
    totalVisits: 0,
    uniqueVisitors: 0,
    avgSessionDuration: '0m',
    bounceRate: 0
  });

  // Users State
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [sortField, setSortField] = useState('joinedDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Content Moderation State
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [moderationQueue, setModerationQueue] = useState([]);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    postActivity: [],
    topCategories: [],
    userEngagement: []
  });

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    } else {
      fetchDashboardData();
    }
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchFlaggedContent(),
        fetchAnalytics()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchFlaggedContent = async () => {
    try {
      const response = await adminAPI.getFlaggedContent();
      setFlaggedPosts(response.data.posts || []);
      setModerationQueue(response.data.queue || []);
    } catch (error) {
      console.error('Error fetching flagged content:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  // User Management Functions
  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleUserBan = async (userId, ban) => {
    try {
      await adminAPI.banUser(userId, ban);
      toast.success(ban ? 'User banned successfully' : 'User unbanned successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user ban status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminAPI.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  // Content Moderation Functions
  const handleApprovePost = async (postId) => {
    try {
      await adminAPI.approvePost(postId);
      toast.success('Post approved');
      fetchFlaggedContent();
    } catch (error) {
      toast.error('Failed to approve post');
    }
  };

  const handleRejectPost = async (postId) => {
    try {
      await adminAPI.rejectPost(postId);
      toast.success('Post rejected and removed');
      fetchFlaggedContent();
    } catch (error) {
      toast.error('Failed to reject post');
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort users
  const filteredAndSortedUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.fullName?.toLowerCase().includes(userSearchTerm.toLowerCase());

    const matchesFilter = userFilter === 'all' ||
                         (userFilter === 'admin' && user.role === 'admin') ||
                         (userFilter === 'moderator' && user.role === 'moderator') ||
                         (userFilter === 'banned' && user.isBanned);

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle different field types
    if (sortField === 'joinedDate' || sortField === 'lastActive') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    } else if (sortField === 'fullName' || sortField === 'username' || sortField === 'email' || sortField === 'role') {
      aValue = (aValue || '').toLowerCase();
      bValue = (bValue || '').toLowerCase();
    } else if (sortField === 'posts') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiBarChart2 },
    { id: 'users', name: 'User Management', icon: FiUsers },
    { id: 'content', name: 'Content Moderation', icon: FiFileText },
    { id: 'analytics', name: 'Analytics', icon: FiTrendingUp },
    { id: 'settings', name: 'Settings', icon: FiSettings }
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your community platform</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Website Stats */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6">
                <h3 className="text-xl font-semibold mb-4">Website Analytics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-3xl font-bold">{stats.totalVisits || '12.5K'}</p>
                    <p className="text-sm opacity-90">Total Visits</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.uniqueVisitors || '3.2K'}</p>
                    <p className="text-sm opacity-90">Unique Visitors</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.avgSessionDuration || '4m 32s'}</p>
                    <p className="text-sm opacity-90">Avg. Session</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.bounceRate || '32%'}</p>
                    <p className="text-sm opacity-90">Bounce Rate</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <FiUsers className="w-8 h-8 text-primary-600" />
                    <span className="text-sm text-green-600 font-medium">
                      +{stats.newUsersToday} today
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <FiMessageSquare className="w-8 h-8 text-blue-600" />
                    <span className="text-sm text-green-600 font-medium">
                      +{stats.postsToday} today
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
                  <p className="text-sm text-gray-600">Forum Posts</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <FiCalendar className="w-8 h-8 text-green-600" />
                    <span className="text-sm text-gray-600 font-medium">
                      {stats.activeUsers} active
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
                  <p className="text-sm text-gray-600">Events Created</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <FiAlertTriangle className="w-8 h-8 text-orange-600" />
                    <span className="text-sm text-orange-600 font-medium">
                      {stats.pendingReports} pending
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.flaggedContent}</p>
                  <p className="text-sm text-gray-600">Flagged Content</p>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user._id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {user.username?.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.fullName}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {user.joinedDate && formatDistanceToNow(new Date(user.joinedDate), { addSuffix: true })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Database Status</span>
                        <span className="text-sm font-medium text-green-600">Healthy</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">API Response Time</span>
                        <span className="text-sm font-medium text-yellow-600">125ms</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Server Load</span>
                        <span className="text-sm font-medium text-green-600">42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* User Management Header */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users by name, email, or username..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">All Users</option>
                      <option value="admin">Admins</option>
                      <option value="moderator">Moderators</option>
                      <option value="banned">Banned</option>
                    </select>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      <FiDownload className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('fullName')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>User</span>
                            {sortField === 'fullName' && (
                              sortDirection === 'asc' ?
                                <FiChevronUp className="w-4 h-4" /> :
                                <FiChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('role')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Role</span>
                            {sortField === 'role' && (
                              sortDirection === 'asc' ?
                                <FiChevronUp className="w-4 h-4" /> :
                                <FiChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('joinedDate')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Joined</span>
                            {sortField === 'joinedDate' && (
                              sortDirection === 'asc' ?
                                <FiChevronUp className="w-4 h-4" /> :
                                <FiChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('posts')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Activity</span>
                            {sortField === 'posts' && (
                              sortDirection === 'asc' ?
                                <FiChevronUp className="w-4 h-4" /> :
                                <FiChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAndSortedUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-medium">
                                  {user.username?.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => handleUserRoleChange(user._id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="user">User</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.isBanned ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Banned
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {user.joinedDate ? format(new Date(user.joinedDate), 'MMM d, yyyy') : 'N/A'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {user.joinedDate ? formatDistanceToNow(new Date(user.joinedDate), { addSuffix: true }) : ''}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.posts || 0} posts</div>
                            <div className="text-sm text-gray-500">Last active: {user.lastActive ? formatDistanceToNow(new Date(user.lastActive), { addSuffix: true }) : 'Never'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="text-gray-600 hover:text-gray-900"
                                title="View Details"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUserBan(user._id, !user.isBanned)}
                                className={`${user.isBanned ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'}`}
                                title={user.isBanned ? 'Unban User' : 'Ban User'}
                              >
                                {user.isBanned ? <FiUnlock className="w-4 h-4" /> : <FiLock className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete User"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* User Details Modal */}
          <AnimatePresence>
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedUser(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* User Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-2xl">
                          {selectedUser.username?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">{selectedUser.fullName}</h3>
                        <p className="text-gray-600">@{selectedUser.username}</p>
                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          selectedUser.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>

                    {/* User Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Joined Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedUser.joinedDate ? format(new Date(selectedUser.joinedDate), 'MMM d, yyyy') : 'N/A'}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Total Posts</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedUser.posts || 0}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Total Events</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedUser.events || 0}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="text-lg font-semibold">
                          {selectedUser.isActive ? 
                            <span className="text-green-600">Active</span> : 
                            <span className="text-red-600">Inactive</span>
                          }
                        </p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Bio</span>
                        <span className="text-gray-900">{selectedUser.bio || 'No bio provided'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Auth Provider</span>
                        <span className="text-gray-900">{selectedUser.authProvider || 'Local'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Last Active</span>
                        <span className="text-gray-900">
                          {selectedUser.lastActive ? 
                            formatDistanceToNow(new Date(selectedUser.lastActive), { addSuffix: true }) : 
                            'Never'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Account Created</span>
                        <span className="text-gray-900">
                          {selectedUser.joinedDate ?
                            format(new Date(selectedUser.joinedDate), 'PPpp') :
                            'N/A'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        onClick={() => handleUserBan(selectedUser._id, !selectedUser.isBanned)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          selectedUser.isBanned ? 
                          'bg-green-600 text-white hover:bg-green-700' : 
                          'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                      >
                        {selectedUser.isBanned ? 'Unban User' : 'Ban User'}
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteUser(selectedUser._id);
                          setSelectedUser(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                      >
                        Delete User
                      </button>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Flagged Posts */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Flagged Posts ({flaggedPosts.length})
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {flaggedPosts.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No flagged posts</p>
                    ) : (
                      flaggedPosts.map((post) => (
                        <div key={post._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{post.title}</h4>
                              <p className="text-sm text-gray-600">by {post.author?.username || 'Unknown'}</p>
                            </div>
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                              {post.flagCount || 0} flags
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApprovePost(post._id)}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                              <FiCheck className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectPost(post._id)}
                              className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                              <FiX className="w-4 h-4" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Moderation Queue */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Moderation Queue ({moderationQueue.length})
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {moderationQueue.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No items in moderation queue</p>
                    ) : (
                      moderationQueue.map((item) => (
                        <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{item.type}</span>
                            <span className="text-xs text-gray-500">
                              {item.createdAt && formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{item.reason}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Reported by: {item.reportedBy?.username || 'Anonymous'}
                            </span>
                            <button className="text-xs text-primary-600 hover:text-primary-700">
                              Review
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Content Statistics */}
              <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                    <p className="text-sm text-gray-600">Total Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{stats.flaggedContent}</p>
                    <p className="text-sm text-gray-600">Flagged Content</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">98%</p>
                    <p className="text-sm text-gray-600">Approval Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">2.3h</p>
                    <p className="text-sm text-gray-600">Avg Response Time</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Post Activity Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Activity</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.postActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="posts" fill="#3b82f6" />
                      <Bar dataKey="replies" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.topCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.topCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Engagement Metrics */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Daily Active Users</span>
                        <span className="text-sm font-semibold text-gray-900">245</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Weekly Active Users</span>
                        <span className="text-sm font-semibold text-gray-900">892</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Monthly Active Users</span>
                        <span className="text-sm font-semibold text-gray-900">1,456</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {/* Platform Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Frankfurt Indians"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        defaultValue="admin@indiansfrankfurt.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                        <option value="open">Open Registration</option>
                        <option value="approval">Requires Approval</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Moderation Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderation Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Auto-moderate Content</p>
                        <p className="text-sm text-gray-600">Automatically flag inappropriate content</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Require Email Verification</p>
                        <p className="text-sm text-gray-600">New users must verify email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Spam Protection</p>
                        <p className="text-sm text-gray-600">Enable anti-spam measures</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;