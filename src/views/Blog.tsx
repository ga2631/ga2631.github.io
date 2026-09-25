import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BlogPost } from '../types/index.ts';
import {
  BookOpenIcon,
  CalendarIcon,
  FilterIcon,
} from '../components/Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { BLOG_CATEGORY_DEFINITIONS, BlogCategoryDef } from '../data/blog/blogCategories.ts';
import {
  loadInitialBlogPosts,
  loadNextMonthBatch,
  loadAllArchivePosts,
  getEagerPosts,
} from '../services/blogService.ts';
import { Button, Badge } from '../components/common';
import { SectionHeader } from '../components/ui';
import {
  BlogSidebar,
  BlogInputFilter,
  BlogItem,
  EmptyState,
  BadgeSchedule,
  BlogTopic,
  ModalArticle,
  processArticleToc,
} from '../components/composite';
import {
  trackBlogPostView,
  trackBlogSearch,
  trackBlogCategoryFilter,
  trackBlogTagClick,
  trackEvent,
} from '../utils/analytics';

export interface BlogProps {
  posts: BlogPost[];
  t: UITranslation['blog'];
  tCommon: UITranslation['common'];
}

export const Blog: React.FC<BlogProps> = ({ posts, t, tCommon }) => {
  // Detect language: VI or EN based on translation string
  const langKey = useMemo<'vi' | 'en'>(() => {
    return t.allTopics === 'Tất cả chủ đề' || !t.allTopics.toLowerCase().includes('all') ? 'vi' : 'en';
  }, [t.allTopics]);

  // Full catalog of all published articles for accurate global statistics and search filtering
  const [fullCatalog, setFullCatalog] = useState<BlogPost[]>(() => {
    if (posts && posts.length > 0) return posts;
    return getEagerPosts(langKey);
  });

  // Paginated slice rendered into the HTML DOM (starts with initial 20 articles max)
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>(() => {
    if (posts && posts.length > 0) {
      return posts.slice(0, 20);
    }
    return getEagerPosts(langKey).slice(0, 20);
  });

  const [, setLoadedMonthKeys] = useState<string[]>([]);
  const [hasMoreMonths, setHasMoreMonths] = useState<boolean>(() => {
    const total = posts && posts.length > 0 ? posts.length : getEagerPosts(langKey).length;
    return total > 20;
  });
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

  // Sync with incoming posts prop (e.g. language toggle)
  useEffect(() => {
    if (posts && posts.length > 0) {
      setFullCatalog(posts);
      setDisplayedPosts(posts.slice(0, 20));
      setHasMoreMonths(posts.length > 20);
    }
  }, [posts]);

  // Initial load: 20 latest articles by default + fetch full catalog for global stats
  useEffect(() => {
    let isMounted = true;
    loadInitialBlogPosts(langKey, 20).then((res) => {
      if (isMounted) {
        setDisplayedPosts(res.posts);
        setLoadedMonthKeys(res.loadedMonthKeys);
        setHasMoreMonths(res.hasMore);
      }
    });
    loadAllArchivePosts(langKey).then((all) => {
      if (isMounted) {
        setFullCatalog(all);
        setHasMoreMonths(all.length > 20);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [langKey]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreMonths) return;
    setIsLoadingMore(true);
    try {
      const res = await loadNextMonthBatch(langKey, displayedPosts.length, 20);
      setDisplayedPosts((prev) => {
        const existingKeys = new Set(prev.map((p) => p.slug || p.id));
        const newUnique = res.posts.filter((p) => !existingKeys.has(p.slug || p.id));
        const updated = [...prev, ...newUnique];
        setHasMoreMonths(updated.length < fullCatalog.length);
        return updated;
      });
      setLoadedMonthKeys((prev) => Array.from(new Set([...prev, ...res.loadedMonthKeys])));
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

  // Extract all unique tags across ALL published posts in the catalog
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    fullCatalog.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [fullCatalog]);

  // Count articles per category across ALL published posts in the catalog
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: fullCatalog.length };
    BLOG_CATEGORY_DEFINITIONS.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = fullCatalog.filter((p) => p.category === cat.id).length;
      }
    });
    return counts;
  }, [fullCatalog]);

  // Count articles per tag across ALL published posts in the catalog
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    fullCatalog.forEach((post) => {
      post.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [fullCatalog]);

  // Sync with URL hash for deep linking (e.g. #/blog/post-slug)
  useEffect(() => {
    const checkHashForPost = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/blog/') && hash.length > 7) {
        const slug = hash.replace('#/blog/', '');
        const matchedPost = fullCatalog.find((p) => p.slug === slug || p.id === slug);
        if (matchedPost) {
          setActivePost(matchedPost);
        }
      }
    };

    checkHashForPost();
    window.addEventListener('hashchange', checkHashForPost);
    return () => window.removeEventListener('hashchange', checkHashForPost);
  }, [fullCatalog]);

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
    trackBlogPostView({
      id: post.id,
      slug: post.slug,
      title: post.title,
      category: post.category,
      tags: post.tags,
    });
  };

  const handleClosePost = () => {
    setActivePost(null);
    setIsModalHeaderTitleShown(false);
    window.location.hash = '#/blog';
  };

  const isFiltering = selectedCategory !== 'all' || selectedTag !== 'all' || !!searchQuery.trim();

  // Filter posts based on category, search query, and selected tag:
  // When active filters/search are set, query from fullCatalog.
  // When on default unfiltered view, render ONLY displayedPosts (initial 20, paginated) to keep DOM lightweight!
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const sourcePosts = isFiltering ? fullCatalog : displayedPosts;

    return sourcePosts.filter((post) => {
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
  }, [isFiltering, fullCatalog, displayedPosts, searchQuery, selectedCategory, selectedTag]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTag('all');
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
            {filteredPosts.length}
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

        {/* ================= LEFT SIDEBAR (Composed via BlogSidebar: BlogTopic + BlogTagsKeyword) ================= */}
        <BlogSidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          categories={BLOG_CATEGORY_DEFINITIONS}
          selectedCategory={selectedCategory}
          categoryCounts={categoryCounts}
          categoriesTitle={t.categoriesTitle}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            trackBlogCategoryFilter(catId);
          }}
          onHoverCategory={setHoveredCategory}
          tags={allTags}
          selectedTag={selectedTag}
          tagCounts={tagCounts}
          totalPostsCount={fullCatalog.length}
          allTopicsLabel={t.allTopics}
          tagsTitle={t.tagsTitle}
          onSelectTag={(tag) => {
            setSelectedTag(tag);
            trackBlogTagClick(tag);
          }}
          langKey={langKey}
        />

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <main
          className="blog-main-scroll-area"
          onScroll={(e) => setIsFilterStuck(e.currentTarget.scrollTop > 40)}
        >
          <div className="blog-main-inner-content">
            {/* Header Hero using SectionHeader */}
            <SectionHeader
              align="left"
              className="blog-hero-header"
              title={<h1 className="section-title">{t.title}</h1>}
              subtitle={t.subtitle}
            />

            {/* Articles Grid (Wraps Sticky Filter Controls & Article Cards) */}
            <div className="blog-grid">
              {/* Search & Active Filters via BlogInputFilter */}
              <BlogInputFilter
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  if (q.trim().length > 2) {
                    trackBlogSearch(q, filteredPosts.length);
                  }
                }}
                searchPlaceholder={t.searchPlaceholder}
                selectedCategory={selectedCategory}
                selectedCategoryTitle={currentCategoryDef.title[langKey]}
                onClearCategory={() => setSelectedCategory('all')}
                selectedTag={selectedTag}
                onClearTag={() => setSelectedTag('all')}
                onResetAll={handleResetFilters}
                isStuck={isFilterStuck}
                activeFiltersLabel={t.activeFilters}
                categoryFilterLabel={t.filterByCategory}
                tagFilterLabel={t.filterByTag}
                resetLabel={t.resetFilters}
              />

              {/* Cards or Empty State */}
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const postCatDef = BLOG_CATEGORY_DEFINITIONS.find((c) => c.id === post.category);

                  return (
                    <BlogItem
                      key={post.slug || post.id}
                      post={post}
                      categoryDef={postCatDef}
                      langKey={langKey}
                      selectedTag={selectedTag}
                      tagPrefix="#"
                      onTagClick={(tag) => setSelectedTag(tag)}
                      onSelect={handleOpenPost}
                    />
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

            {/* Load More Button if more articles exist in unfiltered paginated view */}
            {!isFiltering && hasMoreMonths && filteredPosts.length > 0 && (
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
