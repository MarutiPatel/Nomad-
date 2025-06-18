import React, { useState } from 'react';
import { 
  Camera, MapPin, Eye, MessageCircle, Star, Plus, 
  Filter, Search, Layers, Zap, Gift, Heart, Users,
  Clock, Navigation, Share, Bookmark
} from 'lucide-react';

interface ARTag {
  id: string;
  title: string;
  content: string;
  type: 'tip' | 'review' | 'warning' | 'fun' | 'secret';
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  author: string;
  timestamp: Date;
  likes: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  mediaUrl?: string;
}

interface VirtualPostcard {
  id: string;
  title: string;
  message: string;
  image: string;
  location: string;
  sender: string;
  recipient: string;
  expiresAt: Date;
  isPublic: boolean;
  likes: number;
}

function ARWorldPage() {
  const [activeTab, setActiveTab] = useState<'ar-tags' | 'postcards' | 'create'>('ar-tags');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const mockARTags: ARTag[] = [
    {
      id: '1',
      title: 'Hidden Beach Access',
      content: 'Secret path behind the rocks leads to a pristine private beach. Best during low tide!',
      type: 'secret',
      location: 'Goa Beach',
      coordinates: { lat: 15.2993, lng: 74.1240 },
      distance: 0.2,
      author: 'BeachExplorer99',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 23,
      views: 156,
      isLiked: false,
      isBookmarked: true
    },
    {
      id: '2',
      title: 'Best Chai Spot',
      content: 'Uncle\'s tea stall serves the most amazing masala chai. Only ₹10 and he speaks great English!',
      type: 'tip',
      location: 'Manali Market',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      distance: 1.5,
      author: 'ChaiLover42',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 45,
      views: 234,
      isLiked: true,
      isBookmarked: false,
      mediaUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Slippery Rocks Warning',
      content: 'Be very careful here! Rocks are extremely slippery when wet. Two people slipped yesterday.',
      type: 'warning',
      location: 'Waterfall Trek',
      coordinates: { lat: 30.0869, lng: 78.2676 },
      distance: 3.2,
      author: 'SafetyFirst',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 67,
      views: 445,
      isLiked: false,
      isBookmarked: true
    }
  ];

  const mockPostcards: VirtualPostcard[] = [
    {
      id: '1',
      title: 'Sunset Magic',
      message: 'Wish you were here to see this incredible sunset! The colors are beyond words.',
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Goa Beach',
      sender: 'WanderlustSoul',
      recipient: 'Community',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isPublic: true,
      likes: 89
    },
    {
      id: '2',
      title: 'Mountain Vibes',
      message: 'The air is so fresh up here! Found the perfect spot for meditation.',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Himachal Mountains',
      sender: 'ZenTraveler',
      recipient: 'Community',
      expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
      isPublic: true,
      likes: 56
    }
  ];

  const [arTags, setArTags] = useState(mockARTags);
  const [postcards] = useState(mockPostcards);

  const tagFilters = [
    { id: 'all', label: 'All', icon: Eye },
    { id: 'secret', label: 'Secrets', icon: Star },
    { id: 'tip', label: 'Tips', icon: MessageCircle },
    { id: 'warning', label: 'Warnings', icon: Zap }
  ];

  const handleLike = (id: string) => {
    setArTags(prev => prev.map(tag => 
      tag.id === id 
        ? { ...tag, isLiked: !tag.isLiked, likes: tag.isLiked ? tag.likes - 1 : tag.likes + 1 }
        : tag
    ));
  };

  const handleBookmark = (id: string) => {
    setArTags(prev => prev.map(tag => 
      tag.id === id 
        ? { ...tag, isBookmarked: !tag.isBookmarked }
        : tag
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'secret': return 'from-purple-400 to-pink-500';
      case 'tip': return 'from-blue-400 to-cyan-500';
      case 'warning': return 'from-red-400 to-orange-500';
      case 'review': return 'from-green-400 to-teal-500';
      case 'fun': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const formatTimeUntilExpiry = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
      return `${diffInMinutes}m left`;
    }
    return `${diffInHours}h left`;
  };

  const filteredTags = selectedFilter === 'all' 
    ? arTags 
    : arTags.filter(tag => tag.type === selectedFilter);

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">AR World</h1>
        <p className="text-gray-400 text-sm">Discover hidden messages and share virtual postcards</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-2xl bg-black/20 p-1 mb-6">
        <button
          onClick={() => setActiveTab('ar-tags')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'ar-tags'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">AR Tags</span>
        </button>
        <button
          onClick={() => setActiveTab('postcards')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'postcards'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Gift className="h-4 w-4" />
          <span className="text-sm font-medium">Postcards</span>
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'create'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Create</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'ar-tags' && (
        <div>
          {/* Controls */}
          <div className="flex items-center space-x-2 mb-6">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Search className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Filter className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Layers className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
            {tagFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                }`}
              >
                <filter.icon className="h-4 w-4" />
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          {/* AR Tags List */}
          <div className="space-y-4">
            {filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                {tag.mediaUrl && (
                  <div className="h-32 overflow-hidden">
                    <img
                      src={tag.mediaUrl}
                      alt={tag.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getTypeColor(tag.type)} flex items-center justify-center`}>
                          {tag.type === 'secret' && <Star className="h-3 w-3 text-white" />}
                          {tag.type === 'tip' && <MessageCircle className="h-3 w-3 text-white" />}
                          {tag.type === 'warning' && <Zap className="h-3 w-3 text-white" />}
                          {tag.type === 'review' && <Star className="h-3 w-3 text-white" />}
                          {tag.type === 'fun' && <Heart className="h-3 w-3 text-white" />}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tag.type === 'secret' ? 'bg-purple-500/20 text-purple-400' :
                          tag.type === 'tip' ? 'bg-blue-500/20 text-blue-400' :
                          tag.type === 'warning' ? 'bg-red-500/20 text-red-400' :
                          tag.type === 'review' ? 'bg-green-500/20 text-green-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {tag.type}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-1">{tag.title}</h3>
                      <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{tag.location} • {tag.distance}km away</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleBookmark(tag.id)}
                      className={`p-2 rounded-full transition-colors ${
                        tag.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${tag.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{tag.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(tag.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          tag.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${tag.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm">{tag.likes}</span>
                      </button>
                      
                      <div className="flex items-center space-x-1 text-gray-400 text-sm">
                        <Eye className="h-4 w-4" />
                        <span>{tag.views}</span>
                      </div>
                      
                      <div className="text-gray-400 text-sm">
                        by {tag.author} • {formatTimeAgo(tag.timestamp)}
                      </div>
                    </div>
                    
                    <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                      View in AR →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'postcards' && (
        <div className="space-y-4">
          {postcards.map((postcard) => (
            <div
              key={postcard.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={postcard.image}
                  alt={postcard.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{postcard.title}</h3>
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>{postcard.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-orange-400 text-sm">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeUntilExpiry(postcard.expiresAt)}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4">{postcard.message}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-400 text-sm">
                      From: {postcard.sender}
                    </div>
                    
                    <div className="flex items-center space-x-1 text-pink-400 text-sm">
                      <Heart className="h-4 w-4" />
                      <span>{postcard.likes}</span>
                    </div>
                  </div>
                  
                  <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                    <Share className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* Create AR Tag */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-6 border border-purple-400/30">
            <div className="text-center mb-4">
              <Eye className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Create AR Tag</h2>
              <p className="text-gray-400 text-sm">Leave a message for future travelers</p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Plus className="h-6 w-6" />
              <span>Create AR Tag</span>
            </button>
          </div>

          {/* Create Postcard */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-6 border border-cyan-400/30">
            <div className="text-center mb-4">
              <Gift className="h-12 w-12 text-cyan-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Send Virtual Postcard</h2>
              <p className="text-gray-400 text-sm">Share a moment with the community</p>
            </div>
            
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <Camera className="h-6 w-6" />
              <span>Create Postcard</span>
            </button>
          </div>
        </div>
      )}

      {/* Create AR Tag Modal */}
      {showCreateModal && (
        <CreateARTagModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreateARTagModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'tip',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating AR tag:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Create AR Tag</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="What's this about?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="tip">Travel Tip</option>
                <option value="secret">Secret Spot</option>
                <option value="warning">Warning</option>
                <option value="review">Review</option>
                <option value="fun">Fun Fact</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                rows={3}
                placeholder="Share your knowledge..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="Where is this?"
                required
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
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Tag
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ARWorldPage;