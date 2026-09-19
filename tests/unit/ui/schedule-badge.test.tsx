import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScheduleBadge } from '../../../src/components/ui/ScheduleBadge';

describe('Tier 2: ScheduleBadge Component', () => {
  it('renders schedule badge with day code class', () => {
    render(<ScheduleBadge dayCode="MON">Monday • Tech Deep Dive</ScheduleBadge>);

    const badge = screen.getByText(/monday • tech deep dive/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('schedule-day-badge', 'badge-mon');
  });

  it('renders icon and custom children correctly', () => {
    render(
      <ScheduleBadge
        dayCode="FRI"
        icon={<span data-testid="cal-icon">📅</span>}
      >
        Friday • Systems
      </ScheduleBadge>
    );

    expect(screen.getByTestId('cal-icon')).toBeInTheDocument();
    const badge = screen.getByText(/friday • systems/i);
    expect(badge).toHaveClass('schedule-day-badge', 'badge-fri');
  });
});
