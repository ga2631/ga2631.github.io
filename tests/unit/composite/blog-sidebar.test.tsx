import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BlogSidebar } from '../../../src/components/composite/BlogSidebar';
import { BLOG_CATEGORY_DEFINITIONS } from '../../../src/data/blog/blogCategories';

describe('TU-COMPOSITE-13: Composite - BlogSidebar Component', () => {
  const categoryCounts = { all: 20 };
  const tags = ['Architecture', 'CleanCode'];
  const tagCounts = { Architecture: 4, CleanCode: 3 };

  it('renders sidebar with close button, topics and tag cloud', () => {
    const handleClose = vi.fn();
    const handleSelectCategory = vi.fn();
    const handleSelectTag = vi.fn();

    render(
      <BlogSidebar
        isMobileOpen={true}
        onCloseMobile={handleClose}
        categories={BLOG_CATEGORY_DEFINITIONS}
        selectedCategory="all"
        categoryCounts={categoryCounts}
        categoriesTitle="Chuyên đề"
        onSelectCategory={handleSelectCategory}
        tags={tags}
        selectedTag="all"
        tagCounts={tagCounts}
        totalPostsCount={20}
        allTopicsLabel="Tất cả chủ đề"
        tagsTitle="Thẻ công nghệ"
        onSelectTag={handleSelectTag}
        langKey="vi"
      />
    );

    // Sidebar has mobile open class
    const aside = document.querySelector('aside.blog-sidebar');
    expect(aside).toHaveClass('mobile-open');

    // Close button triggers close callback
    const closeBtn = screen.getByLabelText(/close sidebar/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();

    // Contains topics & mobile header
    expect(screen.getAllByText('Chuyên đề').length).toBeGreaterThan(0);
    // Contains tags
    expect(screen.getByText('Thẻ công nghệ')).toBeInTheDocument();
  });
});
