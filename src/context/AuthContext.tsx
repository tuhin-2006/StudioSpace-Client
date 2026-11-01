'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, photoURL?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore session without bouncing on reload (Requirement: Logged-in user must not be redirected to Login on reloading)
  const refreshUser = async () => {
    try {
      const data = await apiFetch('/auth/me');
      if (data.success && data.user) {
        setUser({
          id: data.user._id || data.user.id,
          name: data.user.name,
          email: data.user.email,
          photoURL: data.user.photoURL,
          role: data.user.role || 'creator',
        });
      } else {
        setUser(null);
      }
    } catch {
      // If unauthorized, clear cached user
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('studiospace_token');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.success && data.user) {
        setUser(data.user);
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('studiospace_token', data.token);
        }
        toast.success(data.message || 'Welcome back to StudioSpace!');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, photoURL?: string): Promise<boolean> => {
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, photoURL }),
      });

      if (data.success && data.user) {
        setUser(data.user);
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('studiospace_token', data.token);
        }
        toast.success(data.message || 'Registration successful!');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed.');
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Social login simulation / integration (Google login)
      const mockGoogleProfile = {
        name: 'Google Creator',
        email: 'creator.google@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      };

      const data = await apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify(mockGoogleProfile),
      });

      if (data.success && data.user) {
        setUser(data.user);
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('studiospace_token', data.token);
        }
        toast.success('Successfully logged in with Google!');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('studiospace_token');
      }
      toast.success('You have been logged out.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
