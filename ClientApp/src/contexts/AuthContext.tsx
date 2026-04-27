import React, { createContext, ReactNode, useContext, useState } from 'react';
import { API_CONFIG } from '../api.config';
import { apiClient } from '../api/apiClient';

export enum UserRole {
  User = 0,
  Artist = 1,
  Manager = 2,
}

export interface User {
  id: number;
  name: string;
  instagramName: string;
  photoUrl: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginAs: (username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginAs = async (username: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<User>(API_CONFIG.ENDPOINTS.POST_AUTH_LOGIN, { username });
      setUser(response.data);
    } catch (error) {
      console.error("Błąd logowania:", error);
      
      console.log(`[DEV] Logowanie awaryjne mockiem jako: ${username}`);
      setUser({
        id: username === 'Wygon' ? 1 : 2,
        name: username,
        email: `${username.toLowerCase()}@test.com`,
        instagramName: `${username.toLowerCase()}_`,
        photoUrl: '',
        phoneNumber: '123456789',
        role: username === 'Wygon' ? UserRole.Manager : UserRole.Artist
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth musi być użyty wewnątrz AuthProvider');
  
  return {
    ...context,
    isAuthenticated: !!context.user,
    isArtist: context.user?.role === UserRole.Artist || context.user?.role === 'Artist' as any ,
    isManager: context.user?.role === UserRole.Manager || context.user?.role === 'Manager' as any,
  };
};