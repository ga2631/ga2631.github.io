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
  changeLanguage: (newLang: Locale, customPath?: string) => void;
  getLocalizedHref: (path: string, targetLang?: Locale) => string;
  isLoadingLanguages: boolean;
  isChangingLanguage: boolean;
  setIsChangingLanguage: (val: boolean) => void;
  isInitialized: boolean;
  alternatePaths: Record<string, string> | null;
  setAlternatePaths: (paths: Record<string, string> | null) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
  initialLang = defaultLocale,
}: {
  children: React.ReactNode;
  initialLang?: Locale;
}) {
  let router: ReturnType<typeof useRouter> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    router = useRouter();
  } catch {
    router = null;
  }

  let pathname: string | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    pathname = usePathname();
  } catch {
    pathname = null;
  }

  const [, startTransition] = useTransition();

  const [currentLang, setCurrentLang] = useState<Locale>(initialLang);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState<boolean>(true);
  const [isChangingLanguage, setIsChangingLanguage] = useState<boolean>(false);
  const [targetLoadingLang, setTargetLoadingLang] = useState<Locale | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(() => typeof window === 'undefined' || !!initialLang);
  const [alternatePaths, setAlternatePaths] = useState<Record<string, string> | null>(null);

  // Synchronize language with URL pathname or default to English / saved choice
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
      setIsInitialized(true);
    } else if (segments.length === 0 || (firstSegment !== 'vi' && firstSegment !== 'en' && firstSegment !== 'admin')) {
      // If visiting root "/" or non-localized URL: detect saved preference or default to English
      const detected = detectUserLanguage();
      setCurrentLang((prev) => (prev !== detected ? detected : prev));
      const newPath = getLocalizedHref(pathname, detected);
      if (newPath !== pathname) {
        if (router) {
          router.replace(newPath);
        } else if (typeof window !== 'undefined') {
          window.location.replace(newPath);
        }
      }
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
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
    // If alternatePaths is registered and path refers to the current page (e.g. blog post), use alternate path
    if (alternatePaths && alternatePaths[targetLang] && (path === pathname || path === '')) {
      const alt = alternatePaths[targetLang];
      return alt.startsWith('/') ? alt : `/${alt}`;
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // Strip leading /vi or /en if already present
    const pathWithoutLocale = cleanPath.replace(/^\/(vi|en)(\/|$)/, '/');
    const finalSubPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
    return `/${targetLang}${finalSubPath}`;
  };

  const changeLanguage = (newLang: Locale, customPath?: string) => {
    if (newLang === currentLang) return;

    setIsChangingLanguage(true);
    setTargetLoadingLang(newLang);

    try {
      localStorage.setItem('user_language', newLang);
    } catch {}

    trackLanguageChange(newLang, currentLang);
    let newPath = customPath || (alternatePaths && alternatePaths[newLang]) || getLocalizedHref(pathname || '', newLang);

    if (newPath && !newPath.startsWith('/')) {
      newPath = `/${newPath.replace(/^\/+/, '')}`;
    }

    if (typeof window !== 'undefined') {
      const isBlogDetailPage = pathname ? /\/(vi|en)\/blog\/[^/]+/.test(pathname) : false;
      if (isBlogDetailPage || (alternatePaths && alternatePaths[newLang])) {
        if (router) {
          router.push(newPath);
        } else {
          window.location.href = newPath;
        }
      } else if (window.history) {
        window.history.replaceState(null, '', newPath);
      }
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
        isInitialized,
        alternatePaths,
        setAlternatePaths,
      }}
    >
      {!isInitialized ? (
        <LoadingModal
          variant="fullscreen"
          message={dict.common.loading}
          subtitle={dict.common.initializing}
        />
      ) : (
        children
      )}
      {isChangingLanguage && (
        <LoadingModal
          variant="modal"
          message={
            targetLoadingLang === 'en'
              ? dict.common.switchingLangEn
              : dict.common.switchingLangVi
          }
          subtitle={dict.common.loadingSubtitle}
        />
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for static build / error boundaries
    const fallbackLang = defaultLocale;
    return {
      currentLang: fallbackLang,
      languages: [],
      dict: getDictionary(fallbackLang),
      meta: localeMetadataMap[fallbackLang] || localeMetadataMap.en,
      changeLanguage: () => {},
      getLocalizedHref: (path: string, targetLang: Locale = fallbackLang) => {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const pathWithoutLocale = cleanPath.replace(/^\/(vi|en)(\/|$)/, '/');
        const finalSubPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
        return `/${targetLang}${finalSubPath}`;
      },
      isLoadingLanguages: false,
      isChangingLanguage: false,
      setIsChangingLanguage: () => {},
      isInitialized: true,
      alternatePaths: null,
      setAlternatePaths: () => {},
    };
  }
  return context;
}
