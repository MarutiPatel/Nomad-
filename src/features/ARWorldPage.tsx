import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Eye, MessageCircle, Star, Plus, Filter, Search, Layers, Zap, Gift, Heart, Users, Clock, Navigation, Share, Bookmark, Headphones, Headset as VrHeadset, Globe, Mountain, Plane, Gamepad2, Monitor, Smartphone, Wifi, Play, Volume2, Calendar, Trophy, Target, Compass, Map, Wand2, Sparkles, Bot, Cpu, TreePine, Coins, Award, TrendingUp, Mic, Video, Image, Send, Settings, CheckCircle, AlertTriangle, Telescope, Atom, Lightbulb, Rocket, Brain } from 'lucide-react';

interface ARTag {
  id: string;
  title: string;
  content: string;
  type: 'tip' | 'review' | 'warning' | 'fun' | 'secret' | 'historic' | 'food' | 'event';
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
  language: string;
  verified: boolean;
  category: 'travel' | 'food' | 'culture' | 'nature' | 'tech' | 'art';
}

interface VRExperience {
  id: string;
  title: string;
  description: string;
  type: 'tour' | 'adventure' | 'cultural' | 'educational' | 'entertainment' | 'meditation' | 'historical' | 'futuristic';
  location: string;
  duration: number; // in minutes
  rating: number;
  participants: number;
  maxParticipants: number;
  isLive: boolean;
  previewImage: string;
  equipment: 'mobile' | 'headset' | 'computer' | 'hologram' | 'neural' | 'ar-contact';
  price: 'free' | 'premium';
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  language: string[];
  creator: string;
  ageRating: string;
  features: string[];
}

interface LiveExperience {
  id: string;
  title: string;
  description: string;
  type: 'ar-tour' | 'vr-experience' | 'mixed-reality' | 'virtual-meetup' | 'holographic-event' | 'neural-link' | 'time-travel' | 'space-exploration';
  participants: number;
  maxParticipants: number;
  status: 'live' | 'starting-soon' | 'ending-soon';
  timeRemaining?: number; // minutes
  host: string;
  features: string[];
  location?: string;
  equipment: string[];
  language: string;
  category: 'social' | 'educational' | 'entertainment' | 'adventure' | 'spiritual' | 'scientific';
}

function ARWorldPage() {
  const [activeTab, setActiveTab] = useState<'ar-tags' | 'vr-experiences' | 'live-experiences' | 'create'>('ar-tags');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<VRExperience | null>(null);
  const [selectedTag, setSelectedTag] = useState<ARTag | null>(null);
  const [createType, setCreateType] = useState<'ar-tag' | 'vr-experience' | 'live-session'>('ar-tag');

  const mockARTags: ARTag[] = [
    // USA AR Tags
    {
      id: '1',
      title: 'Hidden Speakeasy Entrance',
      content: 'Look for the red door behind the bookshelf! Password is "Manhattan". Best craft cocktails in NYC with 1920s atmosphere.',
      type: 'secret',
      location: 'East Village, New York',
      coordinates: { lat: 40.7282, lng: -73.9942 },
      distance: 0.2,
      author: 'NYCNightOwl',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 89,
      views: 456,
      isLiked: false,
      isBookmarked: true,
      language: 'English',
      verified: true,
      category: 'culture'
    },
    {
      id: '2',
      title: 'Best Sunset Spot - Golden Gate',
      content: 'This exact spot gives you the perfect frame of Golden Gate Bridge at sunset! Arrive 30 minutes early. Pro tip: bring a jacket!',
      type: 'tip',
      location: 'Crissy Field, San Francisco',
      coordinates: { lat: 37.8024, lng: -122.4662 },
      distance: 1.1,
      author: 'SFPhotographer',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 234,
      views: 1247,
      isLiked: true,
      isBookmarked: false,
      mediaUrl: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=400',
      language: 'English',
      verified: true,
      category: 'nature'
    },

    // European AR Tags
    {
      id: '3',
      title: 'Secret Mozart Performance Spot',
      content: 'Every Thursday at 7 PM, local musicians perform Mozart here. It\'s not official but magical! Locals keep this tradition alive.',
      type: 'event',
      location: 'Mirabell Gardens, Salzburg',
      coordinates: { lat: 47.8055, lng: 13.0416 },
      distance: 0.8,
      author: 'MozartFan88',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likes: 156,
      views: 892,
      isLiked: false,
      isBookmarked: true,
      language: 'English',
      verified: true,
      category: 'culture'
    },
    {
      id: '4',
      title: 'Best Croissant in Paris (Hidden)',
      content: 'Tiny bakery behind Notre Dame. No signs, just follow the smell! Open 6-10 AM only. Worth the early wake-up!',
      type: 'food',
      location: 'Latin Quarter, Paris',
      coordinates: { lat: 48.8534, lng: 2.3488 },
      distance: 0.3,
      author: 'ParisianFoodie',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 378,
      views: 2156,
      isLiked: true,
      isBookmarked: true,
      language: 'French',
      verified: true,
      category: 'food'
    },

    // Indian AR Tags
    {
      id: '5',
      title: 'Ancient Temple Secret Entrance',
      content: 'Behind the main temple, there\'s a 1000-year-old carved entrance. Locals say prayers here are always answered. Respect the sacred space.',
      type: 'historic',
      location: 'Khajuraho, Madhya Pradesh',
      coordinates: { lat: 24.8318, lng: 79.9199 },
      distance: 2.1,
      author: 'TempleExplorer',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      likes: 445,
      views: 1789,
      isLiked: false,
      isBookmarked: false,
      language: 'Hindi',
      verified: true,
      category: 'culture'
    },
    {
      id: '6',
      title: 'Best Street Food Warning!',
      content: 'Amazing pani puri here BUT avoid after 4 PM - water quality issues. Morning is perfect! ₹10 for 6 pieces.',
      type: 'warning',
      location: 'Chandni Chowk, Delhi',
      coordinates: { lat: 28.6506, lng: 77.2334 },
      distance: 1.5,
      author: 'DelhiFoodie123',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      likes: 289,
      views: 1456,
      isLiked: true,
      isBookmarked: true,
      language: 'Hindi',
      verified: true,
      category: 'food'
    }
  ];

  const mockVRExperiences: VRExperience[] = [
    // Futuristic & International VR Experiences
    {
      id: '1',
      title: 'Neural Link: Future Tokyo 2050',
      description: 'Experience Tokyo 50 years in the future through advanced neural interface. Flying cars, holographic ads, and AI companions guide your journey.',
      type: 'futuristic',
      location: 'Tokyo, Japan (Future)',
      duration: 120,
      rating: 4.9,
      participants: 2847,
      maxParticipants: 5000,
      isLive: true,
      previewImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
      equipment: 'neural',
      price: 'premium',
      tags: ['cyberpunk', 'future', 'ai', 'technology'],
      difficulty: 'hard',
      language: ['English', 'Japanese', 'Mandarin'],
      creator: 'FutureTech Studios',
      ageRating: '13+',
      features: ['Neural feedback', 'AI interaction', 'Time manipulation', 'Holographic UI']
    },
    {
      id: '2',
      title: 'Holographic Louvre Tour',
      description: 'Walk through the Louvre with holographic guides. See Mona Lisa\'s secrets revealed and step inside famous paintings using quantum visualization.',
      type: 'cultural',
      location: 'Louvre Museum, Paris',
      duration: 90,
      rating: 4.8,
      participants: 1456,
      maxParticipants: 2000,
      isLive: true,
      previewImage: 'https://images.pexels.com/photos/2736499/pexels-photo-2736499.jpeg?auto=compress&cs=tinysrgb&w=400',
      equipment: 'hologram',
      price: 'premium',
      tags: ['art', 'culture', 'history', 'hologram'],
      difficulty: 'easy',
      language: ['French', 'English', 'Spanish'],
      creator: 'Museum Innovations',
      ageRating: 'All Ages',
      features: ['3D art interaction', 'Historical AI guides', 'Quantum painting entry', 'Multi-language support']
    },
    {
      id: '3',
      title: 'Time Travel: Ancient Rome',
      description: 'Step into 100 AD Rome with AI-reconstructed environments. Meet historical figures, witness gladiator fights, and explore lost architecture.',
      type: 'historical',
      location: 'Colosseum, Rome',
      duration: 150,
      rating: 4.9,
      participants: 3245,
      maxParticipants: 4000,
      isLive: false,
      previewImage: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400',
      equipment: 'headset',
      price: 'premium',
      tags: ['history', 'rome', 'ancient', 'time-travel'],
      difficulty: 'medium',
      language: ['Latin', 'English', 'Italian'],
      creator: 'TimeTravel VR',
      ageRating: '16+',
      features: ['Historical AI characters', 'Time period accuracy', 'Interactive gladiator arena', 'Ancient Roman language']
    },
    {
      id: '4',
      title: 'Himalayan Meditation 8000m',
      description: 'Meditate at Everest Base Camp through VR. Real mountain sounds, breathing exercises, and monk guidance from actual Tibetan masters.',
      type: 'meditation',
      location: 'Mount Everest, Nepal',
      duration: 60,
      rating: 4.7,
      participants: 892,
      maxParticipants: 1500,
      isLive: true,
      previewImage: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      equipment: 'headset',
      price: 'free',
      tags: ['meditation', 'mountains', 'spiritual', 'nepal'],
      difficulty: 'easy',
      language: ['Tibetan', 'English', 'Hindi'],
      creator: 'Himalayan Meditation Center',
      ageRating: 'All Ages',
      features: ['Real monk guidance', 'Breathing biofeedback', 'Mountain soundscapes', 'Chakra visualization']
    },
    {
      id: '5',
      title: 'Space Station Alpha Tour',
      description: 'Tour the International Space Station with real astronauts. Experience zero gravity, conduct experiments, and see Earth from space.',
      type: 'educational',
      location: 'International Space Station',
      duration: 180,
      rating: 5.0,
      participants: 5678,
      maxParticipants: 10000,
      isLive: false,
      previewImage: 'https://images.pexels.com/photos/586030/pexels-photo-586030.jpeg?auto=compress&cs=tinysrgb&w=400',
      equipment: 'headset',
      price: 'premium',
      tags: ['space', 'science', 'astronauts', 'education'],
      difficulty: 'medium',
      language: ['English', 'Russian', 'Japanese'],
      creator: 'NASA VR Division',
      ageRating: '10+',
      features: ['Real astronaut guides', 'Zero gravity simulation', 'Scientific experiments', 'Earth observation']
    },
    {
      id: '6',
      title: 'AR Contact Lens: NYC Ghost Tour',
      description: 'Use AR contact lenses to see ghostly apparitions in haunted NYC locations. Historical overlays show the city\'s dark past.',
      type: 'entertainment',
      location: 'Manhattan, New York',
      duration: 120,
      rating: 4.6,
      participants: 1234,
      maxParticipants: 2000,
      isLive: true,
      previewImage: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
      equipment: 'ar-contact',
      price: 'premium',
      tags: ['ghosts', 'history', 'horror', 'ar-contacts'],
      difficulty: 'medium',
      language: ['English'],
      creator: 'Paranormal VR',
      ageRating: '18+',
      features: ['AR contact lenses', 'Ghost detection', 'Historical overlays', 'Real-time scares']
    }
  ];

  const mockLiveExperiences: LiveExperience[] = [
    {
      id: '1',
      title: 'Neural Link Global Meetup',
      description: 'Connect minds with travelers worldwide through advanced neural interface. Share experiences, emotions, and memories in real-time.',
      type: 'neural-link',
      participants: 2847,
      maxParticipants: 5000,
      status: 'live',
      host: 'NeuroConnect Global',
      features: ['Mind-to-mind communication', 'Shared memory experiences', 'Emotion transfer', 'Global consciousness'],
      equipment: ['Neural headset', 'Brain-computer interface', 'Meditation cushion'],
      language: 'Universal (neural)',
      category: 'scientific'
    },
    {
      id: '2',
      title: 'Holographic Fashion Show: Milan',
      description: 'Attend Milan Fashion Week as a hologram. Interact with models, designers, and other attendees in real-time holographic projection.',
      type: 'holographic-event',
      participants: 1567,
      maxParticipants: 2500,
      status: 'live',
      host: 'Milano Fashion AR',
      features: ['Holographic projection', 'Real-time interaction', 'Designer meet-and-greet', 'Virtual front row'],
      equipment: ['Hologram projector', 'Motion capture suit', 'High-speed internet'],
      language: 'Italian',
      category: 'entertainment'
    },
    {
      id: '3',
      title: 'Time Travel: Witness Moon Landing',
      description: 'Experience the Apollo 11 moon landing as if you were there. Advanced time-travel VR with NASA historical accuracy.',
      type: 'time-travel',
      participants: 3456,
      maxParticipants: 5000,
      status: 'starting-soon',
      timeRemaining: 15,
      host: 'NASA Historical VR',
      features: ['Historical accuracy', 'Astronaut perspective', 'Mission control access', 'Zero gravity feeling'],
      equipment: ['VR headset', 'Haptic suit', 'Motion platform'],
      language: 'English',
      category: 'educational'
    },
    {
      id: '4',
      title: 'Mars Colony Simulation',
      description: 'Join the first Mars colony simulation. Work with other colonists to build humanity\'s future on the Red Planet.',
      type: 'space-exploration',
      participants: 892,
      maxParticipants: 1000,
      status: 'live',
      host: 'Mars Simulation Project',
      features: ['Real Mars data', 'Colony building', 'Resource management', 'Scientific research'],
      equipment: ['VR headset', 'Hand controllers', 'Environmental suit simulation'],
      language: 'English',
      category: 'scientific'
    },
    {
      id: '5',
      title: 'Live AR Street Art Creation',
      description: 'Create and view street art in real-time AR. Artists worldwide paint virtual murals on real walls that only AR users can see.',
      type: 'ar-tour',
      participants: 678,
      maxParticipants: 1200,
      status: 'live',
      host: 'Global AR Artists',
      features: ['Real-time art creation', 'Persistent AR murals', 'Artist collaboration', 'Location-based viewing'],
      location: 'Worldwide AR Canvas',
      equipment: ['Smartphone', 'AR app', 'Digital paintbrush'],
      language: 'Multilingual',
      category: 'entertainment'
    },
    {
      id: '6',
      title: 'Quantum Physics Lab Experience',
      description: 'Conduct real quantum physics experiments in a virtual lab. Manipulate particles, observe quantum entanglement, and break reality.',
      type: 'mixed-reality',
      participants: 234,
      maxParticipants: 500,
      status: 'ending-soon',
      timeRemaining: 25,
      host: 'Quantum Education Institute',
      features: ['Real physics simulation', 'Particle manipulation', 'Quantum experiments', 'Scientific discovery'],
      equipment: ['VR headset', 'Haptic gloves', 'Quantum simulator'],
      language: 'English',
      category: 'educational'
    }
  ];

  const [arTags, setArTags] = useState(mockARTags);
  const [vrExperiences] = useState(mockVRExperiences);
  const [liveExperiences] = useState(mockLiveExperiences);

  const tagFilters = [
    { id: 'all', label: 'All', icon: Eye },
    { id: 'secret', label: 'Secrets', icon: Star },
    { id: 'tip', label: 'Tips', icon: MessageCircle },
    { id: 'food', label: 'Food', icon: Utensils },
    { id: 'historic', label: 'Historic', icon: Clock },
    { id: 'event', label: 'Events', icon: Calendar }
  ];

  const vrFilters = [
    { id: 'all', label: 'All VR', icon: VrHeadset },
    { id: 'futuristic', label: 'Future', icon: Rocket },
    { id: 'cultural', label: 'Cultural', icon: Star },
    { id: 'historical', label: 'Time Travel', icon: Clock },
    { id: 'meditation', label: 'Meditation', icon: Heart },
    { id: 'educational', label: 'Learning', icon: Brain }
  ];

  const liveFilters = [
    { id: 'all', label: 'All Live', icon: Zap },
    { id: 'neural-link', label: 'Neural', icon: Brain },
    { id: 'holographic-event', label: 'Hologram', icon: Sparkles },
    { id: 'time-travel', label: 'Time Travel', icon: Clock },
    { id: 'space-exploration', label: 'Space', icon: Rocket }
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
      case 'food': return 'from-orange-400 to-red-500';
      case 'historic': return 'from-yellow-400 to-orange-500';
      case 'event': return 'from-green-400 to-teal-500';
      case 'review': return 'from-green-400 to-teal-500';
      case 'fun': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getVRTypeColor = (type: string) => {
    switch (type) {
      case 'futuristic': return 'from-purple-400 to-pink-500';
      case 'cultural': return 'from-blue-400 to-cyan-500';
      case 'historical': return 'from-yellow-400 to-orange-500';
      case 'meditation': return 'from-green-400 to-teal-500';
      case 'educational': return 'from-indigo-400 to-blue-500';
      case 'entertainment': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getEquipmentIcon = (equipment: string) => {
    switch (equipment) {
      case 'neural': return Brain;
      case 'hologram': return Sparkles;
      case 'ar-contact': return Eye;
      case 'headset': return VrHeadset;
      case 'mobile': return Smartphone;
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

  const filteredVRExperiences = selectedFilter === 'all' 
    ? vrExperiences 
    : vrExperiences.filter(exp => exp.type === selectedFilter);

  const filteredLiveExperiences = selectedFilter === 'all'
    ? liveExperiences
    : liveExperiences.filter(exp => exp.type === selectedFilter);

  const getCurrentFilters = () => {
    switch (activeTab) {
      case 'ar-tags': return tagFilters;
      case 'vr-experiences': return vrFilters;
      case 'live-experiences': return liveFilters;
      default: return tagFilters;
    }
  };

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
          onClick={() => {setActiveTab('ar-tags'); setSelectedFilter('all');}}
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
          onClick={() => {setActiveTab('vr-experiences'); setSelectedFilter('all');}}
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
          onClick={() => {setActiveTab('live-experiences'); setSelectedFilter('all');}}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'live-experiences'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
            <span className="text-sm font-medium">Live ({liveExperiences.length})</span>
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

      {/* Filters */}
      {activeTab !== 'create' && (
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
          {getCurrentFilters().map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                selectedFilter === filter.id
                  ? activeTab === 'ar-tags' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : activeTab === 'vr-experiences'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
              }`}
            >
              <filter.icon className="h-4 w-4" />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      )}

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

          {/* AR Tags List */}
          <div className="space-y-4">
            {filteredTags.map((tag) => (
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
                          {tag.type === 'warning' && <AlertTriangle className="h-3 w-3 text-white" />}
                          {tag.type === 'food' && <Utensils className="h-3 w-3 text-white" />}
                          {tag.type === 'historic' && <Clock className="h-3 w-3 text-white" />}
                          {tag.type === 'event' && <Calendar className="h-3 w-3 text-white" />}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tag.type === 'secret' ? 'bg-purple-500/20 text-purple-400' :
                          tag.type === 'tip' ? 'bg-blue-500/20 text-blue-400' :
                          tag.type === 'warning' ? 'bg-red-500/20 text-red-400' :
                          tag.type === 'food' ? 'bg-orange-500/20 text-orange-400' :
                          tag.type === 'historic' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {tag.type}
                        </span>
                        {tag.verified && (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
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

                  <div className="flex items-center justify-between mb-4">
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
                    
                    <button 
                      onClick={() => setSelectedTag(tag)}
                      className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                    >
                      View in AR →
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      Category: {tag.category} • Language: {tag.language}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

                    <div className="absolute top-3 right-3 flex space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        experience.price === 'free' 
                          ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                      }`}>
                        {experience.price}
                      </div>
                      <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                        <span className="text-white text-xs">{experience.ageRating}</span>
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
                        <div className="text-xs text-gray-400 mb-2">
                          by {experience.creator}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 text-sm">{experience.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{experience.description}</p>

                    {/* Equipment & Features */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <EquipmentIcon className="h-4 w-4" />
                          <span className="capitalize">{experience.equipment.replace('-', ' ')}</span>
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

                    {/* Features List */}
                    <div className="mb-4">
                      <h4 className="text-white font-medium text-sm mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {experience.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
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

                    {/* Languages */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-400">
                        Languages: {experience.language.join(', ')}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedExperience(experience)}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 rounded-2xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <EquipmentIcon className="h-5 w-5" />
                        <span>Enter Experience</span>
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
              <span className="text-gray-400 text-sm">({filteredLiveExperiences.length} active now)</span>
            </div>
            <p className="text-gray-300 text-xs">
              Real-time AR/VR experiences with futuristic technology happening right now
            </p>
          </div>

          {/* Live Experiences List */}
          <div className="space-y-4">
            {filteredLiveExperiences.map((experience) => (
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
                        experience.type === 'neural-link' ? 'bg-purple-500/20 text-purple-400' :
                        experience.type === 'holographic-event' ? 'bg-cyan-500/20 text-cyan-400' :
                        experience.type === 'time-travel' ? 'bg-yellow-500/20 text-yellow-400' :
                        experience.type === 'space-exploration' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {experience.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>

                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        experience.category === 'scientific' ? 'bg-indigo-500/20 text-indigo-400' :
                        experience.category === 'educational' ? 'bg-green-500/20 text-green-400' :
                        experience.category === 'entertainment' ? 'bg-pink-500/20 text-pink-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {experience.category}
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
                      Hosted by <span className="text-cyan-400">{experience.host}</span> • 
                      <span className="text-purple-400 ml-1">{experience.language}</span>
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
                  {experience.type.includes('neural') ? <Brain className="h-5 w-5" /> : 
                   experience.type.includes('holographic') ? <Sparkles className="h-5 w-5" /> : 
                   experience.type.includes('time') ? <Clock className="h-5 w-5" /> :
                   experience.type.includes('space') ? <Rocket className="h-5 w-5" /> :
                   <Eye className="h-5 w-5" />}
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
          {/* Create Type Selector */}
          <div className="flex rounded-2xl bg-black/20 p-1 mb-6">
            <button
              onClick={() => setCreateType('ar-tag')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                createType === 'ar-tag'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">AR Tag</span>
            </button>
            <button
              onClick={() => setCreateType('vr-experience')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                createType === 'vr-experience'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <VrHeadset className="h-4 w-4" />
              <span className="text-sm font-medium">VR Experience</span>
            </button>
            <button
              onClick={() => setCreateType('live-session')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                createType === 'live-session'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Live Session</span>
            </button>
          </div>

          {/* Create AR Tag */}
          {createType === 'ar-tag' && (
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

              {/* AR Tag Examples */}
              <div className="mt-4 space-y-2">
                <h3 className="text-white font-medium text-sm">Popular AR Tag Types:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/20 rounded-xl p-3 text-center">
                    <Star className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                    <div className="text-xs text-white">Secret Spots</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 text-center">
                    <Utensils className="h-6 w-6 text-orange-400 mx-auto mb-1" />
                    <div className="text-xs text-white">Food Tips</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 text-center">
                    <Clock className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                    <div className="text-xs text-white">Historical Info</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 text-center">
                    <Calendar className="h-6 w-6 text-green-400 mx-auto mb-1" />
                    <div className="text-xs text-white">Local Events</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create VR Experience */}
          {createType === 'vr-experience' && (
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-6 border border-cyan-400/30">
              <div className="text-center mb-4">
                <VrHeadset className="h-12 w-12 text-cyan-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-white mb-2">Create VR Experience</h2>
                <p className="text-gray-400 text-sm">Design immersive virtual reality experiences for the community</p>
              </div>
              
              <button 
                onClick={() => setShowCreateModal(true)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Camera className="h-6 w-6" />
                <span>Create VR Experience</span>
              </button>

              {/* VR Experience Templates */}
              <div className="mt-4 space-y-2">
                <h3 className="text-white font-medium text-sm">Experience Templates:</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-black/20 rounded-xl p-2 text-center">
                    <Rocket className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-xs text-white">Futuristic</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-2 text-center">
                    <Clock className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                    <div className="text-xs text-white">Historical</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-2 text-center">
                    <Heart className="h-5 w-5 text-green-400 mx-auto mb-1" />
                    <div className="text-xs text-white">Meditation</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Start Live Session */}
          {createType === 'live-session' && (
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-3xl p-6 border border-red-400/30">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                  <span className="text-red-400 font-bold text-lg">LIVE SESSION</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Start Live AR/VR Session</h2>
                <p className="text-gray-400 text-sm">Host real-time experiences for the global nomad community</p>
              </div>
              
              <button 
                onClick={() => setShowCreateModal(true)}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Play className="h-6 w-6" />
                <span>Go Live Now</span>
              </button>

              {/* Live Session Options */}
              <div className="mt-4 space-y-2">
                <h3 className="text-white font-medium text-sm">Live Session Types:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/20 rounded-xl p-3 text-center">
                    <Brain className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                    <div className="text-xs text-white">Neural Link</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 text-center">
                    <Sparkles className="h-6 w-6 text-cyan-400 mx-auto mb-1" />
                    <div className="text-xs text-white">Holographic</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 text-center">
                    <Clock className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                    <div className="text-xs text-white">Time Travel</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 text-center">
                    <Rocket className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                    <div className="text-xs text-white">Space Tour</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Futuristic Features Showcase */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-6 border border-indigo-400/30">
            <div className="text-center mb-4">
              <Atom className="h-12 w-12 text-indigo-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Next-Gen Features</h2>
              <p className="text-gray-400 text-sm">Cutting-edge AR/VR technology at your fingertips</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 rounded-xl p-4">
                <Brain className="h-8 w-8 text-purple-400 mb-2" />
                <h3 className="text-white font-medium text-sm mb-1">Neural Interface</h3>
                <p className="text-gray-400 text-xs">Direct brain-to-VR connection</p>
              </div>
              <div className="bg-black/20 rounded-xl p-4">
                <Sparkles className="h-8 w-8 text-cyan-400 mb-2" />
                <h3 className="text-white font-medium text-sm mb-1">Holographic Projection</h3>
                <p className="text-gray-400 text-xs">3D holographic experiences</p>
              </div>
              <div className="bg-black/20 rounded-xl p-4">
                <Eye className="h-8 w-8 text-green-400 mb-2" />
                <h3 className="text-white font-medium text-sm mb-1">AR Contact Lenses</h3>
                <p className="text-gray-400 text-xs">Invisible AR overlay technology</p>
              </div>
              <div className="bg-black/20 rounded-xl p-4">
                <Cpu className="h-8 w-8 text-orange-400 mb-2" />
                <h3 className="text-white font-medium text-sm mb-1">Quantum Computing</h3>
                <p className="text-gray-400 text-xs">Ultra-realistic simulations</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateContentModal 
          type={createType}
          onClose={() => setShowCreateModal(false)} 
        />
      )}

      {selectedExperience && (
        <VRExperienceModal
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}

      {selectedTag && (
        <ARTagModal
          tag={selectedTag}
          onClose={() => setSelectedTag(null)}
        />
      )}
    </div>
  );
}

// Create Content Modal Component
function CreateContentModal({ 
  type, 
  onClose 
}: { 
  type: 'ar-tag' | 'vr-experience' | 'live-session';
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    type: type === 'ar-tag' ? 'tip' : type === 'vr-experience' ? 'tour' : 'ar-tour',
    language: 'English',
    equipment: 'mobile'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Creating ${type}:`, formData);
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case 'ar-tag': return 'Create AR Tag';
      case 'vr-experience': return 'Create VR Experience';
      case 'live-session': return 'Start Live Session';
      default: return 'Create Content';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'ar-tag': return Eye;
      case 'vr-experience': return VrHeadset;
      case 'live-session': return Zap;
      default: return Plus;
    }
  };

  const Icon = getIcon();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Icon className="h-8 w-8 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">{getTitle()}</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder={type === 'ar-tag' ? "What's this about?" : "Experience title"}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {type === 'ar-tag' ? 'Message' : 'Description'}
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                rows={3}
                placeholder={type === 'ar-tag' ? "Share your knowledge..." : "Describe the experience..."}
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

            {type === 'ar-tag' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tag Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="tip">Travel Tip</option>
                  <option value="secret">Secret Spot</option>
                  <option value="warning">Warning</option>
                  <option value="food">Food Recommendation</option>
                  <option value="historic">Historical Info</option>
                  <option value="event">Local Event</option>
                </select>
              </div>
            )}

            {type === 'vr-experience' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="tour">Virtual Tour</option>
                    <option value="futuristic">Futuristic Experience</option>
                    <option value="historical">Historical Journey</option>
                    <option value="meditation">Meditation Experience</option>
                    <option value="educational">Educational Content</option>
                    <option value="entertainment">Entertainment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Equipment Required</label>
                  <select
                    value={formData.equipment}
                    onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="mobile">Smartphone</option>
                    <option value="headset">VR Headset</option>
                    <option value="neural">Neural Interface</option>
                    <option value="hologram">Holographic Projector</option>
                    <option value="ar-contact">AR Contact Lenses</option>
                  </select>
                </div>
              </>
            )}

            {type === 'live-session' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Session Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="ar-tour">AR Tour</option>
                  <option value="neural-link">Neural Link Experience</option>
                  <option value="holographic-event">Holographic Event</option>
                  <option value="time-travel">Time Travel Experience</option>
                  <option value="space-exploration">Space Exploration</option>
                  <option value="virtual-meetup">Virtual Meetup</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="Hindi">Hindi</option>
                <option value="Mandarin">Mandarin</option>
                {type === 'live-session' && <option value="Universal">Universal (Neural)</option>}
              </select>
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
                className={`flex-1 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
                  type === 'ar-tag' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                  type === 'vr-experience' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                  'bg-gradient-to-r from-red-500 to-orange-500'
                }`}
              >
                {type === 'live-session' ? 'Go Live' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// VR Experience Modal Component
function VRExperienceModal({ 
  experience, 
  onClose 
}: { 
  experience: VRExperience; 
  onClose: () => void;
}) {
  const EquipmentIcon = getEquipmentIcon(experience.equipment);

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
              <h3 className="text-white font-medium mb-2">Creator & Details</h3>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Created by: <span className="text-cyan-400">{experience.creator}</span></p>
                <p>Age Rating: <span className="text-yellow-400">{experience.ageRating}</span></p>
                <p>Languages: <span className="text-blue-400">{experience.language.join(', ')}</span></p>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Equipment Required</h3>
              <div className="flex items-center space-x-2">
                <EquipmentIcon className="h-5 w-5 text-cyan-400" />
                <span className="text-cyan-400 text-sm capitalize">{experience.equipment.replace('-', ' ')}</span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {experience.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Experience Tags</h3>
              <div className="flex flex-wrap gap-2">
                {experience.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs text-purple-400 border border-purple-400/30"
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
              <EquipmentIcon className="h-6 w-6" />
              <span>Enter VR Experience</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function getEquipmentIcon(equipment: string) {
    switch (equipment) {
      case 'neural': return Brain;
      case 'hologram': return Sparkles;
      case 'ar-contact': return Eye;
      case 'headset': return VrHeadset;
      case 'mobile': return Smartphone;
      case 'computer': return Monitor;
      default: return Smartphone;
    }
  }
}

// AR Tag Modal Component
function ARTagModal({ 
  tag, 
  onClose 
}: { 
  tag: ARTag; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{tag.title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>

          {tag.mediaUrl && (
            <div className="mb-4">
              <img
                src={tag.mediaUrl}
                alt={tag.title}
                className="w-full h-48 object-cover rounded-2xl"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">AR Message</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{tag.content}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-medium mb-2">Location</h3>
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{tag.location}</span>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Distance</h3>
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <Navigation className="h-4 w-4" />
                  <span>{tag.distance}km away</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Tag Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tag.type === 'secret' ? 'bg-purple-500/20 text-purple-400' :
                    tag.type === 'tip' ? 'bg-blue-500/20 text-blue-400' :
                    tag.type === 'warning' ? 'bg-red-500/20 text-red-400' :
                    tag.type === 'food' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {tag.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-cyan-400 capitalize">{tag.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Language:</span>
                  <span className="text-blue-400">{tag.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Author:</span>
                  <span className="text-purple-400">{tag.author}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-pink-400">
                  <Heart className="h-4 w-4 fill-current" />
                  <span className="text-sm">{tag.likes}</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-400">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{tag.views}</span>
                </div>
              </div>
              
              {tag.verified && (
                <div className="flex items-center space-x-1 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs">Verified</span>
                </div>
              )}
            </div>

            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
              <Eye className="h-6 w-6" />
              <span>View in AR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ARWorldPage;