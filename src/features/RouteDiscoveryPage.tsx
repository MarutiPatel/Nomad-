import React, { useState, useEffect } from 'react';
import { Map, MapPin, Navigation, Route, Compass, Search, Filter, Car, Tent, Utensils, Home, Fuel, Hotel, Camera, Star, Clock, DollarSign, Wifi, Phone, Zap, Shield, Eye, Plus, Bookmark, Share, Download, RefreshCw, Target, Mountain, Coffee, ParkingMeter as Parking, AlertTriangle, Heart, Users, CloudSnow, Sun, Wind, Droplets, Calendar, Settings, ChevronDown, ChevronUp, Play, Pause, MoreHorizontal, ThumbsUp, MessageCircle, Flag, Globe, TreePine, Waves } from 'lucide-react';

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
  safetyRating: number;
  tags: string[];
}

interface TravelRoute {
  id: string;
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
}

function RouteDiscoveryPage() {
  const [activeTab, setActiveTab] = useState<'planner' | 'saved-routes' | 'community-routes'>('planner');
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
    travelStyle: 'adventure'
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

  // Mock route data
  const mockRoute: TravelRoute = {
    id: '1',
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
        description: 'Hidden gem serving traditional Konkani seafood. Family-run restaurant for 3 generations.',
        amenities: ['Parking', 'Clean Restrooms', 'AC', 'Seafood Specialist'],
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        isOpen: true,
        hours: '11:00 AM - 10:00 PM',
        contact: '+91 98765 43210',
        isBookmarked: false,
        isLiked: true,
        likes: 89,
        isTravelerRecommended: true,
        safetyRating: 4.9,
        tags: ['local-cuisine', 'seafood', 'family-run', 'authentic']
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
        description: 'Beachside camping with stunning sunset views. Tents and basic amenities provided.',
        amenities: ['Beach Access', 'Bonfire', 'Clean Toilets', 'Security', 'Food Stall'],
        image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
        isOpen: true,
        hours: '24/7',
        contact: '+91 87654 32109',
        isBookmarked: true,
        isLiked: false,
        likes: 134,
        isTravelerRecommended: true,
        safetyRating: 4.7,
        tags: ['beach-camping', 'sunset', 'bonfire', 'photography']
      },
      {
        id: '3',
        name: 'Heritage Homestay',
        type: 'stay',
        location: 'Chiplun, Maharashtra',
        coordinates: { lat: 17.5317, lng: 73.5126 },
        distanceFromRoute: 1.2,
        rating: 4.9,
        reviews: 67,
        price: '$$',
        description: 'Traditional Konkani house converted to homestay. Experience local culture and cuisine.',
        amenities: ['WiFi', 'AC', 'Home-cooked Meals', 'Cultural Experience', 'Garden'],
        image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
        isOpen: true,
        hours: 'Check-in: 2 PM',
        contact: '+91 76543 21098',
        website: 'konkanistay.com',
        isBookmarked: false,
        isLiked: true,
        likes: 203,
        isTravelerRecommended: true,
        safetyRating: 4.8,
        tags: ['heritage', 'cultural-experience', 'home-cooked', 'traditional']
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
        description: 'Hidden waterfall accessible via 2km trek. Perfect for adventure enthusiasts.',
        amenities: ['Trek Path', 'Natural Pool', 'Photography Spot', 'Picnic Area'],
        image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
        isOpen: true,
        hours: 'Daylight hours',
        isBookmarked: true,
        isLiked: true,
        likes: 312,
        isTravelerRecommended: true,
        safetyRating: 4.2,
        tags: ['waterfall', 'trekking', 'adventure', 'photography', 'secret-spot']
      },
      {
        id: '5',
        name: 'Highway Rest Zone',
        type: 'parking',
        location: 'Kolhapur Highway',
        coordinates: { lat: 16.7050, lng: 74.2433 },
        distanceFromRoute: 0.5,
        rating: 4.2,
        reviews: 234,
        price: 'free',
        description: 'Safe parking area with clean facilities and food court.',
        amenities: ['24/7 Security', 'CCTV', 'Food Court', 'Clean Restrooms', 'Fuel Station'],
        image: 'https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=400',
        isOpen: true,
        hours: '24/7',
        isBookmarked: false,
        isLiked: false,
        likes: 78,
        isTravelerRecommended: false,
        safetyRating: 4.5,
        tags: ['parking', 'security', 'facilities', 'highway']
      }
    ]
  };

  const savedRoutes = [
    { name: 'Mumbai to Goa Coastal', distance: '450 km', stops: 12, likes: 45 },
    { name: 'Delhi to Manali Mountains', distance: '570 km', stops: 8, likes: 89 },
    { name: 'Bangalore to Mysore Heritage', distance: '150 km', stops: 6, likes: 67 }
  ];

  const communityRoutes = [
    { name: 'Best Food Trail - Kerala', author: 'FoodieNomad99', distance: '380 km', stops: 15, likes: 234 },
    { name: 'Hidden Gems - Rajasthan', author: 'DesertExplorer', distance: '720 km', stops: 20, likes: 189 },
    { name: 'Adventure Route - Himachal', author: 'MountainSoul', distance: '650 km', stops: 12, likes: 156 }
  ];

  const handlePlanRoute = async () => {
    if (!routeForm.from || !routeForm.to) return;
    
    setIsPlanning(true);
    
    // Simulate route planning
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCurrentRoute(mockRoute);
    setIsPlanning(false);
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
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Route Discovery</h1>
        <p className="text-gray-400 text-sm">Plan your journey with hidden gems and perfect stops</p>
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
          <Route className="h-4 w-4" />
          <span className="text-sm font-medium">Route Planner</span>
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
          <span className="text-sm font-medium">Saved Routes</span>
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
          <span className="text-sm font-medium">Community Routes</span>
        </button>
      </div>

      {/* Route Planner Tab */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {/* Route Input Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Plan Your Journey</h2>
            
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

              {/* Preferences Toggle */}
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="flex items-center justify-between w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white hover:border-white/20 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Route Preferences</span>
                </span>
                {showPreferences ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {/* Preferences Panel */}
              {showPreferences && (
                <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-medium mb-4">What to show along your route:</h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
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

                  <div className="space-y-3">
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
                    <span>Planning Your Route...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Route className="h-5 w-5" />
                    <span>Plan Route with Discoveries</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Planning Progress */}
          {isPlanning && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <h3 className="text-white font-medium mb-4">Discovering amazing stops along your route...</h3>
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
                  <span className="text-gray-400">Checking food spots</span>
                  <span className="text-gray-500">Pending</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Safety verification</span>
                  <span className="text-gray-500">Pending</span>
                </div>
              </div>
            </div>
          )}

          {/* Route Results */}
          {currentRoute && (
            <div className="space-y-4">
              {/* Route Overview */}
              <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 backdrop-blur-sm rounded-3xl p-6 border border-green-400/30">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <h2 className="text-xl font-bold text-white">Route Planned Successfully!</h2>
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

              {/* Mock Map */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Interactive Route Map</h3>
                  <button className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white text-sm">
                    <Eye className="h-3 w-3 inline mr-1" />
                    Full Map
                  </button>
                </div>
                
                <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Mock map with route */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
                  <div className="text-center z-10">
                    <Map className="h-12 w-12 text-cyan-400 mx-auto mb-2" />
                    <div className="text-white font-medium">Interactive Map View</div>
                    <div className="text-gray-400 text-sm">Route: {currentRoute.from} → {currentRoute.to}</div>
                  </div>
                  
                  {/* Mock route markers */}
                  <div className="absolute top-4 left-8 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute top-12 left-16 w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div className="absolute top-8 right-20 w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="absolute bottom-8 right-8 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Discoveries Along Route */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Discoveries Along Your Route</h3>
                
                {filteredStops?.map((stop, index) => {
                  const IconComponent = getStopIcon(stop.type);
                  return (
                    <div key={stop.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getStopColor(stop.type)} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-white font-semibold">{stop.name}</h4>
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
                            </div>

                            {stop.isTravelerRecommended && (
                              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-2 py-1 rounded-full">
                                <span className="text-cyan-400 text-xs font-medium">Traveler Pick</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {stop.amenities.slice(0, 3).map((amenity, i) => (
                              <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                                {amenity}
                              </span>
                            ))}
                            {stop.amenities.length > 3 && (
                              <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                                +{stop.amenities.length - 3} more
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
                            </div>
                            
                            <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                              Add to Route →
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

      {/* Saved Routes Tab */}
      {activeTab === 'saved-routes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Your Saved Routes</h2>
            <button className="text-cyan-400 text-sm">View All</button>
          </div>
          
          {savedRoutes.map((route, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{route.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{route.distance}</span>
                    <span>{route.stops} stops</span>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-pink-400 fill-current" />
                      <span>{route.likes}</span>
                    </div>
                  </div>
                </div>
                <button className="text-cyan-400 text-sm">Open</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Community Routes Tab */}
      {activeTab === 'community-routes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Community Routes</h2>
            <button className="text-cyan-400 text-sm">Trending</button>
          </div>
          
          {communityRoutes.map((route, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{route.name}</h3>
                  <div className="text-cyan-400 text-sm mb-1">by {route.author}</div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{route.distance}</span>
                    <span>{route.stops} stops</span>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-pink-400 fill-current" />
                      <span>{route.likes}</span>
                    </div>
                  </div>
                </div>
                <button className="text-cyan-400 text-sm">Copy Route</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stop Detail Modal */}
      {selectedStop && (
        <StopDetailModal stop={selectedStop} onClose={() => setSelectedStop(null)} />
      )}
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
            <h2 className="text-xl font-bold text-white">{stop.name}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
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
              <p className="text-gray-300 text-sm">{stop.description}</p>
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

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-yellow-400 text-sm">{stop.rating}</span>
                <span className="text-gray-400 text-sm">({stop.reviews} reviews)</span>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm ${
                stop.price === 'free' ? 'bg-green-500/20 text-green-400' :
                stop.price === '$' ? 'bg-blue-500/20 text-blue-400' :
                stop.price === '$$' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {stop.price === 'free' ? 'Free' : stop.price}
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