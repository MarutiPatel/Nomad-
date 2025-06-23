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
    // India Routes
    { from: 'Mumbai', to: 'Goa', distance: '463 km', time: '8h 30m', type: 'coastal', flag: '🇮🇳' },
    { from: 'Delhi', to: 'Manali', distance: '570 km', time: '12h', type: 'mountain', flag: '🇮🇳' },
    { from: 'Bangalore', to: 'Coorg', distance: '252 km', time: '5h 30m', type: 'nature', flag: '🇮🇳' },
    { from: 'Pune', to: 'Lonavala', distance: '64 km', time: '1h 30m', type: 'weekend', flag: '🇮🇳' },
    
    // USA Routes
    { from: 'New York', to: 'Boston', distance: '215 miles', time: '4h 30m', type: 'coastal', flag: '🇺🇸' },
    { from: 'Los Angeles', to: 'San Francisco', distance: '383 miles', time: '6h', type: 'scenic', flag: '🇺🇸' },
    { from: 'Las Vegas', to: 'Grand Canyon', distance: '280 miles', time: '4h 15m', type: 'nature', flag: '🇺🇸' },
    { from: 'Miami', to: 'Key West', distance: '165 miles', time: '3h 30m', type: 'tropical', flag: '🇺🇸' },
    { from: 'Seattle', to: 'Portland', distance: '173 miles', time: '3h', type: 'urban', flag: '🇺🇸' },
    
    // Europe Routes
    { from: 'Paris', to: 'Amsterdam', distance: '515 km', time: '5h 30m', type: 'cultural', flag: '🇪🇺' },
    { from: 'Rome', to: 'Florence', distance: '272 km', time: '3h', type: 'heritage', flag: '🇮🇹' },
    { from: 'London', to: 'Edinburgh', distance: '666 km', time: '8h', type: 'historic', flag: '🇬🇧' },
    { from: 'Barcelona', to: 'Valencia', distance: '349 km', time: '4h', type: 'mediterranean', flag: '🇪🇸' },
    { from: 'Munich', to: 'Salzburg', distance: '150 km', time: '2h', type: 'alpine', flag: '🇩🇪' },
    { from: 'Vienna', to: 'Prague', distance: '291 km', time: '4h', type: 'royal', flag: '🇪🇺' }
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
      name: 'California Coast Adventure',
      from: 'Los Angeles',
      to: 'San Francisco',
      distance: 383,
      duration: '6h',
      stops: 15,
      lastUsed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      timesUsed: 2,
      estimatedCost: '$280',
      difficulty: 'moderate',
      tags: ['pacific', 'coast', 'scenic']
    },
    {
      id: '3',
      name: 'European Art Trail',
      from: 'Paris',
      to: 'Amsterdam',
      distance: 515,
      duration: '5h 30m',
      stops: 8,
      lastUsed: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      timesUsed: 1,
      estimatedCost: '€195',
      difficulty: 'easy',
      tags: ['art', 'culture', 'museums']
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
      title: 'Pacific Coast Highway Magic',
      author: 'USRoadTripper',
      authorAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      from: 'Los Angeles',
      to: 'San Francisco',
      distance: 383,
      duration: '6h',
      stops: 18,
      rating: 4.9,
      reviews: 89,
      likes: 156,
      isLiked: true,
      difficulty: 'moderate',
      tags: ['ocean', 'cliffs', 'wine'],
      description: 'Iconic coastal drive with Big Sur highlights and wine country',
      estimatedCost: '$350',
      isFeatured: true,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Romantic Rhine Valley Journey',
      author: 'EuropeNomad',
      authorAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      from: 'Amsterdam',
      to: 'Munich',
      distance: 625,
      duration: '7h',
      stops: 12,
      rating: 4.7,
      reviews: 67,
      likes: 134,
      isLiked: false,
      difficulty: 'moderate',
      tags: ['castles', 'rivers', 'culture'],
      description: 'Fairy-tale route through German castles and Dutch countryside',
      estimatedCost: '€280',
      isFeatured: true,
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
    }
  ];

  // Enhanced route stops with international locations
  const getRouteStopsForDestination = (from: string, to: string): RouteStop[] => {
    // India Routes
    if (from.toLowerCase().includes('pune') && to.toLowerCase().includes('lonavala')) {
      return [
        {
          id: '1',
          name: 'Highway Dhaba Delight',
          type: 'food',
          location: 'Khandala, Maharashtra',
          coordinates: { lat: 18.7469, lng: 73.4831 },
          rating: 4.5,
          reviews: 234,
          priceRange: '₹150-300',
          distance: 45,
          estimatedTime: '1h',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Authentic Punjabi food with scenic valley views',
          specialOffers: ['Free chai with meal', '20% off for groups'],
          isHiddenGem: true,
          safetyRating: 4.8,
          carbonFootprint: 'Low impact'
        },
        {
          id: '2',
          name: 'Karla Cave Resort',
          type: 'stay',
          location: 'Karla, Maharashtra',
          coordinates: { lat: 18.7469, lng: 73.4831 },
          rating: 4.7,
          reviews: 89,
          priceRange: '₹2000-4000',
          distance: 35,
          estimatedTime: '45m',
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Heritage resort near ancient Buddhist caves',
          specialOffers: ['Cave tour included', 'Complimentary breakfast'],
          safetyRating: 4.9,
          carbonFootprint: 'Eco-friendly'
        },
        {
          id: '3',
          name: 'Pawna Lake Camping',
          type: 'camping',
          location: 'Pawna Lake, Maharashtra',
          coordinates: { lat: 18.7469, lng: 73.4831 },
          rating: 4.6,
          reviews: 156,
          priceRange: '₹800-1500',
          distance: 55,
          estimatedTime: '1h 15m',
          image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Lakeside camping with stargazing and water activities',
          isHiddenGem: true,
          safetyRating: 4.5,
          carbonFootprint: 'Minimal impact'
        }
      ];
    }
    
    // USA Routes
    if (from.toLowerCase().includes('los angeles') && to.toLowerCase().includes('san francisco')) {
      return [
        {
          id: 'us1',
          name: 'Pea Soup Andersen\'s',
          type: 'food',
          location: 'Buellton, California',
          coordinates: { lat: 34.6136, lng: -120.1926 },
          rating: 4.3,
          reviews: 1247,
          priceRange: '$15-30',
          distance: 180,
          estimatedTime: '3h',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Famous roadside stop serving legendary split pea soup since 1924',
          specialOffers: ['Free coffee refills', 'Route 101 special menu'],
          isHiddenGem: false,
          safetyRating: 4.9,
          carbonFootprint: 'Local sourcing'
        },
        {
          id: 'us2',
          name: 'Big Sur Lodge',
          type: 'stay',
          location: 'Big Sur, California',
          coordinates: { lat: 36.2704, lng: -121.8081 },
          rating: 4.6,
          reviews: 892,
          priceRange: '$200-400',
          distance: 280,
          estimatedTime: '4h 30m',
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Rustic lodge among redwoods with Pacific Ocean views',
          specialOffers: ['Spa package deals', 'Hiking map included'],
          safetyRating: 4.8,
          carbonFootprint: 'Eco-certified'
        },
        {
          id: 'us3',
          name: 'McWay Falls Viewpoint',
          type: 'attraction',
          location: 'Big Sur, California',
          coordinates: { lat: 36.1590, lng: -121.6694 },
          rating: 4.9,
          reviews: 2156,
          priceRange: 'Free',
          distance: 285,
          estimatedTime: '4h 40m',
          image: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Iconic waterfall dropping 80 feet onto pristine beach',
          isHiddenGem: true,
          safetyRating: 4.7,
          carbonFootprint: 'Zero impact'
        }
      ];
    }

    // Europe Routes
    if (from.toLowerCase().includes('paris') && to.toLowerCase().includes('amsterdam')) {
      return [
        {
          id: 'eu1',
          name: 'Café de la Paix',
          type: 'food',
          location: 'Brussels, Belgium',
          coordinates: { lat: 50.8503, lng: 4.3517 },
          rating: 4.4,
          reviews: 567,
          priceRange: '€20-40',
          distance: 265,
          estimatedTime: '3h',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Traditional Belgian brasserie with authentic waffles and beer',
          specialOffers: ['Belgian beer tasting', 'Waffle making class'],
          isHiddenGem: false,
          safetyRating: 4.8,
          carbonFootprint: 'Local ingredients'
        },
        {
          id: 'eu2',
          name: 'Hotel des Galeries',
          type: 'stay',
          location: 'Brussels, Belgium',
          coordinates: { lat: 50.8476, lng: 4.3572 },
          rating: 4.5,
          reviews: 423,
          priceRange: '€120-250',
          distance: 267,
          estimatedTime: '3h 05m',
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Boutique hotel in historic Galeries Royales Saint-Hubert',
          specialOffers: ['Museum pass included', 'Late checkout'],
          safetyRating: 4.9,
          carbonFootprint: 'Green certified'
        },
        {
          id: 'eu3',
          name: 'Atomium & Mini-Europe',
          type: 'attraction',
          location: 'Brussels, Belgium',
          coordinates: { lat: 50.8950, lng: 4.3412 },
          rating: 4.3,
          reviews: 1834,
          priceRange: '€16-25',
          distance: 270,
          estimatedTime: '3h 10m',
          image: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Iconic symbol of Brussels with panoramic city views',
          specialOffers: ['Combined ticket discount', 'Audio guide included'],
          safetyRating: 4.6,
          carbonFootprint: 'Educational focus'
        }
      ];
    }

    // Default international mix
    return [
      {
        id: 'default1',
        name: 'International Food Court',
        type: 'food',
        location: 'Highway Stop',
        coordinates: { lat: 0, lng: 0 },
        rating: 4.4,
        reviews: 234,
        priceRange: 'Varies',
        distance: 50,
        estimatedTime: '1h',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Global cuisine options for international travelers',
        specialOffers: ['Multi-currency accepted', 'Traveler discounts'],
        safetyRating: 4.5,
        carbonFootprint: 'Sustainable sourcing'
      }
    ];
  };

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
    
    // Get route-specific stops
    const routeStops = getRouteStopsForDestination(routeData.from, routeData.to);
    
    // Filter stops based on preferences
    const filteredStops = routeData.preferences.length > 0 
      ? routeStops.filter(stop => routeData.preferences.includes(stop.type))
      : routeStops;

    // Determine currency and distance unit based on route
    const getCurrencyAndUnits = (from: string, to: string) => {
      if (from.includes('New York') || from.includes('Los Angeles') || from.includes('Miami') || 
          to.includes('Boston') || to.includes('San Francisco') || to.includes('Las Vegas')) {
        return { currency: '$', distance: 'miles', cost: '280' };
      } else if (from.includes('Paris') || from.includes('London') || from.includes('Rome') || 
                 to.includes('Amsterdam') || to.includes('Munich') || to.includes('Barcelona')) {
        return { currency: '€', distance: 'km', cost: '195' };
      } else {
        return { currency: '₹', distance: 'km', cost: '2,500' };
      }
    };

    const { currency, distance, cost } = getCurrencyAndUnits(routeData.from, routeData.to);
    
    const aiMessage: AIMessage = {
      id: Date.now().toString(),
      content: `Perfect! I've analyzed your international route from ${routeData.from} to ${routeData.to} and found some amazing stops based on your preferences. This route offers a perfect blend of ${routeData.preferences.join(', ')} experiences!`,
      isUser: false,
      timestamp: new Date(),
      type: 'route',
      data: {
        route: filteredStops,
        totalDistance: `463 ${distance}`,
        estimatedTime: '8h 30m',
        estimatedCost: `${currency}${cost}`,
        highlights: [
          `${filteredStops.filter(s => s.isHiddenGem).length} hidden gems`,
          `${filteredStops.filter(s => s.carbonFootprint).length} eco-friendly stops`,
          '1 local favorite'
        ]
      }
    };
    
    // Add contextual follow-up message
    setTimeout(() => {
      const followUpMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: `This route spans across beautiful landscapes! Would you like me to suggest the best time to travel, check current weather conditions, or find budget-friendly alternatives? I can also help with visa requirements for international routes! 🌍`,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setAiMessages(prev => [...prev, followUpMessage]);
    }, 3000);
    
    setAiMessages(prev => [...prev, aiMessage]);
    setGeneratedRoute(filteredStops);
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
    
    // Simulate AI thinking
    setTimeout(() => {
      const input = currentInput.toLowerCase();
      let response = '';

      // International travel responses
      if (input.includes('visa') || input.includes('passport')) {
        response = "For international routes, I recommend checking visa requirements at least 2-3 months in advance. US routes typically need ESTA/visa, European routes may need Schengen visa. Would you like specific visa information for your destination?";
      } else if (input.includes('weather') || input.includes('climate')) {
        response = "Great question! For international routes, weather varies significantly. US West Coast is mild year-round, European routes are best in spring/summer (April-September). Indian routes avoid monsoon season (June-September). Want specific weather forecasts?";
      } else if (input.includes('currency') || input.includes('money') || input.includes('budget')) {
        response = "Smart planning! For international routes: US trips budget $200-400/day, European routes €150-300/day, Indian routes ₹2000-5000/day. This includes accommodation, food, and attractions. Need detailed cost breakdowns?";
      } else if (input.includes('language') || input.includes('communication')) {
        response = "Language tips for your route: English works well in US/UK routes, basic French helps in France, German in Germany, and Hindi/English in India. I can suggest useful phrases for your destination!";
      } else if (input.includes('food') || input.includes('restaurant')) {
        response = "Amazing food awaits! US routes offer diverse cuisine and food trucks, European routes feature local specialties and michelin restaurants, Indian routes have incredible street food and regional dishes. Want specific food recommendations?";
      } else if (input.includes('time') || input.includes('duration')) {
        response = "Timing is everything! Consider jet lag for international flights, time zone changes, and local peak seasons. European summer is busy but beautiful, US has varied seasons, India's winter is perfect for travel.";
      } else if (input.includes('hidden') || input.includes('secret')) {
        response = "I love finding hidden gems! Each route has secret spots - US has hidden viewpoints, Europe has local taverns tourists miss, India has secret temples and villages. Want me to reveal some exclusive locations?";
      } else {
        const responses = [
          "Excellent question! For international routes, I always recommend checking local customs and tipping practices. Each country has unique travel etiquette that enhances your experience.",
          "That's perfect for planning! International routes offer incredible diversity - from American road trip culture to European train journeys to Indian spiritual experiences. What interests you most?",
          "Great thinking! For multi-country routes, consider transportation options: rental cars in US, trains in Europe, or domestic flights in India. Each has unique advantages!",
          "Love your curiosity! International travel opens so many possibilities. I can help with everything from local SIM cards to cultural experiences. What specific aspect interests you?"
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
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
      // Simulate voice input with international options
      setTimeout(() => {
        const voiceRoutes = [
          { from: 'New York', to: 'Boston' },
          { from: 'Paris', to: 'Amsterdam' },
          { from: 'Mumbai', to: 'Goa' },
          { from: 'Los Angeles', to: 'San Francisco' },
          { from: 'London', to: 'Edinburgh' }
        ];
        const randomRoute = voiceRoutes[Math.floor(Math.random() * voiceRoutes.length)];
        setRouteData({
          ...routeData,
          from: randomRoute.from,
          to: randomRoute.to
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
          <p className="text-gray-400 text-sm">Plan your journey with hidden gems and perfect stops worldwide 🌍</p>
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
            <h3 className="text-lg font-semibold text-white mb-4">Popular International Routes 🌍</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickRoutes.map((route, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickRoute(route)}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300 text-left"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-white font-medium text-sm">
                      {route.from} → {route.to}
                    </div>
                    <span className="text-lg">{route.flag}</span>
                  </div>
                  <div className="text-gray-400 text-xs mb-2">
                    {route.distance} • {route.time}
                  </div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                    route.type === 'coastal' ? 'bg-blue-500/20 text-blue-400' :
                    route.type === 'mountain' || route.type === 'alpine' ? 'bg-green-500/20 text-green-400' :
                    route.type === 'nature' ? 'bg-emerald-500/20 text-emerald-400' :
                    route.type === 'heritage' || route.type === 'cultural' ? 'bg-purple-500/20 text-purple-400' :
                    route.type === 'historic' || route.type === 'royal' ? 'bg-indigo-500/20 text-indigo-400' :
                    route.type === 'scenic' ? 'bg-cyan-500/20 text-cyan-400' :
                    route.type === 'tropical' ? 'bg-pink-500/20 text-pink-400' :
                    route.type === 'mediterranean' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {route.type}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Route Planning Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Plan Your Global Journey</h3>
            
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
                    placeholder="Starting location (e.g., New York, Paris, Mumbai)"
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
                    placeholder="Destination (e.g., Boston, Amsterdam, Goa)"
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
                <h4 className="text-white font-medium mb-3">What would you like to discover worldwide?</h4>
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
                <h3 className="text-lg font-semibold text-white">Your AI-Generated International Route</h3>
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
            <h3 className="text-lg font-semibold text-white">Your Saved International Routes</h3>
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
            <h3 className="text-lg font-semibold text-white">Global Community Routes</h3>
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
                  <span className="text-yellow-400 text-sm font-medium">Featured International Route</span>
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
              <span className="text-white font-medium">Global Route AI Assistant</span>
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
                <p>Hi! I'm your Global Route AI assistant. I can help you find the best international routes, hidden gems, and perfect stops for your worldwide journey.</p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setAiMessages([{
                      id: '1',
                      content: "Find me hidden food spots on the Pacific Coast Highway",
                      isUser: true,
                      timestamp: new Date(),
                      type: 'text'
                    }])}
                    className="w-full text-left p-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition-colors"
                  >
                    "Find hidden spots on international routes"
                  </button>
                  <button
                    onClick={() => setAiMessages([{
                      id: '1',
                      content: "Help me plan a Europe road trip with visa requirements",
                      isUser: true,
                      timestamp: new Date(),
                      type: 'text'
                    }])}
                    className="w-full text-left p-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition-colors"
                  >
                    "Help with visa and travel requirements"
                  </button>
                  <button
                    onClick={() => setAiMessages([{
                      id: '1',
                      content: "What's the best season for a USA cross-country road trip?",
                      isUser: true,
                      timestamp: new Date(),
                      type: 'text'
                    }])}
                    className="w-full text-left p-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition-colors"
                  >
                    "Best travel seasons for different countries"
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
                      <div className="text-xs text-white/80 mb-2">International Route Summary:</div>
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
                placeholder="Ask about international routes..."
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
              <h3 className="text-white font-medium">Global Route Map 🌍</h3>
              <button
                onClick={() => setShowMap(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 h-80 bg-gradient-to-br from-slate-800 to-slate-700 rounded-b-3xl flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Globe className="h-16 w-16 mx-auto mb-4 animate-spin" />
                <p>Interactive world map would be displayed here</p>
                <p className="text-sm mt-2">Showing your international route with all discovered stops</p>
                <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span>USA Routes</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span>Europe Routes</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    <span>India Routes</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteDiscoveryPage;