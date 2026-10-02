'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { getCvData } from '@/services/cvService';
import { CVData } from '@/types';
import {
  HeroSection,
  PrinciplesSection,
  ExperienceSection,
  ProjectsSection,
  SkillsSection,
  EducationSection,
  ContactSection,
  FloatDownloadButton,
} from './components';
import { LoadingModal } from '@/components/common/LoadingModal';

export function HomeView({ initialCvData }: { initialCvData?: CVData | null }) {
  const { dict, currentLang } = useLanguage();
  const [cv, setCv] = useState<CVData | null>(initialCvData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialCvData);

  useEffect(() => {
    let isMounted = true;
    async function loadCv() {
      if (!initialCvData) {
        setIsLoading(true);
      }
      try {
        const data = await getCvData(currentLang);
        if (isMounted) setCv(data);
      } catch (err) {
        console.warn('[HomeView] Could not load CV from Supabase, using defaults:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadCv();
    return () => {
      isMounted = false;
    };
  }, [currentLang, initialCvData]);

  // Ensure precise scroll alignment to hash when reloading or navigating to a specific section
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      const target = document.querySelector(hash);
      if (target) {
        // Allow DOM rendering and font layout to stabilize before smooth scrolling
        const timer = setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [cv, isLoading]);

  if (isLoading && !cv) {
    return <LoadingModal variant="fullscreen" />;
  }

  const personalInfo = cv?.personalInfo || {
    fullName: dict.nav.brand,
    jobTitle: 'Software Engineer',
    tagline: dict.hero.defaultTagline,
    bio: dict.hero.defaultBio1,
    email: 'hello@example.com',
    phone: '0901234567',
    location: 'TP. Hồ Chí Minh, VN',
    availability: dict.hero.availability,
    githubUrl: 'https://github.com/ga2631',
    linkedinUrl: 'https://linkedin.com/in/huynhnhattan',
    stats: [
      { label: dict.hero.statYears, value: '5 Năm' },
      { label: dict.hero.statMatching, value: '96%' },
      { label: dict.hero.statQuery, value: '70%+' },
      { label: dict.hero.statUsers, value: '1,000+' },
    ],
  };

  return (
    <>
      {/* SECTION 1: GIỚI THIỆU BẢN THÂN */}
      <HeroSection personalInfo={personalInfo} />

      {/* SECTION 3: NĂNG LỰC CỐT LÕI */}
      <PrinciplesSection principles={cv?.principles} />

      {/* SECTION 4: PROFESSIONAL EXPERIENCE */}
      <ExperienceSection experiences={cv?.experiences} />

      {/* SECTION 5: FEATURED PROJECTS */}
      <ProjectsSection projects={cv?.projects} />

      {/* SECTION 6: TECH STACK & TOOLS MATRIX */}
      <SkillsSection skillCategories={cv?.skillCategories} />

      {/* SECTION 7: EDUCATION & CERTIFICATIONS */}
      <EducationSection
        educations={cv?.educations}
        certifications={cv?.certifications}
      />

      {/* SECTION 8: CALL TO ACTION */}
      <ContactSection personalInfo={personalInfo} />

      {/* Float Button: Save CV */}
      {/* <FloatDownloadButton resumePdfUrl={personalInfo.resumePdfUrl} /> */}
    </>
  );
}

export * from './components';
