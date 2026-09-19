import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BlogItem } from '../../../src/components/composite/BlogItem';
import { BlogPost } from '../../../src/types';

describe('Tier 3: BlogItem Composite Component', () => {
  const mockPost: BlogPost = {
    id: 'test-article-1',
    slug: 'test-article-1',
    title: 'Testing Scalable Architectures with Vitest',
    summary: 'Comprehensive guide to component testing in React.',
    publishedAt: '2026-09-19',
    readTime: '6 min read',
    tags: ['React', 'Testing', 'Architecture'],
    author: 'tanhn',
    contentHtml: '<p>Article content</p>',
  };

  it('renders blog post card with metadata, title, summary, and tags', () => {
    render(<BlogItem post={mockPost} onSelect={vi.fn()} readArticleLabel="Read Now" />);

    expect(screen.getByText('Testing Scalable Architectures with Vitest')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive guide to component testing in React.')).toBeInTheDocument();
    expect(screen.getByText(/2026-09-19 • 6 min read/i)).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /read now/i })).toBeInTheDocument();
  });

  it('triggers onSelect when card or button is clicked', () => {
    const handleSelect = vi.fn();
    render(<BlogItem post={mockPost} onSelect={handleSelect} readArticleLabel="Read Now" />);

    const readButton = screen.getByRole('button', { name: /read now/i });
    fireEvent.click(readButton);
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(mockPost);

    const cardTitle = screen.getByText('Testing Scalable Architectures with Vitest');
    fireEvent.click(cardTitle);
    expect(handleSelect).toHaveBeenCalledTimes(2);
  });
});
