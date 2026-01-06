export { PatientProfile } from './auth';

export interface HealthMetrics {
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string;
  bmi?: number;
  bmiStatus?: 'underweight' | 'normal' | 'overweight' | 'obese';
}

export interface Consultation {
  id: string;
  appointmentId?: string;
  diagnosis?: string;
  notes?: string;
  createdAt?: string;
  doctor?: {
    id: string;
    user?: {
      fullName?: string;
    };
    primarySpecialty?: {
      name?: string;
    };
  };
}

export interface ConsultationDetail extends Consultation {
  symptoms?: string;
  prescriptions?: Prescription[];
  documents?: MedicalDocument[];
}

export interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface MedicalDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}
