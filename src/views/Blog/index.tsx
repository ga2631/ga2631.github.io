'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { getBlogPosts, getBlogCategories, getBlogStatistics, BlogCategoryDef } from '@/services/blogService';
import { BlogPost } from '@/types';
import { trackBlogSearch, trackBlogCategoryFilter, trackBlogTagClick } from '@/utils/analytics';

function getCategoryColor(dayCode?: string) {
  switch (dayCode) {
    case 'MON':
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        iconBg: 'bg-blue-100 text-blue-600',
        borderTop: 'border-t-blue-500 hover:border-blue-500',
      };
    case 'TUE':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        iconBg: 'bg-emerald-100 text-emerald-600',
        borderTop: 'border-t-emerald-500 hover:border-emerald-500',
      };
    case 'WED':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        iconBg: 'bg-amber-100 text-amber-600',
        borderTop: 'border-t-amber-500 hover:border-amber-500',
      };
    case 'THU':
      return {
        badge: 'bg-purple-50 text-purple-700 border-purple-200',
        iconBg: 'bg-purple-100 text-purple-600',
        borderTop: 'border-t-purple-500 hover:border-purple-500',
      };
    case 'FRI':
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        iconBg: 'bg-rose-100 text-rose-600',
        borderTop: 'border-t-rose-500 hover:border-rose-500',
      };
    default:
      return {
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        iconBg: 'bg-indigo-100 text-indigo-600',
        borderTop: 'border-t-red-500 hover:border-red-500',
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
  const isEn = currentLang === 'en';
  const POSTS_PER_PAGE = 20;
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [categories, setCategories] = useState<BlogCategoryDef[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(initialPosts.length === 0);
  const articlesContainerRef = useRef<HTMLDivElement>(null);

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

  // Calculate pagination bounds
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (articlesContainerRef.current) {
      if (typeof articlesContainerRef.current.scrollTo === 'function') {
        articlesContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        articlesContainerRef.current.scrollTop = 0;
      }
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setCurrentPage(1);
    if (val.length > 2) {
      trackBlogSearch(val, filteredPosts.length);
    }
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    trackBlogCategoryFilter(catId);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
    trackBlogTagClick(tag);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedTag('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Map category slug to category metadata
  const categoryMap = useMemo(() => {
    const map = new Map<string, BlogCategoryDef>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Mobile Filter Toggle Bar */}
      <div className="lg:hidden shrink-0 mb-3">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-3.5 bg-white backdrop-blur-sm border border-gray-100 border-t-4 border-t-red-500 rounded-2xl shadow-sm text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-red-500 transition-all cursor-pointer"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1 min-h-0 items-stretch">
        {/* LEFT SIDEBAR: Categories (Top) & Tags (Bottom) - Full Height */}
        <aside
          className={`lg:col-span-4 xl:col-span-3 space-y-4 lg:h-full lg:max-h-full flex flex-col min-h-0 relative z-30 ${isMobileFilterOpen ? 'block' : 'hidden lg:flex'
            }`}
        >
          {/* Section 1: Categories (Top) with Rich Hover Popover on the Right */}
          <div className="bg-white backdrop-blur-sm border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all ease-in-out shrink-0 overflow-visible relative">
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

            {isLoading || categories.length === 0 ? (
              <div className="space-y-1.5 py-1" role="status" aria-label="Loading categories">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl animate-pulse">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                      <div className="w-7 h-7 rounded-lg bg-gray-100 shrink-0" />
                      <div
                        className="h-3.5 bg-gray-100 rounded"
                        style={{ width: `${55 + (i * 11) % 35}%` }}
                      />
                    </div>
                    <div className="w-5 h-3.5 bg-gray-100 rounded-full shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const title = cat.title[currentLang] || cat.title.vi || cat.id;
                  const description = cat.description[currentLang] || cat.description.vi || '';
                  const scheduleFull = cat.scheduleFull[currentLang] || cat.scheduleFull.vi || '';
                  const scheduleDay = cat.scheduleDay[currentLang] || cat.scheduleDay.vi || '';
                  const count = statistics.categoryCounts[cat.id] || 0;
                  const colors = getCategoryColor(cat.dayCode);

                  return (
                    <div key={cat.id} className="relative group/cat">
                      <button
                        type="button"
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all text-left border cursor-pointer ${isSelected
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
                          className={`text-xs px-2 py-0.5 rounded-full font-mono shrink-0 ${isSelected
                            ? 'bg-red-600 text-white font-bold'
                            : 'bg-gray-100 text-gray-600 font-semibold'
                            }`}
                        >
                          {count}
                        </span>
                      </button>

                      {/* Popover Card on Hover (Displays to the Right with Left Arrow) */}
                      <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 w-80 pointer-events-none opacity-0 invisible -translate-x-2 transition-all duration-200 ease-out group-hover/cat:opacity-100 group-hover/cat:visible group-hover/cat:translate-x-0 group-hover/cat:pointer-events-auto">
                        <div className="relative bg-white backdrop-blur-sm border border-gray-100 border-t-4 border-t-red-500 rounded-3xl p-5 shadow-xl text-left space-y-2.5">
                          {/* Pointer Arrow pointing directly Left to the Category */}
                          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l border-b border-gray-100 rotate-45 z-10" />

                          {/* Popover Top Bar */}
                          <div className="flex items-center justify-between gap-2 relative z-20">
                            <span
                              className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colors.badge}`}
                            >
                              {scheduleDay}
                            </span>
                            <span className="text-[11px] font-mono text-gray-500 font-medium">
                              {count} {isEn ? 'articles' : 'bài viết'}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-sm font-bold text-gray-900 leading-snug relative z-20">
                            {title}
                          </h4>

                          {/* Description (Chuyên đề này nói về điều gì) */}
                          {description && (
                            <p className="text-xs text-gray-600 leading-relaxed relative z-20">
                              {description}
                            </p>
                          )}

                          {/* Schedule (Lịch đăng bài là khi nào) */}
                          <div className="pt-2.5 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-700 font-medium relative z-20">
                            <svg className="w-3.5 h-3.5 text-red-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>
                              <strong className="text-gray-900">{isEn ? 'Schedule:' : 'Lịch đăng:'}</strong> {scheduleFull}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Tags & Keywords (Bottom) - Fills remaining space & scrollable independently */}
          <div className="bg-white backdrop-blur-sm border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all ease-in-out lg:flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 shrink-0">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                <path d="M7 7h.01" />
              </svg>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                {dict.blog.tagsTitle || 'Thẻ & Từ khoá'}
              </h3>
            </div>

            {isLoading || statistics.allTags.length === 0 ? (
              <div className="flex-1 overflow-y-auto pr-1.5 flex flex-wrap content-start gap-1.5 min-h-0 max-h-60 lg:max-h-none" role="status" aria-label="Loading tags">
                {[72, 88, 64, 96, 68, 80, 60, 92, 76, 68, 84, 60].map((w, idx) => (
                  <div
                    key={idx}
                    className="h-6.5 bg-gray-100 rounded-lg animate-pulse"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1.5 flex flex-wrap content-start gap-1.5 min-h-0 max-h-60 lg:max-h-none custom-scrollbar">
                {/* All Tags Pill */}
                <button
                  type="button"
                  onClick={() => handleTagSelect('all')}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${selectedTag === 'all'
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
                      className={`text-xs px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${isSelected
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
            )}
          </div>
        </aside>

        {/* RIGHT MAIN AREA: Fixed full height matching sidebar & viewport */}
        <div className="lg:col-span-8 xl:col-span-9 lg:h-full lg:max-h-full flex flex-col min-h-0 min-w-0">
          {/* Top Section: Header & Search Bar (shrink-0) */}
          <div className="shrink-0 space-y-3 pb-3">
            {/* Hero Header */}
            <div className="text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {dict.blog.title}
              </h1>
              <p className="text-sm text-gray-500">{dict.blog.subtitle}</p>
            </div>

            {/* Sticky Search Input */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 z-10">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={dict.blog.searchPlaceholder}
                className="block w-full p-2.5 pl-10 pr-10 text-sm text-gray-900 border border-gray-200 rounded-2xl bg-white backdrop-blur-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Active Filter Chips */}
            {(selectedCategory !== 'all' || selectedTag !== 'all' || searchQuery) && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
                <span className="text-gray-500 font-medium">
                  {isEn ? 'Filtering by:' : 'Đang lọc theo:'}
                </span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
                    <span>
                      {categoryMap.get(selectedCategory)?.title[currentLang] ||
                        categoryMap.get(selectedCategory)?.title.vi ||
                        selectedCategory}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect('all')}
                      className="hover:text-red-900 font-bold ml-0.5 cursor-pointer"
                      title="Clear category filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedTag !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
                    <span>#{selectedTag}</span>
                    <button
                      type="button"
                      onClick={() => handleTagSelect('all')}
                      className="hover:text-red-900 font-bold ml-0.5 cursor-pointer"
                      title="Clear tag filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                    <span>&ldquo;{searchQuery}&rdquo;</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="hover:text-gray-900 font-bold ml-0.5 cursor-pointer"
                      title="Clear search"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-gray-400 hover:text-red-600 underline ml-1 cursor-pointer font-medium"
                >
                  {isEn ? 'Clear all' : 'Xoá tất cả'}
                </button>
              </div>
            )}
          </div>

          {/* Middle Section: Scrollable Articles Area (flex-1 min-h-0 overflow-y-auto) */}
          <div
            ref={articlesContainerRef}
            className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-1.5 custom-scrollbar"
          >
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-3" role="status" aria-label="Loading articles">
                {/* Article Skeleton Cards in CV Box Style */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-red-200/60 animate-pulse flex flex-col justify-between min-h-[220px]"
                  >
                    <div>
                      {/* Category Badge Skeleton */}
                      <div className="h-5 w-28 bg-gray-100 rounded-full mb-3" />
                      {/* Date & Read Time Skeleton */}
                      <div className="h-3 w-36 bg-gray-100 rounded mb-3" />
                      {/* Title Lines Skeleton */}
                      <div className="h-5 w-4/5 bg-gray-200 rounded mb-2" />
                      <div className="h-5 w-3/5 bg-gray-200 rounded mb-4" />
                      {/* Summary Lines Skeleton */}
                      <div className="h-3 w-full bg-gray-100 rounded mb-1.5" />
                      <div className="h-3 w-5/6 bg-gray-100 rounded" />
                    </div>
                    {/* Tags Skeleton */}
                    <div className="flex gap-2 pt-3 border-t border-gray-50">
                      <div className="h-5 w-16 bg-gray-100 rounded-md" />
                      <div className="h-5 w-20 bg-gray-100 rounded-md" />
                      <div className="h-5 w-14 bg-gray-100 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-16 text-center bg-white backdrop-blur-sm border border-gray-100 border-t-4 border-t-red-500 rounded-3xl p-8 max-w-xl mx-auto shadow-sm hover:shadow-lg transition-all ease-in-out">
                <div className="text-3xl mb-3">🔍</div>
                <p className="text-sm text-gray-800 font-semibold mb-1">
                  {dict.blog.noPostsFound}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-xs font-medium text-white rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {dict.common.retry}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-3">
                {paginatedPosts.map((post) => {
                  const catDef = post.category ? categoryMap.get(post.category) : undefined;
                  const catTitle =
                    post.categoryName ||
                    catDef?.title[currentLang] ||
                    catDef?.title.vi ||
                    post.category ||
                    '';
                  const catColors = getCategoryColor(catDef?.dayCode);

                  return (
                    <article
                      key={post.id}
                      className={`bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 border-t-4 ${catColors.borderTop} hover:shadow-lg transition-all ease-in-out flex flex-col justify-between group`}
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
                              className="text-[11px] font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
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
            )}
          </div>

          {/* Bottom Section: Pagination Bar (shrink-0) */}
          {filteredPosts.length > 0 && (
            <div className="shrink-0 pt-3 pb-1 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-3 text-xs bg-gray-50/90 backdrop-blur-xs">
              {/* Summary Count & Current Page Indicator */}
              <div className="text-gray-500 font-medium">
                {isEn ? (
                  <span>
                    Page <strong className="text-gray-900">{currentPage}</strong> /{' '}
                    <strong className="text-gray-900">{totalPages}</strong>{' '}
                    <span className="text-gray-400 font-mono">({filteredPosts.length} articles)</span>
                  </span>
                ) : (
                  <span>
                    Trang <strong className="text-gray-900">{currentPage}</strong> /{' '}
                    <strong className="text-gray-900">{totalPages}</strong>{' '}
                    <span className="text-gray-400 font-mono">({filteredPosts.length} bài viết)</span>
                  </span>
                )}
              </div>

              {/* Navigation Controls */}
              {totalPages > 1 ? (
                <div className="flex items-center gap-1.5">
                  {/* Prev Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2.5 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1 ${currentPage === 1
                      ? 'border-gray-200 text-gray-400 bg-gray-100/50 cursor-not-allowed opacity-60'
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 cursor-pointer shadow-2xs'
                      }`}
                    aria-label="Previous page"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>{isEn ? 'Prev' : 'Trước'}</span>
                  </button>

                  {/* Numbered Page Buttons */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((p, idx) => {
                      if (p === '...') {
                        return (
                          <span key={`dots-${idx}`} className="px-1.5 py-1 text-gray-400 font-mono text-xs">
                            ...
                          </span>
                        );
                      }
                      const pageNum = p as number;
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono text-xs font-semibold transition-colors cursor-pointer ${isActive
                            ? 'bg-red-600 text-white shadow-2xs'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2.5 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1 ${currentPage === totalPages
                      ? 'border-gray-200 text-gray-400 bg-gray-100/50 cursor-not-allowed opacity-60'
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 cursor-pointer shadow-2xs'
                      }`}
                    aria-label="Next page"
                  >
                    <span>{isEn ? 'Next' : 'Sau'}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
