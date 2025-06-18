import React, { useState } from 'react';
import { 
  Bot, MessageCircle, Zap, Brain, Compass, Utensils, 
  MapPin, Calendar, DollarSign, Backpack, Send, Mic,
  Star, Clock, Navigation, Camera, Heart, Users
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'suggestion' | 'itinerary' | 'recommendation';
  data?: any;
}

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: string;
}

function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your Nomad AI Twin. I've learned your travel style and preferences. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const aiFeatures: AIFeature[] = [
    {
      id: 'itinerary',
      title: 'Smart Itinerary',
      description: 'Create personalized travel plans',
      icon: Calendar,
      color: 'from-blue-400 to-cyan-500',
      action: 'Plan my next trip'
    },
    {
      id: 'food',
      title: 'Food Discovery',
      description: 'Find amazing local cuisine',
      icon: Utensils,
      color: 'from-orange-400 to-red-500',
      action: 'Find local food spots'
    },
    {
      id: 'budget',
      title: 'Budget Planner',
      description: 'Estimate travel costs',
      icon: DollarSign,
      color: 'from-green-400 to-teal-500',
      action: 'Calculate trip budget'
    },
    {
      id: 'packing',
      title: 'Packing Assistant',
      description: 'Smart packing suggestions',
      icon: Backpack,
      color: 'from-purple-400 to-pink-500',
      action: 'Help me pack'
    },
    {
      id: 'buddies',
      title: 'Buddy Matching',
      description: 'Find compatible travel partners',
      icon: Users,
      color: 'from-cyan-400 to-blue-500',
      action: 'Find travel buddies'
    },
    {
      id: 'hidden-gems',
      title: 'Hidden Gems',
      description: 'Discover secret locations',
      icon: Star,
      color: 'from-yellow-400 to-orange-500',
      action: 'Show hidden gems'
    }
  ];

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    if (input.includes('itinerary') || input.includes('plan')) {
      return {
        id: Date.now().toString(),
        content: "I'd love to help you plan your trip! Based on your travel style, here's a personalized 3-day itinerary:",
        isUser: false,
        timestamp: new Date(),
        type: 'itinerary',
        data: {
          destination: 'Goa, India',
          days: [
            {
              day: 1,
              title: 'Beach & Culture',
              activities: ['Anjuna Beach sunrise', 'Local market exploration', 'Portuguese architecture tour'],
              estimated_cost: '₹2,500'
            },
            {
              day: 2,
              title: 'Adventure & Nature',
              activities: ['Dudhsagar Falls trek', 'Spice plantation visit', 'Beach sunset'],
              estimated_cost: '₹3,200'
            },
            {
              day: 3,
              title: 'Local Experiences',
              activities: ['Cooking class', 'Fishing village visit', 'Night market'],
              estimated_cost: '₹2,800'
            }
          ]
        }
      };
    }
    
    if (input.includes('food') || input.includes('eat')) {
      return {
        id: Date.now().toString(),
        content: "Perfect! I found some amazing food spots near you based on your preferences:",
        isUser: false,
        timestamp: new Date(),
        type: 'recommendation',
        data: {
          type: 'food',
          recommendations: [
            {
              name: 'Vinayak Family Restaurant',
              type: 'Local Goan',
              rating: 4.8,
              distance: '0.5 km',
              specialty: 'Fish Curry Rice',
              price: '₹300-500'
            },
            {
              name: 'Thalassa',
              type: 'Greek & Seafood',
              rating: 4.6,
              distance: '2.1 km',
              specialty: 'Grilled Fish',
              price: '₹800-1200'
            }
          ]
        }
      };
    }
    
    if (input.includes('budget') || input.includes('cost')) {
      return {
        id: Date.now().toString(),
        content: "Based on your travel style and destination, here's a budget breakdown:",
        isUser: false,
        timestamp: new Date(),
        type: 'suggestion',
        data: {
          type: 'budget',
          daily_budget: '₹2,500',
          breakdown: {
            accommodation: '₹1,000',
            food: '₹800',
            transport: '₹400',
            activities: '₹300'
          }
        }
      };
    }
    
    return {
      id: Date.now().toString(),
      content: "I understand you're looking for travel assistance. I can help with itinerary planning, food recommendations, budget estimation, packing lists, and finding travel buddies. What would you like to explore?",
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
  };

  const handleFeatureClick = (feature: AIFeature) => {
    handleSendMessage(feature.action);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-cyan-500 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Nomad AI Twin</h1>
            <p className="text-sm text-gray-400">Your personal travel assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${
              message.isUser ? 'ml-auto' : 'mr-auto'
            }`}>
              {message.type === 'text' ? (
                <div className={`rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-white/10 text-white border border-white/10'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              ) : message.type === 'itinerary' ? (
                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <p className="text-white text-sm mb-3">{message.content}</p>
                  <div className="space-y-3">
                    {message.data?.days.map((day: any, index: number) => (
                      <div key={index} className="bg-black/20 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-cyan-400 font-medium">Day {day.day}: {day.title}</h4>
                          <span className="text-green-400 text-xs">{day.estimated_cost}</span>
                        </div>
                        <div className="space-y-1">
                          {day.activities.map((activity: string, i: number) => (
                            <div key={i} className="flex items-center space-x-2 text-gray-300 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              <span>{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : message.type === 'recommendation' ? (
                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <p className="text-white text-sm mb-3">{message.content}</p>
                  <div className="space-y-3">
                    {message.data?.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="bg-black/20 rounded-xl p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-medium">{rec.name}</h4>
                            <p className="text-gray-400 text-xs">{rec.type} • {rec.distance}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-yellow-400 text-xs">{rec.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-400 text-xs">{rec.specialty}</span>
                          <span className="text-green-400 text-xs">{rec.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <p className="text-white text-sm mb-3">{message.content}</p>
                  {message.data?.type === 'budget' && (
                    <div className="bg-black/20 rounded-xl p-3">
                      <div className="text-center mb-3">
                        <div className="text-2xl font-bold text-green-400">{message.data.daily_budget}</div>
                        <div className="text-xs text-gray-400">per day</div>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(message.data.breakdown).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="text-gray-300 capitalize">{key}</span>
                            <span className="text-green-400">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className={`text-xs text-gray-400 mt-1 ${
                message.isUser ? 'text-right' : 'text-left'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Features */}
      <div className="p-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {aiFeatures.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleFeatureClick(feature)}
              className={`bg-gradient-to-r ${feature.color} bg-opacity-20 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300 text-left`}
            >
              <feature.icon className="h-5 w-5 text-white mb-2" />
              <div className="text-sm font-medium text-white">{feature.title}</div>
              <div className="text-xs text-gray-400">{feature.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-black/30 backdrop-blur-md border-t border-white/10 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              placeholder="Ask your AI twin anything..."
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none pr-12"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <Mic className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={() => handleSendMessage(inputMessage)}
            disabled={!inputMessage.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIAssistantPage;