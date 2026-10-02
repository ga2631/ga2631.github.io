'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Locale, defaultLocale, localeMetadataMap, LocaleMeta, detectUserLanguage } from './config';
import { Dictionary } from './dictionaries/vi';
import { getDictionary } from './getDictionary';
import { getActiveLanguages, Language } from '@/services/languageService';
import { trackLanguageChange } from '@/utils/analytics';
import { LoadingModal } from '@/components/common/LoadingModal';

export interface LanguageContextType {
  currentLang: Locale;
  languages: Language[];
  dict: Dictionary;
  meta: LocaleMeta;
  changeLanguage: (newLang: Locale) => void;
  getLocalizedHref: (path: string, targetLang?: Locale) => string;
  isLoadingLanguages: boolean;
  isChangingLanguage: boolean;
  setIsChangingLanguage: (val: boolean) => void;
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
  const [isChangingLanguage, setIsChangingLanguage] = useState<boolean>(false);
  const [targetLoadingLang, setTargetLoadingLang] = useState<Locale | null>(null);

  // Synchronize language with URL pathname or detect timezone on root
  useEffect(() => {
    if (!pathname) return;

    // Ensure scrolling is always enabled on route transition
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.classList.remove('overflow-hidden');
      document.querySelectorAll('[modal-backdrop], [drawer-backdrop]').forEach((el) => el.remove());
    }

    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0] as Locale;

    if (firstSegment === 'vi' || firstSegment === 'en') {
      setCurrentLang((prev) => (prev !== firstSegment ? firstSegment : prev));
      try {
        localStorage.setItem('user_language', firstSegment);
      } catch {}
    } else if (segments.length === 0 || (firstSegment !== 'vi' && firstSegment !== 'en' && firstSegment !== 'admin')) {
      // If visiting root "/" or non-localized URL: detect language via timezone / browser
      const detected = detectUserLanguage();
      setCurrentLang((prev) => (prev !== detected ? detected : prev));
      const newPath = getLocalizedHref(pathname, detected);
      if (newPath !== pathname) {
        router.replace(newPath);
      }
    }
  }, [pathname]);

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

    setIsChangingLanguage(true);
    setTargetLoadingLang(newLang);

    try {
      localStorage.setItem('user_language', newLang);
    } catch {}

    trackLanguageChange(newLang, currentLang);
    const newPath = getLocalizedHref(pathname || '', newLang);

    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState(null, '', newPath);
    }

    startTransition(() => {
      setCurrentLang(newLang);
    });

    // Provide a smooth, polished loading feedback window for Supabase queries
    setTimeout(() => {
      setIsChangingLanguage(false);
      setTargetLoadingLang(null);
    }, 400);
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
        isChangingLanguage,
        setIsChangingLanguage,
      }}
    >
      {children}
      {isChangingLanguage && (
        <LoadingModal
          variant="modal"
          message={
            targetLoadingLang === 'en'
              ? 'Switching language to English...'
              : 'Đang chuyển ngôn ngữ sang Tiếng Việt...'
          }
          subtitle={
            targetLoadingLang === 'en'
              ? 'Synchronizing localized data from Supabase'
              : 'Đang đồng bộ dữ liệu bản dịch từ Supabase'
          }
        />
      )}
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
