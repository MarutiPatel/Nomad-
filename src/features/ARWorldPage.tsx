import React, { useState, useEffect } from 'react';
import { 
  Camera, MapPin, Eye, MessageCircle, Star, Plus, Filter, Search, Layers, Zap, Heart, Users, Globe, Clock, Navigation, Share, Bookmark, Mountain as Mountains, Building, Landmark, Crown, Pyramid, Radio, Video, Mic, Volume2, Play, Pause, RotateCcw, Maximize, Globe as Earth, Wifi, Languages, CloudSnow, Sun, CloudRain, Wind, Navigation2, UserCheck
} from 'lucide-react';

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

interface WorldWonder {
  id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  arExperience: string;
  image: string;
  type: 'ancient' | 'modern' | 'natural' | 'architectural';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  rating: number;
  totalExperiences: number;
  isBookmarked: boolean;
  facts: string[];
}

interface LiveARExperience {
  id: string;
  title: string;
  type: 'live-tour' | 'ar-stream' | 'collaborative' | 'translation' | 'weather' | 'traffic' | 'events';
  description: string;
  location: string;
  host?: string;
  participants: number;
  maxParticipants?: number;
  startTime: Date;
  duration: string;
  isLive: boolean;
  isJoined: boolean;
  category: 'guided-tour' | 'social' | 'utility' | 'educational' | 'entertainment';
  features: string[];
  image: string;
  status: 'starting-soon' | 'live-now' | 'ending-soon' | 'ended';
}

function ARWorldPage() {
  const [activeTab, setActiveTab] = useState<'ar-tags' | 'wonders' | 'live-ar'>('ar-tags');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWonder, setSelectedWonder] = useState<WorldWonder | null>(null);
  const [selectedLiveExperience, setSelectedLiveExperience] = useState<LiveARExperience | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for live experiences
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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
      title: 'Ancient Temple AR Experience',
      content: 'Point your camera at the temple ruins to see how it looked 1000 years ago! Mind-blowing historical reconstruction.',
      type: 'fun',
      location: 'Hampi Ruins',
      coordinates: { lat: 15.3350, lng: 76.4600 },
      distance: 3.2,
      author: 'HistoryBuff',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 89,
      views: 445,
      isLiked: false,
      isBookmarked: true
    }
  ];

  const mockWorldWonders: WorldWonder[] = [
    {
      id: '1',
      name: 'Taj Mahal',
      location: 'Agra, Uttar Pradesh',
      country: 'India',
      description: 'Experience the Taj Mahal like never before with AR restoration of its original gardens and chambers.',
      arExperience: 'See the original blue dome, walk through virtual Mughal gardens, and witness the monument at different times of day',
      image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'architectural',
      difficulty: 'easy',
      duration: '30-45 minutes',
      rating: 4.9,
      totalExperiences: 15420,
      isBookmarked: false,
      facts: [
        'Built between 1632-1653 by Emperor Shah Jahan',
        'Made with white marble that changes color throughout the day',
        'Took 22 years and 20,000 workers to complete',
        'UNESCO World Heritage Site since 1983'
      ]
    },
    {
      id: '2',
      name: 'Machu Picchu',
      location: 'Cusco Region',
      country: 'Peru',
      description: 'Explore the lost city of the Incas with AR reconstruction showing how the ancient civilization lived.',
      arExperience: 'Walk through virtual Inca buildings, see ancient ceremonies, and discover hidden passages',
      image: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'ancient',
      difficulty: 'medium',
      duration: '60-90 minutes',
      rating: 4.8,
      totalExperiences: 12380,
      isBookmarked: true,
      facts: [
        'Built around 1450 CE by the Inca civilization',
        'Abandoned during Spanish conquest in 1572',
        'Rediscovered by Hiram Bingham in 1911',
        'Located 2,430 meters above sea level'
      ]
    }
  ];

  const mockLiveARExperiences: LiveARExperience[] = [
    {
      id: '1',
      title: 'Live Guided Tour: Taj Mahal Sunset',
      type: 'live-tour',
      description: 'Join our expert guide for a live AR tour of Taj Mahal during golden hour. See historical reconstructions and hidden details.',
      location: 'Taj Mahal, Agra',
      host: 'HistoryMaster_AR',
      participants: 24,
      maxParticipants: 30,
      startTime: new Date(Date.now() + 15 * 60 * 1000), // Starting in 15 minutes
      duration: '45 minutes',
      isLive: false,
      isJoined: false,
      category: 'guided-tour',
      features: ['Live commentary', 'Historical overlays', 'Q&A session', 'Photo opportunities'],
      image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'starting-soon'
    },
    {
      id: '2',
      title: 'Real-time Weather AR Overlay',
      type: 'weather',
      description: 'See live weather patterns, wind directions, and upcoming changes through AR visualization.',
      location: 'Your current location',
      participants: 156,
      startTime: new Date(),
      duration: 'Always available',
      isLive: true,
      isJoined: true,
      category: 'utility',
      features: ['Live weather data', 'Wind visualization', '24h forecast', 'Rain radar'],
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'live-now'
    },
    {
      id: '3',
      title: 'Collaborative Street Art Creation',
      type: 'collaborative',
      description: 'Join other travelers to create virtual street art that others can see through AR at this location.',
      location: 'Mumbai Street Art District',
      participants: 8,
      maxParticipants: 12,
      startTime: new Date(Date.now() - 10 * 60 * 1000), // Started 10 minutes ago
      duration: '60 minutes',
      isLive: true,
      isJoined: false,
      category: 'social',
      features: ['Collaborative drawing', 'Real-time sharing', 'Save creations', 'Vote on best art'],
      image: 'https://images.pexels.com/photos/1686536/pexels-photo-1686536.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'live-now'
    },
    {
      id: '4',
      title: 'Live AR Translation Hub',
      type: 'translation',
      description: 'Real-time AR translation of signs, menus, and conversations. Point camera and see instant translations.',
      location: 'Delhi Local Markets',
      participants: 89,
      startTime: new Date(),
      duration: 'Always available',
      isLive: true,
      isJoined: false,
      category: 'utility',
      features: ['Text recognition', 'Voice translation', 'Menu scanning', 'Conversation mode'],
      image: 'https://images.pexels.com/photos/1608113/pexels-photo-1608113.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'live-now'
    },
    {
      id: '5',
      title: 'Live Stream: Ganga Aarti Ceremony',
      type: 'ar-stream',
      description: 'Experience the sacred Ganga Aarti ceremony live with AR enhancements showing spiritual significance.',
      location: 'Varanasi Ghats',
      host: 'SpiritualGuide_VNS',
      participants: 145,
      maxParticipants: 200,
      startTime: new Date(Date.now() - 5 * 60 * 1000), // Started 5 minutes ago
      duration: '30 minutes',
      isLive: true,
      isJoined: true,
      category: 'educational',
      features: ['Live ceremony stream', 'Spiritual overlays', 'Cultural explanations', 'Interactive elements'],
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'live-now'
    },
    {
      id: '6',
      title: 'Real-time Traffic & Navigation AR',
      type: 'traffic',
      description: 'See live traffic conditions, best routes, and navigation directions overlaid on your real-world view.',
      location: 'Bangalore City Center',
      participants: 203,
      startTime: new Date(),
      duration: 'Always available',
      isLive: true,
      isJoined: false,
      category: 'utility',
      features: ['Live traffic data', 'Route optimization', 'Hazard alerts', 'Parking availability'],
      image: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'live-now'
    }
  ];

  const [arTags, setArTags] = useState(mockARTags);
  const [worldWonders, setWorldWonders] = useState(mockWorldWonders);
  const [liveExperiences, setLiveExperiences] = useState(mockLiveARExperiences);

  const tagFilters = [
    { id: 'all', label: 'All', icon: Eye },
    { id: 'secret', label: 'Secrets', icon: Star },
    { id: 'tip', label: 'Tips', icon: MessageCircle },
    { id: 'warning', label: 'Warnings', icon: Zap },
    { id: 'fun', label: 'AR Fun', icon: Camera }
  ];

  const wonderFilters = [
    { id: 'all', label: 'All', icon: Globe },
    { id: 'ancient', label: 'Ancient', icon: Pyramid },
    { id: 'modern', label: 'Modern', icon: Building },
    { id: 'natural', label: 'Natural', icon: Mountains },
    { id: 'architectural', label: 'Architecture', icon: Landmark }
  ];

  const liveFilters = [
    { id: 'all', label: 'All', icon: Radio },
    { id: 'live-tour', label: 'Live Tours', icon: Users },
    { id: 'ar-stream', label: 'AR Streams', icon: Video },
    { id: 'collaborative', label: 'Collaborative', icon: Heart },
    { id: 'translation', label: 'Translation', icon: Languages },
    { id: 'weather', label: 'Weather', icon: CloudSnow },
    { id: 'traffic', label: 'Traffic', icon: Navigation2 }
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

  const handleWonderBookmark = (id: string) => {
    setWorldWonders(prev => prev.map(wonder => 
      wonder.id === id 
        ? { ...wonder, isBookmarked: !wonder.isBookmarked }
        : wonder
    ));
  };

  const handleJoinLiveExperience = (id: string) => {
    setLiveExperiences(prev => prev.map(exp => 
      exp.id === id 
        ? { 
            ...exp, 
            isJoined: !exp.isJoined,
            participants: exp.isJoined ? exp.participants - 1 : exp.participants + 1
          }
        : exp
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

  const getWonderTypeColor = (type: string) => {
    switch (type) {
      case 'ancient': return 'from-orange-400 to-red-500';
      case 'modern': return 'from-blue-400 to-cyan-500';
      case 'natural': return 'from-green-400 to-teal-500';
      case 'architectural': return 'from-purple-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getLiveTypeColor = (type: string) => {
    switch (type) {
      case 'live-tour': return 'from-blue-400 to-cyan-500';
      case 'ar-stream': return 'from-purple-400 to-pink-500';
      case 'collaborative': return 'from-green-400 to-teal-500';
      case 'translation': return 'from-yellow-400 to-orange-500';
      case 'weather': return 'from-cyan-400 to-blue-500';
      case 'traffic': return 'from-red-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live-now': return 'from-red-400 to-red-500';
      case 'starting-soon': return 'from-yellow-400 to-orange-500';
      case 'ending-soon': return 'from-orange-400 to-red-500';
      case 'ended': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live-now': return 'LIVE NOW';
      case 'starting-soon': return 'STARTING SOON';
      case 'ending-soon': return 'ENDING SOON';
      case 'ended': return 'ENDED';
      default: return status.toUpperCase();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const formatTimeUntilStart = (startTime: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((startTime.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes <= 0) return 'Starting now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ${diffInMinutes % 60}m`;
  };

  const filteredTags = selectedFilter === 'all' 
    ? arTags 
    : arTags.filter(tag => tag.type === selectedFilter);

  const filteredWonders = activeTab === 'wonders' 
    ? (selectedFilter === 'all' ? worldWonders : worldWonders.filter(wonder => wonder.type === selectedFilter))
    : [];

  const filteredLiveExperiences = activeTab === 'live-ar'
    ? (selectedFilter === 'all' ? liveExperiences : liveExperiences.filter(exp => exp.type === selectedFilter))
    : [];

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">AR World</h1>
        <p className="text-gray-400 text-sm">Experience real-time AR, explore world wonders, and discover hidden messages</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-2xl bg-black/20 p-1 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ar-tags')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'ar-tags'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">AR Tags</span>
        </button>
        <button
          onClick={() => setActiveTab('wonders')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'wonders'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">World Wonders</span>
        </button>
        <button
          onClick={() => setActiveTab('live-ar')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'live-ar'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Radio className="h-4 w-4" />
          <span className="text-sm font-medium">Live AR</span>
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'ar-tags' && (
        <div>
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
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
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">Create AR Tag</span>
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
              const IconComponent = getTypeIcon(tag.type);
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
                            {tag.type === 'fun' && <Camera className="h-3 w-3 text-white" />}
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

      {activeTab === 'wonders' && (
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

          {/* Wonder Filters */}
          <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
            {wonderFilters.map((filter) => (
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

          {/* World Wonders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWonders.map((wonder) => (
              <div
                key={wonder.id}
                className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                {/* Wonder Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={wonder.image}
                    alt={wonder.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getWonderTypeColor(wonder.type)} bg-opacity-90 backdrop-blur-sm`}>
                      <span className="text-xs font-medium text-white capitalize">{wonder.type}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleWonderBookmark(wonder.id)}
                      className={`p-2 rounded-full bg-black/50 backdrop-blur-sm transition-colors ${
                        wonder.isBookmarked ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${wonder.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className={`text-xs font-medium ${getDifficultyColor(wonder.difficulty)}`}>
                        {wonder.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wonder Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{wonder.name}</h3>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{wonder.location}, {wonder.country}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 text-sm font-medium">{wonder.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">{wonder.description}</p>

                  {/* AR Experience */}
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-3 mb-3 border border-cyan-400/30">
                    <div className="flex items-center space-x-2 mb-1">
                      <Camera className="h-4 w-4 text-cyan-400" />
                      <span className="text-cyan-400 text-sm font-medium">AR Experience</span>
                    </div>
                    <p className="text-cyan-300 text-xs leading-relaxed">{wonder.arExperience}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{wonder.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{wonder.totalExperiences.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedWonder(wonder)}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 rounded-2xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm"
                    >
                      Explore in AR
                    </button>
                    
                    <button className="px-4 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
                      <Navigation className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'live-ar' && (
        <div>
          {/* Live Status Header */}
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-4 border border-red-400/30 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
              <span className="text-red-400 font-medium text-sm">Live AR Experiences</span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-400 text-xs">{liveExperiences.filter(exp => exp.isLive).length} live now</span>
            </div>
            <p className="text-gray-300 text-xs">Join real-time AR experiences happening around the world</p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 mb-6">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Search className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Filter className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Live AR Filters */}
          <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
            {liveFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                }`}
              >
                <filter.icon className="h-4 w-4" />
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Live AR Experiences */}
          <div className="space-y-4">
            {filteredLiveExperiences.map((experience) => (
              <div
                key={experience.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                {/* Experience Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(experience.status)} bg-opacity-90 backdrop-blur-sm flex items-center space-x-1`}>
                      {experience.status === 'live-now' && <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>}
                      <span className="text-xs font-bold text-white">{getStatusText(experience.status)}</span>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-3 right-3">
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getLiveTypeColor(experience.type)} bg-opacity-90 backdrop-blur-sm`}>
                      <span className="text-xs font-medium text-white capitalize">{experience.type.replace('-', ' ')}</span>
                    </div>
                  </div>

                  {/* Participants Count */}
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                      <Users className="h-3 w-3 text-white" />
                      <span className="text-white text-xs">{experience.participants}</span>
                      {experience.maxParticipants && (
                        <span className="text-gray-300 text-xs">/{experience.maxParticipants}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Experience Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{experience.title}</h3>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{experience.location}</span>
                        {experience.host && (
                          <>
                            <span>•</span>
                            <span>by {experience.host}</span>
                          </>
                        )}
                      </div>
                      {!experience.isLive && (
                        <div className="flex items-center space-x-1 text-orange-400 text-sm">
                          <Clock className="h-3 w-3" />
                          <span>Starts in {formatTimeUntilStart(experience.startTime)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">{experience.description}</p>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {experience.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getLiveTypeColor(experience.type)} bg-opacity-20 text-white border border-white/10`}
                        >
                          {feature}
                        </span>
                      ))}
                      {experience.features.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                          +{experience.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{experience.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <UserCheck className="h-3 w-3" />
                        <span>{experience.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    {experience.isLive ? (
                      <button
                        onClick={() => handleJoinLiveExperience(experience.id)}
                        className={`flex-1 px-4 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm flex items-center justify-center space-x-2 ${
                          experience.isJoined
                            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-400'
                            : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                        }`}
                      >
                        {experience.type === 'ar-stream' && <Video className="h-4 w-4" />}
                        {experience.type === 'live-tour' && <Users className="h-4 w-4" />}
                        {experience.type === 'collaborative' && <Heart className="h-4 w-4" />}
                        {(experience.type === 'translation' || experience.type === 'weather' || experience.type === 'traffic') && <Wifi className="h-4 w-4" />}
                        <span>{experience.isJoined ? 'Joined' : 'Join Live'}</span>
                      </button>
                    ) : (
                      <button className="flex-1 px-4 py-3 rounded-2xl font-medium text-gray-400 border border-gray-600 text-sm cursor-not-allowed">
                        Starts {formatTimeUntilStart(experience.startTime)}
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedLiveExperience(experience)}
                      className="px-4 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create AR Tag Modal */}
      {showCreateModal && (
        <CreateARTagModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* World Wonder Detail Modal */}
      {selectedWonder && (
        <WonderDetailModal
          wonder={selectedWonder}
          onClose={() => setSelectedWonder(null)}
        />
      )}

      {/* Live Experience Detail Modal */}
      {selectedLiveExperience && (
        <LiveExperienceModal
          experience={selectedLiveExperience}
          onClose={() => setSelectedLiveExperience(null)}
          onJoin={() => handleJoinLiveExperience(selectedLiveExperience.id)}
        />
      )}
    </div>
  );
}

// Helper function to get type icon
function getTypeIcon(type: string) {
  switch (type) {
    case 'secret': return Star;
    case 'tip': return MessageCircle;
    case 'warning': return Zap;
    case 'review': return Star;
    case 'fun': return Camera;
    default: return Eye;
  }
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
                <option value="fun">AR Fun Experience</option>
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

function WonderDetailModal({ 
  wonder, 
  onClose 
}: { 
  wonder: any; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{wonder.name}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <img
              src={wonder.image}
              alt={wonder.name}
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Location</h3>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{wonder.location}, {wonder.country}</span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">AR Experience</h3>
              <p className="text-cyan-300 text-sm leading-relaxed">{wonder.arExperience}</p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Historical Facts</h3>
              <div className="space-y-2">
                {wonder.facts.map((fact: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2 text-gray-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-medium mb-2">Duration</h3>
                <p className="text-gray-300 text-sm">{wonder.duration}</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Difficulty</h3>
                <p className="text-gray-300 text-sm capitalize">{wonder.difficulty}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Start AR Experience</span>
              </button>
              
              <button className="px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
                <Share className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveExperienceModal({ 
  experience, 
  onClose,
  onJoin
}: { 
  experience: LiveARExperience; 
  onClose: () => void;
  onJoin: () => void;
}) {
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
              src={experience.image}
              alt={experience.title}
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Description</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{experience.description}</p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Location</h3>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{experience.location}</span>
              </div>
            </div>

            {experience.host && (
              <div>
                <h3 className="text-white font-medium mb-2">Host</h3>
                <p className="text-gray-300 text-sm">{experience.host}</p>
              </div>
            )}

            <div>
              <h3 className="text-white font-medium mb-2">Features</h3>
              <div className="space-y-2">
                {experience.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-medium mb-2">Duration</h3>
                <p className="text-gray-300 text-sm">{experience.duration}</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Participants</h3>
                <p className="text-gray-300 text-sm">
                  {experience.participants}
                  {experience.maxParticipants && `/${experience.maxParticipants}`}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              {experience.isLive ? (
                <button
                  onClick={onJoin}
                  className={`flex-1 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                    experience.isJoined
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-400'
                      : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  }`}
                >
                  <Radio className="h-5 w-5" />
                  <span>{experience.isJoined ? 'Joined Live' : 'Join Live Experience'}</span>
                </button>
              ) : (
                <button className="flex-1 px-6 py-3 rounded-2xl font-semibold text-gray-400 border border-gray-600 cursor-not-allowed">
                  Experience Not Live
                </button>
              )}
              
              <button className="px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
                <Share className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ARWorldPage;