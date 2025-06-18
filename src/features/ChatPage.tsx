import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, Send, Clock, Shield, Eye, EyeOff,
  User, Search, Filter, MoreVertical, Camera, Mic, Smile
} from 'lucide-react';

interface Chat {
  id: string;
  participant: {
    id: string;
    displayName: string;
    avatar: string;
    isOnline: boolean;
    lastSeen: Date;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    isOwn: boolean;
    type: 'text' | 'image' | 'voice';
  };
  unreadCount: number;
  isDisappearing: boolean;
  expiresAt?: Date;
}

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  type: 'text' | 'image' | 'voice' | 'system';
  expiresAt?: Date;
  isExpired?: boolean;
}

function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isDisappearingMode, setIsDisappearingMode] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const mockChats: Chat[] = [
    {
      id: '1',
      participant: {
        id: '1',
        displayName: 'CosmicWanderer88',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        isOnline: true,
        lastSeen: new Date()
      },
      lastMessage: {
        content: 'Hey! Want to check out that beach cafe tomorrow?',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        isOwn: false,
        type: 'text'
      },
      unreadCount: 2,
      isDisappearing: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      participant: {
        id: '2',
        displayName: 'MountainSoul42',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      lastMessage: {
        content: 'The sunrise trek was amazing! Thanks for the recommendation 🌅',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isOwn: true,
        type: 'text'
      },
      unreadCount: 0,
      isDisappearing: true,
      expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000)
    },
    {
      id: '3',
      participant: {
        id: '3',
        displayName: 'DigitalNomadX',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
        isOnline: true,
        lastSeen: new Date()
      },
      lastMessage: {
        content: 'Found a great coworking space with amazing coffee!',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isOwn: false,
        type: 'text'
      },
      unreadCount: 1,
      isDisappearing: false
    }
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      content: 'Hey! I saw you\'re also exploring Goa. Want to check out some hidden beaches together?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isOwn: false,
      type: 'text'
    },
    {
      id: '2',
      content: 'That sounds amazing! I\'ve been looking for someone to explore with. Which beaches did you have in mind?',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      isOwn: true,
      type: 'text'
    },
    {
      id: '3',
      content: 'There\'s this secluded spot near Arambol that locals told me about. Perfect for sunset!',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isOwn: false,
      type: 'text'
    },
    {
      id: '4',
      content: 'This message will disappear in 24 hours ⏰',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isOwn: false,
      type: 'system'
    },
    {
      id: '5',
      content: 'Perfect! What time should we meet?',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      isOwn: true,
      type: 'text',
      expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000)
    },
    {
      id: '6',
      content: 'Hey! Want to check out that beach cafe tomorrow?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isOwn: false,
      type: 'text',
      expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000)
    }
  ];

  // Check for new chat buddy from Buddy Radar
  useEffect(() => {
    const newChatBuddy = localStorage.getItem('newChatBuddy');
    if (newChatBuddy) {
      const buddyData = JSON.parse(newChatBuddy);
      
      // Create new chat
      const newChat: Chat = {
        id: buddyData.buddyId,
        participant: {
          id: buddyData.buddyId,
          displayName: buddyData.buddyName,
          avatar: buddyData.buddyAvatar,
          isOnline: true,
          lastSeen: new Date()
        },
        lastMessage: {
          content: 'Chat started from Buddy Radar',
          timestamp: new Date(),
          isOwn: false,
          type: 'text'
        },
        unreadCount: 0,
        isDisappearing: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };

      // Check if chat already exists
      const existingChatIndex = mockChats.findIndex(chat => chat.id === buddyData.buddyId);
      
      if (existingChatIndex === -1) {
        // Add new chat
        setChats([newChat, ...mockChats]);
      } else {
        setChats(mockChats);
      }
      
      // Select the chat
      setSelectedChat(newChat);
      setMessages(mockMessages);
      
      // Clear the stored data
      localStorage.removeItem('newChatBuddy');
    } else {
      // Load default chats if no new buddy
      setChats(mockChats);
      setMessages(mockMessages);
    }
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    return date.toLocaleDateString();
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeUntilExpiry = (expiresAt: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    }
    return `${diffInHours}h`;
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    // Create new message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput.trim(),
      timestamp: new Date(),
      isOwn: true,
      type: 'text',
      expiresAt: isDisappearingMode ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined
    };

    // Add message to messages list
    setMessages(prev => [...prev, newMessage]);

    // Update chat's last message
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? {
            ...chat,
            lastMessage: {
              content: messageInput.trim(),
              timestamp: new Date(),
              isOwn: true,
              type: 'text'
            }
          }
        : chat
    ));

    // Clear input
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedChat) {
    return (
      <div className="p-4 pb-20 lg:pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Chats</h1>
            <p className="text-gray-400 text-sm">Anonymous connections that disappear</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Search className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Filter className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-medium text-sm">Privacy Protected</span>
          </div>
          <p className="text-gray-300 text-xs">
            All chats are end-to-end encrypted and disappear after your journey ends. No permanent records kept.
          </p>
        </div>

        {/* Chat List */}
        <div className="space-y-3">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={chat.participant.avatar}
                    alt={chat.participant.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                    chat.participant.isOnline ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-medium truncate">{chat.participant.displayName}</h3>
                    <div className="flex items-center space-x-2">
                      {chat.isDisappearing && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-orange-400" />
                          <span className="text-xs text-orange-400">
                            {chat.expiresAt && getTimeUntilExpiry(chat.expiresAt)}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatTime(chat.lastMessage.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Last Message */}
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm truncate flex-1">
                      {chat.lastMessage.isOwn && 'You: '}
                      {chat.lastMessage.content}
                    </p>
                    
                    {chat.unreadCount > 0 && (
                      <div className="ml-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Chat Type Indicator */}
                  <div className="flex items-center space-x-2 mt-1">
                    {chat.isDisappearing ? (
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3 text-orange-400" />
                        <span className="text-xs text-orange-400">Disappearing</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">Regular</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {chats.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Chats Yet</h3>
            <p className="text-gray-400 text-sm">
              Start connecting with fellow travelers through Buddy Radar
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedChat(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors lg:hidden"
            >
              ←
            </button>
            
            <div className="relative">
              <img
                src={selectedChat.participant.avatar}
                alt={selectedChat.participant.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                selectedChat.participant.isOnline ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
            </div>
            
            <div>
              <h2 className="text-white font-medium">{selectedChat.participant.displayName}</h2>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>
                  {selectedChat.participant.isOnline ? 'Online' : `Last seen ${formatTime(selectedChat.participant.lastSeen)}`}
                </span>
                {selectedChat.isDisappearing && selectedChat.expiresAt && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-orange-400" />
                      <span className="text-orange-400">
                        Expires in {getTimeUntilExpiry(selectedChat.expiresAt)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${
              message.type === 'system' 
                ? 'mx-auto'
                : message.isOwn 
                ? 'ml-auto' 
                : 'mr-auto'
            }`}>
              {message.type === 'system' ? (
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 px-3 py-2 bg-orange-500/20 rounded-full text-orange-400 text-xs border border-orange-400/30">
                    <Clock className="h-3 w-3" />
                    <span>{message.content}</span>
                  </div>
                </div>
              ) : (
                <div className={`rounded-2xl px-4 py-3 ${
                  message.isOwn
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-white/10 text-white border border-white/10'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      message.isOwn ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      {formatMessageTime(message.timestamp)}
                    </span>
                    
                    {message.expiresAt && (
                      <div className="flex items-center space-x-1">
                        <Clock className={`h-3 w-3 ${
                          message.isOwn ? 'text-white/70' : 'text-orange-400'
                        }`} />
                        <span className={`text-xs ${
                          message.isOwn ? 'text-white/70' : 'text-orange-400'
                        }`}>
                          {getTimeUntilExpiry(message.expiresAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-black/30 backdrop-blur-md border-t border-white/10 p-4">
        {/* Disappearing Mode Toggle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDisappearingMode(!isDisappearingMode)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                isDisappearingMode
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30'
                  : 'bg-white/10 text-gray-400 border border-white/10'
              }`}
            >
              {isDisappearingMode ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              <span>{isDisappearingMode ? 'Disappearing' : 'Regular'}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Camera className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Mic className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isDisappearingMode ? "Send a disappearing message..." : "Type a message..."}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none pr-12"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <Smile className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;