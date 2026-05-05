import { useQuery } from '@tanstack/react-query';
import { API_CONFIG } from '../api.config';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { NotificationDto } from '../types/notification';

interface GetNotificationsResponse {
  notifications: NotificationDto[];
}

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<NotificationDto[]> => {
      const response = await apiClient.get<GetNotificationsResponse>(API_CONFIG.ENDPOINTS.GET_NOTIFICATIONS);

      return response.data?.notifications || [];
    },
    
    enabled: isAuthenticated,
    refetchInterval: 60000,
  });
};