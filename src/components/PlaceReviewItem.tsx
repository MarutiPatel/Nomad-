import React from 'react';
import { ThumbsUp, Flag, MessageCircle, Share, Camera, Star } from 'lucide-react';
import RatingStars from './RatingStars';

interface ReviewProps {
  review: {
    id: string;
    author: {
      id: string;
      displayName: string;
      avatar: string;
      isVerified?: boolean;
      totalReviews?: number;
    };
    rating: number;
    title: string;
    content: string;
    images?: string[];
    timestamp: Date;
    likes: number;
    isLiked?: boolean;
    categories?: {
      [key: string]: number;
    };
    tags?: string[];
    helpful?: number;
    isHelpful?: boolean;
    verified?: boolean;
  };
  onLike?: (id: string) => void;
  onMarkHelpful?: (id: string) => void;
  onReply?: (id: string) => void;
  onReport?: (id: string) => void;
}

export default function PlaceReviewItem({ 
  review, 
  onLike, 
  onMarkHelpful,
  onReply,
  onReport
}: ReviewProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300">
      <div className="flex items-start space-x-3">
        <img
          src={review.author.avatar}
          alt={review.author.displayName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-medium">{review.author.displayName}</h3>
                {review.author.isVerified && (
                  <Star className="h-3 w-3 text-blue-400 fill-current" />
                )}
              </div>
              {review.author.totalReviews && (
                <p className="text-gray-400 text-xs">{review.author.totalReviews} reviews</p>
              )}
            </div>
            <div className="text-gray-400 text-xs">
              {formatTimeAgo(review.timestamp)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <RatingStars rating={review.rating} size="md" />
            <span className="text-yellow-400 text-sm font-medium">{review.rating.toFixed(1)}</span>
          </div>
          
          <h4 className="text-white font-medium text-sm mb-1">{review.title}</h4>
          <p className="text-gray-300 text-sm mb-3">{review.content}</p>
          
          {review.images && review.images.length > 0 && (
            <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
              {review.images.map((image, index) => (
                <div key={index} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                  <img src={image} alt="Review" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          
          {review.categories && Object.keys(review.categories).length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {Object.entries(review.categories).map(([category, rating]) => (
                <div key={category} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 capitalize">{category}</span>
                  <div className="flex items-center space-x-1">
                    <RatingStars rating={rating} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {review.tags && review.tags.length > 0 && (
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
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onMarkHelpful && onMarkHelpful(review.id)}
              className={`flex items-center space-x-1 text-xs transition-colors ${
                review.isHelpful ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Helpful{review.helpful ? ` (${review.helpful})` : ''}</span>
            </button>
            
            {onReply && (
              <button
                onClick={() => onReply(review.id)}
                className="flex items-center space-x-1 text-xs text-gray-400 hover:text-blue-400 transition-colors"
              >
                <MessageCircle className="h-3 w-3" />
                <span>Reply</span>
              </button>
            )}
            
            <button
              onClick={() => onReport && onReport(review.id)}
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-orange-400 transition-colors"
            >
              <Flag className="h-3 w-3" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}