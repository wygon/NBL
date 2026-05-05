import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_CONFIG } from '../api.config';
import { apiClient } from '../api/apiClient';

interface ChangeArtistPayload {
  appointmentId: number;
  newArtistId: number;
}

export const useChangeAppointmentArtist = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ChangeArtistPayload) => {
      const response = await apiClient.put(API_CONFIG.ENDPOINTS.CHANGE_APPOINTMENT_ARTIST, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Nie udało się przypisać artysty.';
      alert(errorMessage);
    }
  });
};