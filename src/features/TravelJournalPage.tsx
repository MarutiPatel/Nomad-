import React, { useState } from 'react';
import { 
  BookOpen, Camera, Mic, MapPin, Calendar, Heart, Star, 
  Plus, Filter, Search, Play, Pause, Volume2, VolumeX,
  Edit, Save, X, Image, Video, FileText, Clock, Eye
} from 'lucide-react';

import { useScreenshotProtection } from '../contexts/ScreenshotProtectionContext';
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  location: string;
  coordinates: { lat: number; lng: number };
  date: Date;
  mood: 'happy' | 'excited' | 'peaceful' | 'adventurous' | 'reflective' | 'grateful';
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  mediaType: 'photo' | 'video' | 'voice' | 'text';
  mediaUrl?: string;
  tags: string[];
  isPrivate: boolean;
  likes: number;
  isLiked: boolean;
  // MindSpace features
  emotionalState: {
    energy: number; // 1-5
    happiness: number; // 1-5
    stress: number; // 1-5
    inspiration: number; // 1-5
    loneliness: number; // 1-5
  };
  mindfulnessNote?: string;
  gratitudeList?: string[];
}

function TravelJournalPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isContentBlurred } = useScreenshotProtection();
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const mockEntries: JournalEntry[] = [
    {
      id: '1',
      title: 'First Day in Goa',
      content: 'The beach is absolutely stunning! Met some amazing fellow travelers at the sunset point. The local food is incredible - had the best fish curry of my life.',
      location: 'Anjuna Beach, Goa',
      coordinates: { lat: 15.5736, lng: 73.7370 },
      date: new Date('2024-01-15'),
      mood: 'excited',
      weather: 'sunny',
      mediaType: 'photo',
      mediaUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['beach', 'sunset', 'food', 'friends'],
      isPrivate: false,
      likes: 12,
      isLiked: true,
      emotionalState: {
        energy: 5,
        happiness: 5,
        stress: 1,
        inspiration: 4,
        loneliness: 1
      },
      mindfulnessNote: 'The sound of waves washing away all worries. Living in the present moment.',
      gratitudeList: ['Amazing sunset', 'New friendships', 'Delicious food', 'Safe travels']
    },
    {
      id: '2',
      title: 'Mountain Meditation',
      content: 'Voice note from the peak - the silence here is profound.',
      location: 'Triund, Himachal Pradesh',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      date: new Date('2024-01-10'),
      mood: 'peaceful',
      weather: 'cloudy',
      mediaType: 'voice',
      tags: ['mountains', 'meditation', 'peace'],
      isPrivate: true,
      likes: 0,
      isLiked: false,
      emotionalState: {
        energy: 3,
        happiness: 4,
        stress: 1,
        inspiration: 5,
        loneliness: 2
      },
      mindfulnessNote: 'Complete silence except for my own breathing. Profound sense of connection with nature.',
      gratitudeList: ['Mountain serenity', 'Fresh air', 'Physical strength', 'Inner peace']
    }
  ];

  const [entries] = useState(mockEntries);

  const moodEmojis = {
    happy: '😊',
    excited: '🤩',
    peaceful: '😌',
    adventurous: '🤠',
    reflective: '🤔',
    grateful: '🙏'
  };

  const weatherIcons = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    windy: '💨'
  };

  const handleLike = (id: string) => {
    // Handle like functionality
    console.log('Liked entry:', id);
  };

  const toggleAudio = (entryId: string) => {
    if (playingAudio === entryId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(entryId);
    }
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Travel Journal</h1>
          <p className="text-gray-400 text-sm">Your private travel memories</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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

      {/* Journal Entries */}
      <div className={`space-y-4 ${isContentBlurred ? 'blur-sensitive' : ''}`}>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
          >
            {/* Media Preview */}
            {entry.mediaUrl && entry.mediaType === 'photo' && (
              <div className="h-48 overflow-hidden">
                <img
                  src={entry.mediaUrl}
                  alt={entry.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{entry.title}</h3>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{entry.location}</span>
                    <span>•</span>
                    <Calendar className="h-3 w-3" />
                    <span>{entry.date.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{moodEmojis[entry.mood]}</span>
                  <span className="text-lg">{weatherIcons[entry.weather]}</span>
                  {entry.isPrivate && (
                    <div className="bg-purple-500/20 p-1 rounded-full">
                      <Eye className="h-3 w-3 text-purple-400" />
                    </div>
                    )
                  )}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-3">{entry.content}</p>

              {/* Voice Note Player */}
              {entry.mediaType === 'voice' && (
                <div className="bg-black/20 rounded-xl p-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleAudio(entry.id)}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center"
                    >
                      {playingAudio === entry.id ? (
                        <Pause className="h-5 w-5 text-white" />
                      ) : (
                        <Play className="h-5 w-5 text-white ml-1" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="w-1/3 h-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full"></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">2:34</span>
                  </div>
                </div>
              )}

              {/* MindSpace Emotional State */}
              {entry.emotionalState && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-3 mb-3 border border-purple-400/30">
                  <h4 className="text-purple-400 font-medium text-xs mb-2">Emotional State</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Energy</span>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${
                            i <= entry.emotionalState.energy ? 'bg-yellow-400' : 'bg-gray-600'
                          }`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Happiness</span>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${
                            i <= entry.emotionalState.happiness ? 'bg-pink-400' : 'bg-gray-600'
                          }`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Stress</span>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${
                            i <= entry.emotionalState.stress ? 'bg-red-400' : 'bg-gray-600'
                          }`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Inspiration</span>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${
                            i <= entry.emotionalState.inspiration ? 'bg-cyan-400' : 'bg-gray-600'
                          }`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mindfulness & Gratitude */}
              {entry.mindfulnessNote && (
                <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl p-3 mb-3 border border-green-400/30">
                  <h4 className="text-green-400 font-medium text-xs mb-2">Mindful Moment</h4>
                  <p className="text-green-300 text-xs italic">"{entry.mindfulnessNote}"</p>
                </div>
              )}

              {entry.gratitudeList && entry.gratitudeList.length > 0 && (
                <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl p-3 mb-3 border border-orange-400/30">
                  <h4 className="text-orange-400 font-medium text-xs mb-2">Grateful For</h4>
                  <div className="flex flex-wrap gap-1">
                    {entry.gratitudeList.slice(0, 3).map((item, index) => (
                      <span key={index} className="text-orange-300 text-xs bg-orange-500/20 px-2 py-1 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {entry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-xs text-blue-400 border border-blue-400/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(entry.id)}
                    className={`flex items-center space-x-1 transition-colors ${
                      entry.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${entry.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{entry.likes}</span>
                  </button>
                  
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <Clock className="h-3 w-3" />
                    <span>{entry.date.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedEntry(entry)}
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateJournalModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* View Modal */}
      {selectedEntry && (
        <ViewJournalModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
}

function CreateJournalModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    mood: 'happy' as const,
    weather: 'sunny' as const,
    mediaType: 'text' as const,
    tags: '',
    isPrivate: false,
    // MindSpace emotional tracking
    energy: 3,
    happiness: 3,
    stress: 3,
    inspiration: 3,
    loneliness: 3,
    mindfulnessNote: '',
    gratitudeItems: ''
  });

  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating journal entry:', formData);
    onClose();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setFormData(prev => ({ ...prev, mediaType: 'voice' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">New Journal Entry</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="What happened today?"
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="happy">😊 Happy</option>
                  <option value="excited">🤩 Excited</option>
                  <option value="peaceful">😌 Peaceful</option>
                  <option value="adventurous">🤠 Adventurous</option>
                  <option value="reflective">🤔 Reflective</option>
                  <option value="grateful">🙏 Grateful</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Weather</label>
                <select
                  value={formData.weather}
                  onChange={(e) => setFormData(prev => ({ ...prev, weather: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="sunny">☀️ Sunny</option>
                  <option value="cloudy">☁️ Cloudy</option>
                  <option value="rainy">🌧️ Rainy</option>
                  <option value="snowy">❄️ Snowy</option>
                  <option value="windy">💨 Windy</option>
                </select>
              </div>
            </div>

            {/* Media Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Media Type</label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mediaType: 'text' }))}
                  className={`flex-1 p-3 rounded-xl border transition-colors ${
                    formData.mediaType === 'text'
                      ? 'bg-blue-500/20 border-blue-400/30 text-blue-400'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <FileText className="h-5 w-5 mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mediaType: 'photo' }))}
                  className={`flex-1 p-3 rounded-xl border transition-colors ${
                    formData.mediaType === 'photo'
                      ? 'bg-green-500/20 border-green-400/30 text-green-400'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <Camera className="h-5 w-5 mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`flex-1 p-3 rounded-xl border transition-colors ${
                    formData.mediaType === 'voice' || isRecording
                      ? 'bg-red-500/20 border-red-400/30 text-red-400'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <Mic className={`h-5 w-5 mx-auto ${isRecording ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                rows={4}
                placeholder="Share your thoughts and experiences..."
                required
              />
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

            {/* MindSpace Emotional Tracking */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30">
              <h3 className="text-purple-400 font-medium mb-3">How are you feeling here?</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-purple-300 mb-2">Energy Level</label>
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, energy: level }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          level <= formData.energy
                            ? 'bg-yellow-400 border-yellow-400'
                            : 'border-gray-600 hover:border-yellow-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900">{level}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-purple-300 mb-2">Happiness</label>
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, happiness: level }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          level <= formData.happiness
                            ? 'bg-pink-400 border-pink-400'
                            : 'border-gray-600 hover:border-pink-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">{level}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-purple-300 mb-2">Stress Level</label>
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, stress: level }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          level <= formData.stress
                            ? 'bg-red-400 border-red-400'
                            : 'border-gray-600 hover:border-red-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">{level}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-purple-300 mb-2">Inspiration</label>
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, inspiration: level }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          level <= formData.inspiration
                            ? 'bg-cyan-400 border-cyan-400'
                            : 'border-gray-600 hover:border-cyan-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900">{level}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mindfulness & Gratitude */}
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl p-4 border border-green-400/30">
              <h3 className="text-green-400 font-medium mb-3">Mindful Moment</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-green-300 mb-2">Present Moment Observation</label>
                  <textarea
                    value={formData.mindfulnessNote}
                    onChange={(e) => setFormData(prev => ({ ...prev, mindfulnessNote: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-green-400/30 rounded-2xl text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none resize-none"
                    rows={2}
                    placeholder="What do you notice right now? Sounds, smells, feelings..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-green-300 mb-2">Things I'm Grateful For</label>
                  <input
                    type="text"
                    value={formData.gratitudeItems}
                    onChange={(e) => setFormData(prev => ({ ...prev, gratitudeItems: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-green-400/30 rounded-2xl text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none"
                    placeholder="Beautiful view, kind stranger, safe journey (comma separated)"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isPrivate"
                checked={formData.isPrivate}
                onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                className="w-4 h-4 text-purple-600 bg-black/20 border-white/10 rounded focus:ring-purple-500"
              />
              <label htmlFor="isPrivate" className="text-sm text-gray-300">
                Keep this entry private
              </label>
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
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ViewJournalModal({ entry, onClose }: { entry: JournalEntry; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{entry.title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {entry.mediaUrl && entry.mediaType === 'photo' && (
            <div className="mb-4">
              <img
                src={entry.mediaUrl}
                alt={entry.title}
                className="w-full h-48 object-cover rounded-2xl"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Entry</h3>
              <p className="text-gray-300 text-sm">{entry.content}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-medium mb-2">Location</h3>
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{entry.location}</span>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Date</h3>
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{entry.date.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-white font-medium mb-2">Mood</h3>
                <span className="text-2xl">{entry.mood === 'happy' ? '😊' : entry.mood === 'excited' ? '🤩' : '😌'}</span>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Weather</h3>
                <span className="text-2xl">{entry.weather === 'sunny' ? '☀️' : entry.weather === 'cloudy' ? '☁️' : '🌧️'}</span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-xs text-blue-400 border border-blue-400/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelJournalPage;