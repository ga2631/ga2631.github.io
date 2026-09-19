import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModalArticle, processArticleToc } from '../../../src/components/composite/ModalArticle';
import { BlogPost, TocItem } from '../../../src/types';

describe('TU-COMPOSITE-09: Composite - ModalArticle Component', () => {
  const mockPost: BlogPost = {
    id: 'post-system-design',
    slug: 'post-system-design',
    title: 'High-Throughput Microservices Design',
    category: 'architecture-system-design',
    publishedAt: '2026-09-15',
    readTime: '8 min read',
    tags: ['Architecture', 'Kafka', 'Rust'],
    summary: 'A deep dive into high-throughput architectures.',
    contentHtml: '<p>Article Body Content</p>',
    author: 'tanhn',
  };

  const mockTocItems: TocItem[] = [
    { id: 'context-problem', text: 'Context & Problem', level: 1, tagName: 'h2' },
    { id: 'system-architecture', text: 'System Architecture', level: 2, tagName: 'h3' },
  ];

  const mockTCommon = {
    overview: 'Overview',
    tableOfContents: 'Table of Contents',
  };

  it('renders article modal with title, meta info, tags, and summary callout', () => {
    render(
      <ModalArticle
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
      <ModalArticle
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
      <ModalArticle
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

  it('opens diagram fit view overlay when clicking a rendered mermaid diagram card', () => {
    const htmlWithMermaid = `
      <div class="mermaid-rendered" role="button" tabindex="0">
        <svg id="mermaid-sample"><text>Architecture Diagram SVG</text></svg>
      </div>
    `;

    render(
      <ModalArticle
        post={mockPost}
        isOpen={true}
        onClose={vi.fn()}
        processedHtml={htmlWithMermaid}
        tocItems={[]}
        activeHeadingId=""
        onSelectHeading={vi.fn()}
        tCommon={mockTCommon}
      />
    );

    const diagramCard = screen.getByText('Architecture Diagram SVG').closest('.mermaid-rendered')!;
    expect(diagramCard).toBeInTheDocument();

    // Click diagram card
    fireEvent.click(diagramCard);

    // Fit view overlay should be displayed with close button and controls
    expect(screen.getByLabelText('Close diagram view')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();

    // Close fit view
    const closeDiagramBtn = screen.getByLabelText('Close diagram view');
    fireEvent.click(closeDiagramBtn);

    expect(screen.queryByLabelText('Close diagram view')).not.toBeInTheDocument();
  });


  describe('processArticleToc parser', () => {
    it('correctly parses up to 2 heading levels and generates IDs', () => {
      const html = `
        <h2>Introduction</h2>
        <p>Some text</p>
        <h3>Sub-topic 1</h3>
        <h4>Ignored depth</h4>
        <h2>Conclusion</h2>
      `;
      const { processedHtml, tocItems } = processArticleToc(html);

      expect(tocItems).toHaveLength(3);
      expect(tocItems[0]).toEqual({
        id: 'toc-introduction',
        text: 'Introduction',
        level: 1,
        tagName: 'h2',
      });
      expect(tocItems[1]).toEqual({
        id: 'toc-sub-topic-1',
        text: 'Sub-topic 1',
        level: 2,
        tagName: 'h3',
      });
      expect(tocItems[2]).toEqual({
        id: 'toc-conclusion',
        text: 'Conclusion',
        level: 1,
        tagName: 'h2',
      });
      expect(processedHtml).toContain('id="toc-introduction"');
    });

    it('handles empty html gracefully', () => {
      const result = processArticleToc('');
      expect(result.tocItems).toEqual([]);
      expect(result.processedHtml).toBe('');
    });
  });

  describe('ModalArticle.TocSidebar compound subcomponent', () => {
    it('renders TOC sidebar independently with custom title and handles click', () => {
      const handleSelect = vi.fn();
      render(
        <ModalArticle.TocSidebar
          tocItems={mockTocItems}
          activeHeadingId="system-architecture"
          onSelectHeading={handleSelect}
          tocTitle="Mục lục bài viết"
        />
      );

      expect(screen.getByText('Mục lục bài viết')).toBeInTheDocument();
      const activeLink = screen.getByText('System Architecture').closest('li');
      expect(activeLink).toHaveClass('active');

      fireEvent.click(screen.getByText('Context & Problem'));
      expect(handleSelect).toHaveBeenCalledWith('context-problem');
    });
  });
});
