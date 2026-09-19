import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Section } from '../../../src/components/ui/Section';

describe('TU-UI-01: UI - Section Component', () => {
  it('renders section container with id, header, and children', () => {
    const { container } = render(
      <Section
        id="test-section"
        badge="Projects"
        title="Featured Work"
        subtitle="Selected case studies"
      >
        <div data-testid="section-content">Section Body Content</div>
      </Section>
    );

    const sectionEl = container.querySelector('#test-section') as HTMLElement;
    expect(sectionEl).toBeInTheDocument();
    expect(sectionEl).toHaveClass('section');

    const containerEl = sectionEl.querySelector('.container');
    expect(containerEl).toBeInTheDocument();

    expect(screen.getByText('Projects')).toHaveClass('section-badge');
    expect(screen.getByRole('heading', { level: 2, name: 'Featured Work' })).toBeInTheDocument();
    expect(screen.getByText('Selected case studies')).toBeInTheDocument();
    expect(screen.getByTestId('section-content')).toBeInTheDocument();
  });

  it('supports alignment, extra actions slot, and custom container class', () => {
    const { container } = render(
      <Section
        id="custom-sec"
        title="Custom Header"
        align="left"
        containerClassName="custom-container"
        extra={<button type="button">Extra Action</button>}
      >
        <p>Content</p>
      </Section>
    );

    const header = container.querySelector('.section-header') as HTMLElement;
    expect(header).toBeInTheDocument();
    expect(header.style.textAlign).toBe('left');
    expect(screen.getByRole('button', { name: 'Extra Action' })).toBeInTheDocument();
    expect(container.querySelector('.custom-container')).toBeInTheDocument();
  });

  it('supports Section.Header compound component', () => {
    render(
      <Section id="compound-sec">
        <Section.Header
          badge="Compound Badge"
          title="Compound Section Title"
          subtitle="Compound Subtitle"
        />
        <p>Body Paragraph</p>
      </Section>
    );

    expect(screen.getByText('Compound Badge')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Compound Section Title' })).toBeInTheDocument();
    expect(screen.getByText('Compound Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Body Paragraph')).toBeInTheDocument();
  });
});
