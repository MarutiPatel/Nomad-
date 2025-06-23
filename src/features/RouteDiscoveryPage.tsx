import React, { useState, useEffect } from 'react';
import { Map, MapPin, Navigation, Route, Compass, Search, Filter, Car, Tent, Utensils, Home, Fuel, Hotel, Camera, Star, Clock, DollarSign, Wifi, Phone, Zap, Shield, Eye, Plus, Bookmark, Share, Download, RefreshCw, Target, Mountain, Coffee, ParkingMeter as Parking, AlertTriangle, Heart, Users, CloudSnow, Sun, Wind, Droplets, Calendar, Settings, ChevronDown, ChevronUp, Play, Pause, MoreHorizontal, ThumbsUp, MessageCircle, Flag, Globe, TreePine, Waves, Mic, Bot, Brain, Sparkles, TrendingUp, Award, CheckCircle, X, Send, Volume2, VolumeX, Headphones, Smartphone } from 'lucide-react';

interface AIRecommendation {
  id: string;
  type: 'route-optimization' | 'weather-alert' | 'traffic-update' | 'hidden-gem' | 'cost-saving' | 'safety-tip';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ComponentType<any>;
}

interface RouteStop {
  id: string;
  name: string;
  type: 'food' | 'camping' | 'parking' | 'stay' | 'fuel' | 'hidden-gem' | 'attraction' | 'emergency';
  location: string;
  coordinates: { lat: number; lng: number };
  distanceFromRoute: number;
  rating: number;
  reviews: number;
  price: 'free' | '$' | '$$' | '$$$';
  description: string;
  amenities: string[];
  image: string;
  isOpen: boolean;
  hours: string;
  contact?: string;
  website?: string;
  isBookmarked: boolean;
  isLiked: boolean;
  likes: number;
  isTravelerRecommended: boolean;
  isAIRecommended: boolean;
  safetyRating: number;
  tags: string[];
  specialOffers?: string[];
  peakHours?: string;
  averageSpend?: number;
}

interface TravelRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: number;
  estimatedTime: number;
  routeType: 'fastest' | 'scenic' | 'economical';
  stops: RouteStop[];
  totalCost: number;
  weatherConditions: string[];
  safetyAlerts: number;
  createdAt: Date;
  isShared: boolean;
  difficulty: 'easy' | 'moderate' | 'challenging';
  bestTimeToTravel: string;
  popularWith: string[];
  aiOptimized: boolean;
  carbonFootprint: number;
  fuelEfficiency: number;
}

interface RoutePreferences {
  showFood: boolean;
  showCamping: boolean;
  showParking: boolean;
  showStays: boolean;
  showFuel: boolean;
  showHiddenGems: boolean;
  showAttractions: boolean;
  showEmergency: boolean;
  maxDetourDistance: number;
  budgetRange: 'budget' | 'mid' | 'luxury';
  travelStyle: 'comfort' | 'adventure' | 'cultural' | 'nature';
  aiAssistanceLevel: 'minimal' | 'moderate' | 'maximum';
  prioritizeEco: boolean;
  avoidCrowds: boolean;
}

function RouteDiscoveryPage() {
  const [activeTab, setActiveTab] = useState<'planner' | 'saved-routes' | 'community-routes' | 'ai-assistant'>('planner');
  const [routePreferences, setRoutePreferences] = useState<RoutePreferences>({
    showFood: true,
    showCamping: true,
    showParking: false,
    showStays: true,
    showFuel: false,
    showHiddenGems: true,
    showAttractions: true,
    showEmergency: false,
    maxDetourDistance: 10,
    budgetRange: 'mid',
    travelStyle: 'adventure',
    aiAssistanceLevel: 'moderate',
    prioritizeEco: false,
    avoidCrowds: false
  });
  
  const [routeForm, setRouteForm] = useState({
    from: '',
    to: '',
    departureDate: '',
    travelers: 1,
    vehicleType: 'car'
  });

  const [currentRoute, setCurrentRoute] = useState<TravelRoute | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedStop, setSelectedStop] = useState<RouteStop | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');

  // Enhanced mock data with more examples
  const mockRoutes: TravelRoute[] = [
    {
      id: '1',
      name: 'Mumbai to Goa Coastal Highway',
      from: 'Mumbai, Maharashtra',
      to: 'Goa, India',
      distance: 450,
      estimatedTime: 8.5,
      routeType: 'scenic',
      totalCost: 3500,
      weatherConditions: ['Sunny', 'Partly Cloudy'],
      safetyAlerts: 1,
      createdAt: new Date(),
      isShared: false,
      difficulty: 'easy',
      bestTimeToTravel: 'October to March',
      popularWith: ['Beach Lovers', 'Food Enthusiasts', 'Cultural Explorers'],
      aiOptimized: true,
      carbonFootprint: 2.5,
      fuelEfficiency: 15.8,
      stops: [
        {
          id: '1',
          name: 'Authentic Konkani Kitchen',
          type: 'food',
          location: 'Ratnagiri, Maharashtra',
          coordinates: { lat: 16.9902, lng: 73.3120 },
          distanceFromRoute: 2.5,
          rating: 4.8,
          reviews: 156,
          price: '$',
          description: 'Hidden gem serving traditional Konkani seafood. Family-run restaurant for 3 generations with secret recipes.',
          amenities: ['Parking', 'Clean Restrooms', 'AC', 'Seafood Specialist', 'Takeaway'],
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          isOpen: true,
          hours: '11:00 AM - 10:00 PM',
          contact: '+91 98765 43210',
          isBookmarked: false,
          isLiked: true,
          likes: 89,
          isTravelerRecommended: true,
          isAIRecommended: true,
          safetyRating: 4.9,
          tags: ['local-cuisine', 'seafood', 'family-run', 'authentic', 'must-try'],
          specialOffers: ['20% off for travelers', 'Free dessert on weekends'],
          peakHours: '7:00 PM - 9:00 PM',
          averageSpend: 400
        },
        {
          id: '2',
          name: 'Sunset Point Camping',
          type: 'camping',
          location: 'Kashid Beach, Maharashtra',
          coordinates: { lat: 18.4031, lng: 72.9734 },
          distanceFromRoute: 5.0,
          rating: 4.6,
          reviews: 89,
          price: '$$',
          description: 'Beachside camping with stunning sunset views. Tents and basic amenities provided. Perfect for stargazing.',
          amenities: ['Beach Access', 'Bonfire', 'Clean Toilets', 'Security', 'Food Stall', 'Shower'],
          image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
          isOpen: true,
          hours: '24/7',
          contact: '+91 87654 32109',
          isBookmarked: true,
          isLiked: false,
          likes: 134,
          isTravelerRecommended: true,
          isAIRecommended: true,
          safetyRating: 4.7,
          tags: ['beach-camping', 'sunset', 'bonfire', 'photography', 'stargazing'],
          specialOffers: ['Early bird discount', 'Group bookings 15% off'],
          averageSpend: 800
        },
        {
          id: '3',
          name: 'Heritage Homestay Villa',
          type: 'stay',
          location: 'Chiplun, Maharashtra',
          coordinates: { lat: 17.5317, lng: 73.5126 },
          distanceFromRoute: 1.2,
          rating: 4.9,
          reviews: 67,
          price: '$$',
          description: 'Traditional Konkani house converted to homestay. Experience local culture, home-cooked meals, and authentic village life.',
          amenities: ['WiFi', 'AC', 'Home-cooked Meals', 'Cultural Experience', 'Garden', 'Parking'],
          image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
          isOpen: true,
          hours: 'Check-in: 2 PM',
          contact: '+91 76543 21098',
          website: 'konkanistay.com',
          isBookmarked: false,
          isLiked: true,
          likes: 203,
          isTravelerRecommended: true,
          isAIRecommended: true,
          safetyRating: 4.8,
          tags: ['heritage', 'cultural-experience', 'home-cooked', 'traditional', 'peaceful'],
          specialOffers: ['Welcome drink', 'Cooking class included'],
          averageSpend: 1200
        },
        {
          id: '4',
          name: 'Secret Waterfall Trek',
          type: 'hidden-gem',
          location: 'Khed, Maharashtra',
          coordinates: { lat: 17.7167, lng: 73.3667 },
          distanceFromRoute: 8.5,
          rating: 4.7,
          reviews: 45,
          price: 'free',
          description: 'Hidden waterfall accessible via 2km trek through dense forest. Crystal clear natural pool perfect for swimming. Best kept secret of locals.',
          amenities: ['Trek Path', 'Natural Pool', 'Photography Spot', 'Picnic Area', 'Wildlife Watching'],
          image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
          isOpen: true,
          hours: 'Daylight hours only',
          isBookmarked: true,
          isLiked: true,
          likes: 312,
          isTravelerRecommended: true,
          isAIRecommended: true,
          safetyRating: 4.2,
          tags: ['waterfall', 'trekking', 'adventure', 'photography', 'secret-spot', 'swimming'],
          specialOffers: ['Free local guide on weekends'],
          averageSpend: 0
        }
      ]
    }
  ];

  const [savedRoutes, setSavedRoutes] = useState([
    { 
      id: '1',
      name: 'Mumbai to Goa Coastal Explorer', 
      distance: '450 km', 
      stops: 12, 
      likes: 245,
      difficulty: 'Easy',
      bestFor: 'Beach lovers',
      estimatedCost: '₹3,500',
      duration: '2-3 days',
      isAIOptimized: true,
      lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    { 
      id: '2',
      name: 'Delhi to Manali Mountain Adventure', 
      distance: '570 km', 
      stops: 18, 
      likes: 189,
      difficulty: 'Moderate',
      bestFor: 'Adventure seekers',
      estimatedCost: '₹4,200',
      duration: '3-4 days',
      isAIOptimized: false,
      lastUsed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    { 
      id: '3',
      name: 'Bangalore to Mysore Heritage Trail', 
      distance: '150 km', 
      stops: 8, 
      likes: 167,
      difficulty: 'Easy',
      bestFor: 'Culture enthusiasts',
      estimatedCost: '₹1,800',
      duration: '1-2 days',
      isAIOptimized: true,
      lastUsed: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [communityRoutes, setCommunityRoutes] = useState([
    { 
      id: '1',
      name: 'Kerala Backwaters Food Trail', 
      author: 'FoodieNomad99', 
      authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      distance: '380 km', 
      stops: 15, 
      likes: 534,
      difficulty: 'Easy',
      category: 'Food & Culture',
      estimatedCost: '₹5,200',
      duration: '4-5 days',
      featured: true,
      rating: 4.9,
      reviews: 89,
      tags: ['Food', 'Backwaters', 'Culture', 'Kerala'],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    { 
      id: '2',
      name: 'Rajasthan Hidden Gems Circuit', 
      author: 'DesertExplorer', 
      authorAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      distance: '720 km', 
      stops: 20, 
      likes: 389,
      difficulty: 'Challenging',
      category: 'Adventure',
      estimatedCost: '₹8,500',
      duration: '7-8 days',
      featured: false,
      rating: 4.7,
      reviews: 156,
      tags: ['Desert', 'Heritage', 'Adventure', 'Photography'],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    { 
      id: '3',
      name: 'Himachal Spiritual Journey', 
      author: 'MountainSoul', 
      authorAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      distance: '650 km', 
      stops: 12, 
      likes: 356,
      difficulty: 'Moderate',
      category: 'Spiritual',
      estimatedCost: '₹6,800',
      duration: '5-6 days',
      featured: true,
      rating: 4.8,
      reviews: 203,
      tags: ['Mountains', 'Spiritual', 'Peaceful', 'Meditation'],
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
    },
    { 
      id: '4',
      name: 'Tamil Nadu Temple Hopping', 
      author: 'TempleSeeker', 
      authorAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      distance: '450 km', 
      stops: 25, 
      likes: 298,
      difficulty: 'Easy',
      category: 'Religious',
      estimatedCost: '₹4,500',
      duration: '3-4 days',
      featured: false,
      rating: 4.6,
      reviews: 134,
      tags: ['Temples', 'Culture', 'Heritage', 'Architecture'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  // AI Recommendations
  const mockAIRecommendations: AIRecommendation[] = [
    {
      id: '1',
      type: 'weather-alert',
      title: 'Weather Update for Your Route',
      description: 'Light rain expected on Day 2. I suggest indoor activities and covered stops.',
      action: 'View weather-safe alternatives',
      priority: 'medium',
      icon: CloudSnow
    },
    {
      id: '2',
      type: 'hidden-gem',
      title: 'Secret Waterfall Discovered',
      description: 'Based on your adventure preferences, found an amazing hidden waterfall 8km from your route.',
      action: 'Add to itinerary',
      priority: 'high',
      icon: Star
    },
    {
      id: '3',
      type: 'cost-saving',
      title: 'Save ₹800 on Accommodation',
      description: 'Found a highly-rated homestay that\'s 25% cheaper than your current selection.',
      action: 'Compare options',
      priority: 'medium',
      icon: DollarSign
    },
    {
      id: '4',
      type: 'traffic-update',
      title: 'Route Optimization Available',
      description: 'I can save you 45 minutes by taking a scenic detour that avoids peak traffic.',
      action: 'Optimize route',
      priority: 'high',
      icon: Navigation
    }
  ];

  const quickRouteExamples = [
    { from: 'Mumbai', to: 'Goa', icon: '🏖️', category: 'Beach' },
    { from: 'Delhi', to: 'Manali', icon: '🏔️', category: 'Mountains' },
    { from: 'Bangalore', to: 'Mysore', icon: '🏛️', category: 'Heritage' },
    { from: 'Chennai', to: 'Pondicherry', icon: '🌊', category: 'Coastal' },
    { from: 'Pune', to: 'Lonavala', icon: '🌧️', category: 'Monsoon' },
    { from: 'Kolkata', to: 'Darjeeling', icon: '🚂', category: 'Hills' }
  ];

  useEffect(() => {
    setAiRecommendations(mockAIRecommendations);
  }, []);

  const handlePlanRoute = async () => {
    if (!routeForm.from || !routeForm.to) return;
    
    setIsPlanning(true);
    
    // Simulate AI-powered route planning
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setCurrentRoute(mockRoutes[0]);
    setIsPlanning(false);
    
    // Generate new AI recommendations based on the route
    setTimeout(() => {
      setAiRecommendations(mockAIRecommendations);
    }, 1000);
  };

  const handleQuickExample = (example: any) => {
    setRouteForm(prev => ({
      ...prev,
      from: example.from,
      to: example.to
    }));
  };

  const handleVoiceInput = () => {
    setIsVoiceInput(!isVoiceInput);
    if (!isVoiceInput) {
      // Simulate voice recognition
      setTimeout(() => {
        setVoiceCommand('Mumbai to Goa scenic route');
        setRouteForm(prev => ({
          ...prev,
          from: 'Mumbai',
          to: 'Goa'
        }));
        setIsVoiceInput(false);
      }, 3000);
    }
  };

  const sendAIMessage = () => {
    if (!aiChatInput.trim()) return;
    
    // Simulate AI response
    setTimeout(() => {
      setAiChatInput('');
    }, 500);
  };

  const togglePreference = (key: keyof RoutePreferences) => {
    setRoutePreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getStopIcon = (type: string) => {
    switch (type) {
      case 'food': return Utensils;
      case 'camping': return Tent;
      case 'parking': return Parking;
      case 'stay': return Home;
      case 'fuel': return Fuel;
      case 'hidden-gem': return Star;
      case 'attraction': return Camera;
      case 'emergency': return AlertTriangle;
      default: return MapPin;
    }
  };

  const getStopColor = (type: string) => {
    switch (type) {
      case 'food': return 'from-orange-400 to-red-500';
      case 'camping': return 'from-green-400 to-teal-500';
      case 'parking': return 'from-blue-400 to-cyan-500';
      case 'stay': return 'from-purple-400 to-pink-500';
      case 'fuel': return 'from-yellow-400 to-orange-500';
      case 'hidden-gem': return 'from-pink-400 to-rose-500';
      case 'attraction': return 'from-indigo-400 to-purple-500';
      case 'emergency': return 'from-red-500 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const filteredStops = currentRoute?.stops.filter(stop => {
    if (stop.type === 'food' && !routePreferences.showFood) return false;
    if (stop.type === 'camping' && !routePreferences.showCamping) return false;
    if (stop.type === 'parking' && !routePreferences.showParking) return false;
    if (stop.type === 'stay' && !routePreferences.showStays) return false;
    if (stop.type === 'fuel' && !routePreferences.showFuel) return false;
    if (stop.type === 'hidden-gem' && !routePreferences.showHiddenGems) return false;
    if (stop.type === 'attraction' && !routePreferences.showAttractions) return false;
    if (stop.type === 'emergency' && !routePreferences.showEmergency) return false;
    return true;
  });

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header with AI Assistant */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-white mb-2">Route Discovery</h1>
          <p className="text-gray-400 text-sm">AI-powered journey planning with hidden gems and perfect stops</p>
        </div>
        
        <button
          onClick={() => setShowAIChat(!showAIChat)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Bot className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* AI Assistant Panel */}
      {showAIChat && (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl border border-purple-400/30 p-4 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bot className="h-5 w-5 text-purple-400" />
            <h3 className="text-purple-400 font-medium">AI Travel Assistant</h3>
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={aiChatInput}
              onChange={(e) => setAiChatInput(e.target.value)}
              placeholder="Ask me about routes, hidden gems, or travel tips..."
              className="flex-1 px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
            />
            <button
              onClick={sendAIMessage}
              className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl border border-blue-400/30 p-4 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="h-5 w-5 text-blue-400" />
            <h3 className="text-blue-400 font-medium">AI Recommendations</h3>
          </div>
          
          <div className="space-y-3">
            {aiRecommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  rec.priority === 'high' ? 'bg-red-500/20' :
                  rec.priority === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
                }`}>
                  <rec.icon className={`h-4 w-4 ${
                    rec.priority === 'high' ? 'text-red-400' :
                    rec.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white text-sm font-medium">{rec.title}</h4>
                  <p className="text-gray-400 text-xs">{rec.description}</p>
                </div>
                {rec.action && (
                  <button className="text-blue-400 text-xs hover:text-blue-300 transition-colors">
                    {rec.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
          <Route className="h-4 w-4" />
          <span className="text-sm font-medium">AI Planner</span>
        </button>
        <button
          onClick={() => setActiveTab('saved-routes')}
          className={`flex items-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'saved-routes'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span className="text-sm font-medium">My Routes</span>
        </button>
        <button
          onClick={() => setActiveTab('community-routes')}
          className={`flex items-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'community-routes'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">Community</span>
        </button>
      </div>

      {/* Route Planner Tab */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {/* Quick Examples */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-4">
            <h3 className="text-white font-medium mb-4">Popular Routes</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickRouteExamples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickExample(example)}
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left"
                >
                  <span className="text-2xl">{example.icon}</span>
                  <div>
                    <div className="text-white text-sm font-medium">
                      {example.from} → {example.to}
                    </div>
                    <div className="text-gray-400 text-xs">{example.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Route Input Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Plan Your Journey</h2>
              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-full transition-colors ${
                  isVoiceInput ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
            
            {isVoiceInput && (
              <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="h-4 w-4 text-red-400 animate-pulse" />
                  <span className="text-red-400 text-sm font-medium">Listening...</span>
                </div>
                <p className="text-red-300 text-xs">Say something like "Mumbai to Goa scenic route"</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={routeForm.from}
                      onChange={(e) => setRouteForm(prev => ({ ...prev, from: e.target.value }))}
                      placeholder="Starting location"
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={routeForm.to}
                      onChange={(e) => setRouteForm(prev => ({ ...prev, to: e.target.value }))}
                      placeholder="Destination"
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Departure</label>
                  <input
                    type="date"
                    value={routeForm.departureDate}
                    onChange={(e) => setRouteForm(prev => ({ ...prev, departureDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Travelers</label>
                  <select
                    value={routeForm.travelers}
                    onChange={(e) => setRouteForm(prev => ({ ...prev, travelers: Number(e.target.value) }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value={1}>1 Traveler</option>
                    <option value={2}>2 Travelers</option>
                    <option value={3}>3 Travelers</option>
                    <option value={4}>4+ Travelers</option>
                  </select>
                </div>
              </div>

              {/* Enhanced Preferences Toggle */}
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="flex items-center justify-between w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white hover:border-white/20 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>AI Route Preferences</span>
                </span>
                {showPreferences ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {/* Enhanced Preferences Panel */}
              {showPreferences && (
                <div className="bg-black/20 rounded-2xl p-4 border border-white/10 space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-3">What to discover along your route:</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'showFood', label: 'Food Spots', icon: Utensils },
                        { key: 'showCamping', label: 'Camping', icon: Tent },
                        { key: 'showParking', label: 'Parking', icon: Parking },
                        { key: 'showStays', label: 'Stays', icon: Home },
                        { key: 'showFuel', label: 'Fuel Stations', icon: Fuel },
                        { key: 'showHiddenGems', label: 'Hidden Gems', icon: Star },
                        { key: 'showAttractions', label: 'Attractions', icon: Camera },
                        { key: 'showEmergency', label: 'Emergency', icon: AlertTriangle }
                      ].map((pref) => (
                        <button
                          key={pref.key}
                          onClick={() => togglePreference(pref.key as keyof RoutePreferences)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                            routePreferences[pref.key as keyof RoutePreferences]
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-400'
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          <pref.icon className="h-4 w-4" />
                          <span className="text-sm">{pref.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">AI Enhancement Options:</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">AI Assistance Level</span>
                        <select
                          value={routePreferences.aiAssistanceLevel}
                          onChange={(e) => setRoutePreferences(prev => ({ ...prev, aiAssistanceLevel: e.target.value as any }))}
                          className="px-3 py-1 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
                        >
                          <option value="minimal">Minimal</option>
                          <option value="moderate">Moderate</option>
                          <option value="maximum">Maximum</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Eco-Friendly Priority</span>
                        <button
                          onClick={() => togglePreference('prioritizeEco')}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            routePreferences.prioritizeEco ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'
                          }`}
                        >
                          {routePreferences.prioritizeEco ? 'On' : 'Off'}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Avoid Crowds</span>
                        <button
                          onClick={() => togglePreference('avoidCrowds')}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            routePreferences.avoidCrowds ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400'
                          }`}
                        >
                          {routePreferences.avoidCrowds ? 'On' : 'Off'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Max detour distance: {routePreferences.maxDetourDistance} km
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={routePreferences.maxDetourDistance}
                      onChange={(e) => setRoutePreferences(prev => ({ ...prev, maxDetourDistance: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Budget</label>
                      <select
                        value={routePreferences.budgetRange}
                        onChange={(e) => setRoutePreferences(prev => ({ ...prev, budgetRange: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="budget">Budget</option>
                        <option value="mid">Mid-range</option>
                        <option value="luxury">Luxury</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Travel Style</label>
                      <select
                        value={routePreferences.travelStyle}
                        onChange={(e) => setRoutePreferences(prev => ({ ...prev, travelStyle: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="comfort">Comfort</option>
                        <option value="adventure">Adventure</option>
                        <option value="cultural">Cultural</option>
                        <option value="nature">Nature</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handlePlanRoute}
                disabled={isPlanning || !routeForm.from || !routeForm.to}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isPlanning ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>AI is Planning Your Route...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Plan Route with AI Discoveries</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Planning Progress */}
          {isPlanning && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <h3 className="text-white font-medium mb-4">AI is discovering amazing stops along your route...</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Route calculation</span>
                  <span className="text-cyan-400">Complete ✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Finding hidden gems</span>
                  <span className="text-yellow-400">In progress...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Analyzing food spots</span>
                  <span className="text-yellow-400">Processing...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Weather optimization</span>
                  <span className="text-gray-500">Pending</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Safety verification</span>
                  <span className="text-gray-500">Pending</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cost optimization</span>
                  <span className="text-gray-500">Pending</span>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Route Results */}
          {currentRoute && (
            <div className="space-y-4">
              {/* Route Overview */}
              <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 backdrop-blur-sm rounded-3xl p-6 border border-green-400/30">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <h2 className="text-xl font-bold text-white">{currentRoute.name}</h2>
                  {currentRoute.aiOptimized && (
                    <div className="bg-purple-500/20 px-2 py-1 rounded-full">
                      <span className="text-purple-400 text-xs font-medium">AI Optimized</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{currentRoute.distance} km</div>
                    <div className="text-sm text-gray-400">Total Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{currentRoute.estimatedTime}h</div>
                    <div className="text-sm text-gray-400">Est. Time</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{filteredStops?.length}</div>
                    <div className="text-xs text-gray-400">Discoveries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">₹{currentRoute.totalCost}</div>
                    <div className="text-xs text-gray-400">Est. Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">{currentRoute.safetyAlerts}</div>
                    <div className="text-xs text-gray-400">Safety Alerts</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-400">{currentRoute.carbonFootprint} kg CO₂</div>
                    <div className="text-xs text-gray-400">Carbon Footprint</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-400">{currentRoute.fuelEfficiency} km/l</div>
                    <div className="text-xs text-gray-400">Fuel Efficiency</div>
                  </div>
                </div>

                <div className="flex space-x-2 mb-4">
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-xl text-white font-medium">
                    <Download className="h-4 w-4 inline mr-2" />
                    Save Route
                  </button>
                  <button className="flex-1 bg-white/10 px-4 py-2 rounded-xl text-gray-300 hover:bg-white/20 transition-colors">
                    <Share className="h-4 w-4 inline mr-2" />
                    Share
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentRoute.weatherConditions.map((condition, index) => (
                    <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                      {condition === 'Sunny' && <Sun className="h-3 w-3 inline mr-1" />}
                      {condition === 'Cloudy' && <CloudSnow className="h-3 w-3 inline mr-1" />}
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Map */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Interactive Route Map</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white text-sm">
                      <Eye className="h-3 w-3 inline mr-1" />
                      3D View
                    </button>
                    <button className="px-3 py-1 bg-white/10 rounded-full text-gray-300 text-sm hover:bg-white/20 transition-colors">
                      <Navigation className="h-3 w-3 inline mr-1" />
                      Directions
                    </button>
                  </div>
                </div>
                
                <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
                  <div className="text-center z-10">
                    <Map className="h-12 w-12 text-cyan-400 mx-auto mb-2" />
                    <div className="text-white font-medium">Interactive Map View</div>
                    <div className="text-gray-400 text-sm">Route: {currentRoute.from} → {currentRoute.to}</div>
                    <div className="text-cyan-400 text-xs mt-1">✨ AI-Optimized Route</div>
                  </div>
                  
                  {/* Enhanced route markers */}
                  <div className="absolute top-4 left-8 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute top-12 left-16 w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="absolute top-8 right-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-8 right-8 w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute bottom-12 left-12 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                </div>
              </div>

              {/* Enhanced Discoveries Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">AI Discoveries Along Your Route</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-400 text-sm">
                      <Brain className="h-3 w-3 inline mr-1" />
                      AI Picks
                    </button>
                    <button className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-400 text-sm">
                      <Users className="h-3 w-3 inline mr-1" />
                      Traveler Favorites
                    </button>
                  </div>
                </div>
                
                {filteredStops?.map((stop, index) => {
                  const IconComponent = getStopIcon(stop.type);
                  return (
                    <div key={stop.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getStopColor(stop.type)} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="text-white font-semibold">{stop.name}</h4>
                                {stop.isAIRecommended && (
                                  <div className="bg-purple-500/20 px-2 py-1 rounded-full">
                                    <span className="text-purple-400 text-xs font-medium">AI Pick</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <MapPin className="h-3 w-3" />
                                <span>{stop.location}</span>
                                <span>• {stop.distanceFromRoute}km detour</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedStop(stop)}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                              >
                                <Eye className="h-4 w-4 text-gray-400" />
                              </button>
                              
                              <button className={`p-2 rounded-full transition-colors ${
                                stop.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                              }`}>
                                <Bookmark className={`h-4 w-4 ${stop.isBookmarked ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>

                          <p className="text-gray-300 text-sm mb-3">{stop.description}</p>

                          {/* Special Offers */}
                          {stop.specialOffers && stop.specialOffers.length > 0 && (
                            <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-2 mb-3">
                              <div className="flex items-center space-x-1 mb-1">
                                <Gift className="h-3 w-3 text-green-400" />
                                <span className="text-green-400 text-xs font-medium">Special Offers</span>
                              </div>
                              {stop.specialOffers.map((offer, i) => (
                                <div key={i} className="text-green-300 text-xs">• {offer}</div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-yellow-400 text-sm">{stop.rating}</span>
                                <span className="text-gray-400 text-xs">({stop.reviews})</span>
                              </div>
                              
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                stop.price === 'free' ? 'bg-green-500/20 text-green-400' :
                                stop.price === '$' ? 'bg-blue-500/20 text-blue-400' :
                                stop.price === '$$' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {stop.price === 'free' ? 'Free' : stop.price}
                              </span>

                              <div className={`flex items-center space-x-1 text-xs ${
                                stop.isOpen ? 'text-green-400' : 'text-red-400'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${stop.isOpen ? 'bg-green-400' : 'bg-red-400'}`} />
                                <span>{stop.isOpen ? 'Open' : 'Closed'}</span>
                              </div>

                              {stop.averageSpend && (
                                <span className="text-gray-400 text-xs">
                                  ~₹{stop.averageSpend} avg
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              {stop.isTravelerRecommended && (
                                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-2 py-1 rounded-full">
                                  <span className="text-cyan-400 text-xs font-medium">Traveler Pick</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {stop.amenities.slice(0, 4).map((amenity, i) => (
                              <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                                {amenity}
                              </span>
                            ))}
                            {stop.amenities.length > 4 && (
                              <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                                +{stop.amenities.length - 4} more
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <button className={`flex items-center space-x-1 transition-colors ${
                                stop.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                              }`}>
                                <Heart className={`h-4 w-4 ${stop.isLiked ? 'fill-current' : ''}`} />
                                <span className="text-sm">{stop.likes}</span>
                              </button>
                              
                              <button className="text-gray-400 hover:text-blue-400 transition-colors">
                                <MessageCircle className="h-4 w-4" />
                              </button>

                              {stop.contact && (
                                <button className="text-gray-400 hover:text-green-400 transition-colors">
                                  <Phone className="h-4 w-4" />
                                </button>
                              )}

                              <button className="text-gray-400 hover:text-purple-400 transition-colors">
                                <Share className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors flex items-center space-x-1">
                              <Plus className="h-3 w-3" />
                              <span>Add to Route</span>
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

      {/* Enhanced Saved Routes Tab */}
      {activeTab === 'saved-routes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Your Saved Routes</h2>
            <div className="flex space-x-2">
              <button className="text-cyan-400 text-sm">Sort by Recent</button>
              <button className="text-gray-400 text-sm">Filter</button>
            </div>
          </div>
          
          {savedRoutes.map((route, index) => (
            <div key={route.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-white font-medium">{route.name}</h3>
                    {route.isAIOptimized && (
                      <div className="bg-purple-500/20 px-2 py-1 rounded-full">
                        <span className="text-purple-400 text-xs font-medium">AI</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    <span>{route.distance}</span>
                    <span>{route.stops} stops</span>
                    <span>{route.duration}</span>
                    <span className="text-green-400">{route.estimatedCost}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span className={`px-2 py-1 rounded-full ${
                      route.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      route.difficulty === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {route.difficulty}
                    </span>
                    <span>Best for: {route.bestFor}</span>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-pink-400 fill-current" />
                      <span>{route.likes}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">Open</button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                Last used: {route.lastUsed.toLocaleDateString()}
              </div>
            </div>
          ))}
          
          {savedRoutes.length === 0 && (
            <div className="text-center py-12">
              <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Saved Routes</h3>
              <p className="text-gray-400 text-sm">Plan your first route to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Community Routes Tab */}
      {activeTab === 'community-routes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Community Routes</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full text-orange-400 text-sm">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Trending
              </button>
              <button className="text-gray-400 text-sm">Filter</button>
            </div>
          </div>

          {/* Featured Routes */}
          <div className="space-y-3">
            {communityRoutes.filter(route => route.featured).map((route) => (
              <div key={route.id} className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl border border-orange-400/30 p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Award className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400 text-sm font-medium">Featured Route</span>
                </div>
                <CommunityRouteCard route={route} />
              </div>
            ))}
          </div>

          {/* Regular Routes */}
          <div className="space-y-4">
            {communityRoutes.filter(route => !route.featured).map((route) => (
              <div key={route.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300">
                <CommunityRouteCard route={route} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Stop Detail Modal */}
      {selectedStop && (
        <StopDetailModal stop={selectedStop} onClose={() => setSelectedStop(null)} />
      )}
    </div>
  );
}

function CommunityRouteCard({ route }: { route: any }) {
  return (
    <div>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white font-medium text-lg mb-1">{route.name}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <img
              src={route.authorAvatar}
              alt={route.author}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-cyan-400 text-sm">by {route.author}</span>
            <span className="text-gray-400 text-xs">• {route.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
            <span>{route.distance}</span>
            <span>{route.stops} stops</span>
            <span>{route.duration}</span>
            <span className="text-green-400">{route.estimatedCost}</span>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-yellow-400 text-sm">{route.rating}</span>
            <span className="text-gray-400 text-xs">({route.reviews} reviews)</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              route.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
              route.difficulty === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {route.difficulty}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {route.tags.map((tag: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4 text-pink-400 fill-current" />
            <span className="text-pink-400 text-sm">{route.likes}</span>
          </div>
          <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
            Copy Route
          </button>
        </div>
      </div>
    </div>
  );
}

function StopDetailModal({ stop, onClose }: { stop: RouteStop; onClose: () => void }) {
  const IconComponent = getStopIcon(stop.type);
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white">{stop.name}</h2>
              {stop.isAIRecommended && (
                <div className="bg-purple-500/20 px-2 py-1 rounded-full">
                  <span className="text-purple-400 text-xs font-medium">AI Pick</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="mb-4">
            <img
              src={stop.image}
              alt={stop.name}
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Description</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{stop.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-medium mb-2">Location</h3>
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{stop.location}</span>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Hours</h3>
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{stop.hours}</span>
                </div>
              </div>
            </div>

            {stop.specialOffers && stop.specialOffers.length > 0 && (
              <div>
                <h3 className="text-white font-medium mb-2">Special Offers</h3>
                <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-3">
                  {stop.specialOffers.map((offer, index) => (
                    <div key={index} className="flex items-center space-x-2 text-green-400 text-sm">
                      <Gift className="h-3 w-3" />
                      <span>{offer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-white font-medium mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {stop.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {stop.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-yellow-400 text-sm">{stop.rating}</span>
                <span className="text-gray-400 text-sm">({stop.reviews} reviews)</span>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm text-center ${
                stop.price === 'free' ? 'bg-green-500/20 text-green-400' :
                stop.price === '$' ? 'bg-blue-500/20 text-blue-400' :
                stop.price === '$$' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {stop.price === 'free' ? 'Free' : `${stop.price} • ~₹${stop.averageSpend}`}
              </span>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Navigation className="h-5 w-5 inline mr-2" />
                Get Directions
              </button>
              
              {stop.contact && (
                <button className="px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStopIcon(type: string) {
  switch (type) {
    case 'food': return Utensils;
    case 'camping': return Tent;
    case 'parking': return Parking;
    case 'stay': return Home;
    case 'fuel': return Fuel;
    case 'hidden-gem': return Star;
    case 'attraction': return Camera;
    case 'emergency': return AlertTriangle;
    default: return MapPin;
  }
}

export default RouteDiscoveryPage;