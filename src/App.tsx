'use client';

import React, { useState, useEffect } from 'react';
import { cvDataVi, cvDataEn, uiTranslations } from './data/cvData';
import { blogPostsVi, blogPostsEn } from './data/blogData';
import { Header } from './components/Header';
import { Home, Blog } from './views';
import { trackPageView, trackLanguageChange } from './utils/analytics';

export const App: React.FC = () => {
  const [lang, setLang] = useState<'vi' | 'en'>('en');
  const [isHydrated, setIsHydrated] = useState(false);
  const [route, setRoute] = useState<'home' | 'blog'>('home');

  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem('app-lang');
    if (saved === 'en' || saved === 'vi') {
      setLang(saved);
    }
    const hash = window.location.hash;
    if (hash.startsWith('#/blog') || hash === '#blog') {
      setRoute('blog');
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      document.documentElement.setAttribute('lang', lang);
      localStorage.setItem('app-lang', lang);
    }
  }, [lang, isHydrated]);

  const handleSetLang = (newLang: 'vi' | 'en') => {
    setLang(newLang);
    trackLanguageChange(newLang);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const newRoute =
        hash.startsWith('#/blog') || hash === '#blog' ? 'blog' : 'home';
      setRoute(newRoute);
      trackPageView(
        newRoute === 'blog' ? '/#/blog' : '/',
        newRoute === 'blog'
          ? 'Technical Blog & Insights'
          : 'Executive Portfolio & CV'
      );
    };

    window.addEventListener('hashchange', handleHashChange);
    trackPageView(
      route === 'blog' ? '/#/blog' : '/',
      route === 'blog'
        ? 'Technical Blog & Insights'
        : 'Executive Portfolio & CV'
    );

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [route]);

  const currentCvData = lang === 'vi' ? cvDataVi : cvDataEn;
  const currentBlogPosts = lang === 'vi' ? blogPostsVi : blogPostsEn;
  const t = uiTranslations[lang];

  return (
    <div className="app-root">
      {/* Screen Portfolio Web Application */}
      <div className="web-only">
        <Header
          lang={lang}
          setLang={handleSetLang}
          t={t}
          personalInfo={currentCvData.personalInfo}
          currentRoute={route}
        />

        <main>
          {route === 'blog' ? (
            <Blog posts={currentBlogPosts} t={t.blog} tCommon={t.common} />
          ) : (
            <Home data={currentCvData} t={t} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
