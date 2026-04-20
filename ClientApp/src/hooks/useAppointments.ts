import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import { API_CONFIG } from '../api.config';
import { GetAppointmentsQuery, GetAppointmentsResponse } from '../types/appointment';

export const useAppointments = (filters: GetAppointmentsQuery) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: async (): Promise<GetAppointmentsResponse> => {
      // Usuwamy null/undefined aby nie śmiecić w URL
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null)
      );

      const response = await apiClient.get(API_CONFIG.ENDPOINTS.GET_APPOINTMENTS, {
        params: cleanFilters,
      });
      return response.data;
    },
  });
};