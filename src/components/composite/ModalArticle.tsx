'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { CalendarIcon, ClockIcon, ListIcon } from '../Icons';
import { ModalDiagramViewer } from './ModalDiagramViewer.tsx';
import { BlogPost } from '../../types/index.ts';
import { trackTocHeadingClick } from '../../utils/analytics';

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
    <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-4 self-start pl-6 border-l border-slate-200/80" aria-label="Table of Contents">
      <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
        <ListIcon size={15} />
        <span>{tocTitle}</span>
      </div>
      <nav>
        <ul className="flex flex-col gap-1 text-xs">
          {tocItems.map((item) => (
            <li
              key={item.id}
              className={`transition-colors ${item.level === 2 ? 'pl-3' : ''}`}
            >
              <a
                href={`#${item.id}`}
                className={`block py-1 leading-snug truncate transition-colors ${
                  activeHeadingId === item.id
                    ? 'text-red-600 font-bold'
                    : 'text-slate-600 hover:text-red-600 font-medium'
                }`}
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
export interface ArticleBodyProps {
  processedHtml: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const ArticleBody: React.FC<ArticleBodyProps> = React.memo(
  ({ processedHtml, onClick, onKeyDown }) => {
    const bodyRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      const container = bodyRef.current;
      if (!container || !processedHtml) return;

      // 1. Directly inject HTML into DOM container
      container.innerHTML = processedHtml;

      // 2. Query Mermaid blocks
      const mermaidBlocks = container.querySelectorAll<HTMLElement>('pre.mermaid, .mermaid');
      if (mermaidBlocks.length === 0) return;

      let isCancelled = false;

      const renderDiagrams = async () => {
        try {
          const mermaidModule = await import('mermaid');
          const mermaid = mermaidModule.default;
          if (isCancelled) return;

          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'base',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            themeVariables: {
              darkMode: false,
              background: '#ffffff',
              mainBkg: '#ffffff',
              primaryColor: '#ffffff',
              textColor: '#0f172a',
              nodeTextColor: '#0f172a',
              primaryTextColor: '#0f172a',
              noteBorderColor: '#dc2626',
              primaryBorderColor: '#dc2626',
              nodeBorder: '#dc2626',
              lineColor: '#dc2626',
              labelBackgroundColor: '#dc2626',
              labelTextColor: '#f8fafc',
              tertiaryTextColor: '#f8fafc',
              transitionLabelColor: '#f8fafc',
            },
            themeCSS: `
              .edgeLabel .labelBkg,
              .edgeLabel, .edgeLabel span p {
                background-color: #ffffff80 !important;
              }
              `,
          });

          for (let i = 0; i < mermaidBlocks.length; i++) {
            if (isCancelled) return;
            const el = mermaidBlocks[i];
            const rawCode = el.textContent || '';
            const cleanCode = rawCode
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .trim();

            if (!cleanCode) continue;

            const uniqueId = `mermaid-svg-${Date.now()}-${i}`;
            try {
              const { svg } = await mermaid.render(uniqueId, cleanCode);
              if (!isCancelled) {
                el.innerHTML =
                  svg +
                  '<span class="mermaid-fit-hint"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg> Fit View</span>';
                el.classList.add('mermaid-rendered');
                el.setAttribute('tabindex', '0');
                el.setAttribute('role', 'button');
                el.setAttribute('aria-label', 'Phóng to sơ đồ (Fit View)');
                el.setAttribute('title', 'Nhấn để phóng to toàn màn hình (Fit View)');
              }
            } catch (renderErr) {
              console.error('Failed to render Mermaid diagram:', renderErr);
            }
          }
        } catch (err) {
          console.error('Failed to initialize mermaid:', err);
        }
      };

      renderDiagrams();

      return () => {
        isCancelled = true;
      };
    }, [processedHtml]);

    return (
      <div
        ref={bodyRef}
        className="article-prose"
        onClick={onClick}
        onKeyDown={onKeyDown}
      />
    );
  },
  (prev, next) => prev.processedHtml === next.processedHtml
);
ArticleBody.displayName = 'ArticleBody';

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
        contentRef={modalContentRef}
        ariaLabelledBy="article-modal-title"
      >
        <Modal.Body>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              {/* Tag Badges */}
              <div className="flex flex-wrap gap-1.5 mt-1 mb-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="cyan" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Article Title */}
              <h1 id="article-modal-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
                {post.title}
              </h1>

              {/* Meta info bar */}
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mb-5 pb-4 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon size={14} /> <span>{post.publishedAt}</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon size={14} /> <span>{post.readTime}</span>
                </span>
              </div>

              {/* Summary Callout */}
              {post.summary && (
                <div className="p-4 mb-6 bg-red-50/60 border border-red-200/80 rounded-xl text-slate-700 text-sm leading-relaxed">
                  <strong className="text-red-700 font-bold">{tCommon.overview}: </strong>
                  <span>{post.summary}</span>
                </div>
              )}

              {/* Full Article Content with Protected Mermaid DOM */}
              <ArticleBody
                processedHtml={processedHtml}
                onClick={handleArticleClick}
                onKeyDown={handleArticleKeyDown}
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
        </Modal.Body>
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

