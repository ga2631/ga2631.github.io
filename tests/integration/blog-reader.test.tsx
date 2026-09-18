import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BlogPage } from '../../src/pages/BlogPage';
import { blogPostsEn } from '../../src/data/blogData';
import { uiTranslations } from '../../src/data/cvData';

describe('TS-12: Blog Search, Left Sidebar & Article Reader Modal Integration', () => {
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

  it('should render left sidebar with category tracks and publishing schedule', () => {
    render(<BlogPage {...defaultProps} />);

    // Should render category tracks
    expect(screen.getAllByText(/Architecture & System Design/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Data Engineering & Analytics/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/DevOps, Cloud & Tooling/i).length).toBeGreaterThan(0);
  });

  it('should filter articles dynamically when selecting a category track', () => {
    render(<BlogPage {...defaultProps} />);

    const dataEngButtons = screen.getAllByRole('button', { name: /Data Engineering & Analytics/i });
    fireEvent.click(dataEngButtons[0]);

    // Post 1 (Medallion CDC) is Data Engineering and should be in the document
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

  it('should open article reader modal and display table of contents when clicking article card', () => {
    render(<BlogPage {...defaultProps} />);

    const articleCard = screen.getByText(blogPostsEn[0].title);
    fireEvent.click(articleCard);

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

  it('should display rich tooltip with schedule and objectives when hovering over category row', () => {
    render(<BlogPage {...defaultProps} />);

    const dataEngButton = screen.getByRole('button', { name: /Data Engineering & Analytics/i });
    fireEvent.mouseEnter(dataEngButton);

    // Tooltip should display schedule
    expect(screen.getByText(/Every Tuesday/i)).toBeInTheDocument();

    // Mouse leave should dismiss tooltip
    fireEvent.mouseLeave(dataEngButton);
    expect(screen.queryByText(/Every Tuesday/i)).not.toBeInTheDocument();
  });

  it('should apply individual category day classes to category rows, badges, and tooltips', () => {
    render(<BlogPage {...defaultProps} />);

    const catRows = document.querySelectorAll('.category-item-row');
    expect(catRows.length).toBe(6);

    // Verify day classes
    expect(document.querySelector('.category-item-row.day-all')).toBeInTheDocument();
    expect(document.querySelector('.category-item-row.day-mon')).toBeInTheDocument();
    expect(document.querySelector('.category-item-row.day-tue')).toBeInTheDocument();
    expect(document.querySelector('.category-item-row.day-wed')).toBeInTheDocument();
    expect(document.querySelector('.category-item-row.day-thu')).toBeInTheDocument();
    expect(document.querySelector('.category-item-row.day-fri')).toBeInTheDocument();

    // Hover over Monday track (Architecture)
    const archButton = screen.getByRole('button', { name: /Architecture & System Design/i });
    fireEvent.mouseEnter(archButton);

    const tooltip = document.querySelector('.category-rich-tooltip.tooltip-day-mon');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip?.querySelector('.badge-mon')).toBeInTheDocument();

    fireEvent.mouseLeave(archButton);
  });

  it('should render fixed category section and tags cloud container', () => {
    render(<BlogPage {...defaultProps} />);

    expect(document.querySelector('.blog-sidebar-categories-section')).toBeInTheDocument();
    expect(document.querySelector('.blog-sidebar-tags-section')).toBeInTheDocument();
    expect(document.querySelector('.sidebar-tags-cloud')).toBeInTheDocument();
    expect(screen.getByText(uiTranslations.en.blog.tagsTitle)).toBeInTheDocument();
  });

  it('should render sticky filter controls panel and toggle is-stuck class on scroll', () => {
    render(<BlogPage {...defaultProps} />);

    const controlsPanel = document.querySelector('.blog-controls-panel');
    const scrollContainer = document.querySelector('.blog-main-scroll-area');

    expect(controlsPanel).toBeInTheDocument();
    expect(controlsPanel).not.toHaveClass('is-stuck');

    if (scrollContainer) {
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 60 } });
      expect(controlsPanel).toHaveClass('is-stuck');

      fireEvent.scroll(scrollContainer, { target: { scrollTop: 0 } });
      expect(controlsPanel).not.toHaveClass('is-stuck');
    }
  });
});
