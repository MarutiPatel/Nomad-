import React, { useState } from 'react';
import { 
  Star, MapPin, Camera, Plus, Filter, Search, 
  Navigation, Clock, Users, Heart, MessageCircle,
  Utensils, Car, Hotel, TreePine, Fuel, Building,
  Coffee, ShoppingBag, Plane, Train, Phone, Globe,
  ThumbsUp, ThumbsDown, Flag, Edit, Share, Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PlaceRating {
  id: string;
  placeName: string;
  placeType: 'restaurant' | 'hotel' | 'gas-station' | 'attraction' | 'shop' | 'transport' | 'hidden-gem' | 'cafe' | 'hospital' | 'atm' | 'pharmacy' | 'temple' | 'beach' | 'viewpoint';
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  overallRating: number;
  totalReviews: number;
  priceRange: '$' | '$$' | '$$$' | 'Free';
  image: string;
  amenities: string[];
  isVerified: boolean;
  lastReviewed: Date;
  reviews: PlaceReview[];
  categories: {
    food: number;
    service: number;
    cleanliness: number;
    value: number;
    location: number;
  };
}

interface PlaceReview {
  id: string;
  author: {
    id: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
    totalReviews: number;
  };
  rating: number;
  title: string;
  content: string;
  images: string[];
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  categories: {
    food?: number;
    service?: number;
    cleanliness?: number;
    value?: number;
    location?: number;
  };
  tags: string[];
  helpful: number;
  isHelpful: boolean;
  verified: boolean;
}

function PlacesRatingPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlace, setSelectedPlace] = useState<PlaceRating | null>(null);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');

  const placeCategories = [
    { id: 'all', label: 'All Places', icon: Globe },
    { id: 'restaurant', label: 'Restaurants', icon: Utensils },
    { id: 'hotel', label: 'Hotels', icon: Hotel },
    { id: 'gas-station', label: 'Gas Stations', icon: Fuel },
    { id: 'attraction', label: 'Attractions', icon: Camera },
    { id: 'cafe', label: 'Cafes', icon: Coffee },
    { id: 'shop', label: 'Shops', icon: ShoppingBag },
    { id: 'transport', label: 'Transport', icon: Train },
    { id: 'hidden-gem', label: 'Hidden Gems', icon: Star }
  ];

  const mockPlaces: PlaceRating[] = [
    {
      id: '1',
      placeName: 'Highway Dhaba Express',
      placeType: 'restaurant',
      location: 'NH-1, Delhi-Chandigarh Highway',
      coordinates: { lat: 28.7041, lng: 77.1025 },
      distance: 2.3,
      overallRating: 4.6,
      totalReviews: 234,
      priceRange: '$',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      amenities: ['Parking', 'Clean Washrooms', 'WiFi', '24/7 Open'],
      isVerified: true,
      lastReviewed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      categories: {
        food: 4.8,
        service: 4.5,
        cleanliness: 4.7,
        value: 4.6,
        location: 4.4
      },
      reviews: [
        {
          id: '1',
          author: {
            id: '1',
            displayName: 'RoadTripMaster',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
            isVerified: true,
            totalReviews: 45
          },
          rating: 5,
          title: 'Best Dhaba on NH-1!',
          content: 'Amazing butter chicken and fresh rotis. The staff is super friendly and the washrooms are surprisingly clean for a highway dhaba. Perfect stop for families.',
          images: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'],
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 23,
          isLiked: true,
          categories: {
            food: 5,
            service: 5,
            cleanliness: 4,
            value: 5,
            location: 4
          },
          tags: ['family-friendly', 'clean-washrooms', 'good-parking'],
          helpful: 18,
          isHelpful: true,
          verified: true
        }
      ]
    },
    {
      id: '2',
      placeName: 'Mountain View Resort',
      placeType: 'hotel',
      location: 'Manali, Himachal Pradesh',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      distance: 15.2,
      overallRating: 4.3,
      totalReviews: 156,
      priceRange: '$$',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      amenities: ['Mountain View', 'Room Service', 'Restaurant', 'Parking'],
      isVerified: true,
      lastReviewed: new Date(Date.now() - 6 * 60 * 60 * 1000),
      categories: {
        food: 4.2,
        service: 4.5,
        cleanliness: 4.1,
        value: 4.3,
        location: 4.8
      },
      reviews: []
    },
    {
      id: '3',
      placeName: 'HP Petrol Pump',
      placeType: 'gas-station',
      location: 'Gurgaon-Delhi Expressway',
      coordinates: { lat: 28.4595, lng: 77.0266 },
      distance: 5.1,
      overallRating: 4.1,
      totalReviews: 89,
      priceRange: '$',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      amenities: ['24/7 Service', 'Air Pump', 'Snack Shop', 'Clean Toilets'],
      isVerified: true,
      lastReviewed: new Date(Date.now() - 12 * 60 * 60 * 1000),
      categories: {
        food: 3.5,
        service: 4.2,
        cleanliness: 4.0,
        value: 4.1,
        location: 4.5
      },
      reviews: []
    }
  ];

  const [places] = useState(mockPlaces);

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'restaurant': return Utensils;
      case 'hotel': return Hotel;
      case 'gas-station': return Fuel;
      case 'attraction': return Camera;
      case 'cafe': return Coffee;
      case 'shop': return ShoppingBag;
      case 'transport': return Train;
      case 'hidden-gem': return Star;
      default: return MapPin;
    }
  };

  const filteredPlaces = selectedCategory === 'all' 
    ? places 
    : places.filter(place => place.placeType === selectedCategory);

  const renderStarRating = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3 w-3';
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Places & Reviews</h1>
          <p className="text-gray-400 text-sm">Rate and review places for fellow travelers</p>
        </div>
        
        <button
          onClick={() => setShowAddReviewModal(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2 mb-6">
        <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
          <Search className="h-4 w-4 text-gray-400" />
        </button>
        <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
          <Filter className="h-4 w-4 text-gray-400" />
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:border-orange-400 focus:outline-none"
        >
          <option value="recent" className="bg-slate-800">Most Recent</option>
          <option value="rating" className="bg-slate-800">Highest Rated</option>
          <option value="helpful" className="bg-slate-800">Most Helpful</option>
        </select>
      </div>

      {/* Category Filters */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        {placeCategories.map((category) => (
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

      {/* Places List */}
      <div className="space-y-4">
        {filteredPlaces.map((place) => {
          const IconComponent = getPlaceIcon(place.placeType);
          return (
            <div
              key={place.id}
              className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              <div className="flex">
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={place.image}
                    alt={place.placeName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <IconComponent className="h-4 w-4 text-orange-400" />
                        <h3 className="text-white font-semibold">{place.placeName}</h3>
                        {place.isVerified && (
                          <div className="bg-green-500/20 px-2 py-1 rounded-full">
                            <span className="text-green-400 text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-gray-400 text-sm mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{place.location} • {place.distance}km</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        {renderStarRating(place.overallRating)}
                        <span className="text-yellow-400 text-sm font-medium ml-1">
                          {place.overallRating}
                        </span>
                      </div>
                      <div className="text-gray-400 text-xs">({place.totalReviews} reviews)</div>
                    </div>
                  </div>

                  {/* Category Ratings */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Food</span>
                      <div className="flex items-center space-x-1">
                        {renderStarRating(place.categories.food)}
                        <span className="text-gray-300 ml-1">{place.categories.food}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Service</span>
                      <div className="flex items-center space-x-1">
                        {renderStarRating(place.categories.service)}
                        <span className="text-gray-300 ml-1">{place.categories.service}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {place.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full text-xs text-blue-400 border border-blue-400/30"
                      >
                        {amenity}
                      </span>
                    ))}
                    {place.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                        +{place.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        place.priceRange === 'Free' ? 'bg-green-500/20 text-green-400' :
                        place.priceRange === '$' ? 'bg-green-500/20 text-green-400' :
                        place.priceRange === '$$' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {place.priceRange}
                      </span>
                      <span className="text-xs text-gray-400">
                        Last reviewed {Math.floor((Date.now() - place.lastReviewed.getTime()) / (1000 * 60 * 60))}h ago
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setSelectedPlace(place)}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white text-sm font-medium hover:shadow-lg transition-all duration-300"
                    >
                      View Reviews
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onAddReview={() => setShowAddReviewModal(true)}
        />
      )}

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <AddReviewModal
          onClose={() => setShowAddReviewModal(false)}
          placeId={selectedPlace?.id}
        />
      )}
    </div>
  );
}

function PlaceDetailModal({ 
  place, 
  onClose, 
  onAddReview 
}: { 
  place: PlaceRating; 
  onClose: () => void;
  onAddReview: () => void;
}) {
  const renderStarRating = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3 w-3';
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatTimeAgo = (date: Date) => {
    const diffInHours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{place.placeName}</h2>
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
              src={place.image}
              alt={place.placeName}
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>

          {/* Overall Rating */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {renderStarRating(place.overallRating, 'lg')}
              <span className="text-2xl font-bold text-yellow-400 ml-2">
                {place.overallRating}
              </span>
            </div>
            <p className="text-gray-400 text-sm">Based on {place.totalReviews} reviews</p>
          </div>

          {/* Category Ratings */}
          <div className="space-y-3 mb-6">
            <h3 className="text-white font-medium">Detailed Ratings</h3>
            {Object.entries(place.categories).map(([category, rating]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-300 capitalize">{category}</span>
                <div className="flex items-center space-x-2">
                  {renderStarRating(rating)}
                  <span className="text-white font-medium w-8">{rating}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Reviews</h3>
              <button
                onClick={onAddReview}
                className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-xl text-white text-sm font-medium hover:shadow-lg transition-all duration-300"
              >
                Add Review
              </button>
            </div>

            <div className="space-y-4">
              {place.reviews.map((review) => (
                <div key={review.id} className="bg-white/5 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={review.author.avatar}
                      alt={review.author.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{review.author.displayName}</span>
                          {review.author.isVerified && (
                            <Star className="h-3 w-3 text-blue-400 fill-current" />
                          )}
                        </div>
                        <span className="text-gray-400 text-xs">{formatTimeAgo(review.timestamp)}</span>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        {renderStarRating(review.rating)}
                        <span className="text-yellow-400 text-sm">{review.rating}</span>
                      </div>

                      <h4 className="text-white font-medium text-sm mb-2">{review.title}</h4>
                      <p className="text-gray-300 text-sm mb-3">{review.content}</p>

                      {review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {review.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-orange-500/20 rounded-full text-xs text-orange-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center space-x-4">
                        <button className={`flex items-center space-x-1 text-xs transition-colors ${
                          review.isHelpful ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
                        }`}>
                          <ThumbsUp className="h-3 w-3" />
                          <span>Helpful ({review.helpful})</span>
                        </button>
                        <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-blue-400 transition-colors">
                          <Share className="h-3 w-3" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
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
  );
}

function AddReviewModal({ 
  onClose, 
  placeId 
}: { 
  onClose: () => void; 
  placeId?: string;
}) {
  const [formData, setFormData] = useState({
    placeName: '',
    placeType: 'restaurant',
    location: '',
    title: '',
    content: '',
    overallRating: 5,
    categories: {
      food: 5,
      service: 5,
      cleanliness: 5,
      value: 5,
      location: 5
    },
    tags: '',
    priceRange: '$'
  });

  const placeTypes = [
    'restaurant', 'hotel', 'gas-station', 'attraction', 'cafe', 
    'shop', 'transport', 'hidden-gem', 'hospital', 'atm', 
    'pharmacy', 'temple', 'beach', 'viewpoint'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding review:', formData);
    onClose();
  };

  const renderRatingSelector = (
    label: string, 
    value: number, 
    onChange: (rating: number) => void
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`w-8 h-8 rounded-full transition-colors ${
              rating <= value
                ? 'text-yellow-400'
                : 'text-gray-600 hover:text-yellow-400'
            }`}
          >
            <Star className={`h-6 w-6 ${rating <= value ? 'fill-current' : ''}`} />
          </button>
        ))}
        <span className="text-white ml-2">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Add Review</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Place Name</label>
              <input
                type="text"
                value={formData.placeName}
                onChange={(e) => setFormData(prev => ({ ...prev, placeName: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                placeholder="What's the name of this place?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Place Type</label>
              <select
                value={formData.placeType}
                onChange={(e) => setFormData(prev => ({ ...prev, placeType: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-orange-400 focus:outline-none"
              >
                {placeTypes.map(type => (
                  <option key={type} value={type} className="bg-slate-800">
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
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
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                placeholder="Where is this place located?"
                required
              />
            </div>

            {renderRatingSelector(
              'Overall Rating',
              formData.overallRating,
              (rating) => setFormData(prev => ({ ...prev, overallRating: rating }))
            )}

            <div className="grid grid-cols-2 gap-3">
              {renderRatingSelector(
                'Food Quality',
                formData.categories.food,
                (rating) => setFormData(prev => ({ 
                  ...prev, 
                  categories: { ...prev.categories, food: rating }
                }))
              )}
              {renderRatingSelector(
                'Service',
                formData.categories.service,
                (rating) => setFormData(prev => ({ 
                  ...prev, 
                  categories: { ...prev.categories, service: rating }
                }))
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Review Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                placeholder="Summarize your experience"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Review</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none resize-none"
                rows={4}
                placeholder="Share your experience to help other travelers..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                placeholder="family-friendly, clean, good-value (comma separated)"
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
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlacesRatingPage;