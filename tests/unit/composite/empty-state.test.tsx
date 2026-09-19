import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from '../../../src/components/composite/EmptyState';

describe('TU-COMPOSITE-03: Composite - EmptyState Component', () => {
  it('renders icon, title, and description in glass card container', () => {
    const { container } = render(
      <EmptyState
        icon={<span data-testid="empty-icon">📂</span>}
        title="No articles found"
        description="Try adjusting your search query or active filters."
      />
    );

    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'No articles found' })).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search query or active filters.')).toBeInTheDocument();

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('glass-panel');
  });

  it('renders action button and triggers onAction callback on click', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No results"
        actionText="Clear all filters"
        onAction={handleAction}
      />
    );

    const button = screen.getByRole('button', { name: 'Clear all filters' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders custom action node when provided', () => {
    render(
      <EmptyState
        title="No items"
        action={<a href="/browse">Browse all</a>}
      />
    );

    expect(screen.getByRole('link', { name: 'Browse all' })).toBeInTheDocument();
  });
});
