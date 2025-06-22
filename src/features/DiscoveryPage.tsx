import React, { useState, useEffect } from 'react';
import { Target, Compass, Wand2, Clock, Star, MapPin, Shuffle, Filter, Search, Zap, Globe, Camera, Heart, Users, Play, RefreshCw, Sparkles, Map, Navigation, Eye, Brain, Magnet as Magic, Telescope, ArrowRight, CheckCircle, Timer, Mountain, Plane, Coffee, Utensils, Music } from 'lucide-react';

interface DiscoveryItem {
  id: string;
  type: 'destination' | 'experience' | 'food' | 'hidden-gem';
  title: string;
  description: string;
  location: string;
  image: string;
  rating: number;
  distance: number;
  tags: string[];
  price?: 'free' | 'budget' | 'moderate' | 'premium';
  isAIRecommended?: boolean;
}

interface TravelTwin {
  id: string;
  displayName: string;
  avatar: string;
  compatibility: number;
  commonInterests: string[];
  location: string;
  bio: string;
  travelStyle: string;
}

interface TeleportDestination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  distance: number;
  highlights: string[];
  bestTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface DreamItinerary {
  id: string;
  title: string;
  description: string;
  days: DreamDay[];
  totalBudget: string;
  realPlaces: number;
  vrExperiences: number;
}

interface DreamDay {
  day: number;
  title: string;
  activities: DreamActivity[];
  type: 'real' | 'vr' | 'mixed';
}

interface DreamActivity {
  time: string;
  activity: string;
  type: 'real' | 'vr' | 'ar';
  location: string;
  description: string;
}

interface HistoricalPeriod {
  id: string;
  era: string;
  year: string;
  title: string;
  description: string;
  arFeatures: string[];
  image: string;
}

function DiscoveryPage() {
  const [activeTab, setActiveTab] = useState<'doppelarting' | 'teleport' | 'dreamscape' | 'timemachine'>('doppelarting');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTimeTravel, setIsTimeTravel] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [dreamInput, setDreamInput] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState<DreamItinerary | null>(null);
  const [foundTwin, setFoundTwin] = useState<TravelTwin | null>(null);
  const [teleportResult, setTeleportResult] = useState<TeleportDestination | null>(null);
  const [selectedEra, setSelectedEra] = useState<HistoricalPeriod | null>(null);

  const mockTravelTwins: TravelTwin[] = [
    {
      id: '1',
      displayName: 'CosmicWanderer88',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      compatibility: 94,
      commonInterests: ['hidden beaches', 'local food', 'photography', 'sunset viewing'],
      location: 'Currently in Goa, India',
      bio: 'Love exploring hidden gems and authentic experiences',
      travelStyle: 'Adventure Seeker'
    },
    {
      id: '2',
      displayName: 'ZenNomad42',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      compatibility: 87,
      commonInterests: ['meditation', 'mountains', 'spiritual journeys', 'yoga'],
      location: 'Himalayan Region',
      bio: 'Seeking peace and meaningful connections through travel',
      travelStyle: 'Spiritual Seeker'
    },
    {
      id: '3',
      displayName: 'UrbanExplorer',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      compatibility: 91,
      commonInterests: ['tech hubs', 'coworking', 'urban culture', 'nightlife'],
      location: 'Bangalore, India',
      bio: 'Digital nomad exploring tech cities and startup culture',
      travelStyle: 'Digital Nomad'
    }
  ];

  const teleportDestinations: TeleportDestination[] = [
    {
      id: '1',
      name: 'Dudhsagar Falls',
      country: 'Goa, India',
      description: 'Spectacular 4-tier waterfall cascading down from 1017 feet',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: 45,
      highlights: ['Train ride through falls', 'Natural swimming pool', 'Monsoon season best'],
      bestTime: 'June to September',
      difficulty: 'medium'
    },
    {
      id: '2',
      name: 'Hampi Ruins',
      country: 'Karnataka, India',
      description: 'Ancient Vijayanagara Empire ruins with surreal boulder landscapes',
      image: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: 320,
      highlights: ['UNESCO World Heritage', 'Sunrise at Matanga Hill', 'Ancient temples'],
      bestTime: 'October to March',
      difficulty: 'easy'
    },
    {
      id: '3',
      name: 'Valley of Flowers',
      country: 'Uttarakhand, India',
      description: 'Alpine valley with endemic flora and breathtaking mountain views',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: 650,
      highlights: ['Rare Himalayan flowers', 'Snow leopard habitat', 'Nanda Devi views'],
      bestTime: 'July to September',
      difficulty: 'hard'
    },
    {
      id: '4',
      name: 'Backwaters of Alleppey',
      country: 'Kerala, India',
      description: 'Serene network of canals, rivers, and lakes with houseboat experiences',
      image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: 280,
      highlights: ['Houseboat stays', 'Village life glimpses', 'Traditional cuisine'],
      bestTime: 'September to March',
      difficulty: 'easy'
    },
    {
      id: '5',
      name: 'Spiti Valley',
      country: 'Himachal Pradesh, India',
      description: 'Cold desert mountain valley with ancient monasteries and stark beauty',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: 580,
      highlights: ['Key Monastery', 'Fossil discoveries', 'Star gazing'],
      bestTime: 'May to October',
      difficulty: 'hard'
    }
  ];

  const historicalPeriods: HistoricalPeriod[] = [
    {
      id: '1',
      era: 'Mughal Empire',
      year: '1500s-1700s',
      title: 'Golden Age of Mughal Architecture',
      description: 'Experience the grandeur of Mughal courts and witness the construction of iconic monuments',
      arFeatures: ['Royal court ceremonies', 'Architecture blueprints', 'Historical figures', 'Period costumes'],
      image: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      era: 'Portuguese Colonial',
      year: '1500s-1961',
      title: 'Portuguese Goa - Old World Charm',
      description: 'See Goa during Portuguese rule with colonial architecture and European influence',
      arFeatures: ['Colonial buildings', 'Trade routes', 'Cultural fusion', 'Historical maps'],
      image: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      era: 'Vijayanagara Empire',
      year: '1336-1646',
      title: 'Hampi in its Prime',
      description: 'Witness the magnificent capital city of Vijayanagara at its zenith',
      arFeatures: ['Bustling markets', 'Royal processions', 'Temple ceremonies', 'Ancient city life'],
      image: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      era: 'Hippie Movement',
      year: '1960s-1970s',
      title: 'Goa\'s Flower Power Era',
      description: 'Experience the counterculture movement that put Goa on the global map',
      arFeatures: ['Beach parties', 'Music festivals', 'Bohemian lifestyle', 'Cultural revolution'],
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const moods = [
    { emoji: '🌅', label: 'Peaceful', color: 'from-blue-400 to-cyan-500' },
    { emoji: '🏔️', label: 'Adventurous', color: 'from-orange-400 to-red-500' },
    { emoji: '🎨', label: 'Creative', color: 'from-purple-400 to-pink-500' },
    { emoji: '🍜', label: 'Foodie', color: 'from-green-400 to-teal-500' },
    { emoji: '🎉', label: 'Social', color: 'from-yellow-400 to-orange-500' },
    { emoji: '🧘', label: 'Spiritual', color: 'from-indigo-400 to-purple-500' }
  ];

  const handleFindTwin = async () => {
    setIsAnalyzing(true);
    setFoundTwin(null);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const randomTwin = mockTravelTwins[Math.floor(Math.random() * mockTravelTwins.length)];
    setFoundTwin(randomTwin);
    setIsAnalyzing(false);
  };

  const handleTeleportSpin = async () => {
    setIsSpinning(true);
    setTeleportResult(null);
    
    // Simulate spinning and destination selection
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const randomDestination = teleportDestinations[Math.floor(Math.random() * teleportDestinations.length)];
    setTeleportResult(randomDestination);
    setIsSpinning(false);
  };

  const generateDreamItinerary = async () => {
    if (!dreamInput.trim()) return;
    
    setIsGenerating(true);
    setGeneratedItinerary(null);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const dreamItinerary: DreamItinerary = {
      id: '1',
      title: 'Floating Temple Cloud Journey',
      description: 'A surreal blend of ancient spiritual sites with cloud-walking VR experiences',
      days: [
        {
          day: 1,
          title: 'Celestial Temple Entry',
          type: 'mixed',
          activities: [
            {
              time: '09:00',
              activity: 'Visit Golden Temple',
              type: 'real',
              location: 'Amritsar, Punjab',
              description: 'Start with the real Golden Temple for spiritual grounding'
            },
            {
              time: '14:00',
              activity: 'Cloud Walking Experience',
              type: 'vr',
              location: 'VR Sky Temple',
              description: 'Float through clouds while visiting ethereal temples'
            },
            {
              time: '18:00',
              activity: 'Taste Celestial Flavors',
              type: 'ar',
              location: 'Sky Cafe',
              description: 'Cotton candy that tastes like different clouds'
            }
          ]
        },
        {
          day: 2,
          title: 'Ancient Mysteries Unveiled',
          type: 'vr',
          activities: [
            {
              time: '10:00',
              activity: 'Time Portal Temple Tour',
              type: 'vr',
              location: 'Virtual Angkor Wat',
              description: 'Experience temples from different time periods'
            },
            {
              time: '15:00',
              activity: 'Levitating Meditation',
              type: 'vr',
              location: 'Floating Lotus Garden',
              description: 'Meditate while floating above a mystical garden'
            }
          ]
        }
      ],
      totalBudget: '₹15,000',
      realPlaces: 1,
      vrExperiences: 4
    };
    
    setGeneratedItinerary(dreamItinerary);
    setIsGenerating(false);
  };

  const activateTimeTravel = async (period: HistoricalPeriod) => {
    setIsTimeTravel(true);
    setSelectedEra(null);
    
    // Simulate time travel activation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setSelectedEra(period);
    setIsTimeTravel(false);
  };

  const renderDoppelarting = () => (
    <div className="space-y-6">
      {/* AI Twin Matching */}
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Find Your Travel Twin</h2>
          <p className="text-gray-400 text-sm">AI analyzes your vibe to find your perfect travel doppelganger</p>
        </div>

        {!isAnalyzing && !foundTwin && (
          <div className="bg-white/5 rounded-2xl p-4 mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">Ready to find your travel twin?</div>
                <div className="text-gray-400 text-sm">AI will analyze your travel patterns and preferences</div>
              </div>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="bg-white/5 rounded-2xl p-4 mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
              <div>
                <div className="text-white font-medium">Analyzing your travel patterns...</div>
                <div className="text-gray-400 text-sm">Finding compatibility matches...</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Travel style analysis</span>
                <span className="text-cyan-400">Complete ✓</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Interest matching</span>
                <span className="text-yellow-400">In progress...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Compatibility scoring</span>
                <span className="text-gray-500">Pending</span>
              </div>
            </div>
          </div>
        )}

        {foundTwin && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-4 border border-green-400/30 mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium text-sm">Perfect Match Found!</span>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={foundTwin.avatar}
                alt={foundTwin.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-white font-semibold">{foundTwin.displayName}</h3>
                <p className="text-gray-400 text-sm">{foundTwin.location}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Heart className="h-3 w-3 text-pink-400 fill-current" />
                  <span className="text-pink-400 text-sm font-medium">{foundTwin.compatibility}% match</span>
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-gray-300 text-sm mb-2">{foundTwin.bio}</p>
              <div className="text-xs text-gray-400 mb-2">Common interests:</div>
              <div className="flex flex-wrap gap-1">
                {foundTwin.commonInterests.map((interest, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleFindTwin}
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          {isAnalyzing ? 'Analyzing...' : foundTwin ? 'Find Another Twin' : 'Find My Travel Twin'}
        </button>
      </div>

      {/* Mood-Based Suggestions */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
        <h3 className="text-white font-semibold mb-4">What's your current travel mood?</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {moods.map((mood, index) => (
            <button
              key={index}
              onClick={() => setSelectedMood(mood.label)}
              className={`p-3 rounded-xl text-center transition-all duration-300 ${
                selectedMood === mood.label
                  ? `bg-gradient-to-r ${mood.color} bg-opacity-20 border border-white/20`
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs text-gray-300">{mood.label}</div>
            </button>
          ))}
        </div>
        
        {selectedMood && (
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-3 border border-cyan-400/30">
            <div className="text-cyan-400 text-sm font-medium">
              Perfect! Here are {selectedMood.toLowerCase()} experiences near you...
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-xs text-gray-300">• Sunset meditation spots</div>
              <div className="text-xs text-gray-300">• Peaceful hiking trails</div>
              <div className="text-xs text-gray-300">• Zen cafes and quiet retreats</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTeleportRoulette = () => (
    <div className="space-y-6">
      {/* Roulette Wheel */}
      <div className="bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10 text-center">
        <div className="mb-6">
          <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center ${
            isSpinning ? 'animate-spin' : ''
          }`}>
            <Shuffle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Teleport Roulette</h2>
          <p className="text-gray-400 text-sm">Spin the wheel for spontaneous adventure discovery</p>
        </div>

        {!isSpinning && !teleportResult && (
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <button className="px-4 py-2 bg-white/10 rounded-xl text-gray-300 text-sm border border-white/10">
                Nearby (50km)
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl text-cyan-400 text-sm border border-cyan-400/30">
                Adventure (500km+)
              </button>
            </div>
          </div>
        )}

        {isSpinning && (
          <div className="mt-4 text-center">
            <div className="text-orange-400 text-sm animate-pulse mb-3">
              🌟 Spinning through destinations...
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div>Scanning: Mountain adventures</div>
              <div>Found: Beach escapes</div>
              <div>Checking: Cultural sites</div>
              <div>Discovering: Hidden gems</div>
            </div>
          </div>
        )}

        {teleportResult && (
          <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl p-4 border border-green-400/30 mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium text-sm">Destination Found!</span>
            </div>
            
            <div className="mb-4">
              <img
                src={teleportResult.image}
                alt={teleportResult.name}
                className="w-full h-32 object-cover rounded-xl mb-3"
              />
              <h3 className="text-white font-semibold text-lg">{teleportResult.name}</h3>
              <p className="text-gray-400 text-sm">{teleportResult.country} • {teleportResult.distance}km away</p>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{teleportResult.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="text-xs text-green-400 font-medium">Highlights:</div>
              {teleportResult.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs text-gray-300">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
              <div>
                <span className="text-gray-400">Best time:</span>
                <div className="text-cyan-400">{teleportResult.bestTime}</div>
              </div>
              <div>
                <span className="text-gray-400">Difficulty:</span>
                <div className={`${
                  teleportResult.difficulty === 'easy' ? 'text-green-400' :
                  teleportResult.difficulty === 'medium' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {teleportResult.difficulty}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleTeleportSpin}
          disabled={isSpinning}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-4 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          {isSpinning ? 'Spinning the Wheel...' : teleportResult ? 'Spin Again' : 'Spin the Wheel'}
        </button>
      </div>

      {/* Recent Discoveries */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
        <h3 className="text-white font-semibold mb-4">Recent Teleport Discoveries</h3>
        <div className="space-y-3">
          {teleportDestinations.slice(0, 3).map((destination) => (
            <div key={destination.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{destination.name}</div>
                <div className="text-gray-400 text-xs">{destination.country} • {destination.distance}km away</div>
              </div>
              <button className="text-cyan-400 text-xs">Explore</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDreamscape = () => (
    <div className="space-y-6">
      {/* Dream Input */}
      <div className="bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-full flex items-center justify-center">
            <Wand2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Dreamscape Mode</h2>
          <p className="text-gray-400 text-sm">Describe your dream trip and AI creates a surreal itinerary</p>
        </div>

        <div className="space-y-4">
          <textarea
            value={dreamInput}
            onChange={(e) => setDreamInput(e.target.value)}
            placeholder="Describe your dream adventure... (e.g., 'I want to feel like I'm floating through ancient temples while tasting clouds')"
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
            rows={3}
          />
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setDreamInput('I want to swim with glowing dolphins while ancient ruins float around me in zero gravity')}
              className="p-2 bg-white/10 rounded-lg text-gray-300 hover:bg-white/20 transition-colors"
            >
              Floating Ruins
            </button>
            <button
              onClick={() => setDreamInput('Experience a journey where I can walk on clouds and visit temples that exist in different time periods')}
              className="p-2 bg-white/10 rounded-lg text-gray-300 hover:bg-white/20 transition-colors"
            >
              Cloud Walking
            </button>
            <button
              onClick={() => setDreamInput('Travel through a world where mountains are made of crystal and I can fly between floating islands')}
              className="p-2 bg-white/10 rounded-lg text-gray-300 hover:bg-white/20 transition-colors"
            >
              Crystal Mountains
            </button>
          </div>
          
          <button
            onClick={generateDreamItinerary}
            disabled={!dreamInput.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {isGenerating ? 'Weaving Your Dream...' : 'Generate Dream Itinerary'}
          </button>
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
            <span className="text-purple-400 text-sm font-medium">AI is weaving your dream...</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Analyzing dream elements</span>
              <span className="text-cyan-400">Complete ✓</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mixing reality with VR</span>
              <span className="text-yellow-400">In progress...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Creating surreal experiences</span>
              <span className="text-gray-500">Pending</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Generated Itinerary */}
      {generatedItinerary && (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h3 className="text-white font-semibold">Your Surreal Journey</h3>
          </div>
          
          <div className="mb-4">
            <h4 className="text-lg font-bold text-purple-400 mb-1">{generatedItinerary.title}</h4>
            <p className="text-gray-300 text-sm mb-3">{generatedItinerary.description}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg p-2">
                <div className="text-lg font-bold text-green-400">{generatedItinerary.realPlaces}</div>
                <div className="text-xs text-gray-400">Real Places</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-2">
                <div className="text-lg font-bold text-purple-400">{generatedItinerary.vrExperiences}</div>
                <div className="text-xs text-gray-400">VR Experiences</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-2">
                <div className="text-lg font-bold text-orange-400">{generatedItinerary.totalBudget}</div>
                <div className="text-xs text-gray-400">Total Budget</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {generatedItinerary.days.map((day) => (
              <div key={day.day} className="bg-black/20 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-cyan-400 font-medium">Day {day.day}: {day.title}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    day.type === 'real' ? 'bg-green-500/20 text-green-400' :
                    day.type === 'vr' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {day.type}
                  </span>
                </div>
                <div className="space-y-2">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 text-sm">
                      <span className="text-gray-400 text-xs mt-1 w-12 flex-shrink-0">{activity.time}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium">{activity.activity}</span>
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            activity.type === 'real' ? 'bg-green-500/20 text-green-400' :
                            activity.type === 'vr' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-cyan-500/20 text-cyan-400'
                          }`}>
                            {activity.type}
                          </span>
                        </div>
                        <div className="text-gray-400 text-xs">{activity.location}</div>
                        <div className="text-gray-300 text-xs">{activity.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300">
            Start Dream Journey
          </button>
        </div>
      )}
    </div>
  );

  const renderTimeMachine = () => (
    <div className="space-y-6">
      {/* Time Machine Interface */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Nomad Time Machine</h2>
          <p className="text-gray-400 text-sm">See historical versions of your current location through AR</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 mb-4">
          <div className="text-white font-medium mb-2">Current Location: Goa, India</div>
          <div className="text-gray-400 text-sm mb-3">Select a historical period to experience:</div>
          
          <div className="space-y-2">
            {historicalPeriods.map((period) => (
              <button
                key={period.id}
                onClick={() => activateTimeTravel(period)}
                disabled={isTimeTravel}
                className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-amber-400 text-sm font-medium">{period.era} ({period.year})</div>
                    <div className="text-gray-400 text-xs">{period.title}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {isTimeTravel && (
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-4 border border-orange-400/30 mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-400"></div>
              <span className="text-orange-400 font-medium text-sm">Activating Time Portal...</span>
            </div>
            <div className="space-y-1 text-xs text-gray-300">
              <div>• Calibrating temporal coordinates...</div>
              <div>• Loading historical data...</div>
              <div>• Preparing AR overlay...</div>
            </div>
          </div>
        )}

        {selectedEra && (
          <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl p-4 border border-green-400/30 mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium text-sm">Time Portal Active!</span>
            </div>
            
            <div className="mb-4">
              <img
                src={selectedEra.image}
                alt={selectedEra.title}
                className="w-full h-32 object-cover rounded-xl mb-3"
              />
              <h3 className="text-white font-semibold">{selectedEra.title}</h3>
              <p className="text-gray-400 text-sm">{selectedEra.era} • {selectedEra.year}</p>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{selectedEra.description}</p>
            
            <div className="mb-4">
              <div className="text-xs text-green-400 font-medium mb-2">AR Features Available:</div>
              {selectedEra.arFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs text-gray-300 mb-1">
                  <Eye className="h-3 w-3 text-green-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => !selectedEra && activateTimeTravel(historicalPeriods[0])}
          disabled={isTimeTravel}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          {isTimeTravel ? 'Activating Time Portal...' : selectedEra ? 'Experience AR Time View' : 'Activate Time Machine'}
        </button>
      </div>

      {/* Historical Timeline */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
        <h3 className="text-white font-semibold mb-4">Historical Timeline</h3>
        <div className="space-y-3">
          {historicalPeriods.map((period, index) => (
            <div key={period.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{period.era}</div>
                <div className="text-gray-400 text-xs">{period.year}</div>
              </div>
              <button className="text-amber-400 text-xs">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Discovery Hub</h1>
        <p className="text-gray-400 text-sm">AI-powered exploration and serendipitous adventures</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        <button
          onClick={() => setActiveTab('doppelarting')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            activeTab === 'doppelarting'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Doppelarting</span>
        </button>
        
        <button
          onClick={() => setActiveTab('teleport')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            activeTab === 'teleport'
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
              : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
          }`}
        >
          <Shuffle className="h-4 w-4" />
          <span>Teleport</span>
        </button>
        
        <button
          onClick={() => setActiveTab('dreamscape')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            activeTab === 'dreamscape'
              ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
              : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
          }`}
        >
          <Wand2 className="h-4 w-4" />
          <span>Dreamscape</span>
        </button>
        
        <button
          onClick={() => setActiveTab('timemachine')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            activeTab === 'timemachine'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
              : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Time Machine</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="mb-6">
        {activeTab === 'doppelarting' && renderDoppelarting()}
        {activeTab === 'teleport' && renderTeleportRoulette()}
        {activeTab === 'dreamscape' && renderDreamscape()}
        {activeTab === 'timemachine' && renderTimeMachine()}
      </div>
    </div>
  );
}

export default DiscoveryPage;