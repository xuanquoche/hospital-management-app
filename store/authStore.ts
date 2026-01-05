import { api } from '@/services/api';
import * as Storage from '@/services/storage';
import { LoginResponse, User } from '@/types/auth';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      const { user, accessToken, refreshToken } = response.data.data;
      
      await Storage.setToken(accessToken);
      await Storage.setItem('refresh_token', refreshToken);
      
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      await api.post('/auth/register', data);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await Storage.removeToken();
    await Storage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await Storage.getToken();
      if (token) {
        // Optionally fetch user profile if token exists
        // const user = await api.get('/auth/me'); 
        // set({ user: user.data, isAuthenticated: true });
        // For now just assume auth if token exists, or implement simple profile fetch
        // Since login returns user, we might want to cache user in storage too or fetch it.
        // Assuming we need to fetch profile:
        // const response = await api.get('/auth/me');
        // set({ user: response.data, isAuthenticated: true });
        
        // As placeholder:
        set({ isAuthenticated: true });
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error) {
        // If check fails (e.g. 401), logout
        await Storage.removeToken();
        set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
