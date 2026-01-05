import { BookingResponse, CreateAppointmentPayload, Doctor } from '@/types/booking';
import { api } from './api';

export const getDoctors = async () => {
  const response = await api.get<{ data: Doctor[] }>('/doctors');
  return response.data.data;
};

export const getDoctorDetail = async (id: string | number) => {
  const response = await api.get<{ data: Doctor }>(`/doctors/${id}`);
  return response.data.data;
};

export const createAppointment = async (payload: CreateAppointmentPayload) => {
  const response = await api.post<BookingResponse>('/appointments', payload);
  return response.data;
};
