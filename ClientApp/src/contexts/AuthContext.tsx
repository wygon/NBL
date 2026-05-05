import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
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

// 1. Dodajemy interfejs dla nowej odpowiedzi z backendu
export interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginAs: (username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const token = await AsyncStorage.getItem('jwt_token');
      // Tutaj w przyszłości możesz dodać zapytanie np. GET /api/users/me żeby pobrać usera na podstawie tokena
    };
    loadSession();
  }, []);

  // const loginAs = async (username: string) => {
  //   setIsLoading(true);
  //   try {
  //     // 2. Oczekujemy AuthResponse, a nie tylko User
  //     const response = await apiClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.POST_AUTH_LOGIN, { username });
      
  //     const { user, token } = response.data;

  //     // 3. Zapisujemy TOKEN w pamięci urządzenia!
  //     await AsyncStorage.setItem('jwt_token', token);
      
  //     // 4. Ustawiamy usera w kontekście
  //     setUser(user);
      
  //   } catch (error) {
  //     console.error("Błąd logowania:", error);
  //     // Jeśli chcesz zostawić mockowanie w przypadku błędu API na czas devu:
  //     setUser({
  //       id: username === 'Wygon' ? 3 : 2,
  //       name: username,
  //       email: `${username.toLowerCase()}@test.com`,
  //       instagramName: `${username.toLowerCase()}_`,
  //       photoUrl: '',
  //       phoneNumber: '123456789',
  //       role: username === 'Wygon' ? UserRole.Manager : UserRole.Artist
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

const loginAs = async (username: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>('/api/Auth/login', { 
        username 
      });

      const { user, token } = response.data;

      await AsyncStorage.setItem('jwt_token', token);
      
      setUser(user);
      
      console.log(`[DEV] Pomyślnie zalogowano jako: ${username}`);
    } catch (error) {
      console.error("Błąd logowania:", error);
      alert("Nie udało się zalogować!");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('jwt_token');
    setUser(null);
  };

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
    isArtist: context.user?.role === UserRole.Artist || context.user?.role === 'Artist' as any,
    isManager: context.user?.role === UserRole.Manager || context.user?.role === 'Manager' as any,
  };
};