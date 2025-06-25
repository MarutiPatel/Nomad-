import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Review {
  id: string;
  placeId: string;
  userId: string;
  userDisplayName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  timestamp: Date;
  categoryRatings: {
    [key: string]: number;
  };
  tags: string[];
  photos: string[];
  likes: number;
  helpfulCount: number;
  isLiked: boolean;
  isHelpful: boolean;
}

interface Place {
  id: string;
  name: string;
  type: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  overallRating: number;
  totalReviews: number;
  categoryRatings: {
    [key: string]: number;
  };
  amenities: string[];
  priceRange: string;
  isVerified: boolean;
  photos: string[];
  lastUpdated: Date;
}

interface ReviewContextType {
  reviews: Review[];
  places: Place[];
  getUserReviews: (userId: string) => Review[];
  getPlaceReviews: (placeId: string) => Review[];
  getPlace: (placeId: string) => Place | undefined;
  addReview: (review: Omit<Review, 'id'>) => void;
  updateReview: (reviewId: string, updatedData: Partial<Review>) => void;
  deleteReview: (reviewId: string) => void;
  likeReview: (reviewId: string) => void;
  markReviewHelpful: (reviewId: string) => void;
  addPlace: (place: Omit<Place, 'id' | 'overallRating' | 'totalReviews' | 'lastUpdated'>) => string;
  updatePlace: (placeId: string, updatedData: Partial<Place>) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('nomad_reviews');
    const savedPlaces = localStorage.getItem('nomad_places');
    
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews);
      // Convert string dates back to Date objects
      const formattedReviews = parsedReviews.map((review: any) => ({
        ...review,
        timestamp: new Date(review.timestamp)
      }));
      setReviews(formattedReviews);
    }
    
    if (savedPlaces) {
      const parsedPlaces = JSON.parse(savedPlaces);
      // Convert string dates back to Date objects
      const formattedPlaces = parsedPlaces.map((place: any) => ({
        ...place,
        lastUpdated: new Date(place.lastUpdated)
      }));
      setPlaces(formattedPlaces);
    } else {
      // Initialize with some mock data if no places exist
      const initialPlaces: Place[] = [
        {
          id: '1',
          name: 'Highway Dhaba Express',
          type: 'restaurant',
          location: 'NH-1, Delhi-Chandigarh Highway',
          coordinates: { lat: 28.7041, lng: 77.1025 },
          overallRating: 4.6,
          totalReviews: 1,
          categoryRatings: {
            food: 4.8,
            service: 4.5,
            cleanliness: 4.7,
            value: 4.6,
            location: 4.4
          },
          amenities: ['Parking', 'Clean Washrooms', 'WiFi', '24/7 Open'],
          priceRange: '$',
          isVerified: true,
          photos: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'],
          lastUpdated: new Date()
        },
        {
          id: '2',
          name: 'Mountain View Resort',
          type: 'hotel',
          location: 'Manali, Himachal Pradesh',
          coordinates: { lat: 32.2396, lng: 77.1887 },
          overallRating: 4.3,
          totalReviews: 0,
          categoryRatings: {
            comfort: 4.2,
            service: 4.5,
            cleanliness: 4.1,
            value: 4.3,
            location: 4.8
          },
          amenities: ['Mountain View', 'Room Service', 'Restaurant', 'Parking'],
          priceRange: '$$',
          isVerified: true,
          photos: ['https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400'],
          lastUpdated: new Date()
        },
        {
          id: '3',
          name: 'HP Petrol Pump',
          type: 'gas-station',
          location: 'Gurgaon-Delhi Expressway',
          coordinates: { lat: 28.4595, lng: 77.0266 },
          overallRating: 4.1,
          totalReviews: 0,
          categoryRatings: {
            facilities: 3.5,
            service: 4.2,
            cleanliness: 4.0,
            value: 4.1,
            location: 4.5
          },
          amenities: ['24/7 Service', 'Air Pump', 'Snack Shop', 'Clean Toilets'],
          priceRange: '$',
          isVerified: true,
          photos: ['https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400'],
          lastUpdated: new Date()
        }
      ];
      
      setPlaces(initialPlaces);
      localStorage.setItem('nomad_places', JSON.stringify(initialPlaces));
      
      // Add a sample review
      const initialReview: Review = {
        id: '1',
        placeId: '1',
        userId: 'system',
        userDisplayName: 'RoadTripMaster',
        userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        rating: 5,
        title: 'Best Dhaba on NH-1!',
        content: 'Amazing butter chicken and fresh rotis. The staff is super friendly and the washrooms are surprisingly clean for a highway dhaba. Perfect stop for families.',
        timestamp: new Date(),
        categoryRatings: {
          food: 5,
          service: 5,
          cleanliness: 4,
          value: 5,
          location: 4
        },
        tags: ['family-friendly', 'clean-washrooms', 'good-parking'],
        photos: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'],
        likes: 23,
        helpfulCount: 18,
        isLiked: false,
        isHelpful: false
      };
      
      setReviews([initialReview]);
      localStorage.setItem('nomad_reviews', JSON.stringify([initialReview]));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('nomad_reviews', JSON.stringify(reviews));
    localStorage.setItem('nomad_places', JSON.stringify(places));
  }, [reviews, places]);

  // Get all reviews by a specific user
  const getUserReviews = (userId: string): Review[] => {
    return reviews.filter(review => review.userId === userId);
  };

  // Get all reviews for a specific place
  const getPlaceReviews = (placeId: string): Review[] => {
    return reviews.filter(review => review.placeId === placeId);
  };

  // Get a place by ID
  const getPlace = (placeId: string): Place | undefined => {
    return places.find(place => place.id === placeId);
  };

  // Add a new review
  const addReview = (reviewData: Omit<Review, 'id'>): void => {
    const newReview = {
      ...reviewData,
      id: Date.now().toString(),
      likes: 0,
      helpfulCount: 0,
      isLiked: false,
      isHelpful: false
    };
    
    setReviews(prev => [...prev, newReview]);
    
    // Update place ratings
    updatePlaceRatings(reviewData.placeId);
  };

  // Update an existing review
  const updateReview = (reviewId: string, updatedData: Partial<Review>): void => {
    setReviews(prev => {
      const newReviews = prev.map(review => 
        review.id === reviewId 
          ? { ...review, ...updatedData } 
          : review
      );
      
      // If rating was updated, update place ratings
      const review = prev.find(r => r.id === reviewId);
      if (review && updatedData.rating && review.rating !== updatedData.rating) {
        updatePlaceRatings(review.placeId);
      }
      
      return newReviews;
    });
  };

  // Delete a review
  const deleteReview = (reviewId: string): void => {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      // Update place ratings
      updatePlaceRatings(review.placeId);
    }
  };

  // Like/unlike a review
  const likeReview = (reviewId: string): void => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const wasLiked = review.isLiked;
        return {
          ...review,
          isLiked: !wasLiked,
          likes: wasLiked ? review.likes - 1 : review.likes + 1
        };
      }
      return review;
    }));
  };

  // Mark a review as helpful/unhelpful
  const markReviewHelpful = (reviewId: string): void => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const wasHelpful = review.isHelpful;
        return {
          ...review,
          isHelpful: !wasHelpful,
          helpfulCount: wasHelpful ? review.helpfulCount - 1 : review.helpfulCount + 1
        };
      }
      return review;
    }));
  };

  // Add a new place
  const addPlace = (placeData: Omit<Place, 'id' | 'overallRating' | 'totalReviews' | 'lastUpdated'>): string => {
    const newPlaceId = Date.now().toString();
    const newPlace: Place = {
      ...placeData,
      id: newPlaceId,
      overallRating: 0,
      totalReviews: 0,
      lastUpdated: new Date()
    };
    
    setPlaces(prev => [...prev, newPlace]);
    return newPlaceId;
  };

  // Update a place
  const updatePlace = (placeId: string, updatedData: Partial<Place>): void => {
    setPlaces(prev => prev.map(place => 
      place.id === placeId 
        ? { ...place, ...updatedData, lastUpdated: new Date() } 
        : place
    ));
  };

  // Helper function to update place ratings based on all reviews
  const updatePlaceRatings = (placeId: string): void => {
    const placeReviews = reviews.filter(review => review.placeId === placeId);
    
    if (placeReviews.length === 0) return;
    
    // Calculate overall rating
    const overallRating = placeReviews.reduce((sum, review) => sum + review.rating, 0) / placeReviews.length;
    
    // Calculate category ratings
    const categoryRatings: { [key: string]: number[] } = {};
    
    placeReviews.forEach(review => {
      Object.entries(review.categoryRatings).forEach(([category, rating]) => {
        if (!categoryRatings[category]) {
          categoryRatings[category] = [];
        }
        categoryRatings[category].push(rating);
      });
    });
    
    // Average category ratings
    const avgCategoryRatings: { [key: string]: number } = {};
    Object.entries(categoryRatings).forEach(([category, ratings]) => {
      avgCategoryRatings[category] = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    });
    
    // Update place
    setPlaces(prev => prev.map(place => {
      if (place.id === placeId) {
        return {
          ...place,
          overallRating: Math.round(overallRating * 10) / 10, // Round to 1 decimal
          totalReviews: placeReviews.length,
          categoryRatings: avgCategoryRatings,
          lastUpdated: new Date()
        };
      }
      return place;
    }));
  };

  return (
    <ReviewContext.Provider value={{
      reviews,
      places,
      getUserReviews,
      getPlaceReviews,
      getPlace,
      addReview,
      updateReview,
      deleteReview,
      likeReview,
      markReviewHelpful,
      addPlace,
      updatePlace
    }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
}