import React, { useState, useRef, useEffect } from 'react';
import { 
  Navigation, MapPin, Clock, Star, Heart, Share, Plus, Filter, 
  Search, Bot, Mic, Send, Car, Train, Plane, Footprints,
  Utensils, Coffee, Bed, Camera, Fuel, TreePine, AlertTriangle,
  Users, Calendar, DollarSign, Map, Eye, Play, Bookmark,
  ThumbsUp, MessageCircle, Award, Zap, Route as RouteIcon,
  Volume2, VolumeX, Settings, Target, Compass, Globe,
  TrendingUp, CheckCircle, Info, ArrowRight, RefreshCw,
  X, Download, Upload, Smartphone, Monitor, Headphones,
  Copy, ExternalLink, CreditCard, Phone, Mail, Image,
  Video, FileText, Save, Edit, Trash2
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
  author?: string;
  rating?: number;
  reviews?: number;
  likes?: number;
  isLiked?: boolean;
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
  routeStops: RouteStop[];
  currency: string;
  country: string;
}

interface AIMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'route' | 'recommendations' | 'route-imported' | 'route-customized';
  data?: any;
}

interface RouteCustomization {
  addStops: string[];
  removeStops: string[];
  preferences: string[];
  budget: string;
  duration: string;
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
  const [selectedCommunityRoute, setSelectedCommunityRoute] = useState<CommunityRoute | null>(null);
  const [showRouteCustomization, setShowRouteCustomization] = useState(false);
  const [routeCustomization, setRouteCustomization] = useState<RouteCustomization>({
    addStops: [],
    removeStops: [],
    preferences: [],
    budget: '',
    duration: ''
  });
  const [showRoutePreview, setShowRoutePreview] = useState(false);
  const [importedRoute, setImportedRoute] = useState<CommunityRoute | null>(null);
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
    // USA Routes
    { from: 'New York', to: 'Boston', distance: '347 km', time: '4h 30m', type: 'coastal', country: 'USA', currency: '$' },
    { from: 'Los Angeles', to: 'San Francisco', distance: '617 km', time: '6h', type: 'scenic', country: 'USA', currency: '$' },
    { from: 'Las Vegas', to: 'Grand Canyon', distance: '450 km', time: '4h 30m', type: 'nature', country: 'USA', currency: '$' },
    { from: 'Miami', to: 'Key West', distance: '266 km', time: '3h 30m', type: 'tropical', country: 'USA', currency: '$' },
    { from: 'Seattle', to: 'Portland', distance: '278 km', time: '3h', type: 'urban', country: 'USA', currency: '$' },
    { from: 'Chicago', to: 'Milwaukee', distance: '150 km', time: '2h', type: 'weekend', country: 'USA', currency: '$' },
    
    // European Routes
    { from: 'Paris', to: 'Amsterdam', distance: '515 km', time: '5h', type: 'cultural', country: 'Europe', currency: '€' },
    { from: 'Rome', to: 'Florence', distance: '274 km', time: '3h', type: 'heritage', country: 'Europe', currency: '€' },
    { from: 'London', to: 'Edinburgh', distance: '666 km', time: '7h', type: 'historic', country: 'Europe', currency: '£' },
    { from: 'Barcelona', to: 'Valencia', distance: '349 km', time: '3h 30m', type: 'coastal', country: 'Europe', currency: '€' },
    { from: 'Munich', to: 'Salzburg', distance: '150 km', time: '2h', type: 'alpine', country: 'Europe', currency: '€' },
    { from: 'Vienna', to: 'Prague', distance: '333 km', time: '4h', type: 'royal', country: 'Europe', currency: '€' },
    
    // Indian Routes  
    { from: 'Mumbai', to: 'Goa', distance: '463 km', time: '8h 30m', type: 'coastal', country: 'India', currency: '₹' },
    { from: 'Delhi', to: 'Manali', distance: '570 km', time: '12h', type: 'mountain', country: 'India', currency: '₹' },
    { from: 'Bangalore', to: 'Coorg', distance: '252 km', time: '5h 30m', type: 'nature', country: 'India', currency: '₹' },
    { from: 'Chennai', to: 'Pondicherry', distance: '160 km', time: '3h 30m', type: 'heritage', country: 'India', currency: '₹' },
    { from: 'Kolkata', to: 'Darjeeling', distance: '680 km', time: '14h', type: 'hill-station', country: 'India', currency: '₹' },
    { from: 'Pune', to: 'Lonavala', distance: '64 km', time: '1h 30m', type: 'weekend', country: 'India', currency: '₹' }
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
      name: 'Pacific Coast Highway Adventure',
      from: 'Los Angeles',
      to: 'San Francisco',
      distance: 617,
      duration: '6h',
      stops: 15,
      lastUsed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      timesUsed: 1,
      estimatedCost: '$420',
      difficulty: 'moderate',
      tags: ['scenic', 'coastal', 'wine']
    },
    {
      id: '3',
      name: 'European Culture Trail',
      from: 'Paris',
      to: 'Amsterdam',
      distance: 515,
      duration: '5h',
      stops: 8,
      lastUsed: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      timesUsed: 2,
      estimatedCost: '€280',
      difficulty: 'easy',
      tags: ['culture', 'museums', 'cafes']
    }
  ];

  const mockCommunityRoutes: CommunityRoute[] = [
    {
      id: '1',
      title: 'Pacific Coast Highway Magic',
      author: 'USRoadTripper',
      authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      from: 'Los Angeles',
      to: 'San Francisco',
      distance: 617,
      duration: '6h',
      stops: 18,
      rating: 4.9,
      reviews: 89,
      likes: 156,
      isLiked: false,
      difficulty: 'moderate',
      tags: ['ocean', 'cliffs', 'wine'],
      description: 'Iconic coastal drive with Big Sur highlights and wine country',
      estimatedCost: '$350',
      isFeatured: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      currency: '$',
      country: 'USA',
      routeStops: [
        {
          id: 'pch1',
          name: 'Pea Soup Andersen\'s',
          type: 'food',
          location: 'Buellton, CA',
          coordinates: { lat: 34.6136, lng: -120.1929 },
          rating: 4.2,
          reviews: 1200,
          priceRange: '$15-25',
          distance: 145,
          estimatedTime: '2h 30m',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Famous split pea soup restaurant since 1924',
          specialOffers: ['Free coffee refills', 'Kids eat free Sundays'],
          safetyRating: 4.8,
          carbonFootprint: 'Low impact'
        },
        {
          id: 'pch2',
          name: 'Big Sur Lodge',
          type: 'stay',
          location: 'Big Sur, CA',
          coordinates: { lat: 36.2553, lng: -121.8053 },
          rating: 4.6,
          reviews: 456,
          priceRange: '$280-450',
          distance: 290,
          estimatedTime: '4h 30m',
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Rustic lodge in redwood forest with spectacular views',
          specialOffers: ['National Park access included', 'Spa discounts'],
          safetyRating: 4.9,
          carbonFootprint: 'Eco-friendly'
        },
        {
          id: 'pch3',
          name: 'McWay Falls Viewpoint',
          type: 'attraction',
          location: 'Big Sur, CA',
          coordinates: { lat: 36.1569, lng: -121.6700 },
          rating: 4.8,
          reviews: 2341,
          priceRange: 'Free',
          distance: 305,
          estimatedTime: '5h',
          image: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: '80-foot waterfall flowing onto the beach',
          isHiddenGem: false,
          safetyRating: 4.5,
          carbonFootprint: 'Zero impact'
        }
      ]
    },
    {
      id: '2',
      title: 'Romantic Rhine Valley Journey',
      author: 'EuropeNomad',
      authorAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      from: 'Amsterdam',
      to: 'Munich',
      distance: 625,
      duration: '7h',
      stops: 12,
      rating: 4.7,
      reviews: 67,
      likes: 234,
      isLiked: true,
      difficulty: 'easy',
      tags: ['castles', 'culture', 'beer'],
      description: 'Fairy-tale route through German castles and Dutch countryside',
      estimatedCost: '€280',
      isFeatured: true,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      currency: '€',
      country: 'Europe',
      routeStops: [
        {
          id: 'rhine1',
          name: 'Belgian Waffle House',
          type: 'food',
          location: 'Brussels, Belgium',
          coordinates: { lat: 50.8503, lng: 4.3517 },
          rating: 4.4,
          reviews: 890,
          priceRange: '€8-15',
          distance: 120,
          estimatedTime: '2h',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Authentic Belgian waffles with 20 toppings',
          specialOffers: ['Student discounts', 'Free coffee with waffle'],
          safetyRating: 4.7,
          carbonFootprint: 'Local sourcing'
        },
        {
          id: 'rhine2',
          name: 'Cologne Cathedral Hotel',
          type: 'stay',
          location: 'Cologne, Germany',
          coordinates: { lat: 50.9375, lng: 6.9603 },
          rating: 4.5,
          reviews: 234,
          priceRange: '€120-200',
          distance: 280,
          estimatedTime: '3h 30m',
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Boutique hotel with cathedral views',
          specialOffers: ['Cathedral tour included', 'Breakfast buffet'],
          safetyRating: 4.8,
          carbonFootprint: 'Green certified'
        }
      ]
    },
    {
      id: '3',
      title: 'Himalayan Spirit Quest',
      author: 'MountainSage',
      authorAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      from: 'Delhi',
      to: 'Leh',
      distance: 1150,
      duration: '2 days',
      stops: 20,
      rating: 4.8,
      reviews: 123,
      likes: 445,
      isLiked: false,
      difficulty: 'challenging',
      tags: ['mountains', 'spiritual', 'adventure'],
      description: 'Epic journey through world\'s highest motorable passes',
      estimatedCost: '₹12,500',
      isFeatured: true,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      currency: '₹',
      country: 'India',
      routeStops: [
        {
          id: 'leh1',
          name: 'Rishikesh Ashram Stay',
          type: 'stay',
          location: 'Rishikesh, Uttarakhand',
          coordinates: { lat: 30.0869, lng: 78.2676 },
          rating: 4.6,
          reviews: 567,
          priceRange: '₹800-1500',
          distance: 240,
          estimatedTime: '6h',
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Peaceful ashram by Ganges with yoga sessions',
          specialOffers: ['Free yoga classes', 'Meditation sessions'],
          safetyRating: 4.7,
          carbonFootprint: 'Sustainable'
        }
      ]
    },
    {
      id: '4',
      title: 'New England Fall Foliage',
      author: 'AutumnChaser',
      authorAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      from: 'Boston',
      to: 'Burlington',
      distance: 346,
      duration: '4h 30m',
      stops: 14,
      rating: 4.6,
      reviews: 78,
      likes: 189,
      isLiked: true,
      difficulty: 'easy',
      tags: ['fall', 'scenic', 'historic'],
      description: 'Spectacular autumn colors through Vermont countryside',
      estimatedCost: '$240',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      currency: '$',
      country: 'USA',
      routeStops: []
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

  // Initialize AI Assistant with welcome message
  useEffect(() => {
    if (showAIAssistant && aiMessages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: 'welcome',
        content: "🤖 **Route Discovery AI Assistant** at your service! I can help you:\n\n🗺️ **Plan custom routes** with hidden gems\n🌟 **Customize community routes** to your preferences\n💡 **Suggest alternatives** based on budget/time\n🔍 **Find specific stops** (food, hotels, attractions)\n🚗 **Optimize travel** for fuel, time, or scenic beauty\n\nWhat kind of route adventure are you planning today?",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setAiMessages([welcomeMessage]);
    }
  }, [showAIAssistant, aiMessages.length]);

  const handleQuickRoute = (route: any) => {
    setRouteData({
      ...routeData,
      from: route.from,
      to: route.to
    });
    
    // Add AI message about the selected route
    const routeMessage: AIMessage = {
      id: Date.now().toString(),
      content: `Great choice! I've set up your route from **${route.from}** to **${route.to}**. This is a beautiful ${route.type} route in ${route.country}. Would you like me to:\n\n🎯 **Find specific stops** (restaurants, hotels, attractions)\n💰 **Adjust for budget** (${route.currency} currency)\n⏰ **Optimize for time** vs scenic beauty\n🎒 **Add traveler preferences**\n\nJust tell me what you're looking for!`,
      isUser: false,
      timestamp: new Date(),
      type: 'recommendations'
    };
    
    setAiMessages(prev => [...prev, routeMessage]);
    setShowAIAssistant(true);
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
      content: `🎉 **Route Generated Successfully!** I've analyzed your preferences for **${routeData.from} → ${routeData.to}** and found some amazing discoveries!`,
      isUser: false,
      timestamp: new Date(),
      type: 'route',
      data: {
        route: mockRouteStops,
        totalDistance: '463 km',
        estimatedTime: '8h 30m',
        estimatedCost: '₹2,500',
        highlights: ['3 hidden gems', '2 eco-friendly stops', '1 local favorite'],
        preferences: routeData.preferences
      }
    };
    
    setAiMessages(prev => [...prev, aiMessage]);
    setGeneratedRoute(mockRouteStops);
    setIsGenerating(false);
  };

  const handleUseRoute = async (route: CommunityRoute) => {
    setSelectedCommunityRoute(route);
    setImportedRoute(route);
    setShowRoutePreview(true);
    
    // Add AI message about importing the route
    const importMessage: AIMessage = {
      id: Date.now().toString(),
      content: `🚀 **Route "${route.title}" imported successfully!**\n\n📍 **${route.from} → ${route.to}**\n🏁 **${route.stops} stops** • **${route.duration}** • **${route.estimatedCost}**\n⭐ **${route.rating}/5** from ${route.reviews} travelers\n\n🎯 **What would you like to do?**\n• **Use as-is** - Start with this exact route\n• **Customize** - Modify stops, budget, or preferences\n• **Get alternatives** - Similar routes with different focuses\n• **Ask questions** - About specific stops or the route\n\nI can also help you book accommodations or find real-time traffic updates!`,
      isUser: false,
      timestamp: new Date(),
      type: 'route-imported',
      data: {
        route: route,
        canCustomize: true,
        hasAlternatives: true
      }
    };
    
    setAiMessages(prev => [...prev, importMessage]);
    setShowAIAssistant(true);
  };

  const handleCustomizeRoute = () => {
    setShowRouteCustomization(true);
  };

  const applyRouteCustomization = () => {
    if (!selectedCommunityRoute) return;
    
    const customizationMessage: AIMessage = {
      id: Date.now().toString(),
      content: `✨ **Route customized successfully!** Here's what I've updated:\n\n${routeCustomization.addStops.length > 0 ? `➕ **Added stops:** ${routeCustomization.addStops.join(', ')}\n` : ''}${routeCustomization.removeStops.length > 0 ? `➖ **Removed stops:** ${routeCustomization.removeStops.join(', ')}\n` : ''}${routeCustomization.preferences.length > 0 ? `🎯 **Preferences:** ${routeCustomization.preferences.join(', ')}\n` : ''}${routeCustomization.budget ? `💰 **Budget:** ${routeCustomization.budget}\n` : ''}${routeCustomization.duration ? `⏰ **Duration:** ${routeCustomization.duration}\n` : ''}\n🎉 Your personalized route is ready! Would you like me to:\n• **Show updated route details**\n• **Find alternative accommodations**\n• **Check real-time conditions**\n• **Export to your calendar**`,
      isUser: false,
      timestamp: new Date(),
      type: 'route-customized',
      data: {
        originalRoute: selectedCommunityRoute,
        customizations: routeCustomization
      }
    };
    
    setAiMessages(prev => [...prev, customizationMessage]);
    setShowRouteCustomization(false);
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
    
    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentInput);
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): AIMessage => {
    const input = userInput.toLowerCase();
    
    // Route planning responses
    if (input.includes('route') || input.includes('plan')) {
      return {
        id: (Date.now() + 1).toString(),
        content: `🗺️ **Great! Let me help you plan the perfect route.** Could you tell me:\n\n📍 **Starting point** and **destination**?\n🎯 **What interests you most?** (food, nature, culture, adventure)\n⏰ **How much time** do you have?\n💰 **What's your budget** range?\n🚗 **Transportation** preference?\n\nI'll find hidden gems and create a personalized itinerary just for you!`,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Food-related responses
    if (input.includes('food') || input.includes('restaurant') || input.includes('eat')) {
      return {
        id: (Date.now() + 1).toString(),
        content: `🍴 **Food lover detected!** I can help you find:\n\n🏪 **Local favorites** - Hidden gems locals love\n🍕 **Cuisine types** - What are you craving?\n💰 **Budget range** - Street food to fine dining\n⭐ **Highly rated** spots with traveler reviews\n🚚 **Food trucks** and unique experiences\n\nTell me your location and what type of food adventure you want!`,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Budget-related responses
    if (input.includes('budget') || input.includes('cheap') || input.includes('expensive') || input.includes('cost')) {
      return {
        id: (Date.now() + 1).toString(),
        content: `💰 **Budget planning is smart!** I can help optimize costs:\n\n🏨 **Accommodation** - From hostels to luxury\n⛽ **Transportation** - Fuel vs flights vs trains\n🍽️ **Food budget** - Street food vs restaurants\n🎫 **Activities** - Free attractions vs paid experiences\n💡 **Money-saving tips** for your destination\n\nWhat's your total budget and where are you traveling?`,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Accommodation responses
    if (input.includes('hotel') || input.includes('stay') || input.includes('accommodation') || input.includes('sleep')) {
      return {
        id: (Date.now() + 1).toString(),
        content: `🏨 **Perfect! Let me find you great places to stay:**\n\n🏠 **Types:** Hotels, hostels, B&Bs, camping, unique stays\n💰 **Budget:** What's your nightly budget range?\n📍 **Location:** City center, nature, or specific area?\n✨ **Amenities:** WiFi, breakfast, parking, pool?\n⭐ **Style:** Luxury, budget, boutique, or local experience?\n\nTell me your destination and preferences!`,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Safety and travel tips
    if (input.includes('safe') || input.includes('danger') || input.includes('tips') || input.includes('advice')) {
      return {
        id: (Date.now() + 1).toString(),
        content: `🛡️ **Safety first! Here are essential travel tips:**\n\n📱 **Emergency contacts** for your destination\n🗺️ **Safe areas** vs areas to avoid\n💊 **Health precautions** and vaccinations\n📋 **Documents** needed and backup copies\n🚨 **Local emergency** numbers and embassies\n💰 **Money safety** - cards vs cash\n\nWhich destination are you concerned about? I'll provide specific safety info!`,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Weather and timing
    if (input.includes('weather') || input.includes('season') || input.includes('time') || input.includes('when')) {
      return {
        id: (Date.now() + 1).toString(),
        content: `🌤️ **Perfect timing makes perfect trips!**\n\n🗓️ **Best seasons** for your destination\n🌡️ **Weather patterns** and what to expect\n🎉 **Local events** and festivals\n👕 **What to pack** for the climate\n💰 **Price variations** by season\n🏖️ **Peak vs off-season** pros and cons\n\nWhere and when are you planning to travel?`,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Transportation
    if (input.includes('transport') || input.includes('flight') || input.includes('train') || input.includes('bus') || input.includes('car')) {
      return {
        id: (Date.now() + 1).toString(),
        content: `🚗 **Let's get you moving efficiently!**\n\n✈️ **Flights** - Best booking times and deals\n🚂 **Trains** - Scenic routes and passes\n🚌 **Buses** - Budget options and comfort levels\n🚗 **Car rental** - Freedom vs cost analysis\n🏍️ **Local transport** - Bikes, scooters, metro\n🗺️ **Route optimization** for time and cost\n\nWhat's your starting point and destination?`,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Default helpful response
    const responses = [
      "🌟 **I'm here to make your route planning amazing!** You can ask me about:\n\n🗺️ **Routes & planning** - Custom itineraries\n🍴 **Food discoveries** - Local favorites & hidden gems\n🏨 **Accommodations** - Best places to stay\n💰 **Budget optimization** - Save money smartly\n🛡️ **Safety tips** - Travel securely\n🚗 **Transportation** - Best ways to get around\n\nWhat would you like to explore?",
      
      "🤖 **Route Discovery AI ready!** I can help with:\n\n📍 **Destination planning** - Where should you go?\n⏰ **Time optimization** - Make the most of your trip\n🎯 **Interest matching** - Find what you love\n🌟 **Hidden gems** - Discover secret spots\n📱 **Real-time updates** - Current conditions\n💡 **Smart suggestions** - Personalized recommendations\n\nWhat's your travel question?",
      
      "🚀 **Let's plan something amazing!** I specialize in:\n\n🎨 **Custom routes** - Tailored to your style\n🏆 **Top-rated stops** - Proven traveler favorites\n💎 **Unique experiences** - Off the beaten path\n📊 **Data-driven planning** - Best times, prices, weather\n🤝 **Community insights** - Real traveler reviews\n🎁 **Surprise discoveries** - Unexpected delights\n\nWhat kind of adventure are you dreaming of?"
    ];
    
    return {
      id: (Date.now() + 1).toString(),
      content: responses[Math.floor(Math.random() * responses.length)],
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
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
        
        // Add AI message about voice input
        const voiceMessage: AIMessage = {
          id: Date.now().toString(),
          content: "🎤 **Voice input received!** I heard you want to plan a route from **Mumbai to Goa**. This is one of India's most popular coastal routes! Would you like me to:\n\n🏖️ **Find beach stops** along the way\n🍛 **Discover food spots** and local dhabas\n🏨 **Suggest accommodations** for overnight stays\n⛽ **Add fuel stations** and rest stops\n\nJust let me know what interests you most!",
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        };
        
        setAiMessages(prev => [...prev, voiceMessage]);
        setShowAIAssistant(true);
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
            <h3 className="text-lg font-semibold text-white mb-4">Popular Routes Worldwide</h3>
            <div className="grid grid-cols-1 gap-3">
              {quickRoutes.map((route, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickRoute(route)}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 text-left group hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm mb-1 group-hover:text-cyan-400 transition-colors">
                        {route.from} → {route.to}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {route.distance} • {route.time}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                        route.type === 'coastal' ? 'bg-blue-500/20 text-blue-400' :
                        route.type === 'mountain' ? 'bg-green-500/20 text-green-400' :
                        route.type === 'nature' ? 'bg-emerald-500/20 text-emerald-400' :
                        route.type === 'heritage' ? 'bg-purple-500/20 text-purple-400' :
                        route.type === 'cultural' ? 'bg-pink-500/20 text-pink-400' :
                        route.type === 'scenic' ? 'bg-cyan-500/20 text-cyan-400' :
                        route.type === 'tropical' ? 'bg-orange-500/20 text-orange-400' :
                        route.type === 'urban' ? 'bg-gray-500/20 text-gray-400' :
                        route.type === 'historic' ? 'bg-indigo-500/20 text-indigo-400' :
                        route.type === 'alpine' ? 'bg-teal-500/20 text-teal-400' :
                        route.type === 'royal' ? 'bg-purple-500/20 text-purple-400' :
                        route.type === 'hill-station' ? 'bg-green-500/20 text-green-400' :
                        route.type === 'fall' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {route.type}
                      </div>
                      <span className="text-gray-400 text-xs">{route.country}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
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
                  <button
                    onClick={() => {
                      // Save route functionality
                      const routeToSave: SavedRoute = {
                        id: Date.now().toString(),
                        name: `${routeData.from} to ${routeData.to} Route`,
                        from: routeData.from,
                        to: routeData.to,
                        distance: 463,
                        duration: '8h 30m',
                        stops: generatedRoute.length,
                        lastUsed: new Date(),
                        timesUsed: 1,
                        estimatedCost: '₹2,500',
                        difficulty: 'easy',
                        tags: routeData.preferences
                      };
                      
                      console.log('Route saved:', routeToSave);
                      
                      // Add success message
                      const saveMessage: AIMessage = {
                        id: Date.now().toString(),
                        content: `✅ **Route saved successfully!** I've added "${routeToSave.name}" to your saved routes. You can find it in the **Saved Routes** tab anytime. Would you like me to:\n\n📅 **Add to calendar** with optimal timing\n📱 **Export details** for offline access\n🔔 **Set reminders** for preparation tasks\n🗺️ **Share with travel buddies**`,
                        isUser: false,
                        timestamp: new Date(),
                        type: 'text'
                      };
                      
                      setAiMessages(prev => [...prev, saveMessage]);
                    }}
                    className="flex items-center space-x-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm hover:bg-green-500/30 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Route</span>
                  </button>
                  <Heart className="h-5 w-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
                  <Share className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {generatedRoute.map((stop, index) => {
                  const IconComponent = getTypeIcon(stop.type);
                  return (
                    <div key={stop.id} className="bg-black/20 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
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
            <div key={route.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all">
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
                  <button 
                    onClick={() => {
                      // Use saved route - populate form
                      setRouteData({
                        from: route.from,
                        to: route.to,
                        departure: '',
                        travelers: 1,
                        preferences: route.tags
                      });
                      setActiveTab('planner');
                      
                      // Add AI message
                      const useMessage: AIMessage = {
                        id: Date.now().toString(),
                        content: `🔄 **Loaded "${route.name}"** successfully! I've set up your route planning form with:\n\n📍 **${route.from} → ${route.to}**\n🏷️ **Preferences:** ${route.tags.join(', ')}\n📊 **Previous stats:** ${route.distance}km, ${route.duration}, ${route.stops} stops\n\nWould you like me to:\n• **Update with current conditions**\n• **Find new stops** along the way\n• **Adjust for different preferences**\n• **Optimize for time/cost**`,
                        isUser: false,
                        timestamp: new Date(),
                        type: 'text'
                      };
                      
                      setAiMessages(prev => [...prev, useMessage]);
                      setShowAIAssistant(true);
                    }}
                    className="px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl text-sm hover:bg-cyan-500/30 transition-colors"
                  >
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

          {/* Featured Routes Banner */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Featured International Routes</span>
            </div>
            <p className="text-gray-300 text-sm">
              Discover amazing routes from travelers worldwide - USA, Europe, and India
            </p>
          </div>
          
          {mockCommunityRoutes.map((route) => (
            <div key={route.id} className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300 ${
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
                  <div className="text-gray-400 text-xs">by {route.author} • {route.country}</div>
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
                    onClick={() => {
                      // Toggle like
                      route.isLiked = !route.isLiked;
                      route.likes += route.isLiked ? 1 : -1;
                    }}
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

                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <Globe className="h-4 w-4" />
                    <span>{route.country}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUseRoute(route)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Use Route</span>
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
              <span className="text-white font-medium">Route AI Assistant</span>
            </div>
            <button
              onClick={() => setShowAIAssistant(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-white/10 text-white border border-white/10 backdrop-blur-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  
                  {message.type === 'route' && message.data && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="text-xs text-white/80 mb-2">Route Summary:</div>
                      <div className="space-y-1 text-xs">
                        <div>📍 Distance: {message.data.totalDistance}</div>
                        <div>⏰ Time: {message.data.estimatedTime}</div>
                        <div>💰 Cost: {message.data.estimatedCost}</div>
                        <div className="text-cyan-300">✨ {message.data.highlights.join(', ')}</div>
                      </div>
                    </div>
                  )}

                  {message.type === 'route-imported' && message.data && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="flex space-x-2">
                        <button
                          onClick={handleCustomizeRoute}
                          className="flex-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-xs hover:bg-blue-500/30 transition-colors"
                        >
                          Customize
                        </button>
                        <button className="flex-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-xs hover:bg-green-500/30 transition-colors">
                          Use As-Is
                        </button>
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
                placeholder="Ask about routes, places, tips..."
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

      {/* Route Customization Modal */}
      {showRouteCustomization && selectedCommunityRoute && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Customize Route</h2>
                <button
                  onClick={() => setShowRouteCustomization(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Original Route</h3>
                  <div className="bg-black/20 rounded-xl p-3">
                    <div className="text-cyan-400 font-medium">{selectedCommunityRoute.title}</div>
                    <div className="text-gray-400 text-sm">{selectedCommunityRoute.from} → {selectedCommunityRoute.to}</div>
                    <div className="text-gray-400 text-sm">{selectedCommunityRoute.stops} stops • {selectedCommunityRoute.estimatedCost}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-2">Add Stops</h3>
                  <input
                    type="text"
                    placeholder="Add places you want to visit..."
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        setRouteCustomization(prev => ({
                          ...prev,
                          addStops: [...prev.addStops, e.currentTarget.value.trim()]
                        }));
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  {routeCustomization.addStops.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {routeCustomization.addStops.map((stop, index) => (
                        <span key={index} className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center space-x-1">
                          <span>{stop}</span>
                          <button
                            onClick={() => setRouteCustomization(prev => ({
                              ...prev,
                              addStops: prev.addStops.filter((_, i) => i !== index)
                            }))}
                            className="text-green-300 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-white font-medium mb-2">Budget Range</h3>
                  <select
                    value={routeCustomization.budget}
                    onChange={(e) => setRouteCustomization(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="">Keep original budget</option>
                    <option value="budget">Budget (30% less)</option>
                    <option value="standard">Standard (same as original)</option>
                    <option value="luxury">Luxury (50% more)</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-2">Duration Preference</h3>
                  <select
                    value={routeCustomization.duration}
                    onChange={(e) => setRouteCustomization(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="">Keep original duration</option>
                    <option value="shorter">Shorter (optimize for time)</option>
                    <option value="same">Same duration</option>
                    <option value="longer">Longer (more stops and leisure)</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-2">Focus Preferences</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Scenic routes', 'Local food', 'Historic sites', 'Adventure', 'Photography', 'Shopping'].map((pref) => (
                      <button
                        key={pref}
                        onClick={() => setRouteCustomization(prev => ({
                          ...prev,
                          preferences: prev.preferences.includes(pref)
                            ? prev.preferences.filter(p => p !== pref)
                            : [...prev.preferences, pref]
                        }))}
                        className={`p-2 rounded-xl text-sm transition-colors ${
                          routeCustomization.preferences.includes(pref)
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowRouteCustomization(false)}
                    className="flex-1 px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyRouteCustomization}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Route Preview Modal */}
      {showRoutePreview && importedRoute && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Route Preview</h2>
                <button
                  onClick={() => setShowRoutePreview(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-400/30">
                  <h3 className="text-white font-medium mb-2">{importedRoute.title}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="text-gray-300">{importedRoute.from} → {importedRoute.to}</div>
                    <div className="text-purple-400">{importedRoute.stops} stops • {importedRoute.duration} • {importedRoute.estimatedCost}</div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400">{importedRoute.rating}/5</span>
                      <span className="text-gray-400">({importedRoute.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {importedRoute.routeStops && importedRoute.routeStops.length > 0 && (
                  <div>
                    <h3 className="text-white font-medium mb-3">Route Stops</h3>
                    <div className="space-y-2">
                      {importedRoute.routeStops.slice(0, 3).map((stop, index) => (
                        <div key={stop.id} className="bg-black/20 rounded-xl p-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getTypeColor(stop.type)} flex items-center justify-center`}>
                              {React.createElement(getTypeIcon(stop.type), { className: "h-4 w-4 text-white" })}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium text-sm">{stop.name}</h4>
                              <div className="text-gray-400 text-xs">{stop.location}</div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-yellow-400 text-xs">{stop.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {importedRoute.routeStops.length > 3 && (
                        <div className="text-center text-gray-400 text-sm">
                          +{importedRoute.routeStops.length - 3} more stops
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      // Use route as-is - import to planning
                      setRouteData({
                        from: importedRoute.from,
                        to: importedRoute.to,
                        departure: '',
                        travelers: 1,
                        preferences: []
                      });
                      setActiveTab('planner');
                      setShowRoutePreview(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Use Route
                  </button>
                  <button
                    onClick={() => {
                      setShowRoutePreview(false);
                      setShowRouteCustomization(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Overlay */}
      {showMap && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 w-full max-w-4xl h-96">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-medium">Interactive Route Map</h3>
              <button
                onClick={() => setShowMap(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
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