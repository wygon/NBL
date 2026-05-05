import { Platform } from 'react-native';

// Adresy IP dla różnych środowisk
const DEV_URL_IOS = 'http://localhost:2115';
const DEV_URL_ANDROID = 'http://10.0.2.2:2115';
const PROD_URL = 'https://nailsbylilia.pl';

const getBaseUrl = () => {
  // Jeśli aplikacja jest w trybie produkcyjnym (zbudowana)
  // if (!__DEV__) {
  //   return PROD_URL;
  // }

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
    CONFIRM_APPOINTMENT : '/api/appointments/confirm',
    FINISH_APPOINTMENT : (id: number) => `/api/appointments/${id}/finish`,
    TAKE_APPOINTMENT : (id: number) => `/api/appointments/${id}/take`,
    GET_ARTISTS : '/api/users/artists',
    GET_NOTIFICATIONS : '/api/notifications',
    POST_AUTH_LOGIN : '/api/auth/login',
    GET_USERS : '/api/users',
    CHANGE_APPOINTMENT_ARTIST : '/api/appointments/artist',
    CANCEL_APPOINTMENT: '/api/appointments/cancel'
  },
  TIMEOUT: 5000,
};