import { useQuery } from '@tanstack/react-query';
import { API_CONFIG } from '../api.config';
import { apiClient } from '../api/apiClient';
import { NotificationDto } from '../types/notification';

interface GetNotificationsResponse {
  notifications: NotificationDto[];
}

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<NotificationDto[]> => {
      const response = await apiClient.get<GetNotificationsResponse>(API_CONFIG.ENDPOINTS.GET_NOTIFICATIONS);

      return response.data?.notifications || [];
    },
    refetchInterval: 60000,
  });
};