import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Home } from '../../../src/pages/Home';
import { cvDataEn, uiTranslations } from '../../../src/data/cvData';

describe('TU-PAGES-01: Pages - Home Component', () => {
  it('renders all main portfolio sections (Hero, About, Experience, Projects, Skills, Education, Contact, Footer)', () => {
    render(<Home data={cvDataEn} t={uiTranslations.en} />);

    // Hero greeting / title
    expect(screen.getByText(uiTranslations.en.hero.viewProjects)).toBeInTheDocument();

    // About
    expect(screen.getByText(uiTranslations.en.about.title)).toBeInTheDocument();

    // Experience
    expect(screen.getByText(uiTranslations.en.experience.title)).toBeInTheDocument();

    // Projects
    expect(screen.getByText(uiTranslations.en.projects.title)).toBeInTheDocument();

    // Skills
    expect(screen.getByText(uiTranslations.en.skills.title)).toBeInTheDocument();

    // Education
    expect(screen.getByText(uiTranslations.en.education.title)).toBeInTheDocument();

    // Contact
    expect(screen.getByText(uiTranslations.en.contact.title)).toBeInTheDocument();

    // Footer
    expect(screen.getByText(new RegExp(uiTranslations.en.footer.allRightsReserved, 'i'))).toBeInTheDocument();
  });

  it('renders ButtonPrint floating button and print document within Home page', () => {
    const { container } = render(<Home data={cvDataEn} t={uiTranslations.en} />);

    // Floating action container has ButtonPrint
    const floatingBtn = container.querySelector('#floating-save-cv-btn');
    expect(floatingBtn).toBeInTheDocument();
    expect(floatingBtn).toHaveTextContent(uiTranslations.en.nav.saveCv);

    // Dedicated Print CV Document is rendered with Page 1 and Page 2
    const printDoc = container.querySelector('.print-cv-document');
    expect(printDoc).toBeInTheDocument();

    const page1 = container.querySelector('.print-page-1');
    const page2 = container.querySelector('.print-page-2');
    expect(page1).toBeInTheDocument();
    expect(page2).toBeInTheDocument();

    expect(page1?.querySelector('.print-name')).toHaveTextContent(cvDataEn.personalInfo.fullName.toUpperCase());
    expect(page1?.querySelector('.print-title')).toHaveTextContent(cvDataEn.personalInfo.jobTitle.toUpperCase());
  });
});
