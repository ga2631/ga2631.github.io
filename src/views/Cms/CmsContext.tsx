'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
import { CVData } from '@/types';

export interface CmsContextType {
  posts: AdminPost[];
  categories: AdminCategory[];
  tags: AdminTag[];
  cvData: CVData | null;
  isLoading: boolean;
  feedback: { type: 'success' | 'error'; message: string } | null;
  editingPost: AdminPost | null;
  setEditingPost: (post: AdminPost | null) => void;
  loadAllAdminData: () => Promise<void>;
  showNotification: (type: 'success' | 'error', message: string) => void;
  clearNotification: () => void;
  handleCreateNewPost: () => void;
  handleCreatePostWithSchedule: (categoryId?: string, dateStr?: string) => void;
  handleEditPostFromDashboard: (post: AdminPost) => void;
  handleSavePost: (postToSave?: AdminPost) => Promise<void>;
  handleDeletePost: (id: string, slug: string) => Promise<void>;
  handleSaveCategory: (category: AdminCategory) => Promise<void>;
  handleDeleteCategory: (id: string) => Promise<void>;
  handleSaveTag: (tag: AdminTag) => Promise<void>;
  handleDeleteTag: (id: string) => Promise<void>;
  handleSaveCv: (targetLang: string, updatedData: CVData) => Promise<void>;
}

const CmsContext = createContext<CmsContextType | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { currentLang } = useLanguage();

  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const clearNotification = () => setFeedback(null);

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
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Lỗi khi tải dữ liệu CMS');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, [currentLang]);

  // Actions
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
    router.push('/admin/blogs');
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
    router.push('/admin/blogs');
  };

  const handleEditPostFromDashboard = (post: AdminPost) => {
    setEditingPost(post);
    router.push('/admin/blogs');
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

  const handleSaveCv = async (targetLang: string, updatedData: CVData) => {
    try {
      await saveCvData(targetLang, updatedData);
      if (targetLang === currentLang) {
        setCvData(updatedData);
      }
      showNotification('success', `Đã cập nhật hồ sơ CV (${targetLang.toUpperCase()}) thành công lên Supabase!`);
    } catch (err: any) {
      showNotification('error', `Lỗi khi lưu hồ sơ CV: ${err.message}`);
      throw err;
    }
  };

  return (
    <CmsContext.Provider
      value={{
        posts,
        categories,
        tags,
        cvData,
        isLoading,
        feedback,
        editingPost,
        setEditingPost,
        loadAllAdminData,
        showNotification,
        clearNotification,
        handleCreateNewPost,
        handleCreatePostWithSchedule,
        handleEditPostFromDashboard,
        handleSavePost,
        handleDeletePost,
        handleSaveCategory,
        handleDeleteCategory,
        handleSaveTag,
        handleDeleteTag,
        handleSaveCv,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms(): CmsContextType | null {
  return useContext(CmsContext);
}
