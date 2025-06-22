import React, { useState } from 'react';
import { 
  MapPin, Camera, Heart, MessageCircle, Share, Plus, 
  Filter, Search, Map, Grid, List, Clock, Star, Eye,
  Edit, Save, X, Trash2, Play, Video, Bookmark, Send,
  User, Users, Globe, Compass, ThumbsUp, Smile, MoreHorizontal,
  Reply, Flag, Volume2, VolumeX, ImageIcon, FileText, Mic,
  Verified, Crown, Badge, Award, TrendingUp, Navigation,
  ChevronDown, ChevronUp, AlertCircle, CheckCircle
} from 'lucide-react';

interface Footprint {
  id: string;
  author: {
    id: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
    isFollowing: boolean;
    travelStyle: string;
    badges: string[];
  };
  location: string;
  coordinates: { lat: number; lng: number };
  title: string;
  description: string;
  mediaType: 'photo' | 'video' | 'voice' | 'gallery';
  mediaUrl: string | string[];
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  visibility: 'public' | 'private' | 'friends';
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
  isOwn: boolean;
  mood?: string;
  weather?: string;
  travelBuddies?: string[];
  altitude?: number;
  reactions: {
    like: number;
    love: number;
    wow: number;
    laugh: number;
    sad: number;
    angry: number;
  };
  userReaction?: 'like' | 'love' | 'wow' | 'laugh' | 'sad' | 'angry' | null;
}

interface Comment {
  id: string;
  author: {
    id: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
  parentId?: string;
}

interface Reply {
  id: string;
  author: {
    id: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  mentionedUser?: string;
}

function FootprintsPage() {
  const [activeTab, setActiveTab] = useState<'my-footprints' | 'friends-feed' | 'discover-feed'>('my-footprints');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFootprint, setSelectedFootprint] = useState<Footprint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');

  // Mock data for personal footprints
  const mockMyFootprints: Footprint[] = [
    {
      id: '1',
      author: {
        id: 'me',
        displayName: 'You',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: false,
        isFollowing: false,
        travelStyle: 'Adventure Seeker',
        badges: ['Explorer']
      },
      location: 'Goa Beach, India',
      coordinates: { lat: 15.2993, lng: 74.1240 },
      title: 'Sunset Paradise',
      description: 'Amazing sunset view with fellow travelers. The beach was perfect for evening walks and the local food was incredible!',
      mediaType: 'photo',
      mediaUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date('2024-01-15T18:30:00'),
      likes: 24,
      comments: 8,
      shares: 3,
      visibility: 'public',
      tags: ['sunset', 'beach', 'goa', 'peaceful'],
      isLiked: true,
      isBookmarked: false,
      isOwn: true,
      mood: 'peaceful',
      weather: 'sunny',
      reactions: { like: 15, love: 8, wow: 1, laugh: 0, sad: 0, angry: 0 },
      userReaction: 'love'
    }
  ];

  // Mock data for friends feed
  const mockFriendsFootprints: Footprint[] = [
    {
      id: 'f1',
      author: {
        id: '1',
        displayName: 'CosmicWanderer88',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        isFollowing: true,
        travelStyle: 'Adventure Seeker',
        badges: ['Explorer', 'Photographer']
      },
      location: 'Arambol Beach, Goa',
      coordinates: { lat: 15.6869, lng: 73.7036 },
      title: 'Hidden Beach Discovery',
      description: 'Found this incredible secluded beach! Perfect for meditation and watching dolphins. The local fishermen shared some amazing stories.',
      mediaType: 'gallery',
      mediaUrl: [
        'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      likes: 89,
      comments: 23,
      shares: 12,
      visibility: 'public',
      tags: ['hidden-gem', 'beach', 'dolphins', 'meditation'],
      isLiked: false,
      isBookmarked: true,
      isOwn: false,
      mood: 'peaceful',
      weather: 'sunny',
      altitude: 5,
      travelBuddies: ['LocalFisherman', 'BeachYogi'],
      reactions: { like: 45, love: 32, wow: 12, laugh: 0, sad: 0, angry: 0 },
      userReaction: null
    },
    {
      id: 'f2',
      author: {
        id: '2',
        displayName: 'MountainSoul42',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: false,
        isFollowing: true,
        travelStyle: 'Spiritual Seeker',
        badges: ['Zen Master', 'Peak Climber']
      },
      location: 'Triund Peak, Himachal Pradesh',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      title: 'Sunrise Meditation Journey',
      description: 'Woke up at 4 AM for this incredible sunrise. The meditation session at 3000m was life-changing. You can literally hear your soul.',
      mediaType: 'video',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 156,
      comments: 45,
      shares: 28,
      visibility: 'public',
      tags: ['meditation', 'sunrise', 'mountains', 'spiritual'],
      isLiked: true,
      isBookmarked: false,
      isOwn: false,
      mood: 'spiritual',
      weather: 'clear',
      altitude: 3000,
      reactions: { like: 78, love: 56, wow: 22, laugh: 0, sad: 0, angry: 0 },
      userReaction: 'love'
    }
  ];

  // Mock data for public/discover feed
  const mockDiscoverFootprints: Footprint[] = [
    {
      id: 'd1',
      author: {
        id: '3',
        displayName: 'DigitalNomadX',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: true,
        isFollowing: false,
        travelStyle: 'Digital Nomad',
        badges: ['Tech Explorer', 'Connector']
      },
      location: 'Bangalore Tech Hub',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      title: 'Perfect Coworking Paradise',
      description: 'Found the ultimate coworking space with amazing coffee and incredible WiFi. The rooftop view is insane and the community is so welcoming!',
      mediaType: 'photo',
      mediaUrl: 'https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 234,
      comments: 67,
      shares: 45,
      visibility: 'public',
      tags: ['coworking', 'tech', 'coffee', 'community'],
      isLiked: false,
      isBookmarked: false,
      isOwn: false,
      mood: 'productive',
      weather: 'cloudy',
      reactions: { like: 120, love: 89, wow: 25, laugh: 0, sad: 0, angry: 0 },
      userReaction: null
    },
    {
      id: 'd2',
      author: {
        id: '4',
        displayName: 'FoodieWanderer',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: false,
        isFollowing: false,
        travelStyle: 'Culinary Explorer',
        badges: ['Food Critic', 'Local Expert']
      },
      location: 'Mumbai Street Food Lane',
      coordinates: { lat: 19.0760, lng: 72.8777 },
      title: 'Street Food Heaven Voice Note',
      description: 'Recording this while eating the most incredible vada pav ever! Listen to the sounds of the bustling street and my foodgasm reaction.',
      mediaType: 'voice',
      mediaUrl: 'voice-note-url',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      likes: 445,
      comments: 89,
      shares: 67,
      visibility: 'public',
      tags: ['street-food', 'mumbai', 'vada-pav', 'authentic'],
      isLiked: true,
      isBookmarked: true,
      isOwn: false,
      mood: 'excited',
      weather: 'humid',
      reactions: { like: 234, love: 156, wow: 45, laugh: 10, sad: 0, angry: 0 },
      userReaction: 'love'
    }
  ];

  // Mock comments data
  const mockComments: { [key: string]: Comment[] } = {
    'f1': [
      {
        id: 'c1',
        author: {
          id: '5',
          displayName: 'BeachLover',
          avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
          isVerified: false
        },
        content: 'Wow! This looks absolutely stunning! Is it easily accessible?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 12,
        isLiked: false,
        replies: [
          {
            id: 'r1',
            author: {
              id: '1',
              displayName: 'CosmicWanderer88',
              avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
              isVerified: true
            },
            content: '@BeachLover Yes! About 15 minutes walk from the main beach. Local fishermen can guide you.',
            timestamp: new Date(Date.now() - 90 * 60 * 1000),
            likes: 8,
            isLiked: true,
            mentionedUser: 'BeachLover'
          }
        ]
      },
      {
        id: 'c2',
        author: {
          id: '6',
          displayName: 'NaturePhotographer',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
          isVerified: true
        },
        content: 'The photography here must be incredible! What time of day did you shoot this?',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        likes: 6,
        isLiked: true,
        replies: []
      }
    ]
  };

  const [footprints, setFootprints] = useState({
    myFootprints: mockMyFootprints,
    friendsFootprints: mockFriendsFootprints,
    discoverFootprints: mockDiscoverFootprints
  });

  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newReply, setNewReply] = useState('');

  const getCurrentFootprints = () => {
    switch (activeTab) {
      case 'my-footprints':
        return footprints.myFootprints;
      case 'friends-feed':
        return footprints.friendsFootprints;
      case 'discover-feed':
        return footprints.discoverFootprints;
      default:
        return [];
    }
  };

  const handleLike = (id: string) => {
    const updateFootprints = (items: Footprint[]) =>
      items.map(item => 
        item.id === id 
          ? { 
              ...item, 
              isLiked: !item.isLiked,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1
            }
          : item
      );

    setFootprints(prev => ({
      ...prev,
      myFootprints: updateFootprints(prev.myFootprints),
      friendsFootprints: updateFootprints(prev.friendsFootprints),
      discoverFootprints: updateFootprints(prev.discoverFootprints)
    }));
  };

  const handleReaction = (id: string, reaction: 'like' | 'love' | 'wow' | 'laugh' | 'sad' | 'angry') => {
    const updateFootprints = (items: Footprint[]) =>
      items.map(item => {
        if (item.id === id) {
          const newReactions = { ...item.reactions };
          
          // Remove previous reaction
          if (item.userReaction) {
            newReactions[item.userReaction] = Math.max(0, newReactions[item.userReaction] - 1);
          }
          
          // Add new reaction (or remove if same)
          if (item.userReaction === reaction) {
            return { ...item, userReaction: null, reactions: newReactions };
          } else {
            newReactions[reaction] = newReactions[reaction] + 1;
            return { ...item, userReaction: reaction, reactions: newReactions };
          }
        }
        return item;
      });

    setFootprints(prev => ({
      ...prev,
      myFootprints: updateFootprints(prev.myFootprints),
      friendsFootprints: updateFootprints(prev.friendsFootprints),
      discoverFootprints: updateFootprints(prev.discoverFootprints)
    }));
  };

  const handleBookmark = (id: string) => {
    const updateFootprints = (items: Footprint[]) =>
      items.map(item => 
        item.id === id 
          ? { ...item, isBookmarked: !item.isBookmarked }
          : item
      );

    setFootprints(prev => ({
      ...prev,
      myFootprints: updateFootprints(prev.myFootprints),
      friendsFootprints: updateFootprints(prev.friendsFootprints),
      discoverFootprints: updateFootprints(prev.discoverFootprints)
    }));
  };

  const handleFollow = (userId: string) => {
    const updateFootprints = (items: Footprint[]) =>
      items.map(item => 
        item.author.id === userId 
          ? { 
              ...item, 
              author: { ...item.author, isFollowing: !item.author.isFollowing }
            }
          : item
      );

    setFootprints(prev => ({
      ...prev,
      friendsFootprints: updateFootprints(prev.friendsFootprints),
      discoverFootprints: updateFootprints(prev.discoverFootprints)
    }));
  };

  const handleAddComment = (footprintId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        displayName: 'You',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: false
      },
      content: newComment.trim(),
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments(prev => ({
      ...prev,
      [footprintId]: [...(prev[footprintId] || []), comment]
    }));

    // Update comment count
    const updateFootprints = (items: Footprint[]) =>
      items.map(item => 
        item.id === footprintId 
          ? { ...item, comments: item.comments + 1 }
          : item
      );

    setFootprints(prev => ({
      ...prev,
      myFootprints: updateFootprints(prev.myFootprints),
      friendsFootprints: updateFootprints(prev.friendsFootprints),
      discoverFootprints: updateFootprints(prev.discoverFootprints)
    }));

    setNewComment('');
  };

  const handleAddReply = (footprintId: string, commentId: string) => {
    if (!newReply.trim()) return;

    const reply: Reply = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        displayName: 'You',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        isVerified: false
      },
      content: newReply.trim(),
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => ({
      ...prev,
      [footprintId]: prev[footprintId]?.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      ) || []
    }));

    setNewReply('');
    setReplyingTo(null);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getReactionEmoji = (reaction: string) => {
    const reactions = {
      like: '👍',
      love: '❤️',
      wow: '😮',
      laugh: '😂',
      sad: '😢',
      angry: '😠'
    };
    return reactions[reaction as keyof typeof reactions] || '👍';
  };

  const currentFootprints = getCurrentFootprints();

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Travel Stories</h1>
          <p className="text-gray-400 text-sm">Share your journey with the nomad community</p>
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
          className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            activeTab === 'my-footprints'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <User className="h-4 w-4" />
          <span>My Stories</span>
        </button>
        
        <button
          onClick={() => setActiveTab('friends-feed')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            activeTab === 'friends-feed'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Friends</span>
        </button>
        
        <button
          onClick={() => setActiveTab('discover-feed')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            activeTab === 'discover-feed'
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Discover</span>
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
              placeholder="Search stories..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm"
          >
            <option value="recent">Recent</option>
            <option value="popular">Popular</option>
            <option value="trending">Trending</option>
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

      {/* Feed Content */}
      <div className="space-y-6">
        {currentFootprints.map((footprint) => (
          <FootprintCard
            key={footprint.id}
            footprint={footprint}
            comments={comments[footprint.id] || []}
            onLike={handleLike}
            onReaction={handleReaction}
            onBookmark={handleBookmark}
            onFollow={handleFollow}
            onView={setSelectedFootprint}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            newComment={newComment}
            setNewComment={setNewComment}
            newReply={newReply}
            setNewReply={setNewReply}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            formatTimeAgo={formatTimeAgo}
            getReactionEmoji={getReactionEmoji}
            isMyFootprints={activeTab === 'my-footprints'}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentFootprints.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
            {activeTab === 'my-footprints' ? (
              <User className="h-8 w-8 text-white" />
            ) : activeTab === 'friends-feed' ? (
              <Users className="h-8 w-8 text-white" />
            ) : (
              <Globe className="h-8 w-8 text-white" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {activeTab === 'my-footprints' ? 'No Stories Yet' :
             activeTab === 'friends-feed' ? 'No Friend Stories' :
             'No Stories to Discover'}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {activeTab === 'my-footprints' ? 'Share your first travel story to get started' :
             activeTab === 'friends-feed' ? 'Connect with travelers to see their stories' :
             'Explore and discover amazing travel stories from the community'}
          </p>
          {activeTab === 'my-footprints' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 rounded-2xl font-semibold text-white"
            >
              Create Your First Story
            </button>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateFootprintModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* View Modal */}
      {selectedFootprint && (
        <ViewFootprintModal
          footprint={selectedFootprint}
          onClose={() => setSelectedFootprint(null)}
        />
      )}
    </div>
  );
}

function FootprintCard({ 
  footprint, 
  comments,
  onLike, 
  onReaction,
  onBookmark, 
  onFollow,
  onView,
  onAddComment,
  onAddReply,
  newComment,
  setNewComment,
  newReply,
  setNewReply,
  replyingTo,
  setReplyingTo,
  formatTimeAgo,
  getReactionEmoji,
  isMyFootprints
}: {
  footprint: Footprint;
  comments: Comment[];
  onLike: (id: string) => void;
  onReaction: (id: string, reaction: 'like' | 'love' | 'wow' | 'laugh' | 'sad' | 'angry') => void;
  onBookmark: (id: string) => void;
  onFollow: (userId: string) => void;
  onView: (footprint: Footprint) => void;
  onAddComment: (footprintId: string) => void;
  onAddReply: (footprintId: string, commentId: string) => void;
  newComment: string;
  setNewComment: (value: string) => void;
  newReply: string;
  setNewReply: (value: string) => void;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  formatTimeAgo: (date: Date) => string;
  getReactionEmoji: (reaction: string) => string;
  isMyFootprints: boolean;
}) {
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const reactions = ['like', 'love', 'wow', 'laugh', 'sad', 'angry'] as const;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
      {/* Author Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={footprint.author.avatar}
              alt={footprint.author.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-semibold">{footprint.author.displayName}</h3>
                {footprint.author.isVerified && (
                  <Verified className="h-4 w-4 text-blue-400 fill-current" />
                )}
                {footprint.author.badges.map((badge, index) => (
                  <span key={index} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                    {badge}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>{footprint.author.travelStyle}</span>
                <span>•</span>
                <span>{formatTimeAgo(footprint.timestamp)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isMyFootprints && !footprint.author.isFollowing && (
              <button
                onClick={() => onFollow(footprint.author.id)}
                className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white text-sm font-medium hover:shadow-lg transition-all duration-300"
              >
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
      {footprint.mediaType === 'photo' && (
        <div className="relative">
          <img
            src={footprint.mediaUrl as string}
            alt={footprint.title}
            className="w-full h-80 object-cover"
          />
        </div>
      )}

      {footprint.mediaType === 'gallery' && Array.isArray(footprint.mediaUrl) && (
        <div className="grid grid-cols-2 gap-1">
          {(footprint.mediaUrl as string[]).slice(0, 4).map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`${footprint.title} ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              {index === 3 && (footprint.mediaUrl as string[]).length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    +{(footprint.mediaUrl as string[]).length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {footprint.mediaType === 'video' && (
        <div className="relative h-80">
          <video
            src={footprint.mediaUrl as string}
            className="w-full h-full object-cover"
            poster="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Play className="h-8 w-8 text-white ml-1" />
            </button>
          </div>
        </div>
      )}

      {footprint.mediaType === 'voice' && (
        <div className="p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center"
            >
              {isPlaying ? (
                <Volume2 className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-1" />
              )}
            </button>
            <div className="flex-1">
              <div className="w-full h-2 bg-gray-700 rounded-full mb-2">
                <div className="w-1/3 h-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>1:23</span>
                <span>3:45</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Location and Context */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <MapPin className="h-3 w-3" />
            <span>{footprint.location}</span>
            {footprint.altitude && (
              <>
                <span>•</span>
                <span>{footprint.altitude}m</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {footprint.mood && (
              <span className="text-lg" title={`Mood: ${footprint.mood}`}>
                {footprint.mood === 'peaceful' ? '😌' :
                 footprint.mood === 'excited' ? '🤩' :
                 footprint.mood === 'spiritual' ? '🧘' :
                 footprint.mood === 'productive' ? '💪' : '😊'}
              </span>
            )}
            {footprint.weather && (
              <span className="text-lg" title={`Weather: ${footprint.weather}`}>
                {footprint.weather === 'sunny' ? '☀️' :
                 footprint.weather === 'cloudy' ? '☁️' :
                 footprint.weather === 'clear' ? '🌤️' :
                 footprint.weather === 'humid' ? '🌫️' : '🌤️'}
              </span>
            )}
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-semibold text-white mb-2">{footprint.title}</h3>
        <p className="text-gray-300 text-sm mb-3 leading-relaxed">{footprint.description}</p>

        {/* Travel Buddies */}
        {footprint.travelBuddies && footprint.travelBuddies.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-400 mb-1">With:</div>
            <div className="flex space-x-1">
              {footprint.travelBuddies.map((buddy, index) => (
                <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  @{buddy}
                </span>
              ))}
            </div>
          </div>
        )}

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

        {/* Reactions Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            {Object.entries(footprint.reactions)
              .filter(([_, count]) => count > 0)
              .slice(0, 3)
              .map(([reaction, count]) => (
                <div key={reaction} className="flex items-center space-x-1 bg-white/10 rounded-full px-2 py-1">
                  <span className="text-sm">{getReactionEmoji(reaction)}</span>
                  <span className="text-xs text-gray-400">{count}</span>
                </div>
              ))}
          </div>
          
          <div className="flex items-center space-x-4 text-gray-400 text-sm">
            <span>{footprint.comments} comments</span>
            <span>{footprint.shares} shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center space-x-1">
            {/* Like/Reaction Button */}
            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                  footprint.userReaction ? 'text-pink-400 bg-pink-500/10' : 'text-gray-400 hover:text-pink-400 hover:bg-pink-500/10'
                }`}
              >
                <span className="text-lg">
                  {footprint.userReaction ? getReactionEmoji(footprint.userReaction) : '👍'}
                </span>
                <span className="text-sm">
                  {footprint.userReaction ? footprint.userReaction : 'Like'}
                </span>
              </button>
              
              {/* Reaction Picker */}
              {showReactions && (
                <div className="absolute bottom-full left-0 mb-2 bg-black/90 backdrop-blur-md rounded-2xl p-2 border border-white/20 flex space-x-1">
                  {reactions.map((reaction) => (
                    <button
                      key={reaction}
                      onClick={() => {
                        onReaction(footprint.id, reaction);
                        setShowReactions(false);
                      }}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                      title={reaction}
                    >
                      <span className="text-xl">{getReactionEmoji(reaction)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">Comment</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onBookmark(footprint.id)}
              className={`p-2 rounded-full transition-colors ${
                footprint.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${footprint.isBookmarked ? 'fill-current' : ''}`} />
            </button>
            
            <button className="p-2 rounded-full text-gray-400 hover:text-green-400 transition-colors">
              <Share className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 border-t border-white/10 pt-4">
            {/* Add Comment */}
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="You"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && onAddComment(footprint.id)}
                />
                <button
                  onClick={() => onAddComment(footprint.id)}
                  disabled={!newComment.trim()}
                  className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* Main Comment */}
                  <div className="flex items-start space-x-3">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="bg-white/5 rounded-2xl p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium text-sm">{comment.author.displayName}</span>
                          {comment.author.isVerified && (
                            <Verified className="h-3 w-3 text-blue-400 fill-current" />
                          )}
                          <span className="text-gray-400 text-xs">{formatTimeAgo(comment.timestamp)}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.content}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-pink-400 transition-colors">
                          <Heart className={`h-3 w-3 ${comment.isLiked ? 'fill-current text-pink-400' : ''}`} />
                          <span>{comment.likes}</span>
                        </button>
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          Reply
                        </button>
                      </div>

                      {/* Reply Input */}
                      {replyingTo === comment.id && (
                        <div className="flex items-center space-x-2 mt-3">
                          <input
                            type="text"
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Write a reply..."
                            className="flex-1 px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && onAddReply(footprint.id, comment.id)}
                          />
                          <button
                            onClick={() => onAddReply(footprint.id, comment.id)}
                            disabled={!newReply.trim()}
                            className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      )}

                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-3 ml-4">
                              <img
                                src={reply.author.avatar}
                                alt={reply.author.displayName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="bg-white/5 rounded-xl p-2">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-white font-medium text-xs">{reply.author.displayName}</span>
                                    {reply.author.isVerified && (
                                      <Verified className="h-2 w-2 text-blue-400 fill-current" />
                                    )}
                                    <span className="text-gray-400 text-xs">{formatTimeAgo(reply.timestamp)}</span>
                                  </div>
                                  <p className="text-gray-300 text-xs">{reply.content}</p>
                                </div>
                                
                                <div className="flex items-center space-x-3 mt-1 text-xs">
                                  <button className="flex items-center space-x-1 text-gray-400 hover:text-pink-400 transition-colors">
                                    <Heart className={`h-2 w-2 ${reply.isLiked ? 'fill-current text-pink-400' : ''}`} />
                                    <span>{reply.likes}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CreateFootprintModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    mediaType: 'photo' as 'photo' | 'video' | 'voice' | 'gallery',
    visibility: 'public' as 'public' | 'private' | 'friends',
    tags: '',
    mood: 'happy',
    weather: 'sunny'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating footprint:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Share Your Story</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="What's your story about?"
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
                placeholder="Where did this happen?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Story</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                rows={4}
                placeholder="Share your experience..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="happy">😊 Happy</option>
                  <option value="excited">🤩 Excited</option>
                  <option value="peaceful">😌 Peaceful</option>
                  <option value="adventurous">🤠 Adventurous</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Weather</label>
                <select
                  value={formData.weather}
                  onChange={(e) => setFormData(prev => ({ ...prev, weather: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="sunny">☀️ Sunny</option>
                  <option value="cloudy">☁️ Cloudy</option>
                  <option value="rainy">🌧️ Rainy</option>
                </select>
              </div>
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="public">🌍 Public</option>
                <option value="friends">👥 Friends Only</option>
                <option value="private">🔒 Private</option>
              </select>
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
                Share Story
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
  onClose 
}: { 
  footprint: Footprint; 
  onClose: () => void;
}) {
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

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Story</h3>
              <p className="text-gray-300 text-sm">{footprint.description}</p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Location</h3>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{footprint.location}</span>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default FootprintsPage;