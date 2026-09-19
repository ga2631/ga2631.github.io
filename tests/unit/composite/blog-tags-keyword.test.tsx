import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BlogTagsKeyword } from '../../../src/components/composite/BlogTagsKeyword';

describe('TU-COMPOSITE-12: Composite - BlogTagsKeyword Component', () => {
  const tags = ['React', 'TypeScript', 'Docker'];
  const tagCounts = { React: 5, TypeScript: 8, Docker: 3 };

  it('renders tag pills and handles tag selection', () => {
    const handleSelectTag = vi.fn();

    render(
      <BlogTagsKeyword
        tags={tags}
        selectedTag="all"
        tagCounts={tagCounts}
        totalPostsCount={16}
        allTopicsLabel="All Topics"
        title="Tags & Keywords"
        onSelectTag={handleSelectTag}
      />
    );

    expect(screen.getByText('Tags & Keywords')).toBeInTheDocument();
    expect(screen.getByText('All Topics')).toBeInTheDocument();
    expect(screen.getByText('#React')).toBeInTheDocument();
    expect(screen.getByText('#TypeScript')).toBeInTheDocument();

    // Click on #React tag
    fireEvent.click(screen.getByText('#React'));
    expect(handleSelectTag).toHaveBeenCalledWith('React');
  });
});
