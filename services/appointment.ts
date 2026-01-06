import { api } from './api';

export interface Appointment {
  id: string;
  appointmentDate: string;
  status: string;
  doctor?: {
    id: string;
    professionalTitle?: string;
    user?: {
      fullName?: string;
    };
    primarySpecialty?: {
      name?: string;
    };
  };
  timeSlot?: {
    startTime?: string;
    endTime?: string;
  };
  examinationType?: string;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await api.get<ApiResponse<Appointment[]>>('/appointments');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  try {
    const response = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return null;
  }
};

export const cancelAppointment = async (id: string, reason?: string): Promise<void> => {
  await api.patch(`/appointments/${id}/cancel`, { reason });
};

export const getDoctorName = (appointment: Appointment): string => {
  const title = appointment.doctor?.professionalTitle || '';
  const name = appointment.doctor?.user?.fullName || 'Unknown Doctor';
  return title ? `${title} ${name}` : name;
};

export const getSpecialtyName = (appointment: Appointment): string => {
  return appointment.doctor?.primarySpecialty?.name || 'General';
};

export const getTimeSlot = (appointment: Appointment): string => {
  const start = appointment.timeSlot?.startTime || '00:00';
  const end = appointment.timeSlot?.endTime || '00:00';
  return `${start} - ${end}`;
};
