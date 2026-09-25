export type Locale = 'vi' | 'en';

export const locales: Locale[] = ['vi', 'en'];
export const defaultLocale: Locale = 'vi';

const dictionaries = {
  vi: () => import('@/data/locales/vi/ui.json').then((module) => module.default),
  en: () => import('@/data/locales/en/ui.json').then((module) => module.default),
};

const cvDictionaries = {
  vi: () => import('@/data/locales/vi/cv.json').then((module) => module.default),
  en: () => import('@/data/locales/en/cv.json').then((module) => module.default),
};

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
export const getCvDictionary = async (locale: Locale) => cvDictionaries[locale]();
