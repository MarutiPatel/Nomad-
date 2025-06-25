import React, { useState, useRef } from 'react';
import { Camera, Tag, X } from 'lucide-react';
import RatingStars from './RatingStars';
import { useAuth } from '../contexts/AuthContext';

interface AddReviewFormProps {
  placeId?: string;
  placeName?: string;
  placeType?: string;
  onSubmit: (reviewData: ReviewFormData) => void;
  onCancel: () => void;
}

export interface ReviewFormData {
  placeId?: string;
  placeName: string;
  placeType: string;
  location: string;
  title: string;
  content: string;
  overallRating: number;
  categories: {
    [key: string]: number;
  };
  tags: string[];
  photos: string[];
}

export default function AddReviewForm({
  placeId,
  placeName = '',
  placeType = 'restaurant',
  onSubmit,
  onCancel
}: AddReviewFormProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ReviewFormData>({
    placeId,
    placeName,
    placeType,
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
    tags: [],
    photos: []
  });
  
  const [tagInput, setTagInput] = useState('');
  
  const handleRatingChange = (category: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: value
      }
    }));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // For demo purposes, we're just creating URLs for the selected images
    // In a real app, you'd upload these to a server
    const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };
  
  const handleRemovePhoto = (photoUrl: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo !== photoUrl)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categoryLabels: { [key: string]: string } = {
    food: 'Food Quality',
    service: 'Service',
    cleanliness: 'Cleanliness',
    value: 'Value for Money',
    location: 'Location',
    comfort: 'Comfort',
    facilities: 'Facilities',
    atmosphere: 'Atmosphere'
  };
  
  // Determine which categories to display based on place type
  const getCategoriesForPlaceType = () => {
    switch (formData.placeType) {
      case 'restaurant':
      case 'cafe':
        return ['food', 'service', 'cleanliness', 'value'];
      case 'hotel':
        return ['comfort', 'service', 'cleanliness', 'value', 'location'];
      case 'gas-station':
        return ['facilities', 'cleanliness', 'service', 'value'];
      default:
        return ['service', 'cleanliness', 'value', 'location'];
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!placeId && (
        <>
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
              <option value="restaurant" className="bg-slate-800">Restaurant</option>
              <option value="hotel" className="bg-slate-800">Hotel/Accommodation</option>
              <option value="gas-station" className="bg-slate-800">Gas Station</option>
              <option value="cafe" className="bg-slate-800">Cafe</option>
              <option value="attraction" className="bg-slate-800">Tourist Attraction</option>
              <option value="shop" className="bg-slate-800">Shop</option>
              <option value="hidden-gem" className="bg-slate-800">Hidden Gem</option>
              <option value="transport" className="bg-slate-800">Transport Hub</option>
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
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Overall Rating</label>
        <div className="flex items-center space-x-2">
          <RatingStars 
            rating={formData.overallRating} 
            size="lg" 
            interactive 
            onChange={(rating) => setFormData(prev => ({ ...prev, overallRating: rating }))}
          />
          <span className="text-white ml-2">{formData.overallRating}</span>
        </div>
      </div>

      {/* Category-specific ratings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-300">Detailed Ratings</h3>
        <div className="grid grid-cols-2 gap-4">
          {getCategoriesForPlaceType().map((category) => (
            <div key={category}>
              <label className="block text-xs text-gray-400 mb-1">{categoryLabels[category] || category}</label>
              <div className="flex items-center space-x-1">
                <RatingStars 
                  rating={formData.categories[category] || 5} 
                  size="sm" 
                  interactive 
                  onChange={(rating) => handleRatingChange(category, rating)}
                />
                <span className="text-white text-sm ml-1">
                  {formData.categories[category] || 5}
                </span>
              </div>
            </div>
          ))}
        </div>
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

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none"
            placeholder="Add tags (e.g., clean, family-friendly)"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-3 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-2xl text-orange-400 hover:from-orange-500/40 hover:to-red-500/40 transition-colors"
          >
            <Tag className="h-5 w-5" />
          </button>
        </div>
        
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-1 px-3 py-1 bg-orange-500/20 rounded-full text-orange-400 text-xs">
                <span>{tag}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveTag(tag)}
                  className="text-orange-400 hover:text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photo upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Add Photos</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          multiple
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-3 bg-black/20 border border-dashed border-white/20 rounded-2xl text-gray-400 hover:border-orange-400/50 hover:text-orange-400 transition-colors flex items-center justify-center space-x-2"
        >
          <Camera className="h-5 w-5" />
          <span>Upload Photos</span>
        </button>
        
        {formData.photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.photos.map((photo, index) => (
              <div key={index} className="relative w-16 h-16">
                <img src={photo} alt="Review" className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
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
  );
}