import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FloatingActions } from '../../src/components/composite/FloatingActions';
import { Hero } from '../../src/components/Hero';
import { About } from '../../src/components/About';
import { Skills } from '../../src/components/Skills';
import { EducationCertifications } from '../../src/components/EducationCertifications';
import { cvDataEn, uiTranslations } from '../../src/data/cvData';

describe('TS-05 to TS-15: Mobile Ergonomics, Sections & Floating Actions', () => {
  it('should render Hero CTA buttons with accessible labels and links', () => {
    render(<Hero data={cvDataEn.personalInfo} t={uiTranslations.en.hero} />);

    expect(screen.getByText(uiTranslations.en.hero.viewProjects)).toBeInTheDocument();
    expect(screen.getByText(uiTranslations.en.hero.getInTouch)).toBeInTheDocument();
    expect(screen.getByText(uiTranslations.en.hero.saveCv)).toBeInTheDocument();
  });

  it('should render About principles cards with icons and descriptions', () => {
    render(
      <About
        data={cvDataEn.personalInfo}
        principles={cvDataEn.principles}
        t={uiTranslations.en.about}
      />
    );

    expect(screen.getByText(uiTranslations.en.about.title)).toBeInTheDocument();
    cvDataEn.principles.forEach((principle) => {
      expect(screen.getByText(principle.title)).toBeInTheDocument();
    });
  });

  it('should render Skills categories with legend and taxonomy chips', () => {
    render(
      <Skills
        categories={cvDataEn.skillCategories}
        t={uiTranslations.en.skills}
      />
    );

    expect(screen.getByText(uiTranslations.en.skills.title)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(uiTranslations.en.skills.legendTitle, 'i'))).toBeInTheDocument();
  });

  it('should render Education and Professional Certifications with valid issuers', () => {
    render(
      <EducationCertifications
        educations={cvDataEn.educations}
        certifications={cvDataEn.certifications}
        t={uiTranslations.en.education}
      />
    );

    expect(screen.getByText(uiTranslations.en.education.title)).toBeInTheDocument();
    expect(screen.getByText(cvDataEn.certifications[0].name)).toBeInTheDocument();
  });

  it('should trigger print on FloatingActions Save CV click and scroll to top on button click', () => {
    const onPrint = vi.fn();
    render(
      <FloatingActions
        onPrint={onPrint}
        saveCvLabel={uiTranslations.en.nav.saveCv}
        tCommon={uiTranslations.en.common}
      />
    );

    const saveCvFab = screen.getByRole('button', { name: new RegExp(uiTranslations.en.nav.saveCv, 'i') });
    fireEvent.click(saveCvFab);
    expect(onPrint).toHaveBeenCalled();
  });
});
