export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.hospital-intelligence.xyz/api/v1',
  SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL || 'wss://api.hospital-intelligence.xyz',
  TIMEOUT: 30000,
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  USER: {
    ME: '/users/me',
    UPDATE_PROFILE: '/users/me',
  },
  PATIENT: {
    PROFILE: '/patients/me',
    CONSULTATIONS: '/patients/me/consultations',
    PAYMENTS: '/patients/me/payments',
    CONVERSATIONS: '/patients/conversations',
  },
  DOCTOR: {
    LIST: '/doctors',
    DETAIL: (id: string) => `/doctors/${id}`,
    SCHEDULES: (id: string) => `/doctors/${id}/schedules`,
  },
  SPECIALTY: {
    LIST: '/specialties',
    DOCTORS: (id: string) => `/specialties/${id}/doctors`,
  },
  APPOINTMENT: {
    LIST: '/appointments',
    CREATE: '/appointments',
    DETAIL: (id: string) => `/appointments/${id}`,
    CANCEL: (id: string) => `/appointments/${id}/cancel`,
  },
  AI: {
    CHAT: '/ai/chat',
    RECOMMEND_DOCTOR: '/ai/recommend-doctor',
  },
};

