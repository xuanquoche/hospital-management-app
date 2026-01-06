import { Doctor } from '@/types/doctor';
import { Specialty } from '@/types/specialty';
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

export const getSpecialties = async (): Promise<Specialty[]> => {
  try {
    const response = await api.get<PaginatedResponse<Specialty>>('/specialties?limit=100');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching specialties:', error);
    return [];
  }
};

export const getSpecialtyById = async (id: string): Promise<Specialty | null> => {
  try {
    const response = await api.get<ApiResponse<Specialty>>(`/specialties/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching specialty:', error);
    return null;
  }
};

export const getDoctorsBySpecialty = async (
  specialtyId: string,
  params?: { page?: number; limit?: number; keyword?: string }
): Promise<{ data: Doctor[]; total: number }> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.keyword) queryParams.append('keyword', params.keyword);

    const response = await api.get<PaginatedResponse<Doctor>>(
      `/specialties/${specialtyId}/doctors?${queryParams.toString()}`
    );
    return {
      data: response.data.data || [],
      total: response.data.meta?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching doctors by specialty:', error);
    return { data: [], total: 0 };
  }
};

