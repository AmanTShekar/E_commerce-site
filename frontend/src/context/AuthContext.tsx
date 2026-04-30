import React, { createContext, useContext, useState, useEffect } from 'react';

import { API_BASE_URL } from '../config/constants';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on load if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('nexmart_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/user/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            id: data.user.id,
            name: data.user.fullName,
            email: data.user.email,
            role: data.user.role as 'buyer' | 'seller' | 'admin'
          });
        } else if (response.status === 401 || response.status === 403) {
          // Token definitively invalid or expired
          localStorage.removeItem('nexmart_token');
          setUser(null);
        } else {
          // Possibly a server error, keep user null but don't clear token
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user session", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('nexmart_token', data.token);
      setUser({
        id: data.user.id,
        name: data.user.fullName,
        email: data.user.email,
        role: data.user.role as 'buyer' | 'seller' | 'admin'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, confirmPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.error;
        if (data.error?.name === 'ZodError') {
           const parsed = JSON.parse(data.error.message);
           errorMessage = parsed.map((e: any) => e.message).join(', ');
        }
        throw new Error(errorMessage || 'Registration failed');
      }

      // Automatically login after successful registration
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexmart_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
