import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, 
  Shield, Zap, Globe, Heart, User, Smartphone, AlertCircle,
  CheckCircle, RefreshCw, Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  const { login, loginWithPhone, register, registerWithPhone, loading, error, clearError } = useAuth();

  // OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Clear errors when switching modes
  useEffect(() => {
    clearError();
    setFormErrors({
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      otp: ''
    });
  }, [isLogin, loginMethod, clearError]);

  const validateForm = () => {
    const errors = {
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      otp: ''
    };

    if (loginMethod === 'email') {
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email';
      }

      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else {
      if (!formData.phone) {
        errors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }

      if (otpSent && !formData.otp) {
        errors.otp = 'OTP is required';
      } else if (otpSent && formData.otp.length !== 4) {
        errors.otp = 'OTP must be 4 digits';
      }
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      if (loginMethod === 'email') {
        if (isLogin) {
          await login(formData.email, formData.password);
        } else {
          await register(formData.email, formData.password);
        }
      } else {
        if (!otpSent) {
          // Send OTP
          setOtpSent(true);
          setCountdown(60);
        } else {
          if (isLogin) {
            await loginWithPhone(formData.phone, formData.otp);
          } else {
            await registerWithPhone(formData.phone);
          }
        }
      }
    } catch (err) {
      // Error is handled by the context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const resetForm = () => {
    setFormData({ 
      email: '', 
      phone: '', 
      password: '', 
      confirmPassword: '', 
      otp: '' 
    });
    setFormErrors({
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      otp: ''
    });
    setOtpSent(false);
    setCountdown(0);
    clearError();
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const switchMethod = (method: 'email' | 'phone') => {
    setLoginMethod(method);
    resetForm();
  };

  const resendOTP = () => {
    setCountdown(60);
    // Simulate resending OTP
  };

  const generateNewRandomName = () => {
    const adjectives = ['Wandering', 'Mystic', 'Cosmic', 'Digital', 'Free', 'Wild', 'Zen', 'Brave'];
    const nouns = ['Explorer', 'Traveler', 'Soul', 'Spirit', 'Wanderer', 'Nomad', 'Dreamer', 'Seeker'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 999) + 1;
    return `${adj}${noun}${num}`;
  };

  const [previewName] = useState(generateNewRandomName());

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
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 'Join the Journey'}
              </span>
            </h1>
            <p className="text-gray-400 text-sm mb-4">
              {isLogin 
                ? 'Sign in to continue your nomadic adventures'
                : 'Create your anonymous travel identity'
              }
            </p>

            {/* Random Name Preview for Registration */}
            {!isLogin && (
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-4 border border-green-400/30 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Your Random Travel Name:</span>
                </div>
                <div className="text-lg font-bold text-white">{previewName}</div>
                <p className="text-xs text-gray-400 mt-1">
                  You can change this later in your profile
                </p>
              </div>
            )}
          </div>

          {/* Login/Register Form */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-2xl">
            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-4 mb-6 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 text-sm font-medium">Error</p>
                  <p className="text-red-300 text-xs mt-1">{error}</p>
                </div>
              </div>
            )}

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

            <form onSubmit={handleSubmit} className="space-y-5">
              {loginMethod === 'email' ? (
                <>
                  {/* Email Input */}
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className={`w-full pl-12 pr-4 py-4 bg-black/20 border rounded-2xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                          formErrors.email 
                            ? 'border-red-400 focus:border-red-400' 
                            : 'border-white/10 focus:border-cyan-400'
                        }`}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-red-400 text-xs mt-2 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{formErrors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className={`w-full pl-12 pr-12 py-4 bg-black/20 border rounded-2xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                          formErrors.password 
                            ? 'border-red-400 focus:border-red-400' 
                            : 'border-white/10 focus:border-cyan-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-red-400 text-xs mt-2 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{formErrors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Confirm Password (Registration only) */}
                  {!isLogin && (
                    <div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          className={`w-full pl-12 pr-4 py-4 bg-black/20 border rounded-2xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                            formErrors.confirmPassword 
                              ? 'border-red-400 focus:border-red-400' 
                              : 'border-white/10 focus:border-cyan-400'
                          }`}
                        />
                      </div>
                      {formErrors.confirmPassword && (
                        <p className="text-red-400 text-xs mt-2 flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.confirmPassword}</span>
                        </p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Phone Input */}
                  <div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className={`w-full pl-12 pr-4 py-4 bg-black/20 border rounded-2xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                          formErrors.phone 
                            ? 'border-red-400 focus:border-red-400' 
                            : 'border-white/10 focus:border-cyan-400'
                        }`}
                        disabled={otpSent}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-red-400 text-xs mt-2 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* OTP Input */}
                  {otpSent && (
                    <div>
                      <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-blue-400" />
                          <span className="text-blue-400 text-sm font-medium">OTP Sent!</span>
                        </div>
                        <p className="text-blue-300 text-xs">
                          We've sent a verification code to {formData.phone}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          For demo purposes, use: <span className="text-cyan-400 font-bold">1234</span>
                        </p>
                      </div>

                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="otp"
                          value={formData.otp}
                          onChange={handleInputChange}
                          placeholder="Enter 4-digit OTP"
                          maxLength={4}
                          className={`w-full pl-12 pr-4 py-4 bg-black/20 border rounded-2xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 text-center text-2xl tracking-widest ${
                            formErrors.otp 
                              ? 'border-red-400 focus:border-red-400' 
                              : 'border-white/10 focus:border-cyan-400'
                          }`}
                        />
                      </div>
                      {formErrors.otp && (
                        <p className="text-red-400 text-xs mt-2 flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.otp}</span>
                        </p>
                      )}

                      {/* Resend OTP */}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-gray-400 text-xs">
                          Didn't receive the code?
                        </span>
                        {countdown > 0 ? (
                          <span className="text-orange-400 text-xs">
                            Resend in {countdown}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={resendOTP}
                            className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors flex items-center space-x-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Resend OTP</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
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
                  <span>No personal information required beyond contact</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <span>Anonymous travel connections with fellow nomads</span>
                </div>
              </div>
            </div>

            {/* Toggle Login/Register */}
            <div className="text-center mt-6">
              <button
                onClick={switchMode}
                className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-400 hover:bg-clip-text transition-all duration-300 text-sm"
              >
                {isLogin 
                  ? "Don't have an account? Create one now" 
                  : "Already have an account? Sign in instead"
                }
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center group hover:border-white/20 transition-all duration-300">
              <Users className="h-6 w-6 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-300">Find Travel Souls</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center group hover:border-white/20 transition-all duration-300">
              <Globe className="h-6 w-6 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-300">Global Network</span>
            </div>
          </div>

          {/* Demo Information */}
          <div className="mt-6 bg-orange-500/10 backdrop-blur-sm rounded-2xl p-4 border border-orange-400/30 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">Demo Mode</span>
            </div>
            <p className="text-orange-300 text-xs">
              This is a demo app. All data is stored locally in your browser.
            </p>
            {loginMethod === 'phone' && (
              <p className="text-orange-300 text-xs mt-1">
                Use OTP: <span className="font-bold">1234</span> for phone verification
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;