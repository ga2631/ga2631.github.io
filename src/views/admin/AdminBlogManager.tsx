'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AdminCategory,
  AdminTag,
  AdminPost,
  getAllAdminCategories,
  saveAdminCategory,
  deleteAdminCategory,
  getAllAdminTags,
  saveAdminTag,
  deleteAdminTag,
  getAllAdminPosts,
  saveAdminPost,
  deleteAdminPost,
} from '@/services/blogAdminService';
import { markdownToHtml } from '@/utils/markdownParser';

interface AdminBlogManagerProps {
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminBlogManager: React.FC<AdminBlogManagerProps> = ({ onShowToast }) => {
  const [activeSubtab, setActiveSubtab] = useState<'posts' | 'categories' | 'tags'>('posts');
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modals state
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);
  const [postEditLang, setPostEditLang] = useState<'vi' | 'en'>('vi');
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [editingTag, setEditingTag] = useState<AdminTag | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load initial data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [cats, tgs, psts] = await Promise.all([
        getAllAdminCategories(),
        getAllAdminTags(),
        getAllAdminPosts(),
      ]);
      setCategories(cats);
      setTags(tgs);
      setPosts(psts);
    } catch (err: any) {
      onShowToast(`Lỗi nạp dữ liệu: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const titleVi = p.translations.vi?.title || '';
      const titleEn = p.translations.en?.title || '';
      const matchesSearch =
        !searchTerm ||
        titleVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        filterCategory === 'all' ||
        p.category_slug === filterCategory ||
        p.category_id === filterCategory;

      return matchesSearch && matchesCat;
    });
  }, [posts, searchTerm, filterCategory]);

  // =========================================================================
  // Handlers for Posts
  // =========================================================================
  const handleOpenNewPost = () => {
    const newPost: AdminPost = {
      slug: '',
      category_id: categories[0]?.id || null,
      read_time: 5,
      published_at: new Date().toISOString(),
      tag_ids: [],
      tags: [],
      translations: {
        vi: { lang_code: 'vi', title: '', summary: '', content_md: '' },
        en: { lang_code: 'en', title: '', summary: '', content_md: '' },
      },
    };
    setEditingPost(newPost);
    setPostEditLang('vi');
  };

  const handleSavePost = async () => {
    if (!editingPost) return;
    if (!editingPost.slug.trim()) {
      onShowToast('Vui lòng nhập Slug cho bài viết.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveAdminPost(editingPost);
      if (res.success) {
        onShowToast(`Đã lưu bài viết "${editingPost.slug}" thành công!`, 'success');
        setEditingPost(null);
        refreshData();
      } else {
        onShowToast(`Lưu bài viết thất bại: ${res.error}`, 'error');
      }
    } catch (err: any) {
      onShowToast(`Lỗi: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (id: string, slug: string) => {
    if (!confirm(`Bạn có chắc muốn xoá bài viết "${slug}"?`)) return;
    try {
      const res = await deleteAdminPost(id);
      if (res.success) {
        onShowToast(`Đã xoá bài viết "${slug}"!`, 'success');
        refreshData();
      }
    } catch (err: any) {
      onShowToast(`Lỗi xoá: ${err.message}`, 'error');
    }
  };

  // =========================================================================
  // Handlers for Categories
  // =========================================================================
  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    if (!editingCategory.slug.trim()) {
      onShowToast('Vui lòng nhập Slug chuyên mục.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveAdminCategory(editingCategory);
      if (res.success) {
        onShowToast(`Đã lưu chuyên mục "${editingCategory.slug}" thành công!`, 'success');
        setEditingCategory(null);
        refreshData();
      }
    } catch (err: any) {
      onShowToast(`Lỗi: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string, slug: string) => {
    if (!confirm(`Bạn có chắc muốn xoá chuyên mục "${slug}"? Tất cả bài viết thuộc chuyên mục này sẽ bị huỷ liên kết.`)) return;
    try {
      const res = await deleteAdminCategory(id);
      if (res.success) {
        onShowToast(`Đã xoá chuyên mục "${slug}"!`, 'success');
        refreshData();
      }
    } catch (err: any) {
      onShowToast(`Lỗi: ${err.message}`, 'error');
    }
  };

  // =========================================================================
  // Handlers for Tags
  // =========================================================================
  const handleSaveTag = async () => {
    if (!editingTag) return;
    if (!editingTag.slug.trim()) {
      onShowToast('Vui lòng nhập Slug cho thẻ.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveAdminTag(editingTag);
      if (res.success) {
        onShowToast(`Đã lưu thẻ "${editingTag.slug}" thành công!`, 'success');
        setEditingTag(null);
        refreshData();
      }
    } catch (err: any) {
      onShowToast(`Lỗi: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTag = async (id: string, slug: string) => {
    if (!confirm(`Bạn có chắc muốn xoá thẻ "${slug}"?`)) return;
    try {
      const res = await deleteAdminTag(id);
      if (res.success) {
        onShowToast(`Đã xoá thẻ "${slug}"!`, 'success');
        refreshData();
      }
    } catch (err: any) {
      onShowToast(`Lỗi: ${err.message}`, 'error');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(56, 189, 248, 0.2)',
            borderTopColor: '#38bdf8',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <p>Đang nạp dữ liệu Blog CMS từ Supabase...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Subtab navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'posts', label: `📝 Bài viết (${posts.length})` },
            { id: 'categories', label: `🗂️ Chuyên mục (${categories.length})` },
            { id: 'tags', label: `🏷️ Thẻ & Từ khóa (${tags.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubtab(tab.id as any)}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '0.5rem',
                border: '1px solid',
                borderColor: activeSubtab === tab.id ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)',
                background: activeSubtab === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                color: activeSubtab === tab.id ? '#38bdf8' : '#94a3b8',
                fontWeight: activeSubtab === tab.id ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Button for Current Subtab */}
        {activeSubtab === 'posts' && (
          <button
            onClick={handleOpenNewPost}
            style={{
              padding: '0.55rem 1.1rem',
              background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
            }}
          >
            <span>+ Tạo Bài viết Mới</span>
          </button>
        )}

        {activeSubtab === 'categories' && (
          <button
            onClick={() =>
              setEditingCategory({
                slug: '',
                post_schedule: categories.length + 1,
                icon: 'LayersIcon',
                color: '#3B82F6',
                translations: {
                  vi: { lang_code: 'vi', name: '', description: '' },
                  en: { lang_code: 'en', name: '', description: '' },
                },
              })
            }
            style={{
              padding: '0.55rem 1.1rem',
              background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            + Thêm Chuyên mục
          </button>
        )}

        {activeSubtab === 'tags' && (
          <button
            onClick={() =>
              setEditingTag({
                slug: '',
                translations: {
                  vi: { lang_code: 'vi', name: '' },
                  en: { lang_code: 'en', name: '' },
                },
              })
            }
            style={{
              padding: '0.55rem 1.1rem',
              background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            + Thêm Thẻ Mới
          </button>
        )}
      </div>

      {/* =====================================================================
          SUBTAB 1: POSTS LIST
          ===================================================================== */}
      {activeSubtab === 'posts' && (
        <div>
          {/* Filters Bar */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="text"
              placeholder="🔍 Tìm bài viết theo tiêu đề, slug..."
              className="admin-input"
              style={{ maxWidth: '380px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="admin-select"
              style={{ maxWidth: '240px' }}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Tất cả chuyên mục</option>
              {categories.map((c) => (
                <option key={c.id || c.slug} value={c.slug}>
                  {c.translations.vi?.name || c.slug}
                </option>
              ))}
            </select>
          </div>

          {/* Posts Table */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tiêu đề & Slug</th>
                  <th>Chuyên mục</th>
                  <th>Thời gian đọc</th>
                  <th>Ngày phát hành</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      Không tìm thấy bài viết nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => {
                    const titleVi = post.translations.vi?.title || 'Chưa có tiêu đề (VI)';
                    const titleEn = post.translations.en?.title || 'No title (EN)';
                    const isPublished = post.published_at && new Date(post.published_at) <= new Date();

                    return (
                      <tr key={post.id || post.slug}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>{titleVi}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace', marginTop: '0.15rem' }}>
                            /{post.slug} • {titleEn}
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              background: 'rgba(56, 189, 248, 0.12)',
                              color: '#38bdf8',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                            }}
                          >
                            {post.category_slug || 'Chưa phân loại'}
                          </span>
                        </td>
                        <td>{post.read_time} phút</td>
                        <td>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              color: isPublished ? '#4ade80' : '#fbbf24',
                              fontSize: '0.82rem',
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: isPublished ? '#4ade80' : '#fbbf24',
                              }}
                            />
                            {post.published_at ? post.published_at.substring(0, 10) : 'Bản nháp'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button
                              onClick={() => {
                                setEditingPost({ ...post });
                                setPostEditLang('vi');
                              }}
                              style={{
                                padding: '0.35rem 0.75rem',
                                background: 'rgba(59, 130, 246, 0.15)',
                                color: '#60a5fa',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                borderRadius: '0.35rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                              }}
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id!, post.slug)}
                              style={{
                                padding: '0.35rem 0.75rem',
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#f87171',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '0.35rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                              }}
                            >
                              Xoá
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUBTAB 2: CATEGORIES LIST
          ===================================================================== */}
      {activeSubtab === 'categories' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Lịch phát hành</th>
                <th>Tên chuyên đề (VI)</th>
                <th>Tên chuyên đề (EN)</th>
                <th>Slug & Icon</th>
                <th>Màu sắc</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id || cat.slug}>
                  <td>Thứ {cat.post_schedule + 1} (T{cat.post_schedule + 1})</td>
                  <td style={{ fontWeight: 600, color: '#f8fafc' }}>{cat.translations.vi?.name || '-'}</td>
                  <td>{cat.translations.en?.name || '-'}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8' }}>
                      {cat.slug} ({cat.icon})
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '3px',
                          background: cat.color || '#3B82F6',
                        }}
                      />
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{cat.color}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => setEditingCategory({ ...cat })}
                        style={{
                          padding: '0.35rem 0.75rem',
                          background: 'rgba(59, 130, 246, 0.15)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '0.35rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id!, cat.slug)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '0.35rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =====================================================================
          SUBTAB 3: TAGS LIST
          ===================================================================== */}
      {activeSubtab === 'tags' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên Thẻ (VI)</th>
                <th>Tên Thẻ (EN)</th>
                <th>Slug</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id || tag.slug}>
                  <td style={{ fontWeight: 600, color: '#f8fafc' }}>{tag.translations.vi?.name || '-'}</td>
                  <td>{tag.translations.en?.name || '-'}</td>
                  <td style={{ fontFamily: 'monospace', color: '#94a3b8' }}>#{tag.slug}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => setEditingTag({ ...tag })}
                        style={{
                          padding: '0.35rem 0.75rem',
                          background: 'rgba(59, 130, 246, 0.15)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '0.35rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id!, tag.slug)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '0.35rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =====================================================================
          MODAL: POST EDITOR (SPLIT-SCREEN MARKDOWN & PREVIEW)
          ===================================================================== */}
      {editingPost && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container" style={{ maxWidth: '1200px', height: '94vh' }}>
            <div className="modal-header">
              <h2>{editingPost.id ? '✏️ Chỉnh sửa Bài viết' : '✨ Tạo Bài viết Mới'}</h2>
              <button
                onClick={() => setEditingPost(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Metadata row */}
              <div className="admin-grid-3">
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>Slug URL (Định danh bài viết)</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="vi-du-bai-viet-slug"
                    value={editingPost.slug}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>Chuyên mục (Category)</label>
                  <select
                    className="admin-select"
                    value={editingPost.category_id || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, category_id: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.translations.vi?.name || c.slug}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>Thời gian đọc (phút)</label>
                  <input
                    type="number"
                    min={1}
                    className="admin-input"
                    value={editingPost.read_time}
                    onChange={(e) => setEditingPost({ ...editingPost, read_time: parseInt(e.target.value, 10) || 5 })}
                  />
                </div>
              </div>

              {/* Tags Multi-select */}
              <div className="admin-form-group" style={{ marginBottom: '0.5rem' }}>
                <label>Gắn Thẻ (Tags):</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                  {tags.map((t) => {
                    const isSelected = editingPost.tag_ids.includes(t.id!);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          const updated = isSelected
                            ? editingPost.tag_ids.filter((id) => id !== t.id)
                            : [...editingPost.tag_ids, t.id!];
                          setEditingPost({ ...editingPost, tag_ids: updated });
                        }}
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          border: '1px solid',
                          borderColor: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.1)',
                          background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                          color: isSelected ? '#38bdf8' : '#94a3b8',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        #{t.translations.vi?.name || t.slug}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language Switcher for Content */}
              <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                {(['vi', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setPostEditLang(lang)}
                    style={{
                      padding: '0.4rem 0.9rem',
                      borderRadius: '0.4rem',
                      border: '1px solid',
                      borderColor: postEditLang === lang ? '#38bdf8' : 'transparent',
                      background: postEditLang === lang ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                      color: postEditLang === lang ? '#38bdf8' : '#cbd5e1',
                      fontWeight: postEditLang === lang ? 700 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    {lang === 'vi' ? '🇻🇳 Tiếng Việt (VI)' : '🇬🇧 English (EN)'}
                  </button>
                ))}
              </div>

              {/* Title & Summary */}
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label>Tiêu đề bài viết [{postEditLang.toUpperCase()}]</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Nhập tiêu đề..."
                  value={editingPost.translations[postEditLang]?.title || ''}
                  onChange={(e) => {
                    const trans = editingPost.translations[postEditLang] || { lang_code: postEditLang, title: '', summary: '', content_md: '' };
                    setEditingPost({
                      ...editingPost,
                      translations: {
                        ...editingPost.translations,
                        [postEditLang]: { ...trans, title: e.target.value },
                      },
                    });
                  }}
                />
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label>Tóm tắt ngắn (Summary) [{postEditLang.toUpperCase()}]</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  placeholder="Mô tả tóm tắt..."
                  value={editingPost.translations[postEditLang]?.summary || ''}
                  onChange={(e) => {
                    const trans = editingPost.translations[postEditLang] || { lang_code: postEditLang, title: '', summary: '', content_md: '' };
                    setEditingPost({
                      ...editingPost,
                      translations: {
                        ...editingPost.translations,
                        [postEditLang]: { ...trans, summary: e.target.value },
                      },
                    });
                  }}
                />
              </div>

              {/* Split-Pane Markdown Editor & Live Preview */}
              <div className="admin-split-editor" style={{ flexGrow: 1 }}>
                <div className="editor-pane">
                  <div className="pane-toolbar">📝 Soạn thảo Markdown [{postEditLang.toUpperCase()}]</div>
                  <textarea
                    placeholder="# Tiêu đề đề mục...&#10;&#10;Nội dung bài viết kỹ thuật..."
                    value={editingPost.translations[postEditLang]?.content_md || ''}
                    onChange={(e) => {
                      const trans = editingPost.translations[postEditLang] || { lang_code: postEditLang, title: '', summary: '', content_md: '' };
                      setEditingPost({
                        ...editingPost,
                        translations: {
                          ...editingPost.translations,
                          [postEditLang]: { ...trans, content_md: e.target.value },
                        },
                      });
                    }}
                  />
                </div>

                <div className="preview-pane">
                  <div className="pane-header">👁️ Xem trước trực tiếp (Live Preview)</div>
                  <div
                    className="preview-content"
                    dangerouslySetInnerHTML={{
                      __html: markdownToHtml(editingPost.translations[postEditLang]?.content_md || '*Chưa có nội dung...*'),
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setEditingPost(null)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#cbd5e1',
                  borderRadius: '0.4rem',
                  cursor: 'pointer',
                }}
              >
                Huỷ bỏ
              </button>
              <button
                onClick={handleSavePost}
                disabled={isSaving}
                style={{
                  padding: '0.5rem 1.25rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.4rem',
                  fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                }}
              >
                {isSaving ? 'Đang lưu...' : 'Lưu Bài viết'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CATEGORY EDITOR
          ===================================================================== */}
      {editingCategory && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>{editingCategory.id ? '✏️ Chỉnh sửa Chuyên mục' : '✨ Thêm Chuyên mục'}</h2>
              <button
                onClick={() => setEditingCategory(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label>Slug</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingCategory.slug}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Lịch phát hành (1 = Thứ 2, 2 = Thứ 3...)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className="admin-input"
                    value={editingCategory.post_schedule}
                    onChange={(e) => setEditingCategory({ ...editingCategory, post_schedule: parseInt(e.target.value, 10) || 1 })}
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label>Icon Name (Ví dụ: LayersIcon, CpuIcon)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingCategory.icon || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Màu sắc (Hex code)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingCategory.color || '#3B82F6'}
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Tên chuyên mục (Tiếng Việt)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingCategory.translations.vi?.name || ''}
                  onChange={(e) => {
                    const vi = editingCategory.translations.vi || { lang_code: 'vi', name: '', description: '' };
                    setEditingCategory({
                      ...editingCategory,
                      translations: {
                        ...editingCategory.translations,
                        vi: { ...vi, name: e.target.value },
                      },
                    });
                  }}
                />
              </div>

              <div className="admin-form-group">
                <label>Tên chuyên mục (English)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingCategory.translations.en?.name || ''}
                  onChange={(e) => {
                    const en = editingCategory.translations.en || { lang_code: 'en', name: '', description: '' };
                    setEditingCategory({
                      ...editingCategory,
                      translations: {
                        ...editingCategory.translations,
                        en: { ...en, name: e.target.value },
                      },
                    });
                  }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setEditingCategory(null)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#cbd5e1',
                  borderRadius: '0.4rem',
                  cursor: 'pointer',
                }}
              >
                Huỷ bỏ
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={isSaving}
                style={{
                  padding: '0.5rem 1.25rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.4rem',
                  fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                }}
              >
                {isSaving ? 'Đang lưu...' : 'Lưu Chuyên mục'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: TAG EDITOR
          ===================================================================== */}
      {editingTag && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>{editingTag.id ? '✏️ Chỉnh sửa Thẻ' : '✨ Thêm Thẻ Mới'}</h2>
              <button
                onClick={() => setEditingTag(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="admin-form-group">
                <label>Slug thẻ</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="vi-du-tag"
                  value={editingTag.slug}
                  onChange={(e) => setEditingTag({ ...editingTag, slug: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Tên thẻ (Tiếng Việt)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingTag.translations.vi?.name || ''}
                  onChange={(e) => {
                    const vi = editingTag.translations.vi || { lang_code: 'vi', name: '' };
                    setEditingTag({
                      ...editingTag,
                      translations: {
                        ...editingTag.translations,
                        vi: { ...vi, name: e.target.value },
                      },
                    });
                  }}
                />
              </div>

              <div className="admin-form-group">
                <label>Tên thẻ (English)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingTag.translations.en?.name || ''}
                  onChange={(e) => {
                    const en = editingTag.translations.en || { lang_code: 'en', name: '' };
                    setEditingTag({
                      ...editingTag,
                      translations: {
                        ...editingTag.translations,
                        en: { ...en, name: e.target.value },
                      },
                    });
                  }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setEditingTag(null)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#cbd5e1',
                  borderRadius: '0.4rem',
                  cursor: 'pointer',
                }}
              >
                Huỷ bỏ
              </button>
              <button
                onClick={handleSaveTag}
                disabled={isSaving}
                style={{
                  padding: '0.5rem 1.25rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.4rem',
                  fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                }}
              >
                {isSaving ? 'Đang lưu...' : 'Lưu Thẻ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogManager;
