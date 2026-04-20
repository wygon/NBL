import { Platform } from 'react-native';

// Adresy IP dla różnych środowisk
const DEV_URL_IOS = 'http://localhost:2115';
const DEV_URL_ANDROID = 'http://10.0.2.2:2115'; // Specjalny adres emulatora Androida
const PROD_URL = 'https://api.twojadomena.pl'; // Tu wpiszesz adres serwera produkcyjnego

const getBaseUrl = () => {
  // Jeśli aplikacja jest w trybie produkcyjnym (zbudowana)
  if (!__DEV__) {
    return PROD_URL;
  }

  // Jeśli jesteśmy w trybie deweloperskim, rozróżniamy platformy
  return Platform.OS === 'android' ? DEV_URL_ANDROID : DEV_URL_IOS;
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    BOOKING_DATA: '/api/appointments/booking-data',
    CREATE_APPOINTMENT: '/api/appointments',
    REQUEST_APPOINTMENT : '/api/appointments',
    GET_APPOINTMENTS : '/api/appointments',
  },
  TIMEOUT: 5000,
};