'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { getBlogPosts, getBlogCategories, BlogCategoryDef } from '@/services/blogService';
import { BlogPost } from '@/types';
import { trackBlogSearch, trackBlogCategoryFilter, trackBlogTagClick } from '@/utils/analytics';

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
  const [isLoading, setIsLoading] = useState<boolean>(initialPosts.length === 0);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
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
  }, [currentLang]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => (p.tags || []).forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [posts]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length > 2) {
      trackBlogSearch(val, filteredPosts.length);
    }
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    trackBlogCategoryFilter(catId);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    trackBlogTagClick(tag);
  };

  return (
    <div className="space-y-10">
      {/* Blog Hero & Search */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {dict.blog.title}
        </h1>
        <p className="text-sm text-gray-400">{dict.blog.subtitle}</p>

        {/* Search Input Bar */}
        <div className="relative max-w-xl mx-auto pt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={dict.blog.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-900/90 border border-gray-700/80 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-md"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3.5 top-5.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Category Pills Bar */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const title = cat.title[currentLang] || cat.title.vi || cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                    : 'bg-gray-900/80 hover:bg-gray-800 text-gray-300 border border-gray-800'
                }`}
              >
                <span>{cat.dayCode === 'ALL' ? '📚' : '📌'}</span>
                <span>{title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Tags Filter Chips */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 max-w-4xl mx-auto justify-center">
          <button
            onClick={() => handleTagSelect('all')}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-colors ${
              selectedTag === 'all'
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-semibold'
                : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-gray-200'
            }`}
          >
            #all
          </button>
          {allTags.map((tg) => (
            <button
              key={tg}
              onClick={() => handleTagSelect(tg)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-colors ${
                selectedTag === tg
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-semibold'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-gray-200'
              }`}
            >
              #{tg}
            </button>
          ))}
        </div>
      )}

      {/* Articles Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3" />
          <p className="text-gray-400 text-xs">{dict.common.loading}</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-16 text-center glass-panel rounded-3xl p-8 max-w-xl mx-auto border border-gray-800">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm text-gray-300 font-medium mb-1">{dict.blog.noPostsFound}</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag('all');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-white rounded-lg transition-colors"
          >
            {dict.common.retry}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="glass-panel p-6 rounded-2xl border border-gray-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3 font-mono">
                  <span>{post.date}</span>
                  <span className="text-indigo-400 font-semibold">{post.readTime}</span>
                </div>

                <Link href={getLocalizedHref(`blog/${post.slug}`)}>
                  <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed mb-4">
                  {post.summary}
                </p>
              </div>

              <div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tg, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-gray-900 text-gray-400 text-[10px] font-mono border border-gray-800"
                      >
                        #{tg}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">{post.author}</span>
                  <Link
                    href={getLocalizedHref(`blog/${post.slug}`)}
                    className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>Read</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
