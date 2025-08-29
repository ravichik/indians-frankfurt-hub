import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiUsers, FiCalendar, FiBook, FiHome, FiBriefcase, FiMapPin, FiShare2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ShareButton from '../components/ShareButton';
import EnhancedSEO from '../components/EnhancedSEO';
import { generatePageSEO } from '../utils/seoUtils';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const seoData = generatePageSEO('home');
  const features = [
    {
      icon: FiUsers,
      title: 'Community Forum',
      description: 'Connect with fellow Indians, ask questions, and share experiences',
      link: '/forum',
      color: 'bg-gradient-to-br from-primary-500 to-primary-600'
    },
    {
      icon: FiCalendar,
      title: 'Events Calendar',
      description: 'Discover local Indian festivals, meetups, and cultural events',
      link: '/events',
      color: 'bg-gradient-to-br from-secondary-600 to-secondary-700'
    },
    {
      icon: FiBook,
      title: 'Resources Hub',
      description: 'Essential guides for visa, housing, jobs, and settling in Frankfurt',
      link: '/resources',
      color: 'bg-gradient-to-br from-accent-500 to-accent-600'
    }
  ];

  const quickResources = [
    {
      icon: FiHome,
      title: 'Housing Guide',
      description: 'Find apartments and understand rental contracts',
      category: 'housing'
    },
    {
      icon: FiBriefcase,
      title: 'Job Board',
      description: 'Explore job opportunities and career advice',
      category: 'jobs'
    },
    {
      icon: FiMapPin,
      title: 'Local Services',
      description: 'Indian groceries, restaurants, and businesses',
      category: 'local'
    }
  ];

  return (
    <div className="min-h-screen">
      <EnhancedSEO 
        {...seoData}
        url="https://www.frankfurtindians.com/"
      />
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-primary-600 via-primary-400 to-secondary-700 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary-300/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-6xl font-display font-bold text-white mb-6 drop-shadow-lg"
          >
            Welcome to Frankfurt Indian Community
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow"
          >
            Your community platform for connecting, sharing, and thriving together
          </motion.p>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-flex items-center justify-center bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transform hover:scale-105 transition-all duration-200 shadow-xl btn-hover-lift"
              >
                Join Our Community
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
            <Link
              to="/resources"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transform hover:scale-105 transition-all duration-200 shadow-lg border-2 border-white/30"
            >
              Explore Resources
            </Link>
            <ShareButton 
              shareData={{
                url: window.location.origin,
                title: 'Frankfurt Indians',
                text: 'Join the largest Indian community platform in Frankfurt - Connect, share experiences, and find resources!'
              }}
              buttonText="Share"
              buttonClass="inline-flex items-center justify-center bg-secondary-800/90 text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary-900 transform hover:scale-105 transition-all duration-200 shadow-lg"
              dropdownPosition="bottom-left"
            />
          </motion.div>
        </div>
      </motion.section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">What We Offer</h2>
            <p className="text-gray-600 text-lg">Everything you need to thrive in Frankfurt</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl border border-neutral-100 p-6 group cursor-pointer card-hover-lift"
              >
                <Link to={feature.link} className="block">
                  <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <span className="inline-flex items-center text-primary-600 font-semibold group-hover:gap-2 transition-all duration-200">
                    Learn More
                    <FiArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Quick Resources</h2>
            <p className="text-gray-600 text-lg">Essential information for settling in Frankfurt</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickResources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/resources?category=${resource.category}`}>
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-primary-500 to-secondary-500 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <resource.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-gray-900">{resource.title}</h3>
                      <p className="text-gray-600 text-sm">{resource.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Join Our Growing Community
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Connect with fellow Indians in Frankfurt. Share experiences, find opportunities, and build lasting friendships.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Get Started Today
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;