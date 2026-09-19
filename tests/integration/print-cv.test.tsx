import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { ButtonPrint } from '../../src/components/composite/ButtonPrint';
import { App } from '../../src/App';
import { cvDataEn, cvDataVi, uiTranslations } from '../../src/data/cvData';

describe('TS-13: Print CV ATS 2-Page Structure & Cross-Device 100% Parity Integration', () => {
  beforeEach(() => {
    window.innerWidth = 1024;
    window.innerHeight = 768;
  });

  const defaultProps = {
    data: cvDataEn,
    tPrintCv: uiTranslations.en.printCv,
  };

  it('should render the dedicated print CV container with Page 1 and Page 2 partitions', () => {
    const { container } = render(<ButtonPrint {...defaultProps} />);

    const printDoc = container.querySelector('.print-cv-document');
    expect(printDoc).toBeInTheDocument();

    const page1 = container.querySelector('.print-page-1');
    const page2 = container.querySelector('.print-page-2');

    expect(page1).toBeInTheDocument();
    expect(page2).toBeInTheDocument();
  });

  it('should structure Page 1 with Header, Summary, Core Skills, and Experience entries', () => {
    const { container } = render(<ButtonPrint {...defaultProps} />);
    const page1 = container.querySelector('.print-page-1')!;

    // Header & Name
    expect(page1.querySelector('.print-name')).toHaveTextContent(cvDataEn.personalInfo.fullName.toUpperCase());
    expect(page1.querySelector('.print-title')).toHaveTextContent(cvDataEn.personalInfo.jobTitle.toUpperCase());

    // Experience items on Page 1
    const expItems = page1.querySelectorAll('.print-exp-item');
    expect(expItems.length).toBe(cvDataEn.experiences.length);
  });

  it('should structure Page 2 with Architecture Projects and Education/Certifications', () => {
    const { container } = render(<ButtonPrint {...defaultProps} />);
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

  /* ==========================================================================
     CROSS-DEVICE EMULATION: 100% PARITY TESTS (MOBILE / TABLET vs DESKTOP)
     ========================================================================== */

  it('should produce 100% identical DOM hierarchy, element counts, and innerHTML across Mobile (375px), Tablet (768px), and Desktop (1440px) viewports', () => {
    // 1. Render in Desktop Viewport (1440px)
    window.innerWidth = 1440;
    window.innerHeight = 900;
    const { container: desktopContainer } = render(<ButtonPrint data={cvDataEn} tPrintCv={uiTranslations.en.printCv} />);
    const desktopDoc = desktopContainer.querySelector('.print-cv-document')!;
    const desktopHtml = desktopDoc.innerHTML;
    const desktopElementCount = desktopDoc.querySelectorAll('*').length;

    // 2. Render in Tablet Viewport (768px - iPad Mini / iPad Air)
    window.innerWidth = 768;
    window.innerHeight = 1024;
    const { container: tabletContainer } = render(<ButtonPrint data={cvDataEn} tPrintCv={uiTranslations.en.printCv} />);
    const tabletDoc = tabletContainer.querySelector('.print-cv-document')!;
    const tabletHtml = tabletDoc.innerHTML;
    const tabletElementCount = tabletDoc.querySelectorAll('*').length;

    // 3. Render in Mobile Viewport (375px - iPhone SE / Standard Mobile)
    window.innerWidth = 375;
    window.innerHeight = 667;
    const { container: mobileContainer } = render(<ButtonPrint data={cvDataEn} tPrintCv={uiTranslations.en.printCv} />);
    const mobileDoc = mobileContainer.querySelector('.print-cv-document')!;
    const mobileHtml = mobileDoc.innerHTML;
    const mobileElementCount = mobileDoc.querySelectorAll('*').length;

    // Assert 100% Identity between Tablet and Desktop
    expect(tabletElementCount).toBe(desktopElementCount);
    expect(tabletHtml).toBe(desktopHtml);

    // Assert 100% Identity between Mobile and Desktop
    expect(mobileElementCount).toBe(desktopElementCount);
    expect(mobileHtml).toBe(desktopHtml);
  });

  it('should produce 100% identical print document structure across viewports in Vietnamese (VI) locale', () => {
    // Desktop VI
    window.innerWidth = 1440;
    const { container: desktopViContainer } = render(<ButtonPrint data={cvDataVi} tPrintCv={uiTranslations.vi.printCv} />);
    const desktopViHtml = desktopViContainer.querySelector('.print-cv-document')!.innerHTML;

    // Mobile VI
    window.innerWidth = 375;
    const { container: mobileViContainer } = render(<ButtonPrint data={cvDataVi} tPrintCv={uiTranslations.vi.printCv} />);
    const mobileViHtml = mobileViContainer.querySelector('.print-cv-document')!.innerHTML;

    // Tablet VI
    window.innerWidth = 768;
    const { container: tabletViContainer } = render(<ButtonPrint data={cvDataVi} tPrintCv={uiTranslations.vi.printCv} />);
    const tabletViHtml = tabletViContainer.querySelector('.print-cv-document')!.innerHTML;

    expect(mobileViHtml).toBe(desktopViHtml);
    expect(tabletViHtml).toBe(desktopViHtml);
  });

  it('should ensure ButtonPrint renders print document in App', () => {
    const { container } = render(<App />);

    const appRoot = container.querySelector('.app-root')!;
    const printDoc = container.querySelector('.print-cv-document')!;

    expect(appRoot).toContainElement(printDoc);
  });

  it('should verify responsive stylesheets enforce @media screen isolation to prevent mobile style leakage to print', () => {
    const responsiveScssPath = path.resolve(__dirname, '../../src/styles/responsive/_responsive.scss');
    const scssContent = fs.readFileSync(responsiveScssPath, 'utf-8');

    // Find all @media declarations
    const mediaDeclarations = scssContent.match(/@media[^{]+/g) || [];
    expect(mediaDeclarations.length).toBeGreaterThan(0);

    // Every responsive @media declaration MUST include 'screen and' to prevent print style leakage
    mediaDeclarations.forEach((decl) => {
      expect(decl.toLowerCase()).toContain('screen and');
    });
  });
});
