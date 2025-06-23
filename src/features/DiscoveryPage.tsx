import React, { useState, useEffect } from 'react';
import { 
  Target, MapPin, Search, Filter, Plus, Navigation, 
  Eye, Star, Heart, Camera, Clock, Users, Zap,
  Compass, Globe, Footprints, AlertTriangle, Bell,
  TrendingUp, Award, RefreshCw, Settings, Map
} from 'lucide-react';

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

function DiscoveryPage() {
  const [currentLocation, setCurrentLocation] = useState('New York, NY');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showLocationNotification, setShowLocationNotification] = useState(true);
  const [searchRadius, setSearchRadius] = useState(25); // km
  const [isLocationTracking, setIsLocationTracking] = useState(true);

  // Mock nearby locations with global coverage
  const mockNearbyLocations: NearbyLocation[] = [
    // New York Area
    {
      id: '1',
      name: 'Central Park Secret Garden',
      type: 'hidden-gem',
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
      type: 'nature',
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
      type: 'food',
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
    // Paris Area
    {
      id: '4',
      name: 'Secret Rooftop Vineyard',
      type: 'hidden-gem',
      location: 'Montmartre, Paris',
      distance: 3.4,
      rating: 4.9,
      reviews: 89,
      description: 'Hidden vineyard in the heart of Paris that produces actual wine. Locals only!',
      image: 'https://images.pexels.com/photos/1434819/pexels-photo-1434819.jpeg?auto=compress&cs=tinysrgb&w=400',
      isUserDrop: true,
      author: 'ParisSecret',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      tips: 'Visit during harvest season in September'
    },
    // Tokyo Area
    {
      id: '5',
      name: 'Underground Ramen Alley',
      type: 'food',
      location: 'Shibuya, Tokyo',
      distance: 1.8,
      rating: 4.8,
      reviews: 345,
      description: 'Tiny underground ramen shop frequented by salarymen. Best tonkotsu in Tokyo.',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      isUserDrop: true,
      author: 'TokyoEats',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      tips: 'No English menu - point at what others are eating'
    },
    // London Area
    {
      id: '6',
      name: 'Thames Secret Beach',
      type: 'nature',
      location: 'Rotherhithe, London',
      distance: 4.2,
      rating: 4.6,
      reviews: 156,
      description: 'Actual sandy beach on the Thames that appears at low tide. Victorian treasure hunting.',
      image: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=400',
      isUserDrop: true,
      author: 'LondonExplorer',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      tips: 'Check tide times - only accessible at low tide'
    }
  ];

  const mockLocationSuggestions: LocationSuggestion[] = [
    {
      id: '1',
      title: `You're now in ${currentLocation}. Want to see what others explored here?`,
      description: 'Discover nearby footprints from fellow travelers and popular points of interest',
      type: 'auto-suggest',
      locations: mockNearbyLocations.slice(0, 3),
      priority: 'high',
      distance: 0
    },
    {
      id: '2',
      title: 'Hidden Gems Within 5km',
      description: 'Secret spots that only locals and experienced travelers know about',
      type: 'nearby-explore',
      locations: mockNearbyLocations.filter(loc => loc.type === 'hidden-gem'),
      priority: 'medium',
      distance: 5
    },
    {
      id: '3',
      title: 'Food Adventures Nearby',
      description: 'Authentic local eateries discovered by the nomad community',
      type: 'nearby-explore',
      locations: mockNearbyLocations.filter(loc => loc.type === 'food'),
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

  const [nearbyLocations] = useState(mockNearbyLocations);
  const [suggestions] = useState(mockLocationSuggestions);

  // Simulate location change detection
  useEffect(() => {
    const locations = [
      'New York, NY', 'Paris, France', 'Tokyo, Japan', 
      'London, UK', 'Barcelona, Spain', 'Mumbai, India',
      'San Francisco, CA', 'Amsterdam, Netherlands'
    ];
    
    const interval = setInterval(() => {
      if (isLocationTracking) {
        const newLocation = locations[Math.floor(Math.random() * locations.length)];
        setCurrentLocation(newLocation);
        setShowLocationNotification(true);
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setShowLocationNotification(false);
        }, 5000);
      }
    }, 15000); // Change location every 15 seconds for demo

    return () => clearInterval(interval);
  }, [isLocationTracking]);

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
    // This will open the create footprint modal
    console.log('Opening footprint creation modal');
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Location Change Notification */}
      {showLocationNotification && (
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
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Discovery Hub</h1>
        <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm mb-4">
          <MapPin className="h-4 w-4" />
          <span>Current location: {currentLocation}</span>
          <button
            onClick={() => setIsLocationTracking(!isLocationTracking)}
            className={`p-1 rounded-full ${isLocationTracking ? 'text-green-400' : 'text-gray-400'}`}
          >
            {isLocationTracking ? <Navigation className="h-4 w-4" /> : <NavigationOff className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-gray-400 text-sm">Auto-suggestions and nearby drops from fellow travelers</p>
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
        
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
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
          <span>Auto-Suggestions</span>
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

      {/* Future: Route-Based Recommendations */}
      <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Route-Based Recommendations</h3>
          <p className="text-gray-400 text-sm mb-4">
            Coming soon: AI-powered suggestions based on your travel route with stops for scenic spots and food joints
          </p>
          <div className="flex items-center justify-center space-x-2 text-purple-400 text-sm">
            <RefreshCw className="h-4 w-4" />
            <span>Future Phase Feature</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export default DiscoveryPage;