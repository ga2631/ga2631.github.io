import { uiTranslations, UITranslation } from '@/data/uiTranslations';

export type Locale = 'vi' | 'en';

export const locales: Locale[] = ['vi', 'en'];
export const defaultLocale: Locale = 'vi';

export const hasLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

export const getDictionary = async (locale: Locale): Promise<UITranslation> => {
  return uiTranslations[locale] || uiTranslations.vi;
};

