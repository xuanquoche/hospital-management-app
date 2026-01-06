import { api } from '@/services/api';
import * as Storage from '@/services/storage';
import {
  LoginCredentials,
  LoginResponse,
  PatientProfile,
  RegisterData,
  User,
  UserMeResponse,
} from '@/types/auth';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  patientProfile: PatientProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  updatePatientProfile: (profile: Partial<PatientProfile>) => void;
}

const USER_STORAGE_KEY = 'user_data';
const PATIENT_PROFILE_KEY = 'patient_profile';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  patientProfile: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (credentials) => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const { user, accessToken, refreshToken } = response.data.data;

    await Promise.all([
      Storage.setToken(accessToken),
      Storage.setItem('refresh_token', refreshToken),
      Storage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
    ]);

    set({ user, isAuthenticated: true, isLoading: false });

    get().fetchUserProfile();
  },

  register: async (data) => {
    await api.post('/auth/register', data);
  },

  logout: async () => {
    try {
      const refreshToken = await Storage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken }).catch(() => {});
      }
    } finally {
      await Promise.all([
        Storage.removeToken(),
        Storage.removeItem('refresh_token'),
        Storage.removeItem(USER_STORAGE_KEY),
        Storage.removeItem(PATIENT_PROFILE_KEY),
      ]);
      set({ user: null, patientProfile: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await Storage.getToken();
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }

      const [cachedUserData, cachedPatientProfile] = await Promise.all([
        Storage.getItem(USER_STORAGE_KEY),
        Storage.getItem(PATIENT_PROFILE_KEY),
      ]);

      if (cachedUserData) {
        try {
          const user = JSON.parse(cachedUserData) as User;
          const profile = cachedPatientProfile
            ? (JSON.parse(cachedPatientProfile) as PatientProfile)
            : null;
          set({ user, patientProfile: profile, isAuthenticated: true });
        } catch {
          // Invalid cached data
        }
      }

      await get().fetchUserProfile();
      set({ isAuthenticated: true });
    } catch {
      await Promise.all([
        Storage.removeToken(),
        Storage.removeItem('refresh_token'),
        Storage.removeItem(USER_STORAGE_KEY),
        Storage.removeItem(PATIENT_PROFILE_KEY),
      ]);
      set({ user: null, patientProfile: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserProfile: async () => {
    try {
      const response = await api.get<UserMeResponse>('/users/me');
      const { user, profile } = response.data.data;

      await Promise.all([
        Storage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
        profile
          ? Storage.setItem(PATIENT_PROFILE_KEY, JSON.stringify(profile))
          : Storage.removeItem(PATIENT_PROFILE_KEY),
      ]);

      set({ user, patientProfile: profile });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  },

  updateUser: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      set({ user: updatedUser });
      Storage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  },

  updatePatientProfile: (profileData) => {
    const currentProfile = get().patientProfile;
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, ...profileData };
      set({ patientProfile: updatedProfile });
      Storage.setItem(PATIENT_PROFILE_KEY, JSON.stringify(updatedProfile));
    }
  },
}));
