import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Shield, Users, MapPin, Clock, Plus, Filter, Search,
  Bell, Phone, Navigation, Zap, Eye, MessageCircle, Star, CheckCircle,
  Wifi, WifiOff, Radio, Battery, Signal, RefreshCw, Settings, Send, 
  Bluetooth, Waves, ThumbsUp, ThumbsDown, Flag, X, Edit, Smartphone,
  UserX, Mic, Camera, Video, Image, FileText, Calendar, DollarSign,
  Backpack, Train, Heart, Compass, TreePine, Coins, Crown, Trophy,
  Gamepad2, Bot, Cpu, Headphones, Map, Telescope, Sparkles, Wand2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Interfaces from OfflineBuddyBeaconPage
interface BuddyLocation {
  id: string;
  displayName: string;
  avatar: string;
  coordinates: { lat: number; lng: number };
  lastUpdate: Date;
  isOnline: boolean;
  batteryLevel?: number;
  distance: number;
  signalStrength: 'strong' | 'medium' | 'weak' | 'offline';
  emergencyMode: boolean;
}

interface EmergencyAlert {
  id: string;
  buddyId: string;
  buddyName: string;
  location: { lat: number; lng: number };
  message: string;
  timestamp: Date;
  isRead: boolean;
}

// Interfaces from SafetyAlertsPage
interface SafetyAlert {
  id: string;
  type: 'emergency' | 'hazard' | 'protest' | 'weather' | 'traffic' | 'crime';
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  reportedBy: 'ai' | 'community' | 'official';
  verified: boolean;
  upvotes: number;
  isActive: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  type: 'police' | 'medical' | 'fire' | 'tourist-helpline';
  phone: string;
  location: string;
  distance: number;
  available24x7: boolean;
}

function SafetyCenterPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'alerts' | 'emergency' | 'beacon' | 'report'>('alerts');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Buddy Beacon states
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isBeaconActive, setIsBeaconActive] = useState(false);
  const [connectedBuddies, setConnectedBuddies] = useState<BuddyLocation[]>([]);
  const [buddyEmergencyAlerts, setBuddyEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [meshNetworkSize, setMeshNetworkSize] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // Safety Alerts states
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  // Mock data from both components
  const mockBuddies: BuddyLocation[] = [
    {
      id: '1',
      displayName: 'MountainExplorer23',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      lastUpdate: new Date(Date.now() - 5 * 60 * 1000),
      isOnline: true,
      batteryLevel: 78,
      distance: 0.3,
      signalStrength: 'strong',
      emergencyMode: false
    },
    {
      id: '2',
      displayName: 'TrekSoul42',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      coordinates: { lat: 32.2410, lng: 77.1890 },
      lastUpdate: new Date(Date.now() - 15 * 60 * 1000),
      isOnline: false,
      batteryLevel: 45,
      distance: 0.8,
      signalStrength: 'medium',
      emergencyMode: false
    },
    {
      id: '3',
      displayName: 'AdventureSeeker',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      coordinates: { lat: 32.2380, lng: 77.1850 },
      lastUpdate: new Date(Date.now() - 45 * 60 * 1000),
      isOnline: false,
      batteryLevel: 23,
      distance: 1.2,
      signalStrength: 'weak',
      emergencyMode: true
    }
  ];

  const mockBuddyAlerts: EmergencyAlert[] = [
    {
      id: '1',
      buddyId: '3',
      buddyName: 'AdventureSeeker',
      location: { lat: 32.2380, lng: 77.1850 },
      message: 'Lost on trail, low battery. Send help if possible.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false
    }
  ];

  const mockSafetyAlerts: SafetyAlert[] = [
    {
      id: '1',
      type: 'weather',
      title: 'Heavy Rainfall Warning',
      description: 'Monsoon alert for next 6 hours. Roads may be waterlogged. Avoid low-lying areas.',
      location: 'Mumbai, Maharashtra',
      coordinates: { lat: 19.0760, lng: 72.8777 },
      distance: 2.5,
      severity: 'high',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      reportedBy: 'ai',
      verified: true,
      upvotes: 45,
      isActive: true
    },
    {
      id: '2',
      type: 'protest',
      title: 'Road Blockade',
      description: 'Peaceful protest causing traffic disruption on main highway. Alternative routes suggested.',
      location: 'Delhi-Gurgaon Highway',
      coordinates: { lat: 28.4595, lng: 77.0266 },
      distance: 5.2,
      severity: 'medium',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      reportedBy: 'community',
      verified: true,
      upvotes: 23,
      isActive: true
    },
    {
      id: '3',
      type: 'hazard',
      title: 'Landslide Risk',
      description: 'Recent rains have made the mountain road unstable. Exercise extreme caution.',
      location: 'Manali-Leh Highway',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      distance: 15.8,
      severity: 'critical',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      reportedBy: 'official',
      verified: true,
      upvotes: 67,
      isActive: true
    }
  ];

  const mockEmergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Police Station',
      type: 'police',
      phone: '100',
      location: 'Central Police Station',
      distance: 1.2,
      available24x7: true
    },
    {
      id: '2',
      name: 'District Hospital',
      type: 'medical',
      phone: '108',
      location: 'Government Hospital',
      distance: 2.8,
      available24x7: true
    },
    {
      id: '3',
      name: 'Tourist Helpline',
      type: 'tourist-helpline',
      phone: '1363',
      location: 'Tourism Office',
      distance: 0.9,
      available24x7: true
    }
  ];

  // Initialize data
  useEffect(() => {
    setConnectedBuddies(mockBuddies);
    setBuddyEmergencyAlerts(mockBuddyAlerts);
    setSafetyAlerts(mockSafetyAlerts);
    setEmergencyContacts(mockEmergencyContacts);

    // Listen for online/offline changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate location updates
    const locationInterval = setInterval(() => {
      if (isBeaconActive) {
        setMyLocation({
          lat: 32.2396 + (Math.random() - 0.5) * 0.001,
          lng: 77.1887 + (Math.random() - 0.5) * 0.001
        });
        
        setConnectedBuddies(prev => prev.map(buddy => ({
          ...buddy,
          lastUpdate: buddy.isOnline ? new Date() : buddy.lastUpdate,
          signalStrength: calculateSignalStrength(buddy.distance, isOnline),
          distance: buddy.distance + (Math.random() - 0.5) * 0.1
        })));

        setMeshNetworkSize(Math.floor(Math.random() * 8) + 3);
      }
    }, 5000);

    // Simulate battery drain
    const batteryInterval = setInterval(() => {
      if (isBeaconActive) {
        setBatteryLevel(prev => Math.max(0, prev - 0.1));
      }
    }, 10000);

    // Get battery status if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(locationInterval);
      clearInterval(batteryInterval);
    };
  }, [isBeaconActive, isOnline]);

  const calculateSignalStrength = (distance: number, online: boolean): 'strong' | 'medium' | 'weak' | 'offline' => {
    if (!online) return 'offline';
    if (distance < 0.5) return 'strong';
    if (distance < 1.0) return 'medium';
    return 'weak';
  };

  const toggleBeacon = async () => {
    if (!isBeaconActive) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });
        
        setMyLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        
        setIsBeaconActive(true);
      } catch (error) {
        alert('Location access is required for Buddy Beacon to work');
      }
    } else {
      setIsBeaconActive(false);
    }
  };

  const toggleEmergencyMode = () => {
    setEmergencyMode(!emergencyMode);
    if (!emergencyMode) {
      console.log('Emergency signal sent to all nearby buddies');
    }
  };

  const sendMessage = (buddyId: string, message: string) => {
    console.log(`Sending message to ${buddyId}: ${message}`);
  };

  const formatTimeAgo = (date: Date) => {
    const diffInMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ago`;
  };

  const getSignalIcon = (strength: string) => {
    switch (strength) {
      case 'strong': return <Signal className="h-4 w-4 text-green-400" />;
      case 'medium': return <Signal className="h-4 w-4 text-yellow-400" />;
      case 'weak': return <Signal className="h-4 w-4 text-orange-400" />;
      default: return <WifiOff className="h-4 w-4 text-red-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'from-green-400 to-emerald-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'high': return 'from-orange-400 to-red-500';
      case 'critical': return 'from-red-500 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'hazard': return AlertTriangle;
      case 'protest': return Users;
      case 'weather': return Zap;
      case 'traffic': return Navigation;
      case 'crime': return Shield;
      default: return AlertTriangle;
    }
  };

  const filteredSafetyAlerts = selectedSeverity === 'all' 
    ? safetyAlerts 
    : safetyAlerts.filter(alert => alert.severity === selectedSeverity);

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Safety Center</h1>
        <p className="text-gray-400 text-sm">Comprehensive safety and emergency features</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto space-x-1 bg-black/20 rounded-2xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            activeTab === 'alerts'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Alerts</span>
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            activeTab === 'emergency'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Phone className="h-4 w-4" />
          <span>Emergency</span>
        </button>
        <button
          onClick={() => setActiveTab('beacon')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            activeTab === 'beacon'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Smartphone className="h-4 w-4" />
          <span>Buddy Beacon</span>
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            activeTab === 'report'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Report</span>
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'alerts' && (
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

          {/* Severity Filters */}
          <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
            {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
              <button
                key={severity}
                onClick={() => setSelectedSeverity(severity)}
                className={`px-4 py-2 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedSeverity === severity
                    ? `bg-gradient-to-r ${getSeverityColor(severity)} text-white shadow-lg`
                    : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                }`}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </button>
            ))}
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredSafetyAlerts.map((alert) => {
              const IconComponent = getTypeIcon(alert.type);
              return (
                <div
                  key={alert.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getSeverityColor(alert.severity)} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold">{alert.title}</h3>
                          <div className="flex items-center space-x-1 text-gray-400 text-sm">
                            <MapPin className="h-3 w-3" />
                            <span>{alert.location} • {alert.distance}km away</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {alert.verified && (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          )}
                          <span className="text-xs text-gray-400">{formatTimeAgo(alert.timestamp)}</span>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-3">{alert.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.reportedBy === 'ai' ? 'bg-purple-500/20 text-purple-400' :
                            alert.reportedBy === 'community' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {alert.reportedBy === 'ai' ? 'AI Alert' :
                             alert.reportedBy === 'community' ? 'Community' : 'Official'}
                          </div>
                          
                          <div className="flex items-center space-x-1 text-gray-400 text-sm">
                            <Users className="h-3 w-3" />
                            <span>{alert.upvotes}</span>
                          </div>
                        </div>
                        
                        <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                          View Details →
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

      {activeTab === 'emergency' && (
        <div>
          {/* Emergency Button */}
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-3xl p-6 border border-red-400/30 mb-6">
            <div className="text-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Emergency Assistance</h2>
              <p className="text-gray-400 text-sm">Immediate help when you need it most</p>
            </div>
            
            <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <Phone className="h-6 w-6" />
              <span>Emergency Call</span>
            </button>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Emergency Contacts</h3>
            
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      contact.type === 'police' ? 'bg-blue-500/20' :
                      contact.type === 'medical' ? 'bg-red-500/20' :
                      contact.type === 'fire' ? 'bg-orange-500/20' :
                      'bg-green-500/20'
                    }`}>
                      <Phone className={`h-5 w-5 ${
                        contact.type === 'police' ? 'text-blue-400' :
                        contact.type === 'medical' ? 'text-red-400' :
                        contact.type === 'fire' ? 'text-orange-400' :
                        'text-green-400'
                      }`} />
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium">{contact.name}</h4>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <span>{contact.location} • {contact.distance}km</span>
                        {contact.available24x7 && (
                          <span className="text-green-400 text-xs">24/7</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button className="bg-gradient-to-r from-green-500 to-teal-500 px-4 py-2 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300">
                    Call {contact.phone}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'beacon' && (
        <div>
          {/* Connection Status */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {isOnline ? (
                  <Wifi className="h-6 w-6 text-green-400" />
                ) : (
                  <WifiOff className="h-6 w-6 text-orange-400" />
                )}
                <div>
                  <h2 className="text-white font-semibold">
                    {isOnline ? 'Online Mode' : 'Offline Mode'}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {isOnline ? 'Connected to internet' : 'Using mesh network'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Battery className={`h-5 w-5 ${
                  batteryLevel > 50 ? 'text-green-400' : 
                  batteryLevel > 20 ? 'text-yellow-400' : 'text-red-400'
                }`} />
                <span className="text-white font-medium">{batteryLevel}%</span>
              </div>
            </div>

            {/* Beacon Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-medium">Location Beacon</h3>
                <p className="text-gray-400 text-xs">Share your location with trusted buddies</p>
              </div>
              <button
                onClick={toggleBeacon}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  isBeaconActive
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {isBeaconActive ? 'Active' : 'Inactive'}
              </button>
            </div>

            {/* Mesh Network Info */}
            {!isOnline && isBeaconActive && (
              <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl p-3 border border-orange-400/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Radio className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400 font-medium text-sm">Mesh Network Active</span>
                </div>
                <p className="text-orange-300 text-xs">
                  Connected to {meshNetworkSize} devices in mesh network
                </p>
              </div>
            )}
          </div>

          {/* Emergency Mode */}
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-3xl border border-red-400/30 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                <div>
                  <h2 className="text-white font-semibold">Emergency Mode</h2>
                  <p className="text-gray-400 text-sm">Alert all nearby buddies</p>
                </div>
              </div>
              
              <button
                onClick={toggleEmergencyMode}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  emergencyMode
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg animate-pulse'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {emergencyMode ? 'ACTIVE' : 'Activate'}
              </button>
            </div>

            {emergencyMode && (
              <div className="bg-red-500/20 rounded-xl p-3 border border-red-400/30">
                <p className="text-red-300 text-sm">
                  🚨 Emergency signal active - Your location is being shared with all trusted buddies
                </p>
              </div>
            )}
          </div>

          {/* Emergency Alerts from Buddies */}
          {buddyEmergencyAlerts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Emergency Alerts</h3>
              <div className="space-y-3">
                {buddyEmergencyAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl border border-red-400/30 p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <span className="text-red-400 font-medium">{alert.buddyName}</span>
                      </div>
                      <span className="text-red-300 text-xs">{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                    <p className="text-red-200 text-sm mb-3">{alert.message}</p>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300">
                        Respond
                      </button>
                      <button className="px-4 py-2 border border-red-400/30 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                        Navigate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connected Buddies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Connected Buddies ({connectedBuddies.length})
            </h3>
            
            <div className="space-y-3">
              {connectedBuddies.map((buddy) => (
                <div
                  key={buddy.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={buddy.avatar}
                        alt={buddy.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                        buddy.emergencyMode ? 'bg-red-400 animate-pulse' :
                        buddy.isOnline ? 'bg-green-400' : 'bg-gray-400'
                      }`}></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium">{buddy.displayName}</h4>
                        <div className="flex items-center space-x-2">
                          {getSignalIcon(buddy.signalStrength)}
                          <span className="text-xs text-gray-400">{buddy.distance.toFixed(1)}km</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-400">
                          <span>Last seen: {formatTimeAgo(buddy.lastUpdate)}</span>
                          {buddy.batteryLevel && (
                            <span className={`${
                              buddy.batteryLevel > 50 ? 'text-green-400' : 
                              buddy.batteryLevel > 20 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {buddy.batteryLevel}% battery
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => sendMessage(buddy.id, 'Check-in message')}
                            className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors"
                          >
                            <Send className="h-3 w-3 text-blue-400" />
                          </button>
                          <button className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors">
                            <Navigation className="h-3 w-3 text-green-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {buddy.emergencyMode && (
                    <div className="mt-3 p-2 bg-red-500/20 rounded-xl border border-red-400/30">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <span className="text-red-400 text-sm font-medium">Emergency Mode Active</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technology Info */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl border border-cyan-400/30 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bluetooth className="h-6 w-6 text-cyan-400" />
              <h3 className="text-cyan-400 font-medium">How It Works</h3>
            </div>
            
            <div className="space-y-3 text-sm text-cyan-300">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Online: Real-time location sharing via WebRTC</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Offline: Cached locations & Service Worker sync</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Emergency: Broadcasts to all nearby devices</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Privacy: End-to-end encrypted location data</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div>
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
            <div className="text-center mb-6">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Report Safety Issue</h2>
              <p className="text-gray-400 text-sm">Help keep the community safe by reporting incidents</p>
            </div>
            
            <button
              onClick={() => setShowReportModal(true)}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Plus className="h-6 w-6" />
              <span>Create Safety Report</span>
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}

function ReportModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    type: 'hazard',
    title: '',
    description: '',
    location: '',
    severity: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating safety report:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Report Safety Issue</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Issue Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="hazard">Road Hazard</option>
                <option value="emergency">Emergency</option>
                <option value="protest">Protest/Blockade</option>
                <option value="weather">Weather Alert</option>
                <option value="crime">Crime/Safety</option>
                <option value="traffic">Traffic Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                rows={3}
                placeholder="Provide details about the safety issue..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                placeholder="Where is this happening?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-white/20 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SafetyCenterPage;