import { Locale, defaultLocale } from './config';
import { viDict, Dictionary } from './dictionaries/vi';
import { enDict } from './dictionaries/en';

const dictionaries: Record<Locale, Dictionary> = {
  vi: viDict,
  en: enDict,
};

export function getDictionary(locale: string = defaultLocale): Dictionary {
  const normalizedLocale = (locale.toLowerCase() as Locale);
  return dictionaries[normalizedLocale] || dictionaries[defaultLocale];
}
