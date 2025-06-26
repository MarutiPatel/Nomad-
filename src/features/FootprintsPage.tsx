import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, Camera, Heart, MessageCircle, Share, Plus, 
  Filter, Search, Map, Grid, List, Clock, Star, Eye,
  Edit, Save, X, Trash2, Play, Video, Send, Smile,
  Users, Globe, UserPlus, MoreHorizontal, ThumbsUp,
  Reply, Flag, Bookmark, TrendingUp, Zap, Crown,
  AtSign, Hash, Settings, ChevronDown, ChevronUp,
  User, Navigation, Image as ImageIcon, Upload, RefreshCw
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
  // Stealth mode features
  stealthMode: boolean;
  allowedViewers: 'everyone' | 'friends' | 'tags' | 'custom';
  allowedTags?: string[];
  secretTrail?: string;
  expiryDate?: Date;
  // Place pulse ratings
  placePulse?: {
    friendliness: number; // 1-5
    cleanliness: number; // 1-5
    safety: number; // 1-5
    signalStrength: number; // 1-5
    foodQuality?: number; // 1-5 (for food places)
  };
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
      location: 'New York, USA',
      travelStyle: 'Adventure Seeker'
    },
    {
      id: '2',
      displayName: 'MountainSoul42',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      isVerified: false,
      isFollowing: true,
      location: 'Swiss Alps, Switzerland',
      travelStyle: 'Nature Lover'
    },
    {
      id: '3',
      displayName: 'DigitalNomadX',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      isVerified: true,
      isFollowing: false,
      location: 'Barcelona, Spain',
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
      location: 'Times Square, New York',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      title: 'Urban Energy Rush',
      description: 'The heartbeat of NYC! Amazing energy even at 2 AM. Met fellow travelers from 6 different countries right here.',
      mediaType: 'photo',
      mediaUrl: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date('2024-01-15T18:30:00'),
      likes: 34,
      comments: [
        {
          id: '1',
          author: mockUsers[0],
          content: 'Times Square never gets old! Which corner did you find the best street performers?',
          timestamp: new Date('2024-01-15T19:00:00'),
          likes: 3,
          isLiked: false,
          replies: [
            {
              id: '1',
              author: mockUsers[3],
              content: 'Near the TKTS stairs! There was an amazing violinist playing classical music 🎻',
              timestamp: new Date('2024-01-15T19:15:00'),
              likes: 1,
              isLiked: true
            }
          ]
        }
      ],
      shares: 12,
      views: 203,
      visibility: 'public',
      tags: ['urban', 'nightlife', 'street-performers', 'nyc'],
      isLiked: true,
      isBookmarked: false,
      mood: 'excited',
      weather: 'clear',
      stealthMode: false,
      allowedViewers: 'everyone',
      placePulse: {
        friendliness: 4,
        cleanliness: 3,
        safety: 4,
        signalStrength: 5
      }
    }
  ];

  const mockFriendsFootprints: Footprint[] = [
    {
      id: 'f1',
      author: mockUsers[0],
      location: 'Central Park, New York',
      coordinates: { lat: 40.7829, lng: -73.9654 },
      title: 'Morning Zen in the City',
      description: 'Found this perfect meditation spot in Central Park. The contrast between urban chaos and nature\'s peace is incredible. Perfect sunrise yoga session! 🧘‍♀️',
      mediaType: 'video',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      likes: 56,
      comments: [
        {
          id: 'c1',
          author: mockUsers[1],
          content: 'This looks so peaceful! What time did you go to avoid crowds? 🌅',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 8,
          isLiked: false,
          replies: [
            {
              id: 'r1',
              author: mockUsers[0],
              content: '@MountainSoul42 Sunrise at 6 AM! Hardly anyone around and the light is magical ✨',
              timestamp: new Date(Date.now() - 90 * 60 * 1000),
              likes: 3,
              isLiked: true,
              mentionedUser: mockUsers[1]
            }
          ]
        }
      ],
      shares: 18,
      views: 387,
      visibility: 'friends',
      tags: ['meditation', 'yoga', 'sunrise', 'central-park', 'peaceful'],
      isLiked: false,
      isBookmarked: true,
      mood: 'peaceful',
      weather: 'sunny',
      travelBuddies: [mockUsers[2]],
      isFeatured: true,
      stealthMode: true,
      allowedViewers: 'friends',
      secretTrail: 'Alpine Adventurers',
      placePulse: {
        friendliness: 5,
        cleanliness: 4,
        safety: 5,
        signalStrength: 3
      }
    },
    {
      id: 'f2',
      author: mockUsers[1],
      location: 'Matterhorn, Switzerland',
      coordinates: { lat: 45.9763, lng: 7.6586 },
      title: 'Alpine Majesty at Sunrise',
      description: 'Hiked 4 hours to catch sunrise over the Matterhorn. The silence at this altitude is profound - you can hear your heartbeat echoing across the valley. This is why I climb.',
      mediaType: 'gallery',
      mediaUrl: [
        'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 89,
      comments: [
        {
          id: 'c2',
          author: mockUsers[2],
          content: 'Absolutely breathtaking! How difficult was the hike? Planning a Switzerland trip 🏔️',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          likes: 4,
          isLiked: true,
          replies: []
        }
      ],
      shares: 31,
      views: 567,
      visibility: 'public',
      tags: ['matterhorn', 'sunrise', 'hiking', 'alps', 'switzerland'],
      isLiked: true,
      isBookmarked: false,
      mood: 'grateful',
      weather: 'clear',
      altitude: 3883,
      stealthMode: true,
      allowedViewers: 'tags',
      allowedTags: ['hiking', 'mountains'],
      secretTrail: 'Alpine Adventurers',
      placePulse: {
        friendliness: 5,
        cleanliness: 5,
        safety: 4,
        signalStrength: 1
      }
    }
  ];

  const mockCommunityFootprints: Footprint[] = [
    {
      id: 'c1',
      author: mockUsers[2],
      location: 'Park Güell, Barcelona',
      coordinates: { lat: 41.4145, lng: 2.1527 },
      title: 'Gaudí\'s Mosaic Wonderland',
      description: 'Working remotely from Park Güell today! Found this perfect spot with WiFi and the most incredible views of Barcelona. The mosaic work here is absolutely mind-blowing 🎨💻',
      mediaType: 'photo',
      mediaUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 134,
      comments: [
        {
          id: 'cc1',
          author: {
            id: '4',
            displayName: 'ArchitectureNerd',
            avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
            isVerified: false
          },
          content: 'Gaudí was truly ahead of his time! Did you visit Casa Batlló too? The whole city is an art museum 🏛️',
          timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
          likes: 12,
          isLiked: false,
          replies: [
            {
              id: 'rr1',
              author: mockUsers[2],
              content: '@ArchitectureNerd Yes! And Sagrada Familia tomorrow. Barcelona is a digital nomad\'s dream city 🌆',
              timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
              likes: 8,
              isLiked: false,
              mentionedUser: {
                id: '4',
                displayName: 'ArchitectureNerd',
                avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
                isVerified: false
              }
            }
          ]
        }
      ],
      shares: 23,
      views: 456,
      visibility: 'public',
      tags: ['gaudi', 'architecture', 'barcelona', 'digital-nomad', 'art'],
      isLiked: false,
      isBookmarked: false,
      mood: 'inspired',
      weather: 'sunny',
      isFeatured: true,
      stealthMode: false,
      allowedViewers: 'everyone',
      placePulse: {
        friendliness: 4,
        cleanliness: 4,
        safety: 5,
        signalStrength: 4
      }
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
    console.log('Liked footprint:', id);
  };

  const handleComment = (footprintId: string, content: string) => {
    if (!content.trim()) return;
    console.log('New comment on', footprintId, ':', content);
    setCommentInputs(prev => ({ ...prev, [footprintId]: '' }));
  };

  const handleReply = (footprintId: string, commentId: string, content: string) => {
    if (!content.trim()) return;
    console.log('New reply on', footprintId, commentId, ':', content);
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

        {/* Place Pulse Ratings */}
        {footprint.placePulse && (
          <div className="bg-black/20 rounded-xl p-3 mb-3">
            <h4 className="text-cyan-400 font-medium text-xs mb-2">Place Pulse</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Friendliness</span>
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${
                      i <= footprint.placePulse!.friendliness ? 'bg-green-400' : 'bg-gray-600'
                    }`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Cleanliness</span>
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${
                      i <= footprint.placePulse!.cleanliness ? 'bg-blue-400' : 'bg-gray-600'
                    }`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Safety</span>
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${
                      i <= footprint.placePulse!.safety ? 'bg-orange-400' : 'bg-gray-600'
                    }`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Signal</span>
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${
                      i <= footprint.placePulse!.signalStrength ? 'bg-purple-400' : 'bg-gray-600'
                    }`} />
                  ))}
                </div>
              </div>
            </div>
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

        {/* Stealth Mode Indicator */}
        {footprint.stealthMode && (
          <div className="bg-purple-500/10 rounded-xl p-2 mb-3 border border-purple-400/30">
            <div className="flex items-center space-x-2">
              <Eye className="h-3 w-3 text-purple-400" />
              <span className="text-purple-400 text-xs font-medium">Stealth Mode</span>
              <span className="text-gray-400 text-xs">
                {footprint.allowedViewers === 'friends' ? 'Friends Only' :
                 footprint.allowedViewers === 'tags' ? `Tags: ${footprint.allowedTags?.join(', ')}` :
                 footprint.allowedViewers === 'custom' ? 'Custom Viewers' :
                 'Limited Visibility'}
              </span>
            </div>
            {footprint.secretTrail && (
              <div className="text-purple-300 text-xs mt-1">
                Trail: {footprint.secretTrail}
              </div>
            )}
            {footprint.expiryDate && (
              <div className="text-orange-400 text-xs mt-1">
                Expires: {footprint.expiryDate.toLocaleDateString()}
              </div>
            )}
          </div>
        )}

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
            <option value="urban">Urban</option>
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

      {/* Create Footprint Modal */}
      {showCreateModal && (
        <CreateFootprintModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreateFootprintModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    visibility: 'public' as 'public' | 'followers' | 'private',
    tags: '',
    mediaType: 'photo' as 'photo' | 'video' | 'voice',
    spotType: 'general' as 'general' | 'food' | 'utility',
    priceRange: '$' as '$' | '$$' | '$$$',
    amenities: '',
    specialties: '',
    openHours: '',
    // Stealth mode
    stealthMode: false,
    allowedViewers: 'everyone' as 'everyone' | 'friends' | 'tags' | 'custom',
    allowedTags: '',
    expiryDays: '7',
    secretTrail: '',
    // Place pulse ratings
    friendliness: 3,
    cleanliness: 3,
    safety: 3,
    signalStrength: 3,
    foodQuality: 3
  });

  const [currentLocation, setCurrentLocation] = useState('Detected: New York, NY');
  const [useCustomLocation, setUseCustomLocation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating footprint:', formData);
    onClose();
  };

  const detectLocation = () => {
    // Simulate GPS detection
    const locations = [
      'New York, NY, USA',
      'Central Park, New York',
      'Times Square, New York',
      'Brooklyn Bridge, New York',
      'Paris, France',
      'London, UK',
      'Tokyo, Japan'
    ];
    const detected = locations[Math.floor(Math.random() * locations.length)];
    setCurrentLocation(`Detected: ${detected}`);
    if (!useCustomLocation) {
      setFormData(prev => ({ ...prev, location: detected }));
    }
  };

  useEffect(() => {
    // Auto-detect location on modal open
    detectLocation();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Drop a Footprint</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Add Media (Optional)</label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mediaType: 'photo' }))}
                  className={`flex-1 p-3 rounded-xl border transition-colors flex items-center justify-center space-x-2 ${
                    formData.mediaType === 'photo'
                      ? 'bg-blue-500/20 border-blue-400/30 text-blue-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-sm">Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mediaType: 'video' }))}
                  className={`flex-1 p-3 rounded-xl border transition-colors flex items-center justify-center space-x-2 ${
                    formData.mediaType === 'video'
                      ? 'bg-red-500/20 border-red-400/30 text-red-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <Video className="h-5 w-5" />
                  <span className="text-sm">Video</span>
                </button>
                <button
                  type="button"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:border-white/20 transition-colors"
                >
                  <Upload className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Footprint Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Footprint Type</label>
              <select
                value={formData.spotType}
                onChange={(e) => setFormData(prev => ({ ...prev, spotType: e.target.value as any }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="general" className="bg-slate-800">General Experience</option>
                <option value="food" className="bg-slate-800">Food Spot</option>
                <option value="utility" className="bg-slate-800">Utility/Service</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder={
                  formData.spotType === 'food' ? 'Restaurant or food spot name' :
                  formData.spotType === 'utility' ? 'Utility or service name' :
                  "What's this moment about?"
                }
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-400/30">
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm">{currentLocation}</span>
                  </div>
                  <button
                    type="button"
                    onClick={detectLocation}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="customLocation"
                    checked={useCustomLocation}
                    onChange={(e) => setUseCustomLocation(e.target.checked)}
                    className="w-4 h-4 text-cyan-600 bg-black/20 border-white/10 rounded focus:ring-cyan-500"
                  />
                  <label htmlFor="customLocation" className="text-sm text-gray-300">
                    Use custom location
                  </label>
                </div>
                
                {useCustomLocation && (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    placeholder="Enter custom location"
                  />
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Caption/Story (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                rows={3}
                placeholder={
                  formData.spotType === 'food' ? 'Describe the food, ambiance, and experience...' :
                  formData.spotType === 'utility' ? 'Describe the facilities, cleanliness, and amenities...' :
                  'Share your story about this moment...'
                }
              />
            </div>

            {/* Food-specific fields */}
            {formData.spotType === 'food' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                    <select
                      value={formData.priceRange}
                      onChange={(e) => setFormData(prev => ({ ...prev, priceRange: e.target.value as any }))}
                      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="$" className="bg-slate-800">$ - Budget</option>
                      <option value="$$" className="bg-slate-800">$$ - Mid-range</option>
                      <option value="$$$" className="bg-slate-800">$$$ - Expensive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Open Hours</label>
                    <input
                      type="text"
                      value={formData.openHours}
                      onChange={(e) => setFormData(prev => ({ ...prev, openHours: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                      placeholder="e.g., 9 AM - 11 PM"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Specialties</label>
                  <input
                    type="text"
                    value={formData.specialties}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    placeholder="e.g., Butter Chicken, Pizza, Local Fish"
                  />
                </div>
              </>
            )}

            {/* Utility-specific fields */}
            {formData.spotType === 'utility' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amenities/Features</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  placeholder="e.g., Clean, 24/7, Security, WiFi, Parking"
                />
              </div>
            )}

            {/* Stealth Mode Section */}
            <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30">
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="checkbox"
                  id="stealthMode"
                  checked={formData.isStealthMode}
                  onChange={(e) => setFormData(prev => ({ ...prev, isStealthMode: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 bg-black/20 border-white/10 rounded focus:ring-purple-500"
                />
                <label htmlFor="stealthMode" className="text-purple-400 font-medium">
                  Enable Stealth Mode
                </label>
              </div>
              
              {formData.isStealthMode && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Allowed Viewers</label>
                    <select
                      value={formData.allowedViewers}
                      onChange={(e) => setFormData(prev => ({ ...prev, allowedViewers: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/20 border border-purple-400/30 rounded-2xl text-purple-300 focus:border-purple-400 focus:outline-none"
                    >
                      <option value="friends" className="bg-slate-800">Friends Only</option>
                      <option value="followers" className="bg-slate-800">Followers Only</option>
                      <option value="custom" className="bg-slate-800">Custom List</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Stealth Tags</label>
                    <input
                      type="text"
                      value={formData.stealthTags}
                      onChange={(e) => setFormData(prev => ({ ...prev, stealthTags: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/20 border border-purple-400/30 rounded-2xl text-purple-300 placeholder-purple-400/50 focus:border-purple-400 focus:outline-none"
                      placeholder="zen-seekers, photographers, foodies"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/20 border border-purple-400/30 rounded-2xl text-purple-300 focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Place Pulse Rating Section */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/30">
              <h3 className="text-blue-400 font-medium mb-3">Rate This Place (Place Pulse)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-blue-300 mb-2">Local Friendliness</label>
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, friendliness: rating }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          rating <= formData.friendliness
                            ? 'bg-green-400 border-green-400'
                            : 'border-gray-600 hover:border-green-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900">{rating}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-blue-300 mb-2">Cleanliness</label>
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, cleanliness: rating }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          rating <= formData.cleanliness
                            ? 'bg-blue-400 border-blue-400'
                            : 'border-gray-600 hover:border-blue-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">{rating}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-blue-300 mb-2">Solo Travel Safety</label>
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, safety: rating }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          rating <= formData.safety
                            ? 'bg-yellow-400 border-yellow-400'
                            : 'border-gray-600 hover:border-yellow-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900">{rating}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-blue-300 mb-2">Mobile Signal Strength</label>
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, signalStrength: rating }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          rating <= formData.signalStrength
                            ? 'bg-cyan-400 border-cyan-400'
                            : 'border-gray-600 hover:border-cyan-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900">{rating}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stealth Mode Toggle */}
            <div className="bg-purple-500/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">Stealth Mode</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, stealthMode: !prev.stealthMode }))}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    formData.stealthMode
                      ? 'bg-purple-500/20 text-purple-400 border-purple-400/30'
                      : 'bg-white/10 text-gray-400 border-white/10'
                  }`}
                >
                  {formData.stealthMode ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {formData.stealthMode && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-purple-300 mb-2">Who can see this?</label>
                    <select
                      value={formData.allowedViewers}
                      onChange={(e) => setFormData(prev => ({ ...prev, allowedViewers: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-black/20 border border-purple-400/30 rounded-xl text-purple-300 focus:border-purple-400 focus:outline-none text-sm"
                    >
                      <option value="friends" className="bg-slate-800">Friends Only</option>
                      <option value="tags" className="bg-slate-800">Specific Tags</option>
                      <option value="custom" className="bg-slate-800">Custom Trail</option>
                    </select>
                  </div>
                  
                  {formData.allowedViewers === 'tags' && (
                    <div>
                      <label className="block text-sm text-purple-300 mb-2">Allowed Tags</label>
                      <input
                        type="text"
                        value={formData.allowedTags}
                        onChange={(e) => setFormData(prev => ({ ...prev, allowedTags: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/20 border border-purple-400/30 rounded-xl text-purple-300 placeholder-purple-400/50 focus:border-purple-400 focus:outline-none text-sm"
                        placeholder="hiking, photography, food"
                      />
                    </div>
                  )}
                  
                  {formData.allowedViewers === 'custom' && (
                    <div>
                      <label className="block text-sm text-purple-300 mb-2">Secret Trail Name</label>
                      <input
                        type="text"
                        value={formData.secretTrail}
                        onChange={(e) => setFormData(prev => ({ ...prev, secretTrail: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/20 border border-purple-400/30 rounded-xl text-purple-300 placeholder-purple-400/50 focus:border-purple-400 focus:outline-none text-sm"
                        placeholder="My Secret Adventure Trail"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm text-purple-300 mb-2">Auto-expire after (days)</label>
                    <select
                      value={formData.expiryDays}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDays: e.target.value }))}
                      className="w-full px-3 py-2 bg-black/20 border border-purple-400/30 rounded-xl text-purple-300 focus:border-purple-400 focus:outline-none text-sm"
                    >
                      <option value="1" className="bg-slate-800">1 day</option>
                      <option value="3" className="bg-slate-800">3 days</option>
                      <option value="7" className="bg-slate-800">7 days</option>
                      <option value="30" className="bg-slate-800">30 days</option>
                      <option value="never" className="bg-slate-800">Never expire</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Place Pulse Ratings */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-4 border border-cyan-400/30">
              <h3 className="text-cyan-400 font-medium mb-3">Rate This Place</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-cyan-300 mb-2">Local Friendliness</label>
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, friendliness: rating }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          rating <= formData.friendliness
                            ? 'bg-green-400 border-green-400'
                            : 'border-gray-600 hover:border-green-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">{rating}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-cyan-300 mb-2">Cleanliness</label>
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, cleanliness: rating }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          rating <= formData.cleanliness
                            ? 'bg-blue-400 border-blue-400'
                            : 'border-gray-600 hover:border-blue-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">{rating}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-cyan-300 mb-2">Solo Travel Safety</label>
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, safety: rating }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          rating <= formData.safety
                            ? 'bg-orange-400 border-orange-400'
                            : 'border-gray-600 hover:border-orange-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">{rating}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-cyan-300 mb-2">Mobile Signal Strength</label>
                  <div className="flex items-center space-x-2">
                    {[1,2,3,4,5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, signalStrength: rating }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          rating <= formData.signalStrength
                            ? 'bg-purple-400 border-purple-400'
                            : 'border-gray-600 hover:border-purple-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">{rating}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {formData.spotType === 'food' && (
                  <div>
                    <label className="block text-sm text-cyan-300 mb-2">Food Quality</label>
                    <div className="flex items-center space-x-2">
                      {[1,2,3,4,5].map(rating => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, foodQuality: rating }))}
                          className={`w-8 h-8 rounded-full border-2 transition-colors ${
                            rating <= formData.foodQuality
                              ? 'bg-yellow-400 border-yellow-400'
                              : 'border-gray-600 hover:border-yellow-400'
                          }`}
                        >
                          <span className="text-xs font-bold text-white">{rating}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="public">Public - Anyone can see</option>
                <option value="followers">Followers Only</option>
                <option value="private">Private - Only me</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (Optional)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder={
                  formData.spotType === 'food' ? 'indian, vegetarian, cheap, spicy (comma separated)' :
                  formData.spotType === 'utility' ? 'parking, clean, 24x7, secure (comma separated)' :
                  'adventure, beach, sunset (comma separated)'
                }
              />
            </div>

            {/* Submit Buttons */}
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

          {/* Info */}
          <div className="mt-4 p-3 bg-blue-500/10 rounded-xl border border-blue-400/30">
            <p className="text-blue-300 text-xs text-center">
              📍 Timestamp and location are auto-detected but editable. Your footprint will be visible to other travelers based on your privacy settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FootprintsPage;