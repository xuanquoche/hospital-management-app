import {
  Appointment,
  AppointmentStatus,
  CancelAppointmentData,
  CreateAppointmentData,
} from '@/types/appointment';
import { api } from './api';

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

interface PaginatedResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface AppointmentQueryParams {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
  doctorId?: string;
}

export const getAppointments = async (
  params?: AppointmentQueryParams
): Promise<{ data: Appointment[]; total: number }> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.doctorId) queryParams.append('doctorId', params.doctorId);

    const response = await api.get<PaginatedResponse<Appointment>>(
      `/appointments?${queryParams.toString()}`
    );
    return {
      data: response.data.data || [],
      total: response.data.meta?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return { data: [], total: 0 };
  }
};

export const getAppointmentById = async (
  id: string
): Promise<Appointment | null> => {
  try {
    const response = await api.get<ApiResponse<Appointment>>(
      `/appointments/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return null;
  }
};

export const createAppointment = async (
  data: CreateAppointmentData
): Promise<Appointment> => {
  const response = await api.post<ApiResponse<Appointment>>(
    '/appointments',
    data
  );
  return response.data.data;
};

export const cancelAppointment = async (
  id: string,
  data: CancelAppointmentData
): Promise<Appointment> => {
  const response = await api.post<ApiResponse<Appointment>>(
    `/appointments/${id}/cancel`,
    data
  );
  return response.data.data;
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

export const getStatusConfig = (status?: AppointmentStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return {
        label: 'Confirmed',
        color: '#22C55E',
        bgColor: '#DCFCE7',
      };
    case 'PENDING':
      return {
        label: 'Pending',
        color: '#F97316',
        bgColor: '#FFEDD5',
      };
    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        color: '#3B82F6',
        bgColor: '#DBEAFE',
      };
    case 'COMPLETED':
      return {
        label: 'Completed',
        color: '#6B7280',
        bgColor: '#F3F4F6',
      };
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        color: '#EF4444',
        bgColor: '#FEE2E2',
      };
    case 'NO_SHOW':
      return {
        label: 'No Show',
        color: '#8B5CF6',
        bgColor: '#EDE9FE',
      };
    default:
      return {
        label: status || 'Unknown',
        color: '#6B7280',
        bgColor: '#F3F4F6',
      };
  }
};
