import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBook, FiHome, FiBriefcase, FiMapPin, FiExternalLink, 
  FiFileText, FiGlobe, FiHeart, FiCreditCard, FiAlertCircle,
  FiChevronRight, FiSearch, FiGrid, FiList,
  FiPhone, FiMail, FiClock, FiUsers, FiShare2
} from 'react-icons/fi';
import { resourcesData, quickTips, importantLinks } from '../data/resourcesData';
import ShareButton from '../components/ShareButton';
import { getResourceShareData } from '../utils/shareUtils';
import { renderTextWithLinks } from '../utils/textUtils';
import EnhancedSEO from '../components/EnhancedSEO';
import { generatePageSEO } from '../utils/seoUtils';

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('visa');
  const seoData = generatePageSEO('resources');
  const [expandedResource, setExpandedResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'sidebar'

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

  // Function to render main content (reusable for both layouts)
  const renderMainContent = () => (
    <>
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
                      <div className="text-gray-600">
                        {renderTextWithLinks(resource.description)}
                      </div>
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
                                      ) : (
                                        renderTextWithLinks(item)
                                      )}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : typeof value === 'object' ? (
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                {Object.entries(value).map(([subKey, subValue]) => (
                                  <div key={subKey} className="mb-3 last:mb-0">
                                    <strong className="text-gray-900">{subKey}:</strong>
                                    <span className="text-gray-700 ml-2">{subValue}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-gray-700">{renderTextWithLinks(value)}</div>
                            )}
                          </div>
                        ))}

                        {/* Add link and share button if available */}
                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                          {resource.link && (
                            <a 
                              href={resource.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                            >
                              <span>Learn More</span>
                              <FiExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <ShareButton 
                            shareData={getResourceShareData(resource)}
                            buttonText="Share"
                            buttonClass="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            dropdownPosition="top-right"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedSEO {...seoData} />
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

      {/* Category Navigation - Redesigned */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* View Mode Toggle - Desktop Only */}
          <div className="hidden lg:flex justify-end mb-4">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiGrid className="w-4 h-4" />
                <span className="text-sm font-medium">Grid View</span>
              </button>
              <button
                onClick={() => setViewMode('sidebar')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all ${
                  viewMode === 'sidebar' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiList className="w-4 h-4" />
                <span className="text-sm font-medium">List View</span>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="md:hidden mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setExpandedResource(null);
                setSearchTerm('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              {Object.entries(resourcesData).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.title}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Grid View */}
          {viewMode === 'grid' && (
            <div className="hidden md:grid md:grid-cols-4 gap-3">
              {Object.entries(resourcesData).map(([key, data]) => {
                const Icon = categoryIcons[key];
                const isSelected = selectedCategory === key;
                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedCategory(key);
                      setExpandedResource(null);
                      setSearchTerm('');
                    }}
                    className={`relative overflow-hidden rounded-lg p-4 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg ring-2 ring-primary-500 ring-offset-2'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-primary-600'}`} />
                      <span className="text-sm font-medium">{data.title}</span>
                    </div>
                    {isSelected && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-primary-700/20"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Current Category Info - Mobile */}
          <div className="md:hidden mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-center space-x-2">
              {(() => {
                const Icon = categoryIcons[selectedCategory];
                return (
                  <>
                    <Icon className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-primary-900">
                      {resourcesData[selectedCategory].title}
                    </span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area - Conditional Layout */}
      {viewMode === 'sidebar' && !('ontouchstart' in window) ? (
        // Sidebar Layout for Desktop
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar Navigation */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <nav className="space-y-1">
                  {Object.entries(resourcesData).map(([key, data]) => {
                    const Icon = categoryIcons[key];
                    const isSelected = selectedCategory === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedCategory(key);
                          setExpandedResource(null);
                          setSearchTerm('');
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                          isSelected
                            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                        <span className="font-medium">{data.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {renderMainContent()}
            </div>
          </div>
        </div>
      ) : (
        // Original Grid Layout
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {renderMainContent()}
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
      </div>
      )}

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
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
              <a
                href="mailto:help@indiansfrankfurt.com"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                <FiMail className="mr-2" />
                Contact Support
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ResourcesPage;