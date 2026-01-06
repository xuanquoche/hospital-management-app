import { api } from './api';

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface UpdateUserData {
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface PatientProfileData {
  id: string;
  userId: string;
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string;
  healthInsuranceNumber?: string;
  emergencyContact?: string;
  identityNumber?: string;
  chronicDisease?: string;
  user?: {
    id: string;
    fullName?: string;
    email: string;
    phone?: string;
    address?: string;
    avatar?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
  };
}

export const updateUserProfile = async (data: UpdateUserData): Promise<PatientProfileData> => {
  const response = await api.patch<ApiResponse<PatientProfileData>>('/patients/me', data);
  return response.data.data;
};

export const updatePatientFullProfile = async (
  data: UpdateUserData & {
    height?: number;
    weight?: number;
    bloodType?: string;
    allergies?: string;
    healthInsuranceNumber?: string;
    emergencyContact?: string;
    identityNumber?: string;
    chronicDisease?: string;
  }
): Promise<PatientProfileData> => {
  const response = await api.patch<ApiResponse<PatientProfileData>>('/patients/me', data);
  return response.data.data;
};
