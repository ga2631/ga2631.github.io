'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { uiTranslations } from '@/data/cvData';
import { trackPageView, trackLanguageChange } from '@/utils/analytics';
import { PersonalInfo } from '@/types';

interface AppShellProps {
  lang: 'vi' | 'en';
  currentRoute?: 'home' | 'blog';
  personalInfo?: PersonalInfo;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  lang,
  currentRoute = 'home',
  personalInfo,
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Synchronize document language attribute and local storage
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    try {
      localStorage.setItem('app-lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // Track pageview on mount and pathname change
  useEffect(() => {
    const pageTitle =
      currentRoute === 'blog'
        ? lang === 'vi'
          ? 'Bài viết kỹ thuật & Chia sẻ kinh nghiệm'
          : 'Technical Blog & Engineering Insights'
        : lang === 'vi'
          ? 'Huỳnh Nhật Tân | Kỹ sư phần mềm - Portfolio & CV'
          : 'Tan Huynh Nhat | Software Engineer - Portfolio & CV';

    trackPageView(pathname || `/${lang}/`, pageTitle, lang);
  }, [pathname, currentRoute, lang]);

  // Handle switching language between 'vi' and 'en'
  const handleSetLang = (newLang: 'vi' | 'en') => {
    if (newLang === lang) return;

    trackLanguageChange(newLang, lang);
    try {
      localStorage.setItem('app-lang', newLang);
    } catch {
      // ignore
    }

    // Determine target URL
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const targetPath =
      currentRoute === 'blog' ? `/${newLang}/blog/` : `/${newLang}/`;

    router.push(`${targetPath}${hash}`);
  };

  const defaultPersonalInfo: PersonalInfo = {
    fullName: 'Huỳnh Nhật Tân',
    jobTitle: 'Software Engineer',
    tagline: '',
    bio: '',
    email: '',
    location: '',
    availability: 'Available',
    githubUrl: 'https://github.com/ga2631',
    stats: [],
  };

  const currentPersonalInfo = personalInfo || defaultPersonalInfo;
  const t = uiTranslations[lang];

  return (
    <div className="app-root">
      <div className="web-only">
        <Header
          lang={lang}
          setLang={handleSetLang}
          t={t}
          personalInfo={currentPersonalInfo}
          currentRoute={currentRoute}
        />
        <main>{children}</main>
      </div>
    </div>
  );
};
