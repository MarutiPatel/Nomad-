import React, { useState } from 'react';
import { 
  Star, MapPin, Camera, Plus, Filter, Search, 
  User, Clock, Users, Heart, MessageCircle,
  UserPlus, Navigation, Send, Eye, EyeOff, AlertTriangle,
  RefreshCw, Waves, ThumbsUp, ThumbsDown, Flag, X, Edit
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReviews } from '../contexts/ReviewContext';
import RatingStars from '../components/RatingStars';
import PlaceReviewItem from '../components/PlaceReviewItem';
import AddReviewForm, { ReviewFormData } from '../components/AddReviewForm';

interface PlaceRating {
  id: string;
  title: string;
  description: string;
  type: 'restaurant' | 'hotel' | 'gas-station' | 'attraction' | 'shop' | 'hidden-gem' | 'cafe' | 'viewpoint';
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
  const { places, reviews, getPlaceReviews, addReview, likeReview, markReviewHelpful } = useReviews();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');

  const placeCategories = [
    { id: 'all', label: 'All Places' },
    { id: 'restaurant', label: 'Restaurants' },
    { id: 'hotel', label: 'Hotels' },
    { id: 'gas-station', label: 'Gas Stations' },
    { id: 'attraction', label: 'Attractions' },
    { id: 'cafe', label: 'Cafes' },
    { id: 'shop', label: 'Shops' },
    { id: 'hidden-gem', label: 'Hidden Gems' }
  ];

  const filteredPlaces = selectedCategory === 'all' 
    ? places 
    : places.filter(place => place.type === selectedCategory);

  const handleSubmitReview = (reviewData: ReviewFormData) => {
    const newReview = {
      placeId: selectedPlace || reviewData.placeId || '',
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
    setSelectedPlace(null);
  };

  const handleLikeReview = (reviewId: string) => {
    likeReview(reviewId);
  };

  const handleMarkHelpful = (reviewId: string) => {
    markReviewHelpful(reviewId);
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
            className={`px-4 py-2 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Places List */}
      <div className="space-y-6">
        {filteredPlaces.map((place) => (
          <div key={place.id} className="mb-8">
            <div 
              className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 mb-4"
              onClick={() => setSelectedPlace(selectedPlace === place.id ? null : place.id)}
            >
              {place.photos && place.photos.length > 0 && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={place.photos[0]}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{place.name}</h3>
                    <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{place.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RatingStars rating={place.overallRating} size="md" />
                      <span className="text-yellow-400">{place.overallRating.toFixed(1)}</span>
                      <span className="text-gray-400 text-sm">({place.totalReviews} reviews)</span>
                    </div>
                  </div>
                  
                  {place.isVerified && (
                    <div className="bg-green-500/20 px-2 py-1 rounded-full">
                      <span className="text-green-400 text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {place.categoryRatings && Object.entries(place.categoryRatings).slice(0, 4).map(([category, rating]) => (
                    <div key={category} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 capitalize">{category}</span>
                      <div className="flex items-center space-x-1">
                        <RatingStars rating={rating} size="sm" />
                        <span className="text-gray-300 ml-1">{rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      place.priceRange === 'Free' || place.priceRange === '$' ? 'bg-green-500/20 text-green-400' :
                      place.priceRange === '$$' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {place.priceRange}
                    </span>
                    <span className="text-xs text-gray-400">
                      {place.lastUpdated ? `Updated ${new Date(place.lastUpdated).toLocaleDateString()}` : ''}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlace(place.id);
                      setShowAddReviewModal(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white text-sm font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Add Review
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded reviews section when place is selected */}
            {selectedPlace === place.id && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Reviews ({place.totalReviews})</h3>
                  <button
                    onClick={() => {
                      setSelectedPlace(null);
                    }}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {getPlaceReviews(place.id).length > 0 ? (
                    getPlaceReviews(place.id)
                      .sort((a, b) => {
                        if (sortBy === 'recent') {
                          return b.timestamp.getTime() - a.timestamp.getTime();
                        } else if (sortBy === 'rating') {
                          return b.rating - a.rating;
                        } else if (sortBy === 'helpful') {
                          return b.helpfulCount - a.helpfulCount;
                        }
                        return 0;
                      })
                      .map(review => (
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
                        Be the first to review this place!
                      </p>
                      <button
                        onClick={() => setShowAddReviewModal(true)}
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
        ))}

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Places Found</h3>
            <p className="text-gray-400 text-sm mb-4">
              Try a different category or add a new place
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
                  {selectedPlace ? "Add Your Review" : "Add New Place & Review"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddReviewModal(false);
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <AddReviewForm
                placeId={selectedPlace || undefined}
                placeName={selectedPlace ? places.find(p => p.id === selectedPlace)?.name : ''}
                placeType={selectedPlace ? places.find(p => p.id === selectedPlace)?.type : 'restaurant'}
                onSubmit={handleSubmitReview}
                onCancel={() => setShowAddReviewModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacesRatingPage;