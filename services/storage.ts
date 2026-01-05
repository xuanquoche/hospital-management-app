import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// SecureStore only works on physical devices or simulators (iOS/Android)
// For web, we would need localStorage (but this is a mobile app)

export const setItem = async (key: string, value: string) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return null;
  }
};

export const removeItem = async (key: string) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
  }
};

export const setToken = (token: string) => setItem(TOKEN_KEY, token);
export const getToken = () => getItem(TOKEN_KEY);
export const removeToken = () => removeItem(TOKEN_KEY);


// Similar helpers for potentially other secure items if needed
