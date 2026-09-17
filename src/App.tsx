import React, { useState, useEffect } from 'react';
import { cvDataVi, cvDataEn, uiTranslations } from './data/cvData.ts';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Experience } from './components/Experience.tsx';
import { Projects } from './components/Projects.tsx';
import { Skills } from './components/Skills.tsx';
import { EducationCertifications } from './components/EducationCertifications.tsx';
import { BlogSection } from './components/BlogSection.tsx';
import { Contact } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { PrintCV } from './components/PrintCV.tsx';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('app-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const [lang, setLang] = useState<'vi' | 'en'>(() => {
    const saved = localStorage.getItem('app-lang');
    if (saved === 'en' || saved === 'vi') return saved;
    return 'vi';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('app-lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentCvData = lang === 'vi' ? cvDataVi : cvDataEn;
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
          t={t.nav}
        />
        <main>
          <Hero data={currentCvData.personalInfo} t={t.hero} />
          <About data={currentCvData.personalInfo} t={t.about} />
          <Experience experiences={currentCvData.experiences} t={t.experience} />
          <Projects projects={currentCvData.projects} t={t.projects} />
          <Skills categories={currentCvData.skillCategories} t={t.skills} />
          <EducationCertifications
            educations={currentCvData.educations}
            certifications={currentCvData.certifications}
            t={t.education}
          />
          <BlogSection posts={currentCvData.blogPosts} t={t.blog} />
          <Contact data={currentCvData.personalInfo} t={t.contact} />
        </main>
        <Footer t={t.footer} />
      </div>

      {/* Dedicated Standard ATS / Executive Print CV Document */}
      <PrintCV data={currentCvData} lang={lang} />
    </div>
  );
};

export default App;
