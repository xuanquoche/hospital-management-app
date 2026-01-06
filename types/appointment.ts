import { Doctor, ExaminationType, PaymentMethod, TimeSlot } from './doctor';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  timeSlotId: string;
  appointmentDate: string;
  examinationType: ExaminationType;
  status: AppointmentStatus;
  symptoms?: string;
  notes?: string;
  diagnosis?: string;
  consultationFee?: number;
  medicineFee?: number;
  totalFee?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  cancelReason?: CancelReason;
  cancelNote?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  doctor?: Doctor;
  timeSlot?: TimeSlot;
  patient?: {
    id: string;
    user?: {
      fullName?: string;
      email?: string;
      phone?: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type CancelReason =
  | 'PATIENT_REQUEST'
  | 'DOCTOR_UNAVAILABLE'
  | 'EMERGENCY'
  | 'SCHEDULE_CONFLICT'
  | 'OTHER';

export interface CreateAppointmentData {
  doctorId: string;
  timeSlotId: string;
  appointmentDate: string;
  examinationType: ExaminationType;
  symptoms: string;
  notes?: string;
  paymentMethod: PaymentMethod;
}

export interface CancelAppointmentData {
  reason: CancelReason;
  notes?: string;
}

