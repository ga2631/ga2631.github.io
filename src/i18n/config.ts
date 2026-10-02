export type Locale = 'vi' | 'en';

/**
 * Default language is English ('en') unless explicitly selected by user.
 */
export const defaultLocale: Locale = 'en';

export const supportedLocales: Locale[] = ['en', 'vi'];

export interface LocaleMeta {
  code: Locale;
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export const localeMetadataMap: Record<Locale, LocaleMeta> = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    direction: 'ltr',
  },
  vi: {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: '🇻🇳',
    direction: 'ltr',
  },
};

export function isValidLocale(lang: string): lang is Locale {
  return supportedLocales.includes(lang as Locale);
}

/**
 * Detects user language:
 * 1. Explicit user choice saved in localStorage ('user_language')
 * 2. Default to English ('en')
 */
export function detectUserLanguage(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  // 1. Check saved user preference in localStorage
  try {
    const saved = localStorage.getItem('user_language');
    if (saved === 'vi' || saved === 'en') {
      return saved;
    }
  } catch {}

  // 2. Default to English
  return defaultLocale;
}
