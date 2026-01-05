import { createAppointment } from '@/services/doctor';
import { Doctor } from '@/types/booking';
import { create } from 'zustand';

interface BookingState {
  currentStep: number;
  selectedDoctor: Doctor | null;
  selectedDate: Date | null;
  selectedTimeSlotId: string | null;
  selectedTimeLabel: string | null; // e.g., "09:00 - 09:30"
  examinationType: 'IN_PERSON' | 'ONLINE';
  symptoms: string;
  notes: string;
  isLoading: boolean;
  error: string | null;

  setCurrentStep: (step: number) => void;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  setSelectedDate: (date: Date | null) => void;
  selectTimeSlot: (id: string, label: string, type: 'IN_PERSON' | 'ONLINE') => void;
  setSymptoms: (text: string) => void;
  setNotes: (text: string) => void;
  submitBooking: () => Promise<void>;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  currentStep: 1,
  selectedDoctor: null,
  selectedDate: null,
  selectedTimeSlotId: null,
  selectedTimeLabel: null,
  examinationType: 'IN_PERSON',
  symptoms: '',
  notes: '',
  isLoading: false,
  error: null,

  setCurrentStep: (step) => set({ currentStep: step }),
  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  selectTimeSlot: (id, label, type) => set({ 
    selectedTimeSlotId: id, 
    selectedTimeLabel: label,
    examinationType: type 
  }),
  setSymptoms: (text) => set({ symptoms: text }),
  setNotes: (text) => set({ notes: text }),
  
  submitBooking: async () => {
    const state = get();
    if (!state.selectedDoctor || !state.selectedTimeSlotId || !state.selectedDate) {
      set({ error: 'Missing required fields' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await createAppointment({
        doctorId: state.selectedDoctor.id,
        timeSlotId: state.selectedTimeSlotId,
        appointmentDate: state.selectedDate.toISOString().split('T')[0],
        symptoms: state.symptoms,
        notes: state.notes,
        examinationType: state.examinationType,
      });
      // Success logic usually handled by UI navigating away
      set({ isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Booking failed' });
      throw err;
    }
  },

  resetBooking: () => set({
    currentStep: 1,
    selectedDoctor: null,
    selectedDate: null,
    selectedTimeSlotId: null,
    examinationType: 'IN_PERSON',
    symptoms: '',
    notes: '',
    error: null,
    isLoading: false,
  }),
}));
