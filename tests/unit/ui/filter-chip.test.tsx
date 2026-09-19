import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterChip } from '../../../src/components/ui/FilterChip';

describe('Tier 2: FilterChip Component', () => {
  it('renders filter chip with key and value', () => {
    render(
      <FilterChip chipKey="Tag" chipValue="Architecture" onRemove={vi.fn()} />
    );

    expect(screen.getByText('Tag:')).toBeInTheDocument();
    expect(screen.getByText('Architecture')).toBeInTheDocument();
  });

  it('renders children as value when chipValue is not explicitly provided', () => {
    render(
      <FilterChip chipKey="Category" onRemove={vi.fn()}>
        DevOps
      </FilterChip>
    );

    expect(screen.getByText('Category:')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
  });

  it('calls onRemove when the remove button is clicked', () => {
    const handleRemove = vi.fn();
    render(
      <FilterChip
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
