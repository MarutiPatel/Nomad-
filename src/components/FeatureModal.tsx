import React from 'react';
import { X, Shield, Users, MapPin, Zap, Globe, Heart, Eye, Camera, MessageCircle, Star, Trophy, Compass, Navigation, Utensils, Footprints, Radar, Target, Calendar, Lock, Smartphone, Wifi, AlertTriangle, Brain, Gamepad2, Coins, TreePine, Clock, Gift, Headphones, Map, Telescope, Sparkles, Wand2, Bot, Cpu, Headset as VrHeadset } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: string;
  details: string[];
}

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
}

const allFeatures: Feature[] = [
  // Account Creation & User Identity
  {
    id: 'anonymous-signup',
    title: 'Anonymous Sign-up',
    description: 'Privacy-first registration with no personal details required',
    icon: Shield,
    color: 'from-green-400 to-emerald-500',
    category: 'Account & Identity',
    details: [
      'Email or mobile number only',
      'No name, gender, or birthday required',
      'Random default names assigned',
      'Optional pseudonym creation',
      'Ghost mode for complete anonymity'
    ]
  },
  {
    id: 'shape-shifting-avatars',
    title: 'Shape-shifting Avatars',
    description: 'Avatars that morph based on your travel style and mood',
    icon: Users,
    color: 'from-purple-400 to-pink-500',
    category: 'Account & Identity',
    details: [
      'Visual morphing based on travel style',
      'Mood-responsive avatar changes',
      'Location-based transformations',
      'Minimalist profile design',
      'Privacy-focused identity system'
    ]
  },

  // Privacy & Security
  {
    id: 'anti-screenshot',
    title: 'Anti-Screenshot Protection',
    description: 'Advanced protection against unauthorized media sharing',
    icon: Eye,
    color: 'from-red-400 to-pink-500',
    category: 'Privacy & Security',
    details: [
      'Face detection in photos',
      'Screenshot prevention for sensitive content',
      'Consent-based media downloads',
      'Encrypted storage system',
      'GDPR & CCPA compliance'
    ]
  },
  {
    id: 'digital-detox',
    title: 'Digital Detox Mode',
    description: 'Mindful travel with limited notifications',
    icon: Smartphone,
    color: 'from-blue-400 to-cyan-500',
    category: 'Privacy & Security',
    details: [
      'Limited app features during detox',
      'Essential safety alerts remain active',
      'Location tracking for emergencies',
      'Customizable detox duration',
      'Mindful travel encouragement'
    ]
  },
  {
    id: 'encrypted-storage',
    title: 'Encrypted Storage',
    description: 'Military-grade encryption for all user data',
    icon: Lock,
    color: 'from-purple-400 to-indigo-500',
    category: 'Privacy & Security',
    details: [
      'End-to-end encryption',
      'Zero-knowledge architecture',
      'Secure data export/deletion',
      'GDPR & CCPA compliance',
      'Regular security audits'
    ]
  },
  {
    id: 'otp-verification',
    title: 'OTP Verification',
    description: 'Enhanced security for unknown device logins',
    icon: Smartphone,
    color: 'from-orange-400 to-red-500',
    category: 'Privacy & Security',
    details: [
      'Unknown device detection',
      'SMS/Email OTP verification',
      'Device fingerprinting',
      'Login attempt monitoring',
      'Account security alerts'
    ]
  },

  // Travel Footprints & Memories
  {
    id: 'digital-footprints',
    title: 'Digital Footprints',
    description: 'Leave your mark and discover paths of fellow travelers',
    icon: Footprints,
    color: 'from-orange-400 to-pink-500',
    category: 'Footprints & Memories',
    details: [
      'Geotagged travel moments',
      'Photos, notes, and local tips',
      'Public, private, or friends-only visibility',
      'Smart organization by region and date',
      'Travel footprint heatmap visualization'
    ]
  },
  {
    id: 'time-capsules',
    title: 'Time Capsule Trips',
    description: 'Lock memories that unlock at future dates or locations',
    icon: Clock,
    color: 'from-yellow-400 to-orange-500',
    category: 'Footprints & Memories',
    details: [
      'Date-locked memory capsules',
      'Location-triggered unlocks',
      'Private voice and photo memories',
      'Footprint capsules at destinations',
      'Memory timeline organization'
    ]
  },
  {
    id: 'nft-memories',
    title: 'NFT Memories',
    description: 'Own and trade your unique travel experiences',
    icon: Coins,
    color: 'from-purple-400 to-indigo-500',
    category: 'Footprints & Memories',
    details: [
      'Footprint NFT creation',
      'Memory ownership verification',
      'Trading marketplace',
      'Unique travel certificates',
      'Blockchain-secured experiences'
    ]
  },
  {
    id: 'travel-journal',
    title: 'Travel Journal',
    description: 'Private voice and photo memories per place',
    icon: Camera,
    color: 'from-blue-400 to-cyan-500',
    category: 'Footprints & Memories',
    details: [
      'Voice note recordings',
      'Private photo collections',
      'Location-based organization',
      'Mood and weather tracking',
      'Personal reflection space'
    ]
  },
  {
    id: 'travel-heatmap',
    title: 'Travel Heatmap',
    description: 'Visualize your journey with interactive heatmaps',
    icon: Map,
    color: 'from-red-400 to-orange-500',
    category: 'Footprints & Memories',
    details: [
      'Visual travel intensity mapping',
      'Journey statistics and insights',
      'Time-based travel patterns',
      'Distance and frequency tracking',
      'Shareable travel visualizations'
    ]
  },

  // Social & Community
  {
    id: 'buddy-radar',
    title: 'Travel Buddy Radar',
    description: 'AI-powered proximity matching with fellow travelers',
    icon: Radar,
    color: 'from-cyan-400 to-blue-500',
    category: 'Social & Community',
    details: [
      'Real-time traveler detection',
      'Interest and style filtering',
      'Privacy controls',
      'Anonymous connection options',
      'Group travel matching'
    ]
  },
  {
    id: 'disappearing-chats',
    title: 'Disappearing Chats',
    description: 'Anonymous conversations that vanish after your journey',
    icon: MessageCircle,
    color: 'from-green-400 to-teal-500',
    category: 'Social & Community',
    details: [
      'Auto-disappearing messages',
      'Self-destructing media',
      'Anonymous chat system',
      'Journey-based message lifecycle',
      'End-to-end encryption'
    ]
  },
  {
    id: 'ar-world-tags',
    title: 'AR World Tags',
    description: 'Leave augmented reality messages at locations',
    icon: Camera,
    color: 'from-pink-400 to-rose-500',
    category: 'Social & Community',
    details: [
      'AR message placement',
      'Location-based tips and reviews',
      'App-exclusive AR visibility',
      'Interactive location experiences',
      'Community-driven content'
    ]
  },
  {
    id: 'virtual-postcards',
    title: 'Virtual Postcards',
    description: 'Send disappearing postcards with photos and messages',
    icon: Gift,
    color: 'from-indigo-400 to-purple-500',
    category: 'Social & Community',
    details: [
      'Photo and video postcards',
      'Timed disappearing messages',
      'Community sharing options',
      'Personal message system',
      'Travel memory sharing'
    ]
  },
  {
    id: 'nomad-whisper',
    title: 'Nomad Whisper',
    description: 'Silent proximity matching without forced interaction',
    icon: Headphones,
    color: 'from-teal-400 to-cyan-500',
    category: 'Social & Community',
    details: [
      'Silent meetup notifications',
      'Like-minded traveler detection',
      'No pressure interaction',
      'Subtle connection opportunities',
      'Respect for personal space'
    ]
  },
  {
    id: 'crowd-controlled-events',
    title: 'Crowd-Controlled Events',
    description: 'Real-time voting on meetup locations and activities',
    icon: Users,
    color: 'from-orange-400 to-red-500',
    category: 'Social & Community',
    details: [
      'Real-time location voting',
      'Dynamic meetup planning',
      'Community-driven events',
      'Majority-based decisions',
      'Flexible event locations'
    ]
  },
  {
    id: 'dreamcatcher-feed',
    title: 'Dreamcatcher Feed',
    description: 'Share travel dreams and get community support',
    icon: Sparkles,
    color: 'from-purple-400 to-pink-500',
    category: 'Social & Community',
    details: [
      'Travel dream sharing',
      'Bucket list posting',
      'Community advice and tips',
      'Surprise trip funding',
      'Dream fulfillment support'
    ]
  },
  {
    id: 'local-public-feed',
    title: 'Local Public Feed',
    description: 'Community updates and real-time local information',
    icon: Globe,
    color: 'from-blue-400 to-cyan-500',
    category: 'Social & Community',
    details: [
      'Location-based community feed',
      'Real-time local updates',
      'Traveler tips and warnings',
      'Event announcements',
      'Community pulse monitoring'
    ]
  },

  // Discovery & Exploration
  {
    id: 'doppelarting-discovery',
    title: 'Doppelarting Discovery',
    description: 'Find your travel twin through AI vibe matching',
    icon: Target,
    color: 'from-purple-400 to-pink-500',
    category: 'Discovery & Exploration',
    details: [
      'AI-powered vibe analysis',
      'Travel twin matching',
      'Personality-based connections',
      'Compatible traveler discovery',
      'Deep compatibility scoring'
    ]
  },
  {
    id: 'teleport-roulette',
    title: 'Teleport Roulette',
    description: 'Spin the wheel for random destination discovery',
    icon: Compass,
    color: 'from-cyan-400 to-purple-500',
    category: 'Discovery & Exploration',
    details: [
      'Random destination selection',
      'Nearby and faraway options',
      'Spontaneous adventure planning',
      'Surprise travel suggestions',
      'Adventure wheel spinning'
    ]
  },
  {
    id: 'mood-based-suggestions',
    title: 'Mood-Based Suggestions',
    description: 'Travel recommendations based on your current mood',
    icon: Heart,
    color: 'from-pink-400 to-rose-500',
    category: 'Discovery & Exploration',
    details: [
      'Mood detection and analysis',
      'Personalized activity suggestions',
      'Emotional travel matching',
      'Vibe-based recommendations',
      'Mood-responsive planning'
    ]
  },
  {
    id: 'stargazer-mode',
    title: 'Stargazer Mode',
    description: 'Astronomy-based travel filtering and suggestions',
    icon: Telescope,
    color: 'from-indigo-400 to-blue-500',
    category: 'Discovery & Exploration',
    details: [
      'Astronomy-based location filtering',
      'Stargazing spot recommendations',
      'Celestial event notifications',
      'Dark sky location discovery',
      'Astronomical travel planning'
    ]
  },
  {
    id: 'dreamscape-mode',
    title: 'Dreamscape Mode',
    description: 'AI creates surreal itineraries mixing reality with VR/AR',
    icon: Wand2,
    color: 'from-purple-400 to-pink-500',
    category: 'Discovery & Exploration',
    details: [
      'Dream trip description input',
      'AI-generated surreal itineraries',
      'Real place and VR/AR mixing',
      'Fantasy travel experiences',
      'Immersive journey creation'
    ]
  },
  {
    id: 'nomad-time-machine',
    title: 'Nomad Time Machine',
    description: 'See historical versions of locations through AR',
    icon: Clock,
    color: 'from-orange-400 to-yellow-500',
    category: 'Discovery & Exploration',
    details: [
      'Historical location visualization',
      'AR historical overlays',
      'AI-generated past visuals',
      'Time travel experiences',
      'Educational historical content'
    ]
  },

  // Food & Utility Discovery
  {
    id: 'food-discovery',
    title: 'Food Discovery Engine',
    description: 'Find traveler-reviewed local food spots and hidden gems',
    icon: Utensils,
    color: 'from-green-400 to-emerald-500',
    category: 'Food & Utility',
    details: [
      'Traveler-reviewed food spots',
      'Local Dhabas and hidden joints',
      'Geo-tagged food suggestions',
      'Time-aware recommendations',
      'Community-powered food discovery'
    ]
  },
  {
    id: 'utility-discovery',
    title: 'Utility Discovery',
    description: 'Find camping sites, parking, restrooms, and emergency services',
    icon: MapPin,
    color: 'from-blue-400 to-cyan-500',
    category: 'Food & Utility',
    details: [
      'Camping site locations',
      'Safe parking zones',
      'Clean restroom listings',
      'Emergency service locations',
      'Charging station finder'
    ]
  },
  {
    id: 'travel-planning-assistant',
    title: 'Travel Planning Assistant',
    description: 'AI-powered itinerary and route suggestions',
    icon: Navigation,
    color: 'from-yellow-400 to-orange-500',
    category: 'Food & Utility',
    details: [
      'Curated route planning',
      'Must-visit stop suggestions',
      'Food spot recommendations',
      'Footprint integration',
      'Cost estimation tools'
    ]
  },
  {
    id: 'cost-estimator',
    title: 'Cost Estimator',
    description: 'Average per-day living cost calculator for locations',
    icon: Calendar,
    color: 'from-green-400 to-teal-500',
    category: 'Food & Utility',
    details: [
      'Daily budget calculations',
      'Location-based cost analysis',
      'Accommodation price ranges',
      'Food and transport costs',
      'Activity expense estimates'
    ]
  },

  // Gamification & Rewards
  {
    id: 'travel-karma',
    title: 'Travel Karma System',
    description: 'Earn rewards for good deeds and eco-friendly actions',
    icon: Star,
    color: 'from-green-400 to-teal-500',
    category: 'Gamification & Rewards',
    details: [
      'Good deed tracking',
      'Eco-friendly action rewards',
      'Secret location unlocks',
      'Exclusive experience access',
      'Volunteer opportunity rewards'
    ]
  },
  {
    id: 'mystery-challenges',
    title: 'Mystery Travel Challenges',
    description: 'Surprise quests based on your route and interests',
    icon: Trophy,
    color: 'from-purple-400 to-indigo-500',
    category: 'Gamification & Rewards',
    details: [
      'Route-based surprise quests',
      'Interest-driven challenges',
      'Badge and reward unlocks',
      'Achievement system',
      'Progress tracking'
    ]
  },
  {
    id: 'alien-tourist-mode',
    title: 'Alien Tourist Mode',
    description: 'Play as an alien exploring Earth culture',
    icon: Gamepad2,
    color: 'from-cyan-400 to-purple-500',
    category: 'Gamification & Rewards',
    details: [
      'Alien perspective gameplay',
      'Cultural understanding missions',
      'Cuisine exploration quests',
      'Landmark discovery challenges',
      'Human culture learning'
    ]
  },
  {
    id: 'teleport-wormholes',
    title: 'Teleport Wormholes',
    description: 'Visualize travel routes as wormholes across continents',
    icon: Zap,
    color: 'from-orange-400 to-pink-500',
    category: 'Gamification & Rewards',
    details: [
      'Wormhole route visualization',
      'Instant continent warping',
      'Criteria-based unlocks',
      'Mini-game integration',
      'Visual travel representation'
    ]
  },
  {
    id: 'achievement-badges',
    title: 'Achievement Badges',
    description: 'Unlock badges for travel milestones and activities',
    icon: Trophy,
    color: 'from-yellow-400 to-orange-500',
    category: 'Gamification & Rewards',
    details: [
      'Milestone-based achievements',
      'Activity completion badges',
      'Rare and legendary rewards',
      'Social recognition system',
      'Progress visualization'
    ]
  },
  {
    id: 'leaderboards',
    title: 'Traveler Leaderboards',
    description: 'Compete with nomads worldwide for top spots',
    icon: Star,
    color: 'from-purple-400 to-pink-500',
    category: 'Gamification & Rewards',
    details: [
      'Global traveler rankings',
      'Category-based leaderboards',
      'Monthly competitions',
      'Achievement showcases',
      'Community recognition'
    ]
  },

  // Safety & Alerts
  {
    id: 'ai-safety-alerts',
    title: 'AI Safety Alerts',
    description: 'Real-time safety monitoring and emergency notifications',
    icon: AlertTriangle,
    color: 'from-red-400 to-orange-500',
    category: 'Safety & Alerts',
    details: [
      'Real-time safety monitoring',
      'Emergency notifications',
      'Local hazard alerts',
      'Community safety reports',
      'AI threat assessment'
    ]
  },
  {
    id: 'crowdsourced-alerts',
    title: 'Crowdsourced Safety Alerts',
    description: 'Anonymous community reporting of hazards and emergencies',
    icon: Users,
    color: 'from-yellow-400 to-red-500',
    category: 'Safety & Alerts',
    details: [
      'Anonymous hazard reporting',
      'Real-time emergency alerts',
      'Community safety network',
      'Protest and incident warnings',
      'Traveler safety collaboration'
    ]
  },
  {
    id: 'emergency-button',
    title: 'Emergency Button',
    description: 'One-tap emergency assistance and location sharing',
    icon: AlertTriangle,
    color: 'from-red-500 to-pink-500',
    category: 'Safety & Alerts',
    details: [
      'One-tap emergency activation',
      'Automatic location sharing',
      'Emergency contact notification',
      'Local emergency services',
      'Real-time assistance coordination'
    ]
  },
  {
    id: 'community-pulse',
    title: 'Community Pulse',
    description: 'Real-time updates on crowds, weather, and incidents',
    icon: Zap,
    color: 'from-blue-400 to-cyan-500',
    category: 'Safety & Alerts',
    details: [
      'Real-time crowd monitoring',
      'Weather condition updates',
      'Incident reporting system',
      'Traffic and road conditions',
      'Community-driven alerts'
    ]
  },

  // AI & Personalization
  {
    id: 'nomad-ai-twin',
    title: 'Nomad AI Twin',
    description: 'Personal AI travel assistant that learns your preferences',
    icon: Bot,
    color: 'from-blue-400 to-purple-500',
    category: 'AI & Personalization',
    details: [
      'Personal AI assistant',
      'Preference learning system',
      'Travel style understanding',
      'Adaptive recommendations',
      'Continuous improvement'
    ]
  },
  {
    id: 'ai-personalization',
    title: 'AI-Powered Personalization',
    description: 'Smart recommendations for buddies, destinations, and experiences',
    icon: Brain,
    color: 'from-purple-400 to-pink-500',
    category: 'AI & Personalization',
    details: [
      'Buddy matching algorithms',
      'Destination recommendations',
      'Food spot suggestions',
      'Experience personalization',
      'Preference adaptation'
    ]
  },
  {
    id: 'future-tech-ready',
    title: 'Future Tech Ready',
    description: 'Built for AI, AGI, VR, and neural technology integration',
    icon: Cpu,
    color: 'from-cyan-400 to-indigo-500',
    category: 'AI & Personalization',
    details: [
      'AGI integration ready',
      'VR experience support',
      'Neural interface preparation',
      'Scalable AI infrastructure',
      'Next-gen technology adoption'
    ]
  },
  {
    id: 'packing-assistant',
    title: 'AI Packing Assistant',
    description: 'Smart packing suggestions based on destination and weather',
    icon: Calendar,
    color: 'from-green-400 to-teal-500',
    category: 'AI & Personalization',
    details: [
      'Weather-based packing lists',
      'Destination-specific suggestions',
      'Activity-based recommendations',
      'Weight and space optimization',
      'Personalized packing profiles'
    ]
  }
];

export default function FeatureModal({ isOpen, onClose, selectedCategory }: FeatureModalProps) {
  if (!isOpen) return null;

  const categoryFeatures = allFeatures.filter(feature => feature.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {selectedCategory}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {categoryFeatures.map((feature) => (
              <div key={feature.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-start space-x-4 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {feature.details.map((detail, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}