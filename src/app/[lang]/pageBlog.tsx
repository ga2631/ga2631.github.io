import type { Metadata } from 'next';
import React from 'react';
import { uiTranslations } from '@/i18n';
import { getCvData } from '@/services/cvService';
import { getBlogPosts, getBlogCategories } from '@/services/blogService';
import { Blog } from '@/views/Blog';
import { AppShell } from '@/components/layout/AppShell';
import { Locale } from './dictionaries';
import { buildDynamicMetadata } from '@/utils/seo';

export async function generateBlogMetadata(locale: Locale): Promise<Metadata> {
  const cvData = await getCvData(locale);
  const info = cvData.personalInfo;
  const t = uiTranslations[locale] || uiTranslations.vi;

  const fullName = info.fullName || 'Huỳnh Nhật Tân';
  const title = `${t.blog?.title || 'Technical Blog & System Architecture'} | ${fullName}`;
  const description =
    t.blog?.subtitle ||
    `Technical writings on distributed systems, databases, and software engineering by ${fullName}.`;

  return buildDynamicMetadata({
    locale,
    path: 'blog',
    title,
    description,
    siteName: `${fullName} - Blog`,
    imageUrl: info.avatarUrl || 'https://ga2631.github.io/og-image.png',
    type: 'website',
  });
}

export async function PageBlog({ lang }: { lang: Locale }) {
  const [currentCvData, currentBlogPosts, categories] = await Promise.all([
    getCvData(lang),
    getBlogPosts(lang),
    getBlogCategories(),
  ]);
  const t = uiTranslations[lang] || uiTranslations.vi;

  return (
    <AppShell lang={lang} currentRoute="blog" personalInfo={currentCvData.personalInfo}>
      <Blog posts={currentBlogPosts} categories={categories} t={t.blog} tCommon={t.common} />
    </AppShell>
  );
}

export default PageBlog;
