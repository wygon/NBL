import { useQuery } from '@tanstack/react-query';
import { API_CONFIG } from '../api.config';
import { apiClient } from '../api/apiClient';

export enum UserRole {
  User = 0,
  Artist = 1,
  Manager = 2,
}

// Pełny interfejs ArtistDto zgodny z Twoim rekordem w C#
export interface ArtistDto {
  id: number;
  name: string;
  instagramName: string;
  photoUrl: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
}

export const useArtists = () => {
  return useQuery({
    queryKey: ['artists-lookup'],
    queryFn: async (): Promise<ArtistDto[]> => {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.GET_ARTISTS);
      if (response.data && response.data.artists) {
          return response.data.artists;
      }
      
      return Array.isArray(response.data) ? response.data : [];
    },
    
    // staleTime: 1000 * 60 * 60 * 24, // Dane są "świeże" przez 24h
    staleTime: 60, // Dane są "świeże" przez 24h
    gcTime: 1000 * 60 * 60 * 24,    // Trzymaj w pamięci nawet po odmontowaniu
  });
};