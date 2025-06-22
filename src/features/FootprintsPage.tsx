import React, { useState } from 'react';
import { 
  MapPin, Camera, Heart, MessageCircle, Share, Plus, 
  Filter, Search, Map, Grid, List, Clock, Star, Eye,
  Edit, Save, X, Trash2, Play, Video, Send, Smile,
  Users, Globe, UserPlus, MoreHorizontal, ThumbsUp,
  Reply, Flag, Bookmark, TrendingUp, Zap, Crown,
  AtSign, Hash, Settings, ChevronDown, ChevronUp,
  User
} from 'lucide-react';

interface User {
  id: string;
  displayName: string;
  avatar: string;
  isVerified: boolean;
  isFollowing?: boolean;
  location?: string;
  travelStyle?: string;
}

interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
  isEditing?: boolean;
}

interface Reply {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  mentionedUser?: User;
}

interface Footprint {
  id: string;
  author: User;
  location: string;
  coordinates: { lat: number; lng: number };
  title: string;
  description: string;
  mediaType: 'photo' | 'video' | 'gallery' | 'voice';
  mediaUrl: string | string[];
  timestamp: Date;
  likes: number;
  comments: Comment[];
  shares: number;
  views: number;
  visibility: 'public' | 'private' | 'friends' | 'followers';
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
  isFeatured?: boolean;
  mood?: string;
  weather?: string;
  travelBuddies?: User[];
  altitude?: number;
  isEditing?: boolean;
}

function FootprintsPage() {
  const [activeTab, setActiveTab] = useState<'my-footprints' | 'friends-feed' | 'community-feed'>('my-footprints');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFootprint, setSelectedFootprint] = useState<Footprint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [commentInputs, setCommentInputs] = useState<{[key: string]: string}>({});
  const [replyInputs, setReplyInputs] = useState<{[key: string]: string}>({});

  // Mock data for different feeds
  const mockUsers: User[] = [
    {
      id: '1',
      displayName: 'CosmicWanderer88',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      isVerified: true,
      isFollowing: true,
      location: 'Goa, India',
      travelStyle: 'Adventure Seeker'
    },
    {
      id: '2',
      displayName: 'MountainSoul42',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      isVerified: false,
      isFollowing: true,
      location: 'Himachal Pradesh',
      travelStyle: 'Nature Lover'
    },
    {
      id: '3',
      displayName: 'DigitalNomadX',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      isVerified: true,
      isFollowing: false,
      location: 'Bangalore, India',
      travelStyle: 'Work & Travel'
    },
    {
      id: 'current',
      displayName: 'YourTravelName',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      isVerified: false,
      location: 'Current Location',
      travelStyle: 'Explorer'
    }
  ];

  const mockMyFootprints: Footprint[] = [
    {
      id: '1',
      author: mockUsers[3],
      location: 'Goa Beach, India',
      coordinates: { lat: 15.2993, lng: 74.1240 },
      title: 'Sunset Paradise',
      description: 'Amazing sunset view with fellow travelers. The beach was perfect for evening walks and the local food was incredible!',
      mediaType: 'photo',
      mediaUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date('2024-01-15T18:30:00'),
      likes: 24,
      comments: [
        {
          id: '1',
          author: mockUsers[0],
          content: 'Absolutely stunning! Which beach is this exactly?',
          timestamp: new Date('2024-01-15T19:00:00'),
          likes: 3,
          isLiked: false,
          replies: [
            {
              id: '1',
              author: mockUsers[3],
              content: 'This is Arambol Beach! Such a hidden gem 🏖️',
              timestamp: new Date('2024-01-15T19:15:00'),
              likes: 1,
              isLiked: true
            }
          ]
        },
        {
          id: '2',
          author: mockUsers[1],
          content: 'Adding this to my travel bucket list! 🌅',
          timestamp: new Date('2024-01-15T20:30:00'),
          likes: 5,
          isLiked: true,
          replies: []
        }
      ],
      shares: 8,
      views: 156,
      visibility: 'public',
      tags: ['sunset', 'beach', 'goa', 'peaceful'],
      isLiked: true,
      isBookmarked: false,
      mood: 'peaceful',
      weather: 'sunny'
    }
  ];

  const mockFriendsFootprints: Footprint[] = [
    {
      id: 'f1',
      author: mockUsers[0],
      location: 'Anjuna Beach, Goa',
      coordinates: { lat: 15.5736, lng: 73.7370 },
      title: 'Beach Volleyball Vibes',
      description: 'Epic beach volleyball session with fellow nomads! Nothing beats the combination of sports, sun, and amazing people. The sunset afterwards was just the cherry on top! 🏐',
      mediaType: 'video',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      likes: 42,
      comments: [
        {
          id: 'c1',
          author: mockUsers[1],
          content: 'Looks like so much fun! Wish I was there 🏐',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 8,
          isLiked: false,
          replies: [
            {
              id: 'r1',
              author: mockUsers[0],
              content: '@MountainSoul42 Next time you should totally join! The more the merrier 🎉',
              timestamp: new Date(Date.now() - 90 * 60 * 1000),
              likes: 3,
              isLiked: true,
              mentionedUser: mockUsers[1]
            }
          ]
        }
      ],
      shares: 12,
      views: 234,
      visibility: 'friends',
      tags: ['beach', 'volleyball', 'sports', 'friends', 'sunset'],
      isLiked: false,
      isBookmarked: true,
      mood: 'excited',
      weather: 'sunny',
      travelBuddies: [mockUsers[2]],
      isFeatured: true
    },
    {
      id: 'f2',
      author: mockUsers[1],
      location: 'Triund Peak, Himachal Pradesh',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      title: 'Mountain Meditation Bliss',
      description: 'Started the day with sunrise meditation at 3000m altitude. The silence here is absolutely profound - you can literally hear your heartbeat echoing in the valley. This is why I travel.',
      mediaType: 'gallery',
      mediaUrl: [
        'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 67,
      comments: [
        {
          id: 'c2',
          author: mockUsers[2],
          content: 'This looks absolutely incredible! How difficult was the trek?',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          likes: 2,
          isLiked: true,
          replies: []
        },
        {
          id: 'c3',
          author: mockUsers[0],
          content: 'The peace you must have felt up there... I can almost feel it through the photos 🧘‍♀️',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          likes: 12,
          isLiked: false,
          replies: [
            {
              id: 'r2',
              author: mockUsers[1],
              content: '@CosmicWanderer88 It really was life-changing! You should definitely plan a trip here',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              likes: 4,
              isLiked: true,
              mentionedUser: mockUsers[0]
            }
          ]
        }
      ],
      shares: 23,
      views: 445,
      visibility: 'public',
      tags: ['meditation', 'mountains', 'sunrise', 'spiritual', 'himachal'],
      isLiked: true,
      isBookmarked: false,
      mood: 'peaceful',
      weather: 'clear',
      altitude: 3000
    }
  ];

  const mockCommunityFootprints: Footprint[] = [
    {
      id: 'c1',
      author: mockUsers[2],
      location: 'Bangalore, Karnataka',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      title: 'Digital Nomad Hub Discovery',
      description: 'Found this amazing coworking space with the best coffee in Bangalore! Perfect blend of productivity and travel vibes. The community here is incredible - met nomads from 12 different countries today! ☕️💻',
      mediaType: 'photo',
      mediaUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 89,
      comments: [
        {
          id: 'cc1',
          author: {
            id: '4',
            displayName: 'TechNomadGirl',
            avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
            isVerified: false
          },
          content: 'Which coworking space is this? Planning a trip to Bangalore next month!',
          timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
          likes: 6,
          isLiked: false,
          replies: [
            {
              id: 'rr1',
              author: mockUsers[2],
              content: '@TechNomadGirl It\'s 91springboard in Koramangala! Amazing community and great coffee ☕',
              timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
              likes: 8,
              isLiked: false,
              mentionedUser: {
                id: '4',
                displayName: 'TechNomadGirl',
                avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
                isVerified: false
              }
            }
          ]
        }
      ],
      shares: 15,
      views: 332,
      visibility: 'public',
      tags: ['coworking', 'bangalore', 'digital-nomad', 'coffee', 'community'],
      isLiked: false,
      isBookmarked: false,
      mood: 'productive',
      weather: 'cloudy',
      isFeatured: true
    },
    {
      id: 'c2',
      author: {
        id: '5',
        displayName: 'BackpackerSarah',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        location: 'Kerala, India',
        travelStyle: 'Budget Traveler'
      },
      location: 'Alleppey Backwaters, Kerala',
      coordinates: { lat: 9.4981, lng: 76.3388 },
      title: 'Houseboat Heaven on a Budget',
      description: 'Spent 3 days on a traditional Kerala houseboat for just ₹800 per day! The local family who owns it shared amazing stories and the most delicious fish curry I\'ve ever had. Sometimes the best experiences come from the most unexpected places! 🛥️',
      mediaType: 'video',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      likes: 156,
      comments: [
        {
          id: 'cc2',
          author: {
            id: '6',
            displayName: 'BudgetTraveler101',
            avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
            isVerified: false
          },
          content: 'This is exactly what I needed to see! How did you find such an affordable option?',
          timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000),
          likes: 12,
          isLiked: true,
          replies: []
        },
        {
          id: 'cc3',
          author: mockUsers[0],
          content: 'The backwaters look absolutely magical! Kerala is definitely on my list now 🌴',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          likes: 8,
          isLiked: false,
          replies: []
        }
      ],
      shares: 34,
      views: 578,
      visibility: 'public',
      tags: ['kerala', 'houseboat', 'budget-travel', 'backwaters', 'local-experience'],
      isLiked: true,
      isBookmarked: true,
      mood: 'grateful',
      weather: 'sunny'
    }
  ];

  const [myFootprints] = useState(mockMyFootprints);
  const [friendsFootprints] = useState(mockFriendsFootprints);
  const [communityFootprints] = useState(mockCommunityFootprints);

  const getCurrentFootprints = () => {
    switch (activeTab) {
      case 'my-footprints':
        return myFootprints;
      case 'friends-feed':
        return friendsFootprints;
      case 'community-feed':
        return communityFootprints;
      default:
        return myFootprints;
    }
  };

  const handleLike = (id: string) => {
    // Handle like functionality for all feeds
    console.log('Liked footprint:', id);
  };

  const handleComment = (footprintId: string, content: string) => {
    if (!content.trim()) return;
    
    // Add new comment logic here
    console.log('New comment on', footprintId, ':', content);
    
    // Clear input
    setCommentInputs(prev => ({ ...prev, [footprintId]: '' }));
  };

  const handleReply = (footprintId: string, commentId: string, content: string) => {
    if (!content.trim()) return;
    
    // Add new reply logic here
    console.log('New reply on', footprintId, commentId, ':', content);
    
    // Clear input
    setReplyInputs(prev => ({ ...prev, [`${footprintId}-${commentId}`]: '' }));
  };

  const handleBookmark = (id: string) => {
    console.log('Bookmarked footprint:', id);
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
        await navigator.clipboard.writeText(`${footprint.title} - ${footprint.description}`);
        alert('Footprint copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleFollow = (userId: string) => {
    console.log('Following user:', userId);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const renderMediaContent = (footprint: Footprint) => {
    if (footprint.mediaType === 'gallery' && Array.isArray(footprint.mediaUrl)) {
      return (
        <div className="grid grid-cols-2 gap-1 h-48 overflow-hidden rounded-t-3xl">
          {footprint.mediaUrl.slice(0, 4).map((url, index) => (
            <div key={index} className={`relative ${index === 0 && footprint.mediaUrl.length > 2 ? 'col-span-2' : ''}`}>
              <img
                src={url}
                alt={`${footprint.title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 3 && footprint.mediaUrl.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">+{footprint.mediaUrl.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (footprint.mediaType === 'video') {
      return (
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          <video
            src={footprint.mediaUrl as string}
            className="w-full h-full object-cover"
            poster="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors cursor-pointer">
              <Play className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
            <Video className="h-3 w-3 text-white" />
            <span className="text-white text-xs">Video</span>
          </div>
        </div>
      );
    }

    // Default photo
    return (
      <div className="h-64 overflow-hidden rounded-t-3xl">
        <img
          src={footprint.mediaUrl as string}
          alt={footprint.title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  const renderFootprintCard = (footprint: Footprint) => (
    <div key={footprint.id} className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
      {/* Author Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={footprint.author.avatar}
              alt={footprint.author.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-white font-medium">{footprint.author.displayName}</span>
                {footprint.author.isVerified && (
                  <Star className="h-3 w-3 text-blue-400 fill-current" />
                )}
                {footprint.isFeatured && (
                  <Crown className="h-3 w-3 text-yellow-400 fill-current" />
                )}
              </div>
              <div className="flex items-center space-x-1 text-gray-400 text-xs">
                <MapPin className="h-2 w-2" />
                <span>{footprint.location}</span>
                <span>•</span>
                <Clock className="h-2 w-2" />
                <span>{formatTimeAgo(footprint.timestamp)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {activeTab !== 'my-footprints' && !footprint.author.isFollowing && (
              <button
                onClick={() => handleFollow(footprint.author.id)}
                className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white text-xs font-medium hover:shadow-lg transition-all duration-300"
              >
                <UserPlus className="h-3 w-3 inline mr-1" />
                Follow
              </button>
            )}
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Content */}
      {renderMediaContent(footprint)}

      {/* Content */}
      <div className="p-4">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">{footprint.title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{footprint.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {footprint.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
            >
              #{tag}
            </span>
          ))}
          {footprint.tags.length > 4 && (
            <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
              +{footprint.tags.length - 4} more
            </span>
          )}
        </div>

        {/* Travel Buddies */}
        {footprint.travelBuddies && footprint.travelBuddies.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400 text-sm">with</span>
            <div className="flex -space-x-2">
              {footprint.travelBuddies.map((buddy, index) => (
                <img
                  key={index}
                  src={buddy.avatar}
                  alt={buddy.displayName}
                  className="w-6 h-6 rounded-full border-2 border-slate-900 object-cover"
                />
              ))}
            </div>
            <span className="text-cyan-400 text-sm font-medium">
              {footprint.travelBuddies.map(b => b.displayName).join(', ')}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{footprint.views}</span>
            </span>
            <span>{footprint.likes} likes</span>
            <span>{footprint.comments.length} comments</span>
            <span>{footprint.shares} shares</span>
          </div>
          <div className="flex items-center space-x-2">
            {footprint.mood && <span>{footprint.mood === 'peaceful' ? '😌' : footprint.mood === 'excited' ? '🤩' : '😊'}</span>}
            {footprint.weather && <span>{footprint.weather === 'sunny' ? '☀️' : footprint.weather === 'cloudy' ? '☁️' : '🌤️'}</span>}
            {footprint.altitude && <span className="text-xs">⛰️ {footprint.altitude}m</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleLike(footprint.id)}
              className={`flex items-center space-x-1 transition-colors ${
                footprint.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
              }`}
            >
              <Heart className={`h-5 w-5 ${footprint.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{footprint.likes}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{footprint.comments.length}</span>
            </button>
            
            <button
              onClick={() => handleShare(footprint)}
              className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors"
            >
              <Share className="h-5 w-5" />
              <span className="text-sm">{footprint.shares}</span>
            </button>
          </div>
          
          <button
            onClick={() => handleBookmark(footprint.id)}
            className={`transition-colors ${
              footprint.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${footprint.isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Comments Section */}
        <div className="border-t border-white/10 pt-4">
          {/* Comment Input */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={mockUsers[3].avatar}
              alt="You"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentInputs[footprint.id] || ''}
                onChange={(e) => setCommentInputs(prev => ({ ...prev, [footprint.id]: e.target.value }))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleComment(footprint.id, commentInputs[footprint.id] || '');
                  }
                }}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-full text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none pr-10"
              />
              <button
                onClick={() => handleComment(footprint.id, commentInputs[footprint.id] || '')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {footprint.comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                {/* Comment */}
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-white/10 rounded-2xl px-4 py-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium text-sm">{comment.author.displayName}</span>
                        {comment.author.isVerified && (
                          <Star className="h-3 w-3 text-blue-400 fill-current" />
                        )}
                        <span className="text-gray-400 text-xs">{formatTimeAgo(comment.timestamp)}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.content}</p>
                    </div>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 mt-1 ml-4">
                      <button className={`flex items-center space-x-1 text-xs transition-colors ${
                        comment.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                      }`}>
                        <ThumbsUp className={`h-3 w-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="text-gray-400 hover:text-blue-400 text-xs transition-colors">
                        <Reply className="h-3 w-3 inline mr-1" />
                        Reply
                      </button>
                      <button className="text-gray-400 hover:text-red-400 text-xs transition-colors">
                        <Flag className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-8 space-y-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-3">
                        <img
                          src={reply.author.avatar}
                          alt={reply.author.displayName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="bg-white/5 rounded-2xl px-3 py-2">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-white font-medium text-xs">{reply.author.displayName}</span>
                              <span className="text-gray-400 text-xs">{formatTimeAgo(reply.timestamp)}</span>
                            </div>
                            <p className="text-gray-300 text-xs">
                              {reply.mentionedUser && (
                                <span className="text-cyan-400">@{reply.mentionedUser.displayName} </span>
                              )}
                              {reply.content}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3 mt-1 ml-3">
                            <button className={`flex items-center space-x-1 text-xs transition-colors ${
                              reply.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                            }`}>
                              <ThumbsUp className={`h-2 w-2 ${reply.isLiked ? 'fill-current' : ''}`} />
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <div className="ml-8">
                  <div className="flex items-center space-x-2">
                    <img
                      src={mockUsers[3].avatar}
                      alt="You"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={replyInputs[`${footprint.id}-${comment.id}`] || ''}
                        onChange={(e) => setReplyInputs(prev => ({ ...prev, [`${footprint.id}-${comment.id}`]: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleReply(footprint.id, comment.id, replyInputs[`${footprint.id}-${comment.id}`] || '');
                          }
                        }}
                        placeholder={`Reply to ${comment.author.displayName}...`}
                        className="w-full px-3 py-1 bg-black/20 border border-white/10 rounded-full text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm pr-8"
                      />
                      <button
                        onClick={() => handleReply(footprint.id, comment.id, replyInputs[`${footprint.id}-${comment.id}`] || '')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Send className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Footprints</h1>
          <p className="text-gray-400 text-sm">Travel memories and community stories</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto space-x-1 bg-black/20 rounded-2xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('my-footprints')}
          className={`flex items-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'my-footprints'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">My Footprints</span>
        </button>
        <button
          onClick={() => setActiveTab('friends-feed')}
          className={`flex items-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'friends-feed'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">Friends Feed</span>
        </button>
        <button
          onClick={() => setActiveTab('community-feed')}
          className={`flex items-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === 'community-feed'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">Community</span>
        </button>
      </div>

      {/* Controls */}
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
        </div>
      </div>

      {/* Featured Content Banner */}
      {activeTab === 'community-feed' && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Trending Now</span>
          </div>
          <p className="text-gray-300 text-sm">
            Discover the most amazing travel experiences shared by the global nomad community
          </p>
        </div>
      )}

      {/* Footprints Grid */}
      <div className="space-y-6">
        {getCurrentFootprints().map(renderFootprintCard)}
      </div>

      {/* Empty State */}
      {getCurrentFootprints().length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'my-footprints' && <User className="h-8 w-8 text-white" />}
            {activeTab === 'friends-feed' && <Users className="h-8 w-8 text-white" />}
            {activeTab === 'community-feed' && <Globe className="h-8 w-8 text-white" />}
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {activeTab === 'my-footprints' && 'No Footprints Yet'}
            {activeTab === 'friends-feed' && 'No Friends\' Posts'}
            {activeTab === 'community-feed' && 'No Community Posts'}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {activeTab === 'my-footprints' && 'Start your journey by dropping your first footprint'}
            {activeTab === 'friends-feed' && 'Connect with fellow travelers to see their adventures'}
            {activeTab === 'community-feed' && 'Check back later for amazing community content'}
          </p>
          {activeTab === 'my-footprints' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 rounded-2xl font-semibold text-white"
            >
              Drop Your First Footprint
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default FootprintsPage;