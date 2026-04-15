// hooks/useCreateAppointment.ts
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import { API_CONFIG } from '../api.config';

export const useCreateAppointment = (onSuccessCallback: (data: any) => void) => {
  return useMutation({
    mutationFn: async (command: any) => {
      // Wykorzystujemy ścieżkę z API_CONFIG
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.CREATE_APPOINTMENT, command);
      
      // Axios przechowuje body odpowiedzi w polu .data
      return response.data;
    },
    onSuccess: (data) => {
      onSuccessCallback(data);
    },
    onError: (error: any) => {
      // Wyświetlamy błąd z backendu (np. "Artist not available")
      const errorMessage = error.response?.data?.message || 'Coś poszło nie tak...';
      alert(errorMessage);
    }
  });
};