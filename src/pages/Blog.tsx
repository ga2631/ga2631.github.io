import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BlogPost } from '../types/index.ts';
import {
  BookOpenIcon,
  CloseIcon,
  SparklesIcon,
  CalendarIcon,
  LayersIcon,
  DatabaseIcon,
  ServerIcon,
  CodeIcon,
  FilterIcon,
  TagIcon,
} from '../components/Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { BLOG_CATEGORY_DEFINITIONS, BlogCategoryDef } from '../data/blog/blogCategories.ts';
import {
  loadInitialBlogPosts,
  loadNextMonthBatch,
  loadAllArchivePosts,
} from '../services/blogService.ts';
import { Button, Badge, Card } from '../components/common';
import { InputSearch } from '../components/ui';
import { 
  EmptyState,
  BadgeFilterChip,
  BadgeSchedule,
  ModalArticle,
  processArticleToc,
} from '../components/composite';

export interface BlogProps {
  posts: BlogPost[];
  t: UITranslation['blog'];
  tCommon: UITranslation['common'];
}

export const Blog: React.FC<BlogProps> = ({ posts, t, tCommon }) => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>(posts);
  const [loadedMonthKeys, setLoadedMonthKeys] = useState<string[]>([]);
  const [hasMoreMonths, setHasMoreMonths] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isModalHeaderTitleShown, setIsModalHeaderTitleShown] = useState(false);
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

  // Scrollspy to highlight active TOC heading and toggle header title when scrolling inside modal
  useEffect(() => {
    if (!activePost) return;

    const container = modalContentRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const offsetThreshold = 140;

      // Detect when main article title scrolls past the pinned modal header
      const titleEl = document.getElementById('article-modal-title');
      if (titleEl) {
        const titleRect = titleEl.getBoundingClientRect();
        setIsModalHeaderTitleShown(titleRect.bottom <= containerRect.top + 60);
      } else {
        setIsModalHeaderTitleShown(container.scrollTop > 80);
      }

      if (tocItems.length > 0) {
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
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
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

  // Handle escape key to close mobile drawer when modal is not open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileSidebarOpen && !activePost) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen, activePost]);

  // Open / Close Post helper
  const handleOpenPost = (post: BlogPost) => {
    setActivePost(post);
    setIsModalHeaderTitleShown(false);
    window.location.hash = `#/blog/${post.slug}`;
  };

  const handleClosePost = () => {
    setActivePost(null);
    setIsModalHeaderTitleShown(false);
    window.location.hash = '#/blog';
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
        <Button
          variant="secondary"
          size="sm"
          className="blog-mobile-filter-btn"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-expanded={isMobileSidebarOpen}
          icon={<FilterIcon size={16} />}
        >
          <span>{t.categoriesTitle || 'Chuyên đề'}</span>
          <Badge variant="cyan" style={{ marginLeft: '4px', fontSize: '0.75rem' }}>
            {selectedCategory !== 'all' || selectedTag !== 'all' ? '1+' : (allPosts.length > 20 ? '20+' : allPosts.length)}
          </Badge>
        </Button>
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
              type="button"
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
              <Badge
                variant="tag-pill"
                isActive={selectedTag === 'all'}
                count={allPosts.length > 20 ? '20+' : allPosts.length}
                onClick={() => {
                  setSelectedTag('all');
                  setIsMobileSidebarOpen(false);
                }}
              >
                {t.allTopics}
              </Badge>
              {allTags.map((tag) => {
                const count = tagCounts[tag] || 0;
                const isTagActive = selectedTag === tag;
                return (
                  <Badge
                    key={tag}
                    variant="tag-pill"
                    isActive={isTagActive}
                    count={count}
                    onClick={() => {
                      setSelectedTag(isTagActive ? 'all' : tag);
                      setIsMobileSidebarOpen(false);
                    }}
                  >
                    #{tag}
                  </Badge>
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
                <InputSearch
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />

                {/* Active Filter Chips */}
                {(selectedCategory !== 'all' || selectedTag !== 'all' || searchQuery) && (
                  <div className="blog-active-chips-bar">
                    <span className="active-chips-label">
                      <FilterIcon size={13} /> {t.activeFilters || 'Đang lọc:'}
                    </span>

                    {selectedCategory !== 'all' && (
                      <BadgeFilterChip
                        chipKey={t.filterByCategory || 'Chuyên đề'}
                        chipValue={currentCategoryDef.title[langKey]}
                        onRemove={() => setSelectedCategory('all')}
                        removeAriaLabel="Remove category filter"
                      />
                    )}

                    {selectedTag !== 'all' && (
                      <BadgeFilterChip
                        chipKey={t.filterByTag || 'Thẻ'}
                        chipValue={`#${selectedTag}`}
                        onRemove={() => setSelectedTag('all')}
                        removeAriaLabel="Remove tag filter"
                      />
                    )}

                    {searchQuery && (
                      <BadgeFilterChip
                        chipKey="Search"
                        chipValue={`"${searchQuery}"`}
                        onRemove={() => setSearchQuery('')}
                        removeAriaLabel="Remove search query"
                      />
                    )}

                    <Button
                      variant="text-reset"
                      onClick={handleResetFilters}
                      style={{ marginLeft: 'auto' }}
                    >
                      {t.resetFilters}
                    </Button>
                  </div>
                )}
              </div>

              {/* Cards or Empty State */}
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const postCatDef = BLOG_CATEGORY_DEFINITIONS.find((c) => c.id === post.category);

                  return (
                    <Card
                      key={post.id}
                      className={`blog-card card-day-${postCatDef ? postCatDef.dayCode.toLowerCase() : 'all'}`}
                      onClick={() => handleOpenPost(post)}
                    >
                      <Card.Header>
                        {/* Top Category Badge & Publishing Schedule Meta */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                          {postCatDef && postCatDef.id !== 'all' ? (
                            <BadgeSchedule
                              dayCode={postCatDef.dayCode}
                              style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                            >
                              {postCatDef.title[langKey]}
                            </BadgeSchedule>
                          ) : (
                            <Badge variant="purple" style={{ fontSize: '0.72rem' }} icon={<SparklesIcon size={11} />}>
                              {t.article}
                            </Badge>
                          )}

                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {post.publishedAt} • {post.readTime}
                          </span>
                        </div>

                        <h2 className="blog-title" style={{ fontSize: '1.22rem', marginTop: '4px' }}>{post.title}</h2>
                      </Card.Header>

                      <Card.Body>
                        <p className="blog-summary">{post.summary}</p>
                      </Card.Body>

                      <Card.Footer>
                        <div className="tech-tags-list" style={{ marginTop: 'auto', paddingTop: '10px' }}>
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="default"
                              className={selectedTag === tag ? 'badge-cyan' : ''}
                              interactive={true}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(tag);
                              }}
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </Card.Footer>
                    </Card>
                  );
                })
              ) : (
                <EmptyState
                  icon={<BookOpenIcon size={40} />}
                  title={t.noArticlesFound}
                  description={
                    selectedCategory !== 'all' ? (
                      <>
                        {t.filterByCategory || 'Chuyên đề'}: <strong>{currentCategoryDef.title[langKey]}</strong> ({currentCategoryDef.scheduleFull[langKey]})
                      </>
                    ) : null
                  }
                  actionText={t.resetFilters}
                  onAction={handleResetFilters}
                />
              )}
            </div>

            {/* Load More Button if more month archives exist */}
            {hasMoreMonths && filteredPosts.length > 0 && (
              <div className="blog-load-more-container">
                <Button
                  variant="secondary"
                  onClick={handleLoadMore}
                  isLoading={isLoadingMore}
                  loadingText={t.loadingMore || 'Đang tải dữ liệu...'}
                  style={{ minWidth: '180px' }}
                >
                  <span>{t.loadMoreArticles || 'Tải thêm bài viết'}</span>
                </Button>
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
              <BadgeSchedule dayCode={hoveredCategory.cat.dayCode} icon={<CalendarIcon size={12} />}>
                {hoveredCategory.cat.scheduleFull[langKey]}
              </BadgeSchedule>
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
      <ModalArticle
        post={activePost}
        isOpen={Boolean(activePost)}
        onClose={handleClosePost}
        processedHtml={processedHtml}
        tocItems={tocItems}
        activeHeadingId={activeHeadingId}
        onSelectHeading={handleSelectHeading}
        isStickyTitleShown={isModalHeaderTitleShown}
        modalContentRef={modalContentRef}
        tCommon={tCommon}
        closeAriaLabel="Close article popup"
      />
    </div>
  );
};

Blog.displayName = 'Blog';
export default Blog;

