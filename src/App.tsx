import React, { useState, useEffect } from 'react';
import { cvDataVi, cvDataEn, uiTranslations } from './data/cvData.ts';
import { blogPostsVi, blogPostsEn } from './data/blogData.ts';
import { Header } from './components/Header.tsx';
import { Home, Blog } from './pages';
import {
  ThemeMode,
  getInitialTheme,
  saveManualThemeOverride,
  getTodayDateString,
  getTimeBasedDefaultTheme,
  THEME_OVERRIDE_DATE_KEY,
} from './utils/theme.ts';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());

  const [lang, setLang] = useState<'vi' | 'en'>(() => {
    const saved = localStorage.getItem('app-lang');
    if (saved === 'en' || saved === 'vi') return saved;
    return 'en';
  });

  const [route, setRoute] = useState<'home' | 'blog'>(() => {
    const hash = window.location.hash;
    return hash.startsWith('#/blog') || hash === '#blog' ? 'blog' : 'home';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('app-lang', lang);
  }, [lang]);

  // Periodically verify real-time day/night theme if not manually overridden today
  useEffect(() => {
    const checkRealTimeTheme = () => {
      const overrideDate = localStorage.getItem(THEME_OVERRIDE_DATE_KEY);
      const today = getTodayDateString();

      // If user manually chose a theme for today, do not auto-switch
      if (overrideDate === today) return;

      const expectedTheme = getTimeBasedDefaultTheme();
      setTheme((current) => (current !== expectedTheme ? expectedTheme : current));
    };

    const interval = setInterval(checkRealTimeTheme, 60000);
    window.addEventListener('focus', checkRealTimeTheme);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkRealTimeTheme);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/blog') || hash === '#blog') {
        setRoute('blog');
      } else {
        setRoute('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      saveManualThemeOverride(next);
      return next;
    });
  };

  const currentCvData = lang === 'vi' ? cvDataVi : cvDataEn;
  const currentBlogPosts = lang === 'vi' ? blogPostsVi : blogPostsEn;
  const t = uiTranslations[lang];

  return (
    <div className="app-root">
      {/* Screen Portfolio Web Application */}
      <div className="web-only">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          lang={lang}
          setLang={setLang}
          t={t}
          personalInfo={currentCvData.personalInfo}
          currentRoute={route}
        />

        <main>
          {route === 'blog' ? (
            <Blog
              posts={currentBlogPosts}
              t={t.blog}
              tCommon={t.common}
            />
          ) : (
            <Home data={currentCvData} t={t} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
