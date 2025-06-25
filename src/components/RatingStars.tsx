import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export default function RatingStars({ 
  rating, 
  size = 'sm', 
  interactive = false, 
  onChange,
  className = ''
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClass = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : "submit"}
          onClick={() => interactive && onChange && onChange(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <Star 
            className={`${sizeClass[size]} ${
              star <= (hoverRating || rating)
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-600'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}