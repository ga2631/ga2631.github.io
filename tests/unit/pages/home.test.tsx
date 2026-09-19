import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Home } from '../../../src/pages/Home';
import { cvDataEn, uiTranslations } from '../../../src/data/cvData';

describe('Home Page Component', () => {
  it('renders all main portfolio sections (Hero, About, Experience, Projects, Skills, Education, Contact)', () => {
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
    expect(screen.getByText(uiTranslations.en.footer.allRightsReserved)).toBeInTheDocument();
  });
});
