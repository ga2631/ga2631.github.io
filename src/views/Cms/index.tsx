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
import { getCurrentUser } from '@/services/authService';
import { CVData } from '@/types';
import { CmsTab } from '@/components/layouts/CmsLayout';
import { CmsDashboard } from './components/CmsDashboard';
import { CmsCategories } from './components/CmsCategories';
import { CmsTags } from './components/CmsTags';
import { CmsPosts } from './components/CmsPosts';
import { CmsCvEditor } from './components/CmsCvEditor';
import { CmsLogin } from './components/CmsLogin';

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
      setFeedback({ type: 'error', message: err.message || 'Lỗi khi tải dữ liệu CMS' });
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
  const handleSaveCv = async (targetLang: string, updatedData: CVData) => {
    try {
      await saveCvData(targetLang, updatedData);
      if (targetLang === currentLang) {
        setCvData(updatedData);
        setCvJsonString(JSON.stringify(updatedData, null, 2));
      }
      showNotification('success', `Đã cập nhật hồ sơ CV (${targetLang.toUpperCase()}) thành công lên Supabase!`);
    } catch (err: any) {
      showNotification('error', `Lỗi khi lưu hồ sơ CV: ${err.message}`);
      throw err;
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
        <CmsCvEditor
          cvData={cvData}
          isLoading={isLoading}
          currentLang={currentLang}
          onSave={handleSaveCv}
          onReload={loadAllAdminData}
        />
      )}

      {/* 6. LOGIN & AUTH TAB (Replaces Settings) */}
      {(activeTab === 'login' || activeTab === 'settings') && (
        <CmsLogin
          currentUser={currentUser}
          onUserChange={(user) => {
            setCurrentUser(user);
            if (user) loadAllAdminData();
          }}
          onSelectTab={onSelectTab}
        />
      )}

    </div>
  );
}
