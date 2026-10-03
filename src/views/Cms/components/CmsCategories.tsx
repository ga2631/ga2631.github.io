'use client';

import React, { useState, useMemo } from 'react';
import { AdminCategory, AdminPost } from '@/services/blogAdminService';
import { CmsTab } from '@/components/layouts/CmsLayout';
import {
  FLOWBITE_CATEGORY_COLORS,
  getCategoryColorClasses,
  normalizeCategoryColor,
  FlowbiteCategoryColor,
} from '@/utils/categoryColors';

interface CmsCategoriesProps {
  categories: AdminCategory[];
  posts: AdminPost[];
  isLoading: boolean;
  onSaveCategory: (category: AdminCategory) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onSelectTab?: (tab: CmsTab) => void;
  currentLang: string;
}

const SCHEDULE_DAY_OPTIONS = [
  { value: 1, vi: 'Thứ 2 (Hệ thống)', en: 'Monday (Architecture)', color: 'blue' as FlowbiteCategoryColor },
  { value: 2, vi: 'Thứ 3 (Thuật toán)', en: 'Tuesday (Algorithms)', color: 'green' as FlowbiteCategoryColor },
  { value: 3, vi: 'Thứ 4 (Cơ sở Dữ liệu)', en: 'Wednesday (Database)', color: 'yellow' as FlowbiteCategoryColor },
  { value: 4, vi: 'Thứ 5 (Frontend UI)', en: 'Thursday (Frontend UI)', color: 'purple' as FlowbiteCategoryColor },
  { value: 5, vi: 'Thứ 6 (Tech Radar)', en: 'Friday (Tech Radar)', color: 'pink' as FlowbiteCategoryColor },
];

const ICON_OPTIONS = [
  { id: 'LayersIcon', label: 'Hệ thống / Layers', iconClass: 'fa-solid fa-layer-group' },
  { id: 'DatabaseIcon', label: 'Cơ sở Dữ liệu / Data', iconClass: 'fa-solid fa-database' },
  { id: 'CpuIcon', label: 'Thuật toán / CPU', iconClass: 'fa-solid fa-microchip' },
  { id: 'SparklesIcon', label: 'Frontend / UI', iconClass: 'fa-solid fa-wand-magic-sparkles' },
  { id: 'RadarIcon', label: 'Tech Radar / Xu hướng', iconClass: 'fa-solid fa-tower-broadcast' },
  { id: 'BookOpenIcon', label: 'Tài liệu / Tổng hợp', iconClass: 'fa-solid fa-book-open' },
  { id: 'TerminalIcon', label: 'Hệ thống / DevOps', iconClass: 'fa-solid fa-terminal' },
];

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function CmsCategories({
  categories,
  posts,
  isLoading,
  onSaveCategory,
  onDeleteCategory,
  onSelectTab,
  currentLang,
}: CmsCategoriesProps) {
  const isEn = currentLang === 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Post counts per category
  const postCounts = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((cat) => {
      map[cat.id || cat.slug] = posts.filter(
        (p) => p.category_id === cat.id || p.category_slug === cat.slug
      ).length;
    });
    return map;
  }, [categories, posts]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter((c) => {
      const nameVi = c.translations?.vi?.name?.toLowerCase() || '';
      const nameEn = c.translations?.en?.name?.toLowerCase() || '';
      const slug = c.slug.toLowerCase();
      const descVi = c.translations?.vi?.description?.toLowerCase() || '';
      const descEn = c.translations?.en?.description?.toLowerCase() || '';
      return nameVi.includes(q) || nameEn.includes(q) || slug.includes(q) || descVi.includes(q) || descEn.includes(q);
    });
  }, [categories, searchQuery]);

  const handleOpenCreateModal = () => {
    const nextSched = (categories.length % 5) + 1;
    const defaultColor = SCHEDULE_DAY_OPTIONS.find((s) => s.value === nextSched)?.color || 'blue';
    setEditingCategory({
      slug: `chuyen-de-${Date.now().toString().slice(-4)}`,
      post_schedule: nextSched,
      color: defaultColor,
      icon: 'LayersIcon',
      translations: {
        vi: { lang_code: 'vi', name: '', description: '' },
        en: { lang_code: 'en', name: '', description: '' },
      },
    });
    setActiveLangTab('vi');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    if (!editingCategory.slug.trim()) {
      alert(isEn ? 'Category slug cannot be empty.' : 'Slug chuyên mục không được để trống.');
      return;
    }

    const nameVi = editingCategory.translations?.vi?.name?.trim();
    const nameEn = editingCategory.translations?.en?.name?.trim();
    if (!nameVi && !nameEn) {
      alert(isEn ? 'Please provide at least a Vietnamese or English title.' : 'Vui lòng nhập tên chuyên mục (Tiếng Việt hoặc Tiếng Anh).');
      return;
    }

    setIsSaving(true);
    try {
      await onSaveCategory(editingCategory);
      setEditingCategory(null);
    } catch (err: any) {
      alert((isEn ? 'Error saving category: ' : 'Lỗi khi lưu chuyên mục: ') + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const count = postCounts[id] || 0;
    const confirmMsg = count > 0
      ? isEn
        ? `Warning: This category currently has ${count} articles. Deleting it will unassign those articles. Are you sure you want to delete "${name}"?`
        : `Cảnh báo: Chuyên mục này đang có ${count} bài viết liên kết. Xóa chuyên mục sẽ gỡ bài viết khỏi chuyên mục này. Bạn có chắc muốn xóa "${name}"?`
      : isEn
        ? `Are you sure you want to delete category "${name}"?`
        : `Bạn có chắc muốn xóa chuyên mục "${name}"?`;

    if (!confirm(confirmMsg)) return;

    setDeletingId(id);
    try {
      await onDeleteCategory(id);
    } catch (err: any) {
      alert((isEn ? 'Error deleting category: ' : 'Lỗi khi xóa chuyên mục: ') + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8" role="region" aria-label="Category Management">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white backdrop-blur-sm border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {isEn ? '2.1 Category Management' : '2.1 Quản Lý Chuyên Mục'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            {isEn
              ? '5 core technical themes assigned to weekly publishing schedule (Monday to Friday).'
              : '5 chuyên mục kỹ thuật gắn với lịch xuất bản đều đặn hàng tuần từ Thứ 2 đến Thứ 6.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>+</span>
            <span>{isEn ? 'New Category' : 'Thêm Chuyên Mục Mới'}</span>
          </button>
        </div>
      </div>

      {/* Weekday Coverage Pipeline Status */}
      <section className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              {isEn ? 'Weekly Workday Schedule Coverage' : 'Độ Bao Phủ Lịch Xuất Bản Tuần (Thứ 2 – Thứ 6)'}
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isEn
                ? 'Each weekday is assigned to one technical domain for predictable audience engagement.'
                : 'Mỗi ngày làm việc trong tuần được bảo đảm bởi 1 chuyên đề cố định giúp duy trì nhịp đọc.'}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
            {categories.length} / 5 chuyên mục
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SCHEDULE_DAY_OPTIONS.map((day) => {
            const matched = categories.find((c) => c.post_schedule === day.value);
            const count = matched ? (postCounts[matched.id || matched.slug] || 0) : 0;
            const displayName = matched
              ? (matched.translations?.[currentLang]?.name || matched.translations?.vi?.name || matched.slug)
              : null;
            const dayColors = matched
              ? getCategoryColorClasses(matched.color)
              : getCategoryColorClasses(day.color);

            return (
              <div
                key={day.value}
                className={`p-4 rounded-2xl border border-t-4 ${dayColors.borderTop} ${
                  matched ? 'bg-white shadow-xs border-gray-200' : 'bg-gray-50/70 border-dashed border-gray-200'
                } flex flex-col justify-between transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      {isEn ? day.en.split(' ')[0] : day.vi.split(' ')[0] + ' ' + day.vi.split(' ')[1]}
                    </span>
                    {matched && (
                      <span className="text-[11px] font-bold text-gray-900 font-mono">
                        {count} bài
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-gray-900 line-clamp-1">
                    {displayName || (
                      <span className="text-gray-400 italic font-normal">
                        {isEn ? 'Not assigned' : 'Chưa gán chuyên mục'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  {matched ? (
                    <button
                      type="button"
                      onClick={() => setEditingCategory(matched)}
                      className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      {isEn ? 'Edit' : 'Chỉnh sửa'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenCreateModal();
                        setEditingCategory((prev) => prev ? { ...prev, post_schedule: day.value } : null);
                      }}
                      className="text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                    >
                      + {isEn ? 'Assign' : 'Gán lịch'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search category name or slug...' : 'Tìm kiếm theo tên hoặc slug...'}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-2xs"
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

        <div className="text-xs text-gray-500 self-end sm:self-center font-mono">
          {isEn ? `Showing ${filteredCategories.length} of ${categories.length} categories` : `Hiển thị ${filteredCategories.length} / ${categories.length} chuyên mục`}
        </div>
      </div>

      {/* Category Cards Grid */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <span className="text-3xl text-gray-300">
            <i className="fa-solid fa-folder-open"></i>
          </span>
          <div className="text-sm font-bold text-gray-800">
            {isEn ? 'No categories found' : 'Không tìm thấy chuyên mục nào'}
          </div>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery
              ? (isEn ? 'Try adjusting your search keywords.' : 'Hãy thử thay đổi từ khoá tìm kiếm của bạn.')
              : (isEn ? 'Create your first category to get started.' : 'Bắt đầu bằng cách tạo chuyên mục đầu tiên.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const count = postCounts[cat.id || cat.slug] || 0;
            const schedInfo = SCHEDULE_DAY_OPTIONS.find((s) => s.value === cat.post_schedule) || SCHEDULE_DAY_OPTIONS[0];
            const catColors = getCategoryColorClasses(cat.color);
            const nameVi = cat.translations?.vi?.name || cat.slug;
            const nameEn = cat.translations?.en?.name || cat.slug;
            const descVi = cat.translations?.vi?.description || '';
            const descEn = cat.translations?.en?.description || '';
            const matchedIcon = ICON_OPTIONS.find((i) => i.id === cat.icon) || ICON_OPTIONS[0];

            return (
              <div
                key={cat.id || cat.slug}
                className={`bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 border-t-4 ${catColors.borderTop} hover:shadow-lg transition-all flex flex-col justify-between group`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Icon, Schedule Badge, Slug */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xl p-2.5 w-10 h-10 flex items-center justify-center rounded-2xl ${catColors.iconBg} border border-gray-100 group-hover:scale-105 transition-transform`}>
                        <i className={matchedIcon.iconClass}></i>
                      </span>
                      <div>
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border ${catColors.badge}`}>
                          {isEn ? schedInfo.en : schedInfo.vi}
                        </span>
                        <div className="text-[11px] font-mono text-gray-400 mt-0.5 truncate max-w-[160px]">
                          /{cat.slug}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-100 text-gray-800 text-xs font-bold font-mono">
                        <i className="fa-solid fa-file-lines text-gray-400 text-[10px]"></i>
                        <span>{count}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className={`text-base font-black text-gray-900 group-hover:${catColors.text} transition-colors leading-snug`}>
                      {isEn ? nameEn : nameVi}
                    </h3>
                    {nameVi !== nameEn && (
                      <div className="text-xs font-medium text-gray-400">
                        {isEn ? nameVi : nameEn}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed pt-1">
                      {(isEn ? descEn || descVi : descVi || descEn) || (
                        <span className="italic text-gray-400">Chưa có mô tả chi tiết.</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectTab) {
                        onSelectTab('posts');
                      }
                    }}
                    className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem bài viết</span>
                    <span>→</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(cat)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {isEn ? 'Edit' : 'Sửa'}
                    </button>
                    {cat.id && (
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id!, isEn ? nameEn : nameVi)}
                        disabled={deletingId === cat.id}
                        className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                        title={isEn ? 'Delete category' : 'Xoá chuyên mục'}
                      >
                        {deletingId === cat.id ? '...' : <i className="fa-solid fa-trash-can"></i>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CATEGORY EDIT / CREATE MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
                  <i className="fa-solid fa-folder"></i>
                </span>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                  {editingCategory.id
                    ? isEn ? 'Edit Category' : 'Chỉnh Sửa Chuyên Mục'
                    : isEn ? 'Create New Category' : 'Thêm Chuyên Mục Mới'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="w-8 h-8 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Language Switcher Tabs for Category Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {isEn ? 'Bilingual Content' : 'Nội Dung Đa Ngôn Ngữ'}
                  </label>
                  <div className="flex bg-gray-100 p-0.5 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveLangTab('vi')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        activeLangTab === 'vi'
                          ? 'bg-white text-gray-900 shadow-2xs font-extrabold'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      🇻🇳 Tiếng Việt
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLangTab('en')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        activeLangTab === 'en'
                          ? 'bg-white text-gray-900 shadow-2xs font-extrabold'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                </div>

                {/* Tab: Vietnamese Fields */}
                {activeLangTab === 'vi' && (
                  <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Tên chuyên mục (Tiếng Việt) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingCategory.translations?.vi?.name || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const trans = { ...editingCategory.translations };
                          trans.vi = { ...(trans.vi || { lang_code: 'vi' }), name: val };
                          
                          // Auto update slug if it is a new category
                          if (!editingCategory.id && (!editingCategory.slug || editingCategory.slug.startsWith('chuyen-de-'))) {
                            setEditingCategory({
                              ...editingCategory,
                              slug: generateSlug(val) || editingCategory.slug,
                              translations: trans,
                            });
                          } else {
                            setEditingCategory({ ...editingCategory, translations: trans });
                          }
                        }}
                        placeholder="Ví dụ: Kiến trúc Hệ thống"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Mô tả tóm tắt (Tiếng Việt)
                      </label>
                      <textarea
                        rows={3}
                        value={editingCategory.translations?.vi?.description || ''}
                        onChange={(e) => {
                          const trans = { ...editingCategory.translations };
                          trans.vi = { ...(trans.vi || { lang_code: 'vi' }), description: e.target.value };
                          setEditingCategory({ ...editingCategory, translations: trans });
                        }}
                        placeholder="Tóm tắt nội dung chính và mục tiêu người đọc của chuyên mục này..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* Tab: English Fields */}
                {activeLangTab === 'en' && (
                  <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Category Name (English)
                      </label>
                      <input
                        type="text"
                        value={editingCategory.translations?.en?.name || ''}
                        onChange={(e) => {
                          const trans = { ...editingCategory.translations };
                          trans.en = { ...(trans.en || { lang_code: 'en' }), name: e.target.value };
                          setEditingCategory({ ...editingCategory, translations: trans });
                        }}
                        placeholder="E.g., System Architecture & Distributed Core"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Summary Description (English)
                      </label>
                      <textarea
                        rows={3}
                        value={editingCategory.translations?.en?.description || ''}
                        onChange={(e) => {
                          const trans = { ...editingCategory.translations };
                          trans.en = { ...(trans.en || { lang_code: 'en' }), description: e.target.value };
                          setEditingCategory({ ...editingCategory, translations: trans });
                        }}
                        placeholder="Summary of scope, topics, and takeaways for readers..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Config: Slug & Weekday Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Slug URL <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const base = editingCategory.translations?.vi?.name || editingCategory.translations?.en?.name || '';
                        if (base) {
                          setEditingCategory({ ...editingCategory, slug: generateSlug(base) });
                        }
                      }}
                      className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Tạo từ tên
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={editingCategory.slug}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: generateSlug(e.target.value) })}
                    placeholder="kien-truc-he-thong"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                  <span className="text-[11px] text-gray-400 font-mono mt-1 block">
                    Đường dẫn: /blog?cat={editingCategory.slug || 'slug'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Lịch xuất bản trong tuần <span className="text-red-500">*</span>
                  </label>
                  <select
                    aria-label="Lịch xuất bản trong tuần"
                    value={editingCategory.post_schedule}
                    onChange={(e) => {
                      const sched = Number(e.target.value);
                      const opt = SCHEDULE_DAY_OPTIONS.find((s) => s.value === sched);
                      setEditingCategory({
                        ...editingCategory,
                        post_schedule: sched,
                        color: opt?.color || editingCategory.color,
                      });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    {SCHEDULE_DAY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {isEn ? opt.en : opt.vi}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Khớp với luồng đăng bài tự động trên Dashboard
                  </span>
                </div>
              </div>

              {/* Color & Icon Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      Màu sắc Flowbite (Theme Color) <span className="text-red-500">*</span>
                    </label>
                    {/* Live Preview Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getCategoryColorClasses(editingCategory.color).badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getCategoryColorClasses(editingCategory.color).dotBg}`} />
                      <span>{isEn ? getCategoryColorClasses(editingCategory.color).nameEn : getCategoryColorClasses(editingCategory.color).nameVi}</span>
                    </span>
                  </div>

                  <select
                    aria-label="Chọn màu sắc Flowbite"
                    value={normalizeCategoryColor(editingCategory.color)}
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    {FLOWBITE_CATEGORY_COLORS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isEn ? c.nameEn : c.nameVi}
                      </option>
                    ))}
                  </select>

                  {/* Flowbite Color Swatches Quick-pick */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {FLOWBITE_CATEGORY_COLORS.map((c) => {
                      const isSelected = normalizeCategoryColor(editingCategory.color) === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setEditingCategory({ ...editingCategory, color: c.id })}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${c.dotBg} ${
                            isSelected
                              ? 'ring-2 ring-offset-2 ring-gray-900 scale-110 shadow-xs'
                              : 'opacity-70 hover:opacity-100 hover:scale-105'
                          }`}
                          title={isEn ? c.nameEn : c.nameVi}
                          aria-label={c.nameVi}
                        >
                          {isSelected && (
                            <i className="fa-solid fa-check text-white text-[9px]"></i>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Biểu tượng đại diện (Icon)
                  </label>
                  <select
                    aria-label="Biểu tượng đại diện"
                    value={editingCategory.icon || 'LayersIcon'}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Hủy bỏ'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/25 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isSaving && <span className="animate-spin text-sm">⏳</span>}
                  <span>{isEn ? 'Save Category' : 'Lưu Chuyên Mục'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
