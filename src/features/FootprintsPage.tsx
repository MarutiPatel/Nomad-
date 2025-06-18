import React, { useState } from 'react';
import { 
  MapPin, Camera, Heart, MessageCircle, Share, Plus, 
  Filter, Search, Map, Grid, List, Clock, Star, Eye,
  Edit, Save, X, Trash2
} from 'lucide-react';

interface Footprint {
  id: string;
  location: string;
  coordinates: { lat: number; lng: number };
  title: string;
  description: string;
  image: string;
  timestamp: Date;
  likes: number;
  comments: number;
  visibility: 'public' | 'private' | 'friends';
  tags: string[];
  isLiked: boolean;
  isEditing?: boolean;
}

function FootprintsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFootprint, setSelectedFootprint] = useState<Footprint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const mockFootprints: Footprint[] = [
    {
      id: '1',
      location: 'Goa Beach, India',
      coordinates: { lat: 15.2993, lng: 74.1240 },
      title: 'Sunset Paradise',
      description: 'Amazing sunset view with fellow travelers. The beach was perfect for evening walks and the local food was incredible!',
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date('2024-01-15T18:30:00'),
      likes: 24,
      comments: 8,
      visibility: 'public',
      tags: ['sunset', 'beach', 'goa', 'peaceful'],
      isLiked: true
    },
    {
      id: '2',
      location: 'Manali, Himachal Pradesh',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      title: 'Mountain Adventure',
      description: 'Trekking through the beautiful mountains of Manali. Met some amazing fellow adventurers here!',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date('2024-01-10T14:20:00'),
      likes: 18,
      comments: 5,
      visibility: 'public',
      tags: ['mountains', 'trekking', 'adventure', 'himachal'],
      isLiked: false
    },
    {
      id: '3',
      location: 'Rishikesh, Uttarakhand',
      coordinates: { lat: 30.0869, lng: 78.2676 },
      title: 'Spiritual Journey',
      description: 'Found peace by the Ganges. The yoga sessions and meditation were life-changing.',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date('2024-01-05T08:15:00'),
      likes: 31,
      comments: 12,
      visibility: 'friends',
      tags: ['spiritual', 'yoga', 'ganges', 'peaceful'],
      isLiked: true
    }
  ];

  const [footprints, setFootprints] = useState(mockFootprints);

  // Interactive Functions
  const handleLike = (id: string) => {
    setFootprints(prev => prev.map(fp => 
      fp.id === id 
        ? { ...fp, isLiked: !fp.isLiked, likes: fp.isLiked ? fp.likes - 1 : fp.likes + 1 }
        : fp
    ));
  };

  const handleEdit = (id: string) => {
    setFootprints(prev => prev.map(fp => 
      fp.id === id ? { ...fp, isEditing: true } : { ...fp, isEditing: false }
    ));
  };

  const handleSave = (id: string, newTitle: string, newDescription: string) => {
    setFootprints(prev => prev.map(fp => 
      fp.id === id 
        ? { ...fp, title: newTitle, description: newDescription, isEditing: false }
        : fp
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this footprint?')) {
      setFootprints(prev => prev.filter(fp => fp.id !== id));
    }
  };

  const handleShare = async (footprint: Footprint) => {
    const shareData = {
      title: footprint.title,
      text: footprint.description,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`${footprint.title} - ${footprint.description}`);
        alert('Footprint copied to clipboard!');
      }
    } catch (error) {
      // Handle permission denied or any other errors
      try {
        await navigator.clipboard.writeText(`${footprint.title} - ${footprint.description}`);
        alert('Footprint copied to clipboard!');
      } catch (clipboardError) {
        // Final fallback if clipboard also fails
        console.error('Share and clipboard both failed:', error, clipboardError);
        alert('Unable to share. Please copy the content manually.');
      }
    }
  };

  const handleAddFootprint = (newFootprint: Omit<Footprint, 'id' | 'likes' | 'comments' | 'isLiked'>) => {
    const footprint: Footprint = {
      ...newFootprint,
      id: Date.now().toString(),
      likes: 0,
      comments: 0,
      isLiked: false
    };
    setFootprints(prev => [footprint, ...prev]);
  };

  const filteredFootprints = footprints.filter(fp => {
    const matchesSearch = fp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fp.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterTag || fp.tags.includes(filterTag);
    return matchesSearch && matchesFilter;
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">My Footprints</h1>
          <p className="text-gray-400 text-sm">Your travel memories and experiences</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Interactive Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search footprints..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="">All Tags</option>
            <option value="beach">Beach</option>
            <option value="mountains">Mountains</option>
            <option value="spiritual">Spiritual</option>
            <option value="adventure">Adventure</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-1 bg-black/20 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'map' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Map className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Footprints Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFootprints.map((footprint) => (
            <FootprintCard
              key={footprint.id}
              footprint={footprint}
              onLike={handleLike}
              onEdit={handleEdit}
              onSave={handleSave}
              onDelete={handleDelete}
              onShare={handleShare}
              onView={setSelectedFootprint}
            />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredFootprints.map((footprint) => (
            <FootprintListItem
              key={footprint.id}
              footprint={footprint}
              onLike={handleLike}
              onEdit={handleEdit}
              onSave={handleSave}
              onDelete={handleDelete}
              onShare={handleShare}
              onView={setSelectedFootprint}
            />
          ))}
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 text-center">
          <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Interactive Map</h3>
          <p className="text-gray-400 text-sm">
            Map view will show all your footprints on an interactive map with clustering and filtering options.
          </p>
        </div>
      )}

      {/* Create Footprint Modal */}
      {showCreateModal && (
        <CreateFootprintModal 
          onClose={() => setShowCreateModal(false)}
          onAdd={handleAddFootprint}
        />
      )}

      {/* View Footprint Modal */}
      {selectedFootprint && (
        <ViewFootprintModal
          footprint={selectedFootprint}
          onClose={() => setSelectedFootprint(null)}
          onLike={handleLike}
          onShare={handleShare}
        />
      )}
    </div>
  );
}

function FootprintCard({ 
  footprint, 
  onLike, 
  onEdit, 
  onSave, 
  onDelete, 
  onShare, 
  onView 
}: {
  footprint: Footprint;
  onLike: (id: string) => void;
  onEdit: (id: string) => void;
  onSave: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
  onShare: (footprint: Footprint) => void;
  onView: (footprint: Footprint) => void;
}) {
  const [editTitle, setEditTitle] = useState(footprint.title);
  const [editDescription, setEditDescription] = useState(footprint.description);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-105">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={footprint.image}
          alt={footprint.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            footprint.visibility === 'public' 
              ? 'bg-green-500/20 text-green-400 border border-green-400/30'
              : footprint.visibility === 'friends'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
              : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
          }`}>
            <Eye className="h-3 w-3 inline mr-1" />
            {footprint.visibility}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            {footprint.isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-2 py-1 bg-black/20 border border-white/10 rounded text-white text-lg font-semibold focus:border-cyan-400 focus:outline-none"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-2 py-1 bg-black/20 border border-white/10 rounded text-gray-300 text-sm resize-none focus:border-cyan-400 focus:outline-none"
                  rows={3}
                />
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-white mb-1">{footprint.title}</h3>
                <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
                  <MapPin className="h-3 w-3" />
                  <span>{footprint.location}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-1 text-gray-400 text-xs">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(footprint.timestamp)}</span>
          </div>
        </div>

        {!footprint.isEditing && (
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{footprint.description}</p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {footprint.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {footprint.isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={() => onSave(footprint.id, editTitle, editDescription)}
                className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
              >
                <Save className="h-3 w-3" />
                <span>Save</span>
              </button>
              <button
                onClick={() => onEdit(footprint.id)}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-lg text-sm hover:bg-gray-500/30 transition-colors"
              >
                <X className="h-3 w-3" />
                <span>Cancel</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onLike(footprint.id)}
                className={`flex items-center space-x-1 transition-colors ${
                  footprint.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                }`}
              >
                <Heart className={`h-4 w-4 ${footprint.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{footprint.likes}</span>
              </button>
              
              <button 
                onClick={() => onView(footprint)}
                className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{footprint.comments}</span>
              </button>
            </div>
          )}
          
          {!footprint.isEditing && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(footprint.id)}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onShare(footprint)}
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <Share className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(footprint.id)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FootprintListItem({ 
  footprint, 
  onLike, 
  onEdit, 
  onSave, 
  onDelete, 
  onShare, 
  onView 
}: {
  footprint: Footprint;
  onLike: (id: string) => void;
  onEdit: (id: string) => void;
  onSave: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
  onShare: (footprint: Footprint) => void;
  onView: (footprint: Footprint) => void;
}) {
  const [editTitle, setEditTitle] = useState(footprint.title);
  const [editDescription, setEditDescription] = useState(footprint.description);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300">
      <div className="flex items-start space-x-4">
        <img
          src={footprint.image}
          alt={footprint.title}
          className="w-16 h-16 rounded-xl object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              {footprint.isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-2 py-1 bg-black/20 border border-white/10 rounded text-white text-lg font-semibold focus:border-cyan-400 focus:outline-none"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-2 py-1 bg-black/20 border border-white/10 rounded text-gray-300 text-sm resize-none focus:border-cyan-400 focus:outline-none"
                    rows={2}
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-white">{footprint.title}</h3>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <MapPin className="h-3 w-3" />
                    <span>{footprint.location}</span>
                  </div>
                </>
              )}
            </div>
            <span className="text-xs text-gray-400">{formatTimeAgo(footprint.timestamp)}</span>
          </div>
          
          {!footprint.isEditing && (
            <p className="text-gray-300 text-sm mb-2">{footprint.description}</p>
          )}
          
          <div className="flex items-center justify-between">
            {footprint.isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => onSave(footprint.id, editTitle, editDescription)}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                >
                  <Save className="h-3 w-3" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => onEdit(footprint.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-lg text-sm hover:bg-gray-500/30 transition-colors"
                >
                  <X className="h-3 w-3" />
                  <span>Cancel</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onLike(footprint.id)}
                  className={`flex items-center space-x-1 transition-colors ${
                    footprint.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${footprint.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{footprint.likes}</span>
                </button>
                
                <button 
                  onClick={() => onView(footprint)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{footprint.comments}</span>
                </button>
              </div>
            )}
            
            {!footprint.isEditing && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                footprint.visibility === 'public' 
                  ? 'bg-green-500/20 text-green-400'
                  : footprint.visibility === 'friends'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {footprint.visibility}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateFootprintModal({ 
  onClose, 
  onAdd 
}: { 
  onClose: () => void;
  onAdd: (footprint: Omit<Footprint, 'id' | 'likes' | 'comments' | 'isLiked'>) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    visibility: 'public' as 'public' | 'private' | 'friends',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFootprint = {
      ...formData,
      coordinates: { lat: 0, lng: 0 }, // Would be set by geolocation
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date(),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onAdd(newFootprint);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Drop a Footprint</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="Give your footprint a title"
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
                placeholder="Where are you?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                rows={3}
                placeholder="Share your experience..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="adventure, beach, food (comma separated)"
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
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Drop Footprint
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ViewFootprintModal({ 
  footprint, 
  onClose, 
  onLike, 
  onShare 
}: { 
  footprint: Footprint; 
  onClose: () => void;
  onLike: (id: string) => void;
  onShare: (footprint: Footprint) => void;
}) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{footprint.title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="mb-4">
            <img
              src={footprint.image}
              alt={footprint.title}
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Description</h3>
              <p className="text-gray-300 text-sm">{footprint.description}</p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Location</h3>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{footprint.location}</span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Posted</h3>
              <p className="text-gray-300 text-sm">{formatTimeAgo(footprint.timestamp)}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {footprint.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onLike(footprint.id)}
                  className={`flex items-center space-x-1 transition-colors ${
                    footprint.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${footprint.isLiked ? 'fill-current' : ''}`} />
                  <span>{footprint.likes}</span>
                </button>
                
                <div className="flex items-center space-x-1 text-gray-400">
                  <MessageCircle className="h-5 w-5" />
                  <span>{footprint.comments}</span>
                </div>
              </div>
              
              <button
                onClick={() => onShare(footprint)}
                className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl text-white text-sm font-medium hover:shadow-lg transition-all duration-300"
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FootprintsPage;