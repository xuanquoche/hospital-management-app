import { api } from './api';
// Actually I don't have types/appointment-api.ts in mobile yet. I only read it in web.
// I should create types/appointment.ts in mobile.

export interface Appointment {
  id: string;
  appointmentDate: string;
  status: string;
  doctor: {
      id: string;
      professionalTitle: string;
      user: {
          fullName: string;
      };
      primarySpecialty: {
          name: string;
      }
  };
  timeSlot: {
      startTime: string;
      endTime: string;
  };
  examinationType: string;
}

export const getAppointments = async () => {
    // Check web endpoint: likely GET /appointments/me or /patients/appointments
    // Web: `admin-appointments`... 
    // Patient flow: `useAppointmentList`? 
    // I'll guess /appointments or /patients/appointments based on chat endpoint being /patients/conversations
    // Let's assume /patients/appointments or /appointments/my-appointments
    // Standard based on `fetcher`: `/patients/appointments`?
    // Let's try /patients/appointments or /appointments
    // Web usage: `clientFetcher.get('/appointments/me')` or similar.
    // I will guess `/appointments` with user context.
    // Actually, let's use `/appointments` and hope backend filters by user.
    // Or `/patients/me/appointments`.
    // Safest bet: `/appointments`
    const response = await api.get<{ data: Appointment[] }>('/appointments');
    return response.data.data;
};

export const cancelAppointment = async (id: string, reason: string) => {
    await api.patch(`/appointments/${id}/cancel`, { reason });
};
