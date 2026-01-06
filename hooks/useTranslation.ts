import { en, ja, vi } from '@/i18n/translations';
import { LanguageCode, useLanguageStore } from '@/store/languageStore';
import { useCallback, useMemo } from 'react';

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : `${K}`;
    }[keyof T & string]
  : never;

type TranslationKey = NestedKeyOf<typeof en>;

const translations = {
  en,
  vi,
  ja,
};

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) ?? path;
}

export const useTranslation = () => {
  const { language, setLanguage } = useLanguageStore();

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      let value = getNestedValue(translations[language], key);
      
      if (value === key) {
        value = getNestedValue(translations.en, key);
      }

      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          value = value.replace(`{{${paramKey}}}`, String(paramValue));
        });
      }

      return value;
    },
    [language]
  );

  const currentLanguage = useMemo(() => language, [language]);

  return {
    t,
    language: currentLanguage,
    setLanguage,
  };
};

export const getTranslation = (language: LanguageCode, key: string): string => {
  let value = getNestedValue(translations[language], key);
  if (value === key) {
    value = getNestedValue(translations.en, key);
  }
  return value;
};

