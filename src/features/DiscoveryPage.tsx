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
  const { activeTrip } = useTrip();
  const [activeTab, setActiveTab] = useState<'nearby' | 'route'>('nearby');
  const [currentLocation, setCurrentLocation] = useState('Amsterdam, Netherlands');
  const [selectedLocation, setSelectedLocation] = useState<NearbyLocation | null>(null);
  const [routeOptions, setRouteOptions] = useState<RouteOptions>({
    optimization: 'fastest',
    avoidTolls: false,
    avoidHighways: false,
    includeStops: true,
    maxDetourTime: 30
  });

  // Mock data for nearby locations
  const mockNearbyLocations: NearbyLocation[] = [
    {
      id: '1',
      name: 'Anne Frank House',
      type: 'historical',
      location: 'Prinsengracht 263, Amsterdam',
      distance: 2.1,
      rating: 4.8,
      reviews: 12453,
      description: 'Historic house and biographical museum dedicated to Jewish wartime diarist Anne Frank.',
      image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400',
      isUserDrop: false,
      tips: 'Book tickets online in advance. Very popular attraction.'
    },
    {
      id: '2',
      name: 'Vondelpark',
      type: 'nature',
      location: 'Amsterdam, Netherlands',
      distance: 1.8,
      rating: 4.6,
      reviews: 8932,
      description: 'Large urban park with walking paths, ponds, and outdoor theater performances.',
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=400',
      isUserDrop: false,
      tips: 'Perfect for morning jogs and picnics. Free entry.'
    },
    {
      id: '3',
      name: 'Local Stroopwafel Stand',
      type: 'food',
      location: 'Dam Square, Amsterdam',
      distance: 0.5,
      rating: 4.9,
      reviews: 234,
      description: 'Authentic Dutch stroopwafels made fresh. Hidden gem discovered by travelers.',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      isUserDrop: true,
      author: 'FoodieNomad23',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tips: 'Try the cinnamon variety. Cash only!'
    },
    {
      id: '4',
      name: 'Secret Garden Cafe',
      type: 'hidden-gem',
      location: 'Hidden alley near Jordaan',
      distance: 1.2,
      rating: 4.7,
      reviews: 156,
      description: 'Cozy hidden cafe with beautiful garden courtyard. Local favorite.',
      image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
      isUserDrop: true,
      author: 'CafeHunter',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      tips: 'Ask for the daily special. Great for quiet work sessions.'
    }
  ];

  // Mock data for location suggestions
  const mockLocationSuggestions: LocationSuggestion[] = [
    {
      id: '1',
      title: 'Must-Visit Historical Sites',
      description: 'Explore Amsterdam\'s rich history and cultural heritage',
      type: 'auto-suggest',
      priority: 'high',
      distance: 2.5,
      locations: mockNearbyLocations.filter(loc => loc.type === 'historical')
    },
    {
      id: '2',
      title: 'Hidden Food Gems',
      description: 'Discover authentic local cuisine away from tourist crowds',
      type: 'nearby-explore',
      priority: 'high',
      distance: 1.0,
      locations: mockNearbyLocations.filter(loc => loc.type === 'food' || loc.type === 'hidden-gem')
    },
    {
      id: '3',
      title: 'Nature & Relaxation',
      description: 'Find peaceful spots to unwind in the city',
      type: 'auto-suggest',
      priority: 'medium',
      distance: 2.0,
      locations: mockNearbyLocations.filter(loc => loc.type === 'nature')
    }
  ];

  // Mock data for route recommendations
  const mockRouteRecommendations: RouteRecommendation[] = [
    {
      id: '1',
      name: 'Keukenhof Gardens',
      description: 'World-famous tulip gardens (seasonal)',
      type: 'scenic',
      distanceFromRoute: 15,
      estimatedDetour: '45 min',
      rating: 4.9,
      reviews: 23451,
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      highlights: ['Millions of tulips', 'Scenic gardens', 'Photography spots'],
      bestTime: 'March - May',
      coordinates: { lat: 52.2698, lng: 4.5469 }
    },
    {
      id: '2',
      name: 'Zaanse Schans',
      description: 'Historic windmills and traditional crafts',
      type: 'historical',
      distanceFromRoute: 20,
      estimatedDetour: '1 hour',
      rating: 4.6,
      reviews: 18765,
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      highlights: ['Working windmills', 'Cheese making', 'Traditional houses'],
      bestTime: 'Year round',
      coordinates: { lat: 52.4761, lng: 4.8176 }
    },
    {
      id: '3',
      name: 'Dutch Countryside Route',
      description: 'Scenic drive through tulip fields and farms',
      type: 'scenic',
      distanceFromRoute: 5,
      estimatedDetour: '30 min',
      rating: 4.7,
      reviews: 9876,
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      highlights: ['Tulip fields', 'Traditional farms', 'Peaceful roads'],
      bestTime: 'April - September',
      coordinates: { lat: 52.3676, lng: 4.9041 }
    }
  ];

  // Mock data for route segments
  const mockRouteSegments: RouteSegment[] = [
    {
      from: 'Amsterdam',
      to: 'Utrecht',
      distance: '58 km',
      estimatedTime: '45 min',
      totalCost: '€12.50',
      fuelCost: '€8.50',
      tollCost: '€4.00',
      recommendations: mockRouteRecommendations.slice(0, 2)
    },
    {
      from: 'Utrecht',
      to: 'Rotterdam',
      distance: '65 km',
      estimatedTime: '50 min',
      totalCost: '€14.20',
      fuelCost: '€9.20',
      tollCost: '€5.00',
      recommendations: mockRouteRecommendations.slice(1, 3)
    }
  ];

  const handleDropFootprint = () => {
    // Simulate dropping a footprint at current location
    console.log('Dropping footprint at:', currentLocation);
    // In real app, this would open a modal to create a new footprint
  };

  const handleWhatsNearby = () => {
    // Simulate searching for nearby places
    console.log('Searching for nearby places...');
    // In real app, this would trigger a more detailed search
  };

  const handleLocationSelect = (location: NearbyLocation) => {
    setSelectedLocation(location);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'historical': return Building;
      case 'food': return Utensils;
      case 'nature': return TreePine;
      case 'adventure': return Mountain;
      case 'hidden-gem': return Star;
      case 'scenic': return Sunrise;
      case 'viewpoint': return CameraIcon;
      case 'rest': return Coffee;
      case 'fuel': return Fuel;
      default: return MapPin;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'historical': return 'from-blue-400 to-cyan-500';
      case 'food': return 'from-orange-400 to-red-500';
      case 'nature': return 'from-green-400 to-teal-500';
      case 'adventure': return 'from-purple-400 to-pink-500';
      case 'hidden-gem': return 'from-yellow-400 to-orange-500';
      case 'scenic': return 'from-pink-400 to-rose-500';
      case 'viewpoint': return 'from-indigo-400 to-blue-500';
      case 'rest': return 'from-amber-400 to-orange-500';
      case 'fuel': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Explore & Plan</h1>
        <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm mb-2">
          <MapPin className="h-4 w-4" />
          <span>Current location: {currentLocation}</span>
          <Navigation2 className="h-4 w-4 text-cyan-400" />
        </div>
        <p className="text-gray-400 text-sm">Discover nearby places and plan your perfect route</p>
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
          onClick={() => setActiveTab('route')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'route'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Route className="h-4 w-4" />
          <span className="text-sm font-medium">Route Planning</span>
        </button>
      </div>

      {/* Nearby Exploration Tab */}
      {activeTab === 'nearby' && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDropFootprint}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-2xl text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Drop Footprint</span>
            </button>
            <button
              onClick={handleWhatsNearby}
              className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>What's Nearby?</span>
            </button>
          </div>

          {/* Location Suggestions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Suggested for You</h3>
            <div className="space-y-3">
              {mockLocationSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium mb-1">{suggestion.title}</h4>
                      <p className="text-gray-400 text-sm">{suggestion.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      suggestion.priority === 'high' ? 'bg-green-500/20 text-green-400' :
                      suggestion.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {suggestion.priority}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-400 text-xs mb-3">
                    <MapPin className="h-3 w-3" />
                    <span>{suggestion.locations.length} places</span>
                    <span>•</span>
                    <span>~{suggestion.distance}km away</span>
                  </div>

                  <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                    Explore →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Locations */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Near You</h3>
            <div className="space-y-4">
              {mockNearbyLocations.map((location) => {
                const IconComponent = getTypeIcon(location.type);
                return (
                  <div
                    key={location.id}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer"
                    onClick={() => handleLocationSelect(location)}
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
                          <h4 className="text-white font-medium mb-1">{location.name}</h4>
                          <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
                            <MapPin className="h-3 w-3" />
                            <span>{location.distance}km away</span>
                          </div>
                        </div>
                        
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getTypeColor(location.type)} flex items-center justify-center`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-yellow-400 text-sm">{location.rating}</span>
                        </div>
                        <span className="text-gray-400 text-xs">({location.reviews} reviews)</span>
                        
                        {location.isUserDrop && (
                          <div className="bg-orange-500/20 px-2 py-1 rounded-full">
                            <span className="text-orange-400 text-xs font-medium">User Drop</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-300 text-sm mb-3">{location.description}</p>

                      {location.tips && (
                        <div className="bg-cyan-500/10 rounded-xl p-2 mb-3 border border-cyan-400/30">
                          <p className="text-cyan-300 text-xs">💡 {location.tips}</p>
                        </div>
                      )}

                      {location.isUserDrop && location.author && (
                        <div className="flex items-center space-x-2 text-xs text-gray-400 mb-3">
                          <Users className="h-3 w-3" />
                          <span>Shared by {location.author}</span>
                          {location.timestamp && (
                            <>
                              <span>•</span>
                              <span>{new Date(location.timestamp).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 capitalize">{location.type.replace('-', ' ')}</span>
                        <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Route Planning Tab */}
      {activeTab === 'route' && (
        <div className="space-y-6">
          {/* Route Options */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <h3 className="text-white font-semibold mb-4">Route Preferences</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Optimization</label>
                <select
                  value={routeOptions.optimization}
                  onChange={(e) => setRouteOptions(prev => ({ ...prev, optimization: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="fastest" className="bg-slate-800">Fastest Route</option>
                  <option value="scenic" className="bg-slate-800">Most Scenic</option>
                  <option value="economical" className="bg-slate-800">Most Economical</option>
                  <option value="eco-friendly" className="bg-slate-800">Eco-Friendly</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={routeOptions.avoidTolls}
                    onChange={(e) => setRouteOptions(prev => ({ ...prev, avoidTolls: e.target.checked }))}
                    className="w-4 h-4 text-cyan-600 bg-black/20 border-white/10 rounded focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-300">Avoid Tolls</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={routeOptions.avoidHighways}
                    onChange={(e) => setRouteOptions(prev => ({ ...prev, avoidHighways: e.target.checked }))}
                    className="w-4 h-4 text-cyan-600 bg-black/20 border-white/10 rounded focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-300">Avoid Highways</span>
                </label>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Max Detour Time: {routeOptions.maxDetourTime} min</label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  value={routeOptions.maxDetourTime}
                  onChange={(e) => setRouteOptions(prev => ({ ...prev, maxDetourTime: Number(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Route Segments */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Route Overview</h3>
            <div className="space-y-4">
              {mockRouteSegments.map((segment, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-white font-medium">{segment.from} → {segment.to}</h4>
                      <div className="flex items-center space-x-4 text-gray-400 text-sm mt-1">
                        <span>{segment.distance}</span>
                        <span>•</span>
                        <span>{segment.estimatedTime}</span>
                        {segment.totalCost && (
                          <>
                            <span>•</span>
                            <span className="text-green-400">{segment.totalCost}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                      Customize →
                    </button>
                  </div>

                  {segment.recommendations.length > 0 && (
                    <div>
                      <h5 className="text-gray-300 text-sm font-medium mb-2">Recommendations Along Route</h5>
                      <div className="space-y-2">
                        {segment.recommendations.map((rec) => {
                          const IconComponent = getTypeIcon(rec.type);
                          return (
                            <div
                              key={rec.id}
                              className="bg-black/20 rounded-xl p-3 border border-white/10"
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getTypeColor(rec.type)} flex items-center justify-center flex-shrink-0`}>
                                  <IconComponent className="h-4 w-4 text-white" />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-1">
                                    <h6 className="text-white font-medium text-sm">{rec.name}</h6>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                      <span className="text-yellow-400 text-xs">{rec.rating}</span>
                                    </div>
                                  </div>
                                  
                                  <p className="text-gray-400 text-xs mb-2">{rec.description}</p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                                      <span>+{rec.estimatedDetour}</span>
                                      <span>•</span>
                                      <span>{rec.distanceFromRoute}km detour</span>
                                    </div>
                                    
                                    <button className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors">
                                      Add to Route
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
              ))}
            </div>
          </div>

          {/* Route Actions */}
          <div className="flex space-x-3">
            <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <Route className="h-5 w-5" />
              <span>Start Navigation</span>
            </button>
            
            <button className="px-6 py-4 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
              <Share className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Location Detail Modal */}
      {selectedLocation && (
        <LocationDetailModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
}

function LocationDetailModal({ 
  location, 
  onClose 
}: { 
  location: NearbyLocation; 
  onClose: () => void;
}) {
  const IconComponent = location.type === 'historical' ? Building :
                       location.type === 'food' ? Utensils :
                       location.type === 'nature' ? TreePine :
                       location.type === 'adventure' ? Mountain :
                       location.type === 'hidden-gem' ? Star : MapPin;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{location.name}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="mb-4">
            <img
              src={location.image}
              alt={location.name}
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                <IconComponent className="h-4 w-4 text-white" />
              </div>
              <span className="text-gray-300 text-sm capitalize">{location.type.replace('-', ' ')}</span>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Description</h3>
              <p className="text-gray-300 text-sm">{location.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-medium mb-2">Rating</h3>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-yellow-400">{location.rating}</span>
                  <span className="text-gray-400 text-sm">({location.reviews})</span>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Distance</h3>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span className="text-cyan-400">{location.distance}km away</span>
                </div>
              </div>
            </div>

            {location.tips && (
              <div>
                <h3 className="text-white font-medium mb-2">Traveler Tips</h3>
                <div className="bg-cyan-500/10 rounded-xl p-3 border border-cyan-400/30">
                  <p className="text-cyan-300 text-sm">💡 {location.tips}</p>
                </div>
              </div>
            )}

            {location.isUserDrop && location.author && (
              <div>
                <h3 className="text-white font-medium mb-2">Shared By</h3>
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{location.author}</span>
                  {location.timestamp && (
                    <>
                      <span>•</span>
                      <span>{new Date(location.timestamp).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
                <Navigation className="h-5 w-5" />
                <span>Get Directions</span>
              </button>
              
              <button className="px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscoveryPage;