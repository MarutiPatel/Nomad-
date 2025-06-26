import React, { useState, useRef } from 'react';
import { 
  Camera, MapPin, Plus, Filter, Search, Heart, MessageCircle, 
  Share, Video, Mic, FileText, Tag, Clock, Users, Star,
  Navigation, ChevronDown, Check, RefreshCw, X, Upload, AlertTriangle, Globe, Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Footprint {
  id: string;
  type: 'food' | 'view' | 'stay' | 'experience' | 'tip' | 'warning';
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  mediaType: 'photo' | 'video' | 'voice' | 'text';
  mediaUrl?: string;
  tags: string[];
  timestamp: Date;
  author: {
    id: string;
    displayName: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  visibility: 'public' | 'friends' | 'private';
}

function FootprintsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'explore'>('create');
  const [selectedMediaType, setSelectedMediaType] = useState<'photo' | 'video' | 'voice' | 'text'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: 'experience',
    title: '',
    description: '',
    location: 'Brooklyn Bridge, New York',
    customLocation: false,
    tags: [] as string[],
    visibility: 'public' as 'public' | 'friends' | 'private',
    mediaFile: null as File | null
  });

  // Mock footprints data
  const mockFootprints: Footprint[] = [
    {
      id: '1',
      type: 'food',
      title: 'Amazing Street Tacos',
      description: 'Found this incredible taco stand tucked away in a local neighborhood. The al pastor was absolutely divine!',
      location: 'Mexico City, Mexico',
      coordinates: { lat: 19.4326, lng: -99.1332 },
      mediaType: 'photo',
      mediaUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['food', 'street-food', 'tacos', 'local'],
      timestamp: new Date('2024-01-20'),
      author: {
        id: '1',
        displayName: 'FoodieWanderer',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      likes: 24,
      comments: 8,
      isLiked: true,
      visibility: 'public'
    },
    {
      id: '2',
      type: 'view',
      title: 'Breathtaking Sunset Point',
      description: 'This hidden viewpoint offers the most spectacular sunset views. Perfect spot for reflection and photography.',
      location: 'Santorini, Greece',
      coordinates: { lat: 36.3932, lng: 25.4615 },
      mediaType: 'photo',
      mediaUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['sunset', 'view', 'photography', 'peaceful'],
      timestamp: new Date('2024-01-18'),
      author: {
        id: '2',
        displayName: 'SunsetChaser',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      likes: 42,
      comments: 15,
      isLiked: false,
      visibility: 'public'
    },
    {
      id: '3',
      type: 'experience',
      title: 'Cultural Festival Experience',
      description: 'Stumbled upon this amazing local festival. The energy, colors, and music were absolutely incredible!',
      location: 'Jaipur, India',
      coordinates: { lat: 26.9124, lng: 75.7873 },
      mediaType: 'video',
      tags: ['culture', 'festival', 'music', 'local'],
      timestamp: new Date('2024-01-15'),
      author: {
        id: '3',
        displayName: 'CultureSeeker',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      likes: 18,
      comments: 6,
      isLiked: true,
      visibility: 'public'
    }
  ];

  const [footprints] = useState(mockFootprints);

  const footprintTypes = [
    { value: 'experience', label: 'General Experience', icon: Star },
    { value: 'food', label: 'Food Discovery', icon: Plus },
    { value: 'view', label: 'Amazing View', icon: Camera },
    { value: 'stay', label: 'Place to Stay', icon: MapPin },
    { value: 'tip', label: 'Travel Tip', icon: Users },
    { value: 'warning', label: 'Safety Warning', icon: AlertTriangle }
  ];

  const mediaTypes = [
    { type: 'text', icon: FileText, label: 'Text', color: 'from-blue-500 to-cyan-500' },
    { type: 'photo', icon: Camera, label: 'Photo', color: 'from-green-500 to-teal-500' },
    { type: 'video', icon: Video, label: 'Video', color: 'from-purple-500 to-pink-500' },
    { type: 'voice', icon: Mic, label: 'Voice', color: 'from-orange-500 to-red-500' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag.trim()] }));
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, mediaFile: file }));
    }
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating footprint:', formData);
    // Reset form after submission
    setFormData({
      type: 'experience',
      title: '',
      description: '',
      location: 'Brooklyn Bridge, New York',
      customLocation: false,
      tags: [],
      visibility: 'public',
      mediaFile: null
    });
    setSelectedMediaType('text');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return `${Math.floor(diffInDays / 30)}mo ago`;
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Travel Footprints</h1>
        <p className="text-gray-400 text-sm">Leave your mark and discover amazing places</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-2xl bg-black/20 p-1 mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'create'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Drop Footprint</span>
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'explore'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Search className="h-4 w-4" />
          <span className="text-sm font-medium">Explore</span>
        </button>
      </div>

      {activeTab === 'create' ? (
        /* CREATE FOOTPRINT FORM */
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Media Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Add Media (Optional)</label>
              <div className="grid grid-cols-2 gap-3">
                {mediaTypes.map((media) => (
                  <button
                    key={media.type}
                    type="button"
                    onClick={() => setSelectedMediaType(media.type as any)}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${
                      selectedMediaType === media.type
                        ? `bg-gradient-to-r ${media.color} bg-opacity-20 border-white/30`
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <media.icon className={`h-6 w-6 mx-auto mb-2 ${
                      selectedMediaType === media.type ? 'text-white' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      selectedMediaType === media.type ? 'text-white' : 'text-gray-400'
                    }`}>
                      {media.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Media Upload/Record */}
              {selectedMediaType === 'photo' && (
                <div className="mt-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleMediaUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-4 border-2 border-dashed border-white/20 rounded-2xl text-gray-400 hover:border-green-400/50 hover:text-green-400 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload Photo</span>
                  </button>
                </div>
              )}

              {selectedMediaType === 'voice' && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleVoiceRecording}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isRecording
                        ? 'bg-red-500/20 border-red-400/30 text-red-400 animate-pulse'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Mic className="h-5 w-5" />
                    <span>{isRecording ? 'Recording...' : 'Start Recording'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footprint Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Footprint Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-orange-400 focus:outline-none appearance-none"
              >
                {footprintTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-slate-800">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="What's this moment about?"
                className="w-full px-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Location</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-400/30 rounded-2xl">
                  <Check className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Detected:</span>
                  <span className="text-white">{formData.location}</span>
                  <button
                    type="button"
                    className="ml-auto p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 text-green-400" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="customLocation"
                    checked={formData.customLocation}
                    onChange={(e) => handleInputChange('customLocation', e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-black/20 border-white/10 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="customLocation" className="text-sm text-gray-300">
                    Use custom location
                  </label>
                </div>

                {formData.customLocation && (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter custom location"
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                  />
                )}
              </div>
            </div>

            {/* Caption/Story */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Caption/Story (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Share your experience, tips, or story..."
                className="w-full px-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none resize-none"
                rows={4}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Tags</label>
              <TagInput
                tags={formData.tags}
                onTagAdd={handleTagAdd}
                onTagRemove={handleTagRemove}
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Who can see this?</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'public', label: 'Public', icon: Globe },
                  { value: 'friends', label: 'Friends', icon: Users },
                  { value: 'private', label: 'Private', icon: Lock }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('visibility', option.value)}
                    className={`p-3 rounded-2xl border transition-all duration-300 ${
                      formData.visibility === option.value
                        ? 'bg-orange-500/20 border-orange-400/30 text-orange-400'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <option.icon className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Drop Your Footprint
            </button>
          </form>
        </div>
      ) : (
        /* EXPLORE FOOTPRINTS */
        <div>
          {/* Controls */}
          <div className="flex items-center space-x-2 mb-6">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Search className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Filter className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Footprints List */}
          <div className="space-y-4">
            {footprints.map((footprint) => (
              <FootprintCard key={footprint.id} footprint={footprint} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Tag Input Component
function TagInput({ 
  tags, 
  onTagAdd, 
  onTagRemove 
}: { 
  tags: string[]; 
  onTagAdd: (tag: string) => void; 
  onTagRemove: (tag: string) => void; 
}) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        onTagAdd(inputValue);
        setInputValue('');
      }
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Add tags (press Enter or comma to add)"
        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none"
      />
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center space-x-1 px-3 py-1 bg-orange-500/20 rounded-full text-orange-400 text-sm border border-orange-400/30">
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
              <button 
                type="button"
                onClick={() => onTagRemove(tag)}
                className="text-orange-400 hover:text-white transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Footprint Card Component
function FootprintCard({ footprint }: { footprint: Footprint }) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return `${Math.floor(diffInDays / 30)}mo ago`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
      {/* Media */}
      {footprint.mediaUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={footprint.mediaUrl}
            alt={footprint.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Author Info */}
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={footprint.author.avatar}
            alt={footprint.author.displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="text-white font-medium text-sm">{footprint.author.displayName}</div>
            <div className="flex items-center space-x-2 text-gray-400 text-xs">
              <MapPin className="h-3 w-3" />
              <span>{footprint.location}</span>
              <span>•</span>
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(footprint.timestamp)}</span>
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            footprint.type === 'food' ? 'bg-orange-500/20 text-orange-400' :
            footprint.type === 'view' ? 'bg-cyan-500/20 text-cyan-400' :
            footprint.type === 'experience' ? 'bg-purple-500/20 text-purple-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {footprint.type}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-white font-semibold mb-2">{footprint.title}</h3>
        <p className="text-gray-300 text-sm mb-3 leading-relaxed">{footprint.description}</p>

        {/* Tags */}
        {footprint.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {footprint.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
              >
                #{tag}
              </span>
            ))}
            {footprint.tags.length > 3 && (
              <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                +{footprint.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className={`flex items-center space-x-1 transition-colors ${
              footprint.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
            }`}>
              <Heart className={`h-4 w-4 ${footprint.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{footprint.likes}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{footprint.comments}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Share className="h-4 w-4 text-gray-400" />
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white text-sm font-medium hover:shadow-lg transition-all duration-300">
              <Navigation className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FootprintsPage;