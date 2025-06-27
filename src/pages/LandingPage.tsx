import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, Users, Shield, Zap, MapPin, Heart, Globe, ArrowRight, Menu, X,
  Footprints, Radar, MessageCircle, Target, Utensils, Navigation, Eye, EyeOff,
  Star, Trophy, Brain, Gamepad2, AlertTriangle, Clock, Camera, Gift, Headphones,
  Telescope, Wand2, Bot, Cpu, TreePine, Coins, Smartphone
} from 'lucide-react';

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Find Your Travel Soul",
      subtitle: "Connect anonymously with travelers who share your vibe",
      gradient: "from-pink-500 via-purple-500 to-cyan-500"
    },
    {
      title: "Leave Digital Footprints",
      subtitle: "Mark your journey and discover paths of fellow nomads",
      gradient: "from-orange-500 via-pink-500 to-purple-500"
    },
    {
      title: "Buddy Radar Active",
      subtitle: "AI finds your perfect travel companion nearby",
      gradient: "from-cyan-500 via-blue-500 to-purple-500"
    },
    {
      title: "Privacy-First Network",
      subtitle: "Anonymous connections with disappearing messages",
      gradient: "from-green-500 via-teal-500 to-cyan-500"
    }
  ];

  const quickFeatures = [
    { icon: Shield, title: "Anonymous", color: "from-green-400 to-emerald-500" },
    { icon: Zap, title: "AI-Powered", color: "from-yellow-400 to-orange-500" },
    { icon: Globe, title: "Global", color: "from-blue-400 to-cyan-500" },
    { icon: Heart, title: "Soul-Based", color: "from-pink-400 to-rose-500" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white overflow-hidden">
      {/* Mobile-First Navigation */}
      <nav className="relative z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Compass className="h-8 w-8 text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text" />
                <div className="absolute inset-0 h-8 w-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full blur-lg opacity-30 animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NOMAD
              </span>
            </div>
            
            <button 
              className="relative p-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10">
            <div className="px-4 py-6 space-y-4">
              <a href="#safety" className="block text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-400 hover:bg-clip-text transition-all duration-300 py-2">Safety</a>
              <Link to="/login" className="block w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 px-6 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-12">
        {/* Animated Rainbow Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} opacity-20 transition-all duration-1000`} />
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-sm mx-auto">
          <div className="animate-fade-in-up">
            {/* App Icon Mockup */}
            <div className="mb-8 relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center mb-4 transform hover:scale-105 transition-transform duration-300">
                <Compass className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              <span className={`bg-gradient-to-r ${slides[currentSlide].gradient} bg-clip-text text-transparent`}>
                {slides[currentSlide].title}
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>

            {/* Quick Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {quickFeatures.map((feature, index) => (
                <div key={index} className={`flex items-center space-x-2 px-3 py-2 rounded-full bg-gradient-to-r ${feature.color} bg-opacity-20 backdrop-blur-sm border border-white/10`}>
                  <feature.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 mb-8">
              <Link to="/login" className="group w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/20 hover:border-purple-400/50 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
                Learn More
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-400 scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Safety Highlight */}
      <section id="safety" className="py-16 px-4 relative">
        <div className="max-w-sm mx-auto">
          <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Privacy-First Design
                </span>
              </h2>
            </div>
            
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
                <span>Anonymous sign-up with no personal data required</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500" />
                <span>End-to-end encrypted disappearing messages</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                <span>Anti-screenshot protection for sensitive content</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
                <span>AI-powered safety alerts and community moderation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-pink-500" />
                <span>Content protection when app loses focus or visibility</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 py-8 px-4">
        <div className="max-w-sm mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Compass className="h-6 w-6 text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              NOMAD
            </span>
          </div>
          <div className="text-gray-400 text-sm space-y-1">
            <p>&copy; 2025 NOMAD. Privacy-first travel connections.</p>
            <p className="text-xs">A Travel Soul Network</p>
            <p className="text-xs">Where Nomads Meet</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;