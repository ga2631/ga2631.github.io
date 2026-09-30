import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import { uiTranslations } from '@/i18n';
import { getCvData } from '@/services/cvService';
import { Home } from '@/views/Home';
import { AppShell } from '@/components/layout/AppShell';
import { hasLocale, locales, Locale } from './dictionaries';

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
  const cvData = await getCvData(lang as Locale);
  const info = cvData.personalInfo;

  const title = isVi
    ? `${info.fullName} | ${info.jobTitle} - Portfolio & CV`
    : `${info.fullName} | ${info.jobTitle} - Portfolio & CV`;
  const description = info.bio || (isVi
    ? 'Hồ sơ năng lực và CV của Huỳnh Nhật Tân (ga2631) - Kỹ sư phần mềm chuyên về Full-stack web applications, distributed systems, React, Next.js, TypeScript, Rust, Docker và Cloud DevOps.'
    : 'Professional portfolio and CV of Tan Huynh Nhat (ga2631) - Software Engineer specializing in scalable full-stack web applications, distributed systems, modern React, Next.js, TypeScript, Rust, and Cloud DevOps.');

  return {
    title,
    description,
    alternates: {
      canonical: `https://ga2631.github.io/${lang}/`,
      languages: {
        vi: 'https://ga2631.github.io/vi/',
        en: 'https://ga2631.github.io/en/',
        'x-default': 'https://ga2631.github.io/vi/',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://ga2631.github.io/${lang}/`,
      siteName: isVi ? 'Portfolio Huỳnh Nhật Tân' : 'Tan Huynh Nhat Portfolio',
      locale: isVi ? 'vi_VN' : 'en_US',
      type: 'website',
      images: [
        {
          url: info.avatarUrl || 'https://ga2631.github.io/og-image.png',
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
      images: [info.avatarUrl || 'https://ga2631.github.io/og-image.png'],
    },
  };
}

export default async function LocalizedHomePage({ params }: PageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const currentCvData = await getCvData(locale);
  const t = uiTranslations[locale];

  return (
    <AppShell lang={locale} currentRoute="home" personalInfo={currentCvData.personalInfo}>
      <Home data={currentCvData} t={t} />
    </AppShell>
  );
}
