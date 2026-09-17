import React, { useState, useEffect } from 'react';
import { cvData } from './data/cvData.ts';
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-root">
      {/* Screen Portfolio Web Application */}
      <div className="web-only">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main>
          <Hero data={cvData.personalInfo} />
          <About data={cvData.personalInfo} />
          <Experience experiences={cvData.experiences} />
          <Projects projects={cvData.projects} />
          <Skills categories={cvData.skillCategories} />
          <EducationCertifications
            educations={cvData.educations}
            certifications={cvData.certifications}
          />
          <BlogSection posts={cvData.blogPosts} />
          <Contact data={cvData.personalInfo} />
        </main>
        <Footer />
      </div>

      {/* Dedicated Standard ATS / Executive Print CV Document */}
      <PrintCV data={cvData} />
    </div>
  );
};

export default App;
