import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Blog } from '../../../src/pages/Blog';
import { blogPostsEn } from '../../../src/data/blogData';
import { uiTranslations } from '../../../src/data/cvData';

describe('TU-PAGES-02: Pages - Blog Page Component', () => {
  it('renders the Blog page with header, search input, and category tracks', () => {
    render(
      <Blog
        posts={blogPostsEn}
        t={uiTranslations.en.blog}
        tCommon={uiTranslations.en.common}
      />
    );

    // Title & subtitle
    expect(screen.getByRole('heading', { level: 1, name: uiTranslations.en.blog.title })).toBeInTheDocument();
    expect(screen.getByText(uiTranslations.en.blog.subtitle)).toBeInTheDocument();

    // Search input
    expect(screen.getByPlaceholderText(uiTranslations.en.blog.searchPlaceholder)).toBeInTheDocument();

    // Category tracks
    expect(screen.getAllByText(/Architecture & System Design/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Data Engineering & Analytics/i).length).toBeGreaterThan(0);
  });
});
