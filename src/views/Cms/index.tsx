'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  getAllAdminPosts,
  saveAdminPost,
  deleteAdminPost,
  getAllAdminCategories,
  saveAdminCategory,
  deleteAdminCategory,
  getAllAdminTags,
  saveAdminTag,
  deleteAdminTag,
  AdminPost,
  AdminCategory,
  AdminTag,
} from '@/services/blogAdminService';
import { getCvData, saveCvData } from '@/services/cvService';
import { signInWithEmail, getCurrentUser, signOut } from '@/services/authService';
import { isSupabaseConfigured } from '@/utils/supabase/client';
import { CVData } from '@/types';
import { CmsTab } from '@/components/layouts/CmsLayout';

export function CmsView({ activeTab }: { activeTab: CmsTab }) {
  const { dict, currentLang } = useLanguage();

  // Data states
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [cvJsonString, setCvJsonString] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Auth states
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Post Editor state
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);
  const [postEditLang, setPostEditLang] = useState<'vi' | 'en'>('vi');

  // Category & Tag Editor state
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [editingTag, setEditingTag] = useState<AdminTag | null>(null);

  const loadAllAdminData = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const [allPosts, allCats, allTags, cv] = await Promise.all([
        getAllAdminPosts().catch(() => []),
        getAllAdminCategories().catch(() => []),
        getAllAdminTags().catch(() => []),
        getCvData(currentLang).catch(() => null),
      ]);
      setPosts(allPosts);
      setCategories(allCats);
      setTags(allTags);
      if (cv) {
        setCvData(cv);
        setCvJsonString(JSON.stringify(cv, null, 2));
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error loading CMS data' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser().then(setCurrentUser);
    loadAllAdminData();
  }, [currentLang]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Auth handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    const { user, error } = await signInWithEmail(authEmail, authPassword);
    setIsAuthLoading(false);
    if (error) {
      showNotification('error', `Đăng nhập thất bại: ${error}`);
    } else {
      setCurrentUser(user);
      showNotification('success', 'Đăng nhập thành công!');
      loadAllAdminData();
    }
  };

  // -------------------------------------------------------------
  // POST ACTIONS
  // -------------------------------------------------------------
  const handleCreateNewPost = () => {
    const newPost: AdminPost = {
      slug: `new-post-${Date.now()}`,
      read_time: 5,
      category_id: categories[0]?.id || null,
      tag_ids: [],
      tags: [],
      published_at: new Date().toISOString().substring(0, 10),
      translations: {
        vi: { lang_code: 'vi', title: '', summary: '', content_md: '' },
        en: { lang_code: 'en', title: '', summary: '', content_md: '' },
      },
    };
    setEditingPost(newPost);
  };

  const handleSavePost = async () => {
    if (!editingPost) return;
    if (!editingPost.slug.trim()) {
      showNotification('error', 'Slug không được để trống.');
      return;
    }

    try {
      await saveAdminPost(editingPost);
      showNotification('success', `Đã lưu bài viết "${editingPost.slug}" thành công!`);
      setEditingPost(null);
      loadAllAdminData();
    } catch (err: any) {
      showNotification('error', `Lỗi khi lưu bài viết: ${err.message}`);
    }
  };

  const handleDeletePost = async (id: string, slug: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết "${slug}"?`)) return;
    try {
      await deleteAdminPost(id);
      showNotification('success', `Đã xóa bài viết "${slug}".`);
      loadAllAdminData();
    } catch (err: any) {
      showNotification('error', `Lỗi xóa bài: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // CATEGORY ACTIONS
  // -------------------------------------------------------------
  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    try {
      await saveAdminCategory(editingCategory);
      showNotification('success', `Đã lưu chuyên mục "${editingCategory.slug}".`);
      setEditingCategory(null);
      loadAllAdminData();
    } catch (err: any) {
      showNotification('error', `Lỗi lưu chuyên mục: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chuyên mục này?')) return;
    try {
      await deleteAdminCategory(id);
      showNotification('success', 'Đã xóa chuyên mục.');
      loadAllAdminData();
    } catch (err: any) {
      showNotification('error', `Lỗi: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // TAG ACTIONS
  // -------------------------------------------------------------
  const handleSaveTag = async () => {
    if (!editingTag) return;
    try {
      await saveAdminTag(editingTag);
      showNotification('success', `Đã lưu thẻ "${editingTag.slug}".`);
      setEditingTag(null);
      loadAllAdminData();
    } catch (err: any) {
      showNotification('error', `Lỗi: ${err.message}`);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thẻ này?')) return;
    try {
      await deleteAdminTag(id);
      showNotification('success', 'Đã xóa thẻ.');
      loadAllAdminData();
    } catch (err: any) {
      showNotification('error', `Lỗi: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // CV ACTIONS
  // -------------------------------------------------------------
  const handleSaveCv = async () => {
    try {
      const parsed: CVData = JSON.parse(cvJsonString);
      await saveCvData(currentLang, parsed);
      setCvData(parsed);
      showNotification('success', `Đã cập nhật hồ sơ CV (${currentLang.toUpperCase()}) thành công lên Supabase!`);
    } catch (err: any) {
      showNotification('error', `JSON không hợp lệ hoặc lỗi lưu: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="font-bold text-sm">
            ✕
          </button>
        </div>
      )}

      {/* 1. DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-gray-800">
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Tổng Bài Viết
              </div>
              <div className="text-3xl font-black text-white">{posts.length}</div>
              <div className="text-[11px] text-indigo-400 mt-1">Đồng bộ Supabase</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-gray-800">
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Chuyên Mục
              </div>
              <div className="text-3xl font-black text-white">{categories.length}</div>
              <div className="text-[11px] text-blue-400 mt-1">Lịch xuất bản T2-T6</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-gray-800">
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Thẻ Kỹ Thuật
              </div>
              <div className="text-3xl font-black text-white">{tags.length}</div>
              <div className="text-[11px] text-purple-400 mt-1">Đa ngôn ngữ VI/EN</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-gray-800">
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Trạng Thái Supabase
              </div>
              <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isSupabaseConfigured() ? 'Sẵn sàng' : 'Chưa cấu hình'}</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">PostgreSQL + RLS</div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-lg font-bold text-white">Thao tác nhanh</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCreateNewPost}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                + {dict.cms.newPost}
              </button>
              <button
                onClick={loadAllAdminData}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition-colors"
              >
                🔄 Đồng bộ lại dữ liệu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. POSTS TAB */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{dict.cms.posts}</h2>
            <button
              onClick={handleCreateNewPost}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
            >
              + {dict.cms.newPost}
            </button>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-gray-400">{dict.common.loading}</div>
          ) : (
            <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800 font-mono text-[11px]">
                    <tr>
                      <th className="p-3.5">Slug</th>
                      <th className="p-3.5">Tiêu đề (VI)</th>
                      <th className="p-3.5">Tiêu đề (EN)</th>
                      <th className="p-3.5">Ngày đăng</th>
                      <th className="p-3.5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-gray-300">
                    {posts.map((p) => (
                      <tr key={p.id || p.slug} className="hover:bg-gray-800/40 transition-colors">
                        <td className="p-3.5 font-mono text-indigo-400 font-medium">{p.slug}</td>
                        <td className="p-3.5 font-semibold text-white truncate max-w-xs">
                          {p.translations?.vi?.title || '—'}
                        </td>
                        <td className="p-3.5 text-gray-300 truncate max-w-xs">
                          {p.translations?.en?.title || '—'}
                        </td>
                        <td className="p-3.5 font-mono text-gray-400">
                          {p.published_at ? p.published_at.substring(0, 10) : 'Nháp'}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setEditingPost(p)}
                            className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-[11px]"
                          >
                            {dict.cms.edit}
                          </button>
                          {p.id && (
                            <button
                              onClick={() => handleDeletePost(p.id!, p.slug)}
                              className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-[11px]"
                            >
                              {dict.cms.delete}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{dict.cms.categories}</h2>
            <button
              onClick={() =>
                setEditingCategory({
                  slug: `category-${Date.now()}`,
                  post_schedule: 1,
                  translations: {
                    vi: { lang_code: 'vi', name: '', description: '' },
                    en: { lang_code: 'en', name: '', description: '' },
                  },
                })
              }
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
            >
              + {dict.cms.newCategory}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id || c.slug} className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs text-indigo-400 font-bold">{c.slug}</span>
                    <h3 className="text-sm font-bold text-white mt-1">
                      {c.translations?.vi?.name || c.slug}
                    </h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-400">
                    T{c.post_schedule}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {c.translations?.vi?.description || c.translations?.en?.description}
                </p>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-800/80">
                  <button
                    onClick={() => setEditingCategory(c)}
                    className="px-2 py-1 bg-gray-800 text-gray-200 rounded text-xs"
                  >
                    {dict.cms.edit}
                  </button>
                  {c.id && (
                    <button
                      onClick={() => handleDeleteCategory(c.id!)}
                      className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs"
                    >
                      {dict.cms.delete}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAGS TAB */}
      {activeTab === 'tags' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{dict.cms.tags}</h2>
            <button
              onClick={() =>
                setEditingTag({
                  slug: `tag-${Date.now()}`,
                  translations: {
                    vi: { lang_code: 'vi', name: '' },
                    en: { lang_code: 'en', name: '' },
                  },
                })
              }
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
            >
              + {dict.cms.newTag}
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {tags.map((t) => (
              <div
                key={t.id || t.slug}
                className="glass-panel px-3 py-2 rounded-xl border border-gray-800 flex items-center gap-2 text-xs"
              >
                <span className="font-mono text-red-400">#{t.slug}</span>
                <span className="text-gray-300 font-medium">({t.translations?.vi?.name || t.slug})</span>
                <button
                  onClick={() => setEditingTag(t)}
                  className="text-gray-400 hover:text-white ml-1"
                >
                  ✎
                </button>
                {t.id && (
                  <button
                    onClick={() => handleDeleteTag(t.id!)}
                    className="text-red-400 hover:text-red-300 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CV EDITOR TAB */}
      {activeTab === 'cv' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{dict.cms.cvEditor}</h2>
              <p className="text-xs text-gray-400">
                Chỉnh sửa dữ liệu hồ sơ CV cho ngôn ngữ: <strong className="text-red-400 uppercase">{currentLang}</strong>
              </p>
            </div>
            <button
              onClick={handleSaveCv}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-colors"
            >
              💾 {dict.cms.save}
            </button>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-gray-800">
            <textarea
              value={cvJsonString}
              onChange={(e) => setCvJsonString(e.target.value)}
              rows={22}
              className="w-full bg-gray-950 p-4 rounded-xl border border-gray-800 text-xs font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* 6. SETTINGS & AUTH TAB */}
      {activeTab === 'settings' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
            <h2 className="text-lg font-bold text-white">{dict.cms.loginTitle}</h2>
            <p className="text-xs text-gray-400">{dict.cms.loginSubtitle}</p>

            {currentUser ? (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  ✅ Bạn đang đăng nhập với tài khoản: <strong>{currentUser.email}</strong>
                </div>
                <button
                  onClick={async () => {
                    await signOut();
                    setCurrentUser(null);
                    showNotification('success', 'Đã đăng xuất.');
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-bold border border-red-500/30 transition-colors"
                >
                  {dict.cms.signOut}
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">{dict.cms.email}</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">{dict.cms.password}</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {isAuthLoading ? dict.common.loading : dict.cms.signIn}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POST EDIT MODAL */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl max-w-4xl w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white">Chỉnh sửa bài viết</h3>
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-800 rounded-lg p-0.5 text-xs">
                  <button
                    onClick={() => setPostEditLang('vi')}
                    className={`px-3 py-1 rounded-md font-bold ${
                      postEditLang === 'vi' ? 'bg-red-600 text-white' : 'text-gray-400'
                    }`}
                  >
                    VI
                  </button>
                  <button
                    onClick={() => setPostEditLang('en')}
                    className={`px-3 py-1 rounded-md font-bold ${
                      postEditLang === 'en' ? 'bg-red-600 text-white' : 'text-gray-400'
                    }`}
                  >
                    EN
                  </button>
                </div>
                <button
                  onClick={() => setEditingPost(null)}
                  className="text-gray-400 hover:text-white font-bold text-lg ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Slug (URL)</label>
                <input
                  type="text"
                  value={editingPost.slug}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Chuyên mục</label>
                <select
                  value={editingPost.category_id || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, category_id: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                >
                  <option value="">-- Chọn chuyên mục --</option>
                  {categories.map((c) => (
                    <option key={c.id || c.slug} value={c.id || c.slug}>
                      {c.translations?.vi?.name || c.slug}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">
                  Tiêu đề ({postEditLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={editingPost.translations[postEditLang]?.title || ''}
                  onChange={(e) => {
                    const trans = { ...editingPost.translations };
                    trans[postEditLang] = {
                      ...(trans[postEditLang] || { lang_code: postEditLang, content_md: '' }),
                      title: e.target.value,
                    };
                    setEditingPost({ ...editingPost, translations: trans });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">
                  Tóm tắt ({postEditLang.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={editingPost.translations[postEditLang]?.summary || ''}
                  onChange={(e) => {
                    const trans = { ...editingPost.translations };
                    trans[postEditLang] = {
                      ...(trans[postEditLang] || { lang_code: postEditLang, content_md: '' }),
                      summary: e.target.value,
                    };
                    setEditingPost({ ...editingPost, translations: trans });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">
                  Nội dung Markdown ({postEditLang.toUpperCase()})
                </label>
                <textarea
                  rows={10}
                  value={editingPost.translations[postEditLang]?.content_md || ''}
                  onChange={(e) => {
                    const trans = { ...editingPost.translations };
                    trans[postEditLang] = {
                      ...(trans[postEditLang] || { lang_code: postEditLang, content_md: '' }),
                      content_md: e.target.value,
                    };
                    setEditingPost({ ...editingPost, translations: trans });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold"
              >
                {dict.cms.cancel}
              </button>
              <button
                onClick={handleSavePost}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                {dict.cms.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY EDIT MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Chỉnh sửa chuyên mục</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Slug</label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Tên (VI)</label>
                <input
                  type="text"
                  value={editingCategory.translations?.vi?.name || ''}
                  onChange={(e) => {
                    const trans = { ...editingCategory.translations };
                    trans.vi = { ...(trans.vi || { lang_code: 'vi' }), name: e.target.value };
                    setEditingCategory({ ...editingCategory, translations: trans });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Tên (EN)</label>
                <input
                  type="text"
                  value={editingCategory.translations?.en?.name || ''}
                  onChange={(e) => {
                    const trans = { ...editingCategory.translations };
                    trans.en = { ...(trans.en || { lang_code: 'en' }), name: e.target.value };
                    setEditingCategory({ ...editingCategory, translations: trans });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs"
              >
                {dict.cms.cancel}
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                {dict.cms.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAG EDIT MODAL */}
      {editingTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Chỉnh sửa thẻ (Tag)</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Slug</label>
                <input
                  type="text"
                  value={editingTag.slug}
                  onChange={(e) => setEditingTag({ ...editingTag, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Tên hiển thị (VI)</label>
                <input
                  type="text"
                  value={editingTag.translations?.vi?.name || ''}
                  onChange={(e) => {
                    const trans = { ...editingTag.translations };
                    trans.vi = { ...(trans.vi || { lang_code: 'vi' }), name: e.target.value };
                    setEditingTag({ ...editingTag, translations: trans });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Tên hiển thị (EN)</label>
                <input
                  type="text"
                  value={editingTag.translations?.en?.name || ''}
                  onChange={(e) => {
                    const trans = { ...editingTag.translations };
                    trans.en = { ...(trans.en || { lang_code: 'en' }), name: e.target.value };
                    setEditingTag({ ...editingTag, translations: trans });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={() => setEditingTag(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs"
              >
                {dict.cms.cancel}
              </button>
              <button
                onClick={handleSaveTag}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                {dict.cms.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
