import React, { useState } from 'react';
import { 
  Clock, MapPin, Calendar, Lock, Unlock, Camera, Mic, 
  Video, Image, Plus, Filter, Search, Star, Heart
} from 'lucide-react';

interface TimeCapsule {
  id: string;
  title: string;
  content: string;
  mediaType: 'photo' | 'video' | 'voice' | 'text';
  mediaUrl?: string;
  location: string;
  coordinates: { lat: number; lng: number };
  unlockType: 'date' | 'location' | 'both';
  unlockDate?: Date;
  unlockLocation?: string;
  isLocked: boolean;
  createdAt: Date;
  tags: string[];
}

function TimeCapsulePage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);

  const mockCapsules: TimeCapsule[] = [
    {
      id: '1',
      title: 'Goa Sunset Memory',
      content: 'The most beautiful sunset I\'ve ever seen. Hope to return here someday.',
      mediaType: 'photo',
      mediaUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Anjuna Beach, Goa',
      coordinates: { lat: 15.5736, lng: 73.7370 },
      unlockType: 'date',
      unlockDate: new Date('2025-06-15'),
      isLocked: true,
      createdAt: new Date('2024-01-15'),
      tags: ['sunset', 'beach', 'peaceful']
    },
    {
      id: '2',
      title: 'Mountain Adventure',
      content: 'Voice note from the peak of my first Himalayan trek.',
      mediaType: 'voice',
      location: 'Triund, Himachal Pradesh',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      unlockType: 'location',
      unlockLocation: 'Triund Trek Base',
      isLocked: false,
      createdAt: new Date('2024-01-10'),
      tags: ['mountains', 'achievement', 'trek']
    }
  ];

  const [capsules] = useState(mockCapsules);

  const formatTimeUntilUnlock = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 0) return 'Ready to unlock!';
    if (diffInDays === 1) return '1 day remaining';
    return `${diffInDays} days remaining`;
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Time Capsules</h1>
          <p className="text-gray-400 text-sm">Memories locked in time and space</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-orange-500 to-pink-500 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
      </div>

      {/* Capsules Grid */}
      <div className="space-y-4">
        {capsules.map((capsule) => (
          <div
            key={capsule.id}
            className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
          >
            {/* Media Preview */}
            {capsule.mediaUrl && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={capsule.mediaUrl}
                  alt={capsule.title}
                  className={`w-full h-full object-cover ${capsule.isLocked ? 'blur-sm' : ''}`}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  {capsule.isLocked ? (
                    <Lock className="h-12 w-12 text-white" />
                  ) : (
                    <Unlock className="h-12 w-12 text-green-400" />
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{capsule.title}</h3>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{capsule.location}</span>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  capsule.isLocked 
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30'
                    : 'bg-green-500/20 text-green-400 border border-green-400/30'
                }`}>
                  {capsule.isLocked ? 'Locked' : 'Unlocked'}
                </div>
              </div>

              <p className={`text-gray-300 text-sm mb-3 ${capsule.isLocked ? 'blur-sm' : ''}`}>
                {capsule.content}
              </p>

              {/* Unlock Info */}
              <div className="bg-black/20 rounded-xl p-3 mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400 text-sm font-medium">
                    {capsule.unlockType === 'date' ? 'Time Lock' : 
                     capsule.unlockType === 'location' ? 'Location Lock' : 'Dual Lock'}
                  </span>
                </div>
                
                {capsule.unlockType === 'date' && capsule.unlockDate && (
                  <div className="text-gray-300 text-xs">
                    Unlocks: {capsule.unlockDate.toLocaleDateString()}
                    <br />
                    {capsule.isLocked && (
                      <span className="text-orange-400">
                        {formatTimeUntilUnlock(capsule.unlockDate)}
                      </span>
                    )}
                  </div>
                )}
                
                {capsule.unlockType === 'location' && (
                  <div className="text-gray-300 text-xs">
                    Unlocks at: {capsule.unlockLocation}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {capsule.tags.map((tag, index) => (
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
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    capsule.mediaType === 'photo' ? 'bg-blue-500/20' :
                    capsule.mediaType === 'video' ? 'bg-red-500/20' :
                    capsule.mediaType === 'voice' ? 'bg-green-500/20' :
                    'bg-gray-500/20'
                  }`}>
                    {capsule.mediaType === 'photo' && <Camera className="h-3 w-3 text-blue-400" />}
                    {capsule.mediaType === 'video' && <Video className="h-3 w-3 text-red-400" />}
                    {capsule.mediaType === 'voice' && <Mic className="h-3 w-3 text-green-400" />}
                  </div>
                  <span className="text-xs text-gray-400 capitalize">{capsule.mediaType}</span>
                </div>
                
                <button
                  onClick={() => setSelectedCapsule(capsule)}
                  disabled={capsule.isLocked}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    capsule.isLocked
                      ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg'
                  }`}
                >
                  {capsule.isLocked ? 'Locked' : 'Open'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateCapsuleModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* View Modal */}
      {selectedCapsule && !selectedCapsule.isLocked && (
        <ViewCapsuleModal
          capsule={selectedCapsule}
          onClose={() => setSelectedCapsule(null)}
        />
      )}
    </div>
  );
}

function CreateCapsuleModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    unlockType: 'date' as 'date' | 'location' | 'both',
    unlockDate: '',
    unlockLocation: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating time capsule:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Create Time Capsule</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="Name your memory"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Memory</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                rows={3}
                placeholder="Describe this moment..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Unlock Type</label>
              <select
                value={formData.unlockType}
                onChange={(e) => setFormData(prev => ({ ...prev, unlockType: e.target.value as any }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="date">Date Lock</option>
                <option value="location">Location Lock</option>
                <option value="both">Both Date & Location</option>
              </select>
            </div>

            {(formData.unlockType === 'date' || formData.unlockType === 'both') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Unlock Date</label>
                <input
                  type="date"
                  value={formData.unlockDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, unlockDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
            )}

            {(formData.unlockType === 'location' || formData.unlockType === 'both') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Unlock Location</label>
                <input
                  type="text"
                  value={formData.unlockLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, unlockLocation: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  placeholder="Where should this unlock?"
                  required
                />
              </div>
            )}

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
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Capsule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ViewCapsuleModal({ capsule, onClose }: { capsule: TimeCapsule; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{capsule.title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>

          {capsule.mediaUrl && (
            <div className="mb-4">
              <img
                src={capsule.mediaUrl}
                alt={capsule.title}
                className="w-full h-48 object-cover rounded-2xl"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Memory</h3>
              <p className="text-gray-300 text-sm">{capsule.content}</p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Location</h3>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{capsule.location}</span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Created</h3>
              <p className="text-gray-300 text-sm">{capsule.createdAt.toLocaleDateString()}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {capsule.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeCapsulePage;