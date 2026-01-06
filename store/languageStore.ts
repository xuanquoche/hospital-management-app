import * as Storage from '@/services/storage';
import { create } from 'zustand';

export type LanguageCode = 'en' | 'vi' | 'ja';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

const LANGUAGE_STORAGE_KEY = 'app_language';
const DEFAULT_LANGUAGE: LanguageCode = 'en';

interface LanguageState {
  language: LanguageCode;
  isLoading: boolean;
  setLanguage: (language: LanguageCode) => Promise<void>;
  loadLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: DEFAULT_LANGUAGE,
  isLoading: true,

  setLanguage: async (language: LanguageCode) => {
    await Storage.setItem(LANGUAGE_STORAGE_KEY, language);
    set({ language });
  },

  loadLanguage: async () => {
    try {
      const storedLanguage = await Storage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage && ['en', 'vi', 'ja'].includes(storedLanguage)) {
        set({ language: storedLanguage as LanguageCode });
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

