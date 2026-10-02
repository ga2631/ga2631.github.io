export type Locale = 'vi' | 'en';

export const defaultLocale: Locale = 'vi';

export const supportedLocales: Locale[] = ['vi', 'en'];

export interface LocaleMeta {
  code: Locale;
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export const localeMetadataMap: Record<Locale, LocaleMeta> = {
  vi: {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: '🇻🇳',
    direction: 'ltr',
  },
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    direction: 'ltr',
  },
};

export function isValidLocale(lang: string): lang is Locale {
  return supportedLocales.includes(lang as Locale);
}

/**
 * Detects user language based on explicit localStorage preference,
 * client timezone (Vietnam vs international), or browser language.
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

  try {
    // 2. Detect timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const offsetMinutes = new Date().getTimezoneOffset(); // Vietnam is UTC+7 -> offset is -420 minutes

    const isVietnamTimezone =
      timeZone === 'Asia/Ho_Chi_Minh' ||
      timeZone === 'Asia/Saigon' ||
      timeZone === 'Asia/Bangkok' ||
      timeZone === 'Asia/Phnom_Penh' ||
      timeZone === 'Asia/Vientiane' ||
      timeZone.toLowerCase().includes('vietnam') ||
      timeZone.toLowerCase().includes('hcm') ||
      timeZone.toLowerCase().includes('saigon') ||
      offsetMinutes === -420;

    const browserLang = (
      navigator.language ||
      (navigator.languages && navigator.languages[0]) ||
      ''
    ).toLowerCase();
    const isVietnameseLang = browserLang.startsWith('vi');

    if (isVietnamTimezone || isVietnameseLang) {
      return 'vi';
    }

    // Default for international timezones / visitors
    return 'en';
  } catch {
    return defaultLocale;
  }
}
