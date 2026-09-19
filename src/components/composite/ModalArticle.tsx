import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { CalendarIcon, ClockIcon, ListIcon } from '../Icons';
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
      .replace(/-+/g, '-')
      .slice(0, 50);

    if (!rawSlug) rawSlug = 'section';
    const baseId = `toc-${rawSlug}`;

    let uniqueId = baseId;
    let count = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${baseId}-${count++}`;
    }
    usedIds.add(uniqueId);

    heading.setAttribute('id', uniqueId);
    heading.classList.add('article-heading-target');

    tocItems.push({
      id: uniqueId,
      text,
      level: (topTwoTags.indexOf(tagName) + 1) as 1 | 2,
      tagName,
    });
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
  if (!post) return null;

  return (
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
  );
};

ModalArticle.displayName = 'ModalArticle';
ModalArticle.TocSidebar = ArticleTocSidebar;
