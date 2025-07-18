import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageCircle, Zap, Brain, Compass, Utensils, MapPin, Calendar, DollarSign, Backpack, Send, Mic, Star, Clock, Navigation, Camera, Heart, Users, Plane, Coffee, Mountain, Bean as Beach, Music, Wifi, Car, Train } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'suggestion' | 'itinerary' | 'recommendation' | 'list';
  data?: any;
}

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: string;
  examples: string[];
}

function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your personal Nomad AI Twin. I've been learning about your travel preferences and I'm here to help you with anything travel-related. What would you like to explore today?",
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiFeatures: AIFeature[] = [
    {
      id: 'itinerary',
      title: 'Smart Itinerary',
      description: 'Create personalized travel plans',
      icon: Calendar,
      color: 'from-blue-400 to-cyan-500',
      action: 'Create a 3-day itinerary for Goa',
      examples: ['Plan my weekend in Mumbai', 'Suggest a 5-day Kerala trip', 'Create Delhi itinerary']
    },
    {
      id: 'food',
      title: 'Food Discovery',
      description: 'Find amazing local cuisine',
      icon: Utensils,
      color: 'from-orange-400 to-red-500',
      action: 'Find best local food spots near me',
      examples: ['Best street food in Delhi', 'Vegetarian restaurants in Bangalore', 'Local delicacies to try']
    },
    {
      id: 'budget',
      title: 'Budget Planner',
      description: 'Estimate travel costs',
      icon: DollarSign,
      color: 'from-green-400 to-teal-500',
      action: 'Calculate budget for Rajasthan trip',
      examples: ['Budget for solo travel in India', 'Cost of living in Goa', 'Cheap travel options']
    },
    {
      id: 'packing',
      title: 'Packing Assistant',
      description: 'Smart packing suggestions',
      icon: Backpack,
      color: 'from-purple-400 to-pink-500',
      action: 'Help me pack for monsoon travel',
      examples: ['Packing for mountain trek', 'Beach vacation essentials', 'Winter travel checklist']
    },
    {
      id: 'transport',
      title: 'Transport Guide',
      description: 'Find best travel options',
      icon: Train,
      color: 'from-indigo-400 to-blue-500',
      action: 'How to reach Ladakh from Delhi',
      examples: ['Train routes to Kashmir', 'Flight vs bus options', 'Local transport in cities']
    },
    {
      id: 'hidden-gems',
      title: 'Hidden Gems',
      description: 'Discover secret locations',
      icon: Star,
      color: 'from-yellow-400 to-orange-500',
      action: 'Show me hidden gems in Himachal',
      examples: ['Secret beaches in Goa', 'Offbeat places in Uttarakhand', 'Unexplored hill stations']
    }
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(content.trim());
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const generateAIResponse = async (userInput: string): Promise<Message> => {
    const input = userInput.toLowerCase();
    const baseMessage = {
      id: (Date.now() + 1).toString(),
      isUser: false,
      timestamp: new Date(),
    };

    // Itinerary Planning
    if (input.includes('itinerary') || input.includes('plan') || input.includes('trip') || input.includes('day')) {
      const destination = extractDestination(input) || 'your chosen destination';
      const days = extractDays(input) || 3;
      
      return {
        ...baseMessage,
        content: `I'd love to help you plan your ${days}-day trip to ${destination}! Here's a personalized itinerary based on your travel style:`,
        type: 'itinerary',
        data: {
          destination: destination,
          days: Array.from({ length: days }, (_, i) => ({
            day: i + 1,
            title: getDayTitle(i + 1),
            activities: getDayActivities(destination, i + 1),
            estimated_cost: `₹${(2000 + i * 500 + Math.random() * 1000).toFixed(0)}`,
            highlights: getDayHighlights(destination, i + 1)
          })),
          totalBudget: `₹${(days * 2500 + Math.random() * 2000).toFixed(0)}`,
          tips: getDestinationTips(destination)
        }
      };
    }

    // Food Recommendations
    if (input.includes('food') || input.includes('eat') || input.includes('restaurant') || input.includes('cuisine')) {
      const location = extractDestination(input) || 'your area';
      
      return {
        ...baseMessage,
        content: `Great choice! I found some amazing food spots in ${location} based on your preferences:`,
        type: 'recommendation',
        data: {
          type: 'food',
          location: location,
          recommendations: getFoodRecommendations(location)
        }
      };
    }

    // Budget Planning
    if (input.includes('budget') || input.includes('cost') || input.includes('price') || input.includes('money')) {
      const destination = extractDestination(input) || 'India';
      
      return {
        ...baseMessage,
        content: `Here's a detailed budget breakdown for traveling in ${destination}:`,
        type: 'suggestion',
        data: {
          type: 'budget',
          destination: destination,
          daily_budget: '₹2,500',
          breakdown: {
            accommodation: '₹1,200',
            food: '₹800',
            transport: '₹300',
            activities: '₹200'
          },
          tips: [
            'Book accommodations in advance for better deals',
            'Try local street food for authentic and cheap meals',
            'Use public transport to save money',
            'Look for free activities like hiking and sightseeing'
          ]
        }
      };
    }

    // Packing Help
    if (input.includes('pack') || input.includes('luggage') || input.includes('clothes') || input.includes('essentials')) {
      const season = extractSeason(input);
      const activity = extractActivity(input);
      
      return {
        ...baseMessage,
        content: `Perfect! Here's your personalized packing checklist:`,
        type: 'list',
        data: {
          type: 'packing',
          season: season,
          activity: activity,
          essentials: getPackingList(season, activity),
          tips: getPackingTips(season, activity)
        }
      };
    }

    // Transport & Travel
    if (input.includes('transport') || input.includes('travel') || input.includes('reach') || input.includes('train') || input.includes('flight') || input.includes('bus')) {
      const destination = extractDestination(input) || 'your destination';
      
      return {
        ...baseMessage,
        content: `Here are the best travel options to reach ${destination}:`,
        type: 'recommendation',
        data: {
          type: 'transport',
          destination: destination,
          options: getTransportOptions(destination)
        }
      };
    }

    // Hidden Gems & Places
    if (input.includes('hidden') || input.includes('secret') || input.includes('offbeat') || input.includes('unexplored') || input.includes('gem')) {
      const location = extractDestination(input) || 'India';
      
      return {
        ...baseMessage,
        content: `Exciting! Here are some hidden gems in ${location} that most travelers miss:`,
        type: 'recommendation',
        data: {
          type: 'places',
          location: location,
          places: getHiddenGems(location)
        }
      };
    }

    // Weather & Best Time
    if (input.includes('weather') || input.includes('climate') || input.includes('best time') || input.includes('season')) {
      const destination = extractDestination(input) || 'your destination';
      
      return {
        ...baseMessage,
        content: `Here's the weather information and best time to visit ${destination}:`,
        type: 'suggestion',
        data: {
          type: 'weather',
          destination: destination,
          current: getCurrentWeather(destination),
          bestTime: getBestTime(destination),
          seasons: getSeasonalInfo(destination)
        }
      };
    }

    // General Travel Tips
    if (input.includes('tip') || input.includes('advice') || input.includes('suggest') || input.includes('help')) {
      return {
        ...baseMessage,
        content: "Here are some personalized travel tips based on your nomad style:",
        type: 'list',
        data: {
          type: 'tips',
          tips: [
            'Always carry a portable charger and universal adapter',
            'Download offline maps before traveling to remote areas',
            'Learn basic local phrases to connect with locals',
            'Keep digital copies of important documents',
            'Try to travel during weekdays for better prices and fewer crowds',
            'Pack light but smart - choose versatile clothing items',
            'Research local customs and traditions before visiting',
            'Always have a backup plan for accommodations'
          ]
        }
      };
    }

    // Default response with suggestions
    return {
      ...baseMessage,
      content: "I'm here to help with all your travel needs! Here are some things I can assist you with:",
      type: 'suggestion',
      data: {
        type: 'help',
        suggestions: [
          'Plan detailed itineraries for any destination',
          'Find the best local food spots and hidden restaurants',
          'Calculate travel budgets and money-saving tips',
          'Create smart packing lists for any trip',
          'Suggest transport options and routes',
          'Discover hidden gems and offbeat places',
          'Provide weather info and best travel times',
          'Share personalized travel tips and advice'
        ]
      }
    };
  };

  // Helper functions
  const extractDestination = (input: string): string | null => {
    const destinations = ['goa', 'delhi', 'mumbai', 'bangalore', 'kerala', 'rajasthan', 'himachal', 'uttarakhand', 'kashmir', 'ladakh', 'manali', 'rishikesh', 'jaipur', 'udaipur', 'agra', 'varanasi', 'kolkata', 'chennai', 'hyderabad', 'pune'];
    for (const dest of destinations) {
      if (input.includes(dest)) {
        return dest.charAt(0).toUpperCase() + dest.slice(1);
      }
    }
    return null;
  };

  const extractDays = (input: string): number => {
    const match = input.match(/(\d+)[\s-]?day/);
    return match ? parseInt(match[1]) : 3;
  };

  const extractSeason = (input: string): string => {
    if (input.includes('summer') || input.includes('hot')) return 'summer';
    if (input.includes('winter') || input.includes('cold')) return 'winter';
    if (input.includes('monsoon') || input.includes('rain')) return 'monsoon';
    return 'general';
  };

  const extractActivity = (input: string): string => {
    if (input.includes('trek') || input.includes('hike')) return 'trekking';
    if (input.includes('beach')) return 'beach';
    if (input.includes('mountain')) return 'mountain';
    if (input.includes('city')) return 'city';
    return 'general';
  };

  const getDayTitle = (day: number): string => {
    const titles = ['Arrival & Local Exploration', 'Adventure & Activities', 'Culture & Relaxation', 'Nature & Sightseeing', 'Local Experiences'];
    return titles[day - 1] || `Day ${day} Adventures`;
  };

  const getDayActivities = (destination: string, day: number): string[] => {
    const activities = {
      1: ['Airport/station pickup', 'Check-in to accommodation', 'Local market exploration', 'Welcome dinner at local restaurant'],
      2: ['Early morning adventure activity', 'Local sightseeing tour', 'Lunch at popular local spot', 'Evening cultural experience'],
      3: ['Relaxing morning activity', 'Visit famous landmarks', 'Shopping for souvenirs', 'Sunset viewing']
    };
    return activities[day as keyof typeof activities] || ['Explore local area', 'Try local cuisine', 'Rest and relax'];
  };

  const getDayHighlights = (destination: string, day: number): string[] => {
    return ['Must-visit local attraction', 'Authentic food experience', 'Cultural immersion opportunity'];
  };

  const getDestinationTips = (destination: string): string[] => {
    return [
      'Book accommodations near city center for easy access',
      'Try local street food for authentic flavors',
      'Carry comfortable walking shoes',
      'Respect local customs and traditions'
    ];
  };

  const getFoodRecommendations = (location: string) => {
    return [
      {
        name: 'Local Heritage Restaurant',
        type: 'Traditional Cuisine',
        rating: 4.7,
        distance: '0.8 km',
        specialty: 'Regional Specialties',
        price: '₹400-600',
        highlight: 'Family recipes passed down generations'
      },
      {
        name: 'Street Food Paradise',
        type: 'Street Food',
        rating: 4.9,
        distance: '0.3 km',
        specialty: 'Local Street Delicacies',
        price: '₹50-150',
        highlight: 'Authentic local flavors'
      },
      {
        name: 'Rooftop Dining Experience',
        type: 'Multi-cuisine',
        rating: 4.5,
        distance: '1.2 km',
        specialty: 'Fusion Dishes',
        price: '₹800-1200',
        highlight: 'Great views and ambiance'
      }
    ];
  };

  const getPackingList = (season: string, activity: string) => {
    const base = ['Comfortable clothes', 'Personal hygiene items', 'Phone charger', 'Documents'];
    const seasonal = {
      summer: ['Light cotton clothes', 'Sunscreen', 'Hat', 'Sunglasses'],
      winter: ['Warm clothes', 'Jacket', 'Gloves', 'Thermal wear'],
      monsoon: ['Raincoat', 'Waterproof bag', 'Quick-dry clothes', 'Umbrella'],
      general: ['Versatile clothing', 'Light jacket', 'Comfortable shoes']
    };
    const activitySpecific = {
      trekking: ['Trekking shoes', 'Backpack', 'Water bottle', 'First aid kit'],
      beach: ['Swimwear', 'Beach towel', 'Flip flops', 'Water sports gear'],
      mountain: ['Warm layers', 'Hiking boots', 'Thermal flask', 'Altitude sickness medicine'],
      city: ['Comfortable walking shoes', 'Day pack', 'City maps', 'Local guidebook'],
      general: ['Comfortable shoes', 'Day bag', 'Camera', 'Notebook']
    };
    
    return [...base, ...seasonal[season as keyof typeof seasonal], ...activitySpecific[activity as keyof typeof activitySpecific]];
  };

  const getPackingTips = (season: string, activity: string): string[] => {
    return [
      'Pack versatile items that can be mixed and matched',
      'Roll clothes instead of folding to save space',
      'Keep essentials in carry-on bag',
      'Check weather forecast before finalizing packing'
    ];
  };

  const getTransportOptions = (destination: string) => {
    return [
      {
        type: 'Flight',
        duration: '2-3 hours',
        cost: '₹3,000-8,000',
        pros: ['Fastest option', 'Convenient timing'],
        cons: ['Weather dependent', 'Higher cost']
      },
      {
        type: 'Train',
        duration: '8-12 hours',
        cost: '₹500-2,000',
        pros: ['Comfortable journey', 'Scenic route'],
        cons: ['Takes longer', 'Booking required in advance']
      },
      {
        type: 'Bus',
        duration: '10-14 hours',
        cost: '₹300-1,500',
        pros: ['Budget friendly', 'Multiple operators'],
        cons: ['Depends on road conditions', 'Less comfortable']
      }
    ];
  };

  const getHiddenGems = (location: string) => {
    return [
      {
        name: 'Secret Waterfall Trek',
        description: 'Hidden waterfall accessible through local village trail',
        difficulty: 'Moderate',
        bestTime: 'Post-monsoon season',
        tips: 'Hire local guide for best experience'
      },
      {
        name: 'Sunrise Viewpoint',
        description: 'Spectacular sunrise views known only to locals',
        difficulty: 'Easy',
        bestTime: 'Early morning (5-6 AM)',
        tips: 'Carry warm clothes and camera'
      },
      {
        name: 'Traditional Village Experience',
        description: 'Authentic village life experience with local families',
        difficulty: 'Easy',
        bestTime: 'Any time of year',
        tips: 'Respect local customs and traditions'
      }
    ];
  };

  const getCurrentWeather = (destination: string) => {
    return {
      temperature: '24°C',
      condition: 'Partly Cloudy',
      humidity: '65%',
      windSpeed: '12 km/h'
    };
  };

  const getBestTime = (destination: string): string => {
    return 'October to March (Pleasant weather, ideal for sightseeing)';
  };

  const getSeasonalInfo = (destination: string) => {
    return {
      winter: 'Cool and pleasant, perfect for outdoor activities',
      summer: 'Hot and humid, early morning activities recommended',
      monsoon: 'Heavy rainfall, beautiful landscapes but travel challenges'
    };
  };

  const handleFeatureClick = (feature: AIFeature) => {
    handleSendMessage(feature.action);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
    if (!isListening) {
      setTimeout(() => setIsListening(false), 3000);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header - Fixed & Responsive */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-400 to-cyan-500 flex items-center justify-center">
            <Bot className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white truncate">Nomad AI Twin</h1>
            <p className="text-xs sm:text-sm text-gray-400 truncate">Your personal travel assistant</p>
          </div>
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium hidden sm:inline">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGES AREA - RESPONSIVE HEIGHT */}
      <div 
        className="overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 flex-1"
        style={{ 
          height: 'calc(50vh - 60px)', // Adjust for mobile
          minHeight: '200px' // Minimum height for very small screens
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] sm:max-w-xl lg:max-w-2xl ${
              message.isUser ? 'ml-auto' : 'mr-auto'
            }`}>
              {message.type === 'text' ? (
                <div className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                  message.isUser
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-white/10 text-white border border-white/10 backdrop-blur-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              ) : (
                <div className="bg-white/10 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-sm">
                  <p className="text-white text-sm mb-3 leading-relaxed">{message.content}</p>
                  
                  {message.type === 'itinerary' && message.data && (
                    <div className="space-y-2 sm:space-y-3">
                      {message.data.days.map((day: any, index: number) => (
                        <div key={index} className="bg-black/20 rounded-xl p-2 sm:p-3 backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-cyan-400 font-medium text-xs sm:text-sm">Day {day.day}: {day.title}</h4>
                            <span className="text-green-400 text-xs">{day.estimated_cost}</span>
                          </div>
                          <div className="space-y-1">
                            {day.activities.map((activity: string, i: number) => (
                              <div key={i} className="flex items-center space-x-2 text-gray-300 text-xs">
                                <div className="w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0" />
                                <span className="leading-relaxed">{activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-2 sm:p-3 border border-green-400/30 backdrop-blur-sm">
                        <div className="text-green-400 font-medium text-xs sm:text-sm">Total Budget: {message.data.totalBudget}</div>
                      </div>
                    </div>
                  )}

                  {message.type === 'recommendation' && message.data && (
                    <div className="space-y-2 sm:space-y-3">
                      {message.data.recommendations?.map((rec: any, index: number) => (
                        <div key={index} className="bg-black/20 rounded-xl p-2 sm:p-3 backdrop-blur-sm">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-xs sm:text-sm truncate">{rec.name}</h4>
                              <p className="text-gray-400 text-xs">{rec.type}</p>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-yellow-400 text-xs">{rec.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-orange-400 truncate">{rec.specialty}</span>
                            <span className="text-green-400 flex-shrink-0">{rec.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {message.type === 'suggestion' && message.data && (
                    <div className="bg-black/20 rounded-xl p-2 sm:p-3 backdrop-blur-sm">
                      {message.data.type === 'budget' && (
                        <>
                          <div className="text-center mb-3">
                            <div className="text-lg sm:text-xl font-bold text-green-400">{message.data.daily_budget}</div>
                            <div className="text-xs text-gray-400">per day</div>
                          </div>
                          <div className="space-y-2">
                            {Object.entries(message.data.breakdown).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-gray-300 capitalize">{key}</span>
                                <span className="text-green-400">{value as string}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      {message.data.type === 'help' && (
                        <div className="space-y-1 sm:space-y-2">
                          {message.data.suggestions.map((suggestion: string, i: number) => (
                            <div key={i} className="flex items-start space-x-2 text-cyan-300 text-xs">
                              <Zap className="h-3 w-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {message.type === 'list' && message.data && (
                    <div className="space-y-2 sm:space-y-3">
                      {message.data.type === 'packing' && (
                        <div className="bg-black/20 rounded-xl p-2 sm:p-3 backdrop-blur-sm">
                          <h4 className="text-cyan-400 font-medium text-xs sm:text-sm mb-2">Essential Items</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {message.data.essentials.map((item: string, i: number) => (
                              <div key={i} className="flex items-center space-x-2 text-gray-300 text-xs">
                                <div className="w-1 h-1 rounded-full bg-green-400 flex-shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {message.data.type === 'tips' && (
                        <div className="space-y-1 sm:space-y-2">
                          {message.data.tips.map((tip: string, i: number) => (
                            <div key={i} className="flex items-start space-x-2 text-gray-300 text-xs">
                              <div className="w-1 h-1 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                              <span className="leading-relaxed">{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className={`text-xs text-gray-500 mt-1 ${
                message.isUser ? 'text-right' : 'text-left'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-purple-400 text-xs sm:text-sm ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA - RESPONSIVE */}
      <div className="bg-black/30 backdrop-blur-md border-t border-white/10 p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-end space-x-2 sm:space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about travel..."
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none pr-10 sm:pr-12 text-sm sm:text-base"
            />
            <button 
              onClick={toggleVoiceInput}
              className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                isListening ? 'text-red-400 animate-pulse' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          
          <button
            onClick={() => handleSendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 sm:p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex-shrink-0"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </button>
        </div>
      </div>

      {/* FEATURE BUTTONS - FULLY RESPONSIVE */}
      <div className="bg-black/40 backdrop-blur-md border-t border-white/10 p-2 sm:p-3 flex-shrink-0">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
          {aiFeatures.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleFeatureClick(feature)}
              className={`bg-gradient-to-r ${feature.color} bg-opacity-20 backdrop-blur-sm rounded-lg sm:rounded-xl p-1.5 sm:p-2 border border-white/10 hover:border-white/30 transition-all duration-300 text-center group hover:scale-105 min-h-[60px] sm:min-h-[70px] flex flex-col items-center justify-center`}
            >
              <feature.icon className="h-3 w-3 sm:h-4 sm:w-4 text-white mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-medium text-white leading-tight text-center px-1">
                <span className="hidden sm:inline">{feature.title}</span>
                <span className="sm:hidden">{feature.title.split(' ')[0]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIAssistantPage;