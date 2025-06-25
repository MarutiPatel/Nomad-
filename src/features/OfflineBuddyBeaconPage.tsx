import React, { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, MapPin, Users, Radio, Battery, 
  Signal, Clock, Navigation, AlertTriangle, 
  CheckCircle, RefreshCw, Settings, Send, Bluetooth
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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

function OfflineBuddyBeaconPage() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isBeaconActive, setIsBeaconActive] = useState(false);
  const [connectedBuddies, setConnectedBuddies] = useState<BuddyLocation[]>([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [meshNetworkSize, setMeshNetworkSize] = useState(0);

  // Mock buddy data
  const mockBuddies: BuddyLocation[] = [
    {
      id: '1',
      displayName: 'MountainExplorer23',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      lastUpdate: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
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
      lastUpdate: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
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
      lastUpdate: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      isOnline: false,
      batteryLevel: 23,
      distance: 1.2,
      signalStrength: 'weak',
      emergencyMode: true
    }
  ];

  // Mock emergency alerts
  const mockAlerts: EmergencyAlert[] = [
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

  useEffect(() => {
    setConnectedBuddies(mockBuddies);
    setEmergencyAlerts(mockAlerts);

    // Listen for online/offline changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate location updates
    const locationInterval = setInterval(() => {
      if (isBeaconActive) {
        // Get current location (mocked)
        setMyLocation({
          lat: 32.2396 + (Math.random() - 0.5) * 0.001,
          lng: 77.1887 + (Math.random() - 0.5) * 0.001
        });
        
        // Update buddy locations and signal strength
        setConnectedBuddies(prev => prev.map(buddy => ({
          ...buddy,
          lastUpdate: buddy.isOnline ? new Date() : buddy.lastUpdate,
          signalStrength: calculateSignalStrength(buddy.distance, isOnline),
          distance: buddy.distance + (Math.random() - 0.5) * 0.1
        })));

        // Update mesh network size
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
      // Request location permission
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
      // Send emergency signal to all buddies
      console.log('Emergency signal sent to all nearby buddies');
    }
  };

  const sendMessage = (buddyId: string, message: string) => {
    console.log(`Sending message to ${buddyId}: ${message}`);
    // In real implementation, this would use WebRTC or cache for offline delivery
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

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Buddy Beacon</h1>
        <p className="text-gray-400 text-sm">Share location securely with travel buddies</p>
      </div>

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

      {/* Emergency Alerts */}
      {emergencyAlerts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Emergency Alerts</h3>
          <div className="space-y-3">
            {emergencyAlerts.map((alert) => (
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
  );
}

export default OfflineBuddyBeaconPage;