'use client';

import React from 'react';
import { CVData } from '../types';
import { UITranslation } from '../data/cvData';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Experience } from '../components/Experience';
import { Projects } from '../components/Projects';
import { Skills } from '../components/Skills';
import { Footer } from '../components/Footer';
import { EducationCertifications } from '../components/EducationCertifications';
import { Contact } from '../components/Contact';
import { FloatingActions } from '../components/composite';

export interface HomeProps {
  data: CVData;
  t: UITranslation;
}

export const Home: React.FC<HomeProps> = ({ data, t }) => {
  return (
    <>
      <Hero data={data.personalInfo} t={t.hero} />
      <About
        data={data.personalInfo}
        principles={data.principles}
        t={t.about}
      />
      <Experience experiences={data.experiences} t={t.experience} />
      <Projects
        projects={data.projects}
        t={t.projects}
        tCommon={t.common}
      />
      <Skills categories={data.skillCategories} t={t.skills} />
      <EducationCertifications
        educations={data.educations}
        certifications={data.certifications}
        t={t.education}
      />
      <Contact data={data.personalInfo} t={t.contact} />
      <Footer t={t.footer} fullName={data.personalInfo.fullName} />
      <FloatingActions
        data={data}
        tPrintCv={t.printCv}
        saveCvLabel={t.nav.saveCv}
        tCommon={t.common}
      />
    </>
  );
};

Home.displayName = 'Home';
export default Home;
