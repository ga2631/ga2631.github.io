'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AdminPost, AdminCategory, AdminTag } from '@/services/blogAdminService';
import { CmsPostEditor } from './CmsPostEditor';
import { CmsTab } from '@/components/layouts/CmsLayout';
import { getCategoryColorClasses } from '@/utils/categoryColors';

interface CmsPostsProps {
  posts: AdminPost[];
  categories: AdminCategory[];
  tags: AdminTag[];
  isLoading: boolean;
  editingPost: AdminPost | null;
  onSetEditingPost: (post: AdminPost | null) => void;
  onSavePost: (post: AdminPost) => Promise<void>;
  onDeletePost: (id: string, slug: string) => Promise<void>;
  onCreateNewPost: () => void;
  onSelectTab?: (tab: CmsTab) => void;
  currentLang: string;
}

export function CmsPosts({
  posts,
  categories,
  tags,
  isLoading,
  editingPost,
  onSetEditingPost,
  onSavePost,
  onDeletePost,
  onCreateNewPost,
  onSelectTab,
  currentLang,
}: CmsPostsProps) {
  const isEn = currentLang === 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Category map for instant lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, AdminCategory>();
    categories.forEach((c) => {
      if (c.id) map.set(c.id, c);
      if (c.slug) map.set(c.slug, c);
    });
    return map;
  }, [categories]);

  // Statistics calculation
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().substring(0, 10);
    let published = 0;
    let scheduled = 0;
    let drafts = 0;

    posts.forEach((p) => {
      if (!p.published_at) {
        drafts++;
      } else if (p.published_at.substring(0, 10) > todayStr) {
        scheduled++;
      } else {
        published++;
      }
    });

    return {
      total: posts.length,
      published,
      scheduled,
      drafts,
    };
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    const todayStr = new Date().toISOString().substring(0, 10);
    const q = searchQuery.toLowerCase().trim();

    return posts.filter((p) => {
      // 1. Search Query
      if (q) {
        const titleVi = p.translations?.vi?.title?.toLowerCase() || '';
        const titleEn = p.translations?.en?.title?.toLowerCase() || '';
        const slug = p.slug.toLowerCase();
        if (!titleVi.includes(q) && !titleEn.includes(q) && !slug.includes(q)) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all') {
        const matchesId = p.category_id === selectedCategory;
        const matchesSlug = p.category_slug === selectedCategory;
        if (!matchesId && !matchesSlug) return false;
      }

      // 3. Status Filter
      if (selectedStatus === 'draft' && p.published_at) return false;
      if (selectedStatus === 'scheduled') {
        if (!p.published_at || p.published_at.substring(0, 10) <= todayStr) return false;
      }
      if (selectedStatus === 'published') {
        if (!p.published_at || p.published_at.substring(0, 10) > todayStr) return false;
      }

      return true;
    });
  }, [posts, searchQuery, selectedCategory, selectedStatus]);

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(isEn ? `Are you sure you want to delete article "${slug}"?` : `Bạn có chắc chắn muốn xóa bài viết "${slug}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await onDeletePost(id, slug);
    } finally {
      setDeletingId(null);
    }
  };

  // If in editor mode, render Notion Editor directly (placed AFTER all hooks to respect React Rules of Hooks)
  if (editingPost) {
    return (
      <CmsPostEditor
        post={editingPost}
        categories={categories}
        tags={tags}
        onSave={async (savedPost) => {
          await onSavePost(savedPost);
          onSetEditingPost(null);
        }}
        onCancel={() => onSetEditingPost(null)}
        currentLang={currentLang}
      />
    );
  }

  return (
    <div className="space-y-8" role="region" aria-label="Articles Management">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white backdrop-blur-sm border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {isEn ? '2.3 Article Management' : '2.3 Quản Lý Bài Viết'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            {isEn
              ? 'Draft, schedule, and optimize technical articles with Notion-style tools, Mermaid & LaTeX.'
              : 'Biên soạn, lên lịch phát hành và kiểm tra SEO cho các bài viết kỹ thuật chuyên sâu.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNewPost}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <i className="fa-solid fa-plus text-xs"></i>
          <span>{isEn ? 'Write New Article' : 'Viết Bài Viết Mới'}</span>
        </button>
      </div>

      {/* KPI Cards (Box Guideline) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => setSelectedStatus('all')}
          className={`bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-blue-500 hover:shadow-lg transition-all cursor-pointer ${
            selectedStatus === 'all' ? 'ring-2 ring-blue-500/30' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {isEn ? 'Total Articles' : 'Tổng Bài Viết'}
            </span>
            <span className="text-xs text-blue-600"><i className="fa-solid fa-book-open"></i></span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats.total}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Tất cả bài viết</div>
        </div>

        <div
          onClick={() => setSelectedStatus('published')}
          className={`bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-emerald-500 hover:shadow-lg transition-all cursor-pointer ${
            selectedStatus === 'published' ? 'ring-2 ring-emerald-500/30' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {isEn ? 'Published' : 'Đã Xuất Bản'}
            </span>
            <span className="text-xs text-emerald-600"><i className="fa-solid fa-circle-check"></i></span>
          </div>
          <div className="text-3xl font-black text-emerald-600">{stats.published}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Đang công khai</div>
        </div>

        <div
          onClick={() => setSelectedStatus('scheduled')}
          className={`bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-purple-500 hover:shadow-lg transition-all cursor-pointer ${
            selectedStatus === 'scheduled' ? 'ring-2 ring-purple-500/30' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {isEn ? 'Scheduled' : 'Đã Lên Lịch'}
            </span>
            <span className="text-xs text-purple-600"><i className="fa-solid fa-calendar-days"></i></span>
          </div>
          <div className="text-3xl font-black text-purple-600">{stats.scheduled}</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">Chờ ngày tự động live</div>
        </div>

        <div
          onClick={() => setSelectedStatus('draft')}
          className={`bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-amber-500 hover:shadow-lg transition-all cursor-pointer ${
            selectedStatus === 'draft' ? 'ring-2 ring-amber-500/30' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {isEn ? 'Drafts' : 'Bản Nháp'}
            </span>
            <span className="text-xs text-amber-600"><i className="fa-solid fa-pen-to-square"></i></span>
          </div>
          <div className="text-3xl font-black text-amber-600">{stats.drafts}</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">Đang biên soạn</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white backdrop-blur-sm rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search title or slug...' : 'Tìm kiếm theo tiêu đề hoặc slug...'}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-2xs"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-400 text-xs"></i>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Filter Selectors */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Category Dropdown */}
          <select
            aria-label={isEn ? 'Filter by category' : 'Lọc theo chuyên mục'}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs hover:border-gray-300 transition-colors cursor-pointer"
          >
            <option value="all">{isEn ? 'All Categories' : 'Tất cả chuyên mục'}</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.id || c.slug}>
                {c.translations?.[currentLang]?.name || c.translations?.vi?.name || c.slug}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            aria-label={isEn ? 'Filter by status' : 'Lọc theo trạng thái'}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs hover:border-gray-300 transition-colors cursor-pointer"
          >
            <option value="all">{isEn ? 'All Status' : 'Tất cả trạng thái'}</option>
            <option value="published">{isEn ? 'Published' : 'Đã xuất bản'}</option>
            <option value="scheduled">{isEn ? 'Scheduled' : 'Đã lên lịch'}</option>
            <option value="draft">{isEn ? 'Draft' : 'Bản nháp'}</option>
          </select>

          <span className="text-xs text-gray-400 font-mono ml-auto">
            {filteredPosts.length} / {posts.length} bài
          </span>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-red-600">
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <span className="text-3xl text-gray-300">
              <i className="fa-solid fa-file-circle-question"></i>
            </span>
            <div className="text-sm font-bold text-gray-800">
              {isEn ? 'No articles match your criteria' : 'Không có bài viết nào phù hợp bộ lọc'}
            </div>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {isEn ? 'Try adjusting your search query or create a new post.' : 'Hãy thử thay đổi điều kiện tìm kiếm hoặc bấm nút "Viết Bài Viết Mới".'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-mono text-[11px] pb-3">
                  <th className="pb-3 font-semibold">Tiêu đề bài viết & Slug</th>
                  <th className="pb-3 font-semibold">Chuyên đề</th>
                  <th className="pb-3 font-semibold">Trạng thái</th>
                  <th className="pb-3 font-semibold">Ngày đăng</th>
                  <th className="pb-3 font-semibold">Thời gian đọc</th>
                  <th className="pb-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {filteredPosts.map((p) => {
                  const titleVi = p.translations?.vi?.title;
                  const titleEn = p.translations?.en?.title;
                  const displayTitle = (currentLang === 'en' ? titleEn || titleVi : titleVi || titleEn) || p.slug;

                  const cat = p.category_id ? categoryMap.get(p.category_id) : (p.category_slug ? categoryMap.get(p.category_slug) : undefined);
                  const catName = cat
                    ? (cat.translations?.[currentLang]?.name || cat.translations?.vi?.name || cat.slug)
                    : (p.category_slug || 'General');

                  const todayStr = new Date().toISOString().substring(0, 10);
                  const isDraft = !p.published_at;
                  const isScheduled = p.published_at && p.published_at.substring(0, 10) > todayStr;
                  const isPublished = p.published_at && !isScheduled;

                  return (
                    <tr key={p.id || p.slug} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="py-4 pr-3 max-w-xs sm:max-w-md">
                        <div className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1 text-xs sm:text-sm">
                          {displayTitle}
                        </div>
                        <div className="text-[11px] font-mono text-gray-400 truncate max-w-xs mt-0.5">
                          /{p.slug}
                        </div>
                      </td>

                      <td className="py-4 pr-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${getCategoryColorClasses(cat?.color).badge}`}>
                          {catName}
                        </span>
                      </td>

                      <td className="py-4 pr-3 whitespace-nowrap">
                        {isPublished && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Xuất bản
                          </span>
                        )}
                        {isScheduled && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            Lên lịch
                          </span>
                        )}
                        {isDraft && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Bản nháp
                          </span>
                        )}
                      </td>

                      <td className="py-4 pr-3 whitespace-nowrap font-mono text-[11px] text-gray-500">
                        {p.published_at ? p.published_at.substring(0, 10) : '—'}
                      </td>

                      <td className="py-4 pr-3 whitespace-nowrap font-mono text-[11px] text-gray-500">
                        ⏱️ {p.read_time || 5} phút
                      </td>

                      <td className="py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSetEditingPost(p)}
                            className="px-3 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                          >
                            {isEn ? 'Edit' : 'Sửa'}
                          </button>

                          <Link
                            href={`/${currentLang}/blog/${p.slug}`}
                            target="_blank"
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-red-50 text-red-600 text-[11px] font-semibold border border-red-200 transition-colors flex items-center gap-1"
                          >
                            <span>Xem</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                          </Link>

                          {p.id && (
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id!, p.slug)}
                              disabled={deletingId === p.id}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                              title="Xóa bài viết"
                            >
                              {deletingId === p.id ? '...' : <i className="fa-solid fa-trash-can"></i>}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
