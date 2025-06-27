import React, { useState } from 'react';
import { 
  Utensils, MapPin, Star, Filter, Search, Plus, 
  Navigation, Clock, Users, Heart, Camera, 
  Fuel, Building, TreePine, Car, Coffee, Wifi,
  Phone, Shield, ChevronRight, Bookmark, X,
  ThumbsUp, Flag, MessageCircle, Share, Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReviews } from '../contexts/ReviewContext';
import RatingStars from '../components/RatingStars';
import PlaceReviewItem from '../components/PlaceReviewItem';
import AddReviewForm, { ReviewFormData } from '../components/AddReviewForm';

interface PlaceWithReviews {
  id: string;
  name: string;
  type: string;
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  overallRating: number;
  totalReviews: number;
  categoryRatings?: { [key: string]: number };
  amenities?: string[];
  features?: string[];
  priceRange?: string;
  price?: string;
  isVerified: boolean;
  photos?: string[];
  lastUpdated?: Date;
  contact?: string;
  isOpen?: boolean;
  openUntil?: string;
}

function PlacesPage() {
  const { user } = useAuth();
  const { places, reviews, getPlaceReviews, addReview, likeReview, markReviewHelpful } = useReviews();
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'utilities' | 'accommodation' | 'attractions'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [selectedPlaceForReview, setSelectedPlaceForReview] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'distance'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Combine places from ReviewContext and mock utility spots
  const mockUtilitySpots = [
    {
      id: 'util-1',
      name: 'Safe Haven Campsite',
      type: 'camping',
      location: 'Rishikesh Riverside',
      coordinates: { lat: 30.0869, lng: 78.2676 },
      distance: 5.2,
      overallRating: 4.5,
      totalReviews: 89,
      isOpen: true,
      features: ['River View', 'Bonfire Area', 'Clean Facilities', 'Security'],
      price: '₹500/night',
      isVerified: true,
      photos: ['https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400']
    },
    {
      id: 'util-2',
      name: 'Secure Parking Zone',
      type: 'parking',
      location: 'City Center Mall',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      distance: 1.2,
      overallRating: 4.2,
      totalReviews: 156,
      isOpen: true,
      features: ['CCTV Monitored', '24/7 Access', 'Covered Parking'],
      price: '₹20/hour',
      isVerified: true,
      photos: []
    }
  ];

  // Combine all places
  const allPlaces: PlaceWithReviews[] = [
    ...places.map(place => ({
      ...place,
      distance: Math.random() * 10 + 0.5, // Mock distance
      isOpen: true,
      priceRange: place.priceRange || (Math.random() > 0.5 ? '$' : '$$')
    })),
    ...mockUtilitySpots
  ];

  const placeCategories = [
    { id: 'all', label: 'All Places', icon: MapPin },
    { id: 'restaurant', label: 'Restaurants', icon: Utensils },
    { id: 'hotel', label: 'Hotels', icon: Building },
    { id: 'cafe', label: 'Cafes', icon: Coffee },
    { id: 'gas-station', label: 'Gas Stations', icon: Fuel },
    { id: 'attraction', label: 'Attractions', icon: Camera },
    { id: 'camping', label: 'Camping', icon: TreePine },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'shop', label: 'Shops', icon: Building },
    { id: 'hidden-gem', label: 'Hidden Gems', icon: Star }
  ];

  const tabCategories = [
    { id: 'all', label: 'All', icon: MapPin },
    { id: 'food', label: 'Food & Dining', icon: Utensils },
    { id: 'utilities', label: 'Utilities', icon: Fuel },
    { id: 'accommodation', label: 'Stay', icon: Building },
    { id: 'attractions', label: 'Attractions', icon: Camera }
  ];

  const getFilteredPlaces = () => {
    let filtered = allPlaces;

    // Filter by tab
    if (activeTab !== 'all') {
      const tabFilters = {
        food: ['restaurant', 'cafe', 'dhaba', 'street-food'],
        utilities: ['gas-station', 'camping', 'parking', 'restroom', 'charging'],
        accommodation: ['hotel'],
        attractions: ['attraction', 'hidden-gem', 'viewpoint']
      };
      filtered = filtered.filter(place => tabFilters[activeTab]?.includes(place.type));
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(place => place.type === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.overallRating - a.overallRating;
        case 'distance':
          return a.distance - b.distance;
        case 'recent':
        default:
          return new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime();
      }
    });

    return filtered;
  };

  const filteredPlaces = getFilteredPlaces();

  const getPlaceTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
      case 'dhaba':
      case 'street-food': return Utensils;
      case 'hotel': return Building;
      case 'cafe': return Coffee;
      case 'gas-station': return Fuel;
      case 'camping': return TreePine;
      case 'parking': return Car;
      case 'attraction':
      case 'hidden-gem': return Camera;
      default: return MapPin;
    }
  };

  const getPlaceTypeColor = (type: string) => {
    switch (type) {
      case 'restaurant':
      case 'dhaba':
      case 'street-food': return 'from-orange-400 to-red-500';
      case 'hotel': return 'from-blue-400 to-cyan-500';
      case 'cafe': return 'from-yellow-400 to-orange-500';
      case 'gas-station': return 'from-gray-400 to-gray-600';
      case 'camping': return 'from-green-400 to-teal-500';
      case 'parking': return 'from-purple-400 to-indigo-500';
      case 'attraction':
      case 'hidden-gem': return 'from-pink-400 to-rose-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const handleAddReview = (placeId: string) => {
    setSelectedPlaceForReview(placeId);
    setShowAddReviewModal(true);
  };

  const handleSubmitReview = (reviewData: ReviewFormData) => {
    const newReview = {
      placeId: selectedPlaceForReview || reviewData.placeId || '',
      userId: user?.id || '',
      userDisplayName: user?.displayName || '',
      userAvatar: user?.avatar || '',
      rating: reviewData.overallRating,
      title: reviewData.title,
      content: reviewData.content,
      timestamp: new Date(),
      categoryRatings: reviewData.categories,
      tags: reviewData.tags,
      photos: reviewData.photos,
    };

    addReview(newReview);
    setShowAddReviewModal(false);
    setSelectedPlaceForReview(null);
  };

  const handleLikeReview = (reviewId: string) => {
    likeReview(reviewId);
  };

  const handleMarkHelpful = (reviewId: string) => {
    markReviewHelpful(reviewId);
  };

  const handleBookmark = (id: string) => {
    console.log('Bookmark toggled for:', id);
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Places & Reviews</h1>
        <p className="text-gray-400 text-sm">Discover, review, and share amazing places</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto space-x-1 bg-black/20 rounded-2xl p-1 mb-6">
        {tabCategories.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSelectedCategory('all');
            }}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
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
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:border-orange-400 focus:outline-none"
        >
          <option value="rating" className="bg-slate-800">Highest Rated</option>
          <option value="distance" className="bg-slate-800">Nearest</option>
          <option value="recent" className="bg-slate-800">Most Recent</option>
        </select>
        <button
          onClick={() => setShowAddReviewModal(true)}
          className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg transition-all duration-300"
        >
          <Plus className="h-4 w-4 text-white" />
        </button>
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
      <div className="space-y-6">
        {filteredPlaces.map((place) => {
          const IconComponent = getPlaceTypeIcon(place.type);
          const placeReviews = getPlaceReviews(place.id);
          
          return (
            <div key={place.id} className="mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
                {/* Place Image */}
                {place.photos && place.photos.length > 0 && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={place.photos[0]}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Place Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{place.name}</h3>
                        {place.isVerified && (
                          <div className="bg-green-500/20 px-2 py-1 rounded-full">
                            <span className="text-green-400 text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{place.location} • {place.distance.toFixed(1)}km away</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <RatingStars rating={place.overallRating} size="md" />
                        <span className="text-yellow-400">{place.overallRating.toFixed(1)}</span>
                        <span className="text-gray-400 text-sm">({place.totalReviews} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getPlaceTypeColor(place.type)} flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <button
                        onClick={() => handleBookmark(place.id)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Bookmark className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
                      </button>
                    </div>
                  </div>

                  {/* Category Ratings */}
                  {place.categoryRatings && Object.keys(place.categoryRatings).length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {Object.entries(place.categoryRatings).slice(0, 4).map(([category, rating]) => (
                        <div key={category} className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 capitalize">{category}</span>
                          <div className="flex items-center space-x-1">
                            <RatingStars rating={rating} size="sm" />
                            <span className="text-gray-300 ml-1">{rating.toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Features/Amenities */}
                  {(place.features || place.amenities) && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(place.features || place.amenities || []).slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full text-xs text-blue-400 border border-blue-400/30"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price and Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {(place.priceRange || place.price) && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          place.priceRange === 'Free' || place.priceRange === '$' ? 'bg-green-500/20 text-green-400' :
                          place.priceRange === '$$' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {place.priceRange || place.price}
                        </span>
                      )}
                      
                      {place.isOpen && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          <span className="text-green-400 text-xs">
                            {place.openUntil ? `Open until ${place.openUntil}` : 'Open'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <span className="text-xs text-gray-400">
                      {place.lastUpdated ? `Updated ${new Date(place.lastUpdated).toLocaleDateString()}` : ''}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 mb-4">
                    <button
                      onClick={() => handleAddReview(place.id)}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 rounded-2xl text-white font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Star className="h-4 w-4" />
                      <span>Add Review</span>
                    </button>
                    
                    <button
                      onClick={() => setSelectedPlace(selectedPlace === place.id ? null : place.id)}
                      className="px-4 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>{selectedPlace === place.id ? 'Hide' : 'Reviews'}</span>
                      <span className="text-xs">({place.totalReviews})</span>
                    </button>
                    
                    <button className="px-4 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors">
                      <Navigation className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Contact Info */}
                  {place.contact && (
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Phone className="h-3 w-3" />
                      <span>{place.contact}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Reviews Section */}
              {selectedPlace === place.id && (
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Reviews ({place.totalReviews})</h3>
                    <button
                      onClick={() => setSelectedPlace(null)}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {placeReviews.length > 0 ? (
                      placeReviews.map(review => (
                        <PlaceReviewItem
                          key={review.id}
                          review={{
                            id: review.id,
                            author: {
                              id: review.userId,
                              displayName: review.userDisplayName,
                              avatar: review.userAvatar,
                              isVerified: false,
                              totalReviews: 1
                            },
                            rating: review.rating,
                            title: review.title,
                            content: review.content,
                            images: review.photos,
                            timestamp: review.timestamp,
                            likes: review.likes,
                            isLiked: review.isLiked,
                            categories: review.categoryRatings,
                            tags: review.tags,
                            helpful: review.helpfulCount,
                            isHelpful: review.isHelpful,
                            verified: true
                          }}
                          onLike={() => handleLikeReview(review.id)}
                          onMarkHelpful={() => handleMarkHelpful(review.id)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-2">No Reviews Yet</h3>
                        <p className="text-gray-400 text-sm mb-4">
                          Be the first to review {place.name}!
                        </p>
                        <button
                          onClick={() => handleAddReview(place.id)}
                          className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Write a Review
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* No Results */}
        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Places Found</h3>
            <p className="text-gray-400 text-sm mb-4">
              Try adjusting your filters or add a new place
            </p>
            <button
              onClick={() => setShowAddReviewModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-2xl font-semibold text-white"
            >
              Add New Place
            </button>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">
                  {selectedPlaceForReview ? "Add Your Review" : "Add New Place & Review"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddReviewModal(false);
                    setSelectedPlaceForReview(null);
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <AddReviewForm
                placeId={selectedPlaceForReview || undefined}
                placeName={selectedPlaceForReview ? filteredPlaces.find(p => p.id === selectedPlaceForReview)?.name : ''}
                placeType={selectedPlaceForReview ? filteredPlaces.find(p => p.id === selectedPlaceForReview)?.type : 'restaurant'}
                onSubmit={handleSubmitReview}
                onCancel={() => {
                  setShowAddReviewModal(false);
                  setSelectedPlaceForReview(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacesPage;