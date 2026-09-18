import React, { useState, useEffect } from 'react';
import { cvDataVi, cvDataEn, uiTranslations } from './data/cvData.ts';
import { blogPostsVi, blogPostsEn } from './data/blogData.ts';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Experience } from './components/Experience.tsx';
import { Projects } from './components/Projects.tsx';
import { Skills } from './components/Skills.tsx';
import { EducationCertifications } from './components/EducationCertifications.tsx';
import { Contact } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { PrintCV } from './components/PrintCV.tsx';
import { FloatingActions } from './components/FloatingActions.tsx';
import { BlogPage } from './pages/BlogPage.tsx';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('app-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

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
    localStorage.setItem('app-theme', theme);
  }, [theme]);

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

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
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
            <BlogPage
              posts={currentBlogPosts}
              t={t.blog}
              tCommon={t.common}
            />
          ) : (
            <>
              <Hero data={currentCvData.personalInfo} t={t.hero} />
              <About data={currentCvData.personalInfo} t={t.about} />
              <Experience experiences={currentCvData.experiences} t={t.experience} />
              <Projects
                projects={currentCvData.projects}
                t={t.projects}
                tCommon={t.common}
              />
              <Skills categories={currentCvData.skillCategories} t={t.skills} />
              <EducationCertifications
                educations={currentCvData.educations}
                certifications={currentCvData.certifications}
                t={t.education}
              />
              <Contact data={currentCvData.personalInfo} t={t.contact} />
            </>
          )}
        </main>

        <Footer t={t.footer} fullName={currentCvData.personalInfo.fullName} />

        {/* Floating Quick Action Button (FAB) */}
        <FloatingActions
          onPrint={() => window.print()}
          saveCvLabel={t.nav.saveCv}
          tCommon={t.common}
        />
      </div>

      {/* Dedicated Standard ATS / Executive Print CV Document */}
      <PrintCV data={currentCvData} t={t.printCv} />
    </div>
  );
};

export default App;

