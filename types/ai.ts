export interface PatientInfo {
  age?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  medicalHistory?: string[];
}

export interface AISymptomInput {
  symptoms: string;
  patientInfo?: PatientInfo;
  preferredDate?: string;
  examinationType?: 'IN_PERSON' | 'ONLINE';
}

export interface AIAvailableSlot {
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  remainingSlots: number;
  examinationType: string;
}

export interface AIDoctorRecommendation {
  rank: number;
  doctor: {
    id: string;
    fullName: string;
    specialty: string;
    subSpecialty: string | null;
    professionalTitle: string;
    yearsOfExperience: number;
    consultationFee: number;
    avatar: string | null;
    bio: string;
  };
  matchScore: number;
  matchReasons: string[];
  availableSlots: AIAvailableSlot[];
}

export interface AIAnalysis {
  possibleConditions: string[];
  recommendedSpecialties: string[];
  urgencyLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EMERGENCY';
}

export type AIResponseType = 'SUGGESTION' | 'NEEDS_MORE_INFO' | 'NO_DATA';

export interface AIRecommendationResponse {
  success: boolean;
  responseType: AIResponseType;
  followUpQuestion?: string | null;
  suggestedQuestions?: string[];
  data?: {
    analysis: AIAnalysis;
    recommendations: AIDoctorRecommendation[];
    disclaimer: string;
  };
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIChatInput {
  message: string;
  conversationHistory?: AIChatMessage[];
}

export interface AIChatResponse {
  success: boolean;
  data: {
    response: string;
    requiresMoreInfo: boolean;
    suggestedQuestions: string[] | null;
    readyToRecommend: boolean;
  };
}

