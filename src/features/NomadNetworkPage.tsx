import React, { useState } from 'react';
import { 
  Users, Globe, MapPin, Heart, MessageCircle, UserPlus, 
  Filter, Search, Star, Clock, Navigation, Camera,
  Zap, Trophy, Eye, Share, Bookmark, Plus, Crown
} from 'lucide-react';

import { useScreenshotProtection } from '../contexts/ScreenshotProtectionContext';
interface NomadProfile {
  id: string;
  displayName: string;
  avatar: string;
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  travelStyle: string;
  bio: string;
  interests: string[];
  languages: string[];
  currentTrip?: string;
  joinedAt: Date;
  footprints: number;
  connections: number;
  karma: number;
  isOnline: boolean;
  lastSeen: Date;
  isFollowing: boolean;
  isVerified: boolean;
  badges: string[];
  trustScore: number;
  trustCircles: string[];
  isCreator: boolean;
  creatorContent?: {
    followers: number;
    totalViews: number;
    guides: number;
    meetups: number;
  };
}

function NomadNetworkPage() {
  const [activeTab, setActiveTab] = useState<'discover' | 'following' | 'search'>('discover');
  const [selectedProfile, setSelectedProfile] = useState<NomadProfile | null>(null);
  const { isContentBlurred } = useScreenshotProtection();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    travelStyle: '',
    location: '',
    interests: '',
    onlineOnly: false
  });

  const mockProfiles: NomadProfile[] = [
    {
      id: '1',
      displayName: 'CosmicWanderer88',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Goa, India',
      coordinates: { lat: 15.2993, lng: 74.1240 },
      distance: 2.3,
      travelStyle: 'Adventure Seeker',
      bio: 'Digital nomad exploring hidden gems across Asia. Love photography, local food, and spontaneous adventures!',
      interests: ['photography', 'surfing', 'local food', 'nightlife'],
      languages: ['English', 'Hindi', 'Spanish'],
      currentTrip: 'Goa Beach Hopping',
      joinedAt: new Date('2023-06-15'),
      footprints: 45,
      connections: 128,
      karma: 850,
      isOnline: true,
      lastSeen: new Date(),
      isFollowing: false,
      isVerified: true,
      badges: ['Explorer', 'Photographer', 'Foodie'],
      trustScore: 85,
      trustCircles: ['Beach Lovers', 'Photography Enthusiasts'],
      isCreator: true,
      creatorContent: {
        followers: 324,
        totalViews: 15420,
        guides: 8,
        meetups: 3
      }
    },
    {
      id: '2',
      displayName: 'MountainSoul42',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Manali, Himachal Pradesh',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      distance: 15.8,
      travelStyle: 'Nature Lover',
      bio: 'Seeking peace in mountains and meaningful connections. Yoga instructor and meditation enthusiast.',
      interests: ['hiking', 'yoga', 'meditation', 'organic food'],
      languages: ['English', 'French', 'Hindi'],
      currentTrip: 'Himalayan Spiritual Journey',
      joinedAt: new Date('2023-08-20'),
      footprints: 32,
      connections: 89,
      karma: 1200,
      isOnline: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isFollowing: true,
      isVerified: false,
      badges: ['Zen Master', 'Eco Warrior'],
      trustScore: 92,
      trustCircles: ['Mindful Travelers', 'Eco Warriors'],
      isCreator: false
    },
    {
      id: '3',
      displayName: 'DigitalNomadX',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Bangalore, Karnataka',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      distance: 8.5,
      travelStyle: 'Work & Travel',
      bio: 'Remote developer building cool projects while exploring the world. Always looking for great coworking spaces.',
      interests: ['tech', 'coworking', 'coffee', 'networking'],
      languages: ['English', 'German', 'Portuguese'],
      currentTrip: 'South India Tech Tour',
      joinedAt: new Date('2023-09-10'),
      footprints: 28,
      connections: 156,
      karma: 650,
      isOnline: true,
      lastSeen: new Date(),
      isFollowing: false,
      isVerified: true,
      badges: ['Tech Nomad', 'Connector'],
      trustScore: 78,
      trustCircles: ['Digital Nomads', 'Tech Travelers'],
      isCreator: true,
      creatorContent: {
        followers: 156,
        totalViews: 8920,
        guides: 5,
        meetups: 7
      }
    },
    {
      id: '4',
      displayName: 'SoulfulExplorer',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Rishikesh, Uttarakhand',
      coordinates: { lat: 30.0869, lng: 78.2676 },
      distance: 12.1,
      travelStyle: 'Spiritual Seeker',
      bio: 'On a journey of self-discovery through ancient wisdom and modern adventures.',
      interests: ['spirituality', 'meditation', 'philosophy', 'music'],
      languages: ['English', 'Sanskrit', 'Hindi'],
      currentTrip: 'Spiritual India Quest',
      joinedAt: new Date('2023-07-05'),
      footprints: 21,
      connections: 67,
      karma: 980,
      isOnline: false,
      lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isFollowing: false,
      isVerified: false,
      badges: ['Seeker', 'Wisdom Keeper'],
      trustScore: 88,
      trustCircles: ['Spiritual Travelers'],
      isCreator: false
    },
    {
      id: '5',
      displayName: 'UrbanExplorer23',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Delhi, India',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      distance: 5.7,
      travelStyle: 'Cultural Enthusiast',
      bio: 'City explorer passionate about street art, local culture, and hidden urban gems.',
      interests: ['street art', 'architecture', 'culture', 'food'],
      languages: ['English', 'Hindi', 'French'],
      currentTrip: 'Indian Heritage Trail',
      joinedAt: new Date('2023-05-22'),
      footprints: 38,
      connections: 94,
      karma: 720,
      isOnline: true,
      lastSeen: new Date(),
      isFollowing: true,
      isVerified: true,
      badges: ['Culture Vulture', 'Art Lover'],
      trustScore: 81,
      trustCircles: ['Urban Explorers', 'Art Enthusiasts'],
      isCreator: false
    }
  ];

  const [profiles] = useState(mockProfiles);

  const handleFollow = (profileId: string) => {
    // Handle follow functionality
    console.log('Following profile:', profileId);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Search functionality
  const filteredProfiles = profiles.filter(profile => {
    const matchesQuery = searchQuery === '' || 
      profile.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.travelStyle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase())) ||
      profile.languages.some(language => language.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTravelStyle = searchFilters.travelStyle === '' || 
      profile.travelStyle.toLowerCase().includes(searchFilters.travelStyle.toLowerCase());

    const matchesLocation = searchFilters.location === '' || 
      profile.location.toLowerCase().includes(searchFilters.location.toLowerCase());

    const matchesInterests = searchFilters.interests === '' || 
      profile.interests.some(interest => interest.toLowerCase().includes(searchFilters.interests.toLowerCase()));

    const matchesOnlineStatus = !searchFilters.onlineOnly || profile.isOnline;

    return matchesQuery && matchesTravelStyle && matchesLocation && matchesInterests && matchesOnlineStatus;
  });

  const getDisplayProfiles = () => {
    if (activeTab === 'search') {
      return filteredProfiles;
    } else if (activeTab === 'following') {
      return profiles.filter(profile => profile.isFollowing);
    } else {
      return profiles;
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchFilters({
      travelStyle: '',
      location: '',
      interests: '',
      onlineOnly: false
    });
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Nomad Network</h1>
        <p className="text-gray-400 text-sm">Connect with fellow travelers worldwide</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-2xl bg-black/20 p-1 mb-6">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'discover'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">Discover</span>
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'following'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">Following</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'search'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Search className="h-4 w-4" />
          <span className="text-sm font-medium">Search</span>
        </button>
      </div>

      {/* Search Controls (when search tab is active) */}
      {activeTab === 'search' && (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mb-6">
          <div className="space-y-4">
            {/* Main Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, bio, interests, location..."
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none"
              />
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={searchFilters.travelStyle}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, travelStyle: e.target.value }))}
                placeholder="Travel style..."
                className="px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none text-sm"
              />
              <input
                type="text"
                value={searchFilters.location}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Location..."
                className="px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <input
                type="text"
                value={searchFilters.interests}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, interests: e.target.value }))}
                placeholder="Interests..."
                className="flex-1 px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none text-sm mr-3"
              />
              <label className="flex items-center space-x-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={searchFilters.onlineOnly}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, onlineOnly: e.target.checked }))}
                  className="w-4 h-4 text-orange-600 bg-black/20 border-white/10 rounded focus:ring-orange-500"
                />
                <span>Online only</span>
              </label>
            </div>

            {/* Search Results Info */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {activeTab === 'search' ? `${filteredProfiles.length} results found` : ''}
              </span>
              {(searchQuery || searchFilters.travelStyle || searchFilters.location || searchFilters.interests || searchFilters.onlineOnly) && (
                <button
                  onClick={clearSearch}
                  className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Basic Controls (for discover and following tabs) */}
      {activeTab !== 'search' && (
        <div className="flex items-center space-x-2 mb-6">
          <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
            <Search className="h-4 w-4 text-gray-400" />
          </button>
          <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
            <Filter className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      )}

      {/* Content */}
      <div>
        {/* Profiles Grid */}
        <div className={`space-y-4 ${isContentBlurred ? 'blur-sensitive' : ''}`}>
          {getDisplayProfiles().map((profile) => (
            <div
              key={profile.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.displayName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 ${
                    profile.isOnline ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                  {profile.isVerified && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Star className="h-3 w-3 text-white fill-current" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-white font-medium">{profile.displayName}</span>
                        {profile.isVerified && (
                          <Star className="h-3 w-3 text-blue-400 fill-current" />
                        )}
                        {profile.isCreator && (
                          <Crown className="h-3 w-3 text-purple-400 fill-current" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-gray-400 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>{profile.location} • {profile.distance}km away</span>
                      </div>
                    </div>
                    
                    {/* Trust Score */}
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        profile.trustScore >= 80 ? 'text-green-400' :
                        profile.trustScore >= 60 ? 'text-yellow-400' :
                        'text-orange-400'
                      }`}>
                        Trust: {profile.trustScore}%
                      </div>
                      <div className="text-xs text-gray-400">
                        {profile.trustCircles.length} circles
                      </div>
                    </div>
                  </div>

                  {/* Creator Badge */}
                  {profile.isCreator && profile.creatorContent && (
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-3 mb-3 border border-purple-400/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <Crown className="h-4 w-4 text-purple-400" />
                        <span className="text-purple-400 font-medium text-sm">Travel Creator</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-sm font-bold text-purple-400">{profile.creatorContent.followers}</div>
                          <div className="text-gray-400">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-pink-400">{profile.creatorContent.guides}</div>
                          <div className="text-gray-400">Guides</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Trust Circles */}
                  {profile.trustCircles.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-gray-400 text-xs mb-2">Trust Circles</h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.trustCircles.slice(0, 2).map((circle, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full text-xs text-green-400 border border-green-400/30"
                          >
                            {circle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Travel Style & Bio */}
                  <div className={`mb-3 ${isContentBlurred ? 'blur-sensitive' : ''}`}>
                    <span className="inline-block px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs text-purple-400 border border-purple-400/30 mb-2">
                      {profile.travelStyle}
                    </span>
                    <p className={`text-gray-300 text-sm ${isContentBlurred ? 'blur-sensitive' : ''}`}>{profile.bio}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-cyan-400">{profile.footprints}</div>
                      <div className="text-xs text-gray-400">Footprints</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-purple-400">{profile.connections}</div>
                      <div className="text-xs text-gray-400">Connections</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-400">{profile.karma}</div>
                      <div className="text-xs text-gray-400">Karma</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {profile.badges.slice(0, 3).map((badge, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full text-xs text-yellow-400 border border-yellow-400/30"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Current Trip */}
                  {profile.currentTrip && (
                    <div className="bg-black/20 rounded-xl p-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-3 w-3 text-orange-400" />
                        <span className="text-orange-400 text-xs font-medium">Current Trip:</span>
                        <span className="text-gray-300 text-xs">{profile.currentTrip}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedProfile(profile)}
                      className="flex items-center space-x-1 px-3 py-2 bg-white/10 rounded-xl text-gray-300 text-sm font-medium hover:bg-white/20 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Profile</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl text-white text-sm font-medium hover:shadow-lg transition-all duration-300">
                      <MessageCircle className="h-4 w-4" />
                      <span>Message</span>
                    </button>
                    
                    <button
                      onClick={() => handleFollow(profile.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        profile.isFollowing
                          ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg'
                      }`}
                    >
                      {profile.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {getDisplayProfiles().length === 0 && (
          <div className="text-center py-12">
            {activeTab === 'search' ? (
              <>
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Try adjusting your search criteria or clearing filters
                </p>
                <button
                  onClick={clearSearch}
                  className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-2xl font-semibold text-white"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Travelers Found</h3>
                <p className="text-gray-400 text-sm">
                  {activeTab === 'following' 
                    ? "You're not following anyone yet. Discover travelers to connect with!"
                    : "No travelers in your area right now. Check back later!"
                  }
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}

function ProfileDetailModal({ 
  profile, 
  onClose 
}: { 
  profile: NomadProfile; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Profile</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Profile Info */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <img
                src={profile.avatar}
                alt={profile.displayName}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-slate-900 ${
                profile.isOnline ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{profile.displayName}</h3>
            <div className="flex items-center justify-center space-x-1 text-gray-400 text-sm mb-2">
              <MapPin className="h-3 w-3" />
              <span>{profile.location}</span>
            </div>
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-purple-400 border border-purple-400/30 text-sm">
              {profile.travelStyle}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-400">{profile.footprints}</div>
              <div className="text-xs text-gray-400">Footprints</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">{profile.connections}</div>
              <div className="text-xs text-gray-400">Connections</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{profile.karma}</div>
              <div className="text-xs text-gray-400">Karma</div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">About</h4>
            <p className="text-gray-300 text-sm">{profile.bio}</p>
          </div>

          {/* Trust Information */}
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">Trust & Reputation</h4>
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl p-3 border border-green-400/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-medium">Trust Score</span>
                <span className={`text-lg font-bold ${
                  profile.trustScore >= 80 ? 'text-green-400' :
                  profile.trustScore >= 60 ? 'text-yellow-400' :
                  'text-orange-400'
                }`}>
                  {profile.trustScore}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full">
                <div
                  className={`h-2 rounded-full ${
                    profile.trustScore >= 80 ? 'bg-gradient-to-r from-green-400 to-teal-500' :
                    profile.trustScore >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    'bg-gradient-to-r from-orange-400 to-red-500'
                  }`}
                  style={{ width: `${profile.trustScore}%` }}
                />
              </div>
              <p className="text-green-300 text-xs mt-2">
                Built through verified travels and positive community interactions
              </p>
            </div>
          </div>

          {/* Trust Circles */}
          {profile.trustCircles.length > 0 && (
            <div className="mb-6">
              <h4 className="text-white font-medium mb-2">Trust Circles</h4>
              <div className="flex flex-wrap gap-2">
                {profile.trustCircles.map((circle, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full text-xs text-green-400 border border-green-400/30"
                  >
                    {circle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Creator Stats */}
          {profile.isCreator && profile.creatorContent && (
            <div className="mb-6">
              <h4 className="text-white font-medium mb-2">Creator Stats</h4>
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-3 border border-purple-400/30">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{profile.creatorContent.followers}</div>
                    <div className="text-xs text-gray-400">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-pink-400">{profile.creatorContent.totalViews}</div>
                    <div className="text-xs text-gray-400">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-cyan-400">{profile.creatorContent.guides}</div>
                    <div className="text-xs text-gray-400">Travel Guides</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">{profile.creatorContent.meetups}</div>
                    <div className="text-xs text-gray-400">Hosted Meetups</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interests */}
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
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
            <h4 className="text-white font-medium mb-2">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((language, index) => (
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
          <div className="flex space-x-3">
            <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Message</span>
            </button>
            
            <button className="px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
              <UserPlus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NomadNetworkPage;