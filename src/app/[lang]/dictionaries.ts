import { uiTranslations, UITranslation } from '@/i18n';

export type Locale = 'vi' | 'en';

export const locales: Locale[] = ['vi', 'en'];
export const defaultLocale: Locale = 'vi';

export const hasLocale = (locale: string): locale is Locale => {
  return locale === 'vi' || locale === 'en';
};

export const getDictionary = async (locale: Locale): Promise<UITranslation> => {
  return uiTranslations[locale] || uiTranslations.vi;
};


