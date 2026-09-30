import { uiTranslations, UITranslation } from '@/i18n';

export type Locale = string;

export const locales: string[] = ['vi', 'en'];
export const defaultLocale: string = 'vi';

export const hasLocale = (locale: string): locale is Locale => {
  return typeof locale === 'string' && locale.trim().length >= 2;
};

export const getDictionary = async (locale: string): Promise<UITranslation> => {
  return (uiTranslations as Record<string, UITranslation>)[locale] || uiTranslations.vi;
};


