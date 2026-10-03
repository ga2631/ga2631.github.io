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
import { CmsDashboard } from './components/CmsDashboard';
import { CmsCategories } from './components/CmsCategories';
import { CmsTags } from './components/CmsTags';
import { CmsPosts } from './components/CmsPosts';

interface CmsViewProps {
  activeTab: CmsTab;
  onSelectTab?: (tab: CmsTab) => void;
}

export function CmsView({ activeTab, onSelectTab }: CmsViewProps) {
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

  const handleCreatePostWithSchedule = (categoryId?: string, dateStr?: string) => {
    const slugSuffix = dateStr ? dateStr.replace(/-/g, '') : Date.now();
    const newPost: AdminPost = {
      slug: `post-${slugSuffix}`,
      read_time: 5,
      category_id: categoryId || categories[0]?.id || null,
      tag_ids: [],
      tags: [],
      published_at: dateStr || new Date().toISOString().substring(0, 10),
      translations: {
        vi: { lang_code: 'vi', title: '', summary: '', content_md: '' },
        en: { lang_code: 'en', title: '', summary: '', content_md: '' },
      },
    };
    setEditingPost(newPost);
    if (onSelectTab) {
      onSelectTab('posts');
    }
  };

  const handleEditPostFromDashboard = (post: AdminPost) => {
    setEditingPost(post);
    if (onSelectTab) {
      onSelectTab('posts');
    }
  };

  const handleSavePost = async (postToSave?: AdminPost) => {
    const target = postToSave || editingPost;
    if (!target) return;
    if (!target.slug.trim()) {
      showNotification('error', 'Slug không được để trống.');
      return;
    }

    try {
      await saveAdminPost(target);
      showNotification('success', `Đã lưu bài viết "${target.slug}" thành công!`);
      setEditingPost(null);
      await loadAllAdminData();
    } catch (err: any) {
      showNotification('error', `Lỗi khi lưu bài viết: ${err.message}`);
      throw err;
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
  const handleSaveCategory = async (category: AdminCategory) => {
    try {
      await saveAdminCategory(category);
      showNotification('success', `Đã lưu chuyên mục "${category.slug}".`);
      await loadAllAdminData();
    } catch (err: any) {
      showNotification('error', `Lỗi lưu chuyên mục: ${err.message}`);
      throw err;
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteAdminCategory(id);
      showNotification('success', 'Đã xóa chuyên mục.');
      await loadAllAdminData();
    } catch (err: any) {
      showNotification('error', `Lỗi: ${err.message}`);
      throw err;
    }
  };

  // -------------------------------------------------------------
  // TAG ACTIONS
  // -------------------------------------------------------------
  const handleSaveTag = async (tag: AdminTag) => {
    try {
      await saveAdminTag(tag);
      showNotification('success', `Đã lưu thẻ "${tag.slug}".`);
      await loadAllAdminData();
    } catch (err: any) {
      showNotification('error', `Lỗi: ${err.message}`);
      throw err;
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await deleteAdminTag(id);
      showNotification('success', 'Đã xóa thẻ.');
      await loadAllAdminData();
    } catch (err: any) {
      showNotification('error', `Lỗi: ${err.message}`);
      throw err;
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
          <button onClick={() => setFeedback(null)} className="font-bold text-sm cursor-pointer hover:opacity-75">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* 1. DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <CmsDashboard
          posts={posts}
          categories={categories}
          tags={tags}
          isLoading={isLoading}
          onSelectTab={onSelectTab || (() => {})}
          onCreatePostWithSchedule={handleCreatePostWithSchedule}
          onEditPost={handleEditPostFromDashboard}
          onRefreshData={loadAllAdminData}
          currentLang={currentLang}
        />
      )}

      {/* 2. POSTS TAB */}
      {activeTab === 'posts' && (
        <CmsPosts
          posts={posts}
          categories={categories}
          tags={tags}
          isLoading={isLoading}
          editingPost={editingPost}
          onSetEditingPost={setEditingPost}
          onSavePost={handleSavePost}
          onDeletePost={handleDeletePost}
          onCreateNewPost={handleCreateNewPost}
          onSelectTab={onSelectTab}
          currentLang={currentLang}
        />
      )}

      {/* 3. CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <CmsCategories
          categories={categories}
          posts={posts}
          isLoading={isLoading}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          onSelectTab={onSelectTab}
          currentLang={currentLang}
        />
      )}

      {/* 4. TAGS TAB */}
      {activeTab === 'tags' && (
        <CmsTags
          tags={tags}
          posts={posts}
          isLoading={isLoading}
          onSaveTag={handleSaveTag}
          onDeleteTag={handleDeleteTag}
          onSelectTab={onSelectTab}
          currentLang={currentLang}
        />
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>{dict.cms.save}</span>
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
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-emerald-400"></i>
                  <span>Bạn đang đăng nhập với tài khoản: <strong>{currentUser.email}</strong></span>
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

    </div>
  );
}
