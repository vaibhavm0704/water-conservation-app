// AquaEstate Auth Context
// Manages authentication state across the app

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../config/config';
import type { User, UserRole } from '../features/auth/types/authTypes';
import * as authService from '../features/auth/services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = user !== null;
  const role = user?.role ?? null;

  // On mount, check AsyncStorage for existing session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [tokenStr, userStr] = await Promise.all([
          AsyncStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN),
          AsyncStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA),
        ]);

        if (tokenStr && userStr) {
          const restoredUser: User = JSON.parse(userStr);
          setUser(restoredUser);
        }
      } catch (error) {
        // If restore fails, user remains logged out
        console.warn('Failed to restore auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.loginUser(email, password);

      // Store token and user in AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, response.token),
        AsyncStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(response.user)),
      ]);

      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Clear stored session
      await Promise.all([
        AsyncStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA),
      ]);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await authService.sendOtp(email);
  }, []);

  const resetPasswordFn = useCallback(
    async (email: string, otp: string, newPassword: string) => {
      await authService.verifyOtp(email, otp);
      await authService.resetPassword(email, otp, newPassword);
    },
    []
  );

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    role,
    login,
    logout,
    forgotPassword,
    resetPassword: resetPasswordFn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access authentication state and methods
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
