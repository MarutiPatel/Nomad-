import React, { useState } from 'react';
import { 
  Target, MapPin, Navigation, Compass, Search, Filter, 
  Star, Clock, Users, Calendar, Route, Map, Zap, Globe,
  Camera, Heart, Utensils, TreePine, Car, Fuel, Building
} from 'lucide-react';

interface ExploreItem {
  id: string;
  title: string;
  description: string;
  type: 'attraction' | 'restaurant' | 'accommodation' | 'activity';
  distance: number;
  rating: number;
  image: string;
  price?: string;
  duration?: string;
}

function DiscoveryPage() {
  const [activeTab, setActiveTab] = useState<'explore' | 'plan' | 'route'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const mockExploreItems: ExploreItem[] = [
    {
      id: '1',
      title: 'Historic City Center',
      description: 'Beautiful medieval architecture and cobblestone streets',
      type: 'attraction',
      distance: 2.3,
      rating: 4.7,
      image: 'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '2-3 hours'
    },
    {
      id: '2',
      title: 'Local Artisan Café',
      description: 'Authentic coffee and pastries made by local artists',
      type: 'restaurant',
      distance: 0.8,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$$'
    },
    {
      id: '3',
      title: 'Riverside Nature Walk',
      description: 'Peaceful walking trail along the river with wildlife viewing',
      type: 'activity',
      distance: 1.5,
      rating: 4.5,
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '1-2 hours'
    }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: Globe },
    { id: 'attraction', label: 'Attractions', icon: Camera },
    { id: 'restaurant', label: 'Food', icon: Utensils },
    { id: 'accommodation', label: 'Stay', icon: Building },
    { id: 'activity', label: 'Activities', icon: TreePine }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? mockExploreItems 
    : mockExploreItems.filter(item => item.type === selectedCategory);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'attraction': return Camera;
      case 'restaurant': return Utensils;
      case 'accommodation': return Building;
      case 'activity': return TreePine;
      default: return MapPin;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'attraction': return 'from-purple-400 to-pink-500';
      case 'restaurant': return 'from-orange-400 to-red-500';
      case 'accommodation': return 'from-blue-400 to-cyan-500';
      case 'activity': return 'from-green-400 to-teal-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Explore & Plan</h1>
        <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm mb-4">
          <MapPin className="h-4 w-4" />
          <span>Current location: Amsterdam, Netherlands</span>
        </div>
        <p className="text-gray-400 text-sm">Discover nearby places and plan your perfect route</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-2xl bg-black/20 p-1 mb-6">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'explore'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Target className="h-4 w-4" />
          <span className="text-sm font-medium">Explore</span>
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'plan'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">Plan</span>
        </button>
        <button
          onClick={() => setActiveTab('route')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'route'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Route className="h-4 w-4" />
          <span className="text-sm font-medium">Route</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'explore' && (
        <div>
          {/* Controls */}
          <div className="flex items-center space-x-2 mb-6">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Search className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Filter className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>

          {/* Explore Items */}
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const IconComponent = getTypeIcon(item.type);
              return (
                <div
                  key={item.id}
                  className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.distance}km away</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-yellow-400">{item.rating}</span>
                          </div>
                          {item.duration && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{item.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getTypeColor(item.type)} flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {item.price && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.price === '$' ? 'bg-green-500/20 text-green-400' :
                          item.price === '$$' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {item.price}
                        </span>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                          <Heart className="h-4 w-4 text-gray-400 hover:text-pink-400" />
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300">
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'plan' && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Trip Planner</h3>
          <p className="text-gray-400 text-sm mb-6">
            Plan your itinerary with AI assistance
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300">
            Start Planning
          </button>
        </div>
      )}

      {activeTab === 'route' && (
        <div className="text-center py-12">
          <Route className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Route Optimizer</h3>
          <p className="text-gray-400 text-sm mb-6">
            Find the best routes between destinations
          </p>
          <button className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300">
            Plan Route
          </button>
        </div>
      )}
    </div>
  );
}

export default DiscoveryPage;