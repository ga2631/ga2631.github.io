import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BlogPost } from '../types/index.ts';
import {
  BookOpenIcon,
  CloseIcon,
  ExternalLinkIcon,
  SearchIcon,
  ArrowLeftIcon,
  SparklesIcon,
  CopyIcon,
  CheckIcon,
  CalendarIcon,
  ClockIcon,
} from '../components/Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { processArticleToc, ArticleTocSidebar } from '../components/ArticleToc.tsx';

interface BlogPageProps {
  posts: BlogPost[];
  t: UITranslation['blog'];
  tCommon: UITranslation['common'];
  lang: 'vi' | 'en';
}

export const BlogPage: React.FC<BlogPageProps> = ({ posts, t, tCommon, lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
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

  // Extract all unique tags across posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [posts]);

  // Sync with URL hash for deep linking (e.g. #/blog/post-slug)
  useEffect(() => {
    const checkHashForPost = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/blog/') && hash.length > 7) {
        const slug = hash.replace('#/blog/', '');
        const matchedPost = posts.find((p) => p.slug === slug || p.id === slug);
        if (matchedPost) {
          setActivePost(matchedPost);
        }
      }
    };

    checkHashForPost();
    window.addEventListener('hashchange', checkHashForPost);
    return () => window.removeEventListener('hashchange', checkHashForPost);
  }, [posts]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (activePost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activePost]);

  // Handle escape key to close popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePost) {
        handleClosePost();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePost]);

  // Open / Close Post helper
  const handleOpenPost = (post: BlogPost) => {
    setActivePost(post);
    window.location.hash = `#/blog/${post.slug}`;
  };

  const handleClosePost = () => {
    setActivePost(null);
    window.location.hash = '#/blog';
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesTag && matchesQuery;
    });
  }, [posts, searchQuery, selectedTag]);

  return (
    <div className="blog-page-root">
      <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + 32px)', paddingBottom: '96px' }}>
        
        {/* Top Breadcrumb / Return Navigation Bar */}
        <div className="blog-top-bar">
          <a href="#/" className="btn btn-secondary btn-sm blog-back-btn">
            <ArrowLeftIcon size={16} />
            <span>{t.backToHome}</span>
          </a>

          <div className="blog-route-indicator">
            <span style={{ color: 'var(--text-muted)' }}>{t.backToHome}</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{t.badge}</span>
          </div>
        </div>

        {/* Header Hero */}
        <div className="blog-hero-header">
          <span className="section-badge">
            <BookOpenIcon size={14} /> {t.badge}
          </span>
          <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            {t.title}
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '780px', margin: '0 auto 36px' }}>
            {t.subtitle}
          </p>
        </div>

        {/* Search & Topic Filters Bar */}
        <div className="glass-panel blog-controls-panel">
          {/* Search Bar */}
          <div className="blog-search-wrapper">
            <SearchIcon size={18} className="search-input-icon" />
            <input
              type="text"
              className="blog-search-input"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>

          {/* Tag Filter Pills */}
          <div className="blog-tags-filter">
            <button
              className={`blog-tag-pill ${selectedTag === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTag('all')}
            >
              <span>{t.allTopics}</span>
              <span className="tag-count">{posts.length}</span>
            </button>
            {allTags.map((tag) => {
              const count = posts.filter((p) => p.tags.includes(tag)).length;
              return (
                <button
                  key={tag}
                  className={`blog-tag-pill ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
                >
                  <span>#{tag}</span>
                  <span className="tag-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count Info */}
        <div className="blog-results-meta">
          <span>
            {t.showingArticles.replace('{count}', String(filteredPosts.length)).replace('{total}', String(posts.length))}
          </span>
          {(searchQuery || selectedTag !== 'all') && (
            <button
              className="btn-text-reset"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('all');
              }}
            >
              {t.resetFilters}
            </button>
          )}
        </div>

        {/* Articles Grid */}
        {filteredPosts.length > 0 ? (
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="glass-panel blog-card"
                onClick={() => handleOpenPost(post)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {post.publishedAt} • {post.readTime}
                    </span>
                    <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                      <SparklesIcon size={11} /> {t.article}
                    </span>
                  </div>

                  <h2 className="blog-title" style={{ fontSize: '1.28rem' }}>{post.title}</h2>
                  <p className="blog-summary">{post.summary}</p>
                </div>

                <div>
                  <div className="tech-tags-list" style={{ marginBottom: '18px' }}>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`badge ${selectedTag === tag ? 'badge-cyan' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTag(tag);
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPost(post);
                    }}
                  >
                    <span>{t.readArticle}</span>
                    <ExternalLinkIcon size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center', marginTop: '24px' }}>
            <BookOpenIcon size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t.noArticlesFound}</h3>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '16px' }}
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('all');
              }}
            >
              {t.resetFilters}
            </button>
          </div>
        )}

        {/* ================= Blog Article Popup / Modal ================= */}
        {activePost &&
          createPortal(
            <div
              className="blog-modal-backdrop"
              onClick={handleClosePost}
              role="dialog"
              aria-modal="true"
              aria-labelledby="article-modal-title"
            >
              <div
                ref={modalContentRef}
                className="blog-modal-content blog-article-modal"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Icon Button */}
                <button
                  className="modal-close-btn"
                  onClick={handleClosePost}
                  aria-label="Close article popup"
                >
                  <CloseIcon size={20} />
                </button>

                {/* Modal Top Nav Bar: Share / Copy Link */}
                <div className="article-top-nav" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <button onClick={handleCopyLink} className="btn btn-outline btn-sm">
                    {copiedLink ? (
                      <>
                        <CheckIcon size={14} style={{ color: 'var(--accent-emerald)' }} />
                        <span style={{ color: 'var(--accent-emerald)' }}>{tCommon.copiedLink}</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon size={14} />
                        <span>{tCommon.shareLink}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Main Article Content & Right Sticky Table of Contents Layout */}
                <div className={`article-modal-layout ${tocItems.length > 0 ? 'has-toc' : ''}`}>
                  <div className="article-main-column">
                    {/* Tag Badges */}
                    <div className="tech-tags-list" style={{ marginTop: '4px', marginBottom: '12px' }}>
                      {activePost.tags.map((tag) => (
                        <span key={tag} className="badge badge-cyan">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Article Title */}
                    <h1 id="article-modal-title" className="article-full-title">
                      {activePost.title}
                    </h1>

                    {/* Meta info bar */}
                    <div className="article-meta-bar">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <CalendarIcon size={14} /> {activePost.publishedAt}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <ClockIcon size={14} /> {activePost.readTime}
                      </span>
                    </div>

                    {/* Summary Callout */}
                    <div className="article-summary-callout">
                      <strong>{tCommon.overview}: </strong>
                      <span>{activePost.summary}</span>
                    </div>

                    {/* Full Article Content with Injected Heading IDs */}
                    <div
                      className="article-body"
                      dangerouslySetInnerHTML={{ __html: processedHtml }}
                    />

                    {/* Bottom Actions Bar: Single Close Button on Bottom-Right */}
                    <div className="article-bottom-bar" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                      <button onClick={handleClosePost} className="btn btn-secondary btn-sm">
                        <CloseIcon size={15} />
                        <span>{t.closeArticle}</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Sticky Table of Contents Sidebar */}
                  {tocItems.length > 0 && (
                    <ArticleTocSidebar
                      tocItems={tocItems}
                      activeHeadingId={activeHeadingId}
                      onSelectHeading={handleSelectHeading}
                      tocTitle={tCommon.tableOfContents}
                    />
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
};
