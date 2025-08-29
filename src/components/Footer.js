import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display font-bold text-xl mb-4">Frankfurt Indians</h3>
            <p className="text-gray-400 text-sm">
              Your community hub for Indian newcomers in Frankfurt. Connect, share, and thrive together.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/forum" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Discussion Forum
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Resources
                </Link>
              </li>
              <li>
                <a href="https://cgifrankfurt.gov.in/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Indian Consulate
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/resources?category=visa" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Visa Guide
                </Link>
              </li>
              <li>
                <Link to="/resources?category=housing" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Housing Tips
                </Link>
              </li>
              <li>
                <Link to="/resources?category=jobs" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Job Board
                </Link>
              </li>
              <li>
                <Link to="/resources?category=local" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Local Businesses
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Frankfurt Indians. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <a href="mailto:frankfurtindians@gmail.com" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;