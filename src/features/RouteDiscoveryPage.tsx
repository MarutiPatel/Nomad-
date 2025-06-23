import React, { useState, useRef, useEffect } from 'react';
import { 
  Navigation, MapPin, Clock, Star, Heart, Share, Plus, Filter, 
  Search, Bot, Mic, Send, Car, Train, Plane, Footprints,
  Utensils, Coffee, Bed, Camera, Fuel, TreePine, AlertTriangle,
  Users, Calendar, DollarSign, Map, Eye, Play, Bookmark,
  ThumbsUp, MessageCircle, Award, Zap, Route as RouteIcon,
  Volume2, VolumeX, Settings, Target, Compass, Globe,
  TrendingUp, CheckCircle, Info, ArrowRight, RefreshCw
} from 'lucide-react';

interface RouteStop {
  id: string;
  name: string;
  type: 'food' | 'stay' | 'attraction' | 'fuel' | 'parking' | 'camping';
  location: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviews: number;
  priceRange: string;
  distance: number;
  estimatedTime: string;
  image: string;
  description: string;
  specialOffers?: string[];
  isHiddenGem?: boolean;
  safetyRating: number;
  carbonFootprint?: string;
}

interface SavedRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: number;
  duration: string;
  stops: number;
  lastUsed: Date;
  timesUsed: number;
  estimatedCost: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  tags: string[];
}

interface CommunityRoute {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  from: string;
  to: string;
  distance: number;
  duration: string;
  stops: number;
  rating: number;
  reviews: number;
  likes: number;
  isLiked: boolean;
  difficulty: 'easy' | 'moderate' | 'challenging';
  tags: string[];
  description: string;
  estimatedCost: string;
  isFeatured?: boolean;
  createdAt: Date;
}

interface AIMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'route' | 'recommendations';
  data?: any;
}

function RouteDiscoveryPage() {
  const [activeTab, setActiveTab] = useState<'planner' | 'saved' | 'community'>('planner');
  const [routeData, setRouteData] = useState({
    from: '',
    to: '',
    departure: '',
    travelers: 1,
    preferences: [] as string[]
  });
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoute, setGeneratedRoute] = useState<RouteStop[] | null>(null);
  const [showMap, setShowMap] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const preferences = [
    { id: 'food', label: 'Food Spots', icon: Utensils, color: 'from-orange-400 to-red-500' },
    { id: 'stay', label: 'Accommodation', icon: Bed, color: 'from-blue-400 to-cyan-500' },
    { id: 'attractions', label: 'Attractions', icon: Camera, color: 'from-purple-400 to-pink-500' },
    { id: 'fuel', label: 'Fuel Stations', icon: Fuel, color: 'from-green-400 to-teal-500' },
    { id: 'parking', label: 'Parking', icon: Car, color: 'from-gray-400 to-gray-600' },
    { id: 'camping', label: 'Camping', icon: TreePine, color: 'from-emerald-400 to-green-500' }
  ];

  const quickRoutes = [
    { from: 'Mumbai', to: 'Goa', distance: '463 km', time: '8h 30m', type: 'coastal' },
    { from: 'Delhi', to: 'Manali', distance: '570 km', time: '12h', type: 'mountain' },
    { from: 'Bangalore', to: 'Coorg', distance: '252 km', time: '5h 30m', type: 'nature' },
    { from: 'Chennai', to: 'Pondicherry', distance: '160 km', time: '3h 30m', type: 'heritage' },
    { from: 'Kolkata', to: 'Darjeeling', distance: '680 km', time: '14h', type: 'hill-station' },
    { from: 'Pune', to: 'Lonavala', distance: '64 km', time: '1h 30m', type: 'weekend' }
  ];

  const mockSavedRoutes: SavedRoute[] = [
    {
      id: '1',
      name: 'Mumbai to Goa Beach Route',
      from: 'Mumbai',
      to: 'Goa',
      distance: 463,
      duration: '8h 30m',
      stops: 12,
      lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      timesUsed: 3,
      estimatedCost: '₹2,500',
      difficulty: 'easy',
      tags: ['coastal', 'scenic', 'food']
    },
    {
      id: '2',
      name: 'Delhi Mountain Adventure',
      from: 'Delhi',
      to: 'Manali',
      distance: 570,
      duration: '12h',
      stops: 8,
      lastUsed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      timesUsed: 1,
      estimatedCost: '₹4,200',
      difficulty: 'moderate',
      tags: ['mountains', 'adventure', 'scenic']
    }
  ];

  const mockCommunityRoutes: CommunityRoute[] = [
    {
      id: '1',
      title: 'Ultimate Goa Beach Hopping Experience',
      author: 'BeachExplorer99',
      authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      from: 'Mumbai',
      to: 'Goa',
      distance: 463,
      duration: '8h 30m',
      stops: 15,
      rating: 4.8,
      reviews: 124,
      likes: 89,
      isLiked: false,
      difficulty: 'easy',
      tags: ['beaches', 'nightlife', 'food'],
      description: 'Perfect coastal route with hidden beach shacks and sunset spots',
      estimatedCost: '₹3,000',
      isFeatured: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Himalayan Heights Adventure',
      author: 'MountainSoul42',
      authorAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      from: 'Delhi',
      to: 'Leh',
      distance: 1150,
      duration: '2 days',
      stops: 20,
      rating: 4.9,
      reviews: 67,
      likes: 156,
      isLiked: true,
      difficulty: 'challenging',
      tags: ['mountains', 'adventure', 'camping'],
      description: 'Epic mountain journey through high altitude passes',
      estimatedCost: '₹8,500',
      isFeatured: true,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    }
  ];

  const mockRouteStops: RouteStop[] = [
    {
      id: '1',
      name: 'Highway Dhaba Delight',
      type: 'food',
      location: 'Panvel, Maharashtra',
      coordinates: { lat: 18.9894, lng: 73.1267 },
      rating: 4.5,
      reviews: 234,
      priceRange: '₹150-300',
      distance: 45,
      estimatedTime: '1h',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Authentic Punjabi food with truck driver vibes',
      specialOffers: ['Free chai with meal', '20% off for groups'],
      isHiddenGem: true,
      safetyRating: 4.8,
      carbonFootprint: 'Low impact'
    },
    {
      id: '2',
      name: 'Sunset Point Resort',
      type: 'stay',
      location: 'Mahabaleshwar, Maharashtra',
      coordinates: { lat: 17.9242, lng: 73.6582 },
      rating: 4.7,
      reviews: 89,
      priceRange: '₹2000-4000',
      distance: 120,
      estimatedTime: '3h',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Hillside resort with panoramic valley views',
      specialOffers: ['Early check-in free', 'Complimentary breakfast'],
      safetyRating: 4.9,
      carbonFootprint: 'Eco-friendly'
    },
    {
      id: '3',
      name: 'Ancient Cave Temples',
      type: 'attraction',
      location: 'Karla, Maharashtra',
      coordinates: { lat: 18.7469, lng: 73.4831 },
      rating: 4.6,
      reviews: 156,
      priceRange: 'Free',
      distance: 85,
      estimatedTime: '2h 30m',
      image: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: '2000-year-old Buddhist cave temples with intricate carvings',
      isHiddenGem: true,
      safetyRating: 4.5,
      carbonFootprint: 'Zero impact'
    },
    {
      id: '4',
      name: 'Green Valley Camping',
      type: 'camping',
      location: 'Pawna Lake, Maharashtra',
      coordinates: { lat: 18.7469, lng: 73.4831 },
      rating: 4.4,
      reviews: 78,
      priceRange: '₹800-1500',
      distance: 95,
      estimatedTime: '2h 45m',
      image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Lakeside camping with bonfire and stargazing',
      specialOffers: ['Equipment rental included', 'Group discounts'],
      safetyRating: 4.3,
      carbonFootprint: 'Minimal impact'
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleQuickRoute = (route: any) => {
    setRouteData({
      ...routeData,
      from: route.from,
      to: route.to
    });
  };

  const togglePreference = (prefId: string) => {
    setRouteData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter(p => p !== prefId)
        : [...prev.preferences, prefId]
    }));
  };

  const handlePlanRoute = async () => {
    if (!routeData.from || !routeData.to) return;
    
    setIsGenerating(true);
    setShowAIAssistant(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiMessage: AIMessage = {
      id: Date.now().toString(),
      content: `Perfect! I've analyzed your route from ${routeData.from} to ${routeData.to} and found some amazing stops based on your preferences.`,
      isUser: false,
      timestamp: new Date(),
      type: 'route',
      data: {
        route: mockRouteStops,
        totalDistance: '463 km',
        estimatedTime: '8h 30m',
        estimatedCost: '₹2,500',
        highlights: ['3 hidden gems', '2 eco-friendly stops', '1 local favorite']
      }
    };
    
    setAiMessages(prev => [...prev, aiMessage]);
    setGeneratedRoute(mockRouteStops);
    setIsGenerating(false);
  };

  const handleAISend = async () => {
    if (!aiInput.trim()) return;
    
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: aiInput,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };
    
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you find the best routes! Would you like me to suggest some hidden food spots along the way?",
        "Great question! Based on your travel style, I recommend taking the scenic route with 3 extra stops for photography.",
        "I've found some amazing camping spots that other travelers have rated 4.8+ stars. Shall I add them to your route?",
        "Perfect timing! There's a local festival happening in that area next week. Want me to plan your route around it?"
      ];
      
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setRouteData({
          ...routeData,
          from: 'Mumbai',
          to: 'Goa'
        });
        setIsListening(false);
      }, 3000);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'food': return Utensils;
      case 'stay': return Bed;
      case 'attraction': return Camera;
      case 'fuel': return Fuel;
      case 'parking': return Car;
      case 'camping': return TreePine;
      default: return MapPin;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'food': return 'from-orange-400 to-red-500';
      case 'stay': return 'from-blue-400 to-cyan-500';
      case 'attraction': return 'from-purple-400 to-pink-500';
      case 'fuel': return 'from-green-400 to-teal-500';
      case 'parking': return 'from-gray-400 to-gray-600';
      case 'camping': return 'from-emerald-400 to-green-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-emerald-500';
      case 'moderate': return 'from-yellow-400 to-orange-500';
      case 'challenging': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Route Discovery</h1>
          <p className="text-gray-400 text-sm">Plan your journey with hidden gems and perfect stops</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMap(!showMap)}
            className={`p-2 rounded-xl transition-colors ${
              showMap ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Map className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className={`p-2 rounded-xl transition-colors ${
              showAIAssistant ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Bot className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto space-x-1 bg-black/20 rounded-2xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('planner')}
          className={`flex items-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'planner'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <RouteIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Route Planner</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'saved'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span className="text-sm font-medium">Saved Routes</span>
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`flex items-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'community'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">Community Routes</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {/* Quick Route Examples */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Popular Routes</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickRoutes.map((route, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickRoute(route)}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300 text-left"
                >
                  <div className="text-white font-medium text-sm mb-1">
                    {route.from} → {route.to}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {route.distance} • {route.time}
                  </div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                    route.type === 'coastal' ? 'bg-blue-500/20 text-blue-400' :
                    route.type === 'mountain' ? 'bg-green-500/20 text-green-400' :
                    route.type === 'nature' ? 'bg-emerald-500/20 text-emerald-400' :
                    route.type === 'heritage' ? 'bg-purple-500/20 text-purple-400' :
                    route.type === 'hill-station' ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {route.type}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Route Planning Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Plan Your Journey</h3>
            
            <div className="space-y-4">
              {/* From/To Inputs */}
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <input
                    type="text"
                    value={routeData.from}
                    onChange={(e) => setRouteData({ ...routeData, from: e.target.value })}
                    placeholder="Starting location"
                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  </div>
                  <input
                    type="text"
                    value={routeData.to}
                    onChange={(e) => setRouteData({ ...routeData, to: e.target.value })}
                    placeholder="Destination"
                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Date and Travelers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={routeData.departure}
                    onChange={(e) => setRouteData({ ...routeData, departure: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={routeData.travelers}
                    onChange={(e) => setRouteData({ ...routeData, travelers: Number(e.target.value) })}
                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num} className="bg-slate-800">
                        {num} Traveler{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h4 className="text-white font-medium mb-3">What would you like to discover?</h4>
                <div className="grid grid-cols-2 gap-2">
                  {preferences.map((pref) => (
                    <button
                      key={pref.id}
                      onClick={() => togglePreference(pref.id)}
                      className={`flex items-center space-x-2 p-3 rounded-xl transition-all duration-300 ${
                        routeData.preferences.includes(pref.id)
                          ? `bg-gradient-to-r ${pref.color} bg-opacity-20 border border-white/20`
                          : 'bg-white/5 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <pref.icon className="h-4 w-4 text-white" />
                      <span className="text-sm text-white">{pref.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleVoiceInput}
                  className={`flex items-center justify-center space-x-2 py-4 rounded-2xl border transition-all duration-300 ${
                    isListening
                      ? 'bg-red-500/20 border-red-400/30 text-red-400'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-medium">
                    {isListening ? 'Listening...' : 'Voice Input'}
                  </span>
                </button>
                
                <button
                  onClick={handlePlanRoute}
                  disabled={!routeData.from || !routeData.to || isGenerating}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 py-4 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Bot className="h-5 w-5" />
                      <span>Plan with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Generated Route Display */}
          {generatedRoute && (
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Your AI-Generated Route</h3>
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
                  <Share className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {generatedRoute.map((stop, index) => {
                  const IconComponent = getTypeIcon(stop.type);
                  return (
                    <div key={stop.id} className="bg-black/20 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getTypeColor(stop.type)} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-white font-medium">{stop.name}</h4>
                              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                                <MapPin className="h-3 w-3" />
                                <span>{stop.location}</span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-yellow-400 text-sm">{stop.rating}</span>
                              </div>
                              <div className="text-gray-400 text-xs">{stop.reviews} reviews</div>
                            </div>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-3">{stop.description}</p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-green-400">{stop.priceRange}</span>
                              <span className="text-gray-400">{stop.estimatedTime}</span>
                              <span className="text-blue-400">{stop.distance}km</span>
                            </div>
                            
                            {stop.isHiddenGem && (
                              <div className="bg-purple-500/20 px-2 py-1 rounded-full">
                                <span className="text-purple-400 text-xs">Hidden Gem</span>
                              </div>
                            )}
                          </div>
                          
                          {stop.specialOffers && stop.specialOffers.length > 0 && (
                            <div className="bg-green-500/10 rounded-xl p-2 mb-3">
                              <div className="text-green-400 text-xs font-medium mb-1">Special Offers:</div>
                              {stop.specialOffers.map((offer, idx) => (
                                <div key={idx} className="text-green-300 text-xs">• {offer}</div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <Shield className="h-3 w-3 text-blue-400" />
                                <span className="text-blue-400 text-xs">{stop.safetyRating}/5 Safety</span>
                              </div>
                              {stop.carbonFootprint && (
                                <div className="flex items-center space-x-1">
                                  <TreePine className="h-3 w-3 text-green-400" />
                                  <span className="text-green-400 text-xs">{stop.carbonFootprint}</span>
                                </div>
                              )}
                            </div>
                            
                            <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Your Saved Routes</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <Search className="h-4 w-4 text-gray-400" />
              </button>
              <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <Filter className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          {mockSavedRoutes.map((route) => (
            <div key={route.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium">{route.name}</h4>
                  <div className="text-gray-400 text-sm">{route.from} → {route.to}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-sm font-medium">{route.estimatedCost}</div>
                  <div className="text-gray-400 text-xs">Used {route.timesUsed}x</div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                <div>
                  <span className="text-gray-400">Distance:</span>
                  <div className="text-white">{route.distance}km</div>
                </div>
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <div className="text-white">{route.duration}</div>
                </div>
                <div>
                  <span className="text-gray-400">Stops:</span>
                  <div className="text-white">{route.stops}</div>
                </div>
                <div>
                  <span className="text-gray-400">Difficulty:</span>
                  <div className={`text-sm font-medium ${
                    route.difficulty === 'easy' ? 'text-green-400' :
                    route.difficulty === 'moderate' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {route.difficulty}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {route.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-xs">
                  Last used: {route.lastUsed.toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl text-sm hover:bg-cyan-500/30 transition-colors">
                    Use Route
                  </button>
                  <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                    <Share className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'community' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Community Routes</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <Search className="h-4 w-4 text-gray-400" />
              </button>
              <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <Filter className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          {mockCommunityRoutes.map((route) => (
            <div key={route.id} className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 ${
              route.isFeatured ? 'border-yellow-400/30 bg-gradient-to-r from-yellow-500/5 to-orange-500/5' : ''
            }`}>
              {route.isFeatured && (
                <div className="flex items-center space-x-1 mb-3">
                  <Award className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">Featured Route</span>
                </div>
              )}
              
              <div className="flex items-start space-x-3 mb-3">
                <img
                  src={route.authorAvatar}
                  alt={route.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-white font-medium">{route.title}</h4>
                  <div className="text-gray-400 text-sm">{route.from} → {route.to}</div>
                  <div className="text-gray-400 text-xs">by {route.author}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 text-sm">{route.rating}</span>
                  </div>
                  <div className="text-gray-400 text-xs">{route.reviews} reviews</div>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-3">{route.description}</p>
              
              <div className="grid grid-cols-4 gap-4 mb-3 text-xs">
                <div>
                  <span className="text-gray-400">Distance:</span>
                  <div className="text-white">{route.distance}km</div>
                </div>
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <div className="text-white">{route.duration}</div>
                </div>
                <div>
                  <span className="text-gray-400">Stops:</span>
                  <div className="text-white">{route.stops}</div>
                </div>
                <div>
                  <span className="text-gray-400">Cost:</span>
                  <div className="text-green-400">{route.estimatedCost}</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {route.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    className={`flex items-center space-x-1 transition-colors ${
                      route.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${route.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{route.likes}</span>
                  </button>
                  
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <MessageCircle className="h-4 w-4" />
                    <span>{route.reviews}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-xl text-sm hover:bg-purple-500/30 transition-colors">
                    Use Route
                  </button>
                  <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                    <Share className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Assistant Sidebar */}
      {showAIAssistant && (
        <div className="fixed inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur-md border-l border-white/10 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-purple-400" />
              <span className="text-white font-medium">AI Route Assistant</span>
            </div>
            <button
              onClick={() => setShowAIAssistant(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.length === 0 && (
              <div className="text-center text-gray-400 text-sm">
                <Bot className="h-12 w-12 mx-auto mb-3 text-purple-400" />
                <p>Hi! I'm your AI route assistant. I can help you find the best routes, hidden gems, and perfect stops for your journey.</p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setAiMessages([{
                      id: '1',
                      content: "Find me hidden food spots between Mumbai and Goa",
                      isUser: true,
                      timestamp: new Date(),
                      type: 'text'
                    }])}
                    className="w-full text-left p-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition-colors"
                  >
                    "Find hidden food spots on my route"
                  </button>
                  <button
                    onClick={() => setAiMessages([{
                      id: '1',
                      content: "What's the best time to travel to avoid traffic?",
                      isUser: true,
                      timestamp: new Date(),
                      type: 'text'
                    }])}
                    className="w-full text-left p-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition-colors"
                  >
                    "Best time to avoid traffic?"
                  </button>
                </div>
              </div>
            )}
            
            {aiMessages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-white/10 text-white'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  {message.type === 'route' && message.data && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="text-xs text-white/80 mb-2">Route Summary:</div>
                      <div className="space-y-1 text-xs">
                        <div>Distance: {message.data.totalDistance}</div>
                        <div>Time: {message.data.estimatedTime}</div>
                        <div>Cost: {message.data.estimatedCost}</div>
                        <div className="text-cyan-300">{message.data.highlights.join(', ')}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAISend()}
                placeholder="Ask me about routes..."
                className="flex-1 px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
              />
              <button
                onClick={handleAISend}
                className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Overlay */}
      {showMap && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 w-full max-w-4xl h-96">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-medium">Route Map</h3>
              <button
                onClick={() => setShowMap(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 h-80 bg-gradient-to-br from-slate-800 to-slate-700 rounded-b-3xl flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Map className="h-16 w-16 mx-auto mb-4" />
                <p>Interactive map would be displayed here</p>
                <p className="text-sm mt-2">Showing route with all discovered stops</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteDiscoveryPage;