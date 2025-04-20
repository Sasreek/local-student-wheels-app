
import { useState, useEffect } from 'react';
import { currentUser } from './mockData';
import { User } from '../types/models';
import { toast } from '@/components/ui/sonner';

// Mock authentication service
interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

// Simple mock function to validate email
const isValidCollegeEmail = (email: string): boolean => {
  // Check if email ends with .edu
  return email.endsWith('.edu');
};

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is stored in localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('goLocalUser');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (!isValidCollegeEmail(email)) {
        throw new Error('Please use a valid college email (.edu)');
      }
      
      // In a real app, we would validate credentials against a backend
      // For demo purposes, we'll just use our mock current user
      const userData = currentUser;
      
      // Store user in state and localStorage
      setUser(userData);
      localStorage.setItem('goLocalUser', JSON.stringify(userData));
      
      toast.success('Successfully logged in!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!email || !name || !password) {
        throw new Error('All fields are required');
      }
      
      if (!isValidCollegeEmail(email)) {
        throw new Error('Please use a valid college email (.edu)');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // In a real app, we would create a new user in the backend
      // For demo purposes, we'll just use our mock current user
      const userData = { ...currentUser, email, name };
      
      // Store user in state and localStorage
      setUser(userData);
      localStorage.setItem('goLocalUser', JSON.stringify(userData));
      
      toast.success('Account created successfully!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Clear user from state and localStorage
    setUser(null);
    localStorage.removeItem('goLocalUser');
    toast.info('You have been logged out');
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
  };
};
