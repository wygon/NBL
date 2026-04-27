import { useQuery } from '@tanstack/react-query';
import { API_CONFIG } from '../api.config';
import { apiClient } from '../api/apiClient';
import { User } from '../contexts/AuthContext';

interface GetAllUsersResponse {
  users: User[];
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users-list'],
    queryFn: async (): Promise<User[]> => {
      const response = await apiClient.get<GetAllUsersResponse>(API_CONFIG.ENDPOINTS.GET_USERS);
      return response.data?.users || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};