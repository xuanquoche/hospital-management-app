import { AvailableSlot, DayOfWeek, Doctor, DoctorSchedule } from '@/types/doctor';
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

export interface DoctorQueryParams {
  page?: number;
  limit?: number;
  keyword?: string;
  specialtyId?: string;
}

interface DoctorDetailResponse extends Doctor {
  schedules?: DoctorSchedule[];
}

export const getDoctors = async (
  params?: DoctorQueryParams
): Promise<{ data: Doctor[]; total: number }> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.keyword) queryParams.append('keyword', params.keyword);
    if (params?.specialtyId) queryParams.append('specialtyId', params.specialtyId);

    const response = await api.get<PaginatedResponse<Doctor>>(
      `/doctors?${queryParams.toString()}`
    );
    return {
      data: response.data.data || [],
      total: response.data.meta?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return { data: [], total: 0 };
  }
};

export const getDoctorById = async (id: string): Promise<DoctorDetailResponse | null> => {
  try {
    const response = await api.get<ApiResponse<DoctorDetailResponse>>(`/doctors/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return null;
  }
};

export const getDoctorSchedules = async (
  doctorId: string
): Promise<DoctorSchedule[]> => {
  try {
    const doctor = await getDoctorById(doctorId);
    return doctor?.schedules || [];
  } catch (error) {
    console.error('Error fetching doctor schedules:', error);
    return [];
  }
};

const getDayOfWeekFromDate = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];
  return days[date.getDay()];
};

export const getAvailableSlots = async (
  doctorId: string,
  date: string
): Promise<AvailableSlot[]> => {
  try {
    const schedules = await getDoctorSchedules(doctorId);
    const targetDate = new Date(date);
    const dayOfWeek = getDayOfWeekFromDate(targetDate);

    const availableSlots: AvailableSlot[] = [];

    for (const schedule of schedules) {
      if (!schedule.isActive) continue;

      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);

      if (targetDate < startDate || targetDate > endDate) continue;

      const matchingSlots = schedule.timeSlots?.filter(
        (slot) => slot.dayOfWeek === dayOfWeek
      );

      if (matchingSlots) {
        for (const slot of matchingSlots) {
          availableSlots.push({
            scheduleId: schedule.id,
            slotId: slot.id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            examinationType: slot.examinationType,
            maxPatients: slot.maxPatients,
            timezone: schedule.timezone,
          });
        }
      }
    }

    return availableSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return [];
  }
};

export const formatDoctorName = (doctor: Doctor): string => {
  const title = doctor.professionalTitle || '';
  const name = doctor.user?.fullName || 'Unknown Doctor';
  return title ? `${title} ${name}` : name;
};

export const formatConsultationFee = (fee?: number): string => {
  if (!fee) return 'Contact for price';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(fee);
};
