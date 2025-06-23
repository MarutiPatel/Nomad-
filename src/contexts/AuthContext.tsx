import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email?: string;
  phone?: string;
  displayName: string;
  isAnonymous: boolean;
  travelStyle: string;
  joinedAt: Date;
  avatar: string;
  bio: string;
  location: string;
  karma: number;
  footprints: number;
  connections: number;
  interests: string[];
  languages: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, otp: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  registerWithPhone: (phone: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced random name generation
const generateRandomName = () => {
  const adjectives = [
    'Wandering', 'Mystic', 'Cosmic', 'Digital', 'Nomadic', 'Free', 'Wild', 'Zen',
    'Brave', 'Swift', 'Silent', 'Golden', 'Shadow', 'Storm', 'Ocean', 'Forest',
    'Crystal', 'Phoenix', 'Lunar', 'Solar', 'Arctic', 'Desert', 'Mountain', 'River',
    'Thunder', 'Lightning', 'Wind', 'Fire', 'Earth', 'Sky', 'Star', 'Moon'
  ];
  
  const nouns = [
    'Explorer', 'Traveler', 'Soul', 'Spirit', 'Wanderer', 'Nomad', 'Dreamer', 'Seeker',
    'Hunter', 'Walker', 'Rider', 'Voyager', 'Pioneer', 'Navigator', 'Pathfinder', 'Roamer',
    'Drifter', 'Adventurer', 'Journeyer', 'Ranger', 'Scout', 'Warrior', 'Guardian', 'Sage',
    'Mystic', 'Wizard', 'Shaman', 'Oracle', 'Visionary', 'Prophet', 'Mentor', 'Guide'
  ];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999) + 1;
  return `${adj}${noun}${num}`;
};

const generateRandomAvatar = () => {
  const avatars = [
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100'
  ];
  return avatars[Math.floor(Math.random() * avatars.length)];
};

const generateRandomTravelStyle = () => {
  const styles = [
    'Explorer', 'Adventure Seeker', 'Nature Lover', 'Cultural Enthusiast',
    'Digital Nomad', 'Budget Traveler', 'Luxury Traveler', 'Solo Wanderer',
    'Group Traveler', 'Spiritual Seeker', 'Backpacker', 'Road Tripper'
  ];
  return styles[Math.floor(Math.random() * styles.length)];
};

const generateRandomBio = (travelStyle: string) => {
  const bios = [
    `${travelStyle} passionate about discovering hidden gems and connecting with fellow travelers.`,
    `Living the nomad life as a ${travelStyle}. Always ready for the next adventure!`,
    `${travelStyle} who believes in authentic experiences and meaningful connections.`,
    `Wandering the world as a ${travelStyle}, collecting memories and making friends.`,
    `${travelStyle} seeking authentic adventures and genuine connections with like-minded souls.`
  ];
  return bios[Math.floor(Math.random() * bios.length)];
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('nomad_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Convert joinedAt back to Date object
        parsedUser.joinedAt = new Date(parsedUser.joinedAt);
        
        // Ensure all required fields exist for backwards compatibility
        if (!parsedUser.interests) parsedUser.interests = [];
        if (!parsedUser.languages) parsedUser.languages = [];
        if (!parsedUser.bio) parsedUser.bio = '';
        
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('nomad_user');
      }
    }
    setLoading(false);
  }, []);

  const createUser = (identifier: string, isPhone: boolean = false) => {
    const travelStyle = generateRandomTravelStyle();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...(isPhone ? { phone: identifier } : { email: identifier }),
      displayName: generateRandomName(),
      isAnonymous: false,
      travelStyle,
      joinedAt: new Date(),
      avatar: generateRandomAvatar(),
      bio: generateRandomBio(travelStyle),
      location: 'Unknown',
      karma: Math.floor(Math.random() * 100) + 50,
      footprints: Math.floor(Math.random() * 20),
      connections: Math.floor(Math.random() * 10),
      interests: [],
      languages: []
    };
    return newUser;
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, any email/password combination works
      // In production, this would validate against a real backend
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }
      
      // Check if user exists in localStorage (simulate database check)
      const existingUsers = JSON.parse(localStorage.getItem('nomad_users') || '[]');
      let existingUser = existingUsers.find((u: any) => u.email === email);
      
      if (!existingUser) {
        // Create new user for demo (in production, this would fail)
        existingUser = createUser(email, false);
        existingUsers.push(existingUser);
        localStorage.setItem('nomad_users', JSON.stringify(existingUsers));
      }
      
      // Convert joinedAt back to Date object and ensure all fields exist
      existingUser.joinedAt = new Date(existingUser.joinedAt);
      if (!existingUser.interests) existingUser.interests = [];
      if (!existingUser.languages) existingUser.languages = [];
      if (!existingUser.bio) existingUser.bio = '';
      
      setUser(existingUser);
      localStorage.setItem('nomad_user', JSON.stringify(existingUser));
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithPhone = async (phone: string, otp: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otp !== '1234') { // Simple OTP simulation
        throw new Error('Invalid OTP. Please enter 1234 for demo.');
      }
      
      // Check if user exists
      const existingUsers = JSON.parse(localStorage.getItem('nomad_users') || '[]');
      let existingUser = existingUsers.find((u: any) => u.phone === phone);
      
      if (!existingUser) {
        // Create new user for demo
        existingUser = createUser(phone, true);
        existingUsers.push(existingUser);
        localStorage.setItem('nomad_users', JSON.stringify(existingUsers));
      }
      
      existingUser.joinedAt = new Date(existingUser.joinedAt);
      if (!existingUser.interests) existingUser.interests = [];
      if (!existingUser.languages) existingUser.languages = [];
      if (!existingUser.bio) existingUser.bio = '';
      
      setUser(existingUser);
      localStorage.setItem('nomad_user', JSON.stringify(existingUser));
    } catch (err: any) {
      setError(err.message || 'Phone login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('nomad_users') || '[]');
      const userExists = existingUsers.find((u: any) => u.email === email);
      
      if (userExists) {
        throw new Error('Account already exists with this email. Please login instead.');
      }
      
      const newUser = createUser(email, false);
      
      // Save to users list
      existingUsers.push(newUser);
      localStorage.setItem('nomad_users', JSON.stringify(existingUsers));
      
      setUser(newUser);
      localStorage.setItem('nomad_user', JSON.stringify(newUser));
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerWithPhone = async (phone: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!phone) {
        throw new Error('Please enter a valid phone number');
      }
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('nomad_users') || '[]');
      const userExists = existingUsers.find((u: any) => u.phone === phone);
      
      if (userExists) {
        throw new Error('Account already exists with this phone number. Please login instead.');
      }
      
      const newUser = createUser(phone, true);
      
      // Save to users list
      existingUsers.push(newUser);
      localStorage.setItem('nomad_users', JSON.stringify(existingUsers));
      
      setUser(newUser);
      localStorage.setItem('nomad_user', JSON.stringify(newUser));
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('nomad_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('nomad_user', JSON.stringify(updatedUser));
      
      // Update in users list as well
      const existingUsers = JSON.parse(localStorage.getItem('nomad_users') || '[]');
      const userIndex = existingUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        existingUsers[userIndex] = updatedUser;
        localStorage.setItem('nomad_users', JSON.stringify(existingUsers));
      }
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      loginWithPhone,
      register,
      registerWithPhone,
      logout,
      updateProfile,
      clearError
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