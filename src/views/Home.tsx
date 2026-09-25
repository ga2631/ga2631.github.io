import React from 'react';
import { CVData } from '../types/index.ts';
import { UITranslation } from '../data/cvData.ts';
import { Hero } from '../components/Hero.tsx';
import { About } from '../components/About.tsx';
import { Experience } from '../components/Experience.tsx';
import { Projects } from '../components/Projects.tsx';
import { Skills } from '../components/Skills.tsx';
import { Footer } from '../components/Footer.tsx';
import { EducationCertifications } from '../components/EducationCertifications.tsx';
import { Contact } from '../components/Contact.tsx';
import { ButtonFloatingScrollTop, ButtonPrint } from '../components/composite';

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
      <div className="floating-actions-container" role="region" aria-label="Floating quick actions">
        <ButtonFloatingScrollTop tCommon={t.common} />
        <ButtonPrint
          variant="floating"
          data={data}
          tPrintCv={t.printCv}
          onPrint={() => window.print()}
          label={t.nav.saveCv}
          tCommon={t.common}
        />
      </div>
    </>
  );
};

Home.displayName = 'Home';
export default Home;
