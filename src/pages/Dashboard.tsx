import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Compass, MapPin, Users, MessageCircle, User, Settings, 
  Footprints, Radar, Target, Camera, Map, Heart, Trophy,
  Bell, Search, Plus, Menu, X, LogOut, Shield, Zap,
  Clock, Utensils, Bot, Eye, Gift, AlertTriangle, BookOpen,
  Calendar, Globe
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
import ARWorldPage from '../features/ARWorldPage';
import AIAssistantPage from '../features/AIAssistantPage';
import TravelJournalPage from '../features/TravelJournalPage';
import LiveEventsPage from '../features/LiveEventsPage';
import NomadNetworkPage from '../features/NomadNetworkPage';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    { path: '/dashboard/time-capsules', icon: Clock, label: 'Time Capsules' },
    { path: '/dashboard/food-discovery', icon: Utensils, label: 'Food & Utilities' },
    { path: '/dashboard/safety', icon: AlertTriangle, label: 'Safety Center' },
    { path: '/dashboard/rewards', icon: Trophy, label: 'Rewards' },
    { path: '/dashboard/ar-world', icon: Eye, label: 'AR World' },
    { path: '/dashboard/ai-assistant', icon: Bot, label: 'AI Assistant' }
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{user?.displayName}</div>
                <div className="text-xs text-gray-400">{user?.travelStyle} Traveler</div>
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
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">More Features</h3>
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
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={logout}
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
            <Route path="/time-capsules" element={<TimeCapsulePage />} />
            <Route path="/food-discovery" element={<FoodDiscoveryPage />} />
            <Route path="/safety" element={<SafetyAlertsPage />} />
            <Route path="/rewards" element={<GamificationPage />} />
            <Route path="/ar-world" element={<ARWorldPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
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
    </div>
  );
}

function DashboardHome() {
  const { user } = useAuth();

  const quickActions = [
    { icon: Plus, label: 'Drop Footprint', color: 'from-orange-400 to-pink-500', path: '/dashboard/footprints' },
    { icon: Radar, label: 'Find Buddies', color: 'from-cyan-400 to-blue-500', path: '/dashboard/radar' },
    { icon: Camera, label: 'AR World', color: 'from-purple-400 to-pink-500', path: '/dashboard/ar-world' },
    { icon: Bot, label: 'AI Assistant', color: 'from-green-400 to-teal-500', path: '/dashboard/ai-assistant' },
    { icon: BookOpen, label: 'Journal', color: 'from-blue-400 to-purple-500', path: '/dashboard/journal' },
    { icon: Calendar, label: 'Live Events', color: 'from-red-400 to-orange-500', path: '/dashboard/events' }
  ];

  const recentActivity = [
    { type: 'footprint', message: 'You dropped a footprint at Goa Beach', time: '2h ago', icon: Footprints },
    { type: 'buddy', message: 'New travel buddy nearby in Mumbai', time: '4h ago', icon: Users },
    { type: 'chat', message: 'Message from WanderingSpirit42', time: '6h ago', icon: MessageCircle },
    { type: 'discovery', message: 'New hidden gem discovered', time: '1d ago', icon: Target },
    { type: 'ar', message: 'AR tag created at secret beach', time: '2d ago', icon: Eye },
    { type: 'karma', message: 'Earned 50 karma points for helping locals', time: '3d ago', icon: Heart }
  ];

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Welcome back, {user?.displayName}!</h1>
              <p className="text-gray-400 text-sm">Ready for your next adventure?</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">12</div>
              <div className="text-xs text-gray-400">Footprints</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">5</div>
              <div className="text-xs text-gray-400">Connections</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">3</div>
              <div className="text-xs text-gray-400">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">850</div>
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
        <h2 className="text-lg font-semibold mb-4 text-white">Recent Activity</h2>
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

      {/* Travel Stats */}
      <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <h2 className="text-lg font-semibold text-white">Travel Achievements</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Explorer Badge</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-gray-700 rounded-full">
                <div className="w-12 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></div>
              </div>
              <span className="text-xs text-gray-400">75%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Social Butterfly</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-gray-700 rounded-full">
                <div className="w-8 h-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full"></div>
              </div>
              <span className="text-xs text-gray-400">50%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Karma Master</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-gray-700 rounded-full">
                <div className="w-14 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
              </div>
              <span className="text-xs text-gray-400">85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;