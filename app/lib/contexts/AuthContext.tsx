"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

const API_BASE_URL = '/api'; // Using relative path for Next.js API routes

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkAuthStatus = useCallback(() => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('adminToken');
      if (storedToken) {
        // In a real app, you'd decode the token to check expiry and validity
        setToken(storedToken);
      } else {
        setToken(null);
      }
    } catch (e) {
      // console.error('Failed to check auth status', e);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        router.push('/geezadmin/registrations'); // Redirect to the main admin page on success
      } else {
        throw new Error(
          data.message || 'Login failed. Please check your credentials.'
        );
      }
    } catch (err: any) {
      setError(err.message);
      localStorage.removeItem('adminToken');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    router.push('/geezadmin/login');
  };

  const value = {
    isAuthenticated: !!token,
    token,
    isLoading,
    error,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
