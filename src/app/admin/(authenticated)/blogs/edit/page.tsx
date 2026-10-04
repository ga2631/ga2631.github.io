'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCms } from '@/views/Cms';
import { CmsPostEditor } from '@/views/Cms/components/CmsPostEditor';
import { AdminPost, getAllAdminPosts } from '@/services/blogAdminService';
import { useLanguage } from '@/i18n/LanguageContext';

export default function AdminEditBlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLang } = useLanguage();
  const cms = useCms();

  const slugParam = searchParams?.get('slug') || searchParams?.get('id') || '';
  const initialLang = (searchParams?.get('lang') as 'vi' | 'en') || 'vi';

  const [directFetchedPost, setDirectFetchedPost] = useState<AdminPost | null>(null);
  const [isDirectFetching, setIsDirectFetching] = useState<boolean>(false);

  const categories = cms?.categories || [];
  const tags = cms?.tags || [];
  const isLoading = cms?.isLoading ?? false;

  // 1. Attempt to find post from CmsContext
  const matchedFromContext = useMemo(() => {
    if (!slugParam || !cms?.posts) return null;
    return cms.posts.find((p) => p.slug === slugParam || p.id === slugParam) || null;
  }, [slugParam, cms?.posts]);

  // 2. Direct fetch fallback if page was opened directly and context is empty or still refreshing
  useEffect(() => {
    if (!matchedFromContext && slugParam && !isLoading && (!cms?.posts || cms.posts.length === 0)) {
      let isMounted = true;
      setIsDirectFetching(true);
      getAllAdminPosts()
        .then((allPosts) => {
          if (!isMounted) return;
          const found = allPosts.find((p) => p.slug === slugParam || p.id === slugParam) || null;
          setDirectFetchedPost(found);
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setIsDirectFetching(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [matchedFromContext, slugParam, isLoading, cms?.posts]);

  const activePost = matchedFromContext || directFetchedPost;

  const handleSave = async (postToSave: AdminPost) => {
    if (cms?.handleSavePost) {
      await cms.handleSavePost(postToSave);
    }
    router.push('/admin/blogs');
  };

  const handleCancel = () => {
    router.push('/admin/blogs');
  };

  // If no slug parameter was provided
  if (!slugParam) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl border border-amber-200">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-black text-gray-900">Chưa chọn bài viết</h1>
          <p className="text-xs text-gray-500">
            Vui lòng chọn bài viết từ danh sách để tiến hành chỉnh sửa nội dung.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span>Quay lại danh sách bài viết</span>
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if ((isLoading || isDirectFetching) && !activePost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3" role="status">
        <i className="fa-solid fa-circle-notch fa-spin text-2xl text-red-600"></i>
        <p className="text-xs text-gray-500 font-medium">Đang tải dữ liệu bài viết "{slugParam}"...</p>
      </div>
    );
  }

  // Not found state
  if (!activePost) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl border border-red-200">
          <i className="fa-solid fa-file-circle-xmark"></i>
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-black text-gray-900">Không tìm thấy bài viết</h1>
          <p className="text-xs text-gray-500">
            Hệ thống không tìm thấy bài viết nào có slug hoặc ID là <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800">{slugParam}</code>.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span>Quay lại danh sách bài viết</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-200">
      <CmsPostEditor
        post={activePost}
        categories={categories}
        tags={tags}
        initialLang={initialLang}
        onSave={handleSave}
        onCancel={handleCancel}
        currentLang={currentLang}
      />
    </div>
  );
}
