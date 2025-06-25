import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Compass, MapPin, Users, MessageCircle, User, Settings, 
  Footprints, Radar, Target, Camera, Map, Heart, Trophy,
  Bell, Search, Plus, Menu, X, LogOut, Shield, Zap,
  Clock, Utensils, Bot, Eye, Gift, AlertTriangle, BookOpen,
  Calendar, Globe, RefreshCw, Route as RouteIcon, Star,
  Smartphone, Headphones, Gamepad2, Video
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FootprintsPage from '../features/FootprintsPage';
import BuddyRadarPage from '../features/BuddyRadarPage';
import ChatPage from '../features/ChatPage';
import ProfilePage from '../features/ProfilePage';
import DiscoveryPage from '../features/DiscoveryPage';
import TimeCapsulePage from '../features/TimeCapsulePage';
import FoodDiscoveryPage from '../features/FoodDiscoveryPage';
import SafetyAlertsPage from '../features/SafetyAlertsPage';
import GamificationPage from '../features/GamificationPage';
import AIAssistantPage from '../features/AIAssistantPage';
import TravelJournalPage from '../features/TravelJournalPage';
import LiveEventsPage from '../features/LiveEventsPage';
import NomadNetworkPage from '../features/NomadNetworkPage';
import PlacesRatingPage from '../features/PlacesRatingPage';
import OfflineBuddyBeaconPage from '../features/OfflineBuddyBeaconPage';
import ARWorldPage from '../features/ARWorldPage';
import RouteDiscoveryPage from '../features/RouteDiscoveryPage';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', icon: Compass, label: 'Explore', exact: true },
    { path: '/dashboard/footprints', icon: Footprints, label: 'Footprints' },
    { path: '/dashboard/radar', icon: Radar, label: 'Buddy Radar' },
    { path: '/dashboard/discovery', icon: Target, label: 'Discovery' },
    { path: '/dashboard/chat', icon: MessageCircle, label: 'Chats' },
    { path: '/dashboard/profile', icon: User, label: 'Profile' }
  ];

  const additionalFeatures = [
    { path: '/dashboard/journal', icon: BookOpen, label: 'Travel Journal' },
    { path: '/dashboard/events', icon: Calendar, label: 'Live Events' },
    { path: '/dashboard/network', icon: Globe, label: 'Nomad Network' },
    { path: '/dashboard/route-discovery', icon: RouteIcon, label: 'Route Discovery' },
    { path: '/dashboard/ar-world', icon: Camera, label: 'AR World Tags' },
    { path: '/dashboard/time-capsules', icon: Clock, label: 'Time Capsules' },
    { path: '/dashboard/food-discovery', icon: Utensils, label: 'Food & Utilities' },
    { path: '/dashboard/safety', icon: AlertTriangle, label: 'Safety Center' },
    { path: '/dashboard/rewards', icon: Trophy, label: 'Rewards' },
    { path: '/dashboard/places-rating', icon: Star, label: 'Places & Reviews' },
    { path: '/dashboard/ai-assistant', icon: Bot, label: 'AI Assistant' },
    { path: '/dashboard/buddy-beacon', icon: Radar, label: 'Buddy Beacon' }
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      {/* Mobile Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Compass className="h-6 w-6 text-cyan-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                NOMAD
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/40 backdrop-blur-md border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Compass className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                NOMAD
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'}
                alt={user?.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{user?.displayName}</div>
                <div className="text-xs text-gray-400">{user?.travelStyle}</div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-sm font-bold text-cyan-400">{user?.footprints || 0}</div>
                <div className="text-xs text-gray-400">Footprints</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-sm font-bold text-purple-400">{user?.connections || 0}</div>
                <div className="text-xs text-gray-400">Connections</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-sm font-bold text-green-400">{user?.karma || 0}</div>
                <div className="text-xs text-gray-400">Karma</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {/* Core Features */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Core Features</h3>
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive(item.path, item.exact)
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Additional Features */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Advanced Features</h3>
                {additionalFeatures.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.label === 'AR World Tags' && (
                      <div className="ml-auto">
                        <Video className="h-3 w-3 text-purple-400" />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 w-full"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/footprints" element={<FootprintsPage />} />
            <Route path="/radar" element={<BuddyRadarPage />} />
            <Route path="/discovery" element={<DiscoveryPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/journal" element={<TravelJournalPage />} />
            <Route path="/events" element={<LiveEventsPage />} />
            <Route path="/network" element={<NomadNetworkPage />} />
            <Route path="/route-discovery" element={<RouteDiscoveryPage />} />
            <Route path="/ar-world" element={<ARWorldPage />} />
            <Route path="/time-capsules" element={<TimeCapsulePage />} />
            <Route path="/food-discovery" element={<FoodDiscoveryPage />} />
            <Route path="/safety" element={<SafetyAlertsPage />} />
            <Route path="/rewards" element={<GamificationPage />} />
            <Route path="/places-rating" element={<PlacesRatingPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/buddy-beacon" element={<OfflineBuddyBeaconPage />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10 px-4 py-2 lg:hidden">
        <div className="flex items-center justify-around">
          {navigationItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 ${
                isActive(item.path, item.exact)
                  ? 'text-cyan-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-sm w-full p-6">
            <div className="text-center mb-6">
              <LogOut className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Sign Out?</h2>
              <p className="text-gray-400 text-sm">
                Are you sure you want to sign out of your NOMAD account?
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardHome() {
  const { user } = useAuth();

  const quickActions = [
    { icon: Plus, label: 'Drop Footprint', color: 'from-orange-400 to-pink-500', path: '/dashboard/footprints' },
    { icon: Radar, label: 'Find Buddies', color: 'from-cyan-400 to-blue-500', path: '/dashboard/radar' },
    { icon: RouteIcon, label: 'Route Discovery', color: 'from-green-400 to-teal-500', path: '/dashboard/route-discovery' },
    { icon: Camera, label: 'AR World Tags', color: 'from-purple-400 to-pink-500', path: '/dashboard/ar-world' },
    { icon: Star, label: 'Rate Places', color: 'from-yellow-400 to-orange-500', path: '/dashboard/places-rating' },
    { icon: Bot, label: 'AI Assistant', color: 'from-blue-400 to-purple-500', path: '/dashboard/ai-assistant' },
    { icon: Calendar, label: 'Live Events', color: 'from-red-400 to-orange-500', path: '/dashboard/events' }
  ];

  const recentActivity = [
    { type: 'account', message: `Welcome ${user?.displayName}! Your account was created`, time: 'Just now', icon: User },
    { type: 'system', message: 'Random travel name assigned for privacy', time: 'Just now', icon: Shield },
    { type: 'ar', message: 'AR World Tags ready - leave messages in AR!', time: 'Now', icon: Camera },
    { type: 'route', message: 'Route Discovery available - find curated travel routes', time: 'Now', icon: RouteIcon },
    { type: 'discovery', message: 'Explore all 80+ features across 9 categories', time: 'Now', icon: Target },
    { type: 'community', message: 'Ready to find your travel twin?', time: 'Now', icon: Users },
    { type: 'journey', message: 'Your nomadic journey begins here', time: 'Now', icon: Compass }
  ];

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'}
              alt={user?.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-white">Welcome, {user?.displayName}!</h1>
              <p className="text-gray-400 text-sm">Your anonymous travel identity is ready</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{user?.footprints || 0}</div>
              <div className="text-xs text-gray-400">Footprints</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">{user?.connections || 0}</div>
              <div className="text-xs text-gray-400">Connections</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">1</div>
              <div className="text-xs text-gray-400">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">{user?.karma || 0}</div>
              <div className="text-xs text-gray-400">Karma</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`bg-gradient-to-r ${action.color} bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105`}
            >
              <action.icon className="h-6 w-6 text-white mb-2" />
              <span className="text-sm font-medium text-white">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-white">Getting Started</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                  <activity.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AR/VR Features Highlight */}
      <div className="mb-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <div className="flex items-center space-x-2 mb-4">
          <Camera className="h-6 w-6 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">AR/VR Ready</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">AR World Tags</span>
            <Link to="/dashboard/ar-world" className="text-sm text-purple-400 font-medium">Explore →</Link>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Virtual Postcards</span>
            <span className="text-sm text-cyan-400 font-medium">Coming Soon</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">VR Travel Experiences</span>
            <span className="text-sm text-pink-400 font-medium">Beta Access</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-black/20 rounded-xl">
          <p className="text-xs text-gray-400 text-center">
            Experience travel in a whole new dimension with AR/VR features designed for the future of nomadic exploration.
          </p>
        </div>
      </div>

      {/* User Profile Summary */}
      <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-6 w-6 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Your Travel Identity</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Display Name</span>
            <span className="text-sm text-cyan-400 font-medium">{user?.displayName}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Travel Style</span>
            <span className="text-sm text-purple-400 font-medium">{user?.travelStyle}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Member Since</span>
            <span className="text-sm text-green-400 font-medium">
              {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Today'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Privacy Status</span>
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Protected</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-3 bg-black/20 rounded-xl">
          <p className="text-xs text-gray-400 text-center">
            Your identity is completely anonymous. Only your travel experiences are shared with the community.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;