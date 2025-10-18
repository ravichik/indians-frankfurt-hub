import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Log the API URL being used (helpful for debugging)
console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  googleLogin: (credential) => api.post('/auth/google', { credential }),
};

export const forumAPI = {
  getPosts: (params) => api.get('/forum/posts', { params }),
  getPost: (id) => api.get(`/forum/posts/${id}`),
  createPost: (data) => api.post('/forum/posts', data),
  updatePost: (id, data) => api.patch(`/forum/posts/${id}`, data),
  deletePost: (id) => api.delete(`/forum/posts/${id}`),
  replyToPost: (id, content) => api.post(`/forum/posts/${id}/reply`, { content }),
  deleteReply: (postId, replyId) => api.delete(`/forum/posts/${postId}/reply/${replyId}`),
  likePost: (id) => api.post(`/forum/posts/${id}/like`),
  lockPost: (id, isLocked) => api.patch(`/forum/posts/${id}/lock`, { isLocked }),
  pinPost: (id, isPinned) => api.patch(`/forum/posts/${id}/pin`, { isPinned }),
  thankPost: (id) => api.post(`/forum/posts/${id}/thank`),
  markSolution: (id) => api.patch(`/forum/posts/${id}/solution`),
};

export const eventsAPI = {
  getEvents: (params) => api.get('/events', { params }),
  getUpcomingEvents: () => api.get('/events/upcoming'),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.patch(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  rsvpEvent: (id, status) => api.post(`/events/${id}/rsvp`, { status }),
};

export const resourcesAPI = {
  getResources: (category) => api.get('/resources', { params: { category } }),
  getCategories: () => api.get('/resources/categories'),
};

export const userAPI = {
  getUserStats: (userId) => api.get(`/users/${userId}/stats`),
  getUserPosts: (userId) => api.get(`/users/${userId}/posts`),
  getUserEvents: (userId) => api.get(`/users/${userId}/events`),
  updateProfile: (userId, data) => api.patch(`/users/${userId}/profile`, data),
};

export const adminAPI = {
  // Dashboard Stats
  getStats: () => api.get('/admin/stats'),
  getAnalytics: () => api.get('/admin/analytics'),
  
  // User Management
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
  banUser: (userId, ban) => api.patch(`/admin/users/${userId}/ban`, { ban }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  
  // Content Moderation
  getFlaggedContent: () => api.get('/admin/flagged-content'),
  approvePost: (postId) => api.patch(`/admin/posts/${postId}/approve`),
  rejectPost: (postId) => api.delete(`/admin/posts/${postId}`),
  getModerationQueue: () => api.get('/admin/moderation-queue'),
  
  // System Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settings) => api.patch('/admin/settings', settings),
  
  // Reports
  getReports: (type) => api.get(`/admin/reports/${type}`),
  exportData: (type) => api.get(`/admin/export/${type}`, { responseType: 'blob' })
};

export const blogAPI = {
  // Public endpoints
  getPosts: (params) => api.get('/blog/posts', { params }),
  getPostBySlug: (slug) => api.get(`/blog/posts/${slug}`),
  getRelatedPosts: (slug) => api.get(`/blog/posts/${slug}/related`),
  
  // Admin endpoints
  getPost: (id) => api.get(`/blog/admin/posts/${id}`),
  createPost: (data) => api.post('/blog/posts', data),
  updatePost: (id, data) => api.put(`/blog/posts/${id}`, data),
  deletePost: (id) => api.delete(`/blog/posts/${id}`),
  
  // User interactions
  likePost: (id) => api.post(`/blog/posts/${id}/like`),
  addComment: (id, data) => api.post(`/blog/posts/${id}/comments`, data),
  
  // Admin stats
  getBlogStats: () => api.get('/blog/admin/stats'),
  getAdminPosts: () => api.get('/blog/admin/posts')
};

export const subscriptionAPI = {
  subscribe: (data) => api.post('/subscription/subscribe', data),
  unsubscribe: (data) => api.post('/subscription/unsubscribe', data),
  getStatus: (email) => api.get(`/subscription/status/${email}`),
  updatePreferences: (data) => api.put('/subscription/preferences', data)
};

export default api;