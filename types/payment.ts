import { Doctor, ExaminationType, PaymentMethod, TimeSlot } from './doctor';
import { AppointmentStatus } from './appointment';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface PaymentAppointment {
  id: string;
  appointmentDate: string;
  consultationFee: number;
  status: AppointmentStatus;
  examinationType: ExaminationType;
  symptoms?: string;
  notes?: string;
  diagnosis?: string;
  createdAt?: string;
  completedAt?: string;
  timeSlot?: Pick<TimeSlot, 'startTime' | 'endTime' | 'dayOfWeek'>;
  doctor?: {
    id: string;
    professionalTitle?: string;
    user?: {
      fullName?: string;
      avatar?: string;
      phone?: string;
    };
    primarySpecialty?: {
      name: string;
    };
  };
}

export interface Payment {
  id: string;
  paymentCode: string;
  appointmentId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  dataHash?: string;
  blockchainTxHash?: string;
  createdAt: string;
  updatedAt: string;
  appointment?: PaymentAppointment;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaymentsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Payment[];
  meta: PaginationMeta;
  timestamp: string;
}

export interface PaymentsResponse {
  data: Payment[];
  total: number;
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
}

export const PaymentStatusConfig: Record<
  PaymentStatus,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  PENDING: {
    label: 'Pending',
    color: '#D97706',
    bgColor: '#FEF3C7',
    icon: 'time-outline',
  },
  SUCCESS: {
    label: 'Success',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    icon: 'checkmark-circle-outline',
  },
  FAILED: {
    label: 'Failed',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    icon: 'close-circle-outline',
  },
  REFUNDED: {
    label: 'Refunded',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    icon: 'refresh-outline',
  },
};

