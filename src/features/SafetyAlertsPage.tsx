import React, { useState } from 'react';
import { 
  AlertTriangle, Shield, Users, MapPin, Clock, 
  Plus, Filter, Search, Bell, Phone, Navigation,
  Zap, Eye, MessageCircle, Star, CheckCircle
} from 'lucide-react';

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

function SafetyAlertsPage() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'emergency' | 'report'>('alerts');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [showReportModal, setShowReportModal] = useState(false);

  const mockAlerts: SafetyAlert[] = [
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

  const [alerts] = useState(mockAlerts);
  const [emergencyContacts] = useState(mockEmergencyContacts);

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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredAlerts = selectedSeverity === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.severity === selectedSeverity);

  return (
    <div className="p-4 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Safety Center</h1>
        <p className="text-gray-400 text-sm">Stay informed and travel safely</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex rounded-2xl bg-black/20 p-1 mb-6">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'alerts'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Alerts</span>
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'emergency'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Phone className="h-4 w-4" />
          <span className="text-sm font-medium">Emergency</span>
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'report'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Report</span>
        </button>
      </div>

      {/* Content */}
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
            {filteredAlerts.map((alert) => {
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

export default SafetyAlertsPage;