import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PrintCV } from '../../src/components/PrintCV';
import { cvDataEn, uiTranslations } from '../../src/data/cvData';

describe('TS-13: Print CV ATS 2-Page Structure Integration', () => {
  const defaultProps = {
    data: cvDataEn,
    t: uiTranslations.en.printCv,
  };

  it('should render the dedicated print CV container with Page 1 and Page 2 partitions', () => {
    const { container } = render(<PrintCV {...defaultProps} />);

    const printDoc = container.querySelector('.print-cv-document');
    expect(printDoc).toBeInTheDocument();

    const page1 = container.querySelector('.print-page-1');
    const page2 = container.querySelector('.print-page-2');

    expect(page1).toBeInTheDocument();
    expect(page2).toBeInTheDocument();
  });

  it('should structure Page 1 with Header, Summary, Core Skills, and Experience entries', () => {
    const { container } = render(<PrintCV {...defaultProps} />);
    const page1 = container.querySelector('.print-page-1')!;

    // Header & Name
    expect(page1.querySelector('.print-name')).toHaveTextContent(cvDataEn.personalInfo.fullName.toUpperCase());
    expect(page1.querySelector('.print-title')).toHaveTextContent(cvDataEn.personalInfo.jobTitle.toUpperCase());

    // Experience items on Page 1
    const expItems = page1.querySelectorAll('.print-exp-item');
    expect(expItems.length).toBe(cvDataEn.experiences.length);
  });

  it('should structure Page 2 with Architecture Projects and Education/Certifications', () => {
    const { container } = render(<PrintCV {...defaultProps} />);
    const page2 = container.querySelector('.print-page-2')!;

    // Projects on Page 2
    const projItems = page2.querySelectorAll('.print-proj-item');
    expect(projItems.length).toBe(Math.min(3, cvDataEn.projects.length));

    // Education & Certifications
    const eduItems = page2.querySelectorAll('.print-edu-item');
    const certItems = page2.querySelectorAll('.print-cert-item');
    expect(eduItems.length).toBe(cvDataEn.educations.length);
    expect(certItems.length).toBe(cvDataEn.certifications.length);
  });
});
