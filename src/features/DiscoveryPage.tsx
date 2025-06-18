import React, { useState } from 'react';
import { 
  Target, Compass, Wand2, Clock, Star, MapPin, 
  Shuffle, Filter, Search, Zap, Globe, Camera, Heart
} from 'lucide-react';

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

function DiscoveryPage() {
  const [activeTab, setActiveTab] = useState<'doppelarting' | 'teleport' | 'dreamscape' | 'timemachine'>('doppelarting');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('');

  const mockDiscoveries: DiscoveryItem[] = [
    {
      id: '1',
      type: 'hidden-gem',
      title: 'Secret Beach Cave',
      description: 'A hidden cave accessible only during low tide, perfect for meditation and photography.',
      location: 'Arambol, Goa',
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      distance: 2.3,
      tags: ['secluded', 'photography', 'nature'],
      price: 'free',
      isAIRecommended: true
    },
    {
      id: '2',
      type: 'food',
      title: 'Authentic Goan Fish Curry',
      description: 'Family-run restaurant serving traditional recipes passed down for generations.',
      location: 'Panaji, Goa',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      distance: 5.1,
      tags: ['local', 'authentic', 'seafood'],
      price: 'budget'
    },
    {
      id: '3',
      type: 'experience',
      title: 'Sunrise Yoga Session',
      description: 'Join fellow travelers for morning yoga on the beach with experienced instructors.',
      location: 'Anjuna Beach, Goa',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      distance: 3.7,
      tags: ['wellness', 'group', 'morning'],
      price: 'budget',
      isAIRecommended: true
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

  const handleTeleportSpin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      // Show random destination
    }, 3000);
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

        <div className="bg-white/5 rounded-2xl p-4 mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <div>
              <div className="text-white font-medium">Analyzing your travel patterns...</div>
              <div className="text-gray-400 text-sm">Compatibility: 94% match found!</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-3 border border-green-400/30">
            <div className="text-green-400 font-medium text-sm mb-1">Perfect Match Detected</div>
            <div className="text-gray-300 text-xs">CosmicWanderer88 shares your love for hidden beaches and local food experiences</div>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300">
          Connect with Travel Twin
        </button>
      </div>

      {/* Mood-Based Suggestions */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
        <h3 className="text-white font-semibold mb-4">What's your mood today?</h3>
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

        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-white/10 rounded-xl text-gray-300 text-sm border border-white/10">
              Nearby (5km)
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl text-cyan-400 text-sm border border-cyan-400/30">
              Faraway (50km+)
            </button>
          </div>

          <button
            onClick={handleTeleportSpin}
            disabled={isSpinning}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-4 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
          </button>
        </div>

        {isSpinning && (
          <div className="mt-4 text-center">
            <div className="text-orange-400 text-sm animate-pulse">
              🌟 Discovering your next adventure...
            </div>
          </div>
        )}
      </div>

      {/* Recent Spins */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
        <h3 className="text-white font-semibold mb-4">Recent Discoveries</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
            <MapPin className="h-5 w-5 text-orange-400" />
            <div className="flex-1">
              <div className="text-white text-sm font-medium">Dudhsagar Falls</div>
              <div className="text-gray-400 text-xs">45km away • Waterfall adventure</div>
            </div>
            <button className="text-cyan-400 text-xs">Explore</button>
          </div>
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
            placeholder="Describe your dream adventure... (e.g., 'I want to feel like I'm floating through ancient temples while tasting clouds')"
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
            rows={3}
          />
          
          <button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300">
            Generate Dream Itinerary
          </button>
        </div>
      </div>

      {/* AI Generated Itinerary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
        <h3 className="text-white font-semibold mb-4">Your Surreal Journey</h3>
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-3 border border-purple-400/30">
            <div className="flex items-center space-x-2 mb-2">
              <Wand2 className="h-4 w-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">AI Generated</span>
            </div>
            <div className="text-white text-sm">
              Start at the floating temples of Hampi with VR ancient civilization overlay, 
              then taste cloud-like cotton candy at a sky-high cafe in Goa...
            </div>
          </div>
        </div>
      </div>
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

        <div className="space-y-4">
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-white font-medium mb-2">Current Location: Goa</div>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="text-amber-400 text-sm font-medium">Portuguese Colonial Era (1500s)</div>
                <div className="text-gray-400 text-xs">See Old Goa's golden age with AR overlay</div>
              </button>
              <button className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="text-orange-400 text-sm font-medium">Hippie Movement (1960s)</div>
                <div className="text-gray-400 text-xs">Experience the flower power era</div>
              </button>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300">
            Activate AR Time View
          </button>
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

      {/* AI Recommendations */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span className="text-white font-medium">AI Recommendations</span>
          </div>
          <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
            <Filter className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {mockDiscoveries.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-start space-x-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <div className="flex items-center space-x-1 text-gray-400 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>{item.location} • {item.distance}km</span>
                      </div>
                    </div>
                    
                    {item.isAIRecommended && (
                      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-2 py-1 rounded-full">
                        <span className="text-yellow-400 text-xs font-medium">AI Pick</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 text-xs">{item.rating}</span>
                      </div>
                      
                      {item.price && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.price === 'free' ? 'bg-green-500/20 text-green-400' :
                          item.price === 'budget' ? 'bg-blue-500/20 text-blue-400' :
                          item.price === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {item.price}
                        </span>
                      )}
                    </div>
                    
                    <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                      Explore →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiscoveryPage;