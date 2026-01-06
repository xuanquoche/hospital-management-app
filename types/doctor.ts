import { Specialty } from './specialty';

export interface Doctor {
  id: string;
  userId: string;
  name?: string;
  professionalTitle?: string;
  bio?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  user?: {
    id: string;
    fullName?: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  specialty?: Specialty;
  primarySpecialty?: Specialty;
  subSpecialties?: Specialty[];
  education?: DoctorEducation[];
  awards?: DoctorAward[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorEducation {
  id: string;
  degree: string;
  institution: string;
  year?: number;
}

export interface DoctorAward {
  id: string;
  title: string;
  organization?: string;
  year?: number;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  startDate: string;
  endDate: string;
  timezone: string;
  isActive: boolean;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  scheduleId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  examinationType: 'IN_PERSON' | 'ONLINE';
  maxPatients: number;
}

export interface AvailableSlot {
  scheduleId: string;
  slotId: string;
  startTime: string;
  endTime: string;
  examinationType: 'IN_PERSON' | 'ONLINE';
  maxPatients: number;
  timezone: string;
  bookedCount?: number;
}

export type DayOfWeek =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export type ExaminationType = 'IN_PERSON' | 'ONLINE';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER';

