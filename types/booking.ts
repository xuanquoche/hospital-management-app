export interface TimeSlot {
  id: string;
  dayOfWeek: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  examinationType: 'IN_PERSON' | 'ONLINE';
  maxPatients: number;
  availableDates: string[]; // yyyy-MM-dd
}

export interface Schedule {
  id: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  timeSlots: TimeSlot[];
}

export interface Doctor {
  id: string;
  userId: string;
  professionalTitle: string;
  yearsOfExperience: number;
  consultationFee: number;
  bio: string;
  image?: string;
  primarySpecialty: {
    id: string;
    name: string;
  };
  user: {
    fullName: string;
    address: string;
    avatar?: string;
  };
  schedules: Schedule[];
}

export interface CreateAppointmentPayload {
  doctorId: string;
  timeSlotId: string;
  appointmentDate: string; // yyyy-MM-dd
  symptoms: string;
  notes?: string;
  examinationType: 'IN_PERSON' | 'ONLINE';
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: any;
}
