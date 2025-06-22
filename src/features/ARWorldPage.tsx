import React, { useState } from 'react';
import { Camera, MapPin, Eye, MessageCircle, Star, Plus, Filter, Search, Layers, Zap, Gift, Heart, Users, Clock, Navigation, Share, Bookmark, Headphones, Headset as VrHeadset, Globe, Mountain, Plane, Gamepad2, Monitor, Smartphone, Wifi, Play, Volume2, Calendar, Trophy, Target, Compass, Map } from 'lucide-react';

interface ARTag {
  id: string;
  title: string;
  content: string;
  type: 'tip' | 'review' | 'warning' | 'fun' | 'secret';
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  author: string;
  timestamp: Date;
  likes: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  mediaUrl?: string;
}

interface VRExperience {
  id: string;
  title: string;
  description: string;
  type: 'tour' | 'adventure' | 'cultural' | 'educational' | 'entertainment';
  location: string;
  duration: number; // in minutes
  rating: number;
  participants: number;
  maxParticipants: number;
  isLive: boolean;
  previewImage: string;
  equipment: 'mobile' | 'headset' | 'computer';
  price: 'free' | 'premium';
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ARVRLiveExperience {
  id: string;
  title: string;
  description: string;
  type: 'ar-tour' | 'vr-experience' | 'mixed-reality' | 'virtual-meetup';
  participants: number;
  maxParticipants: number;
  status: 'live' | 'starting-soon' | 'ending-soon';
  timeRemaining?: number; // minutes
  host: string;
  features: string[];
  location?: string;
  equipment: string[];
}

function ARWorldPage() {
  const [activeTab, setActiveTab] = useState<'ar-tags' | 'vr-experiences' | 'live-experiences' | 'create'>('ar-tags');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<VRExperience | null>(null);

  const mockARTags: ARTag[] = [
    {
      id: '1',
      title: 'Hidden Beach Access',
      content: 'Secret path behind the rocks leads to a pristine private beach. Best during low tide!',
      type: 'secret',
      location: 'Goa Beach',
      coordinates: { lat: 15.2993, lng: 74.1240 },
      distance: 0.2,
      author: 'BeachExplorer99',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 23,
      views: 156,
      isLiked: false,
      isBookmarked: true
    },
    {
      id: '2',
      title: 'Best Chai Spot',
      content: 'Uncle\'s tea stall serves the most amazing masala chai. Only ₹10 and he speaks great English!',
      type: 'tip',
      location: 'Manali Market',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      distance: 1.5,
      author: 'ChaiLover42',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 45,
      views: 234,
      isLiked: true,
      isBookmarked: false,
      mediaUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Slippery Rocks Warning',
      content: 'Be very careful here! Rocks are extremely slippery when wet. Two people slipped yesterday.',
      type: 'warning',
      location: 'Waterfall Trek',
      coordinates: { lat: 30.0869, lng: 78.2676 },
      distance: 3.2,
      author: 'SafetyFirst',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 67,
      views: 445,
      isLiked: false,
      isBookmarked: true
    }
  ];

  const mockVRExperiences: VRExperience[] = [
    {
      id: '1',
      title: 'Taj Mahal Virtual Tour',
      description: 'Experience the magnificent Taj Mahal in stunning 360° VR with historical narration and hidden details you can\'t see in person.',
      type: 'cultural',
      location: 'Agra, India',
      duration: 45,
      rating: 4.9,
      participants: 1247,
      maxParticipants: 2000,
      isLive: true,
      previewImage: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=400',
      equipment: 'mobile',
      price: 'free',
      tags: ['heritage', 'architecture', 'history', 'unesco'],
      difficulty: 'easy'
    },
    {
      id: '2',
      title: 'Himalayan Peak Climbing',
      description: 'Scale Mount Everest base camp in virtual reality. Experience the thrill and challenges of high-altitude climbing safely.',
      type: 'adventure',
      location: 'Mount Everest, Nepal',
      duration: 90,
      rating: 4.8,
      participants: 892,
      maxParticipants: 1500,
      isLive: true,
      previewImage: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      equipment: 'headset',
      price: 'premium',
      tags: ['adventure', 'mountains', 'extreme', 'nature'],
      difficulty: 'hard'
    },
    {
      id: '3',
      title: 'Kerala Backwaters Journey',
      description: 'Peaceful virtual boat ride through Kerala\'s serene backwaters with traditional music and local wildlife encounters.',
      type: 'tour',
      location: 'Kerala, India',
      duration: 60,
      rating: 4.7,
      participants: 634,
      maxParticipants: 1000,
      isLive: false,
      previewImage: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400',
      equipment: 'mobile',
      price: 'free',
      tags: ['nature', 'peaceful', 'water', 'wildlife'],
      difficulty: 'easy'
    },
    {
      id: '4',
      title: 'Rajasthan Palace Experience',
      description: 'Walk through the grand palaces of Rajasthan with royal guides explaining the rich history and culture of maharajas.',
      type: 'cultural',
      location: 'Jaipur, Rajasthan',
      duration: 75,
      rating: 4.8,
      participants: 445,
      maxParticipants: 800,
      isLive: true,
      previewImage: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=400',
      equipment: 'computer',
      price: 'premium',
      tags: ['palace', 'royal', 'culture', 'architecture'],
      difficulty: 'medium'
    },
    {
      id: '5',
      title: 'Space Station Visit',
      description: 'Experience life aboard the International Space Station with real astronaut interviews and zero-gravity simulations.',
      type: 'educational',
      location: 'International Space Station',
      duration: 120,
      rating: 4.9,
      participants: 2156,
      maxParticipants: 3000,
      isLive: false,
      previewImage: 'https://images.pexels.com/photos/586030/pexels-photo-586030.jpeg?auto=compress&cs=tinysrgb&w=400',
      equipment: 'headset',
      price: 'premium',
      tags: ['space', 'science', 'technology', 'astronauts'],
      difficulty: 'medium'
    },
    {
      id: '6',
      title: 'Goa Beach Party VR',
      description: 'Join a virtual beach party in Goa with live DJ, dancing, and social interactions with people from around the world.',
      type: 'entertainment',
      location: 'Goa Beach, India',
      duration: 180,
      rating: 4.6,
      participants: 1789,
      maxParticipants: 2500,
      isLive: true,
      previewImage: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      equipment: 'mobile',
      price: 'free',
      tags: ['party', 'music', 'social', 'beach'],
      difficulty: 'easy'
    }
  ];

  const mockLiveExperiences: ARVRLiveExperience[] = [
    {
      id: '1',
      title: 'Live AR City Walking Tour',
      description: 'Real-time guided tour of Delhi with AR overlays showing historical information and hidden stories',
      type: 'ar-tour',
      participants: 24,
      maxParticipants: 30,
      status: 'live',
      host: 'DelhiExplorer',
      features: ['Live guide', 'Historical overlays', 'Q&A session', 'Photo opportunities'],
      location: 'Old Delhi, India',
      equipment: ['Smartphone', 'AR App', 'Headphones']
    },
    {
      id: '2',
      title: 'Virtual Meditation in Himalayas',
      description: 'Peaceful VR meditation session in a serene Himalayan monastery with guided breathing exercises',
      type: 'vr-experience',
      participants: 89,
      maxParticipants: 150,
      status: 'live',
      host: 'ZenMaster',
      features: ['Guided meditation', '360° mountain views', 'Ambient sounds', 'Community chat'],
      equipment: ['VR Headset', 'Comfortable seating', 'Quiet environment']
    },
    {
      id: '3',
      title: 'Mixed Reality Cooking Class',
      description: 'Learn to cook authentic Indian dishes with AR ingredient recognition and VR kitchen simulation',
      type: 'mixed-reality',
      participants: 15,
      maxParticipants: 25,
      status: 'starting-soon',
      timeRemaining: 5,
      host: 'ChefRavi',
      features: ['AR ingredient overlay', 'Step-by-step guidance', 'Recipe sharing', 'Taste feedback'],
      equipment: ['Smartphone', 'Kitchen space', 'Basic ingredients']
    },
    {
      id: '4',
      title: 'Global Nomad Meetup VR',
      description: 'Connect with fellow nomads from around the world in a virtual co-working space and travel lounge',
      type: 'virtual-meetup',
      participants: 156,
      maxParticipants: 200,
      status: 'live',
      host: 'NomadHub',
      features: ['Voice chat', 'Virtual co-working', 'Travel planning', 'Networking games'],
      equipment: ['VR Headset or Computer', 'Microphone', 'Stable internet']
    },
    {
      id: '5',
      title: 'AR Wildlife Safari',
      description: 'Experience Indian wildlife through AR with real-time animal tracking and conservation education',
      type: 'ar-tour',
      participants: 67,
      maxParticipants: 100,
      status: 'ending-soon',
      timeRemaining: 12,
      host: 'WildlifeExpert',
      features: ['Real-time tracking', 'Animal information', 'Conservation tips', 'Photo challenges'],
      location: 'Jim Corbett National Park',
      equipment: ['Smartphone', 'AR Safari App', 'Outdoor gear']
    },
    {
      id: '6',
      title: 'VR Space Exploration',
      description: 'Journey through the solar system with real NASA data and interactive planet exploration',
      type: 'vr-experience',
      participants: 234,
      maxParticipants: 300,
      status: 'live',
      host: 'SpaceAcademy',
      features: ['NASA data integration', 'Planet exploration', 'Asteroid field navigation', 'Space facts'],
      equipment: ['VR Headset', 'Hand controllers', 'Space suit simulation']
    }
  ];

  const [arTags, setArTags] = useState(mockARTags);
  const [vrExperiences] = useState(mockVRExperiences);
  const [liveExperiences] = useState(mockLiveExperiences);

  const tagFilters = [
    { id: 'all', label: 'All', icon: Eye },
    { id: 'secret', label: 'Secrets', icon: Star },
    { id: 'tip', label: 'Tips', icon: MessageCircle },
    { id: 'warning', label: 'Warnings', icon: Zap }
  ];

  const vrFilters = [
    { id: 'all', label: 'All VR', icon: VrHeadset },
    { id: 'tour', label: 'Tours', icon: Globe },
    { id: 'adventure', label: 'Adventure', icon: Mountain },
    { id: 'cultural', label: 'Cultural', icon: Star },
    { id: 'educational', label: 'Educational', icon: Target }
  ];

  const handleLike = (id: string) => {
    setArTags(prev => prev.map(tag => 
      tag.id === id 
        ? { ...tag, isLiked: !tag.isLiked, likes: tag.isLiked ? tag.likes - 1 : tag.likes + 1 }
        : tag
    ));
  };

  const handleBookmark = (id: string) => {
    setArTags(prev => prev.map(tag => 
      tag.id === id 
        ? { ...tag, isBookmarked: !tag.isBookmarked }
        : tag
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'secret': return 'from-purple-400 to-pink-500';
      case 'tip': return 'from-blue-400 to-cyan-500';
      case 'warning': return 'from-red-400 to-orange-500';
      case 'review': return 'from-green-400 to-teal-500';
      case 'fun': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getVRTypeColor = (type: string) => {
    switch (type) {
      case 'tour': return 'from-blue-400 to-cyan-500';
      case 'adventure': return 'from-red-400 to-orange-500';
      case 'cultural': return 'from-purple-400 to-pink-500';
      case 'educational': return 'from-green-400 to-teal-500';
      case 'entertainment': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getEquipmentIcon = (equipment: string) => {
    switch (equipment) {
      case 'mobile': return Smartphone;
      case 'headset': return VrHeadset;
      case 'computer': return Monitor;
      default: return Smartphone;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'from-red-500 to-pink-500';
      case 'starting-soon': return 'from-yellow-400 to-orange-500';
      case 'ending-soon': return 'from-orange-400 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredTags = selectedFilter === 'all' 
    ? arTags 
    : arTags.filter(tag => tag.type === selectedFilter);

  const filteredVRExperiences = activeTab === 'vr-experiences' 
    ? (selectedFilter === 'all' ? vrExperiences : vrExperiences.filter(exp => exp.type === selectedFilter))
    : vrExperiences;

  const liveFeaturedExperiences = liveExperiences.filter(exp => exp.status === 'live').slice(0, 6);

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">AR & VR World</h1>
        <p className="text-gray-400 text-sm">Discover augmented reality tags and immerse in virtual experiences</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto space-x-1 bg-black/20 rounded-2xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('ar-tags')}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'ar-tags'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">AR Tags</span>
        </button>
        <button
          onClick={() => setActiveTab('vr-experiences')}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'vr-experiences'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <VrHeadset className="h-4 w-4" />
          <span className="text-sm font-medium">VR Experiences</span>
        </button>
        <button
          onClick={() => setActiveTab('live-experiences')}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'live-experiences'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
            <span className="text-sm font-medium">Live ({liveFeaturedExperiences.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
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
      {activeTab === 'ar-tags' && (
        <div>
          {/* Controls */}
          <div className="flex items-center space-x-2 mb-6">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Search className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Filter className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Layers className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
            {tagFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                }`}
              >
                <filter.icon className="h-4 w-4" />
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          {/* AR Tags List */}
          <div className="space-y-4">
            {filteredTags.map((tag) => {
              const IconComponent = getTypeColor(tag.type);
              return (
                <div
                  key={tag.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  {tag.mediaUrl && (
                    <div className="h-32 overflow-hidden">
                      <img
                        src={tag.mediaUrl}
                        alt={tag.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getTypeColor(tag.type)} flex items-center justify-center`}>
                            {tag.type === 'secret' && <Star className="h-3 w-3 text-white" />}
                            {tag.type === 'tip' && <MessageCircle className="h-3 w-3 text-white" />}
                            {tag.type === 'warning' && <Zap className="h-3 w-3 text-white" />}
                            {tag.type === 'review' && <Star className="h-3 w-3 text-white" />}
                            {tag.type === 'fun' && <Heart className="h-3 w-3 text-white" />}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tag.type === 'secret' ? 'bg-purple-500/20 text-purple-400' :
                            tag.type === 'tip' ? 'bg-blue-500/20 text-blue-400' :
                            tag.type === 'warning' ? 'bg-red-500/20 text-red-400' :
                            tag.type === 'review' ? 'bg-green-500/20 text-green-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {tag.type}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {tag.title}
                        </h3>
                        <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
                          <MapPin className="h-3 w-3" />
                          <span>{tag.location} • {tag.distance}km away</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleBookmark(tag.id)}
                        className={`p-2 rounded-full transition-colors ${
                          tag.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${tag.isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{tag.content}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(tag.id)}
                          className={`flex items-center space-x-1 transition-colors ${
                            tag.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${tag.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm">{tag.likes}</span>
                        </button>
                        
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <Eye className="h-4 w-4" />
                          <span>{tag.views}</span>
                        </div>
                        
                        <div className="text-gray-400 text-sm">
                          by {tag.author} • {formatTimeAgo(tag.timestamp)}
                        </div>
                      </div>
                      
                      <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                        View in AR →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'vr-experiences' && (
        <div>
          {/* VR Controls */}
          <div className="flex items-center space-x-2 mb-6">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Search className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Filter className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* VR Filters */}
          <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
            {vrFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                }`}
              >
                <filter.icon className="h-4 w-4" />
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          {/* VR Experiences Grid */}
          <div className="space-y-4">
            {filteredVRExperiences.map((experience) => {
              const EquipmentIcon = getEquipmentIcon(experience.equipment);
              return (
                <div
                  key={experience.id}
                  className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  {/* VR Experience Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={experience.previewImage}
                      alt={experience.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors cursor-pointer">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex space-x-2">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getVRTypeColor(experience.type)} bg-opacity-90 backdrop-blur-sm`}>
                        <span className="text-white text-xs font-medium capitalize">{experience.type}</span>
                      </div>
                      {experience.isLive && (
                        <div className="bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                          <span className="text-white text-xs font-medium">LIVE</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        experience.price === 'free' 
                          ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                      }`}>
                        {experience.price}
                      </div>
                    </div>
                  </div>

                  {/* VR Experience Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{experience.title}</h3>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                          <MapPin className="h-3 w-3" />
                          <span>{experience.location}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>{experience.duration} min</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 text-sm">{experience.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{experience.description}</p>

                    {/* Equipment & Participants */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <EquipmentIcon className="h-4 w-4" />
                          <span className="capitalize">{experience.equipment}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <Users className="h-4 w-4" />
                          <span>{experience.participants}/{experience.maxParticipants}</span>
                        </div>

                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          experience.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          experience.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {experience.difficulty}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {experience.tags.slice(0, 3).map((tag, index) => (
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
                        onClick={() => setSelectedExperience(experience)}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 rounded-2xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <VrHeadset className="h-5 w-5" />
                        <span>Enter VR</span>
                      </button>
                      
                      <button className="px-4 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'live-experiences' && (
        <div>
          {/* Live Status Header */}
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-4 border border-red-400/30 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
              <span className="text-red-400 font-medium text-sm">LIVE EXPERIENCES</span>
              <span className="text-gray-400 text-sm">({liveFeaturedExperiences.length} active now)</span>
            </div>
            <p className="text-gray-300 text-xs">
              Real-time AR/VR experiences happening right now around the world
            </p>
          </div>

          {/* Live Experiences List */}
          <div className="space-y-4">
            {liveFeaturedExperiences.map((experience) => (
              <div
                key={experience.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(experience.status)} bg-opacity-90 backdrop-blur-sm`}>
                        <div className="flex items-center space-x-1">
                          {experience.status === 'live' && <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>}
                          <span className="text-white text-xs font-medium">
                            {experience.status === 'live' ? 'LIVE' : 
                             experience.status === 'starting-soon' ? `Starting in ${experience.timeRemaining}m` :
                             `Ending in ${experience.timeRemaining}m`}
                          </span>
                        </div>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        experience.type === 'ar-tour' ? 'bg-purple-500/20 text-purple-400' :
                        experience.type === 'vr-experience' ? 'bg-cyan-500/20 text-cyan-400' :
                        experience.type === 'mixed-reality' ? 'bg-green-500/20 text-green-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {experience.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-1">{experience.title}</h3>
                    <p className="text-gray-300 text-sm mb-2">{experience.description}</p>
                    
                    {experience.location && (
                      <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{experience.location}</span>
                      </div>
                    )}

                    <div className="text-gray-400 text-sm mb-3">
                      Hosted by <span className="text-cyan-400">{experience.host}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-white font-medium">{experience.participants}</span>
                      <span className="text-gray-400">/{experience.maxParticipants}</span>
                    </div>
                    <div className="w-16 h-1 bg-gray-700 rounded-full mt-1">
                      <div 
                        className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                        style={{ width: `${(experience.participants / experience.maxParticipants) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-white font-medium text-sm mb-2">Experience Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {experience.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full text-xs text-blue-400 border border-blue-400/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Equipment Required */}
                <div className="mb-4">
                  <h4 className="text-white font-medium text-sm mb-2">Equipment Needed:</h4>
                  <div className="flex flex-wrap gap-1">
                    {experience.equipment.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Join Button */}
                <button
                  className={`w-full px-4 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    experience.status === 'live'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : experience.status === 'starting-soon'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {experience.type.includes('vr') ? <VrHeadset className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  <span>
                    {experience.status === 'live' ? 'Join Live Experience' :
                     experience.status === 'starting-soon' ? 'Get Ready to Join' :
                     'Join Before It Ends'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* Create AR Tag */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-6 border border-purple-400/30">
            <div className="text-center mb-4">
              <Eye className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Create AR Tag</h2>
              <p className="text-gray-400 text-sm">Leave an augmented reality message for future travelers</p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Plus className="h-6 w-6" />
              <span>Create AR Tag</span>
            </button>
          </div>

          {/* Create VR Experience */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-6 border border-cyan-400/30">
            <div className="text-center mb-4">
              <VrHeadset className="h-12 w-12 text-cyan-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Create VR Experience</h2>
              <p className="text-gray-400 text-sm">Design immersive virtual reality experiences for the community</p>
            </div>
            
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <Camera className="h-6 w-6" />
              <span>Create VR Experience</span>
            </button>
          </div>

          {/* Start Live Session */}
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-3xl p-6 border border-red-400/30">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                <span className="text-red-400 font-bold text-lg">LIVE SESSION</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Start Live AR/VR Session</h2>
              <p className="text-gray-400 text-sm">Host real-time experiences for the global nomad community</p>
            </div>
            
            <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <Play className="h-6 w-6" />
              <span>Go Live Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Create AR Tag Modal */}
      {showCreateModal && (
        <CreateARTagModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* VR Experience Detail Modal */}
      {selectedExperience && (
        <VRExperienceModal
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}
    </div>
  );
}

function CreateARTagModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'tip',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating AR tag:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Create AR Tag</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="What's this about?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="tip">Travel Tip</option>
                <option value="secret">Secret Spot</option>
                <option value="warning">Warning</option>
                <option value="review">Review</option>
                <option value="fun">Fun Fact</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                rows={3}
                placeholder="Share your knowledge..."
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
                placeholder="Where is this?"
                required
              />
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
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Tag
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function VRExperienceModal({ 
  experience, 
  onClose 
}: { 
  experience: VRExperience; 
  onClose: () => void;
}) {
  const EquipmentIcon = experience.equipment === 'mobile' ? Smartphone : 
                       experience.equipment === 'headset' ? VrHeadset : Monitor;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{experience.title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <img
              src={experience.previewImage}
              alt={experience.title}
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Description</h3>
              <p className="text-gray-300 text-sm">{experience.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-medium mb-2">Location</h3>
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{experience.location}</span>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Duration</h3>
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{experience.duration} minutes</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Equipment Required</h3>
              <div className="flex items-center space-x-2">
                <EquipmentIcon className="h-5 w-5 text-cyan-400" />
                <span className="text-cyan-400 text-sm capitalize">{experience.equipment}</span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Experience Tags</h3>
              <div className="flex flex-wrap gap-2">
                {experience.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm">{experience.rating}</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-400">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{experience.participants}</span>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                experience.price === 'free' 
                  ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                  : 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
              }`}>
                {experience.price}
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
              <VrHeadset className="h-6 w-6" />
              <span>Enter VR Experience</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ARWorldPage;