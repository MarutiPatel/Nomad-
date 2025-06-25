import React, { useState } from 'react';
import { Star, MapPin, ThumbsUp, MessageCircle, Flag, Share, Heart } from 'lucide-react';

interface PlaceRatingCardProps {
  place: {
    id: string;
    name: string;
    type: string;
    location: string;
    rating: number;
    reviewCount: number;
    image?: string;
    distance?: number;
    priceRange?: string;
    isVerified?: boolean;
  };
  onViewDetails?: (placeId: string) => void;
  onRate?: (placeId: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function PlaceRatingCard({ 
  place, 
  onViewDetails, 
  onRate, 
  size = 'md' 
}: PlaceRatingCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 ${sizeClasses[size]}`}>
      {place.image && (
        <div className="mb-4">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-32 object-cover rounded-xl"
          />
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-white font-semibold">{place.name}</h3>
            {place.isVerified && (
              <div className="bg-green-500/20 px-2 py-1 rounded-full">
                <span className="text-green-400 text-xs font-medium">Verified</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
            <MapPin className="h-3 w-3" />
            <span>{place.location}</span>
            {place.distance && <span>• {place.distance}km</span>}
          </div>
          <span className="text-gray-500 text-xs capitalize">{place.type.replace('-', ' ')}</span>
        </div>
        
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`p-2 rounded-full transition-colors ${
            isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {renderStars(place.rating)}
          <span className="text-yellow-400 text-sm font-medium">{place.rating}</span>
          <span className="text-gray-400 text-xs">({place.reviewCount})</span>
        </div>
        
        {place.priceRange && (
          <span className={`px-2 py-1 rounded-full text-xs ${
            place.priceRange === 'Free' || place.priceRange === '$' ? 'bg-green-500/20 text-green-400' :
            place.priceRange === '$$' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {place.priceRange}
          </span>
        )}
      </div>

      <div className="flex space-x-2">
        {onRate && (
          <button
            onClick={() => onRate(place.id)}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-xl text-white text-sm font-medium hover:shadow-lg transition-all duration-300"
          >
            Add Review
          </button>
        )}
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(place.id)}
            className="flex-1 border border-white/20 px-4 py-2 rounded-xl text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}