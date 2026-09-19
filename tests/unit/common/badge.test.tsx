import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Badge } from '../../../src/components/common/Badge';

describe('TU-COMMON-02: Common - Badge Component', () => {
  it('renders default badge span element', () => {
    render(<Badge>Frontend</Badge>);
    const badge = screen.getByText('Frontend');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge');
    expect(badge.tagName.toLowerCase()).toBe('span');
  });

  it('renders color status variants (emerald, purple, cyan, rose, amber)', () => {
    const { rerender } = render(<Badge variant="emerald">Live</Badge>);
    expect(screen.getByText('Live')).toHaveClass('badge', 'badge-emerald');

    rerender(<Badge variant="purple">Architecture</Badge>);
    expect(screen.getByText('Architecture')).toHaveClass('badge', 'badge-purple');

    rerender(<Badge variant="cyan">Active</Badge>);
    expect(screen.getByText('Active')).toHaveClass('badge', 'badge-cyan');

    rerender(<Badge variant="rose">Deprecated</Badge>);
    expect(screen.getByText('Deprecated')).toHaveClass('badge', 'badge-rose');

    rerender(<Badge variant="amber">Pending</Badge>);
    expect(screen.getByText('Pending')).toHaveClass('badge', 'badge-amber');
  });

  it('renders section badge variant', () => {
    render(<Badge variant="section">About Me</Badge>);
    const sectionBadge = screen.getByText('About Me');
    expect(sectionBadge).toHaveClass('section-badge');
  });

  it('renders tag-pill variant with count and active class', () => {
    const handleClick = vi.fn();
    const { rerender } = render(
      <Badge variant="tag-pill" count={5} isActive onClick={handleClick}>
        React
      </Badge>
    );

    const buttonPill = screen.getByRole('button');
    expect(buttonPill).toHaveClass('sidebar-tag-pill', 'active');
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    fireEvent.click(buttonPill);
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(
      <Badge variant="tag-pill" count={0}>
        TypeScript
      </Badge>
    );
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders filter-chip variant with chipKey and removable action', () => {
    const handleRemove = vi.fn();
    render(
      <Badge
        variant="filter-chip"
        chipKey="Tag"
        removable
        onRemove={handleRemove}
        removeAriaLabel="Remove Tag filter"
      >
        React
      </Badge>
    );

    expect(screen.getByText('Tag:')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();

    const removeBtn = screen.getByLabelText('Remove Tag filter');
    expect(removeBtn).toBeInTheDocument();

    fireEvent.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('renders unstyled badge variant with custom class', () => {
    render(
      <Badge variant="unstyled" className="my-custom-badge">
        Custom
      </Badge>
    );
    const custom = screen.getByText('Custom');
    expect(custom).toHaveClass('my-custom-badge');
    expect(custom).not.toHaveClass('badge');
  });
});
