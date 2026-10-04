'use client';

import React, { useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCms } from '@/views/Cms';
import { CmsPostEditor } from '@/views/Cms/components/CmsPostEditor';
import { AdminPost } from '@/services/blogAdminService';
import { useLanguage } from '@/i18n/LanguageContext';

function AdminNewBlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLang } = useLanguage();
  const cms = useCms();

  const targetCategory = searchParams?.get('category');
  const targetDate = searchParams?.get('date');
  const targetLang = (searchParams?.get('lang') as 'vi' | 'en') || 'vi';

  const categories = cms?.categories || [];
  const tags = cms?.tags || [];
  const isLoading = cms?.isLoading ?? false;

  const initialCategory = useMemo(() => {
    if (!targetCategory) return categories[0]?.id || null;
    const found = categories.find((c) => c.id === targetCategory || c.slug === targetCategory);
    return found?.id || categories[0]?.id || null;
  }, [categories, targetCategory]);

  const newPostTemplate = useMemo<AdminPost>(() => {
    const slugSuffix = targetDate ? targetDate.replace(/-/g, '') : Date.now();
    return {
      slug: `post-${slugSuffix}`,
      read_time: 5,
      category_id: initialCategory,
      tag_ids: [],
      tags: [],
      published_at: targetDate || new Date().toISOString().substring(0, 10),
      translations: {
        vi: { lang_code: 'vi', title: '', summary: '', content_md: '' },
        en: { lang_code: 'en', title: '', summary: '', content_md: '' },
      },
    };
  }, [initialCategory, targetDate]);

  const handleSave = async (postToSave: AdminPost) => {
    if (cms?.handleSavePost) {
      await cms.handleSavePost(postToSave);
    }
    router.push('/admin/blogs');
  };

  const handleCancel = () => {
    router.push('/admin/blogs');
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3" role="status">
        <i className="fa-solid fa-circle-notch fa-spin text-2xl text-red-600"></i>
        <p className="text-xs text-gray-500 font-medium">Đang chuẩn bị trình biên soạn bài viết...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-200">
      <CmsPostEditor
        post={newPostTemplate}
        categories={categories}
        tags={tags}
        initialLang={targetLang}
        onSave={handleSave}
        onCancel={handleCancel}
        currentLang={currentLang}
      />
    </div>
  );
}

export default function AdminNewBlogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3" role="status">
          <i className="fa-solid fa-circle-notch fa-spin text-2xl text-red-600"></i>
          <p className="text-xs text-gray-500 font-medium">Đang chuẩn bị trình biên soạn bài viết...</p>
        </div>
      }
    >
      <AdminNewBlogPageContent />
    </Suspense>
  );
}
