import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@/types';
import { findUserByPhone, upsertUser } from '@/src/utils/localJsonStorage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => Promise<void>;
  loginByPhone: (phone: string) => Promise<User | null>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  loginByPhone: async () => null,
  logout: async () => {},
  updateUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (userData: User) => {
    try {
      const persistedUser = await upsertUser(userData);
      await AsyncStorage.setItem('@user', JSON.stringify(persistedUser));
      setUser(persistedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error storing user:', error);
    }
  }, []);

  const loginByPhone = useCallback(async (phone: string) => {
    try {
      const existingUser = await findUserByPhone(phone);
      if (!existingUser) return null;
      await AsyncStorage.setItem('@user', JSON.stringify(existingUser));
      setUser(existingUser);
      setIsAuthenticated(true);
      return existingUser;
    } catch (error) {
      console.error('Error logging in by phone:', error);
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  }, []);

  const updateUser = useCallback(async (updatedData: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    await upsertUser(newUser);
    await AsyncStorage.setItem('@user', JSON.stringify(newUser));
    setUser(newUser);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      loginByPhone,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
