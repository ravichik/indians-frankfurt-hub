import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  FiBook, FiHome, FiBriefcase, FiMapPin, FiExternalLink, 
  FiFileText, FiGlobe, FiHeart, FiCreditCard, FiAlertCircle,
  FiChevronRight, FiChevronDown, FiSearch, FiDownload,
  FiPhone, FiMail, FiClock, FiUsers
} from 'react-icons/fi';
import { resourcesData, quickTips, importantLinks } from '../data/resourcesData';

const ResourcesPageNew = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('visa');
  const [expandedResource, setExpandedResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle category from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam && resourcesData[categoryParam]) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  const categoryIcons = {
    visa: FiFileText,
    housing: FiHome,
    jobs: FiBriefcase,
    education: FiBook,
    healthcare: FiHeart,
    banking: FiCreditCard,
    local: FiMapPin,
    emergency: FiAlertCircle
  };

  const categoryColors = {
    visa: 'from-blue-500 to-blue-600',
    housing: 'from-green-500 to-green-600',
    jobs: 'from-purple-500 to-purple-600',
    education: 'from-yellow-500 to-yellow-600',
    healthcare: 'from-red-500 to-red-600',
    banking: 'from-indigo-500 to-indigo-600',
    local: 'from-orange-500 to-orange-600',
    emergency: 'from-pink-500 to-pink-600'
  };

  const currentCategory = resourcesData[selectedCategory];
  const CategoryIcon = categoryIcons[selectedCategory];

  // Filter resources based on search
  const filteredResources = currentCategory?.resources?.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleResource = (resourceId) => {
    setExpandedResource(expandedResource === resourceId ? null : resourceId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Resources Hub
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Everything you need to know about living, working, and thriving in Frankfurt as an Indian expatriate.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Category Navigation */}
      <section className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
            {Object.entries(resourcesData).map(([key, data]) => {
              const Icon = categoryIcons[key];
              return (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(key);
                    setExpandedResource(null);
                    setSearchTerm('');
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedCategory === key
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{data.title}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Category Header */}
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <div className={`bg-gradient-to-r ${categoryColors[selectedCategory]} text-white rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center space-x-3 mb-3">
                  <CategoryIcon className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">{currentCategory.title}</h2>
                </div>
                <p className="text-white/90">{currentCategory.description}</p>
              </div>
            </motion.div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search in ${currentCategory.title}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Resources List */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {filteredResources.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <FiSearch className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">No resources found matching "{searchTerm}"</p>
                  </div>
                ) : (
                  filteredResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleResource(resource.id)}
                        className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {resource.title}
                            </h3>
                            <p className="text-gray-600">
                              {resource.description}
                            </p>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedResource === resource.id ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiChevronRight className="w-5 h-5 text-gray-400" />
                          </motion.div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedResource === resource.id && resource.content && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-100"
                          >
                            <div className="p-6 bg-gray-50">
                              {/* Render different content types */}
                              {Object.entries(resource.content).map(([key, value]) => (
                                <div key={key} className="mb-6 last:mb-0">
                                  <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </h4>
                                  
                                  {/* Handle different data types */}
                                  {Array.isArray(value) ? (
                                    <ul className="space-y-2">
                                      {value.map((item, idx) => (
                                        <li key={idx} className="flex items-start">
                                          <span className="text-primary-600 mr-2">•</span>
                                          <span className="text-gray-700">
                                            {typeof item === 'object' ? (
                                              <div>
                                                <strong>{item.name || item.title || item.type}</strong>
                                                {item.address && <div className="text-sm text-gray-600">{item.address}</div>}
                                                {item.speciality && <div className="text-sm text-gray-600">{item.speciality}</div>}
                                                {item.cost && <div className="text-sm text-gray-600">{item.cost}</div>}
                                                {item.pros && <div className="text-sm text-gray-600">{item.pros}</div>}
                                                {item.url && (
                                                  <a href={item.url} target="_blank" rel="noopener noreferrer" 
                                                     className="text-primary-600 hover:underline text-sm">
                                                    Visit website <FiExternalLink className="inline ml-1" />
                                                  </a>
                                                )}
                                              </div>
                                            ) : item}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : typeof value === 'object' ? (
                                    <div className="space-y-2">
                                      {Object.entries(value).map(([subKey, subValue]) => (
                                        <div key={subKey} className="flex items-start">
                                          <span className="font-medium text-gray-700 min-w-[140px]">{subKey}:</span>
                                          <span className="text-gray-600">{subValue}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-gray-700">{value}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 sticky top-24"
            >
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <FiClock className="mr-2 text-primary-600" />
                Quick Tips
              </h3>
              
              {quickTips.map((tipGroup, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">
                    {tipGroup.title}
                  </h4>
                  <ul className="space-y-1">
                    {tipGroup.items.slice(0, 3).map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Important Links */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-sm text-gray-900 mb-3">
                  Important Links
                </h4>
                <div className="space-y-2">
                  {importantLinks.slice(0, 3).map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      <FiExternalLink className="mr-1" />
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-sm text-red-900 mb-2">
                  Emergency Contacts
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-red-800">
                    <FiPhone className="mr-2" />
                    <span>Emergency: 112</span>
                  </div>
                  <div className="flex items-center text-red-800">
                    <FiPhone className="mr-2" />
                    <span>Police: 110</span>
                  </div>
                  <div className="flex items-center text-red-800">
                    <FiPhone className="mr-2" />
                    <span>Consulate: +49 69 153 00 50</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Can't find what you need?</h2>
            <p className="mb-6 text-white/90 max-w-2xl mx-auto">
              Our community is here to help. Join our forum to ask questions, share experiences, 
              and connect with 67,000+ Indians living in Frankfurt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/forum"
                className="inline-flex items-center justify-center bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <FiUsers className="mr-2" />
                Join Community Forum
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ResourcesPageNew;