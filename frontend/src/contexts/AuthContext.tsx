import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContextType, User } from '../types';
import * as api from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.login(email, password);
    const { access_token, user: responseUser } = response.data;

    localStorage.setItem('token', access_token);
    setToken(access_token);

    // Prefer user object from response; fall back to decoding the JWT payload
    if (responseUser) {
      // Backend uses "username" field — normalize to "name" for the frontend
      const normalized: User = {
        id: responseUser.id ?? '',
        name: responseUser.username ?? responseUser.name ?? '',
        email: responseUser.email ?? email,
      };
      localStorage.setItem('user', JSON.stringify(normalized));
      setUser(normalized);
    } else {
      try {
        const payload = JSON.parse(atob(access_token.split('.')[1]));
        const decoded: User = {
          id: payload.sub ?? payload.id ?? '',
          name: payload.username ?? payload.name ?? '',
          email: payload.email ?? email,
        };
        localStorage.setItem('user', JSON.stringify(decoded));
        setUser(decoded);
      } catch {
        // JWT decode failed — store minimal user so name never falls back to "User"
        const fallback: User = { id: '', name: '', email };
        localStorage.setItem('user', JSON.stringify(fallback));
        setUser(fallback);
      }
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await api.register(name, email, password);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};