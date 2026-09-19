import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { CalendarIcon, ClockIcon, ListIcon } from '../Icons';
import { ModalDiagramViewer } from './ModalDiagramViewer.tsx';
import { BlogPost } from '../../types/index.ts';

export interface TocItem {
  id: string;
  text: string;
  level: 1 | 2;
  tagName: string;
}

export interface ProcessedContent {
  processedHtml: string;
  tocItems: TocItem[];
}

/**
 * Extracts headings from HTML string, limits to at most 2 distinct levels,
 * generates unique URL-safe slug IDs, and injects IDs onto the headings.
 */
export const processArticleToc = (html: string): ProcessedContent => {
  if (typeof window === 'undefined' || !html) {
    return { processedHtml: html, tocItems: [] };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));

  if (headings.length === 0) {
    return { processedHtml: html, tocItems: [] };
  }

  // Determine distinct heading levels present (sorted from highest to lowest: h1 < h2 < h3...)
  const distinctTags = Array.from(new Set(headings.map((h) => h.tagName.toLowerCase()))).sort();
  // Take up to 2 distinct levels
  const topTwoTags = distinctTags.slice(0, 2);

  const usedIds = new Set<string>();
  const tocItems: TocItem[] = [];

  headings.forEach((heading) => {
    const tagName = heading.tagName.toLowerCase();
    if (!topTwoTags.includes(tagName)) return;

    const text = heading.textContent?.trim() || '';
    if (!text) return;

    // Generate clean slug ID with safe 'toc-' prefix (supports alphanumeric and Vietnamese unicode)
    let rawSlug = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    if (!rawSlug) rawSlug = 'section';
    let uniqueId = `toc-${rawSlug}`;
    let counter = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = `toc-${rawSlug}-${counter}`;
      counter++;
    }
    usedIds.add(uniqueId);

    const level = (topTwoTags.indexOf(tagName) + 1) as 1 | 2;
    tocItems.push({
      id: uniqueId,
      text,
      level,
      tagName,
    });
  });

  // Inject generated IDs onto the parsed heading elements
  let index = 0;
  headings.forEach((heading) => {
    const tagName = heading.tagName.toLowerCase();
    if (topTwoTags.includes(tagName) && tocItems[index]) {
      heading.id = tocItems[index].id;
      heading.classList.add('article-heading-target');
      index++;
    }
  });

  return {
    processedHtml: doc.body.innerHTML,
    tocItems,
  };
};

export interface ArticleTocSidebarProps {
  tocItems: TocItem[];
  activeHeadingId: string;
  onSelectHeading: (id: string) => void;
  tocTitle?: string;
}

export const ArticleTocSidebar: React.FC<ArticleTocSidebarProps> = ({
  tocItems,
  activeHeadingId,
  onSelectHeading,
  tocTitle = 'Table of Contents',
}) => {
  if (tocItems.length === 0) return null;

  return (
    <aside className="article-toc-sidebar" aria-label="Table of Contents">
      <div className="article-toc-header">
        <ListIcon size={16} />
        <span>{tocTitle}</span>
      </div>
      <nav className="article-toc-nav">
        <ul className="article-toc-list">
          {tocItems.map((item) => (
            <li
              key={item.id}
              className={`article-toc-item level-${item.level} ${activeHeadingId === item.id ? 'active' : ''}`}
            >
              <a
                href={`#${item.id}`}
                className="article-toc-link"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectHeading(item.id);
                }}
                title={item.text}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
ArticleTocSidebar.displayName = 'ArticleTocSidebar';

export interface ModalArticleProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  processedHtml: string;
  tocItems: TocItem[];
  activeHeadingId: string;
  onSelectHeading: (id: string) => void;
  isStickyTitleShown?: boolean;
  modalContentRef?: React.RefObject<HTMLDivElement | null>;
  tCommon: {
    overview: string;
    tableOfContents: string;
  };
  closeAriaLabel?: string;
}

export interface ModalArticleComponent extends React.FC<ModalArticleProps> {
  TocSidebar: typeof ArticleTocSidebar;
}

/**
 * Resilient dynamic loader for Mermaid library
 * Uses @vite-ignore on ESM CDN module to avoid Vite import-analysis bare module resolution issues
 */
async function loadMermaidInstance() {
  if (typeof (window as any).mermaid !== 'undefined') {
    return (window as any).mermaid;
  }
  if (typeof window !== 'undefined') {
    try {
      const cdnUrl = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
      const mod = await import(/* @vite-ignore */ cdnUrl);
      const instance = mod.default || mod;
      if (instance) {
        (window as any).mermaid = instance;
        return instance;
      }
    } catch {
      // Fallback: UMD script injection
      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[src*="mermaid"]');
        if (existing) {
          existing.addEventListener('load', () => resolve());
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
      });
      return (window as any).mermaid;
    }
  }
}

export const ModalArticle: ModalArticleComponent = ({
  post,
  isOpen,
  onClose,
  processedHtml,
  tocItems,
  activeHeadingId,
  onSelectHeading,
  isStickyTitleShown = false,
  modalContentRef,
  tCommon,
  closeAriaLabel = 'Close article popup',
}) => {
  const [fitViewSvg, setFitViewSvg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !post || !processedHtml) return;

    let isCancelled = false;

    const renderMermaidDiagrams = async () => {
      const container = modalContentRef?.current || document.querySelector('.blog-article-modal');
      if (!container) return;

      const mermaidBlocks = container.querySelectorAll<HTMLElement>('pre.mermaid, .mermaid');
      if (mermaidBlocks.length === 0) return;

      try {
        const mermaid = await loadMermaidInstance();
        if (!mermaid || isCancelled) return;

        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'var(--font-body)',
        });

        for (let i = 0; i < mermaidBlocks.length; i++) {
          if (isCancelled) return;
          const el = mermaidBlocks[i];
          let rawCode = el.getAttribute('data-raw-mermaid');
          if (!rawCode) {
            rawCode = el.textContent || '';
            el.setAttribute('data-raw-mermaid', rawCode);
          }

          if (!rawCode.trim()) continue;

          const uniqueId = `mermaid-svg-${Date.now()}-${i}`;
          try {
            const { svg } = await mermaid.render(uniqueId, rawCode.trim());
            if (!isCancelled) {
              el.innerHTML = svg + '<span class="mermaid-fit-hint"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg> Fit View</span>';
              el.classList.add('mermaid-rendered');
              el.setAttribute('tabindex', '0');
              el.setAttribute('role', 'button');
              el.setAttribute('aria-label', 'Phóng to sơ đồ (Fit View)');
              el.setAttribute('title', 'Nhấn để phóng to toàn màn hình (Fit View)');
            }
          } catch (err) {
            console.warn('Failed to render Mermaid diagram:', err);
          }
        }
      } catch (err) {
        console.warn('Failed to load mermaid module:', err);
      }
    };

    const timer = setTimeout(renderMermaidDiagrams, 50);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [isOpen, post, processedHtml, modalContentRef]);

  const handleArticleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const mermaidContainer = target.closest<HTMLElement>('.mermaid-rendered, pre.mermaid');
    if (mermaidContainer) {
      const svgEl = mermaidContainer.querySelector('svg');
      if (svgEl) {
        setFitViewSvg(svgEl.outerHTML);
      }
    }
  };

  const handleArticleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      const mermaidContainer = target.closest<HTMLElement>('.mermaid-rendered, pre.mermaid');
      if (mermaidContainer) {
        e.preventDefault();
        const svgEl = mermaidContainer.querySelector('svg');
        if (svgEl) {
          setFitViewSvg(svgEl.outerHTML);
        }
      }
    }
  };

  if (!post) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={post.title}
        stickyHeader={true}
        isStickyTitleShown={isStickyTitleShown}
        closeAriaLabel={closeAriaLabel}
        backdropClassName="blog-modal-backdrop"
        contentClassName="blog-modal-content blog-article-modal"
        contentRef={modalContentRef}
        ariaLabelledBy="article-modal-title"
      >
        <div className="article-modal-body">
          <div className={`article-modal-layout ${tocItems.length > 0 ? 'has-toc' : ''}`}>
            <div className="article-main-column">
              {/* Tag Badges */}
              <div className="tech-tags-list" style={{ marginTop: '4px', marginBottom: '12px' }}>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="cyan">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Article Title */}
              <h1 id="article-modal-title" className="article-full-title">
                {post.title}
              </h1>

              {/* Meta info bar */}
              <div className="article-meta-bar">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CalendarIcon size={14} /> {post.publishedAt}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <ClockIcon size={14} /> {post.readTime}
                </span>
              </div>

              {/* Summary Callout */}
              {post.summary && (
                <div className="article-summary-callout">
                  <strong>{tCommon.overview}: </strong>
                  <span>{post.summary}</span>
                </div>
              )}

              {/* Full Article Content */}
              <div
                className="article-body"
                onClick={handleArticleClick}
                onKeyDown={handleArticleKeyDown}
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />
            </div>

            {/* Right Sticky Table of Contents Sidebar */}
            {tocItems.length > 0 && (
              <ArticleTocSidebar
                tocItems={tocItems}
                activeHeadingId={activeHeadingId}
                onSelectHeading={onSelectHeading}
                tocTitle={tCommon.tableOfContents}
              />
            )}
          </div>
        </div>
      </Modal>

      {/* Fullscreen Diagram Fit View Overlay */}
      <ModalDiagramViewer
        isOpen={Boolean(fitViewSvg)}
        svgContent={fitViewSvg}
        onClose={() => setFitViewSvg(null)}
        title={post.title}
        closeAriaLabel="Close diagram view"
      />
    </>
  );
};

ModalArticle.displayName = 'ModalArticle';
ModalArticle.TocSidebar = ArticleTocSidebar;

