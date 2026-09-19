import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ButtonPrint } from '../../../src/components/composite/ButtonPrint';

describe('TU-COMPOSITE-05: Composite - ButtonPrint Component', () => {
  const mockTCommon = {
    scrollToTop: 'Scroll to top',
    exportPdf: 'Export PDF',
  } as any;

  beforeEach(() => {
    window.print = vi.fn();
  });

  describe('Default variant (standard button for sidebar/drawer)', () => {
    it('renders as standard button with default label and primary variant', () => {
      render(
        <ButtonPrint
          tCommon={mockTCommon}
        />
      );

      const button = screen.getByRole('button', { name: /export pdf/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn-primary');
    });

    it('renders custom label and custom buttonVariant', () => {
      render(
        <ButtonPrint
          buttonVariant="secondary"
          label="Save Resume (PDF)"
        />
      );

      const button = screen.getByRole('button', { name: /save resume \(pdf\)/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn-secondary');
    });

    it('triggers onPrint handler when clicked', () => {
      const handlePrint = vi.fn();
      render(
        <ButtonPrint
          label="Save CV"
          onPrint={handlePrint}
        />
      );

      const button = screen.getByRole('button', { name: /save cv/i });
      fireEvent.click(button);
      expect(handlePrint).toHaveBeenCalledTimes(1);
    });

    it('falls back to window.print if onPrint is not provided', () => {
      render(
        <ButtonPrint
          label="Download"
        />
      );

      const button = screen.getByRole('button', { name: /download/i });
      fireEvent.click(button);
      expect(window.print).toHaveBeenCalledTimes(1);
    });
  });

  describe('Floating variant (FAB for bottom-right quick actions)', () => {
    it('renders as ButtonFloating with floating styles and accessibility attributes', () => {
      render(
        <ButtonPrint
          variant="floating"
          label="Save CV"
          tCommon={mockTCommon}
        />
      );

      const fab = screen.getByRole('button', { name: /save cv/i });
      expect(fab).toBeInTheDocument();
      expect(fab).toHaveClass('floating-btn');
      expect(fab).toHaveClass('floating-btn-primary');
      expect(fab).toHaveAttribute('id', 'floating-save-cv-btn');
    });

    it('triggers onPrint callback on floating button click', () => {
      const handlePrint = vi.fn();
      render(
        <ButtonPrint
          variant="floating"
          label="Save CV"
          onPrint={handlePrint}
        />
      );

      const fab = screen.getByRole('button', { name: /save cv/i });
      fireEvent.click(fab);
      expect(handlePrint).toHaveBeenCalledTimes(1);
    });
  });

  describe('Print CV Document Rendering (ATS 2-Page Document)', () => {
    const mockData: any = {
      personalInfo: {
        fullName: 'Tan Huynh Nhat',
        jobTitle: 'Senior Full Stack & AI Engineer',
        location: 'Ho Chi Minh City, Vietnam',
        bio: 'Passionate software engineer.',
        linkedinUrl: 'https://linkedin.com/in/tan-huynh',
      },
      experiences: [
        {
          id: 'exp-1',
          role: 'Lead Architect',
          company: 'Tech Corp',
          period: '2022 - Present',
          location: 'HCMC',
          achievements: ['Architected cloud infrastructure'],
          technologies: ['React', 'TypeScript', 'Node.js'],
        },
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'AI Platform',
          role: 'Architect',
          company: 'Tech Corp',
          description: 'Platform for LLMs',
          achievements: ['Delivered sub-100ms inference'],
          tags: ['Python', 'Docker'],
        },
      ],
      skillCategories: [
        {
          title: 'Frontend',
          skills: [{ name: 'React' }, { name: 'TypeScript' }],
        },
      ],
      educations: [
        {
          id: 'edu-1',
          degree: 'Bachelor of Software Engineering',
          institution: 'University of Science',
          period: '2016 - 2020',
          gpaOrHonors: 'GPA: 3.8/4.0',
        },
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Solutions Architect',
          issuer: 'Amazon Web Services',
          issueDate: '2023',
          status: 'Active',
        },
      ],
    };

    const mockTPrintCv: any = {
      summaryHeading: 'PROFESSIONAL SUMMARY',
      skillsHeading: 'CORE TECHNICAL COMPETENCIES',
      experienceHeading: 'PROFESSIONAL EXPERIENCE',
      technologies: 'Technologies & Tools:',
      projectsHeading: 'KEY ENTERPRISE PROJECTS & ARCHITECTURE CASE STUDIES',
      keyTechnologies: 'Key Technologies:',
      educationHeading: 'EDUCATION & CERTIFICATIONS',
      academicBackground: 'Academic Background:',
      certificationsAndBadges: 'Certifications & Badges:',
    };

    it('renders the dedicated print CV container when data and tPrintCv are provided', () => {
      const { container } = render(
        <ButtonPrint
          data={mockData}
          tPrintCv={mockTPrintCv}
          label="Save CV"
        />
      );

      const printDoc = container.querySelector('.print-cv-document');
      expect(printDoc).toBeInTheDocument();
      expect(container.querySelector('.print-page-1')).toBeInTheDocument();
      expect(container.querySelector('.print-page-2')).toBeInTheDocument();

      expect(container.querySelector('.print-name')).toHaveTextContent('TAN HUYNH NHAT');
      expect(container.querySelector('.print-title')).toHaveTextContent('SENIOR FULL STACK & AI ENGINEER');
    });
  });
});
