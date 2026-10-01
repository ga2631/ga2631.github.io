import type { Metadata } from 'next';
import React from 'react';
import { uiTranslations } from '@/i18n';
import { getCvData } from '@/services/cvService';
import { Home } from '@/views/Home';
import { AppShell } from '@/components/layout/AppShell';
import { Locale } from './dictionaries';
import { buildDynamicMetadata } from '@/utils/seo';

export async function generateHomeMetadata(locale: Locale): Promise<Metadata> {
  const cvData = await getCvData(locale);
  const info = cvData.personalInfo;

  const fullName = info.fullName || 'Huỳnh Nhật Tân';
  const jobTitle = info.jobTitle || 'Software Engineer';
  const title = `${fullName} | ${jobTitle} - Portfolio & CV`;
  const description =
    info.bio ||
    info.tagline ||
    `${fullName} - ${jobTitle} Portfolio & Engineering CV`;

  return buildDynamicMetadata({
    locale,
    path: '',
    title,
    description,
    siteName: `${fullName} Portfolio`,
    imageUrl: info.avatarUrl || 'https://ga2631.github.io/og-image.png',
    type: 'website',
  });
}

export async function PageHome({ lang }: { lang: Locale }) {
  const currentCvData = await getCvData(lang);
  const t = uiTranslations[lang] || uiTranslations.vi;

  return (
    <AppShell lang={lang} currentRoute="home" personalInfo={currentCvData.personalInfo}>
      <Home data={currentCvData} t={t} />
    </AppShell>
  );
}

export default PageHome;
