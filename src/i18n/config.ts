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
