'use client';

import { useLanguage } from './LanguageContext';

export function useTranslation() {
  const { dict, currentLang, changeLanguage, getLocalizedHref, languages, meta } = useLanguage();

  return {
    t: dict,
    lang: currentLang,
    changeLanguage,
    getLocalizedHref,
    languages,
    meta,
  };
}
