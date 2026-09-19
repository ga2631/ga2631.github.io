import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionHeader } from '../../../src/components/composite/SectionHeader';

describe('TU-COMPOSITE-01: Composite - SectionHeader Component', () => {
  it('renders section title, subtitle, and section badge', () => {
    render(
      <SectionHeader
        badge="Projects"
        title="Featured Work"
        subtitle="Selected case studies and open-source contributions"
      />
    );

    expect(screen.getByText('Projects')).toHaveClass('section-badge');
    expect(screen.getByRole('heading', { level: 2, name: 'Featured Work' })).toBeInTheDocument();
    expect(screen.getByText('Selected case studies and open-source contributions')).toBeInTheDocument();
  });

  it('renders with custom alignment and extra actions slot', () => {
    const { container } = render(
      <SectionHeader
        title="Experience"
        align="left"
        extra={<button type="button">Filter</button>}
      />
    );

    const header = container.querySelector('.section-header') as HTMLElement;
    expect(header).toBeInTheDocument();
    expect(header.style.textAlign).toBe('left');
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
  });

  it('renders custom badgeWrapper when provided', () => {
    render(
      <SectionHeader
        title="Custom Header"
        badgeWrapper={<div data-testid="custom-badge-wrapper">Custom Badge</div>}
      />
    );

    expect(screen.getByTestId('custom-badge-wrapper')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Custom Header' })).toBeInTheDocument();
  });
});
