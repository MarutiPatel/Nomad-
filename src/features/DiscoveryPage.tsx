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
  const [currentLocation, setCurrentLocation] = useState('New York, NY');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchRadius, setSearchRadius] = useState(25); // km
  const [isLocationTracking, setIsLocationTracking] = useState(true);
  
  // Route-based recommendation states
  const [routeInput, setRouteInput] = useState({ from: '', to: '' });
  const [showRouteRecommendations, setShowRouteRecommendations] = useState(false);
  const [selectedRouteType, setSelectedRouteType] = useState<string>('all');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Mock nearby locations with enhanced personalization
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
      }
    ];

    // Filter based on user preferences
    if (user?.interests && user.interests.length > 0) {
      const userInterests = user.interests.map(i => i.toLowerCase());
      return baseLocations.filter(loc => {
        // Match interests to location types
        const matches = userInterests.some(interest => {
          if (interest.includes('food') && loc.type === 'food') return true;
          if (interest.includes('nature') && loc.type === 'nature') return true;
          if (interest.includes('history') && loc.type === 'historical') return true;
          if (interest.includes('adventure') && loc.type === 'adventure') return true;
          if (interest.includes('photography') && loc.type === 'hidden-gem') return true;
          return false;
        });
        return matches;
      }).concat(baseLocations.slice(0, 2)); // Always include some general locations
    }

    return baseLocations;
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

  const [nearbyLocations] = useState(generatePersonalizedLocations());
  const [suggestions] = useState(mockLocationSuggestions);

  // Simulate location change detection
  useEffect(() => {
    const locations = [
      'New York, NY', 'Paris, France', 'Tokyo, Japan', 
      'London, UK', 'Barcelona, Spain', 'Mumbai, India'
    ];
    
    const interval = setInterval(() => {
      if (isLocationTracking && !isInTripMode) {
        const newLocation = locations[Math.floor(Math.random() * locations.length)];
        setCurrentLocation(newLocation);
      }
    }, 15000); // Change location every 15 seconds for demo

    return () => clearInterval(interval);
  }, [isLocationTracking, isInTripMode]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'historical': return 'from-purple-400 to-indigo-500';
      case 'food': return 'from-orange-400 to-red-500';
      case 'nature': return 'from-green-400 to-emerald-500';
      case 'adventure': return 'from-yellow-400 to-orange-500';
      case 'hidden-gem': return 'from-pink-400 to-rose-500';
      case 'poi': return 'from-blue-400 to-cyan-500';
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
      default: return MapPin;
    }
  };

  const filteredLocations = selectedFilter === 'all' 
    ? nearbyLocations 
    : nearbyLocations.filter(loc => loc.type === selectedFilter);

  const handleDropFootprint = () => {
    console.log('Opening footprint creation modal');
    // Navigate to footprints page and open create modal
    window.location.href = '/dashboard/footprints';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* TEST ELEMENT - This will confirm if the component is rendering */}
      <div style={{ color: 'white', fontSize: '24px', textAlign: 'center', padding: '20px', backgroundColor: 'red' }}>
        Discovery Page is Rendering!
      </div>

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
          {isInTripMode ? 'In-trip mode: Dynamic suggestions based on your route' : 'Auto-suggestions and nearby drops from fellow travelers'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={handleDropFootprint}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5 text-white" />
          <span className="text-white font-medium">Drop Footprint</span>
        </button>
        
        <button 
          className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
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
  );
}

export default DiscoveryPage;