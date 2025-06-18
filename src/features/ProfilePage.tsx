import React, { useState } from 'react';
import { 
  User, Edit, Settings, Shield, Eye, EyeOff, MapPin, 
  Calendar, Globe, Heart, Star, Trophy, Camera, Save, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isGhostMode, setIsGhostMode] = useState(false);
  
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    bio: '',
    travelStyle: user?.travelStyle || 'Explorer',
    interests: [] as string[],
    languages: [] as string[]
  });

  const travelStyles = [
    'Explorer', 'Adventure Seeker', 'Nature Lover', 'Cultural Enthusiast',
    'Digital Nomad', 'Budget Traveler', 'Luxury Traveler', 'Solo Wanderer',
    'Group Traveler', 'Spiritual Seeker'
  ];

  const availableInterests = [
    'Photography', 'Hiking', 'Food', 'Art', 'Music', 'History',
    'Architecture', 'Wildlife', 'Beaches', 'Mountains', 'Cities',
    'Festivals', 'Nightlife', 'Yoga', 'Meditation', 'Surfing'
  ];

  const availableLanguages = [
    'English', 'Hindi', 'Spanish', 'French', 'German', 'Italian',
    'Portuguese', 'Japanese', 'Chinese', 'Arabic', 'Russian'
  ];

  const handleSave = () => {
    updateProfile({
      displayName: editForm.displayName,
      travelStyle: editForm.travelStyle
    });
    setIsEditing(false);
  };

  const toggleInterest = (interest: string) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleLanguage = (language: string) => {
    setEditForm(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsGhostMode(!isGhostMode)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium transition-colors ${
              isGhostMode
                ? 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                : 'bg-white/10 text-gray-400 border border-white/10'
            }`}
          >
            {isGhostMode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            <span>{isGhostMode ? 'Ghost Mode' : 'Visible'}</span>
          </button>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isEditing ? <X className="h-4 w-4 text-gray-400" /> : <Edit className="h-4 w-4 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 mb-6">
        {/* Avatar Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-white" />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-full shadow-lg">
                <Camera className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
          
          {isEditing ? (
            <input
              type="text"
              value={editForm.displayName}
              onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
              className="text-xl font-bold text-white bg-transparent border-b border-white/20 focus:border-cyan-400 focus:outline-none text-center"
            />
          ) : (
            <h2 className="text-xl font-bold text-white">{user?.displayName}</h2>
          )}
          
          <div className="flex items-center justify-center space-x-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-gray-400 text-sm">Active Traveler</span>
          </div>
        </div>

        {/* Travel Style */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Travel Style</h3>
          {isEditing ? (
            <select
              value={editForm.travelStyle}
              onChange={(e) => setEditForm(prev => ({ ...prev, travelStyle: e.target.value }))}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
            >
              {travelStyles.map(style => (
                <option key={style} value={style} className="bg-slate-800">{style}</option>
              ))}
            </select>
          ) : (
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-purple-400 border border-purple-400/30">
              {user?.travelStyle}
            </span>
          )}
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Bio</h3>
          {isEditing ? (
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell fellow travelers about yourself..."
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
              rows={3}
            />
          ) : (
            <p className="text-gray-300 text-sm">
              {editForm.bio || "No bio added yet. Share something about your travel style!"}
            </p>
          )}
        </div>

        {/* Interests */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Interests</h3>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {availableInterests.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    editForm.interests.includes(interest)
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-400/30'
                      : 'bg-white/10 text-gray-400 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {editForm.interests.length > 0 ? (
                editForm.interests.map(interest => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No interests added yet</span>
              )}
            </div>
          )}
        </div>

        {/* Languages */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Languages</h3>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {availableLanguages.map(language => (
                <button
                  key={language}
                  onClick={() => toggleLanguage(language)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    editForm.languages.includes(language)
                      ? 'bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-400 border border-green-400/30'
                      : 'bg-white/10 text-gray-400 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {editForm.languages.length > 0 ? (
                editForm.languages.map(language => (
                  <span
                    key={language}
                    className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full text-xs text-green-400 border border-green-400/30"
                  >
                    {language}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No languages added yet</span>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>Save Changes</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 text-center">
          <div className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">12</div>
          <div className="text-xs text-gray-400">Footprints</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 text-center">
          <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">5</div>
          <div className="text-xs text-gray-400">Connections</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 text-center">
          <div className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">3</div>
          <div className="text-xs text-gray-400">Cities</div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Shield className="h-5 w-5 text-green-400" />
          <span className="text-green-400 font-medium">Privacy Settings</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Profile Visibility</span>
            <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-400/30">
              Friends Only
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Location Sharing</span>
            <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-400/30">
              Approximate
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Message History</span>
            <button className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs border border-orange-400/30">
              Auto-Delete
            </button>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <span className="text-white font-medium">Travel Achievements</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-3 border border-yellow-400/30">
            <Star className="h-6 w-6 text-yellow-400 mb-2" />
            <div className="text-sm font-medium text-yellow-400">Explorer</div>
            <div className="text-xs text-gray-400">Visit 10 cities</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl p-3 border border-green-400/30">
            <Heart className="h-6 w-6 text-green-400 mb-2" />
            <div className="text-sm font-medium text-green-400">Connector</div>
            <div className="text-xs text-gray-400">Make 5 connections</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;