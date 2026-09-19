import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModalCaseStudy } from '../../../src/components/composite/ModalCaseStudy';
import { ProjectItem } from '../../../src/types';

describe('TU-COMPOSITE-08: Composite - ModalCaseStudy Component', () => {
  const mockProject: ProjectItem = {
    id: 'erp-medallion',
    title: 'ERP Data Infrastructure Migration',
    category: 'Data / AI',
    company: 'Enterprise JSC',
    role: 'System Architect',
    period: '2023 - Present',
    featured: true,
    teamSize: '8 Engineers',
    shortDescription: 'Migrated legacy ERP to Medallion Data Warehouse.',
    description: 'Detailed objective for migration and architecture.',
    responsibilities: ['Architected Bronze-Silver-Gold pipeline', 'Integrated CDC MySQL binlogs'],
    challengesSolutions: [
      {
        challenge: 'High latency on CDC',
        solution: 'Partitioned RabbitMQ topics with parallel consumer workers',
      },
    ],
    achievements: ['Reduced query latency by 85%', 'Zero data loss over 10M events'],
    tags: ['MySQL', 'RabbitMQ', 'ClickHouse', 'Docker'],
  };

  const mockT = {
    featuredProject: 'Featured Project',
    team: 'Team',
    objective: 'Objective',
    responsibilities: 'Responsibilities',
    challengesSolutions: 'Challenges & Solutions',
    challengeLabel: 'Challenge',
    solutionLabel: 'Solution',
    achievements: 'Achievements',
    techStack: 'Tech Stack',
  };

  it('renders case study dialog with all detailed architecture sections', () => {
    const handleClose = vi.fn();
    render(
      <ModalCaseStudy
        project={mockProject}
        isOpen={true}
        onClose={handleClose}
        t={mockT}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('ERP Data Infrastructure Migration')).toBeInTheDocument();
    expect(screen.getByText('Enterprise JSC - System Architect')).toBeInTheDocument();
    expect(screen.getByText('Featured Project')).toBeInTheDocument();
    expect(screen.getByText('Team: 8 Engineers')).toBeInTheDocument();
    expect(screen.getByText('Objective')).toBeInTheDocument();
    expect(screen.getByText('Responsibilities')).toBeInTheDocument();
    expect(screen.getByText('Challenges & Solutions')).toBeInTheDocument();
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
    expect(screen.getByText('ClickHouse')).toBeInTheDocument();
  });

  it('handles close button trigger and escape key dismiss', () => {
    const handleClose = vi.fn();
    render(
      <ModalCaseStudy
        project={mockProject}
        isOpen={true}
        onClose={handleClose}
        t={mockT}
        closeAriaLabel="Close Project Details"
      />
    );

    const closeBtn = screen.getByLabelText('Close Project Details');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('does not render when project is null', () => {
    const { container } = render(
      <ModalCaseStudy
        project={null}
        isOpen={true}
        onClose={vi.fn()}
        t={mockT}
      />
    );

    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
