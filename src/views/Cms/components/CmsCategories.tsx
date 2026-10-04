'use client';

import React, { useState, useMemo } from 'react';
import {
  AdminCategory,
  AdminPost,
  getScheduleDayOptions,
  getCategoryIconOptions,
  getCategoryIconDetails,
  getWeekdayDetails,
  ScheduleDayOption,
  CategoryIconOption,
} from '@/services/blogAdminService';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Independent schedule day options (Monday through Sunday)
  const scheduleDayOptions = useMemo<ScheduleDayOption[]>(() => {
    return getScheduleDayOptions();
  }, []);

  const iconOptions = useMemo<CategoryIconOption[]>(() => {
    return getCategoryIconOptions(categories);
  }, [categories]);

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

  const handleOpenEditModal = (cat: AdminCategory) => {
    setEditingCategory({
      ...cat,
      translations: {
        vi: {
          lang_code: 'vi',
          name: cat.translations?.vi?.name || '',
          slug: cat.translations?.vi?.slug || cat.slug || '',
          description: cat.translations?.vi?.description || '',
        },
        en: {
          lang_code: 'en',
          name: cat.translations?.en?.name || '',
          slug: cat.translations?.en?.slug || '',
          description: cat.translations?.en?.description || '',
        },
      },
    });
    setActiveLangTab('vi');
  };

  const handleOpenCreateModal = () => {
    const nextSched = ((categories.length) % 7) + 1;
    const initSlug = `chuyen-de-${Date.now().toString().slice(-4)}`;
    setEditingCategory({
      slug: initSlug,
      post_schedule: nextSched,
      color: 'blue',
      icon: 'LayersIcon',
      translations: {
        vi: { lang_code: 'vi', slug: initSlug, name: '', description: '' },
        en: { lang_code: 'en', slug: '', name: '', description: '' },
      },
    });
    setActiveLangTab('vi');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const nameVi = editingCategory.translations?.vi?.name?.trim();
    const nameEn = editingCategory.translations?.en?.name?.trim();
    if (!nameVi && !nameEn) {
      alert('Vui lòng nhập tên chuyên mục (Tiếng Việt hoặc Tiếng Anh).');
      return;
    }

    const viSlug =
      editingCategory.translations?.vi?.slug?.trim() ||
      (nameVi ? generateSlug(nameVi) : '') ||
      editingCategory.slug?.trim();

    const enSlug =
      editingCategory.translations?.en?.slug?.trim() ||
      (nameEn ? generateSlug(nameEn) : '') ||
      viSlug;

    const primarySlug = viSlug || enSlug || editingCategory.slug?.trim();
    if (!primarySlug) {
      alert('Slug chuyên mục không được để trống.');
      return;
    }

    const updatedCategory: AdminCategory = {
      ...editingCategory,
      slug: primarySlug,
      translations: {
        vi: {
          ...(editingCategory.translations?.vi || { lang_code: 'vi', name: '' }),
          slug: viSlug,
        },
        en: {
          ...(editingCategory.translations?.en || { lang_code: 'en', name: '' }),
          slug: enSlug,
        },
      },
    };

    setIsSaving(true);
    try {
      await onSaveCategory(updatedCategory);
      setEditingCategory(null);
    } catch (err: any) {
      alert('Lỗi khi lưu chuyên mục: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const count = postCounts[id] || 0;
    const confirmMsg = count > 0
      ? `Cảnh báo: Chuyên mục này đang có ${count} bài viết liên kết. Xóa chuyên mục sẽ gỡ bài viết khỏi chuyên mục này. Bạn có chắc muốn xóa "${name}"?`
      : `Bạn có chắc muốn xóa chuyên mục "${name}"?`;

    if (!confirm(confirmMsg)) return;

    setDeletingId(id);
    try {
      await onDeleteCategory(id);
    } catch (err: any) {
      alert('Lỗi khi xóa chuyên mục: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8" role="region" aria-label="Quản lý chuyên mục">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white backdrop-blur-sm border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              2.1 Quản Lý Chuyên Mục
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            5 chuyên mục kỹ thuật gắn với lịch xuất bản đều đặn hàng tuần từ Thứ 2 đến Thứ 6.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>+</span>
            <span>Thêm Chuyên Mục Mới</span>
          </button>
        </div>
      </div>

      {/* Weekday Coverage Pipeline Status */}
      <section className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Độ Bao Phủ Lịch Xuất Bản Tuần (Thứ 2 – Thứ 6)
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Mỗi ngày làm việc trong tuần được bảo đảm bởi 1 chuyên đề cố định giúp duy trì nhịp đọc.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
            {categories.length} / 5 chuyên mục
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {scheduleDayOptions.slice(0, 5).map((day) => {
            const matched = categories.find((c) => c.post_schedule === day.value);
            const count = matched ? (postCounts[matched.id || matched.slug] || 0) : 0;
            const displayName = matched
              ? (matched.translations?.vi?.name || matched.translations?.en?.name || matched.slug)
              : null;
            const dayColors = matched
              ? getCategoryColorClasses(matched.color)
              : getCategoryColorClasses('gray');

            return (
              <div
                key={day.value}
                className={`p-4 rounded-2xl border border-t-4 ${dayColors.borderTop} ${matched ? 'bg-white shadow-xs border-gray-200' : 'bg-gray-50/70 border-dashed border-gray-200'
                  } flex flex-col justify-between transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      {day.viDay}
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
                        Chưa gán chuyên mục
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  {matched ? (
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(matched)}
                      className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      Chỉnh sửa
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
                      + Gán lịch
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
            placeholder="Tìm kiếm theo tên hoặc slug..."
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
          Hiển thị {filteredCategories.length} / {categories.length} chuyên mục
        </div>
      </div>

      {/* Category Cards Grid */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <span className="text-3xl text-gray-300">
            <i className="fa-solid fa-folder-open"></i>
          </span>
          <div className="text-sm font-bold text-gray-800">
            Không tìm thấy chuyên mục nào
          </div>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery
              ? 'Hãy thử thay đổi từ khoá tìm kiếm của bạn.'
              : 'Bắt đầu bằng cách tạo chuyên mục đầu tiên.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const count = postCounts[cat.id || cat.slug] || 0;
            const schedDetails = getWeekdayDetails(cat.post_schedule);
            const catColors = getCategoryColorClasses(cat.color);
            const nameVi = cat.translations?.vi?.name || cat.slug;
            const nameEn = cat.translations?.en?.name || cat.slug;
            const descVi = cat.translations?.vi?.description || '';
            const descEn = cat.translations?.en?.description || '';
            const matchedIcon = getCategoryIconDetails(cat.icon);

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
                          {schedDetails.viDay}
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
                      {nameVi}
                    </h3>
                    {nameVi !== nameEn && nameEn && (
                      <div className="text-xs font-medium text-gray-400">
                        {nameEn}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed pt-1">
                      {descVi || descEn || (
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
                      onClick={() => handleOpenEditModal(cat)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Sửa
                    </button>
                    {cat.id && (
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id!, nameVi || nameEn)}
                        disabled={deletingId === cat.id}
                        className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                        title="Xoá chuyên mục"
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
                    ? 'Chỉnh Sửa Chuyên Mục'
                    : 'Thêm Chuyên Mục Mới'}
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
                    Nội Dung Song Ngữ
                  </label>
                  <div className="flex bg-gray-100 p-0.5 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveLangTab('vi')}
                      className={`px-3 py-1 rounded-lg transition-all ${activeLangTab === 'vi'
                        ? 'bg-white text-gray-900 shadow-2xs font-extrabold'
                        : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                      🇻🇳 Tiếng Việt
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLangTab('en')}
                      className={`px-3 py-1 rounded-lg transition-all ${activeLangTab === 'en'
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
                          const currentSlug = trans.vi?.slug;
                          const autoSlug = generateSlug(val);
                          const shouldUpdateSlug = !editingCategory.id && (!currentSlug || currentSlug.startsWith('chuyen-de-'));
                          trans.vi = {
                            ...(trans.vi || { lang_code: 'vi' }),
                            name: val,
                            ...(shouldUpdateSlug && autoSlug ? { slug: autoSlug } : {}),
                          };

                          setEditingCategory({
                            ...editingCategory,
                            ...(shouldUpdateSlug && autoSlug ? { slug: autoSlug } : {}),
                            translations: trans,
                          });
                        }}
                        placeholder="Ví dụ: Kiến trúc Hệ thống"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-gray-700">
                          Slug URL (Tiếng Việt) <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const base = editingCategory.translations?.vi?.name || '';
                            if (base) {
                              const newSlug = generateSlug(base);
                              const trans = { ...editingCategory.translations };
                              trans.vi = { ...(trans.vi || { lang_code: 'vi' }), slug: newSlug };
                              setEditingCategory({ ...editingCategory, slug: newSlug, translations: trans });
                            }
                          }}
                          className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                        >
                          Tạo từ tên
                        </button>
                      </div>
                      <input
                        type="text"
                        value={editingCategory.translations?.vi?.slug ?? editingCategory.slug}
                        onChange={(e) => {
                          const newSlug = generateSlug(e.target.value);
                          const trans = { ...editingCategory.translations };
                          trans.vi = { ...(trans.vi || { lang_code: 'vi' }), slug: newSlug };
                          setEditingCategory({ ...editingCategory, slug: newSlug, translations: trans });
                        }}
                        placeholder="kien-truc-he-thong"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      />
                      <span className="text-[11px] text-gray-400 font-mono mt-1 block">
                        Đường dẫn: /vi/blog?category={editingCategory.translations?.vi?.slug || editingCategory.slug || 'slug'}
                      </span>
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
                          const val = e.target.value;
                          const trans = { ...editingCategory.translations };
                          const currentSlug = trans.en?.slug;
                          const autoSlug = generateSlug(val);
                          const shouldUpdateSlug = !currentSlug;
                          trans.en = {
                            ...(trans.en || { lang_code: 'en' }),
                            name: val,
                            ...(shouldUpdateSlug && autoSlug ? { slug: autoSlug } : {}),
                          };
                          setEditingCategory({ ...editingCategory, translations: trans });
                        }}
                        placeholder="E.g., System Architecture & Distributed Core"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-gray-700">
                          Slug URL (English)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const base = editingCategory.translations?.en?.name || '';
                            if (base) {
                              const newSlug = generateSlug(base);
                              const trans = { ...editingCategory.translations };
                              trans.en = { ...(trans.en || { lang_code: 'en' }), slug: newSlug };
                              setEditingCategory({ ...editingCategory, translations: trans });
                            }
                          }}
                          className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                        >
                          Tạo từ tên
                        </button>
                      </div>
                      <input
                        type="text"
                        value={editingCategory.translations?.en?.slug || ''}
                        onChange={(e) => {
                          const newSlug = generateSlug(e.target.value);
                          const trans = { ...editingCategory.translations };
                          trans.en = { ...(trans.en || { lang_code: 'en' }), slug: newSlug };
                          setEditingCategory({ ...editingCategory, translations: trans });
                        }}
                        placeholder="system-architecture"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      />
                      <span className="text-[11px] text-gray-400 font-mono mt-1 block">
                        Đường dẫn: /en/blog?category={editingCategory.translations?.en?.slug || 'slug'}
                      </span>
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

              {/* Technical Config: Weekday Schedule */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Lịch xuất bản trong tuần <span className="text-red-500">*</span>
                </label>
                <select
                  aria-label="Lịch xuất bản trong tuần"
                  value={editingCategory.post_schedule}
                  onChange={(e) => {
                    const sched = Number(e.target.value);
                    setEditingCategory({
                      ...editingCategory,
                      post_schedule: sched,
                    });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs hover:border-gray-300 transition-colors cursor-pointer"
                >
                  {scheduleDayOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.viDay} ({opt.viFull})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Chọn ngày xuất bản cố định trong tuần cho chuyên đề này (Thứ 2 – Chủ Nhật)
                </span>
              </div>

              {/* Color & Icon Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Màu sắc Flowbite (Theme Color) <span className="text-red-500">*</span>
                  </label>

                  {/* Flowbite Color Swatches Palette */}
                  <div className="flex items-center gap-2 flex-wrap py-1">
                    {FLOWBITE_CATEGORY_COLORS.map((c) => {
                      const isSelected = normalizeCategoryColor(editingCategory.color) === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setEditingCategory({ ...editingCategory, color: c.id })}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${c.dotBg} ${isSelected
                            ? 'ring-2 ring-offset-2 ring-gray-900 scale-110 shadow-xs'
                            : 'opacity-75 hover:opacity-100 hover:scale-105'
                            }`}
                          title={c.nameVi}
                          aria-label={c.nameVi}
                        >
                          {isSelected && (
                            <i className="fa-solid fa-check text-white text-[10px]"></i>
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
                    {iconOptions.map((opt) => (
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
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/25 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isSaving && <span className="animate-spin text-sm">⏳</span>}
                  <span>Lưu Chuyên Mục</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
