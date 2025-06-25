import React, { useState } from 'react';
import { 
  Utensils, MapPin, Star, Clock, Filter, Search, 
  Navigation, Phone, DollarSign, Heart, Camera, 
  Users, Truck, Coffee, Wifi, Car, Zap, Plus
} from 'lucide-react';

interface FoodSpot {
  id: string;
  name: string;
  type: 'dhaba' | 'restaurant' | 'cafe' | 'street' | 'hidden-gem';
  cuisine: string[];
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  rating: number;
  reviews: number;
  priceRange: '$' | '$$' | '$$$';
  openHours: string;
  isOpen: boolean;
  specialties: string[];
  image: string;
  amenities: string[];
  travelerReviewed: boolean;
  isLiked: boolean;
}

interface UtilitySpot {
  id: string;
  name: string;
  type: 'camping' | 'parking' | 'restroom' | 'emergency' | 'charging' | 'coworking';
  location: string;
  distance: number;
  rating: number;
  isOpen: boolean;
  amenities: string[];
  description: string;
  verified: boolean;
}

function FoodDiscoveryPage() {
  const [activeTab, setActiveTab] = useState<'food' | 'utilities'>('food');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedSpot, setSelectedSpot] = useState<FoodSpot | null>(null);
  const [selectedUtility, setSelectedUtility] = useState<UtilitySpot | null>(null);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);

  const mockFoodSpots: FoodSpot[] = [
    {
      id: '1',
      name: 'Sharma Dhaba',
      type: 'dhaba',
      cuisine: ['North Indian', 'Punjabi'],
      location: 'NH-1, Karnal',
      coordinates: { lat: 29.6857, lng: 76.9905 },
      distance: 2.3,
      rating: 4.6,
      reviews: 234,
      priceRange: '$',
      openHours: '6:00 AM - 11:00 PM',
      isOpen: true,
      specialties: ['Butter Chicken', 'Dal Makhani', 'Fresh Rotis'],
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      amenities: ['Parking', 'Clean Washrooms', 'Truck Parking'],
      travelerReviewed: true,
      isLiked: false
    },
    {
      id: '2',
      name: 'Coastal Cafe',
      type: 'cafe',
      cuisine: ['Continental', 'Seafood'],
      location: 'Anjuna Beach, Goa',
      coordinates: { lat: 15.5736, lng: 73.7370 },
      distance: 0.8,
      rating: 4.8,
      reviews: 156,
      priceRange: '$$',
      openHours: '8:00 AM - 10:00 PM',
      isOpen: true,
      specialties: ['Fish Curry', 'Prawn Balchao', 'Coconut Water'],
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      amenities: ['WiFi', 'Sea View', 'Live Music'],
      travelerReviewed: true,
      isLiked: true
    },
    {
      id: '3',
      name: 'Mountain View Eatery',
      type: 'hidden-gem',
      cuisine: ['Himachali', 'Tibetan'],
      location: 'Manali, Himachal Pradesh',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      distance: 5.2,
      rating: 4.9,
      reviews: 89,
      priceRange: '$',
      openHours: '7:00 AM - 9:00 PM',
      isOpen: false,
      specialties: ['Momos', 'Thukpa', 'Local Honey'],
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      amenities: ['Mountain View', 'Organic Food', 'Cozy Seating'],
      travelerReviewed: true,
      isLiked: false
    }
  ];

  const mockUtilities: UtilitySpot[] = [
    {
      id: '1',
      name: 'Riverside Camping Ground',
      type: 'camping',
      location: 'Rishikesh, Uttarakhand',
      distance: 3.5,
      rating: 4.5,
      isOpen: true,
      amenities: ['River Access', 'Bonfire Area', 'Clean Toilets', 'Security'],
      description: 'Beautiful riverside camping with mountain views',
      verified: true
    },
    {
      id: '2',
      name: 'Safe Parking Zone',
      type: 'parking',
      location: 'Gurgaon Highway',
      distance: 1.2,
      rating: 4.2,
      isOpen: true,
      amenities: ['24/7 Security', 'CCTV', 'Food Nearby'],
      description: 'Secure overnight parking for travelers',
      verified: true
    },
    {
      id: '3',
      name: 'Highway Rest Stop',
      type: 'restroom',
      location: 'Delhi-Jaipur Highway',
      distance: 0.5,
      rating: 4.0,
      isOpen: true,
      amenities: ['Clean Washrooms', 'Hand Sanitizer', 'Baby Changing'],
      description: 'Well-maintained rest facilities',
      verified: true
    }
  ];

  const [foodSpots, setFoodSpots] = useState(mockFoodSpots);
  const [utilities] = useState(mockUtilities);

  const foodFilters = [
    { id: 'all', label: 'All', icon: Utensils },
    { id: 'dhaba', label: 'Dhabas', icon: Truck },
    { id: 'cafe', label: 'Cafes', icon: Coffee },
    { id: 'hidden-gem', label: 'Hidden Gems', icon: Star }
  ];

  const utilityFilters = [
    { id: 'all', label: 'All', icon: MapPin },
    { id: 'camping', label: 'Camping', icon: Users },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'charging', label: 'Charging', icon: Zap }
  ];

  const handleLike = (id: string) => {
    setFoodSpots(prev => prev.map(spot => 
      spot.id === id ? { ...spot, isLiked: !spot.isLiked } : spot
    ));
  };

  const filteredFoodSpots = selectedFilter === 'all' 
    ? foodSpots 
    : foodSpots.filter(spot => spot.type === selectedFilter);

  const filteredUtilities = selectedFilter === 'all'
    ? utilities
    : utilities.filter(util => util.type === selectedFilter);

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Discovery Hub</h1>
        <p className="text-gray-400 text-sm">Find food spots and travel utilities</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-2xl bg-black/20 p-1 mb-6">
        <button
          onClick={() => setActiveTab('food')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 relative ${
            activeTab === 'food'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Utensils className="h-4 w-4" />
          <span className="text-sm font-medium">Food</span>
          {activeTab === 'food' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddFoodModal(true);
              }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Plus className="h-3 w-3 text-white" />
            </button>
          )}
        </button>
        <button
          onClick={() => setActiveTab('utilities')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 relative ${
            activeTab === 'utilities'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">Utilities</span>
          {activeTab === 'utilities' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddFoodModal(true);
              }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Plus className="h-3 w-3 text-white" />
            </button>
          )}
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={() => setShowAddFoodModal(true)}
          className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4 text-white" />
        </button>
        <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
          <Search className="h-4 w-4 text-gray-400" />
        </button>
        <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
          <Filter className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        {(activeTab === 'food' ? foodFilters : utilityFilters).map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              selectedFilter === filter.id
                ? activeTab === 'food'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
            }`}
          >
            <filter.icon className="h-4 w-4" />
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'food' ? (
        <div className="space-y-4">
          {filteredFoodSpots.map((spot) => (
            <div
              key={spot.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              <div className="flex">
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{spot.name}</h3>
                      <div className="flex items-center space-x-1 text-gray-400 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>{spot.location} • {spot.distance}km</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleLike(spot.id)}
                      className={`p-2 rounded-full transition-colors ${
                        spot.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${spot.isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 text-xs">{spot.rating}</span>
                      <span className="text-gray-400 text-xs">({spot.reviews})</span>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      spot.priceRange === '$' ? 'bg-green-500/20 text-green-400' :
                      spot.priceRange === '$$' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {spot.priceRange}
                    </span>
                    
                    <div className={`flex items-center space-x-1 text-xs ${
                      spot.isOpen ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <Clock className="h-3 w-3" />
                      <span>{spot.isOpen ? 'Open' : 'Closed'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {spot.specialties.slice(0, 2).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full text-xs text-orange-400 border border-orange-400/30"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {spot.travelerReviewed && (
                        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-2 py-1 rounded-full">
                          <span className="text-cyan-400 text-xs font-medium">Traveler Reviewed</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setSelectedSpot(spot)}
                      className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white text-sm font-medium hover:shadow-lg transition-all duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUtilities.map((utility) => (
            <div
              key={utility.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{utility.name}</h3>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{utility.location} • {utility.distance}km</span>
                  </div>
                  <p className="text-gray-300 text-sm">{utility.description}</p>
                </div>
                
                {utility.verified && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-2 py-1 rounded-full">
                    <span className="text-green-400 text-xs font-medium">Verified</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-xs">{utility.rating}</span>
                </div>
                
                <div className={`flex items-center space-x-1 text-xs ${
                  utility.isOpen ? 'text-green-400' : 'text-red-400'
                }`}>
                  <Clock className="h-3 w-3" />
                  <span>{utility.isOpen ? 'Available' : 'Closed'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {utility.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full text-xs text-blue-400 border border-blue-400/30"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedUtility(utility)}
                  className="px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white text-sm font-medium hover:shadow-lg transition-all duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Food Spot Detail Modal */}
      {selectedSpot && (
        <FoodSpotModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
        />
      )}

      {/* Utility Detail Modal */}
      {selectedUtility && (
        <UtilityDetailModal
          utility={selectedUtility}
          onClose={() => setSelectedUtility(null)}
        />
      )}

      {/* Add Food/Utility Modal */}
      {showAddFoodModal && (
        <AddSpotModal
          onClose={() => setShowAddFoodModal(false)}
          spotType={activeTab}
        />
      )}
    </div>
  );
}

function FoodSpotModal({ spot, onClose }: { spot: FoodSpot; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{spot.name}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Image */}
          <div className="mb-4">
            <img
              src={spot.image}
              alt={spot.name}
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Location</h3>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{spot.location}</span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {spot.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full text-xs text-orange-400 border border-orange-400/30"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {spot.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-yellow-400 text-sm">{spot.rating}</span>
                <span className="text-gray-400 text-sm">({spot.reviews} reviews)</span>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm ${
                spot.priceRange === '$' ? 'bg-green-500/20 text-green-400' :
                spot.priceRange === '$$' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {spot.priceRange}
              </span>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
                <Navigation className="h-5 w-5" />
                <span>Get Directions</span>
              </button>
              
              <button className="px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
                <Phone className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UtilityDetailModal({ utility, onClose }: { utility: UtilitySpot; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{utility.name}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Description</h3>
              <p className="text-gray-300 text-sm">{utility.description}</p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Location</h3>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{utility.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-yellow-400 text-sm">{utility.rating}</span>
              </div>
              
              <div className={`flex items-center space-x-1 text-xs ${
                utility.isOpen ? 'text-green-400' : 'text-red-400'
              }`}>
                <Clock className="h-3 w-3" />
                <span>{utility.isOpen ? 'Available' : 'Closed'}</span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {utility.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full text-xs text-blue-400 border border-blue-400/30"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
                <Navigation className="h-5 w-5" />
                <span>Get Directions</span>
              </button>
              
              <button className="px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddSpotModal({ onClose, spotType }: { onClose: () => void; spotType: 'food' | 'utilities' }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: spotType === 'food' ? 'restaurant' : 'camping',
    priceRange: '$',
    amenities: '',
    specialties: '',
    openHours: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new spot:', formData);
    // Here you would typically call a function to add the spot
    onClose();
  };

  const foodCategories = ['restaurant', 'dhaba', 'cafe', 'street', 'hidden-gem'];
  const utilityCategories = ['camping', 'parking', 'restroom', 'emergency', 'charging', 'coworking'];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Add {spotType === 'food' ? 'Food Spot' : 'Utility Spot'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder={`${spotType === 'food' ? 'Restaurant' : 'Utility spot'} name`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
              >
                {(spotType === 'food' ? foodCategories : utilityCategories).map(category => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="Where is it located?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                rows={3}
                placeholder="Tell others about this spot..."
                required
              />
            </div>

            {spotType === 'food' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                  <select
                    value={formData.priceRange}
                    onChange={(e) => setFormData(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="$" className="bg-slate-800">$ - Budget</option>
                    <option value="$$" className="bg-slate-800">$$ - Mid-range</option>
                    <option value="$$$" className="bg-slate-800">$$$ - Expensive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Specialties</label>
                  <input
                    type="text"
                    value={formData.specialties}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    placeholder="e.g., Butter Chicken, Pizza, Local Fish"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {spotType === 'food' ? 'Amenities/Features' : 'Amenities'}
              </label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder={spotType === 'food' ? 'WiFi, Parking, AC, Outdoor Seating' : 'Clean, 24/7, Security, WiFi'}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
                  spotType === 'food' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}
              >
                Add Spot
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FoodDiscoveryPage;