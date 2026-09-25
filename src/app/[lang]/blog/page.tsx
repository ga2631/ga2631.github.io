import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import { uiTranslations } from '@/data/cvData';
import { blogPostsVi, blogPostsEn } from '@/data/blogData';
import { Blog } from '@/views/Blog';
import { AppShell } from '@/components/layout/AppShell';
import { hasLocale, locales, Locale } from '../dictionaries';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const isVi = lang === 'vi';
  const title = isVi
    ? 'Bài viết kỹ thuật & Chia sẻ kinh nghiệm | Huỳnh Nhật Tân'
    : 'Technical Blog & Engineering Insights | Tan Huynh Nhat';
  const description = isVi
    ? 'Tập hợp các bài viết chuyên sâu về Database Design, Chuẩn hóa CSDL, Data Engineering, Kiến trúc hệ thống, React, Next.js và Software Engineering của Huỳnh Nhật Tân.'
    : 'In-depth engineering articles and technical insights covering Database Normalization, Data Engineering, System Architecture, React, Next.js, and Software Engineering by Tan Huynh Nhat.';

  return {
    title,
    description,
    alternates: {
      canonical: `https://ga2631.github.io/${lang}/blog/`,
      languages: {
        vi: 'https://ga2631.github.io/vi/blog/',
        en: 'https://ga2631.github.io/en/blog/',
        'x-default': 'https://ga2631.github.io/vi/blog/',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://ga2631.github.io/${lang}/blog/`,
      siteName: isVi ? 'Portfolio & Blog Huỳnh Nhật Tân' : 'Tan Huynh Nhat Portfolio & Blog',
      locale: isVi ? 'vi_VN' : 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://ga2631.github.io/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ga2631.github.io/og-image.png'],
    },
  };
}

export default async function LocalizedBlogPage({ params }: PageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const currentBlogPosts = locale === 'vi' ? blogPostsVi : blogPostsEn;
  const t = uiTranslations[locale];

  return (
    <AppShell lang={locale} currentRoute="blog">
      <Blog posts={currentBlogPosts} t={t.blog} tCommon={t.common} />
    </AppShell>
  );
}
