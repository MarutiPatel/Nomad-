import React, { useState, useEffect } from 'react';
import { 
  Target, MapPin, Search, Filter, Plus, Navigation, 
  Eye, Star, Heart, Camera, Clock, Users, Zap,
  Compass, Globe, Footprints, AlertTriangle, Bell,
  TrendingUp, Award, RefreshCw, Settings, Map,
  Utensils, TreePine, X, Trophy, Route, Car, Coffee,
  Mountain, Fuel, Building, Sunrise, Camera as CameraIcon,
  Play, Pause, Square, Activity, CloudRain, Navigation2,
  Bookmark, Share, Download, Upload, CheckCircle, Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTrip } from '../contexts/TripContext';

interface NearbyLocation {
  id: string;
  name: string;
  type: 'historical' | 'food' | 'nature' | 'adventure' | 'hidden-gem' | 'poi';
  location: string;
  distance: number;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  isUserDrop: boolean;
  author?: string;
  timestamp?: Date;
  tips?: string;
}

interface LocationSuggestion {
  id: string;
  title: string;
  description: string;
  type: 'auto-suggest' | 'nearby-explore' | 'route-based';
  locations: NearbyLocation[];
  priority: 'high' | 'medium' | 'low';
  distance: number;
}

interface RouteRecommendation {
  id: string;
  name: string;
  description: string;
  type: 'scenic' | 'food' | 'historical' | 'fuel' | 'rest' | 'viewpoint';
  distanceFromRoute: number;
  estimatedDetour: string;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
  bestTime: string;
  coordinates: { lat: number; lng: number };
  isAdded?: boolean;
}

interface RouteSegment {
  from: string;
  to: string;
  distance: string;
  estimatedTime: string;
  recommendations: RouteRecommendation[];
  totalCost?: string;
  fuelCost?: string;
  tollCost?: string;
}

interface RouteOptions {
  optimization: 'fastest' | 'scenic' | 'economical' | 'eco-friendly';
  avoidTolls: boolean;
  avoidHighways: boolean;
  includeStops: boolean;
  maxDetourTime: number; // in minutes
}

function DiscoveryPage() {
  const { user } = useAuth();
  const { activeTrip, startTrip, endTrip, isInTripMode } = useTrip();
  
  // Main tab state
  const [activeTab, setActiveTab] = useState<'nearby' | 'route-planning'>('nearby');
  
  // Nearby exploration states
  const [currentLocation, setCurrentLocation] = useState('New York, NY');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showLocationNotification, setShowLocationNotification] = useState(true);
  const [searchRadius, setSearchRadius] = useState(25); // km
  const [isLocationTracking, setIsLocationTracking] = useState(true);
  
  // Route planning states
  const [routeInput, setRouteInput] = useState({ from: '', to: '' });
  const [showRouteRecommendations, setShowRouteRecommendations] = useState(false);
  const [selectedRouteType, setSelectedRouteType] = useState<string>('all');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeOptions, setRouteOptions] = useState<RouteOptions>({
    optimization: 'fastest',
    avoidTolls: false,
    avoidHighways: false,
    includeStops: true,
    maxDetourTime: 30
  });
  const [savedRoutes, setSavedRoutes] = useState<string[]>([]);

  // Generate personalized locations based on user preferences
  const generatePersonalizedLocations = (): NearbyLocation[] => {
    const baseLocations = [
      {
        id: '1',
        name: 'Central Park Secret Garden',
        type: 'hidden-gem' as const,
        location: 'Central Park, New York',
        distance: 0.8,
        rating: 4.8,
        reviews: 234,
        description: 'Hidden conservatory garden that most tourists miss. Perfect for peaceful moments.',
        image: 'https://images.pexels.com/photos/1643113/pexels-photo-1643113.jpeg?auto=compress&cs=tinysrgb&w=400',
        isUserDrop: true,
        author: 'UrbanExplorer23',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        tips: 'Visit early morning for best lighting and fewer crowds'
      },
      {
        id: '2',
        name: 'Brooklyn Bridge Park',
        type: 'nature' as const,
        location: 'Brooklyn, New York',
        distance: 2.3,
        rating: 4.7,
        reviews: 892,
        description: 'Stunning waterfront park with amazing Manhattan skyline views.',
        image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
        isUserDrop: false
      },
      {
        id: '3',
        name: 'Joe\'s Pizza - Original',
        type: 'food' as const,
        location: 'Greenwich Village, NY',
        distance: 1.2,
        rating: 4.9,
        reviews: 1567,
        description: 'Authentic NYC pizza slice that locals swear by. No tourists know about this location.',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        isUserDrop: true,
        author: 'NYCFoodie',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        tips: 'Order the classic cheese - simple perfection'
      },
      {
        id: '4',
        name: 'Metropolitan Museum Rooftop',
        type: 'historical' as const,
        location: 'Upper East Side, NY',
        distance: 1.8,
        rating: 4.6,
        reviews: 456,
        description: 'Hidden rooftop garden with sculpture installations and city views.',
        image: 'https://images.pexels.com/photos/1434819/pexels-photo-1434819.jpeg?auto=compress&cs=tinysrgb&w=400',
        isUserDrop: false
      },
      {
        id: '5',
        name: 'Rock Climbing Wall',
        type: 'adventure' as const,
        location: 'Central Park Recreation',
        distance: 1.5,
        rating: 4.4,
        reviews: 234,
        description: 'Indoor/outdoor climbing experience perfect for adventure seekers.',
        image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
        isUserDrop: true,
        author: 'AdventureSeeker',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
      }
    ];

    // Filter based on user preferences
    if (user?.interests && user.interests.length > 0) {
      const userInterests = user.interests.map(i => i.toLowerCase());
      return baseLocations.filter(loc => {
        const matches = userInterests.some(interest => {
          if (interest.includes('food') && loc.type === 'food') return true;
          if (interest.includes('nature') && loc.type === 'nature') return true;
          if (interest.includes('history') && loc.type === 'historical') return true;
          if (interest.includes('adventure') && loc.type === 'adventure') return true;
          if (interest.includes('photography') && loc.type === 'hidden-gem') return true;
          return false;
        });
        return matches;
      }).concat(baseLocations.slice(0, 2));
    }

    return baseLocations;
  };

  // Generate personalized route recommendations
  const generatePersonalizedRouteRecommendations = (): RouteSegment[] => {
    const baseRecommendations = [
      {
        id: 'r1',
        name: 'Mystic Seaport Museum',
        description: 'Historic maritime museum with authentic 19th-century village and tall ships',
        type: 'historical' as const,
        distanceFromRoute: 2.5,
        estimatedDetour: '+45 min',
        rating: 4.6,
        reviews: 1234,
        image: 'https://images.pexels.com/photos/1486861/pexels-photo-1486861.jpeg?auto=compress&cs=tinysrgb&w=400',
        highlights: ['Historic ships', 'Maritime artifacts', 'Coastal village'],
        bestTime: 'Morning (9-11 AM)',
        coordinates: { lat: 41.3614, lng: -71.9640 }
      },
      {
        id: 'r2',
        name: 'Frank Pepe Pizzeria',
        description: 'Original New Haven apizza institution serving coal-fired thin crust since 1925',
        type: 'food' as const,
        distanceFromRoute: 1.2,
        estimatedDetour: '+20 min',
        rating: 4.8,
        reviews: 2156,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        highlights: ['Coal-fired pizza', 'Historic location', 'Local legend'],
        bestTime: 'Lunch (12-2 PM)',
        coordinates: { lat: 41.3083, lng: -72.9279 }
      },
      {
        id: 'r3',
        name: 'Gillette Castle State Park',
        description: 'Medieval-style castle overlooking the Connecticut River with hiking trails',
        type: 'scenic' as const,
        distanceFromRoute: 3.8,
        estimatedDetour: '+1h 15m',
        rating: 4.4,
        reviews: 856,
        image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
        highlights: ['Castle architecture', 'River views', 'Hiking trails'],
        bestTime: 'Afternoon (2-5 PM)',
        coordinates: { lat: 41.4284, lng: -72.4253 }
      },
      {
        id: 'r4',
        name: 'Essex Steam Train',
        description: 'Vintage steam locomotive ride through Connecticut River Valley',
        type: 'scenic' as const,
        distanceFromRoute: 4.1,
        estimatedDetour: '+2h 30m',
        rating: 4.7,
        reviews: 743,
        image: 'https://images.pexels.com/photos/258867/pexels-photo-258867.jpeg?auto=compress&cs=tinysrgb&w=400',
        highlights: ['Steam train ride', 'Valley scenery', 'Historic experience'],
        bestTime: 'Morning departure',
        coordinates: { lat: 41.3515, lng: -72.3931 }
      },
      {
        id: 'r5',
        name: 'Shell Gas Station & Market',
        description: 'Full-service gas station with convenience store and clean facilities',
        type: 'fuel' as const,
        distanceFromRoute: 0.3,
        estimatedDetour: '+5 min',
        rating: 4.2,
        reviews: 89,
        image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
        highlights: ['24/7 service', 'Clean restrooms', 'Convenience store'],
        bestTime: 'Any time',
        coordinates: { lat: 41.2033, lng: -72.5759 }
      }
    ];

    // Prioritize based on user travel style and interests
    let prioritizedRecommendations = [...baseRecommendations];
    
    if (user?.travelStyle === 'Nature Lover' || user?.interests?.includes('Hiking')) {
      prioritizedRecommendations = prioritizedRecommendations.sort((a, b) => 
        a.type === 'scenic' ? -1 : b.type === 'scenic' ? 1 : 0
      );
    } else if (user?.travelStyle === 'Cultural Enthusiast' || user?.interests?.includes('History')) {
      prioritizedRecommendations = prioritizedRecommendations.sort((a, b) => 
        a.type === 'historical' ? -1 : b.type === 'historical' ? 1 : 0
      );
    } else if (user?.interests?.includes('Food')) {
      prioritizedRecommendations = prioritizedRecommendations.sort((a, b) => 
        a.type === 'food' ? -1 : b.type === 'food' ? 1 : 0
      );
    }

    return [{
      from: routeInput.from || 'New York, NY',
      to: routeInput.to || 'Boston, MA',
      distance: '215 miles',
      estimatedTime: '4h 30m',
      recommendations: prioritizedRecommendations,
      totalCost: '$45-65',
      fuelCost: '$25-35',
      tollCost: '$15-25'
    }];
  };

  const mockLocationSuggestions: LocationSuggestion[] = [
    {
      id: '1',
      title: `You're now in ${currentLocation}. Want to see what others explored here?`,
      description: 'Discover nearby footprints from fellow travelers and popular points of interest',
      type: 'auto-suggest',
      locations: generatePersonalizedLocations().slice(0, 3),
      priority: 'high',
      distance: 0
    },
    {
      id: '2',
      title: 'Hidden Gems Within 5km',
      description: 'Secret spots that only locals and experienced travelers know about',
      type: 'nearby-explore',
      locations: generatePersonalizedLocations().filter(loc => loc.type === 'hidden-gem'),
      priority: 'medium',
      distance: 5
    },
    {
      id: '3',
      title: 'Food Adventures Nearby',
      description: 'Authentic local eateries discovered by the nomad community',
      type: 'nearby-explore',
      locations: generatePersonalizedLocations().filter(loc => loc.type === 'food'),
      priority: 'medium',
      distance: 3
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All', icon: Globe },
    { id: 'historical', label: 'Historical', icon: Star },
    { id: 'food', label: 'Food', icon: Utensils },
    { id: 'nature', label: 'Nature', icon: TreePine },
    { id: 'adventure', label: 'Adventure', icon: Zap },
    { id: 'hidden-gem', label: 'Hidden Gems', icon: Eye }
  ];

  const routeFilterOptions = [
    { id: 'all', label: 'All Stops', icon: Globe },
    { id: 'scenic', label: 'Scenic Views', icon: Mountain },
    { id: 'food', label: 'Food Spots', icon: Utensils },
    { id: 'historical', label: 'Historical', icon: Star },
    { id: 'fuel', label: 'Fuel & Rest', icon: Fuel },
    { id: 'viewpoint', label: 'Viewpoints', icon: Sunrise }
  ];

  const [nearbyLocations] = useState(generatePersonalizedLocations());
  const [suggestions] = useState(mockLocationSuggestions);
  const [routeSegments] = useState(generatePersonalizedRouteRecommendations());

  // Simulate location change detection
  useEffect(() => {
    const locations = [
      'New York, NY', 'Paris, France', 'Tokyo, Japan', 
      'London, UK', 'Barcelona, Spain', 'Mumbai, India',
      'San Francisco, CA', 'Amsterdam, Netherlands'
    ];
    
    const interval = setInterval(() => {
      if (isLocationTracking && !isInTripMode && activeTab === 'nearby') {
        const newLocation = locations[Math.floor(Math.random() * locations.length)];
        setCurrentLocation(newLocation);
        setShowLocationNotification(true);
        
        setTimeout(() => {
          setShowLocationNotification(false);
        }, 5000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isLocationTracking, isInTripMode, activeTab]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'historical': return 'from-purple-400 to-indigo-500';
      case 'food': return 'from-orange-400 to-red-500';
      case 'nature': return 'from-green-400 to-emerald-500';
      case 'adventure': return 'from-yellow-400 to-orange-500';
      case 'hidden-gem': return 'from-pink-400 to-rose-500';
      case 'poi': return 'from-blue-400 to-cyan-500';
      case 'scenic': return 'from-cyan-400 to-blue-500';
      case 'fuel': return 'from-gray-400 to-gray-600';
      case 'rest': return 'from-indigo-400 to-purple-500';
      case 'viewpoint': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'historical': return Star;
      case 'food': return Utensils;
      case 'nature': return TreePine;
      case 'adventure': return Zap;
      case 'hidden-gem': return Eye;
      case 'poi': return MapPin;
      case 'scenic': return Mountain;
      case 'fuel': return Fuel;
      case 'rest': return Building;
      case 'viewpoint': return Sunrise;
      default: return MapPin;
    }
  };

  const filteredLocations = selectedFilter === 'all' 
    ? nearbyLocations 
    : nearbyLocations.filter(loc => loc.type === selectedFilter);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleCalculateRoute = () => {
    if (!routeInput.from || !routeInput.to) return;
    
    setIsCalculatingRoute(true);
    
    setTimeout(() => {
      setIsCalculatingRoute(false);
      setShowRouteRecommendations(true);
    }, 2000);
  };

  const handleStartTrip = () => {
    if (!routeInput.from || !routeInput.to) return;
    
    startTrip(
      { lat: 40.7128, lng: -74.0060, name: routeInput.from },
      { lat: 42.3601, lng: -71.0589, name: routeInput.to }
    );
  };

  const handleSaveRoute = () => {
    const routeName = `${routeInput.from} → ${routeInput.to}`;
    setSavedRoutes(prev => [...prev, routeName]);
  };

  const handleAddToRoute = (recommendationId: string) => {
    // Update recommendation as added
    console.log('Adding to route:', recommendationId);
  };

  const handleExploreNearby = () => {
    console.log('Exploring nearby locations');
  };

  const filteredRouteRecommendations = selectedRouteType === 'all' 
    ? routeSegments[0]?.recommendations || []
    : routeSegments[0]?.recommendations?.filter(rec => rec.type === selectedRouteType) || [];

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Trip Progress Bar (when in trip mode) */}
      {isInTripMode && activeTrip && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-gradient-to-r from-blue-500/90 to-cyan-500/90 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-white" />
              <span className="text-white font-semibold">Trip in Progress</span>
            </div>
            <button
              onClick={endTrip}
              className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Square className="h-4 w-4 text-white" />
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-white text-sm">
              <span>{activeTrip.from.name} → {activeTrip.to.name}</span>
              <span>{activeTrip.progress.toFixed(1)}%</span>
            </div>
            
            <div className="w-full h-2 bg-white/20 rounded-full">
              <div
                className="h-2 bg-white rounded-full transition-all duration-300"
                style={{ width: `${activeTrip.progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-white/80 text-xs">
              <span>{activeTrip.distanceRemaining} remaining</span>
              <span>ETA: {activeTrip.estimatedTimeRemaining}</span>
            </div>
            
            {activeTrip.nextStop && (
              <div className="bg-white/10 rounded-lg p-2 mt-2">
                <div className="text-white text-xs">
                  <strong>Next Stop:</strong> {activeTrip.nextStop.name} ({activeTrip.nextStop.distance})
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location Change Notification */}
      {showLocationNotification && !isInTripMode && activeTab === 'nearby' && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl animate-fade-in-up">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm">Location Detected</h3>
              <p className="text-white/80 text-xs">You're now in {currentLocation}. Want to see what others explored here?</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowLocationNotification(false)}
                className="px-3 py-1 bg-white/20 rounded-lg text-white text-xs font-medium hover:bg-white/30 transition-colors"
              >
                Explore
              </button>
              <button 
                onClick={() => setShowLocationNotification(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6" style={{ marginTop: isInTripMode ? '120px' : '0' }}>
        <h1 className="text-2xl font-bold text-white mb-2">Explore & Plan</h1>
        <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm mb-4">
          <MapPin className="h-4 w-4" />
          <span>Current location: {isInTripMode ? activeTrip?.currentLocation.name : currentLocation}</span>
          <button
            onClick={() => setIsLocationTracking(!isLocationTracking)}
            className={`p-1 rounded-full ${isLocationTracking ? 'text-green-400' : 'text-gray-400'}`}
          >
            <Navigation className="h-4 w-4" />
          </button>
        </div>
        <p className="text-gray-400 text-sm">
          {isInTripMode ? 'In-trip mode: Dynamic suggestions based on your route' : 'Discover nearby places and plan your perfect route'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-2xl bg-black/20 p-1 mb-6">
        <button
          onClick={() => setActiveTab('nearby')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'nearby'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span className="text-sm font-medium">Nearby Exploration</span>
        </button>
        <button
          onClick={() => setActiveTab('route-planning')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'route-planning'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Route className="h-4 w-4" />
          <span className="text-sm font-medium">Route Planning</span>
        </button>
      </div>

      {/* Nearby Exploration Tab */}
      {activeTab === 'nearby' && (
        <div>
          {/* Quick Actions */}
          <div className="mb-6">
            <button 
              onClick={handleExploreNearby}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5 text-white" />
              <span className="text-white font-medium">What's Nearby?</span>
            </button>
          </div>

          {/* Search Radius Control */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Search Radius</span>
              <span className="text-cyan-400 font-bold">{searchRadius} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1km</span>
              <span>50km</span>
            </div>
          </div>

          {/* Auto-Suggestions */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span>Personalized Suggestions</span>
            </h2>
            
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 ${
                    suggestion.priority === 'high' ? 'border-cyan-400/30 bg-gradient-to-r from-cyan-500/5 to-blue-500/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{suggestion.title}</h3>
                      <p className="text-gray-400 text-sm">{suggestion.description}</p>
                    </div>
                    {suggestion.priority === 'high' && (
                      <Award className="h-5 w-5 text-yellow-400" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {suggestion.locations.slice(0, 2).map((location) => {
                      const IconComponent = getTypeIcon(location.type);
                      return (
                        <div
                          key={location.id}
                          className="bg-black/20 rounded-xl p-3 hover:bg-black/30 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getTypeColor(location.type)} flex items-center justify-center`}>
                              <IconComponent className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium text-sm">{location.name}</h4>
                              <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <span>{location.distance}km away</span>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span>{location.rating}</span>
                                </div>
                                {location.isUserDrop && (
                                  <span className="text-cyan-400">• User Drop</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <button className="w-full mt-3 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-xl text-cyan-400 text-sm font-medium hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-blue-500/30 transition-colors">
                    Explore All ({suggestion.locations.length} locations)
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-lg font-semibold text-white">Nearby Explorer</h2>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Filter className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
            {filterOptions.map((filter) => (
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

          {/* Nearby Locations */}
          <div className="space-y-4">
            {filteredLocations.map((location) => {
              const IconComponent = getTypeIcon(location.type);
              return (
                <div
                  key={location.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  <div className="h-32 overflow-hidden">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getTypeColor(location.type)} flex items-center justify-center`}>
                            <IconComponent className="h-3 w-3 text-white" />
                          </div>
                          <h3 className="text-white font-semibold">{location.name}</h3>
                          {location.isUserDrop && (
                            <div className="bg-cyan-500/20 px-2 py-1 rounded-full">
                              <span className="text-cyan-400 text-xs font-medium">Drop</span>
                            </div>
                          )}
                        </div>
                        <div className="text-gray-400 text-sm mb-2">{location.location} • {location.distance}km away</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-yellow-400 text-sm">{location.rating}</span>
                        </div>
                        <div className="text-gray-400 text-xs">{location.reviews} reviews</div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">{location.description}</p>

                    {location.tips && (
                      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-3 mb-3 border border-blue-400/30">
                        <div className="flex items-center space-x-2 mb-1">
                          <Zap className="h-3 w-3 text-blue-400" />
                          <span className="text-blue-400 text-xs font-medium">Local Tip</span>
                        </div>
                        <p className="text-blue-300 text-xs">{location.tips}</p>
                      </div>
                    )}

                    {location.isUserDrop && location.author && (
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span>by {location.author}</span>
                        <span>{formatTimeAgo(location.timestamp!)}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                        <Navigation className="h-4 w-4" />
                        <span>Get Directions</span>
                      </button>
                      
                      <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                        <Heart className="h-4 w-4 text-gray-400 hover:text-pink-400" />
                      </button>
                      
                      <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                        <Camera className="h-4 w-4 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Route Planning Tab */}
      {activeTab === 'route-planning' && (
        <div>
          {/* Route Input Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mb-6">
            <div className="text-center mb-4">
              <Car className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Plan Your Journey</h3>
              <p className="text-gray-400 text-sm">Get AI-powered stops along your route</p>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="From (e.g., New York, NY)"
                  value={routeInput.from}
                  onChange={(e) => setRouteInput(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="To (e.g., Boston, MA)"
                  value={routeInput.to}
                  onChange={(e) => setRouteInput(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                />
              </div>

              {/* Route Options */}
              <div className="bg-black/20 rounded-xl p-4">
                <h4 className="text-white font-medium mb-3 text-sm">Route Preferences</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Optimization</label>
                    <select
                      value={routeOptions.optimization}
                      onChange={(e) => setRouteOptions(prev => ({ ...prev, optimization: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-orange-400 focus:outline-none"
                    >
                      <option value="fastest" className="bg-slate-800">Fastest Route</option>
                      <option value="scenic" className="bg-slate-800">Most Scenic</option>
                      <option value="economical" className="bg-slate-800">Most Economical</option>
                      <option value="eco-friendly" className="bg-slate-800">Eco-Friendly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Max Detour</label>
                    <select
                      value={routeOptions.maxDetourTime}
                      onChange={(e) => setRouteOptions(prev => ({ ...prev, maxDetourTime: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-orange-400 focus:outline-none"
                    >
                      <option value={15} className="bg-slate-800">15 minutes</option>
                      <option value={30} className="bg-slate-800">30 minutes</option>
                      <option value={60} className="bg-slate-800">1 hour</option>
                      <option value={120} className="bg-slate-800">2 hours</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-3">
                  <label className="flex items-center space-x-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={routeOptions.avoidTolls}
                      onChange={(e) => setRouteOptions(prev => ({ ...prev, avoidTolls: e.target.checked }))}
                      className="rounded border-white/20 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                    />
                    <span>Avoid Tolls</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={routeOptions.avoidHighways}
                      onChange={(e) => setRouteOptions(prev => ({ ...prev, avoidHighways: e.target.checked }))}
                      className="rounded border-white/20 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                    />
                    <span>Avoid Highways</span>
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleCalculateRoute}
                  disabled={!routeInput.from || !routeInput.to || isCalculatingRoute}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isCalculatingRoute ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <Route className="h-4 w-4" />
                      <span>Get Recommendations</span>
                    </>
                  )}
                </button>
                
                {showRouteRecommendations && !isInTripMode && (
                  <button
                    onClick={handleStartTrip}
                    disabled={!routeInput.from || !routeInput.to}
                    className="bg-gradient-to-r from-green-500 to-teal-500 px-4 py-3 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Trip</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Map Placeholder */}
          {showRouteRecommendations && (
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl border border-blue-400/30 p-6 mb-6">
              <div className="text-center">
                <Map className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-medium mb-2">Interactive Route Map</h3>
                <p className="text-blue-300 text-sm mb-4">
                  Full interactive map with route visualization and stop markers would be displayed here
                </p>
                <div className="bg-black/20 rounded-xl p-4 text-center">
                  <div className="text-gray-400 text-sm">
                    📍 Route: {routeSegments[0]?.from} → {routeSegments[0]?.to}
                    <br />
                    🛣️ Distance: {routeSegments[0]?.distance} • ⏱️ Time: {routeSegments[0]?.estimatedTime}
                    <br />
                    💰 Total Cost: {routeSegments[0]?.totalCost}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Info */}
          {showRouteRecommendations && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl border border-green-400/30 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-medium text-sm">Traffic Status</span>
                </div>
                <p className="text-green-300 text-xs">Light traffic • +5 min delay</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl border border-blue-400/30 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CloudRain className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium text-sm">Weather</span>
                </div>
                <p className="text-blue-300 text-xs">Partly cloudy • 22°C</p>
              </div>
            </div>
          )}

          {/* Route Recommendations Display */}
          {showRouteRecommendations && routeSegments[0] && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl p-4 border border-green-400/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Map className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-medium">Route Found</span>
                </div>
                <div className="text-white text-sm">
                  <span className="font-medium">{routeSegments[0].from}</span> → <span className="font-medium">{routeSegments[0].to}</span>
                </div>
                <div className="text-gray-300 text-xs mt-1">
                  {routeSegments[0].distance} • {routeSegments[0].estimatedTime} • {routeSegments[0].recommendations.length} stops found
                </div>
                
                {/* Route Actions */}
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={handleSaveRoute}
                    className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl text-purple-400 text-sm font-medium hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-500/30 transition-colors"
                  >
                    <Bookmark className="h-3 w-3" />
                    <span>Save Route</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl text-blue-400 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-cyan-500/30 transition-colors">
                    <Share className="h-3 w-3" />
                    <span>Share</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-400/30 rounded-xl text-green-400 text-sm font-medium hover:bg-gradient-to-r hover:from-green-500/30 hover:to-teal-500/30 transition-colors">
                    <Download className="h-3 w-3" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Saved Routes */}
              {savedRoutes.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                  <h4 className="text-white font-medium mb-3 text-sm">Saved Routes</h4>
                  <div className="space-y-2">
                    {savedRoutes.map((route, index) => (
                      <div key={index} className="flex items-center justify-between bg-black/20 rounded-lg p-2">
                        <span className="text-gray-300 text-sm">{route}</span>
                        <button className="text-cyan-400 text-xs hover:text-cyan-300">Load</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Route Filters */}
              <div className="flex overflow-x-auto space-x-2 pb-2">
                {routeFilterOptions.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedRouteType(filter.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                      selectedRouteType === filter.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    <filter.icon className="h-4 w-4" />
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>

              {/* Route Recommendations List */}
              <div className="space-y-3">
                {filteredRouteRecommendations.map((recommendation) => {
                  const IconComponent = getTypeIcon(recommendation.type);
                  return (
                    <div
                      key={recommendation.id}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                    >
                      <div className="h-32 overflow-hidden">
                        <img
                          src={recommendation.image}
                          alt={recommendation.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getTypeColor(recommendation.type)} flex items-center justify-center`}>
                                <IconComponent className="h-3 w-3 text-white" />
                              </div>
                              <h3 className="text-white font-semibold">{recommendation.name}</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{recommendation.description}</p>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-yellow-400 text-sm">{recommendation.rating}</span>
                            </div>
                            <div className="text-gray-400 text-xs">{recommendation.reviews} reviews</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <Navigation2 className="h-3 w-3" />
                            <span>{recommendation.distanceFromRoute}km off route</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{recommendation.estimatedDetour} detour</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {recommendation.highlights.slice(0, 3).map((highlight, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full text-xs text-orange-400 border border-orange-400/30"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-300">
                            Best time: {recommendation.bestTime}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleAddToRoute(recommendation.id)}
                              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                recommendation.isAdded
                                  ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                              }`}
                            >
                              {recommendation.isAdded ? (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4" />
                                  <span>Add to Route</span>
                                </>
                              )}
                            </button>
                            
                            <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                              <Info className="h-4 w-4 text-gray-400 hover:text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredRouteRecommendations.length === 0 && (
                <div className="text-center py-8">
                  <Route className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-white font-medium mb-2">No {selectedRouteType} stops found</h3>
                  <p className="text-gray-400 text-sm">Try a different filter or check another route</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DiscoveryPage;