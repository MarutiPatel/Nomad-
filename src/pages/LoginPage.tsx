import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, 
  Shield, Zap, Globe, Heart, User, Smartphone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    otp: ''
  });

  const { login, loginWithPhone, register, registerWithPhone } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (loginMethod === 'email') {
        if (isLogin) {
          await login(formData.email, formData.password);
        } else {
          await register(formData.email, formData.password);
        }
      } else {
        if (!otpSent) {
          // Simulate sending OTP
          await new Promise(resolve => setTimeout(resolve, 1000));
          setOtpSent(true);
        } else {
          if (isLogin) {
            await loginWithPhone(formData.phone, formData.otp);
          } else {
            await registerWithPhone(formData.phone);
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetForm = () => {
    setFormData({ email: '', phone: '', password: '', otp: '' });
    setOtpSent(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const switchMethod = (method: 'email' | 'phone') => {
    setLoginMethod(method);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      {/* Header */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Compass className="h-8 w-8 text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text" />
              <div className="absolute inset-0 h-8 w-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full blur-lg opacity-30 animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              NOMAD
            </span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Privacy-First Message */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back, Nomad' : 'Join the Journey'}
              </span>
            </h1>
            <p className="text-gray-400 text-sm">
              Privacy-first travel connections. No personal data required.
            </p>
          </div>

          {/* Login/Register Form */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6">
            {/* Method Toggle */}
            <div className="flex rounded-2xl bg-black/20 p-1 mb-6">
              <button
                onClick={() => switchMethod('email')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                  loginMethod === 'email'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Email</span>
              </button>
              <button
                onClick={() => switchMethod('phone')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                  loginMethod === 'phone'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm font-medium">Phone</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {loginMethod === 'email' ? (
                <>
                  {/* Email Input */}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Phone Input */}
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                      required
                      disabled={otpSent}
                    />
                  </div>

                  {/* OTP Input */}
                  {otpSent && (
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        placeholder="Enter OTP"
                        className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>
                      {loginMethod === 'phone' && !otpSent
                        ? 'Send OTP'
                        : isLogin
                        ? 'Sign In'
                        : 'Create Account'
                      }
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Privacy Features */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl border border-white/10">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium text-green-400">Privacy Protected</span>
              </div>
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Random display name assigned automatically</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>No personal information required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <span>Anonymous travel connections</span>
                </div>
              </div>
            </div>

            {/* Toggle Login/Register */}
            <div className="text-center mt-6">
              <button
                onClick={switchMode}
                className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-400 hover:bg-clip-text transition-all duration-300"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          {/* Quick Features */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
              <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <span className="text-xs text-gray-300">AI-Powered</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
              <Globe className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <span className="text-xs text-gray-300">Global Network</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;