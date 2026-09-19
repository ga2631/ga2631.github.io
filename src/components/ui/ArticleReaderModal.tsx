import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { CalendarIcon, ClockIcon } from '../Icons';
import { BlogPost } from '../../types/index.ts';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface ArticleTocSidebarProps {
  tocItems: TocItem[];
  activeHeadingId: string;
  onSelectHeading: (id: string) => void;
  tocTitle: string;
}

export const ArticleTocSidebar: React.FC<ArticleTocSidebarProps> = ({
  tocItems,
  activeHeadingId,
  onSelectHeading,
  tocTitle,
}) => {
  return (
    <aside className="article-toc-sidebar">
      <div className="article-toc-header">{tocTitle}</div>
      <nav className="article-toc-nav" aria-label="Table of Contents">
        <ul className="article-toc-list">
          {tocItems.map((item) => (
            <li
              key={item.id}
              className={`article-toc-item level-${item.level} ${
                activeHeadingId === item.id ? 'active' : ''
              }`}
            >
              <button
                type="button"
                className="article-toc-link"
                onClick={() => onSelectHeading(item.id)}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
ArticleTocSidebar.displayName = 'ArticleTocSidebar';

export interface ArticleReaderModalProps {
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

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
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

ArticleReaderModal.displayName = 'ArticleReaderModal';
