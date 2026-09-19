import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Projects } from '../../src/components/Projects';
import { cvDataEn, uiTranslations } from '../../src/data/cvData';

describe('TI-04: Integration - Architectural Projects & Modal Case Study', () => {
  const defaultProps = {
    projects: cvDataEn.projects,
    t: uiTranslations.en.projects,
    tCommon: uiTranslations.en.common,
  };

  it('should render project view tabs and all project cards initially', () => {
    render(<Projects {...defaultProps} />);

    expect(screen.getByRole('button', { name: new RegExp(uiTranslations.en.projects.allWorks, 'i') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(uiTranslations.en.projects.caseStudies, 'i') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(uiTranslations.en.projects.githubRepos, 'i') })).toBeInTheDocument();
  });

  it('should open architecture case study modal on card interaction and lock scroll', () => {
    render(<Projects {...defaultProps} />);

    const caseStudyButtons = screen.getAllByRole('button', { name: new RegExp(uiTranslations.en.projects.viewArchitecture, 'i') });
    expect(caseStudyButtons.length).toBeGreaterThan(0);

    fireEvent.click(caseStudyButtons[0]);

    // Modal dialog should now be present in DOM
    const modalBackdrop = document.querySelector('.blog-modal-backdrop');
    expect(modalBackdrop).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    // Should display architecture sections
    expect(screen.getByText(uiTranslations.en.projects.objective)).toBeInTheDocument();
  });

  it('should close modal on Escape key press and restore body scroll', () => {
    render(<Projects {...defaultProps} />);

    const caseStudyButtons = screen.getAllByRole('button', { name: new RegExp(uiTranslations.en.projects.viewArchitecture, 'i') });
    fireEvent.click(caseStudyButtons[0]);

    expect(document.querySelector('.blog-modal-backdrop')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(document.querySelector('.blog-modal-backdrop')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('should close modal when clicking the close button', () => {
    render(<Projects {...defaultProps} />);

    const caseStudyButtons = screen.getAllByRole('button', { name: new RegExp(uiTranslations.en.projects.viewArchitecture, 'i') });
    fireEvent.click(caseStudyButtons[0]);

    const closeBtn = screen.getByLabelText(/close project details/i);
    fireEvent.click(closeBtn);

    expect(document.querySelector('.blog-modal-backdrop')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });
});
