import { useEffect, useState } from 'react';

export type UserRole = 'Customer' | 'Artist' | 'Manager';

export interface User {
  id: number;
  email: string;
  firstName: string;
  role: UserRole;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUser({
        id: 2,
        email: 'test@example.com',
        firstName: 'Anna',
        role: 'Manager', // ZMIEŃ NA 'Customer', ABY ZOBACZYĆ DRUGI WIDOK / Artist
      });
      setIsLoading(false);
    }, 500); // 500ms opóźnienia, żebyś widział spinner
  }, []);

  return {
    user,
    isLoading,
    // Dodatkowe funkcje, które przydadzą Ci się później:
    isAuthenticated: !!user,
    isArtist: user?.role === 'Artist',
  };
};