import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email?: string;
  phone?: string;
  displayName: string;
  isAnonymous: boolean;
  travelStyle: string;
  joinedAt: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, otp: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  registerWithPhone: (phone: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateRandomName = () => {
  const adjectives = ['Wandering', 'Mystic', 'Cosmic', 'Digital', 'Nomadic', 'Free', 'Wild', 'Zen'];
  const nouns = ['Explorer', 'Traveler', 'Soul', 'Spirit', 'Wanderer', 'Nomad', 'Dreamer', 'Seeker'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999) + 1;
  return `${adj}${noun}${num}`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('nomad_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      displayName: generateRandomName(),
      isAnonymous: false,
      travelStyle: 'Explorer',
      joinedAt: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('nomad_user', JSON.stringify(newUser));
  };

  const loginWithPhone = async (phone: string, otp: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      phone,
      displayName: generateRandomName(),
      isAnonymous: false,
      travelStyle: 'Explorer',
      joinedAt: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('nomad_user', JSON.stringify(newUser));
  };

  const register = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      displayName: generateRandomName(),
      isAnonymous: false,
      travelStyle: 'Explorer',
      joinedAt: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('nomad_user', JSON.stringify(newUser));
  };

  const registerWithPhone = async (phone: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      phone,
      displayName: generateRandomName(),
      isAnonymous: false,
      travelStyle: 'Explorer',
      joinedAt: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('nomad_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nomad_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('nomad_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginWithPhone,
      register,
      registerWithPhone,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}