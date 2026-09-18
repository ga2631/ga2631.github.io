import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BlogPage } from '../../src/pages/BlogPage';
import { blogPostsEn } from '../../src/data/blogData';
import { uiTranslations } from '../../src/data/cvData';

describe('TS-12: Blog Search & Article Reader Modal Integration', () => {
  const defaultProps = {
    posts: blogPostsEn,
    t: uiTranslations.en.blog,
    tCommon: uiTranslations.en.common,
  };

  it('should render search input and all blog articles initially', () => {
    render(<BlogPage {...defaultProps} />);

    expect(screen.getByPlaceholderText(uiTranslations.en.blog.searchPlaceholder)).toBeInTheDocument();
    expect(screen.getByText(blogPostsEn[0].title)).toBeInTheDocument();
  });

  it('should filter articles dynamically as search query is typed', () => {
    render(<BlogPage {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(uiTranslations.en.blog.searchPlaceholder);
    fireEvent.change(searchInput, { target: { value: blogPostsEn[0].title.slice(0, 10) } });

    expect(screen.getByText(blogPostsEn[0].title)).toBeInTheDocument();
  });

  it('should display friendly empty state when no articles match search query', () => {
    render(<BlogPage {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(uiTranslations.en.blog.searchPlaceholder);
    fireEvent.change(searchInput, { target: { value: 'nonexistentkeyword99999' } });

    expect(screen.getByText(uiTranslations.en.blog.noArticlesFound)).toBeInTheDocument();
    const resetButtons = screen.getAllByRole('button', { name: new RegExp(uiTranslations.en.blog.resetFilters, 'i') });
    expect(resetButtons.length).toBeGreaterThan(0);

    // Clicking reset search clears query
    fireEvent.click(resetButtons[0]);
    expect(screen.getByText(blogPostsEn[0].title)).toBeInTheDocument();
  });

  it('should open article reader modal and display table of contents', () => {
    render(<BlogPage {...defaultProps} />);

    const readButtons = screen.getAllByRole('button', { name: new RegExp(uiTranslations.en.blog.readArticle, 'i') });
    fireEvent.click(readButtons[0]);

    // Modal dialog should be open
    const modalDialog = screen.getByRole('dialog');
    expect(modalDialog).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    // Close button should close modal
    const closeBtn = screen.getByLabelText(/close article popup/i);
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });
});
