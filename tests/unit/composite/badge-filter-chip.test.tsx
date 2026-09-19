import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BadgeFilterChip } from '../../../src/components/composite/BadgeFilterChip';

describe('TU-COMPOSITE-06: Composite - BadgeFilterChip Component', () => {
  it('renders filter chip with key and value', () => {
    render(
      <BadgeFilterChip chipKey="Tag" chipValue="Architecture" onRemove={vi.fn()} />
    );

    expect(screen.getByText('Tag:')).toBeInTheDocument();
    expect(screen.getByText('Architecture')).toBeInTheDocument();
  });

  it('renders children as value when chipValue is not explicitly provided', () => {
    render(
      <BadgeFilterChip chipKey="Category" onRemove={vi.fn()}>
        DevOps
      </BadgeFilterChip>
    );

    expect(screen.getByText('Category:')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
  });

  it('calls onRemove when the remove button is clicked', () => {
    const handleRemove = vi.fn();
    render(
      <BadgeFilterChip
        chipKey="Search"
        chipValue="TypeScript"
        onRemove={handleRemove}
        removeAriaLabel="Clear TypeScript query"
      />
    );

    const removeBtn = screen.getByLabelText('Clear TypeScript query');
    expect(removeBtn).toBeInTheDocument();

    fireEvent.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
});
