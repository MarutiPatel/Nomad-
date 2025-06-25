import React, { useState } from 'react';
import { 
  Users, Globe, MapPin, Heart, MessageCircle, UserPlus, 
  Filter, Search, Star, Clock, Navigation, Camera,
  Zap, Trophy, Eye, Share, Bookmark, Plus, Crown
} from 'lucide-react';

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

interface TravelStory {
  id: string;
  author: NomadProfile;
  title: string;
  content: string;
  location: string;
  image: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
}

function NomadNetworkPage() {
  const [activeTab, setActiveTab] = useState<'discover' | 'following' | 'stories'>('discover');
  const [selectedProfile, setSelectedProfile] = useState<NomadProfile | null>(null);
  const [selectedStory, setSelectedStory] = useState<TravelStory | null>(null);

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
    }
  ];

  const mockStories: TravelStory[] = [
    {
      id: '1',
      author: mockProfiles[0],
      title: 'Hidden Beach Paradise in Goa',
      content: 'Discovered this incredible secluded beach through a local fisherman. The sunset here is absolutely magical, and there\'s not a single tourist in sight. Sometimes the best adventures come from following your curiosity and trusting the locals.',
      location: 'Secret Beach, Goa',
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 34,
      comments: 12,
      isLiked: true,
      isBookmarked: false,
      tags: ['hidden-gem', 'beach', 'sunset', 'local-tips']
    },
    {
      id: '2',
      author: mockProfiles[1],
      title: 'Meditation at 3000m Above Sea Level',
      content: 'Woke up at 4 AM to reach this meditation spot before sunrise. The silence at this altitude is profound - you can literally hear your heartbeat. This is why I travel - for moments that change your perspective on life.',
      location: 'Triund Peak, Himachal Pradesh',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 67,
      comments: 23,
      isLiked: false,
      isBookmarked: true,
      tags: ['meditation', 'mountains', 'sunrise', 'spiritual']
    }
  ];

  const [profiles] = useState(mockProfiles);
  const [stories, setStories] = useState(mockStories);

  const handleFollow = (profileId: string) => {
    // Handle follow functionality
    console.log('Following profile:', profileId);
  };

  const handleLikeStory = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, isLiked: !story.isLiked, likes: story.isLiked ? story.likes - 1 : story.likes + 1 }
        : story
    ));
  };

  const handleBookmarkStory = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, isBookmarked: !story.isBookmarked }
        : story
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
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
          onClick={() => setActiveTab('stories')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'stories'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Camera className="h-4 w-4" />
          <span className="text-sm font-medium">Stories</span>
        </button>
      </div>

      {/* Content */}
      {(activeTab === 'discover' || activeTab === 'following') && (
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

          {/* Profiles Grid */}
          <div className="space-y-4">
            {profiles
              .filter(profile => activeTab === 'discover' || profile.isFollowing)
              .map((profile) => (
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
                      <div className="mb-3">
                        <span className="inline-block px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs text-purple-400 border border-purple-400/30 mb-2">
                          {profile.travelStyle}
                        </span>
                        <p className="text-gray-300 text-sm">{profile.bio}</p>
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
        </div>
      )}

      {activeTab === 'stories' && (
        <div className="space-y-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              {/* Story Image */}
              <div className="h-64 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Story Content */}
              <div className="p-4">
                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={story.author.avatar}
                    alt={story.author.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{story.author.displayName}</h4>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>{story.location}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(story.timestamp)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleBookmarkStory(story.id)}
                    className={`p-2 rounded-full transition-colors ${
                      story.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${story.isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Story Title & Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{story.title}</h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{story.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {story.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikeStory(story.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        story.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${story.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{story.likes}</span>
                    </button>
                    
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{story.comments}</span>
                    </button>
                  </div>
                  
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Share className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}

      {/* Story Detail Modal */}
      {selectedStory && (
        <StoryDetailModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
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

function StoryDetailModal({ 
  story, 
  onClose 
}: { 
  story: TravelStory; 
  onClose: () => void;
}) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{story.title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={story.author.avatar}
                alt={story.author.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-white font-medium">{story.author.displayName}</h4>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <MapPin className="h-3 w-3" />
                  <span>{story.location}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Story</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{story.content}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-pink-400">
                  <Heart className="h-4 w-4 fill-current" />
                  <span className="text-sm">{story.likes}</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-400">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{story.comments}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-400">
                {formatTimeAgo(story.timestamp)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NomadNetworkPage;