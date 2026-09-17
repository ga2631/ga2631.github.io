import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BlogPost } from '../types/index.ts';
import { BookOpenIcon, CloseIcon, ExternalLinkIcon, CalendarIcon, ClockIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { processArticleToc, ArticleTocSidebar } from './ArticleToc.tsx';

interface BlogSectionProps {
  posts: BlogPost[];
  t: UITranslation['blog'];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts, t }) => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  // Process article content to extract TOC items (up to 2 levels) and inject unique IDs
  const { processedHtml, tocItems } = useMemo(() => {
    if (!activePost) return { processedHtml: '', tocItems: [] };
    return processArticleToc(activePost.contentHtml);
  }, [activePost]);

  // Scrollspy to highlight active TOC heading when scrolling inside modal
  useEffect(() => {
    if (!activePost || tocItems.length === 0) return;

    const container = modalContentRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const offsetThreshold = 140;

      let currentActiveId = tocItems[0]?.id || '';

      for (const item of tocItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top - containerRect.top <= offsetThreshold) {
            currentActiveId = item.id;
          }
        }
      }

      setActiveHeadingId(currentActiveId);
    };

    handleScroll();

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activePost, tocItems]);

  const handleSelectHeading = (id: string) => {
    const container = modalContentRef.current;
    if (!container) return;

    const targetEl = document.getElementById(id);
    if (targetEl) {
      const containerTop = container.getBoundingClientRect().top;
      const targetTop = targetEl.getBoundingClientRect().top;
      const currentScroll = container.scrollTop;
      const targetScroll = currentScroll + (targetTop - containerTop) - 20;

      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
      setActiveHeadingId(id);
    }
  };

  return (
    <section className="section" id="blog">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <BookOpenIcon size={14} /> {t.badge}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">
            {t.subtitle}
          </p>
        </div>

        <div className="blog-grid">
          {posts.map((post) => (
            <div
              key={post.id}
              className="glass-panel blog-card"
              onClick={() => setActivePost(post)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {post.publishedAt} • {post.readTime}
                  </span>
                </div>

                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-summary">{post.summary}</p>
              </div>

              <div>
                <div className="tech-tags-list" style={{ marginBottom: '16px' }}>
                  {post.tags.map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePost(post);
                  }}
                >
                  <span>{t.readArticle}</span>
                  <ExternalLinkIcon size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Reader for HTML Blog Articles */}
        {activePost &&
          createPortal(
            <div className="blog-modal-backdrop" onClick={() => setActivePost(null)}>
              <div
                ref={modalContentRef}
                className="blog-modal-content blog-article-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="modal-close-btn"
                  onClick={() => setActivePost(null)}
                  aria-label="Close Article"
                >
                  <CloseIcon size={18} />
                </button>

                <div className={`article-modal-layout ${tocItems.length > 0 ? 'has-toc' : ''}`}>
                  <div className="article-main-column">
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {activePost.tags.map((tag) => (
                        <span key={tag} className="badge badge-cyan">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      marginBottom: '12px',
                      lineHeight: 1.25,
                    }}>
                      {activePost.title}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.88rem', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <CalendarIcon size={14} /> {activePost.publishedAt}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <ClockIcon size={14} /> {activePost.readTime}
                      </span>
                    </div>

                    <div
                      className="article-body"
                      dangerouslySetInnerHTML={{ __html: processedHtml }}
                    />

                    <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setActivePost(null)}>
                        <CloseIcon size={15} />
                        <span>{t.closeArticle}</span>
                      </button>
                    </div>
                  </div>

                  {tocItems.length > 0 && (
                    <ArticleTocSidebar
                      tocItems={tocItems}
                      activeHeadingId={activeHeadingId}
                      onSelectHeading={handleSelectHeading}
                      lang="vi"
                    />
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </section>
  );
};
