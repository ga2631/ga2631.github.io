'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { getBlogPosts, getBlogCategories, getBlogStatistics, BlogCategoryDef } from '@/services/blogService';
import { BlogPost } from '@/types';
import { trackBlogSearch, trackBlogCategoryFilter, trackBlogTagClick } from '@/utils/analytics';
import { LoadingModal } from '@/components/common/LoadingModal';

function getCategoryColor(dayCode?: string) {
  switch (dayCode) {
    case 'MON':
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        iconBg: 'bg-blue-100 text-blue-600',
      };
    case 'TUE':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        iconBg: 'bg-emerald-100 text-emerald-600',
      };
    case 'WED':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        iconBg: 'bg-amber-100 text-amber-600',
      };
    case 'THU':
      return {
        badge: 'bg-purple-50 text-purple-700 border-purple-200',
        iconBg: 'bg-purple-100 text-purple-600',
      };
    case 'FRI':
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        iconBg: 'bg-rose-100 text-rose-600',
      };
    default:
      return {
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        iconBg: 'bg-indigo-100 text-indigo-600',
      };
  }
}

function renderCategoryIcon(dayCode?: string) {
  switch (dayCode) {
    case 'MON': // Architecture (Layers)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case 'TUE': // Data (Database)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case 'WED': // DevOps (Server)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
          <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      );
    case 'THU': // Programming (Code)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'FRI': // Tech Radar (Sparkles)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      );
    default: // All (Book)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
  }
}

export function BlogView({
  initialPosts = [],
  initialCategories = [],
}: {
  initialPosts?: BlogPost[];
  initialCategories?: BlogCategoryDef[];
}) {
  const { dict, currentLang, getLocalizedHref } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [categories, setCategories] = useState<BlogCategoryDef[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(initialPosts.length === 0);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (initialPosts.length === 0) {
        setIsLoading(true);
      }
      try {
        const [loadedPosts, loadedCats] = await Promise.all([
          getBlogPosts(currentLang),
          getBlogCategories(),
        ]);
        if (isMounted) {
          setPosts(loadedPosts);
          setCategories(loadedCats);
        }
      } catch (err) {
        console.warn('[BlogView] Error loading blog data from Supabase:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [currentLang, initialPosts.length]);

  // Compute statistics: category counts and tag counts
  const statistics = useMemo(() => {
    return getBlogStatistics(posts, categories);
  }, [posts, categories]);

  // Filter posts based on category, tag, and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory =
        selectedCategory === 'all' || post.category === selectedCategory;
      const matchTag =
        selectedTag === 'all' || (post.tags && post.tags.includes(selectedTag));
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(query)));

      return matchCategory && matchTag && matchSearch;
    });
  }, [posts, selectedCategory, selectedTag, searchQuery]);

  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setVisibleCount(20);
    if (val.length > 2) {
      trackBlogSearch(val, filteredPosts.length);
    }
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setVisibleCount(20);
    trackBlogCategoryFilter(catId);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setVisibleCount(20);
    trackBlogTagClick(tag);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedTag('all');
    setSearchQuery('');
    setVisibleCount(20);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  // Map category slug to category metadata
  const categoryMap = useMemo(() => {
    const map = new Map<string, BlogCategoryDef>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Mobile Filter Toggle Bar */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-red-500 transition-colors"
          aria-expanded={isMobileFilterOpen}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>{dict.blog.filterToggle || 'Chuyên đề & Bộ lọc'}</span>
          </div>
          <span className="bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-red-200">
            {filteredPosts.length}
          </span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR: Categories & Tags */}
        <aside
          className={`lg:col-span-4 xl:col-span-3 space-y-6 ${
            isMobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Section 1: Categories */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                {dict.blog.categoriesTitle || 'Chuyên đề'}
              </h3>
            </div>

            <div className="space-y-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const title = cat.title[currentLang] || cat.title.vi || cat.id;
                const count = statistics.categoryCounts[cat.id] || 0;
                const colors = getCategoryColor(cat.dayCode);

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all text-left border ${
                      isSelected
                        ? 'bg-red-50 text-red-700 font-semibold border-red-200 shadow-2xs'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colors.iconBg}`}
                      >
                        {renderCategoryIcon(cat.dayCode)}
                      </div>
                      <span className="truncate">{title}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono shrink-0 ${
                        isSelected
                          ? 'bg-red-600 text-white font-bold'
                          : 'bg-gray-100 text-gray-600 font-semibold'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Tags & Keywords */}
          {statistics.allTags.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                  <path d="M7 7h.01" />
                </svg>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  {dict.blog.tagsTitle || 'Thẻ & Từ khoá'}
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-96 overflow-y-auto pr-1">
                {/* All Tags Pill */}
                <button
                  type="button"
                  onClick={() => handleTagSelect('all')}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                    selectedTag === 'all'
                      ? 'bg-red-600 text-white font-semibold shadow-2xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  <span>{dict.blog.allTags || 'Tất cả Thẻ & Từ khoá'}</span>
                  <span className={`text-[10px] font-mono ${selectedTag === 'all' ? 'text-red-100' : 'text-gray-500'}`}>
                    ({posts.length})
                  </span>
                </button>

                {/* Tag Pills */}
                {statistics.allTags.map((tg) => {
                  const isSelected = selectedTag === tg;
                  const count = statistics.tagCounts[tg] || 0;

                  return (
                    <button
                      key={tg}
                      type="button"
                      onClick={() => handleTagSelect(tg)}
                      className={`text-xs px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                        isSelected
                          ? 'bg-red-600 text-white font-semibold shadow-2xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      <span>#{tg}</span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-red-100' : 'text-gray-500'}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT MAIN AREA: Hero Header, Search & Article Grid */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Hero Header */}
          <div className="text-left space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {dict.blog.title}
            </h1>
            <p className="text-sm text-gray-500">{dict.blog.subtitle}</p>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={dict.blog.searchPlaceholder}
              className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Articles Section */}
          {isLoading ? (
            <LoadingModal variant="inline" message={dict.common.loadingSupabase} />
          ) : filteredPosts.length === 0 ? (
            <div className="py-16 text-center bg-white border border-gray-200 rounded-2xl p-8 max-w-xl mx-auto shadow-xs">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-sm text-gray-800 font-semibold mb-1">
                {dict.blog.noPostsFound}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-xs font-medium text-white rounded-xl transition-colors shadow-xs"
              >
                {dict.common.retry}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedPosts.map((post) => {
                  const catDef = post.category ? categoryMap.get(post.category) : undefined;
                  const catTitle =
                    catDef?.title[currentLang] || catDef?.title.vi || post.category || '';
                  const catColors = getCategoryColor(catDef?.dayCode);

                  return (
                    <article
                      key={post.id}
                      className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Category Badge Pill */}
                        <div className="mb-2.5">
                          <span
                            className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${catColors.badge}`}
                          >
                            {catTitle}
                          </span>
                        </div>

                        {/* Date & Read Time */}
                        <div className="flex items-center text-xs text-gray-500 font-medium mb-2 gap-1.5 font-mono">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span className="text-gray-700">{post.readTime}</span>
                        </div>

                        {/* Title */}
                        <Link href={getLocalizedHref(`blog/${post.slug}`)}>
                          <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h2>
                        </Link>

                        {/* Summary */}
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed mt-2.5">
                          {post.summary}
                        </p>
                      </div>

                      {/* Footer Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-gray-100">
                          {post.tags.slice(0, 4).map((tg, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleTagSelect(tg)}
                              className="text-[11px] font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 px-2 py-0.5 rounded-md transition-colors"
                            >
                              #{tg}
                            </button>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              {/* Load More Button */}
              {filteredPosts.length > visibleCount && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-red-600 focus:outline-hidden focus:ring-2 focus:ring-red-500 shadow-xs transition-colors"
                  >
                    {dict.blog.loadMore || 'Tải thêm bài viết'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
