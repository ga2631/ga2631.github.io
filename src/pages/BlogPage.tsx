import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BlogPost } from '../types/index.ts';
import {
  BookOpenIcon,
  CloseIcon,
  SearchIcon,
  SparklesIcon,
  CopyIcon,
  CheckIcon,
  CalendarIcon,
  ClockIcon,
  LayersIcon,
  DatabaseIcon,
  ServerIcon,
  CodeIcon,
  FilterIcon,
  TagIcon,
} from '../components/Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { processArticleToc, ArticleTocSidebar } from '../components/ArticleToc.tsx';
import { BLOG_CATEGORY_DEFINITIONS, BlogCategoryDef } from '../data/blogCategories.ts';
import {
  loadInitialBlogPosts,
  loadNextMonthBatch,
  loadAllArchivePosts,
} from '../data/blogService.ts';

interface BlogPageProps {
  posts: BlogPost[];
  t: UITranslation['blog'];
  tCommon: UITranslation['common'];
}

export const BlogPage: React.FC<BlogPageProps> = ({ posts, t, tCommon }) => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>(posts);
  const [loadedMonthKeys, setLoadedMonthKeys] = useState<string[]>([]);
  const [hasMoreMonths, setHasMoreMonths] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<{
    cat: BlogCategoryDef;
    top: number;
    left: number;
  } | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [isFilterStuck, setIsFilterStuck] = useState(false);

  // Detect language: VI or EN based on translation string
  const langKey = useMemo<'vi' | 'en'>(() => {
    return t.allTopics === 'Tất cả chủ đề' || !t.allTopics.toLowerCase().includes('all') ? 'vi' : 'en';
  }, [t.allTopics]);

  // Sync with incoming posts prop
  useEffect(() => {
    if (posts && posts.length > 0) {
      setAllPosts(posts);
    }
  }, [posts]);

  // Initial load: 20 latest articles by default
  useEffect(() => {
    let isMounted = true;
    loadInitialBlogPosts(langKey, 20).then((res) => {
      if (isMounted) {
        setAllPosts(res.posts);
        setLoadedMonthKeys(res.loadedMonthKeys);
        setHasMoreMonths(res.hasMore);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [langKey]);

  // Automatically load all archives if user applies filters/search to ensure complete query results
  useEffect(() => {
    if ((selectedCategory !== 'all' || selectedTag !== 'all' || searchQuery.trim()) && hasMoreMonths) {
      let isMounted = true;
      loadAllArchivePosts(langKey).then((fullPosts) => {
        if (isMounted) {
          setAllPosts(fullPosts);
          setHasMoreMonths(false);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [selectedCategory, selectedTag, searchQuery, hasMoreMonths, langKey]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreMonths) return;
    setIsLoadingMore(true);
    try {
      const res = await loadNextMonthBatch(langKey, loadedMonthKeys, 20);
      setAllPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newUnique = res.posts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newUnique];
      });
      setLoadedMonthKeys(res.loadedMonthKeys);
      setHasMoreMonths(res.hasMore);
    } finally {
      setIsLoadingMore(false);
    }
  };

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
    allPosts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [allPosts]);

  // Count articles per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allPosts.length };
    BLOG_CATEGORY_DEFINITIONS.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = allPosts.filter((p) => p.category === cat.id).length;
      }
    });
    return counts;
  }, [allPosts]);

  // Count articles per tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [allPosts]);

  // Sync with URL hash for deep linking (e.g. #/blog/post-slug)
  useEffect(() => {
    const checkHashForPost = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/blog/') && hash.length > 7) {
        const slug = hash.replace('#/blog/', '');
        const matchedPost = allPosts.find((p) => p.slug === slug || p.id === slug);
        if (matchedPost) {
          setActivePost(matchedPost);
        }
      }
    };

    checkHashForPost();
    window.addEventListener('hashchange', checkHashForPost);
    return () => window.removeEventListener('hashchange', checkHashForPost);
  }, [allPosts]);

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

  // Handle escape key to close popup or mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activePost) {
          handleClosePost();
        } else if (isMobileSidebarOpen) {
          setIsMobileSidebarOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePost, isMobileSidebarOpen]);

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

  // Filter posts based on category, search query, and selected tag
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' || post.category === selectedCategory;

      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);

      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesTag && matchesQuery;
    });
  }, [allPosts, searchQuery, selectedCategory, selectedTag]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTag('all');
  };

  // Helper to render Category Icon
  const renderCategoryIcon = (iconName: string, size = 16) => {
    switch (iconName) {
      case 'LayersIcon':
        return <LayersIcon size={size} />;
      case 'DatabaseIcon':
        return <DatabaseIcon size={size} />;
      case 'ServerIcon':
        return <ServerIcon size={size} />;
      case 'CodeIcon':
        return <CodeIcon size={size} />;
      case 'SparklesIcon':
        return <SparklesIcon size={size} />;
      default:
        return <BookOpenIcon size={size} />;
    }
  };

  // Active Category Object
  const currentCategoryDef = useMemo(() => {
    return (
      BLOG_CATEGORY_DEFINITIONS.find((c) => c.id === selectedCategory) ||
      BLOG_CATEGORY_DEFINITIONS[0]
    );
  }, [selectedCategory]);

  return (
    <div className="blog-page-root">
      
      {/* Mobile Top Filter Trigger Bar (Visible on <= 1024px) */}
      <div className="blog-mobile-toggle-bar">
        <button
          className="btn btn-secondary btn-sm blog-mobile-filter-btn"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-expanded={isMobileSidebarOpen}
        >
          <FilterIcon size={16} />
          <span>{t.categoriesTitle || 'Chuyên đề'}</span>
          <span className="badge badge-cyan" style={{ marginLeft: '4px', fontSize: '0.75rem' }}>
            {selectedCategory !== 'all' || selectedTag !== 'all' ? '1+' : (allPosts.length > 20 ? '20+' : allPosts.length)}
          </span>
        </button>
      </div>

      {/* Full-Height App Layout */}
      <div className="blog-app-layout">
        
        {/* Mobile Backdrop for Sidebar Drawer */}
        {isMobileSidebarOpen && (
          <div
            className="blog-sidebar-backdrop"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ================= LEFT SIDEBAR (Full Height, Docked Left, Independent Scroll) ================= */}
        <aside className={`blog-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
          
          {/* Mobile Sidebar Close Header */}
          <div className="blog-sidebar-mobile-header">
            <span style={{ fontWeight: 700, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FilterIcon size={16} style={{ color: 'var(--accent-red)' }} />
              {t.categoriesTitle || 'Chuyên đề'}
            </span>
            <button
              className="modal-close-btn"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="Close sidebar"
              style={{ position: 'static' }}
            >
              <CloseIcon size={18} />
            </button>
          </div>

          {/* Sidebar Section 1: Categories (Clean minimal item with icon + title, Tooltip on hover - FIXED) */}
          <div className="blog-sidebar-section blog-sidebar-categories-section">
            <div className="sidebar-section-header">
              <span className="sidebar-section-title">
                <CalendarIcon size={16} />
                {t.categoriesTitle || 'Chuyên đề'}
              </span>
            </div>

            <div className="category-track-list">
              {BLOG_CATEGORY_DEFINITIONS.map((cat: BlogCategoryDef) => {
                const isActive = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] || 0;
                const displayCount = cat.id === 'all' && count > 20 ? '20+' : count;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-item-row day-${cat.dayCode.toLowerCase()} ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsMobileSidebarOpen(false);
                      setHoveredCategory(null);
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCategory({
                        cat,
                        top: rect.top + rect.height / 2,
                        left: rect.right + 12,
                      });
                    }}
                    onMouseLeave={() => setHoveredCategory(null)}
                    aria-label={`${cat.title[langKey]} - ${cat.scheduleFull[langKey]}`}
                  >
                    <div className="category-item-left">
                      <span className={`category-icon-box icon-${cat.dayCode.toLowerCase()}`}>
                        {renderCategoryIcon(cat.iconName, 15)}
                      </span>
                      <span className="category-item-name">{cat.title[langKey]}</span>
                    </div>
                    <span className="category-count-pill">{displayCount}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Section 2: Tags & Keywords (Header FIXED, Tags Cloud Scrollable) */}
          <div className="blog-sidebar-section blog-sidebar-tags-section">
            <div className="sidebar-section-header">
              <span className="sidebar-section-title">
                <TagIcon size={16} />
                {t.tagsTitle || 'Thẻ công nghệ & Chủ đề'}
              </span>
            </div>

            <div className="sidebar-tags-cloud">
              <button
                type="button"
                className={`sidebar-tag-pill ${selectedTag === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTag('all');
                  setIsMobileSidebarOpen(false);
                }}
              >
                <span>{t.allTopics}</span>
                <span className="tag-count">{allPosts.length > 20 ? '20+' : allPosts.length}</span>
              </button>
              {allTags.map((tag) => {
                const count = tagCounts[tag] || 0;
                const isTagActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    className={`sidebar-tag-pill ${isTagActive ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedTag(isTagActive ? 'all' : tag);
                      setIsMobileSidebarOpen(false);
                    }}
                  >
                    <span>#{tag}</span>
                    <span className="tag-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ================= RIGHT MAIN CONTENT (Full Height, Independent Scroll) ================= */}
        <main
          className="blog-main-scroll-area"
          onScroll={(e) => setIsFilterStuck(e.currentTarget.scrollTop > 40)}
        >
          <div className="blog-main-inner-content">
            
            {/* Header Hero */}
            <div className="blog-hero-header">
              <h1 className="section-title">
                {t.title}
              </h1>
              <p className="section-subtitle">
                {t.subtitle}
              </p>
            </div>

            {/* Articles Grid (Wraps Sticky Filter Controls & Article Cards) */}
            <div className="blog-grid">
              {/* Search Input Panel (Sticky Glass Box) */}
              <div className={`blog-controls-panel ${isFilterStuck ? 'is-stuck' : ''}`}>
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

                {/* Active Filter Chips */}
                {(selectedCategory !== 'all' || selectedTag !== 'all' || searchQuery) && (
                  <div className="blog-active-chips-bar">
                    <span className="active-chips-label">
                      <FilterIcon size={13} /> {t.activeFilters || 'Đang lọc:'}
                    </span>

                    {selectedCategory !== 'all' && (
                      <span className="filter-chip">
                        <span className="chip-key">{t.filterByCategory || 'Chuyên đề'}:</span>
                        <strong>{currentCategoryDef.title[langKey]}</strong>
                        <button
                          onClick={() => setSelectedCategory('all')}
                          aria-label="Remove category filter"
                          className="chip-remove-btn"
                        >
                          <CloseIcon size={12} />
                        </button>
                      </span>
                    )}

                    {selectedTag !== 'all' && (
                      <span className="filter-chip">
                        <span className="chip-key">{t.filterByTag || 'Thẻ'}:</span>
                        <strong>#{selectedTag}</strong>
                        <button
                          onClick={() => setSelectedTag('all')}
                          aria-label="Remove tag filter"
                          className="chip-remove-btn"
                        >
                          <CloseIcon size={12} />
                        </button>
                      </span>
                    )}

                    {searchQuery && (
                      <span className="filter-chip">
                        <span className="chip-key">Search:</span>
                        <strong>"{searchQuery}"</strong>
                        <button
                          onClick={() => setSearchQuery('')}
                          aria-label="Remove search query"
                          className="chip-remove-btn"
                        >
                          <CloseIcon size={12} />
                        </button>
                      </span>
                    )}

                    <button
                      className="btn-text-reset"
                      onClick={handleResetFilters}
                      style={{ marginLeft: 'auto' }}
                    >
                      {t.resetFilters}
                    </button>
                  </div>
                )}
              </div>

              {/* Cards or Empty State */}
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const postCatDef = BLOG_CATEGORY_DEFINITIONS.find((c) => c.id === post.category);

                  return (
                    <div
                      key={post.id}
                      className={`glass-panel blog-card card-day-${postCatDef ? postCatDef.dayCode.toLowerCase() : 'all'}`}
                      onClick={() => handleOpenPost(post)}
                    >
                      <div>
                        {/* Top Category Badge & Publishing Schedule Meta */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                          {postCatDef && postCatDef.id !== 'all' ? (
                            <span className={`schedule-day-badge badge-${postCatDef.dayCode.toLowerCase()}`} style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                              {postCatDef.title[langKey]}
                            </span>
                          ) : (
                            <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                              <SparklesIcon size={11} /> {t.article}
                            </span>
                          )}

                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {post.publishedAt} • {post.readTime}
                          </span>
                        </div>

                        <h2 className="blog-title" style={{ fontSize: '1.22rem', marginTop: '4px' }}>{post.title}</h2>
                        <p className="blog-summary">{post.summary}</p>
                      </div>

                      <div className="tech-tags-list" style={{ marginTop: 'auto', paddingTop: '10px' }}>
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
                    </div>
                  );
                })
              ) : (
                <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '48px 24px', textAlign: 'center', marginTop: '12px' }}>
                  <BookOpenIcon size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t.noArticlesFound}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '450px', margin: '0 auto 16px' }}>
                    {selectedCategory !== 'all' ? (
                      <>
                        {t.filterByCategory || 'Chuyên đề'}: <strong>{currentCategoryDef.title[langKey]}</strong> ({currentCategoryDef.scheduleFull[langKey]})
                      </>
                    ) : null}
                  </p>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '8px' }}
                    onClick={handleResetFilters}
                  >
                    {t.resetFilters}
                  </button>
                </div>
              )}
            </div>

            {/* Load More Button if more month archives exist */}
            {hasMoreMonths && filteredPosts.length > 0 && (
              <div className="blog-load-more-container">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  style={{ minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {isLoadingMore ? (
                    <>
                      <span
                        className="spinner-sm"
                        style={{
                          display: 'inline-block',
                          width: '14px',
                          height: '14px',
                          border: '2px solid rgba(255,255,255,0.2)',
                          borderTopColor: 'currentColor',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                      <span>{t.loadingMore || 'Đang tải dữ liệu...'}</span>
                    </>
                  ) : (
                    <span>{t.loadMoreArticles || 'Tải thêm bài viết'}</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ================= Category Hover Rich Tooltip (Portal) ================= */}
      {hoveredCategory &&
        createPortal(
          <div
            className={`category-rich-tooltip tooltip-day-${hoveredCategory.cat.dayCode.toLowerCase()}`}
            style={{
              position: 'fixed',
              top: `${hoveredCategory.top}px`,
              left: `${hoveredCategory.left}px`,
              transform: 'translateY(-50%)',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          >
            <div className="tooltip-top-row">
              <span className={`schedule-day-badge badge-${hoveredCategory.cat.dayCode.toLowerCase()}`}>
                <CalendarIcon size={12} /> {hoveredCategory.cat.scheduleFull[langKey]}
              </span>
            </div>
            <div className="tooltip-title">
              {hoveredCategory.cat.title[langKey]}
            </div>
            <div className="tooltip-desc">
              <strong style={{ color: 'var(--text-accent)', marginRight: '4px' }}>
                {t.trackObjective || 'Mục tiêu'}:
              </strong>
              <span>{hoveredCategory.cat.description[langKey]}</span>
            </div>
          </div>,
          document.body
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
  );
};
