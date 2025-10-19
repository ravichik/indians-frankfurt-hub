import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar, FiMapPin, FiUsers, FiClock, FiPlus,
  FiFilter, FiGrid, FiList, FiChevronDown, FiTrendingUp
} from 'react-icons/fi';
import { format } from 'date-fns';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import AddressAutocomplete from '../components/AddressAutocomplete';
import EnhancedSEO from '../components/EnhancedSEO';
import { generatePageSEO } from '../utils/seoUtils';

const EventsPage = () => {
  const navigate = useNavigate();
  const seoData = generatePageSEO('events');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [eventType, setEventType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState('date-asc'); // date-asc, date-desc, name-asc, name-desc
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(true);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const sortDropdownRef = useRef(null);
  const sortDropdownDesktopRef = useRef(null);

  const eventTypes = [
    { id: 'all', name: 'All Events', icon: '🎉' },
    { id: 'festival', name: 'Festivals', icon: '🪔' },
    { id: 'meetup', name: 'Meetups', icon: '👥' },
    { id: 'workshop', name: 'Workshops', icon: '📚' },
    { id: 'cultural', name: 'Cultural', icon: '🎭' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'movies', name: 'Movies', icon: '🎬' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [eventType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if clicked outside both mobile and desktop dropdowns
      const clickedOutsideMobile = !sortDropdownRef.current || !sortDropdownRef.current.contains(event.target);
      const clickedOutsideDesktop = !sortDropdownDesktopRef.current || !sortDropdownDesktopRef.current.contains(event.target);
      
      if (clickedOutsideMobile && clickedOutsideDesktop) {
        setShowSortDropdown(false);
      }
    };

    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSortDropdown]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (eventType !== 'all') {
        params.eventType = eventType;
      }
      
      console.log('Fetching events with params:', params);
      const response = await eventsAPI.getEvents(params);
      console.log('Events response:', response);
      
      const eventsData = response?.data || [];
      console.log('Events data:', eventsData);
      console.log('Movies events:', eventsData.filter(e => e.eventType === 'movies'));
      
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRSVP = async (eventId) => {
    if (!isAuthenticated) {
      toast.error('Please login to RSVP');
      navigate('/login');
      return;
    }
    try {
      await eventsAPI.rsvpEvent(eventId, 'attending');
      toast.success('RSVP confirmed!');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to RSVP');
    }
  };

  // Filter and sort events
  const processedEvents = events
    .filter(event => {
      if (showOnlyUpcoming) {
        return new Date(event.startDate) >= new Date();
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.startDate) - new Date(b.startDate);
        case 'date-desc':
          return new Date(b.startDate) - new Date(a.startDate);
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return new Date(a.startDate) - new Date(b.startDate);
      }
    });

  const sortOptions = [
    { value: 'date-asc', label: 'Date (Earliest First)' },
    { value: 'date-desc', label: 'Date (Latest First)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' }
  ];

  const EventCard = ({ event }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-4 sm:p-6"
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <span className="text-xl sm:text-2xl">
          {eventTypes.find(t => t.id === event.eventType)?.icon || '📌'}
        </span>
        <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
          {eventTypes.find(t => t.id === event.eventType)?.name || event.eventType}
        </span>
      </div>
      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
        {event.title}
      </h3>
      
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">
        {event.description}
      </p>
      
      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <FiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate">{format(new Date(event.startDate), 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiMapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate">{event.location?.venue || 'TBA'}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiUsers className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>{event.attendees?.length || 0} attending</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => handleRSVP(event._id)}
          className="flex-1 bg-primary-600 text-white py-2 text-sm sm:text-base rounded-lg hover:bg-primary-700 transition"
        >
          RSVP
        </button>
        <button
          onClick={() => navigate(`/events/${event._id}`)}
          className="flex-1 border border-primary-600 text-primary-600 py-2 text-sm sm:text-base rounded-lg hover:bg-primary-50 transition"
        >
          Details
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <EnhancedSEO {...seoData} />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Community Events</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Discover and join local events</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                console.log('Refreshing events...');
                fetchEvents();
              }}
              className="bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
            >
              Refresh
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition text-sm sm:text-base"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Create Event</span>
                <span className="sm:hidden">Create</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          {/* Mobile: Horizontal scrollable categories */}
          <div className="lg:hidden">
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
                {eventTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setEventType(type.id)}
                    className={`px-3 py-2 rounded-lg transition whitespace-nowrap text-sm ${
                      eventType === type.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{type.icon}</span>
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Controls for mobile */}
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setShowOnlyUpcoming(!showOnlyUpcoming)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition ${
                    showOnlyUpcoming 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FiTrendingUp className="inline mr-1" />
                  {showOnlyUpcoming ? 'Upcoming' : 'All Events'}
                </button>
                
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm flex items-center gap-1"
                  >
                    Sort
                    <FiChevronDown className="w-3 h-3" />
                  </button>
                  
                  {showSortDropdown && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      {sortOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            sortBy === option.value ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'
                  }`}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop: Regular layout */}
          <div className="hidden lg:flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {eventTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setEventType(type.id)}
                    className={`px-4 py-2 rounded-lg transition ${
                      eventType === type.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{type.icon}</span>
                    {type.name}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'
                  }`}
                >
                  <FiList />
                </button>
              </div>
            </div>
            
            {/* Sorting and filtering controls for desktop */}
            <div className="flex items-center justify-between border-t pt-3">
              <button
                onClick={() => setShowOnlyUpcoming(!showOnlyUpcoming)}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  showOnlyUpcoming 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiTrendingUp />
                {showOnlyUpcoming ? 'Upcoming Events Only' : 'All Events'}
              </button>
              
              <div className="relative" ref={sortDropdownDesktopRef}>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                >
                  Sort by: {sortOptions.find(o => o.value === sortBy)?.label}
                  <FiChevronDown />
                </button>
                
                {showSortDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${
                          sortBy === option.value 
                            ? 'bg-primary-50 text-primary-600 font-medium' 
                            : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : processedEvents.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              {showOnlyUpcoming ? 'No upcoming events' : 'No events found'}
            </p>
            {showOnlyUpcoming && events.length > 0 && (
              <button
                onClick={() => setShowOnlyUpcoming(false)}
                className="mt-2 text-primary-600 hover:text-primary-700"
              >
                Show all events
              </button>
            )}
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
              >
                Create First Event
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="text-sm text-gray-600 mb-4">
              Showing {processedEvents.length} {showOnlyUpcoming ? 'upcoming' : ''} event{processedEvents.length !== 1 ? 's' : ''}
            </div>
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                : 'space-y-4'
            }>
              {processedEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        )}

        {showCreateModal && (
          <CreateEventModal onClose={() => {
            setShowCreateModal(false);
            console.log('Modal closed, refreshing events...');
            fetchEvents();
          }} />
        )}
      </div>
    </div>
  );
};

const CreateEventModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'meetup',
    startDate: '',
    venue: '',
    address: '',
    googleMapsLink: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to create events');
      return;
    }
    
    setLoading(true);
    try {
      // Create a date with default time of 10:00 AM
      const eventDate = new Date(formData.startDate);
      eventDate.setHours(10, 0, 0, 0);
      
      // Set endDate to be 3 hours after startDate by default
      const endDate = new Date(eventDate);
      endDate.setHours(eventDate.getHours() + 3);
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        startDate: eventDate.toISOString(),
        endDate: endDate.toISOString(),
        location: {
          venue: formData.venue,
          address: formData.address,
          city: 'Frankfurt' // Add default city
        },
        isPublic: true // Add this field as it's expected by backend
      };
      
      console.log('Creating event with data:', eventData);
      console.log('Auth token present:', !!token);
      
      const response = await eventsAPI.createEvent(eventData);
      console.log('Event created successfully:', response);
      
      toast.success('Event created successfully!');
      onClose();
    } catch (error) {
      console.error('Event creation full error:', error);
      console.error('Error response:', error.response);
      
      // Better error messages
      if (error.response?.status === 401) {
        toast.error('Please login to create events');
      } else if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessage = validationErrors.map(e => `${e.param}: ${e.msg}`).join(', ');
        toast.error(`Validation failed: ${errorMessage}`);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to create event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
      >
        <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="meetup">Meetup</option>
              <option value="festival">Festival</option>
              <option value="workshop">Workshop</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="movies">Movies</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <AddressAutocomplete
              value={formData.address}
              onChange={(e) => {
                const address = e.target.value;
                setFormData({ 
                  ...formData, 
                  address,
                  googleMapsLink: address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : ''
                });
              }}
              required
              placeholder="Start typing an address (e.g., Hauptstraße)"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            {formData.googleMapsLink && (
              <a 
                href={formData.googleMapsLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 mt-1 inline-block"
              >
                View on Google Maps →
              </a>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EventsPage;