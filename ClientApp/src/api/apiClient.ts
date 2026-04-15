import axios from 'axios';
import { API_CONFIG } from '../api.config';

// Tworzymy instancję Axiosa z Twoimi ustawieniami
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor dla błędów (opcjonalnie, ale bardzo pomocne w debugowaniu)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tutaj możesz centralnie logować błędy z bazy (np. 400 Bad Request)
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);