import { recommendDoctor } from '@/services/ai';
import { createAppointment } from '@/services/appointment';
import { AIAnalysis, AIDoctorRecommendation, AISymptomInput } from '@/types/ai';
import { CreateAppointmentData } from '@/types/appointment';
import { AvailableSlot, Doctor, ExaminationType, PaymentMethod } from '@/types/doctor';
import { create } from 'zustand';

export type BookingStep = 'symptoms' | 'doctor' | 'schedule' | 'info' | 'confirm';
export type BookingMode = 'ai' | 'manual';

interface BookingState {
  mode: BookingMode;
  currentStep: BookingStep;
  selectedDoctor: Doctor | null;
  selectedDate: string | null;
  selectedSlot: AvailableSlot | null;
  examinationType: ExaminationType;
  symptoms: string;
  notes: string;
  paymentMethod: PaymentMethod;
  isSubmitting: boolean;
  error: string | null;

  aiRecommendations: AIDoctorRecommendation[];
  aiAnalysis: AIAnalysis | null;
  aiDisclaimer: string | null;
  isLoadingAI: boolean;
  aiFollowUpQuestion: string | null;
  aiSuggestedQuestions: string[];

  setMode: (mode: BookingMode) => void;
  setStep: (step: BookingStep) => void;
  setDoctor: (doctor: Doctor) => void;
  setDoctorFromAI: (recommendation: AIDoctorRecommendation) => void;
  setDate: (date: string) => void;
  setSlot: (slot: AvailableSlot) => void;
  setExaminationType: (type: ExaminationType) => void;
  setSymptoms: (symptoms: string) => void;
  setNotes: (notes: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  fetchAIRecommendations: (input?: AISymptomInput) => Promise<boolean>;
  submitBooking: () => Promise<void>;
  reset: () => void;
  canProceed: () => boolean;
}

const initialState = {
  mode: 'ai' as BookingMode,
  currentStep: 'symptoms' as BookingStep,
  selectedDoctor: null,
  selectedDate: null,
  selectedSlot: null,
  examinationType: 'IN_PERSON' as ExaminationType,
  symptoms: '',
  notes: '',
  paymentMethod: 'BANK_TRANSFER' as PaymentMethod,
  isSubmitting: false,
  error: null,

  aiRecommendations: [],
  aiAnalysis: null,
  aiDisclaimer: null,
  isLoadingAI: false,
  aiFollowUpQuestion: null,
  aiSuggestedQuestions: [],
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  setMode: (mode) => {
    const newStep = mode === 'ai' ? 'symptoms' : 'doctor';
    set({
      mode,
      currentStep: newStep,
      aiRecommendations: [],
      aiAnalysis: null,
      aiFollowUpQuestion: null,
      aiSuggestedQuestions: [],
    });
  },

  setStep: (step) => set({ currentStep: step }),

  setDoctor: (doctor) =>
    set({
      selectedDoctor: doctor,
      selectedDate: null,
      selectedSlot: null,
    }),

  setDoctorFromAI: (recommendation) => {
    const doctor: Doctor = {
      id: recommendation.doctor.id,
      userId: '',
      professionalTitle: recommendation.doctor.professionalTitle,
      bio: recommendation.doctor.bio,
      yearsOfExperience: recommendation.doctor.yearsOfExperience,
      consultationFee: recommendation.doctor.consultationFee,
      status: 'ACTIVE',
      user: {
        id: '',
        fullName: recommendation.doctor.fullName,
        email: '',
        avatar: recommendation.doctor.avatar || undefined,
      },
      primarySpecialty: {
        id: '',
        name: recommendation.doctor.specialty,
        isActive: true,
      },
    };

    set({
      selectedDoctor: doctor,
      selectedDate: null,
      selectedSlot: null,
    });
  },

  setDate: (date) =>
    set({
      selectedDate: date,
      selectedSlot: null,
    }),

  setSlot: (slot) => set({ selectedSlot: slot }),

  setExaminationType: (type) => set({ examinationType: type }),

  setSymptoms: (symptoms) => set({ symptoms }),

  setNotes: (notes) => set({ notes }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  fetchAIRecommendations: async (input) => {
    const state = get();
    set({ isLoadingAI: true, error: null, aiFollowUpQuestion: null });

    try {
      const response = await recommendDoctor(
        input || {
          symptoms: state.symptoms,
          examinationType: state.examinationType,
        }
      );

      console.log('📋 Store received response:', {
        responseType: response.responseType,
        hasData: !!response.data,
        recommendationsCount: response.data?.recommendations?.length || 0,
      });

      if (response.responseType === 'NEEDS_MORE_INFO') {
        console.log('📋 AI needs more info:', response.followUpQuestion);
        set({
          aiFollowUpQuestion: response.followUpQuestion || null,
          aiSuggestedQuestions: response.suggestedQuestions || [],
          isLoadingAI: false,
        });
        return false;
      }

      if (response.responseType === 'NO_DATA' || !response.data) {
        console.log('📋 No data from AI');
        set({
          error: 'No doctors available. Please try again later.',
          aiRecommendations: [],
          isLoadingAI: false,
        });
        return false;
      }

      const recommendations = response.data.recommendations || [];
      console.log('📋 Setting recommendations:', recommendations.length);

      set({
        aiRecommendations: recommendations,
        aiAnalysis: response.data.analysis,
        aiDisclaimer: response.data.disclaimer,
        currentStep: 'doctor',
        isLoadingAI: false,
      });
      return true;
    } catch (error: any) {
      console.error('📋 AI fetch error:', error);
      const message =
        error?.response?.data?.message || 'Failed to get AI recommendations';
      set({ error: message, isLoadingAI: false });
      return false;
    }
  },

  submitBooking: async () => {
    const state = get();
    if (!state.selectedDoctor || !state.selectedSlot || !state.selectedDate) {
      set({ error: 'Missing required booking information' });
      return;
    }

    if (state.symptoms.length < 10) {
      set({ error: 'Symptoms must be at least 10 characters' });
      return;
    }

    set({ isSubmitting: true, error: null });

    try {
      const data: CreateAppointmentData = {
        doctorId: state.selectedDoctor.id,
        timeSlotId: state.selectedSlot.slotId,
        appointmentDate: state.selectedDate,
        examinationType: state.examinationType,
        symptoms: state.symptoms,
        notes: state.notes || undefined,
        paymentMethod: state.paymentMethod,
      };

      await createAppointment(data);
      set({ ...initialState });
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Failed to create appointment';
      set({ error: message });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  reset: () => set(initialState),

  canProceed: () => {
    const state = get();
    switch (state.currentStep) {
      case 'symptoms':
        return state.symptoms.length >= 10;
      case 'doctor':
        return state.selectedDoctor !== null;
      case 'schedule':
        return state.selectedDate !== null && state.selectedSlot !== null;
      case 'info':
        return state.symptoms.length >= 10;
      case 'confirm':
        return true;
      default:
        return false;
    }
  },
}));
