import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiPlus, FiFilter, FiEdit2, FiTrash2, FiShield, FiGrid, FiList, FiChevronDown, FiShare2 } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ShareButton from '../components/ShareButton';
import { getEventShareData } from '../utils/shareUtils';
import { renderTextWithLinks } from '../utils/textUtils';

const EventsPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('grid');
  const [eventType, setEventType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [filterUpcoming, setFilterUpcoming] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const eventTypes = [
    { id: 'all', name: 'All Events', icon: '🎉' },
    { id: 'festival', name: 'Festivals', icon: '🪔' },
    { id: 'meetup', name: 'Meetups', icon: '👥' },
    { id: 'workshop', name: 'Workshops', icon: '📚' },
    { id: 'cultural', name: 'Cultural', icon: '🎭' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'other', name: 'Other', icon: '📌' }
  ];

  const { data, isLoading, error, refetch } = useQuery(
    ['events', eventType],
    () => eventsAPI.getEvents({ eventType: eventType === 'all' ? undefined : eventType }),
    {
      refetchOnWindowFocus: false
    }
  );

  const events = data?.data || [];

  // Filter and sort events
  const processedEvents = useMemo(() => {
    let filtered = events;

    // Filter upcoming events
    if (filterUpcoming) {
      filtered = filtered.filter(event => new Date(event.startDate) >= new Date());
    }

    // Sort events
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.startDate) - new Date(b.startDate);
        case 'popularity':
          return (b.attendees?.length || 0) - (a.attendees?.length || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [events, sortBy, filterUpcoming]);

  const handleRSVP = async (eventId, status) => {
    if (!isAuthenticated) {
      toast.error('Please login to RSVP');
      return;
    }

    try {
      await eventsAPI.rsvpEvent(eventId, status);
      toast.success(`RSVP updated: ${status}`);
      refetch();
    } catch (error) {
      toast.error('Failed to update RSVP');
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await eventsAPI.deleteEvent(eventId);
        toast.success('Event deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowCreateModal(true);
  };

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator';
  const canModerate = isAdmin || isModerator;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Events Calendar
          </h1>
          <p className="text-gray-600 text-lg">
            Discover and join exciting community events, festivals, and meetups.
          </p>
        </motion.div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFilterUpcoming(!filterUpcoming)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterUpcoming 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterUpcoming ? 'Upcoming Events' : 'All Events'}
              </button>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="popularity">Sort by Popularity</option>
                  <option value="title">Sort by Title</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Grid View"
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="List View"
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:w-80"
          >
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center">
                <FiCalendar className="mr-2" />
                Calendar View
              </h2>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="rounded-lg border-0"
                onClickDay={(date) => {
                  setSelectedDate(date);
                  // Find events on this date
                  const dateEvents = processedEvents.filter(event => 
                    format(new Date(event.startDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                  );
                  if (dateEvents.length > 0) {
                    // Scroll to the first event of that date
                    const eventElement = document.getElementById(`event-${dateEvents[0]._id}`);
                    if (eventElement) {
                      eventElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      // Add a highlight effect
                      eventElement.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2');
                      setTimeout(() => {
                        eventElement.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2');
                      }, 2000);
                    }
                  } else {
                    toast.info(`No events on ${format(date, 'MMMM d, yyyy')}`);
                  }
                }}
                tileClassName={({ date }) => {
                  const hasEvent = processedEvents.some(event => 
                    format(new Date(event.startDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                  );
                  return hasEvent ? 'bg-primary-100 text-primary-700 font-semibold cursor-pointer hover:bg-primary-200' : '';
                }}
                tileDisabled={({ date }) => {
                  const hasEvent = processedEvents.some(event => 
                    format(new Date(event.startDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                  );
                  return !hasEvent;
                }}
              />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center">
                <FiFilter className="mr-2" />
                Event Type
              </h2>
              <div className="space-y-2">
                {eventTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setEventType(type.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                      eventType === type.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{type.icon}</span>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>

              {isAuthenticated && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary w-full mt-6 flex items-center justify-center"
                >
                  <FiPlus className="mr-2" />
                  Create Event
                </button>
              )}
            </div>
          </motion.aside>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Upcoming Events
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg ${
                    viewMode === 'list' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg ${
                    viewMode === 'grid' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading events. Please try again.</p>
              </div>
            ) : processedEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-xl shadow-md"
              >
                <FiCalendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No events scheduled.</p>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary mt-4"
                  >
                    Create First Event
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}
              >
                {processedEvents.map((event, index) => (
                  <motion.article
                    key={event._id}
                    id={`event-${event._id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {event.imageUrl && (
                      <div className="h-48 bg-gradient-to-br from-primary-400 to-secondary-400"></div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">
                                {eventTypes.find(t => t.id === event.eventType)?.icon || '📌'}
                              </span>
                              <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
                                {eventTypes.find(t => t.id === event.eventType)?.name || event.eventType}
                              </span>
                            </div>
                            {(canModerate || user?.id === event.organizer?._id || user?.userId === event.organizer?._id) && (
                              <div className="flex items-center space-x-2">
                                {canModerate && (
                                  <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                    <FiShield className="mr-1" />
                                    {isAdmin ? 'Admin' : 'Moderator'}
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(event);
                                  }}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit Event"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                                {canModerate && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(event._id);
                                    }}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Event"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <div className="text-gray-600 mb-4 line-clamp-2">
                            {renderTextWithLinks(event.description)}
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <FiClock className="w-4 h-4 text-gray-400" />
                              <span>
                                {format(new Date(event.startDate), 'MMM d, yyyy h:mm a')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FiMapPin className="w-4 h-4 text-gray-400" />
                              <span>{event.location.venue}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FiUsers className="w-4 h-4 text-gray-400" />
                              <span>
                                {event.attendees?.length || 0} attending
                                {event.maxAttendees && ` / ${event.maxAttendees} max`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <img
                            src={`https://ui-avatars.com/api/?name=${event.organizer?.username}&background=random`}
                            alt={event.organizer?.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm text-gray-600">
                            by {event.organizer?.username}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRSVP(event._id, 'going')}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                          >
                            RSVP
                          </button>
                          <button 
                            onClick={() => navigate(`/events/${event._id}`)}
                            className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm"
                          >
                            Details
                          </button>
                          <ShareButton 
                            shareData={getEventShareData(event)}
                            buttonText=""
                            showLabel={false}
                            buttonClass="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center"
                            dropdownPosition="bottom-right"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {showCreateModal && (
          <CreateEventModal
            eventTypes={eventTypes.filter(t => t.id !== 'all')}
            event={editingEvent}
            onClose={() => {
              setShowCreateModal(false);
              setEditingEvent(null);
              refetch();
            }}
          />
        )}
      </div>
    </div>
  );
};

const CreateEventModal = ({ eventTypes, event, onClose }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    eventType: event?.eventType || 'meetup',
    startDate: event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
    endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
    venue: event?.location?.venue || '',
    address: event?.location?.address || '',
    maxAttendees: event?.maxAttendees || ''
  });
  const [loading, setLoading] = useState(false);
  const isEditing = !!event;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const eventData = {
        ...formData,
        location: {
          venue: formData.venue,
          address: formData.address
        }
      };

      if (isEditing) {
        await eventsAPI.updateEvent(event._id, eventData);
        toast.success('Event updated successfully!');
      } else {
        await eventsAPI.createEvent(eventData);
        toast.success('Event created successfully!');
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} event`);
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
        <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
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
              className="input-field"
              placeholder="Enter event title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              className="input-field"
            >
              {eventTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </option>
              ))}
            </select>
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
              className="input-field"
              placeholder="Describe your event... (URLs will be automatically converted to clickable links)"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                className="input-field"
              />
            </div>
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
              className="input-field"
              placeholder="Event venue name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="input-field"
              placeholder="Full address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Attendees (Optional)
            </label>
            <input
              type="number"
              value={formData.maxAttendees}
              onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
              className="input-field"
              placeholder="Leave empty for unlimited"
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EventsPage;