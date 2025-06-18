import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Users, Clock, Star, Heart, Share, 
  Plus, Filter, Search, Navigation, Phone, Globe,
  Ticket, Music, Camera, Utensils, Trophy, Zap
} from 'lucide-react';

interface LiveEvent {
  id: string;
  title: string;
  description: string;
  type: 'meetup' | 'festival' | 'workshop' | 'food' | 'adventure' | 'cultural';
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  startTime: Date;
  endTime: Date;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  price: 'free' | 'paid';
  priceAmount?: number;
  image: string;
  tags: string[];
  isJoined: boolean;
  isLiked: boolean;
  likes: number;
}

interface CrowdVote {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  endsAt: Date;
  userVoted?: string;
}

function LiveEventsPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'create' | 'votes'>('events');
  const [selectedEvent, setSelectedEvent] = useState<LiveEvent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const mockEvents: LiveEvent[] = [
    {
      id: '1',
      title: 'Sunset Beach Meetup',
      description: 'Join fellow travelers for a beautiful sunset viewing session. Bring your cameras and good vibes!',
      type: 'meetup',
      location: 'Anjuna Beach, Goa',
      coordinates: { lat: 15.5736, lng: 73.7370 },
      distance: 0.8,
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      organizer: 'SunsetChaser99',
      attendees: 12,
      maxAttendees: 20,
      price: 'free',
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['sunset', 'photography', 'beach', 'social'],
      isJoined: true,
      isLiked: true,
      likes: 8
    },
    {
      id: '2',
      title: 'Local Food Walking Tour',
      description: 'Discover hidden food gems with a local guide. Taste authentic street food and learn about local culture.',
      type: 'food',
      location: 'Old Goa Market',
      coordinates: { lat: 15.5057, lng: 73.9964 },
      distance: 3.2,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 27 * 60 * 60 * 1000),
      organizer: 'LocalFoodie',
      attendees: 6,
      maxAttendees: 10,
      price: 'paid',
      priceAmount: 500,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['food', 'culture', 'walking', 'local'],
      isJoined: false,
      isLiked: false,
      likes: 15
    },
    {
      id: '3',
      title: 'Mountain Trek Adventure',
      description: 'Early morning trek to catch the sunrise from the peak. Moderate difficulty level.',
      type: 'adventure',
      location: 'Chapora Fort Trail',
      coordinates: { lat: 15.6060, lng: 73.7364 },
      distance: 5.1,
      startTime: new Date(Date.now() + 18 * 60 * 60 * 1000), // Tomorrow morning
      endTime: new Date(Date.now() + 22 * 60 * 60 * 1000),
      organizer: 'TrekMaster',
      attendees: 8,
      maxAttendees: 15,
      price: 'free',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['trekking', 'sunrise', 'adventure', 'fitness'],
      isJoined: false,
      isLiked: true,
      likes: 22
    }
  ];

  const mockVotes: CrowdVote[] = [
    {
      id: '1',
      question: 'Where should we have tonight\'s group dinner?',
      options: [
        { id: 'a', text: 'Beach Shack Restaurant', votes: 15 },
        { id: 'b', text: 'Rooftop Cafe', votes: 8 },
        { id: 'c', text: 'Local Street Food', votes: 23 },
        { id: 'd', text: 'Hotel Restaurant', votes: 4 }
      ],
      totalVotes: 50,
      endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      userVoted: 'c'
    },
    {
      id: '2',
      question: 'Best time for tomorrow\'s beach volleyball?',
      options: [
        { id: 'a', text: '7:00 AM', votes: 12 },
        { id: 'b', text: '5:00 PM', votes: 28 },
        { id: 'c', text: '7:00 PM', votes: 18 }
      ],
      totalVotes: 58,
      endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000)
    }
  ];

  const [events, setEvents] = useState(mockEvents);
  const [votes, setVotes] = useState(mockVotes);

  const handleJoinEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            isJoined: !event.isJoined,
            attendees: event.isJoined ? event.attendees - 1 : event.attendees + 1
          }
        : event
    ));
  };

  const handleLikeEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            isLiked: !event.isLiked,
            likes: event.isLiked ? event.likes - 1 : event.likes + 1
          }
        : event
    ));
  };

  const handleVote = (voteId: string, optionId: string) => {
    setVotes(prev => prev.map(vote => 
      vote.id === voteId 
        ? {
            ...vote,
            userVoted: optionId,
            options: vote.options.map(option => 
              option.id === optionId 
                ? { ...option, votes: option.votes + 1 }
                : option
            ),
            totalVotes: vote.totalVotes + 1
          }
        : vote
    ));
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meetup': return Users;
      case 'festival': return Music;
      case 'workshop': return Star;
      case 'food': return Utensils;
      case 'adventure': return Zap;
      case 'cultural': return Camera;
      default: return Calendar;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meetup': return 'from-blue-400 to-cyan-500';
      case 'festival': return 'from-purple-400 to-pink-500';
      case 'workshop': return 'from-green-400 to-teal-500';
      case 'food': return 'from-orange-400 to-red-500';
      case 'adventure': return 'from-yellow-400 to-orange-500';
      case 'cultural': return 'from-indigo-400 to-purple-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const formatTimeUntil = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Live Events</h1>
        <p className="text-gray-400 text-sm">Real-time meetups and crowd-controlled activities</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-2xl bg-black/20 p-1 mb-6">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'events'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">Events</span>
        </button>
        <button
          onClick={() => setActiveTab('votes')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'votes'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Trophy className="h-4 w-4" />
          <span className="text-sm font-medium">Crowd Votes</span>
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'create'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Create</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'events' && (
        <div>
          {/* Controls */}
          <div className="flex items-center space-x-2 mb-6">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Search className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Filter className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {events.map((event) => {
              const IconComponent = getEventTypeIcon(event.type);
              return (
                <div
                  key={event.id}
                  className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getEventTypeColor(event.type)} bg-opacity-90 backdrop-blur-sm`}>
                        <div className="flex items-center space-x-1">
                          <IconComponent className="h-3 w-3 text-white" />
                          <span className="text-xs font-medium text-white capitalize">{event.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                        <span className="text-xs text-white font-medium">
                          {formatTimeUntil(event.startTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{event.title}</h3>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location} • {event.distance}km away</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                          <Clock className="h-3 w-3" />
                          <span>{event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleLikeEvent(event.id)}
                        className={`p-2 rounded-full transition-colors ${
                          event.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${event.isLiked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{event.description}</p>

                    {/* Event Details */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees}{event.maxAttendees && `/${event.maxAttendees}`}</span>
                        </div>
                        
                        <div className="text-gray-400 text-sm">
                          by {event.organizer}
                        </div>
                        
                        {event.price === 'paid' && (
                          <div className="bg-green-500/20 px-2 py-1 rounded-full">
                            <span className="text-green-400 text-xs font-medium">₹{event.priceAmount}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 text-gray-400 text-sm">
                        <Heart className="h-3 w-3" />
                        <span>{event.likes}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleJoinEvent(event.id)}
                        className={`flex-1 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                          event.isJoined
                            ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {event.isJoined ? 'Joined' : 'Join Event'}
                      </button>
                      
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="px-4 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'votes' && (
        <div className="space-y-4">
          {votes.map((vote) => (
            <div
              key={vote.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{vote.question}</h3>
                <div className="text-xs text-orange-400">
                  Ends in {formatTimeUntil(vote.endsAt)}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {vote.options.map((option) => {
                  const percentage = vote.totalVotes > 0 ? (option.votes / vote.totalVotes) * 100 : 0;
                  const isUserVote = vote.userVoted === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => !vote.userVoted && handleVote(vote.id, option.id)}
                      disabled={!!vote.userVoted}
                      className={`w-full p-3 rounded-xl border transition-all duration-300 ${
                        isUserVote
                          ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-400'
                          : vote.userVoted
                          ? 'bg-white/5 border-white/10 text-gray-400 cursor-not-allowed'
                          : 'bg-white/5 border-white/10 text-white hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{option.text}</span>
                        <span className="text-xs">{option.votes} votes</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isUserVote ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gray-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-center text-sm text-gray-400">
                Total votes: {vote.totalVotes}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* Create Event */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-6 border border-blue-400/30">
            <div className="text-center mb-4">
              <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Create Event</h2>
              <p className="text-gray-400 text-sm">Organize a meetup or activity</p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Plus className="h-6 w-6" />
              <span>Create New Event</span>
            </button>
          </div>

          {/* Create Vote */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-6 border border-purple-400/30">
            <div className="text-center mb-4">
              <Trophy className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Create Vote</h2>
              <p className="text-gray-400 text-sm">Let the crowd decide</p>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <Plus className="h-6 w-6" />
              <span>Create New Vote</span>
            </button>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onJoin={() => handleJoinEvent(selectedEvent.id)}
        />
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function EventDetailModal({ 
  event, 
  onClose, 
  onJoin 
}: { 
  event: LiveEvent; 
  onClose: () => void;
  onJoin: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{event.title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Description</h3>
              <p className="text-gray-300 text-sm">{event.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-medium mb-2">Location</h3>
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Time</h3>
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Organizer</h3>
              <p className="text-gray-300 text-sm">{event.organizer}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onJoin}
                className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  event.isJoined
                    ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {event.isJoined ? 'Joined' : 'Join Event'}
              </button>
              
              <button className="px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
                <Navigation className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateEventModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'meetup' as const,
    location: '',
    startTime: '',
    endTime: '',
    maxAttendees: '',
    price: 'free' as const,
    priceAmount: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating event:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Create Event</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="What's happening?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="meetup">Meetup</option>
                <option value="festival">Festival</option>
                <option value="workshop">Workshop</option>
                <option value="food">Food</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                rows={3}
                placeholder="Tell people what to expect..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="Where will this happen?"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LiveEventsPage;