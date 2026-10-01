'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button, Badge, Spinner } from 'flowbite-react';
import { BlogPost } from '../types/index.ts';
import {
  BookOpenIcon,
  CalendarIcon,
  FilterIcon,
} from '../components/Icons.tsx';
import { UITranslation } from '../i18n';
import {
  loadInitialBlogPosts,
  loadNextMonthBatch,
  loadAllArchivePosts,
  getPostContentHtml,
  getBlogCategories,
  BlogCategoryDef,
} from '../services/blogService';
import { SectionHeader } from '../components/ui';
import {
  BlogSidebar,
  BlogInputFilter,
  BlogItem,
  EmptyState,
  BadgeSchedule,
  ModalArticle,
  processArticleToc,
} from '../components/composite';
import {
  trackBlogPostView,
  trackBlogSearch,
  trackBlogCategoryFilter,
  trackBlogTagClick,
} from '../utils/analytics';

export interface BlogProps {
  posts: BlogPost[];
  categories?: BlogCategoryDef[];
  t: UITranslation['blog'];
  tCommon: UITranslation['common'];
}

export const Blog: React.FC<BlogProps> = ({ posts, categories, t, tCommon }) => {
  // Detect language: VI or EN based on translation string
  const langKey = useMemo<'vi' | 'en'>(() => {
    return t.allTopics === 'Tất cả chủ đề' || !t.allTopics.toLowerCase().includes('all') ? 'vi' : 'en';
  }, [t.allTopics]);

  // Dynamic Categories list from Supabase
  const [categoriesList, setCategoriesList] = useState<BlogCategoryDef[]>(() => categories || []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoriesList(categories);
    } else {
      getBlogCategories().then((cats) => {
        setCategoriesList(cats);
      });
    }
  }, [categories]);

  // Full catalog of all published articles for accurate global statistics and search filtering
  const [fullCatalog, setFullCatalog] = useState<BlogPost[]>(() => {
    return posts || [];
  });

  // Paginated slice rendered into the HTML DOM (starts with initial 20 articles max)
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>(() => {
    return (posts || []).slice(0, 20);
  });

  const [, setLoadedMonthKeys] = useState<string[]>([]);
  const [hasMoreMonths, setHasMoreMonths] = useState<boolean>(() => {
    return (posts || []).length > 20;
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
      setActivePost((prev) => {
        if (!prev) return null;
        return posts.find((p) => p.slug === prev.slug || p.id === prev.id) || prev;
      });
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
        setActivePost((prev) => {
          if (!prev) return null;
          return all.find((p) => p.slug === prev.slug || p.id === prev.id) || prev;
        });
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
    const rawHtml = getPostContentHtml(activePost);
    return processArticleToc(rawHtml);
  }, [activePost]);

  // Scrollspy to highlight active TOC heading and toggle header title when scrolling inside modal
  useEffect(() => {
    if (!activePost) return;

    const container = modalContentRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const offsetThreshold = 140;

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
    categoriesList.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = fullCatalog.filter((p) => p.category === cat.id).length;
      }
    });
    return counts;
  }, [fullCatalog, categoriesList]);

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

  // Sync with URL hash for deep linking
  useEffect(() => {
    const checkHashForPost = () => {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        const slug = hash.replace(/^#\/?(blog\/)?/, '');
        if (slug) {
          const matchedPost = fullCatalog.find((p) => p.slug === slug || p.id === slug);
          if (matchedPost) {
            setActivePost(matchedPost);
          }
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

  const handleOpenPost = (post: BlogPost) => {
    setActivePost(post);
    setIsModalHeaderTitleShown(false);
    window.location.hash = `#${post.slug}`;
    trackBlogPostView(
      {
        id: post.id,
        slug: post.slug,
        title: post.title,
        category: post.category,
        tags: post.tags,
      },
      langKey
    );
  };

  const handleClosePost = () => {
    setActivePost(null);
    setIsModalHeaderTitleShown(false);
    if (typeof window !== 'undefined') {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      } else {
        window.location.hash = '';
      }
    }
  };

  const isFiltering = selectedCategory !== 'all' || selectedTag !== 'all' || !!searchQuery.trim();

  // Filter posts based on category, search query, and selected tag
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

  const currentCategoryDef = useMemo(() => {
    const found = categoriesList.find((c) => c.id === selectedCategory);
    if (found) return found;
    return categoriesList[0] || {
      id: 'all',
      dayCode: 'ALL',
      scheduleDay: { vi: 'T2 - T6', en: 'Mon - Fri' },
      scheduleFull: { vi: 'Thứ 2 – Thứ 6', en: 'Mon - Fri' },
      title: { vi: 'Tất cả chuyên đề', en: 'All Topics' },
      description: { vi: '', en: '' },
      iconName: 'BookOpenIcon',
    };
  }, [categoriesList, selectedCategory]);

  return (
    <div className="w-full min-h-screen bg-gray-50 relative">
      {/* Mobile Top Filter Trigger Bar */}
      <div className="lg:hidden sticky top-[72px] z-30 px-4 py-2.5 bg-white/90 backdrop-blur-md border-b border-gray-200 flex items-center justify-between shadow-xs">
        <Button
          color="light"
          size="xs"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-expanded={isMobileSidebarOpen}
        >
          <span className="flex items-center gap-2">
            <FilterIcon size={14} />
            <span>{t.categoriesTitle || 'Chuyên đề'}</span>
            <Badge color="info" size="xs">
              {filteredPosts.length}
            </Badge>
          </span>
        </Button>
      </div>

      {/* Full-Height App Layout */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
        {/* Mobile Backdrop for Sidebar Drawer */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-xs lg:hidden transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ================= LEFT SIDEBAR ================= */}
        <BlogSidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          categories={categoriesList}
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
          className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8"
          onScroll={(e) => setIsFilterStuck(e.currentTarget.scrollTop > 40)}
        >
          <div className="max-w-4xl mx-auto">
            {/* Header Hero using SectionHeader */}
            <SectionHeader
              align="left"
              className="mb-8"
              title={<h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{t.title}</h1>}
              subtitle={t.subtitle}
            />

            {/* Articles Container */}
            <div className="flex flex-col">
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
                selectedCategoryTitle={currentCategoryDef.title ? currentCategoryDef.title[langKey] : ''}
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

              {/* Cards Grid or Empty State */}
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => {
                    const postCatDef = categoriesList.find((c) => c.id === post.category);

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
                  })}
                </div>
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

            {/* Load More Button */}
            {!isFiltering && hasMoreMonths && filteredPosts.length > 0 && (
              <div className="flex justify-center mt-10 mb-6">
                <Button
                  color="light"
                  size="md"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="min-w-[180px]"
                >
                  {isLoadingMore ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span>{t.loadingMore || 'Đang tải dữ liệu...'}</span>
                    </span>
                  ) : (
                    <span>{t.loadMoreArticles || 'Tải thêm bài viết'}</span>
                  )}
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
            className="fixed z-50 p-4 bg-white border border-gray-200 rounded-lg shadow-xl max-w-xs pointer-events-none text-left flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150"
            style={{
              top: `${hoveredCategory.top}px`,
              left: `${hoveredCategory.left}px`,
              transform: 'translateY(-50%)',
            }}
          >
            <div>
              <BadgeSchedule dayCode={hoveredCategory.cat.dayCode} icon={<CalendarIcon size={12} />}>
                {hoveredCategory.cat.scheduleFull[langKey]}
              </BadgeSchedule>
            </div>
            <div className="font-bold text-sm text-gray-900 leading-snug">
              {hoveredCategory.cat.title[langKey]}
            </div>
            <div className="text-xs text-gray-600 leading-relaxed">
              <strong className="text-red-600 font-semibold mr-1">
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

export default Blog;
