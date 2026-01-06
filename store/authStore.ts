import { api } from '@/services/api';
import * as Storage from '@/services/storage';
import {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  User,
  UserProfileResponse,
} from '@/types/auth';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const USER_STORAGE_KEY = 'user_data';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
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
      ]);
      set({ user: null, isAuthenticated: false });
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

      const cachedUserData = await Storage.getItem(USER_STORAGE_KEY);
      if (cachedUserData) {
        try {
          const user = JSON.parse(cachedUserData) as User;
          set({ user, isAuthenticated: true });
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
      ]);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserProfile: async () => {
    try {
      const response = await api.get<UserProfileResponse>('/users/me');
      const user = response.data.data;
      await Storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      set({ user });
    } catch {
      // Profile fetch failed, keep existing user data if available
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
}));
