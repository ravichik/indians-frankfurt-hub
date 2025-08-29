import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiX, FiCheck } from 'react-icons/fi';
import { shareOptions, shareContent, nativeShare } from '../utils/shareUtils';
import toast from 'react-hot-toast';

const ShareButton = ({ 
  shareData, 
  buttonText = 'Share', 
  buttonClass = '',
  showLabel = true,
  dropdownPosition = 'bottom-right'
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async (platform) => {
    if (platform === 'native') {
      const shared = await nativeShare(shareData);
      if (shared) {
        setShowDropdown(false);
        return;
      }
    }
    
    if (platform === 'copy') {
      const result = await shareOptions.copy.action(shareData.url, toast);
      if (result) {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          setShowDropdown(false);
        }, 2000);
      }
    } else {
      shareContent(platform, shareData);
      setShowDropdown(false);
    }
  };

  // Position classes for dropdown
  const positionClasses = {
    'bottom-right': 'right-0 mt-2',
    'bottom-left': 'left-0 mt-2',
    'top-right': 'right-0 bottom-full mb-2',
    'top-left': 'left-0 bottom-full mb-2'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={buttonClass || "flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"}
      >
        <FiShare2 className="w-4 h-4" />
        {showLabel && <span>{buttonText}</span>}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className={`absolute ${positionClasses[dropdownPosition]} z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[200px]`}
            >
              <div className="flex items-center justify-between px-3 py-2 mb-1">
                <span className="text-sm font-semibold text-gray-700">Share via</span>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <FiX className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-1">
                {/* Native share (mobile) */}
                {navigator.share && (
                  <button
                    onClick={() => handleShare('native')}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-lg">📱</span>
                    <span className="text-sm text-gray-700">More options...</span>
                  </button>
                )}
                
                {/* WhatsApp */}
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors group"
                >
                  <span className="text-lg">{shareOptions.whatsapp.icon}</span>
                  <span className="text-sm text-gray-700 group-hover:text-green-700">WhatsApp</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors group"
                >
                  <span className="text-lg">{shareOptions.facebook.icon}</span>
                  <span className="text-sm text-gray-700 group-hover:text-blue-700">Facebook</span>
                </button>

                {/* Twitter */}
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-sky-50 rounded-lg transition-colors group"
                >
                  <span className="text-lg">{shareOptions.twitter.icon}</span>
                  <span className="text-sm text-gray-700 group-hover:text-sky-700">Twitter</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors group"
                >
                  <span className="text-lg">{shareOptions.linkedin.icon}</span>
                  <span className="text-sm text-gray-700 group-hover:text-blue-700">LinkedIn</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => handleShare('telegram')}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-cyan-50 rounded-lg transition-colors group"
                >
                  <span className="text-lg">{shareOptions.telegram.icon}</span>
                  <span className="text-sm text-gray-700 group-hover:text-cyan-700">Telegram</span>
                </button>

                {/* Email */}
                <button
                  onClick={() => handleShare('email')}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <span className="text-lg">{shareOptions.email.icon}</span>
                  <span className="text-sm text-gray-700 group-hover:text-red-700">Email</span>
                </button>

                <div className="border-t pt-1 mt-1">
                  {/* Copy Link */}
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <span className="text-lg">
                      {copied ? <FiCheck className="w-5 h-5 text-green-600" /> : shareOptions.copy.icon}
                    </span>
                    <span className={`text-sm ${copied ? 'text-green-600 font-medium' : 'text-gray-700'}`}>
                      {copied ? 'Copied!' : 'Copy Link'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;