import React, { useState } from 'react';
import { 
  Utensils, MapPin, Star, Filter, Search, Plus, 
  Navigation, Clock, Users, Heart, Camera, 
  Fuel, Building, TreePine, Car, Coffee, Wifi,
  Phone, Shield, ChevronRight, Bookmark
} from 'lucide-react';

interface FoodSpot {
  id: string;
  name: string;
  type: 'restaurant' | 'dhaba' | 'street-food' | 'cafe' | 'local-joint';
  cuisine: string;
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  rating: number;
  reviews: number;
  priceRange: '$' | '$$' | '$$$';
  image: string;
  isOpen: boolean;
  openUntil?: string;
  specialties: string[];
  features: string[];
  isBookmarked: boolean;
  isVerified: boolean;
}

interface UtilitySpot {
  id: string;
  name: string;
  type: 'camping' | 'parking' | 'restroom' | 'fuel' | 'charging' | 'wifi' | 'emergency';
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  rating: number;
  reviews: number;
  isOpen: boolean;
  features: string[];
  contact?: string;
  price?: string;
}

function FoodDiscoveryPage() {
  const [activeTab, setActiveTab] = useState<'food' | 'utilities'>('food');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockFoodSpots: FoodSpot[] = [
    {
      id: '1',
      name: 'Highway Dhaba Express',
      type: 'dhaba',
      cuisine: 'North Indian',
      location: 'NH-1, Delhi-Chandigarh Highway',
      coordinates: { lat: 28.7041, lng: 77.1025 },
      distance: 0.8,
      rating: 4.6,
      reviews: 234,
      priceRange: '$',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOpen: true,
      openUntil: '11:00 PM',
      specialties: ['Butter Chicken', 'Dal Makhani', 'Fresh Rotis'],
      features: ['Parking', 'Clean Washrooms', 'AC Available', '24/7 Open'],
      isBookmarked: false,
      isVerified: true
    },
    {
      id: '2',
      name: 'Coastal Catch',
      type: 'restaurant',
      cuisine: 'Seafood',
      location: 'Goa Beach Road',
      coordinates: { lat: 15.2993, lng: 74.1240 },
      distance: 2.3,
      rating: 4.8,
      reviews: 567,
      priceRange: '$$',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOpen: true,
      openUntil: '10:30 PM',
      specialties: ['Fish Curry', 'Prawn Balchao', 'Bebinca'],
      features: ['Sea View', 'Live Music', 'Outdoor Seating'],
      isBookmarked: true,
      isVerified: true
    },
    {
      id: '3',
      name: 'Chai Point Corner',
      type: 'street-food',
      cuisine: 'Snacks & Beverages',
      location: 'Mumbai Street Market',
      coordinates: { lat: 19.0760, lng: 72.8777 },
      distance: 1.5,
      rating: 4.4,
      reviews: 123,
      priceRange: '$',
      image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOpen: true,
      openUntil: 'Midnight',
      specialties: ['Masala Chai', 'Vada Pav', 'Samosa'],
      features: ['Quick Service', 'Local Favorite', 'Budget Friendly'],
      isBookmarked: false,
      isVerified: false
    }
  ];

  const mockUtilitySpots: UtilitySpot[] = [
    {
      id: '1',
      name: 'Safe Haven Campsite',
      type: 'camping',
      location: 'Rishikesh Riverside',
      coordinates: { lat: 30.0869, lng: 78.2676 },
      distance: 5.2,
      rating: 4.5,
      reviews: 89,
      isOpen: true,
      features: ['River View', 'Bonfire Area', 'Clean Facilities', 'Security'],
      price: '₹500/night'
    },
    {
      id: '2',
      name: 'Secure Parking Zone',
      type: 'parking',
      location: 'City Center Mall',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      distance: 1.2,
      rating: 4.2,
      reviews: 156,
      isOpen: true,
      features: ['CCTV Monitored', '24/7 Access', 'Covered Parking'],
      price: '₹20/hour'
    },
    {
      id: '3',
      name: 'HP Petrol Pump',
      type: 'fuel',
      location: 'National Highway 44',
      coordinates: { lat: 28.4595, lng: 77.0266 },
      distance: 3.8,
      rating: 4.1,
      reviews: 78,
      isOpen: true,
      features: ['24/7 Service', 'Air Pump', 'Convenience Store', 'Clean Restrooms'],
      contact: '+91 98765 43210'
    }
  ];

  const foodCategories = [
    { id: 'all', label: 'All Food', icon: Utensils },
    { id: 'dhaba', label: 'Dhabas', icon: Coffee },
    { id: 'restaurant', label: 'Restaurants', icon: Building },
    { id: 'street-food', label: 'Street Food', icon: MapPin },
    { id: 'cafe', label: 'Cafes', icon: Coffee }
  ];

  const utilityCategories = [
    { id: 'all', label: 'All Utilities', icon: MapPin },
    { id: 'camping', label: 'Camping', icon: TreePine },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'fuel', label: 'Fuel Stations', icon: Fuel },
    { id: 'restroom', label: 'Restrooms', icon: Building },
    { id: 'charging', label: 'Charging', icon: Wifi }
  ];

  const filteredFoodSpots = selectedCategory === 'all' 
    ? mockFoodSpots 
    : mockFoodSpots.filter(spot => spot.type === selectedCategory);

  const filteredUtilitySpots = selectedCategory === 'all' 
    ? mockUtilitySpots 
    : mockUtilitySpots.filter(spot => spot.type === selectedCategory);

  const handleBookmark = (id: string) => {
    // Handle bookmark functionality
    console.log('Bookmark toggled for:', id);
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Food & Utilities</h1>
        <p className="text-gray-400 text-sm">Discover local food spots and essential utilities</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-2xl bg-black/20 p-1 mb-6">
        <button
          onClick={() => {
            setActiveTab('food');
            setSelectedCategory('all');
          }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'food'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Utensils className="h-4 w-4" />
          <span className="text-sm font-medium">Food Discovery</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('utilities');
            setSelectedCategory('all');
          }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'utilities'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">Utilities</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2 mb-6">
        <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
          <Search className="h-4 w-4 text-gray-400" />
        </button>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Filter className="h-4 w-4 text-gray-400" />
        </button>
        <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
          <Plus className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        {(activeTab === 'food' ? foodCategories : utilityCategories).map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
            }`}
          >
            <category.icon className="h-4 w-4" />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'food' ? (
        <div className="space-y-4">
          {filteredFoodSpots.map((spot) => (
            <div
              key={spot.id}
              className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{spot.name}</h3>
                      {spot.isVerified && (
                        <div className="bg-green-500/20 px-2 py-1 rounded-full">
                          <span className="text-green-400 text-xs font-medium">Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{spot.location} • {spot.distance}km away</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 text-sm">{spot.rating}</span>
                        <span className="text-gray-400 text-xs">({spot.reviews})</span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <span className="text-purple-400 text-sm capitalize">{spot.cuisine}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleBookmark(spot.id)}
                    className={`p-2 rounded-full transition-colors ${
                      spot.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${spot.isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {spot.specialties.slice(0, 3).map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full text-xs text-orange-400 border border-orange-400/30"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      spot.priceRange === '$' ? 'bg-green-500/20 text-green-400' :
                      spot.priceRange === '$$' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {spot.priceRange}
                    </span>
                    
                    {spot.isOpen && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-green-400 text-xs">Open until {spot.openUntil}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 rounded-2xl text-white font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                    <Navigation className="h-4 w-4" />
                    <span>Get Directions</span>
                  </button>
                  
                  <button className="px-4 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUtilitySpots.map((spot) => (
            <div
              key={spot.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{spot.name}</h3>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{spot.location} • {spot.distance}km away</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 text-sm">{spot.rating}</span>
                      <span className="text-gray-400 text-xs">({spot.reviews})</span>
                    </div>
                    {spot.isOpen && (
                      <>
                        <span className="text-gray-500">•</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          <span className="text-green-400 text-xs">Open</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  spot.type === 'camping' ? 'bg-green-500/20' :
                  spot.type === 'parking' ? 'bg-blue-500/20' :
                  spot.type === 'fuel' ? 'bg-orange-500/20' :
                  'bg-purple-500/20'
                }`}>
                  {spot.type === 'camping' && <TreePine className="h-5 w-5 text-green-400" />}
                  {spot.type === 'parking' && <Car className="h-5 w-5 text-blue-400" />}
                  {spot.type === 'fuel' && <Fuel className="h-5 w-5 text-orange-400" />}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {spot.features.slice(0, 4).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full text-xs text-blue-400 border border-blue-400/30"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {spot.price && (
                    <span className="text-green-400 font-medium text-sm">{spot.price}</span>
                  )}
                  {spot.contact && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400 text-xs">{spot.contact}</span>
                    </div>
                  )}
                </div>
                
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
                  <Navigation className="h-4 w-4" />
                  <span>Navigate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {((activeTab === 'food' && filteredFoodSpots.length === 0) || 
        (activeTab === 'utilities' && filteredUtilitySpots.length === 0)) && (
        <div className="text-center py-12">
          {activeTab === 'food' ? (
            <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          ) : (
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          )}
          <h3 className="text-lg font-semibold text-white mb-2">
            No {activeTab === 'food' ? 'Food Spots' : 'Utilities'} Found
          </h3>
          <p className="text-gray-400 text-sm">
            Try a different category or check back later
          </p>
        </div>
      )}
    </div>
  );
}

export default FoodDiscoveryPage;