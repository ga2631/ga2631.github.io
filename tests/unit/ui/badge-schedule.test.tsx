import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BadgeSchedule } from '../../../src/components/ui/BadgeSchedule';

describe('Tier 2: BadgeSchedule Component', () => {
  it('renders schedule badge with day code class', () => {
    render(<BadgeSchedule dayCode="MON">Monday • Tech Deep Dive</BadgeSchedule>);

    const badge = screen.getByText(/monday • tech deep dive/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('schedule-day-badge', 'badge-mon');
  });

  it('renders icon and custom children correctly', () => {
    render(
      <BadgeSchedule
        dayCode="FRI"
        icon={<span data-testid="cal-icon">📅</span>}
      >
        Friday • Systems
      </BadgeSchedule>
    );

    expect(screen.getByTestId('cal-icon')).toBeInTheDocument();
    const badge = screen.getByText(/friday • systems/i);
    expect(badge).toHaveClass('schedule-day-badge', 'badge-fri');
  });
});
