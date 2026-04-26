import { API_CONFIG } from '@/src/api.config'; // Ensure this path matches your structure
import { AppointmentDto } from '../types/appointment';
import { apiClient } from './apiClient';

var baseUrl = "http://localhost:2115/api/"


export const getBookingData = async () => {
  const response = await fetch(baseUrl + 'appointments/booking-data');
  if (!response.ok) throw new Error('Błąd pobierania danych');
  return response.json(); // Zwróci kategorie, usługi i dodatki w jednym strzale
};

export const updateAppointment = async (appointmentData: Partial<AppointmentDto>) => {
  if (!appointmentData.id) {
    throw new Error("Appointment ID is required for update.");
  }

  const response = await apiClient.put(
    `${API_CONFIG.ENDPOINTS.GET_APPOINTMENTS}/${appointmentData.id}/confirm`,
    appointmentData
  );

  return response.data;
};

export const confirmAppointment = async (id: number, data: Partial<AppointmentDto>) => {
  const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.CONFIRM_APPOINTMENT}/${id}`,
    data
  );

  return response.data;
};

export const finishAppointment = async (id: number) => {
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.FINISH_APPOINTMENT(id));
  return response.data;
};