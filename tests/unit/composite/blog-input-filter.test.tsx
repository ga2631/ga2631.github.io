import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BlogInputFilter } from '../../../src/components/composite/BlogInputFilter';

describe('TU-COMPOSITE-14: Composite - BlogInputFilter Component', () => {
  it('renders search input and active filter chips with remove triggers', () => {
    const handleSearchChange = vi.fn();
    const handleClearCategory = vi.fn();
    const handleClearTag = vi.fn();
    const handleResetAll = vi.fn();

    render(
      <BlogInputFilter
        searchQuery="GraphQL"
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search articles..."
        selectedCategory="architecture-system-design"
        selectedCategoryTitle="Architecture & System Design"
        onClearCategory={handleClearCategory}
        selectedTag="Microservices"
        onClearTag={handleClearTag}
        onResetAll={handleResetAll}
        isStuck={true}
        activeFiltersLabel="Active Filters:"
        categoryFilterLabel="Category"
        tagFilterLabel="Tag"
        resetLabel="Reset All"
      />
    );

    // Panel has stuck state
    const panel = document.querySelector('.blog-controls-panel');
    expect(panel).toHaveClass('is-stuck');

    // Search input value
    const searchInput = screen.getByPlaceholderText('Search articles...');
    expect(searchInput).toHaveValue('GraphQL');

    // Filter chips
    expect(screen.getByText('Architecture & System Design')).toBeInTheDocument();
    expect(screen.getByText('#Microservices')).toBeInTheDocument();
    expect(screen.getByText('"GraphQL"')).toBeInTheDocument();

    // Remove category chip
    const removeCategoryBtn = screen.getByLabelText(/remove category filter/i);
    fireEvent.click(removeCategoryBtn);
    expect(handleClearCategory).toHaveBeenCalled();

    // Reset button
    const resetBtn = screen.getByRole('button', { name: /reset all/i });
    fireEvent.click(resetBtn);
    expect(handleResetAll).toHaveBeenCalled();
  });
});
