import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCalendar, FiMapPin, FiUsers, FiClock, FiArrowLeft,
  FiEdit2, FiTrash2, FiShield, FiUser, FiCheck, FiX
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import EnhancedSEO from '../components/EnhancedSEO';
import { generateEventSEO } from '../utils/seoUtils';

const EventDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const response = await eventsAPI.getEvent(id);
      setEvent(response.data);
      setEditData({
        title: response.data.title,
        description: response.data.description,
        eventType: response.data.eventType,
        startDate: new Date(response.data.startDate).toISOString().slice(0, 16),
        endDate: new Date(response.data.endDate).toISOString().slice(0, 16),
        venue: response.data.location.venue,
        address: response.data.location.address,
        maxAttendees: response.data.maxAttendees || ''
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (status) => {
    if (!isAuthenticated) {
      toast.error('Please login to RSVP');
      return;
    }

    try {
      await eventsAPI.rsvpEvent(event._id, status);
      toast.success(`RSVP updated: ${status}`);
      fetchEvent();
    } catch (error) {
      toast.error('Failed to update RSVP');
    }
  };

  const handleSaveEdit = async () => {
    setSubmitting(true);
    try {
      await eventsAPI.updateEvent(event._id, {
        ...editData,
        location: {
          venue: editData.venue,
          address: editData.address
        }
      });
      toast.success('Event updated successfully');
      setIsEditing(false);
      fetchEvent();
    } catch (error) {
      toast.error('Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await eventsAPI.deleteEvent(event._id);
        toast.success('Event deleted successfully');
        navigate('/events');
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator';
  const canModerate = isAdmin || isModerator;
  const isOrganizer = user?.id === event?.organizer?._id || user?.userId === event?.organizer?._id;
  const canEdit = canModerate || isOrganizer;

  const eventTypes = {
    'festival': { name: 'Festival', icon: '🪔' },
    'meetup': { name: 'Meetup', icon: '👥' },
    'workshop': { name: 'Workshop', icon: '📚' },
    'cultural': { name: 'Cultural', icon: '🎭' },
    'sports': { name: 'Sports', icon: '⚽' },
    'other': { name: 'Other', icon: '📌' }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Event not found</p>
          <button
            onClick={() => navigate('/events')}
            className="text-primary-600 hover:text-primary-700"
          >
            Return to Events
          </button>
        </div>
      </div>
    );
  }

  const eventType = eventTypes[event.eventType] || { name: event.eventType, icon: '📌' };
  const userRSVP = event.attendees?.find(a => a.user._id === user?.id || a.user._id === user?.userId);

  const seoData = event ? generateEventSEO(event) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {seoData && <EnhancedSEO {...seoData} />}
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/events')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Events</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{eventType.icon}</span>
              <span className="bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full">
                {eventType.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm"
        >
          {/* Event Header Image */}
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-64 object-cover rounded-t-xl"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-t-xl"></div>
          )}

          {/* Event Details */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="text-2xl md:text-3xl font-bold w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Event title"
                    />
                    <select
                      value={editData.eventType}
                      onChange={(e) => setEditData({ ...editData, eventType: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      {Object.keys(eventTypes).map(type => (
                        <option key={type} value={type}>
                          {eventTypes[type].icon} {eventTypes[type].name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {event.title}
                  </h1>
                )}
              </div>

              {/* Admin Controls */}
              {canEdit && !isEditing && (
                <div className="flex items-center space-x-2">
                  {canModerate && (
                    <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      <FiShield className="mr-1" />
                      {isAdmin ? 'Admin' : 'Moderator'}
                    </span>
                  )}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Event"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  {canModerate && (
                    <button
                      onClick={handleDelete}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Event"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {isEditing && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={submitting}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({
                        title: event.title,
                        description: event.description,
                        eventType: event.eventType,
                        startDate: new Date(event.startDate).toISOString().slice(0, 16),
                        endDate: new Date(event.endDate).toISOString().slice(0, 16),
                        venue: event.location.venue,
                        address: event.location.address,
                        maxAttendees: event.maxAttendees || ''
                      });
                    }}
                    disabled={submitting}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FiClock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Date & Time</p>
                    {isEditing ? (
                      <div className="space-y-2 mt-1">
                        <input
                          type="datetime-local"
                          value={editData.startDate}
                          onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                          className="px-3 py-1 border border-gray-300 rounded"
                        />
                        <input
                          type="datetime-local"
                          value={editData.endDate}
                          onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                          className="px-3 py-1 border border-gray-300 rounded"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-600">
                          {format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}
                        </p>
                        <p className="text-gray-600">
                          {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FiMapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    {isEditing ? (
                      <div className="space-y-2 mt-1">
                        <input
                          type="text"
                          value={editData.venue}
                          onChange={(e) => setEditData({ ...editData, venue: e.target.value })}
                          className="w-full px-3 py-1 border border-gray-300 rounded"
                          placeholder="Venue"
                        />
                        <input
                          type="text"
                          value={editData.address}
                          onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                          className="w-full px-3 py-1 border border-gray-300 rounded"
                          placeholder="Address"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-600">{event.location.venue}</p>
                        <p className="text-gray-600">{event.location.address}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FiUser className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Organized by</p>
                    <p className="text-gray-600">{event.organizer?.fullName || event.organizer?.username}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FiUsers className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Attendees</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.maxAttendees}
                        onChange={(e) => setEditData({ ...editData, maxAttendees: e.target.value })}
                        className="w-32 px-3 py-1 border border-gray-300 rounded mt-1"
                        placeholder="Max attendees"
                      />
                    ) : (
                      <>
                        <p className="text-gray-600">
                          {event.attendees?.filter(a => a.status === 'going').length || 0} going
                        </p>
                        {event.maxAttendees && (
                          <p className="text-gray-600">
                            Max capacity: {event.maxAttendees}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* RSVP Buttons */}
                {isAuthenticated && !isEditing && (
                  <div className="pt-4">
                    <p className="font-medium text-gray-900 mb-3">Your RSVP</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRSVP('going')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          userRSVP?.status === 'going'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <FiCheck className="inline mr-1" /> Going
                      </button>
                      <button
                        onClick={() => handleRSVP('interested')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          userRSVP?.status === 'interested'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Interested
                      </button>
                      <button
                        onClick={() => handleRSVP('not-going')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          userRSVP?.status === 'not-going'
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <FiX className="inline mr-1" /> Not Going
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Event</h2>
              {isEditing ? (
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Event description"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {event.description}
                </p>
              )}
            </div>

            {/* Attendees List */}
            {event.attendees && event.attendees.length > 0 && (
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Who's Coming ({event.attendees.filter(a => a.status === 'going').length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {event.attendees
                    .filter(a => a.status === 'going')
                    .slice(0, 8)
                    .map((attendee, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="text-sm text-gray-700">
                          {attendee.user?.username || 'User'}
                        </span>
                      </div>
                    ))}
                  {event.attendees.filter(a => a.status === 'going').length > 8 && (
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm text-gray-600">
                          +{event.attendees.filter(a => a.status === 'going').length - 8}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetailView;