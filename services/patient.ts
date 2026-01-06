import { Appointment, AppointmentStatus } from '@/types/appointment';
import { PatientProfile } from '@/types/auth';
import { Consultation, HealthMetrics } from '@/types/patient';
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
    totalItems: number;
    page: number;
    limit: number;
  };
}

export interface UpdatePatientData {
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string;
  healthInsuranceNumber?: string;
  emergencyContact?: string;
  identityNumber?: string;
  chronicDisease?: string;
}

export interface MyAppointmentQueryParams {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
  doctorId?: string;
}

export const getPatientProfile = async (): Promise<PatientProfile | null> => {
  try {
    const response = await api.get<{
      success: boolean;
      data: { user: unknown; profile: PatientProfile | null };
    }>('/users/me');
    return response.data.data.profile;
  } catch {
    return null;
  }
};

export const updatePatientProfile = async (
  data: UpdatePatientData
): Promise<PatientProfile> => {
  const response = await api.patch<ApiResponse<PatientProfile>>(
    '/patients/me',
    data
  );
  return response.data.data;
};

export const getMyAppointments = async (
  params?: MyAppointmentQueryParams
): Promise<{ data: Appointment[]; total: number }> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.doctorId) queryParams.append('doctorId', params.doctorId);

    const queryString = queryParams.toString();
    const url = queryString
      ? `/patients/me/appointments?${queryString}`
      : '/patients/me/appointments';

    const response = await api.get<PaginatedResponse<Appointment>>(url);
    return {
      data: response.data.data || [],
      total: response.data.meta?.totalItems || 0,
    };
  } catch (error) {
    console.error('Error fetching my appointments:', error);
    return { data: [], total: 0 };
  }
};

export const getHealthMetrics = async (): Promise<HealthMetrics> => {
  const profile = await getPatientProfile();
  if (!profile) {
    return {};
  }

  const height = profile.height;
  const weight = profile.weight;
  let bmi: number | undefined;
  let bmiStatus: HealthMetrics['bmiStatus'];

  if (height && weight) {
    const heightInMeters = height / 100;
    bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));

    if (bmi < 18.5) {
      bmiStatus = 'underweight';
    } else if (bmi < 25) {
      bmiStatus = 'normal';
    } else if (bmi < 30) {
      bmiStatus = 'overweight';
    } else {
      bmiStatus = 'obese';
    }
  }

  return {
    height: profile.height,
    weight: profile.weight,
    bloodType: profile.bloodType,
    allergies: profile.allergies,
    bmi,
    bmiStatus,
  };
};

export const getRecentConsultations = async (
  limit: number = 3
): Promise<Consultation[]> => {
  try {
    const response = await api.get<PaginatedResponse<Consultation>>(
      `/patients/me/consultations?limit=${limit}`
    );
    return response.data.data || [];
  } catch {
    return [];
  }
};

export const getConsultationDetail = async (
  id: string
): Promise<Consultation | null> => {
  try {
    const response = await api.get<ApiResponse<Consultation>>(
      `/patients/me/consultations/${id}`
    );
    return response.data.data;
  } catch {
    return null;
  }
};
