import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_CONFIG } from '../api.config';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwt_token');
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    
    if (token) {
      console.log(`✅ [${method}] Wysyłam zapytanie z tokenem:`, config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log(`❌ [${method}] Wysyłam zapytanie BEZ tokena:`, config.url);
    }

    // 1. LOGOWANIE DANYCH (PAYLOAD dla POST/PUT)
    if (config.data) {
      console.log(`📦 Payload [${method}] ${config.url}:`, JSON.stringify(config.data, null, 2));
    }

    // 2. LOGOWANIE PARAMETRÓW URL (Dla GET, np. zapytania z filtrami)
    if (config.params && Object.keys(config.params).length > 0) {
      console.log(`🔍 Query Params [${method}] ${config.url}:`, JSON.stringify(config.params, null, 2));
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
       console.log('Token wygasł lub jest nieważny. Użytkownik nieautoryzowany.');
       AsyncStorage.removeItem('jwt_token');
    }

    return Promise.reject(error);
  }
);