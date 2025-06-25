import React, { useState, useEffect } from 'react';
import { 
  User, Edit, Settings, Shield, Eye, EyeOff, MapPin, 
  Calendar, Globe, Heart, Star, Trophy, Camera, Save, X, Radar, Crown, Users, MessageCircle, Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [chatInvitesEnabled, setChatInvitesEnabled] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [locationPrecision, setLocationPrecision] = useState<'precise' | 'approximate'>('approximate');
  
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    travelStyle: 'Explorer',
    interests: [] as string[],
    languages: [] as string[]
  });

  // Initialize form data with user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setEditForm({
        displayName: user.displayName || '',
        bio: user.bio || '',
        travelStyle: user.travelStyle || 'Explorer',
        interests: user.interests || [],
        languages: user.languages || []
      });
      setIsGhostMode(!user.isRadarVisible);
      setChatInvitesEnabled(user.canReceiveChatInvites ?? true);
      setProfileVisibility(user.profileVisibility || 'public');
      setLocationPrecision(user.locationSharingPrecision || 'approximate');
    }
  }, [user]);

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
    // Save all form data to user profile
    updateProfile({
      displayName: editForm.displayName,
      bio: editForm.bio,
      travelStyle: editForm.travelStyle,
      interests: editForm.interests,
      languages: editForm.languages
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setEditForm({
        displayName: user.displayName || '',
        bio: user.bio || '',
        travelStyle: user.travelStyle || 'Explorer',
        interests: user.interests || [],
        languages: user.languages || []
      });
    }
    setIsEditing(false);
  };

  const toggleRadarVisibility = () => {
    const newVisibility = !user?.isRadarVisible;
    setIsGhostMode(!newVisibility);
    updateProfile({ isRadarVisible: newVisibility });
  };

  const toggleChatInvites = () => {
    const newSetting = !chatInvitesEnabled;
    setChatInvitesEnabled(newSetting);
    updateProfile({ canReceiveChatInvites: newSetting });
  };

  const updateProfileVisibility = (visibility: 'public' | 'friends' | 'private') => {
    setProfileVisibility(visibility);
    updateProfile({ profileVisibility: visibility });
  };

  const updateLocationPrecision = (precision: 'precise' | 'approximate') => {
    setLocationPrecision(precision);
    updateProfile({ locationSharingPrecision: precision });
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

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleRadarVisibility}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium transition-colors ${
              isGhostMode
                ? 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                : 'bg-green-500/20 text-green-400 border border-green-400/30'
            }`}
          >
            {isGhostMode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            <span>{isGhostMode ? 'Ghost Mode' : 'Visible'}</span>
          </button>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Edit className="h-4 w-4 text-gray-400" />
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Ghost Mode Info */}
      {isGhostMode && (
        <div className="bg-purple-500/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <EyeOff className="h-5 w-5 text-purple-400" />
            <span className="text-purple-400 font-medium">Ghost Mode Active</span>
          </div>
          <p className="text-purple-300 text-sm">
            You're invisible on Buddy Radar. Other travelers won't see you in their nearby search.
          </p>
        </div>
      )}

      {/* Creator Dashboard */}
      {user?.isCreator && (
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Crown className="h-6 w-6 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Creator Dashboard</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {user.creatorContent?.followers || 0}
              </div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {user.creatorContent?.guides || 0}
              </div>
              <div className="text-xs text-gray-400">Travel Guides</div>
            </div>
          </div>
          
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 rounded-2xl font-medium text-white hover:shadow-lg transition-all duration-300">
            Manage Creator Content
          </button>
        </div>
      )}

      {/* Trust Score Display */}
      <div className="bg-gradient-to-r from-green-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-6 w-6 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Trust & Reputation</h2>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400 font-medium">Trust Score</span>
            <span className={`text-2xl font-bold ${
              (user?.trustScore || 0) >= 80 ? 'text-green-400' :
              (user?.trustScore || 0) >= 60 ? 'text-yellow-400' :
              'text-orange-400'
            }`}>
              {user?.trustScore || 0}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full">
            <div
              className={`h-3 rounded-full ${
                (user?.trustScore || 0) >= 80 ? 'bg-gradient-to-r from-green-400 to-teal-500' :
                (user?.trustScore || 0) >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                'bg-gradient-to-r from-orange-400 to-red-500'
              }`}
              style={{ width: `${user?.trustScore || 0}%` }}
            />
          </div>
        </div>
        
        <div className="text-sm text-gray-300 mb-4">
          Trust circles: {user?.trustCircles?.length || 0}
        </div>
        
        <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 px-4 py-3 rounded-2xl font-medium text-white hover:shadow-lg transition-all duration-300">
          Build Trust Network
        </button>
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
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              className="text-xl font-bold text-white bg-transparent border-b border-white/20 focus:border-cyan-400 focus:outline-none text-center"
              placeholder="Enter display name"
            />
          ) : (
            <h2 className="text-xl font-bold text-white">{editForm.displayName}</h2>
          )}
          
          <div className="flex items-center justify-center space-x-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isGhostMode ? 'bg-purple-400' : 'bg-green-400'}`}></div>
            <span className={`text-sm ${isGhostMode ? 'text-purple-400' : 'text-green-400'}`}>
              {isGhostMode ? 'Ghost Mode' : 'Active Traveler'}
            </span>
          </div>
        </div>

        {/* Travel Style */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Travel Style</h3>
          {isEditing ? (
            <select
              value={editForm.travelStyle}
              onChange={(e) => handleInputChange('travelStyle', e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
            >
              {travelStyles.map(style => (
                <option key={style} value={style} className="bg-slate-800">{style}</option>
              ))}
            </select>
          ) : (
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-purple-400 border border-purple-400/30">
              {editForm.travelStyle}
            </span>
          )}
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Bio</h3>
          {isEditing ? (
            <textarea
              value={editForm.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
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
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 text-center">
          <div className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {user?.footprints || 0}
          </div>
          <div className="text-xs text-gray-400">Footprints</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 text-center">
          <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            {user?.connections || 0}
          </div>
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
            <div className="flex items-center space-x-2">
              <Radar className="h-4 w-4 text-gray-300" />
              <span className="text-gray-300 text-sm">Buddy Radar Visibility</span>
            </div>
            <button 
              onClick={toggleRadarVisibility}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                user?.isRadarVisible
                  ? 'bg-green-500/20 text-green-400 border-green-400/30'
                  : 'bg-purple-500/20 text-purple-400 border-purple-400/30'
              }`}
            >
              {user?.isRadarVisible ? 'Visible' : 'Ghost Mode'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-300" />
              <span className="text-gray-300 text-sm">Profile Visibility</span>
            </div>
            <select
              value={profileVisibility}
              onChange={(e) => updateProfileVisibility(e.target.value as any)}
              className="px-3 py-1 bg-black/20 border border-white/10 rounded-full text-xs text-gray-300 focus:border-cyan-400 focus:outline-none"
            >
              <option value="public" className="bg-slate-800">Public</option>
              <option value="friends" className="bg-slate-800">Friends Only</option>
              <option value="private" className="bg-slate-800">Private</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-300" />
              <span className="text-gray-300 text-sm">Location Sharing</span>
            </div>
            <select
              value={locationPrecision}
              onChange={(e) => updateLocationPrecision(e.target.value as any)}
              className="px-3 py-1 bg-black/20 border border-white/10 rounded-full text-xs text-gray-300 focus:border-cyan-400 focus:outline-none"
            >
              <option value="approximate" className="bg-slate-800">Approximate</option>
              <option value="precise" className="bg-slate-800">Precise</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-gray-300" />
              <span className="text-gray-300 text-sm">Allow Chat Invitations</span>
            </div>
            <button 
              onClick={toggleChatInvites}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                chatInvitesEnabled
                  ? 'bg-green-500/20 text-green-400 border-green-400/30'
                  : 'bg-red-500/20 text-red-400 border-red-400/30'
              }`}
            >
              {chatInvitesEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-300" />
              <span className="text-gray-300 text-sm">Message History</span>
            </div>
            <button className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs border border-orange-400/30">
              Auto-Delete
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-300" />
              <span className="text-gray-300 text-sm">Show to Same City Only</span>
            </div>
            <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-400/30">
              Enabled
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