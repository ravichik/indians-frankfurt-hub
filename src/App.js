import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { GOOGLE_CLIENT_ID } from './config/googleAuth';
import HomePage from './pages/HomePage';
import ForumPage from './pages/ForumPage';
import PostDetailPage from './pages/PostDetailPage';
import EditPostPage from './pages/EditPostPage';
import EventsPage from './pages/EventsPage';
import EventDetailView from './pages/EventDetailView';
import ResourcesPage from './pages/ResourcesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import BlogPage from './pages/BlogPage';
import BlogPostView from './pages/BlogPostView';
import BlogEditor from './pages/BlogEditor';

function App() {
  return (
    <HelmetProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/post/:id" element={<PostDetailPage />} />
            <Route path="/forum/edit/:id" element={
              <PrivateRoute>
                <EditPostPage />
              </PrivateRoute>
            } />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailView />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostView />} />
            <Route path="/admin/blog/new" element={
              <PrivateRoute>
                <BlogEditor />
              </PrivateRoute>
            } />
            <Route path="/admin/blog/edit/:id" element={
              <PrivateRoute>
                <BlogEditor />
              </PrivateRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>
        </main>
        <Footer />
      </div>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
}

export default App;