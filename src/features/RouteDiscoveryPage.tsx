import React, { useState, useRef, useEffect } from 'react';
import { Navigation, MapPin, Clock, Star, Heart, Share, Plus, Filter, Search, Bot, Mic, Send, Car, Train, Plane, Footprints, Utensils, Coffee, Bed, Camera, Fuel, TreePine, AlertTriangle, Users, Calendar, DollarSign, Map, Eye, Play, Bookmark, ThumbsUp, MessageCircle, Award, Zap, RouteIcon, Volume2, VolumeX, Settings, Target, Compass, Globe, TrendingUp, CheckCircle, Info, ArrowRight, RefreshCw, Sparkles, CloudLightning as Lightning, MapPinIcon } from 'lucide-react';

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
  openingHours?: string;
  contactInfo?: string;
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
  type: 'text' | 'route' | 'recommendations' | 'analysis' | 'suggestions';
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

  const [myFootprints] = useState(mockSavedRoutes);
  const [friendsFootprints] = useState(mockCommunityRoutes);

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

  const generateRouteStops = (from: string, to: string, preferences: string[]) => {
    const baseStops: RouteStop[] = [];
    
    // Generate route-specific stops based on the route
    if (from.toLowerCase().includes('pune') && to.toLowerCase().includes('lonavala')) {
      // Pune to Lonavala route
      if (preferences.includes('food')) {
        baseStops.push({
          id: '1',
          name: 'Sunny Da Dhaba',
          type: 'food',
          location: 'Khandala, Maharashtra',
          coordinates: { lat: 18.7469, lng: 73.4831 },
          rating: 4.5,
          reviews: 456,
          priceRange: '₹200-400',
          distance: 35,
          estimatedTime: '45m',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Famous roadside dhaba serving authentic Maharashtrian cuisine with stunning valley views',
          specialOffers: ['Free chai with main course', '20% off for groups of 4+'],
          isHiddenGem: true,
          safetyRating: 4.8,
          carbonFootprint: 'Low impact',
          openingHours: '6:00 AM - 11:00 PM',
          contactInfo: '+91 98765 43210'
        });
      }

      if (preferences.includes('stay')) {
        baseStops.push({
          id: '2',
          name: 'Hill Station Resort & Spa',
          type: 'stay',
          location: 'Lonavala, Maharashtra',
          coordinates: { lat: 18.7537, lng: 73.4135 },
          rating: 4.7,
          reviews: 289,
          priceRange: '₹3000-6000',
          distance: 64,
          estimatedTime: '1h 30m',
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Luxury resort with panoramic hill views, spa services, and infinity pool',
          specialOffers: ['Early check-in free', 'Complimentary breakfast', 'Spa discount 30%'],
          safetyRating: 4.9,
          carbonFootprint: 'Eco-friendly certified',
          openingHours: '24/7',
          contactInfo: '+91 98765 43211'
        });
      }

      if (preferences.includes('attractions')) {
        baseStops.push({
          id: '3',
          name: 'Karla Caves',
          type: 'attraction',
          location: 'Karla, Maharashtra',
          coordinates: { lat: 18.7469, lng: 73.4831 },
          rating: 4.6,
          reviews: 567,
          priceRange: '₹50 entry',
          distance: 50,
          estimatedTime: '1h 15m',
          image: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Ancient Buddhist rock-cut caves dating back to 2nd century BCE with intricate carvings',
          isHiddenGem: true,
          safetyRating: 4.5,
          carbonFootprint: 'Zero impact',
          openingHours: '9:00 AM - 5:30 PM',
          contactInfo: 'Archaeological Survey of India'
        });
      }

      if (preferences.includes('fuel')) {
        baseStops.push({
          id: '4',
          name: 'Highway Fuel Station',
          type: 'fuel',
          location: 'Mumbai-Pune Highway',
          coordinates: { lat: 18.7200, lng: 73.4000 },
          rating: 4.2,
          reviews: 123,
          priceRange: '₹95-105/L',
          distance: 25,
          estimatedTime: '30m',
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Modern fuel station with convenience store and clean restrooms',
          specialOffers: ['Loyalty points', 'Free car wash with full tank'],
          safetyRating: 4.8,
          carbonFootprint: 'Standard',
          openingHours: '24/7',
          contactInfo: '+91 1800 XXX XXXX'
        });
      }

      if (preferences.includes('camping')) {
        baseStops.push({
          id: '5',
          name: 'Pawna Lake Camping',
          type: 'camping',
          location: 'Pawna Lake, Maharashtra',
          coordinates: { lat: 18.7469, lng: 73.4831 },
          rating: 4.4,
          reviews: 234,
          priceRange: '₹1200-2500',
          distance: 55,
          estimatedTime: '1h 20m',
          image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Lakeside camping with tents, bonfire, barbecue, and stargazing activities',
          specialOffers: ['Equipment included', 'Group discounts', 'Free breakfast'],
          safetyRating: 4.3,
          carbonFootprint: 'Minimal impact',
          openingHours: 'Check-in: 2:00 PM, Check-out: 11:00 AM',
          contactInfo: '+91 98765 43212'
        });
      }
    } else {
      // Generate generic stops for other routes
      if (preferences.includes('food')) {
        baseStops.push({
          id: 'f1',
          name: 'Local Food Paradise',
          type: 'food',
          location: `Highway near ${to}`,
          coordinates: { lat: 19.0760, lng: 72.8777 },
          rating: 4.6,
          reviews: 345,
          priceRange: '₹150-350',
          distance: Math.floor(Math.random() * 50) + 20,
          estimatedTime: `${Math.floor(Math.random() * 60) + 30}m`,
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Authentic local cuisine with traditional recipes and fresh ingredients',
          specialOffers: ['Family meals discount', 'Free dessert'],
          isHiddenGem: Math.random() > 0.5,
          safetyRating: 4.5,
          carbonFootprint: 'Low impact'
        });
      }

      if (preferences.includes('stay')) {
        baseStops.push({
          id: 's1',
          name: 'Comfort Inn & Suites',
          type: 'stay',
          location: `${to} City Center`,
          coordinates: { lat: 19.0760, lng: 72.8777 },
          rating: 4.3,
          reviews: 189,
          priceRange: '₹2500-4500',
          distance: Math.floor(Math.random() * 30) + 40,
          estimatedTime: `${Math.floor(Math.random() * 30) + 60}m`,
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Modern hotel with excellent amenities and convenient location',
          specialOffers: ['Free WiFi', 'Breakfast included', 'Parking available'],
          safetyRating: 4.7,
          carbonFootprint: 'Eco-friendly'
        });
      }

      if (preferences.includes('attractions')) {
        baseStops.push({
          id: 'a1',
          name: 'Historic Landmark',
          type: 'attraction',
          location: `${to} Heritage Site`,
          coordinates: { lat: 19.0760, lng: 72.8777 },
          rating: 4.8,
          reviews: 678,
          priceRange: '₹100-200',
          distance: Math.floor(Math.random() * 20) + 45,
          estimatedTime: `${Math.floor(Math.random() * 45) + 75}m`,
          image: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Must-visit historical site with rich cultural heritage and architecture',
          isHiddenGem: Math.random() > 0.7,
          safetyRating: 4.4,
          carbonFootprint: 'Zero impact'
        });
      }
    }

    return baseStops;
  };

  const handlePlanRoute = async () => {
    if (!routeData.from || !routeData.to) {
      alert('Please enter both starting location and destination');
      return;
    }
    
    setIsGenerating(true);
    setShowAIAssistant(true);
    
    // Add initial AI message
    const initialMessage: AIMessage = {
      id: Date.now().toString(),
      content: `🤖 Analyzing your route from ${routeData.from} to ${routeData.to}...`,
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
    
    setAiMessages([initialMessage]);
    
    // Simulate AI processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate route stops based on preferences
    const generatedStops = generateRouteStops(routeData.from, routeData.to, routeData.preferences);
    
    // Calculate route statistics
    const totalDistance = generatedStops.reduce((sum, stop) => sum + stop.distance, 0);
    const totalTime = Math.floor(totalDistance / 50 * 60); // Assuming average 50km/h
    const estimatedCost = Math.floor(totalDistance * 8 + generatedStops.length * 200); // Fuel + stops
    
    const routeAnalysis: AIMessage = {
      id: (Date.now() + 1).toString(),
      content: `🎯 Perfect! I've analyzed your route and found ${generatedStops.length} amazing stops based on your preferences for ${routeData.preferences.join(', ')}.`,
      isUser: false,
      timestamp: new Date(),
      type: 'route',
      data: {
        route: generatedStops,
        totalDistance: `${totalDistance}km`,
        estimatedTime: `${Math.floor(totalTime / 60)}h ${totalTime % 60}m`,
        estimatedCost: `₹${estimatedCost}`,
        highlights: [
          `${generatedStops.filter(s => s.isHiddenGem).length} hidden gems`,
          `${generatedStops.filter(s => s.specialOffers?.length).length} special offers`,
          `${generatedStops.filter(s => s.rating >= 4.5).length} highly rated spots`
        ],
        preferences: routeData.preferences,
        travelers: routeData.travelers,
        departureDate: routeData.departure
      }
    };
    
    setAiMessages(prev => [...prev, routeAnalysis]);
    setGeneratedRoute(generatedStops);
    
    // Add follow-up suggestions after a short delay
    setTimeout(() => {
      const suggestionsMessage: AIMessage = {
        id: (Date.now() + 2).toString(),
        content: "💡 I can help you with more details about any of these stops, suggest alternative routes, find budget options, or plan timing for your journey. What would you like to explore?",
        isUser: false,
        timestamp: new Date(),
        type: 'suggestions',
        data: {
          suggestions: [
            'Tell me more about hidden gems',
            'Find budget-friendly alternatives',
            'Optimize timing for each stop',
            'Add more attractions nearby',
            'Check weather conditions',
            'Find group discounts'
          ]
        }
      };
      
      setAiMessages(prev => [...prev, suggestionsMessage]);
    }, 1500);
    
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
    const currentInput = aiInput;
    setAiInput('');
    
    // Show thinking indicator
    const thinkingMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      content: '🤔 Let me help you with that...',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
    
    setAiMessages(prev => [...prev, thinkingMessage]);
    
    // Generate contextual AI response based on input
    setTimeout(() => {
      let aiResponse: AIMessage;
      const input = currentInput.toLowerCase();
      
      if (input.includes('hidden') || input.includes('gem')) {
        aiResponse = {
          id: (Date.now() + 2).toString(),
          content: `🏆 Great question! I found ${generatedRoute?.filter(s => s.isHiddenGem).length || 2} hidden gems on your route that most travelers miss:`,
          isUser: false,
          timestamp: new Date(),
          type: 'recommendations',
          data: {
            recommendations: generatedRoute?.filter(s => s.isHiddenGem).map(stop => ({
              name: stop.name,
              type: stop.type,
              description: stop.description,
              specialNote: 'Local favorite - not in guidebooks!'
            })) || []
          }
        };
      } else if (input.includes('budget') || input.includes('cheap') || input.includes('cost')) {
        aiResponse = {
          id: (Date.now() + 2).toString(),
          content: `💰 I can help you save money! Here are budget-friendly options for your route:`,
          isUser: false,
          timestamp: new Date(),
          type: 'analysis',
          data: {
            budgetTips: [
              'Choose local dhabas over restaurants - save ₹200-500 per meal',
              'Book accommodation in advance for 30% discount',
              'Travel on weekdays to avoid weekend surcharges',
              'Look for group packages at camping sites',
              'Use fuel reward programs for additional savings'
            ],
            totalSavings: '₹800-1200'
          }
        };
      } else if (input.includes('time') || input.includes('timing') || input.includes('schedule')) {
        aiResponse = {
          id: (Date.now() + 2).toString(),
          content: `⏰ Perfect timing is crucial! Here's my recommended schedule for your ${routeData.from} to ${routeData.to} journey:`,
          isUser: false,
          timestamp: new Date(),
          type: 'analysis',
          data: {
            schedule: [
              '7:00 AM - Start journey (avoid rush hour)',
              '9:30 AM - First food stop & fuel',
              '12:00 PM - Lunch at scenic location',
              '2:30 PM - Main attraction visit',
              '5:00 PM - Reach destination/check-in',
              '7:00 PM - Evening exploration'
            ],
            tips: [
              'Start early to enjoy cooler weather',
              'Plan lunch stops with good views',
              'Avoid peak traffic hours (8-10 AM, 6-8 PM)'
            ]
          }
        };
      } else if (input.includes('weather') || input.includes('climate')) {
        aiResponse = {
          id: (Date.now() + 2).toString(),
          content: `🌤️ Weather update for your route! Here's what to expect:`,
          isUser: false,
          timestamp: new Date(),
          type: 'analysis',
          data: {
            weather: {
              departure: 'Partly cloudy, 24°C - Perfect for travel',
              route: 'Clear skies expected, visibility excellent',
              destination: 'Pleasant weather, 22°C - Ideal for sightseeing'
            },
            recommendations: [
              'Carry light jacket for evening',
              'Perfect weather for outdoor activities',
              'Great visibility for scenic photography'
            ]
          }
        };
      } else {
        // Generic helpful response
        const responses = [
          `🚗 That's a great point about your ${routeData.from} to ${routeData.to} trip! Based on your preferences for ${routeData.preferences.join(', ')}, I recommend focusing on the highest-rated stops first.`,
          `🌟 Excellent question! For your route, I'd suggest taking the scenic path and allowing extra time at ${generatedRoute?.[0]?.name || 'the first stop'} - it's rated ${generatedRoute?.[0]?.rating || '4.5'}/5 by travelers.`,
          `💡 Smart thinking! Given you're traveling with ${routeData.travelers} ${routeData.travelers === 1 ? 'person' : 'people'}, I can suggest group-friendly stops and family discounts along your route.`,
          `🎯 Great insight! The route I've planned includes local favorites and traveler-tested spots. Would you like me to add more specific types of stops or adjust the timing?`
        ];
        
        aiResponse = {
          id: (Date.now() + 2).toString(),
          content: responses[Math.floor(Math.random() * responses.length)],
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        };
      }
      
      // Remove thinking message and add real response
      setAiMessages(prev => {
        const filtered = prev.filter(msg => msg.content !== '🤔 Let me help you with that...');
        return [...filtered, aiResponse];
      });
    }, 1000 + Math.random() * 1000);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition simulation
    if (!isListening) {
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
                                <CheckCircle className="h-3 w-3 text-blue-400" />
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
                    onClick={() => {
                      setAiInput("Find me hidden food spots between Mumbai and Goa");
                      handleAISend();
                    }}
                    className="w-full text-left p-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition-colors"
                  >
                    "Find hidden food spots on my route"
                  </button>
                  <button
                    onClick={() => {
                      setAiInput("What's the best time to travel to avoid traffic?");
                      handleAISend();
                    }}
                    className="w-full text-left p-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition-colors"
                  >
                    "Best time to avoid traffic?"
                  </button>
                  <button
                    onClick={() => {
                      setAiInput("Show me budget-friendly options");
                      handleAISend();
                    }}
                    className="w-full text-left p-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition-colors"
                  >
                    "Show me budget-friendly options"
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
                        <div>📍 Distance: {message.data.totalDistance}</div>
                        <div>⏱️ Time: {message.data.estimatedTime}</div>
                        <div>💰 Cost: {message.data.estimatedCost}</div>
                        <div className="text-cyan-300">✨ {message.data.highlights.join(', ')}</div>
                      </div>
                    </div>
                  )}

                  {message.type === 'recommendations' && message.data && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="space-y-2">
                        {message.data.recommendations.map((rec: any, idx: number) => (
                          <div key={idx} className="bg-black/20 rounded-lg p-2">
                            <div className="text-xs font-medium text-cyan-300">{rec.name}</div>
                            <div className="text-xs text-gray-300">{rec.description}</div>
                            {rec.specialNote && (
                              <div className="text-xs text-orange-300 mt-1">💎 {rec.specialNote}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {message.type === 'analysis' && message.data && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      {message.data.budgetTips && (
                        <div className="space-y-1">
                          {message.data.budgetTips.map((tip: string, idx: number) => (
                            <div key={idx} className="text-xs text-green-300">💡 {tip}</div>
                          ))}
                          {message.data.totalSavings && (
                            <div className="text-xs text-green-400 font-medium mt-2">
                              💰 Total Savings: {message.data.totalSavings}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {message.data.schedule && (
                        <div className="space-y-1">
                          {message.data.schedule.map((item: string, idx: number) => (
                            <div key={idx} className="text-xs text-blue-300">🕐 {item}</div>
                          ))}
                        </div>
                      )}

                      {message.data.weather && (
                        <div className="space-y-1">
                          <div className="text-xs text-blue-300">🌤️ Start: {message.data.weather.departure}</div>
                          <div className="text-xs text-blue-300">🛣️ Route: {message.data.weather.route}</div>
                          <div className="text-xs text-blue-300">🎯 Destination: {message.data.weather.destination}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {message.type === 'suggestions' && message.data && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="grid grid-cols-1 gap-1">
                        {message.data.suggestions.map((suggestion: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setAiInput(suggestion);
                              handleAISend();
                            }}
                            className="text-left p-2 bg-black/20 rounded-lg text-xs hover:bg-black/40 transition-colors text-cyan-300"
                          >
                            💭 {suggestion}
                          </button>
                        ))}
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
                disabled={!aiInput.trim()}
                className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
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
                <p className="text-sm mt-2">Showing route: {routeData.from} → {routeData.to}</p>
                {generatedRoute && (
                  <p className="text-sm mt-1">With {generatedRoute.length} discovered stops</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteDiscoveryPage;