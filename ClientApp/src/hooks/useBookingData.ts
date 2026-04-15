// hooks/useBookingData.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import { API_CONFIG } from '../api.config';
import { BookingDataResponse } from '../types/booking';

export const useBookingData = () => {
  return useQuery({
    queryKey: ['booking-data'],
    queryFn: async (): Promise<BookingDataResponse> => {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.BOOKING_DATA);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache na 5 minut
  });
};