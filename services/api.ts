import { RefreshTokenResponse } from '@/types/auth';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as Storage from './storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.hospital-intelligence.xyz/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await Storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 & Refresh
interface FailedQueueItem {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If it's a login error (wrong credentials), don't retry
      if (originalRequest.url?.includes('/auth/login')) {
         return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await Storage.getItem('refresh_token'); // Need to implement getItem in storage for generic
        // Actually storage.ts has getToken (access token). I need getRefreshToken too.
        // Assuming I'll update storage.ts to generic getItem or specific getRefreshToken

        if (!refreshToken) {
            throw new Error('No refresh token');
        }

        // Call refresh endpoint
        // Use fetch or a separate axios instance to avoid loop? 
        // Or just api instance but ensure it doesn't loop if 401 again.
        // Better use axios.create() for refresh to be safe.
        const response = await axios.post<RefreshTokenResponse>(`${BASE_URL}/auth/refresh-token`, {
            refreshToken
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        await Storage.setToken(accessToken);
        await Storage.setItem('refresh_token', newRefreshToken); // Need to update storage.ts

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Logout user
        await Storage.removeToken();
        await Storage.removeItem('refresh_token');
        // We might want to trigger a redirect here or rely on store checking token
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
