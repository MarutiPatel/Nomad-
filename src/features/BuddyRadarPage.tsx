import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radar, MapPin, Heart, MessageCircle, Filter, Settings,
  User, Clock, Star, Zap, Globe, Camera, Music, Coffee,
  UserPlus, Navigation, Send, Eye, EyeOff, AlertTriangle,
  RefreshCw, Waves
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TravelBuddy {
  id: string;
  displayName: string;
  avatar: string;
  location: string;
  distance: number;
  travelStyle: string;
  interests: string[];
  compatibility: number;
  isOnline: boolean;
  lastSeen: Date;
  bio: string;
  age?: number;
  languages: string[];
  currentTrip?: string;
  coordinates: { lat: number; lng: number };
  canReceiveChatInvites?: boolean;
}

// Move getCompatibilityColor function outside of components so it's accessible to both
const getCompatibilityColor = (score: number) => {
  if (score >= 90) return 'from-green-400 to-emerald-500';
  if (score >= 80) return 'from-blue-400 to-cyan-500';
  if (score >= 70) return 'from-yellow-400 to-orange-500';
  return 'from-red-400 to-pink-500';
};

function BuddyRadarPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<TravelBuddy | null>(null);
  const [filterRadius, setFilterRadius] = useState(5); // km
  const [compatibilityFilter, setCompatibilityFilter] = useState(70);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  const mockBuddies: TravelBuddy[] = [
    {
      id: '1',
      displayName: 'CosmicWanderer88',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Goa Beach',
      distance: 0.8,
      travelStyle: 'Adventure Seeker',
      interests: ['photography', 'surfing', 'local food', 'nightlife'],
      compatibility: 92,
      isOnline: true,
      lastSeen: new Date(),
      bio: 'Love exploring hidden beaches and trying local cuisines. Always up for spontaneous adventures!',
      age: 26,
      languages: ['English', 'Hindi', 'Spanish'],
      currentTrip: 'Goa Beach Hopping',
      coordinates: { lat: 15.2993, lng: 74.1240 }
      canReceiveChatInvites: true
    },
    {
      id: '2',
      displayName: 'MountainSoul42',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Arambol Beach',
      distance: 2.3,
      travelStyle: 'Nature Lover',
      interests: ['hiking', 'yoga', 'meditation', 'organic food'],
      compatibility: 85,
      isOnline: false,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      bio: 'Seeking peace in nature and meaningful connections with fellow travelers.',
      age: 29,
      languages: ['English', 'French'],
      currentTrip: 'Spiritual Journey',
      coordinates: { lat: 15.6885, lng: 73.7384 },
      canReceiveChatInvites: false
    },
    {
      id: '3',
      displayName: 'DigitalNomadX',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Anjuna Beach',
      distance: 4.1,
      travelStyle: 'Work & Travel',
      interests: ['coworking', 'tech', 'coffee', 'networking'],
      compatibility: 78,
      isOnline: true,
      lastSeen: new Date(),
      bio: 'Remote developer exploring the world while building cool projects.',
      age: 31,
      languages: ['English', 'German', 'Portuguese'],
      currentTrip: 'Digital Nomad Life',
      coordinates: { lat: 15.5736, lng: 73.7370 },
      canReceiveChatInvites: true
    }
  ];

  const [nearbyBuddies, setNearbyBuddies] = useState(mockBuddies);

  // Simulate live GPS updates for buddy locations
  useEffect(() => {
    if (!user?.isRadarVisible) return;

    const interval = setInterval(() => {
      setNearbyBuddies(prev => prev.map(buddy => {
        // Simulate small movements (within 0.01 degrees ~ 1km)
        const latChange = (Math.random() - 0.5) * 0.002;
        const lngChange = (Math.random() - 0.5) * 0.002;
        const newCoordinates = {
          lat: buddy.coordinates.lat + latChange,
          lng: buddy.coordinates.lng + lngChange
        };

        // Recalculate distance based on new coordinates
        const newDistance = buddy.distance + (Math.random() - 0.5) * 0.5;
        const clampedDistance = Math.max(0.1, Math.min(10, newDistance));

        // Randomly update online status
        const shouldToggleOnline = Math.random() < 0.05; // 5% chance
        const newIsOnline = shouldToggleOnline ? !buddy.isOnline : buddy.isOnline;

        return {
          ...buddy,
          coordinates: newCoordinates,
          distance: clampedDistance,
          isOnline: newIsOnline,
          lastSeen: newIsOnline ? new Date() : buddy.lastSeen
        };
      }));
      setLastUpdateTime(new Date());
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [user?.isRadarVisible]);

  const startScanning = () => {
    if (!user?.isRadarVisible) {
      return;
    }

    setIsScanning(true);
    // Simulate scanning animation
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const handleStartChat = (buddy: TravelBuddy) => {
    if (!buddy.canReceiveChatInvites) {
      alert(`${buddy.displayName} has disabled chat invitations.`);
      return;
    }
    
    console.log('Starting chat with:', buddy.displayName);
    
    // Create a new chat session and navigate to chat page
    const chatData = {
      buddyId: buddy.id,
      buddyName: buddy.displayName,
      buddyAvatar: buddy.avatar
    };
    
    // Store chat data in localStorage for the chat page to pick up
    localStorage.setItem('newChatBuddy', JSON.stringify(chatData));
    
    // Navigate to chat page
    navigate('/dashboard/chat');
  };

  const handleWave = (buddy: TravelBuddy) => {
    console.log('Sending wave to:', buddy.displayName);
    
    // Create wave message
    const waveData = {
      buddyId: buddy.id,
      buddyName: buddy.displayName,
      buddyAvatar: buddy.avatar,
      messageType: 'wave',
      message: `👋 Wave from ${user?.displayName}!`
    };
    
    localStorage.setItem('newChatBuddy', JSON.stringify(waveData));
    navigate('/dashboard/chat');
  };

  const handleInviteToExplore = (buddy: TravelBuddy) => {
    console.log('Inviting to explore:', buddy.displayName);
    
    // Create invite message
    const inviteData = {
      buddyId: buddy.id,
      buddyName: buddy.displayName,
      buddyAvatar: buddy.avatar,
      messageType: 'invite',
      message: `Let's explore ${user?.location || 'this amazing place'} together! 🗺️✨`
    };
    
    localStorage.setItem('newChatBuddy', JSON.stringify(inviteData));
    navigate('/dashboard/chat');
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredBuddies = nearbyBuddies.filter(buddy => 
    buddy.distance <= filterRadius && buddy.compatibility >= compatibilityFilter
  );

  // Check if user has radar visibility disabled
  if (!user?.isRadarVisible) {
    return (
      <div className="p-4 pb-20 lg:pb-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <EyeOff className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Ghost Mode Active</h1>
          <p className="text-gray-400 text-sm mb-6">
            You're invisible to other travelers on Buddy Radar
          </p>
          
          <div className="bg-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 mb-6">
            <div className="space-y-3 text-sm text-purple-300">
              <div className="flex items-center space-x-2">
                <EyeOff className="h-4 w-4" />
                <span>Your location is hidden from other travelers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>You can still see others, but they can't see you</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Radar scanning is disabled in Ghost Mode</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard/profile')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Enable Radar in Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className={`w-20 h-20 mx-auto bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center ${
            isScanning ? 'animate-pulse' : ''
          }`}>
            <Radar className={`h-10 w-10 text-white ${isScanning ? 'animate-spin' : ''}`} />
          </div>
          {isScanning && (
            <div className="absolute inset-0 rounded-full border-4 border-cyan-400 animate-ping"></div>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Buddy Radar</h1>
        <p className="text-gray-400 text-sm mb-2">
          Discover travel souls nearby who share your vibe
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Last updated: {lastUpdateTime.toLocaleTimeString()}
        </p>
        
        <button
          onClick={startScanning}
          disabled={isScanning}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Start Radar Scan'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-cyan-400" />
          <span className="text-white font-medium">Filters</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Radius: {filterRadius} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={filterRadius}
              onChange={(e) => setFilterRadius(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Min Compatibility: {compatibilityFilter}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={compatibilityFilter}
              onChange={(e) => setCompatibilityFilter(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      {/* Nearby Buddies */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Nearby Travel Souls ({filteredBuddies.length})
          </h2>
          <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
            <Settings className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {filteredBuddies.map((buddy) => (
            <div
              key={buddy.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={buddy.avatar}
                    alt={buddy.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                    buddy.isOnline ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                </div>

                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-semibold">{buddy.displayName}</h3>
                      <div className="flex items-center space-x-1 text-gray-400 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>{buddy.location} • {buddy.distance.toFixed(1)} km away</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCompatibilityColor(buddy.compatibility)} text-white`}>
                        <Heart className="h-3 w-3 mr-1" />
                        {buddy.compatibility}%
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {buddy.isOnline ? 'Online' : formatLastSeen(buddy.lastSeen)}
                      </div>
                    </div>
                  </div>

                  {/* Travel Style & Bio */}
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs text-purple-400 border border-purple-400/30 mb-2">
                      {buddy.travelStyle}
                    </span>
                    <p className="text-gray-300 text-sm">{buddy.bio}</p>
                  </div>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {buddy.interests.slice(0, 3).map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                      >
                        {interest}
                      </span>
                    ))}
                    {buddy.interests.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                        +{buddy.interests.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleWave(buddy)}
                      className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Waves className="h-4 w-4" />
                      <span>Wave</span>
                    </button>
                    
                    <button 
                      onClick={() => handleInviteToExplore(buddy)}
                      className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl text-white text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Navigation className="h-4 w-4" />
                      <span>Explore</span>
                    </button>
                    
                    <button 
                      onClick={() => handleStartChat(buddy)}
                      disabled={!buddy.canReceiveChatInvites}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        buddy.canReceiveChatInvites
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{buddy.canReceiveChatInvites ? 'Chat' : 'Chat Disabled'}</span>
                    </button>
                    
                    <button 
                      onClick={() => setSelectedBuddy(buddy)}
                      className="flex items-center space-x-1 px-3 py-2 bg-white/10 rounded-xl text-gray-300 text-sm font-medium hover:bg-white/20 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBuddies.length === 0 && (
          <div className="text-center py-12">
            <Radar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Travel Souls Found</h3>
            <p className="text-gray-400 text-sm mb-4">
              Try adjusting your filters or scanning again
            </p>
            <button
              onClick={startScanning}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-2xl font-semibold text-white"
            >
              Scan Again
            </button>
          </div>
        )}
      </div>

      {/* Buddy Detail Modal */}
      {selectedBuddy && (
        <BuddyDetailModal
          buddy={selectedBuddy}
          onClose={() => setSelectedBuddy(null)}
          onStartChat={handleStartChat}
          onWave={handleWave}
          onInviteToExplore={handleInviteToExplore}
        />
      )}
    </div>
  );
}

function BuddyDetailModal({ 
  buddy, 
  onClose, 
  onStartChat,
  onWave,
  onInviteToExplore
}: { 
  buddy: TravelBuddy; 
  onClose: () => void;
  onStartChat: (buddy: TravelBuddy) => void;
  onWave: (buddy: TravelBuddy) => void;
  onInviteToExplore: (buddy: TravelBuddy) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <img
                src={buddy.avatar}
                alt={buddy.displayName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 ${
                buddy.isOnline ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{buddy.displayName}</h2>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <MapPin className="h-3 w-3" />
                <span>{buddy.location} • {buddy.distance.toFixed(1)} km away</span>
              </div>
              {buddy.age && (
                <div className="text-gray-400 text-sm">{buddy.age} years old</div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Compatibility Score */}
          <div className="mb-6">
            <div className={`bg-gradient-to-r ${getCompatibilityColor(buddy.compatibility)} p-4 rounded-2xl text-center`}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Heart className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Compatibility Score</span>
              </div>
              <div className="text-2xl font-bold text-white">{buddy.compatibility}%</div>
              <div className="text-white/80 text-sm">Great match for travel adventures!</div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">About</h3>
            <p className="text-gray-300 text-sm">{buddy.bio}</p>
          </div>

          {/* Travel Style */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Travel Style</h3>
            <span className="inline-block px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-purple-400 border border-purple-400/30">
              {buddy.travelStyle}
            </span>
          </div>

          {/* Current Trip */}
          {buddy.currentTrip && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Current Trip</h3>
              <div className="flex items-center space-x-2 text-cyan-400">
                <Zap className="h-4 w-4" />
                <span className="text-sm">{buddy.currentTrip}</span>
              </div>
            </div>
          )}

          {/* Interests */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {buddy.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {buddy.languages.map((language, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onWave(buddy)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Waves className="h-5 w-5" />
              <span>Wave</span>
            </button>
            
            <button 
              onClick={() => onInviteToExplore(buddy)}
              className="bg-gradient-to-r from-green-500 to-teal-500 px-4 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Navigation className="h-5 w-5" />
              <span>Explore</span>
            </button>
            
            <button 
              onClick={() => onStartChat(buddy)}
              disabled={!buddy.canReceiveChatInvites}
              className={`col-span-2 px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                buddy.canReceiveChatInvites
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-xl'
                  : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span>{buddy.canReceiveChatInvites ? 'Start Chat' : 'Chat Disabled'}</span>
            </button>
          </div>
          
          {!buddy.canReceiveChatInvites && (
            <div className="mt-3 p-2 bg-orange-500/10 rounded-xl border border-orange-400/30">
              <p className="text-orange-400 text-xs text-center">
                This traveler has disabled chat invitations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuddyRadarPage;