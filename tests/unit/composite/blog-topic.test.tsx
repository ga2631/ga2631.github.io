import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BlogTopic } from '../../../src/components/composite/BlogTopic';
import { BLOG_CATEGORY_DEFINITIONS } from '../../../src/data/blog/blogCategories';

describe('TU-COMPOSITE-11: Composite - BlogTopic Component', () => {
  const categoryCounts = {
    all: 25,
    'architecture-system-design': 5,
    'data-engineering-analytics': 4,
  };

  it('renders all categories and triggers selection callback', () => {
    const handleSelect = vi.fn();
    const handleHover = vi.fn();

    render(
      <BlogTopic
        categories={BLOG_CATEGORY_DEFINITIONS}
        selectedCategory="all"
        categoryCounts={categoryCounts}
        langKey="en"
        title="Category Tracks"
        onSelectCategory={handleSelect}
        onHoverCategory={handleHover}
      />
    );

    expect(screen.getByText('Category Tracks')).toBeInTheDocument();
    expect(screen.getByText('All Topics')).toBeInTheDocument();
    expect(screen.getByText('Architecture & System Design')).toBeInTheDocument();

    // Click on Architecture track
    const archBtn = screen.getByRole('button', { name: /Architecture & System Design/i });
    fireEvent.click(archBtn);
    expect(handleSelect).toHaveBeenCalledWith('architecture-system-design');

    // Hover triggers callback
    fireEvent.mouseEnter(archBtn);
    expect(handleHover).toHaveBeenCalled();
  });
});
