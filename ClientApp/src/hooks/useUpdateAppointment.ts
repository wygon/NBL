import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAppointment } from '../api/appointments';
import { AppointmentDto } from '../types/appointment';

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AppointmentDto>) => updateAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      console.error("Failed to update appointment:", error);
    }
  });
};