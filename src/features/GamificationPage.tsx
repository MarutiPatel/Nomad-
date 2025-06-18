import React, { useState } from 'react';
import { 
  Trophy, Star, Heart, Zap, Target, Gift, Crown, 
  Map, Compass, Camera, Users, TreePine, Coins,
  Calendar, Clock, CheckCircle, Lock, Unlock
} from 'lucide-react';

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
}

function GamificationPage() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'karma' | 'challenges' | 'leaderboard'>('achievements');

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
      icon: Map,
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
      isCompleted: false
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
      isCompleted: false
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
      isCompleted: true
    }
  ];

  const [achievements] = useState(mockAchievements);
  const [karmaActions] = useState(mockKarmaActions);
  const [challenges] = useState(mockChallenges);

  const totalKarmaPoints = karmaActions
    .filter(action => action.completedAt)
    .reduce((sum, action) => sum + action.points, 0);

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

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Nomad Rewards</h1>
        <p className="text-gray-400 text-sm">Earn karma, unlock achievements, complete challenges</p>
      </div>

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

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto space-x-1 bg-black/20 rounded-2xl p-1 mb-6">
        {[
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'karma', label: 'Karma', icon: Heart },
          { id: 'challenges', label: 'Challenges', icon: Target },
          { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'achievements' && (
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

      {activeTab === 'karma' && (
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

      {activeTab === 'challenges' && (
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
                      <span className="text-xs text-gray-400">
                        {challenge.progress}/{challenge.maxProgress}
                      </span>
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
                      Reward: {challenge.reward}
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

      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-3xl p-6 border border-yellow-400/30 text-center">
            <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Global Leaderboard</h2>
            <p className="text-gray-400 text-sm">Top nomads this month</p>
          </div>

          {/* Leaderboard entries would go here */}
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-400 text-sm">
              Compete with nomads worldwide for the top spots
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamificationPage;