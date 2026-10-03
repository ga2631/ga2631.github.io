'use client';

import React, { useState, useMemo } from 'react';
import { AdminTag, AdminPost } from '@/services/blogAdminService';
import { CmsTab } from '@/components/layouts/CmsLayout';

interface CmsTagsProps {
  tags: AdminTag[];
  posts: AdminPost[];
  isLoading: boolean;
  onSaveTag: (tag: AdminTag) => Promise<void>;
  onDeleteTag: (id: string) => Promise<void>;
  onSelectTab?: (tab: CmsTab) => void;
  currentLang: string;
}

function generateTagSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function CmsTags({
  tags,
  posts,
  isLoading,
  onSaveTag,
  onDeleteTag,
  onSelectTab,
  currentLang,
}: CmsTagsProps) {
  const isEn = currentLang === 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'cloud'>('grid');
  const [editingTag, setEditingTag] = useState<AdminTag | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Compute posts count for each tag
  const tagStats = useMemo(() => {
    const counts: Record<string, number> = {};
    tags.forEach((t) => {
      const matchId = t.id || t.slug;
      const count = posts.filter((p) => {
        if (p.tag_ids && t.id && p.tag_ids.includes(t.id)) return true;
        if (p.tags && p.tags.includes(t.slug)) return true;
        return false;
      }).length;
      counts[matchId] = count;
    });

    const activeCount = Object.values(counts).filter((c) => c > 0).length;
    const unusedCount = tags.length - activeCount;

    // Top tags
    const sortedTags = [...tags].sort((a, b) => {
      const countA = counts[a.id || a.slug] || 0;
      const countB = counts[b.id || b.slug] || 0;
      return countB - countA;
    });

    return {
      counts,
      activeCount,
      unusedCount,
      topTags: sortedTags.slice(0, 3),
    };
  }, [tags, posts]);

  // Filtered tags
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags;
    const q = searchQuery.toLowerCase();
    return tags.filter((t) => {
      const nameVi = t.translations?.vi?.name?.toLowerCase() || '';
      const nameEn = t.translations?.en?.name?.toLowerCase() || '';
      const slug = t.slug.toLowerCase();
      return nameVi.includes(q) || nameEn.includes(q) || slug.includes(q);
    });
  }, [tags, searchQuery]);

  const handleOpenCreateModal = () => {
    setEditingTag({
      slug: `tag-${Date.now().toString().slice(-4)}`,
      translations: {
        vi: { lang_code: 'vi', name: '' },
        en: { lang_code: 'en', name: '' },
      },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;

    if (!editingTag.slug.trim()) {
      alert(isEn ? 'Tag slug cannot be empty.' : 'Slug thẻ không được để trống.');
      return;
    }

    const nameVi = editingTag.translations?.vi?.name?.trim();
    const nameEn = editingTag.translations?.en?.name?.trim();
    if (!nameVi && !nameEn) {
      alert(isEn ? 'Please provide at least a Vietnamese or English display name.' : 'Vui lòng nhập tên hiển thị cho thẻ (Tiếng Việt hoặc Tiếng Anh).');
      return;
    }

    setIsSaving(true);
    try {
      await onSaveTag(editingTag);
      setEditingTag(null);
    } catch (err: any) {
      alert((isEn ? 'Error saving tag: ' : 'Lỗi khi lưu thẻ: ') + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    const count = tagStats.counts[id] || 0;
    const confirmMsg = count > 0
      ? isEn
        ? `Warning: Tag "#${slug}" is used in ${count} articles. Deleting it will remove this tag from those articles. Are you sure?`
        : `Cảnh báo: Thẻ "#${slug}" đang được gắn trong ${count} bài viết. Xóa thẻ này sẽ gỡ khỏi các bài viết liên quan. Bạn có chắc chắn muốn xóa?`
      : isEn
        ? `Are you sure you want to delete tag "#${slug}"?`
        : `Bạn có chắc muốn xóa thẻ "#${slug}"?`;

    if (!confirm(confirmMsg)) return;

    setDeletingId(id);
    try {
      await onDeleteTag(id);
    } catch (err: any) {
      alert((isEn ? 'Error deleting tag: ' : 'Lỗi khi xóa thẻ: ') + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8" role="region" aria-label="Tag Management">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white backdrop-blur-sm border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {isEn ? '2.2 Technical Tag Management' : '2.2 Quản Lý Thẻ Kỹ Thuật'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            {isEn
              ? 'Multi-language technical tags and keywords for fine-grained classification and SEO discovery.'
              : 'Thẻ kỹ thuật đa ngôn ngữ hỗ trợ phân loại nội dung chi tiết và tối ưu hoá bộ lọc tìm kiếm.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>+</span>
            <span>{isEn ? 'New Tag' : 'Thêm Thẻ Mới'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Box Guideline) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-purple-500 hover:shadow-lg transition-all">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            {isEn ? 'Total Tags' : 'Tổng Số Thẻ'}
          </div>
          <div className="text-3xl font-black text-gray-900">{tags.length}</div>
          <div className="text-[11px] text-gray-400 mt-1">Đồng bộ Supabase</div>
        </div>

        <div className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-emerald-500 hover:shadow-lg transition-all">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            {isEn ? 'In Use' : 'Đang Sử Dụng'}
          </div>
          <div className="text-3xl font-black text-emerald-600">{tagStats.activeCount}</div>
          <div className="text-[11px] text-emerald-700 mt-1">Gắn trong bài viết</div>
        </div>

        <div className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-amber-500 hover:shadow-lg transition-all">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            {isEn ? 'Unassigned' : 'Chưa Có Bài Viết'}
          </div>
          <div className="text-3xl font-black text-amber-600">{tagStats.unusedCount}</div>
          <div className="text-[11px] text-amber-700 mt-1">Sẵn sàng liên kết</div>
        </div>

        <div className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-blue-500 hover:shadow-lg transition-all">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            {isEn ? 'Top Tag' : 'Thẻ Dùng Nhiều Nhất'}
          </div>
          <div className="text-base font-black text-blue-600 truncate mt-1">
            {tagStats.topTags[0] ? `#${tagStats.topTags[0].slug}` : '—'}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {tagStats.topTags[0] ? `${tagStats.counts[tagStats.topTags[0].id || tagStats.topTags[0].slug] || 0} bài viết` : 'Chưa có dữ liệu'}
          </div>
        </div>
      </div>

      {/* Filter and View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search tag by slug or name...' : 'Tìm kiếm thẻ theo slug hoặc tên...'}
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

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex bg-gray-100 p-0.5 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <i className="fa-solid fa-table-cells-large text-[11px]"></i>
              <span>{isEn ? 'Cards' : 'Dạng thẻ'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cloud')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cloud' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <i className="fa-solid fa-cloud text-[11px]"></i>
              <span>{isEn ? 'Cloud' : 'Đám mây'}</span>
            </button>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            ({filteredTags.length})
          </span>
        </div>
      </div>

      {/* Tag Display: Grid View */}
      {viewMode === 'grid' && (
        <>
          {filteredTags.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
              <span className="text-3xl text-gray-300">
                <i className="fa-solid fa-tags"></i>
              </span>
              <div className="text-sm font-bold text-gray-800">
                {isEn ? 'No tags found' : 'Không tìm thấy thẻ nào'}
              </div>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                {searchQuery
                  ? (isEn ? 'Try adjusting your search query.' : 'Hãy thử thay đổi từ khoá tìm kiếm.')
                  : (isEn ? 'Create your first tag to start tagging articles.' : 'Tạo thẻ đầu tiên để gắn nhãn bài viết.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTags.map((tag) => {
                const count = tagStats.counts[tag.id || tag.slug] || 0;
                const nameVi = tag.translations?.vi?.name;
                const nameEn = tag.translations?.en?.name;
                const displayName = (currentLang === 'en' ? nameEn || nameVi : nameVi || nameEn) || tag.slug;

                return (
                  <div
                    key={tag.id || tag.slug}
                    className="bg-white backdrop-blur-sm rounded-3xl p-5 shadow-sm border border-gray-100 border-t-4 border-t-gray-300 hover:border-t-red-500 hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Bar: Slug & Count Pill */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="font-mono text-xs font-bold text-red-600 group-hover:text-red-700 transition-colors truncate max-w-[140px]">
                          #{tag.slug}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-mono font-semibold whitespace-nowrap">
                          {count} bài
                        </span>
                      </div>

                      {/* Display Names */}
                      <div className="text-xs font-bold text-gray-900 line-clamp-1">
                        {displayName}
                      </div>
                      {nameVi && nameEn && nameVi !== nameEn && (
                        <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                          {currentLang === 'en' ? nameVi : nameEn}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectTab) {
                            onSelectTab('posts');
                          }
                        }}
                        className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        {isEn ? 'Filter posts →' : 'Xem bài viết →'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingTag(tag)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          {isEn ? 'Edit' : 'Sửa'}
                        </button>
                        {tag.id && (
                          <button
                            type="button"
                            onClick={() => handleDelete(tag.id!, tag.slug)}
                            disabled={deletingId === tag.id}
                            className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                            title={isEn ? 'Delete tag' : 'Xoá thẻ'}
                          >
                            {deletingId === tag.id ? '...' : <i className="fa-solid fa-trash-can"></i>}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Tag Display: Cloud View */}
      {viewMode === 'cloud' && (
        <div className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-2.5">
            {filteredTags.map((tag) => {
              const count = tagStats.counts[tag.id || tag.slug] || 0;
              const nameVi = tag.translations?.vi?.name;
              const nameEn = tag.translations?.en?.name;
              const displayName = (currentLang === 'en' ? nameEn || nameVi : nameVi || nameEn) || tag.slug;

              return (
                <div
                  key={tag.id || tag.slug}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-white border border-gray-200 hover:border-red-400 hover:shadow-xs transition-all text-xs group"
                >
                  <span className="font-mono font-bold text-red-600">#{tag.slug}</span>
                  <span className="text-gray-700 font-medium">({displayName})</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-mono text-gray-500">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingTag(tag)}
                    className="text-gray-400 hover:text-gray-700 ml-1 cursor-pointer"
                    title={isEn ? 'Edit tag' : 'Chỉnh sửa'}
                  >
                    <i className="fa-solid fa-pen text-[10px]"></i>
                  </button>
                  {tag.id && (
                    <button
                      type="button"
                      onClick={() => handleDelete(tag.id!, tag.slug)}
                      className="text-red-400 hover:text-red-600 cursor-pointer font-bold ml-0.5"
                      title={isEn ? 'Delete tag' : 'Xoá'}
                    >
                      <i className="fa-solid fa-trash-can text-[10px]"></i>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAG EDIT / CREATE MODAL */}
      {editingTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                  <i className="fa-solid fa-tag"></i>
                </span>
                <h2 className="text-base font-black text-gray-900 tracking-tight">
                  {editingTag.id
                    ? isEn ? 'Edit Tag' : 'Chỉnh Sửa Thẻ'
                    : isEn ? 'Create New Tag' : 'Thêm Thẻ Mới'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingTag(null)}
                className="w-7 h-7 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Slug Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Slug nhận diện <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const base = editingTag.translations?.vi?.name || editingTag.translations?.en?.name || '';
                      if (base) {
                        setEditingTag({ ...editingTag, slug: generateTagSlug(base) });
                      }
                    }}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Tạo từ tên
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-mono text-xs">#</span>
                  <input
                    type="text"
                    required
                    value={editingTag.slug}
                    onChange={(e) => setEditingTag({ ...editingTag, slug: generateTagSlug(e.target.value) })}
                    placeholder="microservices"
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Tên hiển thị Tiếng Việt */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tên hiển thị (Tiếng Việt)
                </label>
                <input
                  type="text"
                  value={editingTag.translations?.vi?.name || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const trans = { ...editingTag.translations };
                    trans.vi = { ...(trans.vi || { lang_code: 'vi' }), name: val };
                    if (!editingTag.id && (!editingTag.slug || editingTag.slug.startsWith('tag-'))) {
                      setEditingTag({
                        ...editingTag,
                        slug: generateTagSlug(val) || editingTag.slug,
                        translations: trans,
                      });
                    } else {
                      setEditingTag({ ...editingTag, translations: trans });
                    }
                  }}
                  placeholder="Ví dụ: Kiến trúc Microservices"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              {/* Tên hiển thị English */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Display Name (English)
                </label>
                <input
                  type="text"
                  value={editingTag.translations?.en?.name || ''}
                  onChange={(e) => {
                    const trans = { ...editingTag.translations };
                    trans.en = { ...(trans.en || { lang_code: 'en' }), name: e.target.value };
                    setEditingTag({ ...editingTag, translations: trans });
                  }}
                  placeholder="E.g., Microservices Architecture"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              {/* Live Preview Pill */}
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                  Xem trước thẻ hiển thị
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-800 shadow-2xs">
                  <span className="font-mono text-red-600 font-bold">#{editingTag.slug || 'tag-slug'}</span>
                  <span>({editingTag.translations?.vi?.name || editingTag.translations?.en?.name || 'Tên hiển thị'})</span>
                </span>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingTag(null)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Hủy bỏ'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/25 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isSaving && <span className="animate-spin text-xs">⏳</span>}
                  <span>{isEn ? 'Save Tag' : 'Lưu Thẻ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
