'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Locale, defaultLocale, localeMetadataMap, LocaleMeta } from './config';
import { Dictionary } from './dictionaries/vi';
import { getDictionary } from './getDictionary';
import { getActiveLanguages, Language } from '@/services/languageService';
import { trackLanguageChange } from '@/utils/analytics';

export interface LanguageContextType {
  currentLang: Locale;
  languages: Language[];
  dict: Dictionary;
  meta: LocaleMeta;
  changeLanguage: (newLang: Locale) => void;
  getLocalizedHref: (path: string, targetLang?: Locale) => string;
  isLoadingLanguages: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
  initialLang = defaultLocale,
}: {
  children: React.ReactNode;
  initialLang?: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [currentLang, setCurrentLang] = useState<Locale>(initialLang);
  const [languages, setLanguages] = useState<Language[]>([
    { code: 'vi', name: 'Tiếng Việt', is_active: true },
    { code: 'en', name: 'English', is_active: true },
  ]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState<boolean>(true);

  // Synchronize language with URL pathname
  useEffect(() => {
    if (!pathname) return;
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0] as Locale;
    if (firstSegment === 'vi' || firstSegment === 'en') {
      if (firstSegment !== currentLang) {
        setCurrentLang(firstSegment);
      }
    }
  }, [pathname, currentLang]);

  // Dynamically load active languages from Supabase table 'languages'
  useEffect(() => {
    let isMounted = true;
    async function loadLangs() {
      try {
        const dbLanguages = await getActiveLanguages();
        if (isMounted && dbLanguages && dbLanguages.length > 0) {
          setLanguages(dbLanguages);
        }
      } catch (err) {
        console.warn('[LanguageProvider] Failed to fetch active languages from Supabase, using defaults:', err);
      } finally {
        if (isMounted) setIsLoadingLanguages(false);
      }
    }
    loadLangs();
    return () => {
      isMounted = false;
    };
  }, []);

  const dict = getDictionary(currentLang);
  const meta = localeMetadataMap[currentLang] || localeMetadataMap[defaultLocale];

  const getLocalizedHref = (path: string, targetLang: Locale = currentLang): string => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // Strip leading /vi or /en if already present
    const pathWithoutLocale = cleanPath.replace(/^\/(vi|en)(\/|$)/, '/');
    const finalSubPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
    return `/${targetLang}${finalSubPath}`;
  };

  const changeLanguage = (newLang: Locale) => {
    if (newLang === currentLang) return;

    trackLanguageChange(newLang, currentLang);
    const newPath = getLocalizedHref(pathname || '', newLang);

    startTransition(() => {
      setCurrentLang(newLang);
      router.push(newPath);
    });
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        languages,
        dict,
        meta,
        changeLanguage,
        getLocalizedHref,
        isLoadingLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
