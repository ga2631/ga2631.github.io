import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ArticleReaderModal } from '../../../src/components/ui/ArticleReaderModal';
import { BlogPost } from '../../../src/data/blogService';

describe('Tier 2: ArticleReaderModal Component', () => {
  const mockPost: BlogPost = {
    id: 'post-system-design',
    slug: 'post-system-design',
    title: 'High-Throughput Microservices Design',
    category: 'architecture-system-design',
    publishedAt: '2026-09-15',
    readTime: '8 min read',
    tags: ['Architecture', 'Kafka', 'Rust'],
    summary: 'A deep dive into high-throughput architectures.',
    content: '<p>Article Body Content</p>',
  };

  const mockTocItems = [
    { id: 'context-problem', text: 'Context & Problem', level: 2 },
    { id: 'system-architecture', text: 'System Architecture', level: 2 },
  ];

  const mockTCommon = {
    overview: 'Overview',
    tableOfContents: 'Table of Contents',
  };

  it('renders article modal with title, meta info, tags, and summary callout', () => {
    render(
      <ArticleReaderModal
        post={mockPost}
        isOpen={true}
        onClose={vi.fn()}
        processedHtml="<p>Article Body Content</p>"
        tocItems={mockTocItems}
        activeHeadingId="context-problem"
        onSelectHeading={vi.fn()}
        tCommon={mockTCommon}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'High-Throughput Microservices Design' })).toBeInTheDocument();
    expect(screen.getByText(/2026-09-15/)).toBeInTheDocument();
    expect(screen.getByText(/8 min read/)).toBeInTheDocument();
    expect(screen.getByText('A deep dive into high-throughput architectures.')).toBeInTheDocument();
    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    expect(screen.getByText('Context & Problem')).toBeInTheDocument();
    expect(screen.getByText('System Architecture')).toBeInTheDocument();
  });

  it('handles heading click in TOC sidebar', () => {
    const handleSelectHeading = vi.fn();
    render(
      <ArticleReaderModal
        post={mockPost}
        isOpen={true}
        onClose={vi.fn()}
        processedHtml="<p>Article Body Content</p>"
        tocItems={mockTocItems}
        activeHeadingId="context-problem"
        onSelectHeading={handleSelectHeading}
        tCommon={mockTCommon}
      />
    );

    const tocLink = screen.getByText('System Architecture');
    fireEvent.click(tocLink);
    expect(handleSelectHeading).toHaveBeenCalledWith('system-architecture');
  });

  it('handles close button trigger and escape key dismiss', () => {
    const handleClose = vi.fn();
    render(
      <ArticleReaderModal
        post={mockPost}
        isOpen={true}
        onClose={handleClose}
        processedHtml="<p>Article Body Content</p>"
        tocItems={[]}
        activeHeadingId=""
        onSelectHeading={vi.fn()}
        tCommon={mockTCommon}
        closeAriaLabel="Close article popup"
      />
    );

    const closeBtn = screen.getByLabelText('Close article popup');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
