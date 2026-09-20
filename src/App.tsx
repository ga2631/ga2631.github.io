import React, { useState, useEffect } from 'react';
import { cvDataVi, cvDataEn, uiTranslations } from './data/cvData.ts';
import { blogPostsVi, blogPostsEn } from './data/blogData.ts';
import { Header } from './components/Header.tsx';
import { Home, Blog } from './pages';

export const App: React.FC = () => {
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
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('app-lang', lang);
  }, [lang]);

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

  const currentCvData = lang === 'vi' ? cvDataVi : cvDataEn;
  const currentBlogPosts = lang === 'vi' ? blogPostsVi : blogPostsEn;
  const t = uiTranslations[lang];

  return (
    <div className="app-root">
      {/* Screen Portfolio Web Application */}
      <div className="web-only">
        <Header
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
