import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_CONFIG } from '../api.config';
import { apiClient } from '../api/apiClient';

export const useCancelAppointment = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: number) => {
      const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.CANCEL_APPOINTMENT}/${appointmentId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Nie udało się anulować wizyty.';
      alert(errorMessage);
    }
  });
};