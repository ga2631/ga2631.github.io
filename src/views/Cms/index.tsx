'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { getCurrentUser, onAuthStateChange } from '@/services/authService';
import { CVData } from '@/types';
import { CmsTab, CMS_TAB_ROUTES } from '@/components/layouts/CmsLayout';
import { CmsDashboard } from './components/CmsDashboard';
import { CmsCategories } from './components/CmsCategories';
import { CmsTags } from './components/CmsTags';
import { CmsPosts } from './components/CmsPosts';
import { CmsCvEditor } from './components/CmsCvEditor';
import { CmsLogin } from './components/CmsLogin';
import { useCms } from './CmsContext';

export { CmsProvider, useCms } from './CmsContext';

interface CmsViewProps {
  activeTab: CmsTab;
  onSelectTab?: (tab: CmsTab) => void;
}

export function CmsView({ activeTab, onSelectTab }: CmsViewProps) {
  const router = useRouter();
  const { currentLang } = useLanguage();
  const cmsContext = useCms();

  // Local fallback states if not wrapped in CmsProvider (e.g. isolated unit tests)
  const [localPosts, setLocalPosts] = useState<AdminPost[]>([]);
  const [localCategories, setLocalCategories] = useState<AdminCategory[]>([]);
  const [localTags, setLocalTags] = useState<AdminTag[]>([]);
  const [localCvData, setLocalCvData] = useState<CVData | null>(null);
  const [localIsLoading, setLocalIsLoading] = useState<boolean>(true);
  const [localFeedback, setLocalFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [localEditingPost, setLocalEditingPost] = useState<AdminPost | null>(null);

  const isUsingContext = !!cmsContext;

  const loadLocalData = async () => {
    setLocalIsLoading(true);
    setLocalFeedback(null);
    try {
      const [allPosts, allCats, allTags, cv] = await Promise.all([
        getAllAdminPosts().catch(() => []),
        getAllAdminCategories().catch(() => []),
        getAllAdminTags().catch(() => []),
        getCvData(currentLang).catch(() => null),
      ]);
      setLocalPosts(allPosts);
      setLocalCategories(allCats);
      setLocalTags(allTags);
      if (cv) {
        setLocalCvData(cv);
      }
    } catch (err: any) {
      setLocalFeedback({ type: 'error', message: err.message || 'Lỗi khi tải dữ liệu CMS' });
    } finally {
      setLocalIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser().then((user) => {
      setCurrentUser(user);
    });

    if (!isUsingContext) {
      loadLocalData();
    }

    const unsubscribe = onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => unsubscribe();
  }, [currentLang, isUsingContext]);

  const showLocalNotification = (type: 'success' | 'error', message: string) => {
    setLocalFeedback({ type, message });
    setTimeout(() => setLocalFeedback(null), 4000);
  };

  // Dispatcher for tab navigation
  const handleSelectTab = (tab: CmsTab) => {
    if (onSelectTab) {
      onSelectTab(tab);
    } else {
      const targetRoute = CMS_TAB_ROUTES[tab] || '/admin';
      router.push(targetRoute);
    }
  };

  // Resolved values
  const posts = isUsingContext ? cmsContext.posts : localPosts;
  const categories = isUsingContext ? cmsContext.categories : localCategories;
  const tags = isUsingContext ? cmsContext.tags : localTags;
  const cvData = isUsingContext ? cmsContext.cvData : localCvData;
  const isLoading = isUsingContext ? cmsContext.isLoading : localIsLoading;
  const feedback = isUsingContext ? cmsContext.feedback : localFeedback;
  const editingPost = isUsingContext ? cmsContext.editingPost : localEditingPost;
  const setEditingPost = isUsingContext ? cmsContext.setEditingPost : setLocalEditingPost;
  const loadAllAdminData = isUsingContext ? cmsContext.loadAllAdminData : loadLocalData;
  const clearNotification = isUsingContext ? cmsContext.clearNotification : () => setLocalFeedback(null);

  // Local Post Actions
  const handleLocalCreateNewPost = () => {
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
    setLocalEditingPost(newPost);
    handleSelectTab('posts');
  };

  const handleLocalCreatePostWithSchedule = (categoryId?: string, dateStr?: string) => {
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
    setLocalEditingPost(newPost);
    handleSelectTab('posts');
  };

  const handleLocalEditPostFromDashboard = (post: AdminPost) => {
    setLocalEditingPost(post);
    handleSelectTab('posts');
  };

  const handleLocalSavePost = async (postToSave?: AdminPost) => {
    const target = postToSave || localEditingPost;
    if (!target) return;
    if (!target.slug.trim()) {
      showLocalNotification('error', 'Slug không được để trống.');
      return;
    }

    try {
      await saveAdminPost(target);
      showLocalNotification('success', `Đã lưu bài viết "${target.slug}" thành công!`);
      setLocalEditingPost(null);
      await loadLocalData();
    } catch (err: any) {
      showLocalNotification('error', `Lỗi khi lưu bài viết: ${err.message}`);
      throw err;
    }
  };

  const handleLocalDeletePost = async (id: string, slug: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết "${slug}"?`)) return;
    try {
      await deleteAdminPost(id);
      showLocalNotification('success', `Đã xóa bài viết "${slug}".`);
      loadLocalData();
    } catch (err: any) {
      showLocalNotification('error', `Lỗi xóa bài: ${err.message}`);
    }
  };

  const handleLocalSaveCategory = async (category: AdminCategory) => {
    try {
      await saveAdminCategory(category);
      showLocalNotification('success', `Đã lưu chuyên mục "${category.slug}".`);
      await loadLocalData();
    } catch (err: any) {
      showLocalNotification('error', `Lỗi lưu chuyên mục: ${err.message}`);
      throw err;
    }
  };

  const handleLocalDeleteCategory = async (id: string) => {
    try {
      await deleteAdminCategory(id);
      showLocalNotification('success', 'Đã xóa chuyên mục.');
      await loadLocalData();
    } catch (err: any) {
      showLocalNotification('error', `Lỗi: ${err.message}`);
      throw err;
    }
  };

  const handleLocalSaveTag = async (tag: AdminTag) => {
    try {
      await saveAdminTag(tag);
      showLocalNotification('success', `Đã lưu thẻ "${tag.slug}".`);
      await loadLocalData();
    } catch (err: any) {
      showLocalNotification('error', `Lỗi: ${err.message}`);
      throw err;
    }
  };

  const handleLocalDeleteTag = async (id: string) => {
    try {
      await deleteAdminTag(id);
      showLocalNotification('success', 'Đã xóa thẻ.');
      await loadLocalData();
    } catch (err: any) {
      showLocalNotification('error', `Lỗi: ${err.message}`);
      throw err;
    }
  };

  const handleLocalSaveCv = async (targetLang: string, updatedData: CVData) => {
    try {
      await saveCvData(targetLang, updatedData);
      if (targetLang === currentLang) {
        setLocalCvData(updatedData);
      }
      showLocalNotification('success', `Đã cập nhật hồ sơ CV (${targetLang.toUpperCase()}) thành công lên Supabase!`);
    } catch (err: any) {
      showLocalNotification('error', `Lỗi khi lưu hồ sơ CV: ${err.message}`);
      throw err;
    }
  };

  // Bound action handlers
  const onSavePost = isUsingContext ? cmsContext.handleSavePost : handleLocalSavePost;
  const onDeletePost = isUsingContext ? cmsContext.handleDeletePost : handleLocalDeletePost;
  const onCreateNewPost = isUsingContext ? cmsContext.handleCreateNewPost : handleLocalCreateNewPost;
  const onCreatePostWithSchedule = isUsingContext ? cmsContext.handleCreatePostWithSchedule : handleLocalCreatePostWithSchedule;
  const onEditPostFromDashboard = isUsingContext ? cmsContext.handleEditPostFromDashboard : handleLocalEditPostFromDashboard;
  const onSaveCategory = isUsingContext ? cmsContext.handleSaveCategory : handleLocalSaveCategory;
  const onDeleteCategory = isUsingContext ? cmsContext.handleDeleteCategory : handleLocalDeleteCategory;
  const onSaveTag = isUsingContext ? cmsContext.handleSaveTag : handleLocalSaveTag;
  const onDeleteTag = isUsingContext ? cmsContext.handleDeleteTag : handleLocalDeleteTag;
  const onSaveCv = isUsingContext ? cmsContext.handleSaveCv : handleLocalSaveCv;

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
          <button onClick={clearNotification} className="font-bold text-sm cursor-pointer hover:opacity-75">
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
          onSelectTab={handleSelectTab}
          onCreatePostWithSchedule={onCreatePostWithSchedule}
          onEditPost={onEditPostFromDashboard}
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
          onSavePost={onSavePost}
          onDeletePost={onDeletePost}
          onCreateNewPost={onCreateNewPost}
          onSelectTab={handleSelectTab}
          currentLang={currentLang}
        />
      )}

      {/* 3. CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <CmsCategories
          categories={categories}
          posts={posts}
          isLoading={isLoading}
          onSaveCategory={onSaveCategory}
          onDeleteCategory={onDeleteCategory}
          onSelectTab={handleSelectTab}
          currentLang={currentLang}
        />
      )}

      {/* 4. TAGS TAB */}
      {activeTab === 'tags' && (
        <CmsTags
          tags={tags}
          posts={posts}
          isLoading={isLoading}
          onSaveTag={onSaveTag}
          onDeleteTag={onDeleteTag}
          onSelectTab={handleSelectTab}
          currentLang={currentLang}
        />
      )}

      {/* 5. CV EDITOR TAB */}
      {activeTab === 'cv' && (
        <CmsCvEditor
          cvData={cvData}
          isLoading={isLoading}
          currentLang={currentLang}
          onSave={onSaveCv}
          onReload={loadAllAdminData}
        />
      )}

      {/* 6. LOGIN & AUTH TAB */}
      {(activeTab === 'login' || activeTab === 'settings') && (
        <CmsLogin
          currentUser={currentUser}
          onUserChange={(user) => {
            setCurrentUser(user);
            if (user) loadAllAdminData();
          }}
          onSelectTab={handleSelectTab}
        />
      )}
    </div>
  );
}
