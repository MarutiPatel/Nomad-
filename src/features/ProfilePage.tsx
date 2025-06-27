import React, { useState, useEffect } from 'react';
import { 
  User, Edit, Settings, Shield, Eye, EyeOff, MapPin, 
  Calendar, Globe, Heart, Star, Trophy, Camera, Save, X, Radar, Crown, Users, MessageCircle, Clock,
  Target, Zap, TreePine, Coins, Navigation, CheckCircle, Unlock, Gift, Play, Pause, Plus, Lock as LockIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Interfaces for Gamification/Rewards
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'explorer' | 'social' | 'karma' | 'special';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  reward: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface KarmaAction {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: React.ComponentType<any>;
  category: 'eco' | 'help' | 'volunteer' | 'share';
  completedAt?: Date;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'mystery' | 'alien' | 'eco' | 'social';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: string;
  timeLimit?: Date;
  progress: number;
  maxProgress: number;
  isActive: boolean;
  isCompleted: boolean;
  category: 'nomad-trail' | 'place-discovery' | 'social' | 'eco';
  questType?: 'location-based' | 'activity-based' | 'social-based';
  requirements?: string[];
  rewards: string[];
  progressDescription: string;
}

interface TrailQuest {
  id: string;
  title: string;
  description: string;
  region: string;
  totalStops: number;
  completedStops: number;
  stops: {
    id: string;
    name: string;
    type: 'sunset' | 'food' | 'heritage' | 'adventure' | 'cultural';
    description: string;
    isCompleted: boolean;
    coordinates: { lat: number; lng: number };
  }[];
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDays: number;
}

interface LeaderboardEntry {
  id: string;
  rank: number;
  displayName: string;
  avatar: string;
  totalKarma: number;
  achievementsUnlocked: number;
  isCurrentUser: boolean;
  country: string;
  travelStyle: string;
}

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeProfileTab, setActiveProfileTab] = useState<'profile' | 'rewards'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [chatInvitesEnabled, setChatInvitesEnabled] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [locationPrecision, setLocationPrecision] = useState<'precise' | 'approximate'>('approximate');
  
  // Rewards tab state
  const [activeRewardTab, setActiveRewardTab] = useState<'achievements' | 'karma' | 'challenges' | 'trail-quests' | 'leaderboard'>('achievements');

  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    travelStyle: 'Explorer',
    interests: [] as string[],
    languages: [] as string[]
  });

  // Mock data for rewards
  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Drop your first footprint',
      icon: Star,
      category: 'explorer',
      progress: 1,
      maxProgress: 1,
      isUnlocked: true,
      reward: 'Explorer Badge',
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Social Butterfly',
      description: 'Connect with 10 travel buddies',
      icon: Users,
      category: 'social',
      progress: 7,
      maxProgress: 10,
      isUnlocked: false,
      reward: 'Connector Badge + Secret Location',
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Eco Warrior',
      description: 'Complete 25 eco-friendly actions',
      icon: TreePine,
      category: 'karma',
      progress: 18,
      maxProgress: 25,
      isUnlocked: false,
      reward: 'Green Badge + Eco Discount',
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Nomad Legend',
      description: 'Visit 50 unique locations',
      icon: Crown,
      category: 'explorer',
      progress: 23,
      maxProgress: 50,
      isUnlocked: false,
      reward: 'Legendary Status + VIP Access',
      rarity: 'legendary'
    }
  ];

  const mockKarmaActions: KarmaAction[] = [
    {
      id: '1',
      title: 'Help Local Business',
      description: 'Support a local vendor or restaurant',
      points: 50,
      icon: Heart,
      category: 'help',
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Clean Beach Activity',
      description: 'Participate in beach cleanup',
      points: 100,
      icon: TreePine,
      category: 'eco'
    },
    {
      id: '3',
      title: 'Share Hidden Gem',
      description: 'Share a secret location with community',
      points: 75,
      icon: MapPin,
      category: 'share',
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: '4',
      title: 'Volunteer at Hostel',
      description: 'Help at a local hostel or guesthouse',
      points: 150,
      icon: Users,
      category: 'volunteer'
    }
  ];

  const mockChallenges: Challenge[] = [
    {
      id: '1',
      title: 'Mystery Mountain Quest',
      description: 'Find the hidden temple based on cryptic clues',
      type: 'mystery',
      difficulty: 'hard',
      reward: 'Ancient Explorer Badge + 500 Karma Points',
      timeLimit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progress: 2,
      maxProgress: 5,
      isActive: true,
      isCompleted: false,
      category: 'nomad-trail',
      questType: 'location-based',
      requirements: ['Visit the hidden temple', 'Decode the ancient inscription', 'Take a photo at sunset'],
      rewards: ['Ancient Explorer Badge', '500 Karma Points', 'Exclusive Temple History Guide'],
      progressDescription: 'Found 2 of 5 cryptic clues'
    },
    {
      id: '2',
      title: 'Alien Food Explorer',
      description: 'Try 10 local dishes you\'ve never had before',
      type: 'alien',
      difficulty: 'medium',
      reward: 'Galactic Foodie Badge',
      progress: 6,
      maxProgress: 10,
      isActive: true,
      isCompleted: false,
      category: 'place-discovery',
      questType: 'activity-based',
      requirements: ['Try local cuisine', 'Rate each dish', 'Share photos with community'],
      rewards: ['Galactic Foodie Badge', 'Food Discovery Boost'],
      progressDescription: 'Tasted 6 out of 10 dishes'
    },
    {
      id: '3',
      title: 'Zero Waste Journey',
      description: 'Travel for 3 days without creating plastic waste',
      type: 'eco',
      difficulty: 'hard',
      reward: 'Eco Champion Status',
      progress: 3,
      maxProgress: 3,
      isActive: false,
      isCompleted: true,
      category: 'eco',
      questType: 'activity-based',
      requirements: ['Avoid single-use plastics', 'Use public transport', 'Support local eco-businesses'],
      rewards: ['Eco Champion Status', 'Carbon Offset Credits'],
      progressDescription: 'Successfully completed 3-day challenge'
    }
  ];

  const mockTrailQuests: TrailQuest[] = [
    {
      id: '1',
      title: 'Goa Sunset Trail',
      description: 'Explore 5 stunning sunset viewpoints across Goa beaches',
      region: 'Goa, India',
      totalStops: 5,
      completedStops: 2,
      stops: [
        {
          id: '1',
          name: 'Anjuna Beach Cliff',
          type: 'sunset',
          description: 'Rocky cliff overlooking the Arabian Sea',
          isCompleted: true,
          coordinates: { lat: 15.5736, lng: 73.7370 }
        },
        {
          id: '2',
          name: 'Chapora Fort Viewpoint',
          type: 'sunset',
          description: 'Historic Portuguese fort with panoramic views',
          isCompleted: true,
          coordinates: { lat: 15.6060, lng: 73.7364 }
        },
        {
          id: '3',
          name: 'Vagator Beach Rocks',
          type: 'sunset',
          description: 'Dramatic red cliffs and secluded coves',
          isCompleted: false,
          coordinates: { lat: 15.6076, lng: 73.7324 }
        },
        {
          id: '4',
          name: 'Morjim Turtle Beach',
          type: 'sunset',
          description: 'Peaceful beach known for turtle nesting',
          isCompleted: false,
          coordinates: { lat: 15.6299, lng: 73.7265 }
        },
        {
          id: '5',
          name: 'Arambol Sweet Water Lake',
          type: 'sunset',
          description: 'Hidden freshwater lake behind sand dunes',
          isCompleted: false,
          coordinates: { lat: 15.6885, lng: 73.7384 }
        }
      ],
      reward: 'Goa Sunset Master Badge + Local Guide Recommendations',
      difficulty: 'easy',
      estimatedDays: 3
    },
    {
      id: '2',
      title: 'Kerala Spice Route',
      description: 'Discover 3 authentic local dishes in traditional Kerala kitchens',
      region: 'Kerala, India',
      totalStops: 3,
      completedStops: 0,
      stops: [
        {
          id: '1',
          name: 'Traditional Fish Curry',
          type: 'food',
          description: 'Coconut-based fish curry in a local home',
          isCompleted: false,
          coordinates: { lat: 9.9312, lng: 76.2673 }
        },
        {
          id: '2',
          name: 'Appam & Stew',
          type: 'food',
          description: 'Fermented rice pancakes with vegetable stew',
          isCompleted: false,
          coordinates: { lat: 10.8505, lng: 76.2711 }
        },
        {
          id: '3',
          name: 'Sadya Feast',
          type: 'food',
          description: 'Traditional banana leaf feast experience',
          isCompleted: false,
          coordinates: { lat: 8.5241, lng: 76.9366 }
        }
      ],
      reward: 'Kerala Cuisine Expert Badge + Recipe Collection',
      difficulty: 'medium',
      estimatedDays: 5
    }
  ];

  const mockLeaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      rank: 1,
      displayName: 'EcoWarrior99',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      totalKarma: 2850,
      achievementsUnlocked: 28,
      isCurrentUser: false,
      country: 'India',
      travelStyle: 'Nature Lover'
    },
    {
      id: '2',
      rank: 2,
      displayName: 'DigitalNomadKing',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      totalKarma: 2640,
      achievementsUnlocked: 25,
      isCurrentUser: false,
      country: 'Thailand',
      travelStyle: 'Digital Nomad'
    },
    {
      id: '3',
      rank: 3,
      displayName: 'AdventureSeeker23',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      totalKarma: 2320,
      achievementsUnlocked: 22,
      isCurrentUser: false,
      country: 'Nepal',
      travelStyle: 'Adventure Seeker'
    },
    {
      id: '4',
      rank: 4,
      displayName: user?.displayName || 'You',
      avatar: user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      totalKarma: 1850,
      achievementsUnlocked: 18,
      isCurrentUser: true,
      country: 'India',
      travelStyle: user?.travelStyle || 'Explorer'
    },
    {
      id: '5',
      rank: 5,
      displayName: 'CulturalExplorer',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
      totalKarma: 1720,
      achievementsUnlocked: 16,
      isCurrentUser: false,
      country: 'Vietnam',
      travelStyle: 'Cultural Enthusiast'
    }
  ];

  const [achievements] = useState(mockAchievements);
  const [karmaActions] = useState(mockKarmaActions);
  const [challenges] = useState(mockChallenges);
  const [trailQuests] = useState(mockTrailQuests);
  const [leaderboard] = useState(mockLeaderboard);

  const totalKarmaPoints = karmaActions
    .filter(action => action.completedAt)
    .reduce((sum, action) => sum + action.points, 0);

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

  // Helper functions for rewards
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-emerald-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h remaining`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d remaining`;
  };

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
        <h1 className="text-2xl font-bold text-white">
          {activeProfileTab === 'profile' ? 'Profile' : 'Rewards & Achievements'}
        </h1>
        <div className="flex items-center space-x-2">
          {activeProfileTab === 'profile' && (
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
          )}
          
          {activeProfileTab === 'profile' && !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Edit className="h-4 w-4 text-gray-400" />
            </button>
          ) : activeProfileTab === 'profile' && isEditing ? (
            <button
              onClick={handleCancel}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-2xl bg-black/20 p-1 mb-6">
        <button
          onClick={() => setActiveProfileTab('profile')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeProfileTab === 'profile'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">Profile</span>
        </button>
        <button
          onClick={() => setActiveProfileTab('rewards')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeProfileTab === 'rewards'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Trophy className="h-4 w-4" />
          <span className="text-sm font-medium">Rewards</span>
        </button>
      </div>

      {/* Profile Tab Content */}
      {activeProfileTab === 'profile' && (
        <>
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-medium">Travel Achievements</span>
              </div>
              <button 
                onClick={() => {
                  setActiveProfileTab('rewards');
                  setActiveRewardTab('achievements');
                }}
                className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                View All →
              </button>
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
        </>
      )}

      {/* Rewards Tab Content */}
      {activeProfileTab === 'rewards' && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30 text-center">
              <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-yellow-400">{achievements.filter(a => a.isUnlocked).length}</div>
              <div className="text-xs text-gray-400">Achievements</div>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl p-4 border border-green-400/30 text-center">
              <Heart className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-400">{totalKarmaPoints}</div>
              <div className="text-xs text-gray-400">Karma Points</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30 text-center">
              <Target className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-400">{challenges.filter(c => c.isActive).length}</div>
              <div className="text-xs text-gray-400">Active Challenges</div>
            </div>
          </div>

          {/* Rewards Tab Navigation */}
          <div className="flex overflow-x-auto space-x-1 bg-black/20 rounded-2xl p-1 mb-6">
            {[
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'karma', label: 'Karma', icon: Heart },
              { id: 'challenges', label: 'Challenges', icon: Target },
              { id: 'trail-quests', label: 'Trail Quests', icon: Navigation },
              { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRewardTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  activeRewardTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Rewards Content */}
          {activeRewardTab === 'achievements' && (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300 ${
                    achievement.isUnlocked ? 'bg-gradient-to-r from-yellow-500/5 to-orange-500/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} flex items-center justify-center flex-shrink-0 ${
                      !achievement.isUnlocked ? 'opacity-50' : ''
                    }`}>
                      {achievement.isUnlocked ? (
                        <achievement.icon className="h-6 w-6 text-white" />
                      ) : (
                        <Lock className="h-6 w-6 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`text-lg font-semibold ${achievement.isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                            {achievement.title}
                          </h3>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                        </div>
                        
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          achievement.rarity === 'common' ? 'bg-gray-500/20 text-gray-400' :
                          achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                          achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {achievement.rarity}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">Progress</span>
                          <span className="text-xs text-gray-400">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full">
                          <div
                            className={`h-2 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-full transition-all duration-300`}
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-300">
                          Reward: {achievement.reward}
                        </div>
                        
                        {achievement.isUnlocked && (
                          <div className="flex items-center space-x-1 text-green-400 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>Unlocked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeRewardTab === 'karma' && (
            <div>
              {/* Karma Overview */}
              <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 backdrop-blur-sm rounded-3xl p-6 border border-green-400/30 mb-6">
                <div className="text-center mb-4">
                  <Heart className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-white mb-2">Travel Karma</h2>
                  <p className="text-gray-400 text-sm">Good deeds unlock amazing rewards</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                    {totalKarmaPoints}
                  </div>
                  <div className="text-sm text-gray-400">Total Karma Points</div>
                </div>
              </div>

              {/* Karma Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Karma Actions</h3>
                
                {karmaActions.map((action) => (
                  <div
                    key={action.id}
                    className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300 ${
                      action.completedAt ? 'bg-gradient-to-r from-green-500/5 to-teal-500/5' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        action.category === 'eco' ? 'bg-green-500/20' :
                        action.category === 'help' ? 'bg-blue-500/20' :
                        action.category === 'volunteer' ? 'bg-purple-500/20' :
                        'bg-orange-500/20'
                      }`}>
                        <action.icon className={`h-5 w-5 ${
                          action.category === 'eco' ? 'text-green-400' :
                          action.category === 'help' ? 'text-blue-400' :
                          action.category === 'volunteer' ? 'text-purple-400' :
                          'text-orange-400'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{action.title}</h4>
                        <p className="text-gray-400 text-sm">{action.description}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-green-400 font-bold">+{action.points}</div>
                        {action.completedAt ? (
                          <div className="text-xs text-green-400">Completed</div>
                        ) : (
                          <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                            Start →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeRewardTab === 'challenges' && (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300 ${
                    challenge.isCompleted ? 'bg-gradient-to-r from-green-500/5 to-teal-500/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} flex items-center justify-center flex-shrink-0`}>
                      {challenge.type === 'mystery' && <Target className="h-6 w-6 text-white" />}
                      {challenge.type === 'alien' && <Zap className="h-6 w-6 text-white" />}
                      {challenge.type === 'eco' && <TreePine className="h-6 w-6 text-white" />}
                      {challenge.type === 'social' && <Users className="h-6 w-6 text-white" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                          <p className="text-gray-400 text-sm">{challenge.description}</p>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-1">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                            challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {challenge.difficulty}
                          </div>
                          
                          {challenge.timeLimit && challenge.isActive && (
                            <div className="text-xs text-orange-400">
                              {formatTimeRemaining(challenge.timeLimit)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">Progress</span>
                          <span className="text-xs text-cyan-400">{challenge.progressDescription}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full">
                          <div
                            className={`h-2 bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} rounded-full transition-all duration-300`}
                            style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-300">
                          Rewards: {challenge.rewards.join(', ')}
                        </div>
                        
                        {challenge.isCompleted ? (
                          <div className="flex items-center space-x-1 text-green-400 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completed</span>
                          </div>
                        ) : challenge.isActive ? (
                          <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                            Continue →
                          </button>
                        ) : (
                          <button className="text-gray-400 text-sm">
                            Locked
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeRewardTab === 'trail-quests' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-6 border border-orange-400/30 text-center mb-6">
                <Navigation className="h-12 w-12 text-orange-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-white mb-2">Nomad Trail Quests</h2>
                <p className="text-gray-400 text-sm">Follow curated trails and discover amazing locations</p>
              </div>
              
              {trailQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{quest.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{quest.description}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span>📍 {quest.region}</span>
                        <span>📅 {quest.estimatedDays} days</span>
                        <span className={`px-2 py-1 rounded-full ${
                          quest.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          quest.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {quest.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Progress</span>
                      <span className="text-sm text-orange-400">{quest.completedStops}/{quest.totalStops} stops</span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full">
                      <div
                        className="h-3 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transition-all duration-300"
                        style={{ width: `${(quest.completedStops / quest.totalStops) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Quest Stops */}
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-gray-300">Quest Stops:</h4>
                    {quest.stops.slice(0, 3).map((stop) => (
                      <div key={stop.id} className="flex items-center space-x-3 text-sm">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          stop.isCompleted 
                            ? 'bg-green-400 border-green-400' 
                            : 'border-gray-600'
                        }`}>
                          {stop.isCompleted && <span className="text-xs">✓</span>}
                        </div>
                        <span className={stop.isCompleted ? 'text-green-400' : 'text-gray-400'}>
                          {stop.name}
                        </span>
                      </div>
                    ))}
                    {quest.stops.length > 3 && (
                      <div className="text-xs text-gray-500 ml-7">
                        +{quest.stops.length - 3} more stops
                      </div>
                    )}
                  </div>
                  
                  {/* Reward */}
                  <div className="bg-black/20 rounded-xl p-3 mb-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Gift className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-medium">Reward</span>
                    </div>
                    <p className="text-gray-300 text-sm">{quest.reward}</p>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-3 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300">
                    {quest.completedStops === 0 ? 'Start Quest' : 'Continue Quest'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeRewardTab === 'leaderboard' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-3xl p-6 border border-yellow-400/30 text-center mb-6">
                <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-white mb-2">Global Leaderboard</h2>
                <p className="text-gray-400 text-sm">Top nomads this month</p>
              </div>

              {/* Leaderboard entries */}
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.id}
                    className={`bg-white/5 backdrop-blur-sm rounded-2xl border p-4 transition-all duration-300 ${
                      entry.isCurrentUser 
                        ? 'border-yellow-400/30 bg-gradient-to-r from-yellow-500/5 to-orange-500/5' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                        entry.rank === 1 ? 'from-yellow-400 to-orange-500' :
                        entry.rank === 2 ? 'from-gray-300 to-gray-400' :
                        entry.rank === 3 ? 'from-amber-600 to-amber-700' :
                        'from-gray-600 to-gray-700'
                      } flex items-center justify-center font-bold text-white`}>
                        {entry.rank}
                      </div>
                      
                      <img 
                        src={entry.avatar} 
                        alt={entry.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-medium ${entry.isCurrentUser ? 'text-yellow-400' : 'text-white'}`}>
                            {entry.displayName}
                          </h4>
                          {entry.isCurrentUser && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">You</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span>{entry.country}</span>
                          <span>•</span>
                          <span>{entry.travelStyle}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-400">{entry.totalKarma}</div>
                        <div className="text-xs text-gray-400">Karma</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-bold text-purple-400">{entry.achievementsUnlocked}</div>
                        <div className="text-xs text-gray-400">Badges</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/30 mt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Boost Your Rank</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Complete challenges, earn karma, and unlock achievements to climb the leaderboard!
                </p>
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300">
                  Find Active Challenges
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProfilePage;