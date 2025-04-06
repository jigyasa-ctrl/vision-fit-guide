
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  trialEnds: Date;
  isSubscribed: boolean;
  profile?: UserProfile | null;
}

export interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  height: number; // in cm
  weight: number; // in kg
  bodyFatPercentage?: number;
  fitnessGoal: 'fat loss' | 'maintenance' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';
  stepsPerDay: number;
  workoutIntensity: 'low' | 'medium' | 'high';
  dailyCalories?: number;
  dailyProtein?: number;
  dailyCarbs?: number;
  dailyFat?: number;
  meals?: {
    breakfast: { calories: number, protein: number, carbs: number, fat: number };
    lunch: { calories: number, protein: number, carbs: number, fat: number };
    dinner: { calories: number, protein: number, carbs: number, fat: number };
    snack: { calories: number, protein: number, carbs: number, fat: number };
  };
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  canAccessPremiumFeatures: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date('2023-01-01'),
    trialEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    isSubscribed: false,
    profile: null
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user has access to premium features (in trial period or subscribed)
  const canAccessPremiumFeatures = currentUser ? 
    (currentUser.isSubscribed || new Date() < new Date(currentUser.trialEnds)) : 
    false;

  useEffect(() => {
    // Check if there's a stored user in localStorage
    const storedUser = localStorage.getItem('fitvision_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Convert date strings back to Date objects
        parsedUser.createdAt = new Date(parsedUser.createdAt);
        parsedUser.trialEnds = new Date(parsedUser.trialEnds);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save user data whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fitvision_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('fitvision_user');
    }
  }, [currentUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in a real app, this would call your auth API
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      setCurrentUser(user);
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Mock registration - in a real app, this would call your auth API
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date(),
        trialEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        isSubscribed: false,
        profile: null
      };
      
      mockUsers.push(newUser);
      setCurrentUser(newUser);
      toast.success('Registration successful');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setCurrentUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    if (!currentUser) {
      toast.error('You must be logged in to update your profile');
      throw new Error('Not authenticated');
    }
    
    try {
      // In a real app, we'd save this to the database
      const updatedUser = { 
        ...currentUser, 
        profile 
      };
      
      setCurrentUser(updatedUser);
      
      // Update the mock user array as well
      const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const value = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    canAccessPremiumFeatures,
    login,
    register,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
