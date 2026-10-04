import type { Metadata } from 'next';
import { getActiveLanguages } from '@/services/languageService';

export interface DynamicSeoOptions {
  locale: string;
  path?: string; // e.g. "" for home, "blog" for blog
  alternatePaths?: Record<string, string>; // e.g. { vi: 'blog/slug-vi', en: 'blog/slug-en' }
  title: string;
  description: string;
  siteName?: string;
  imageUrl?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
}

const BASE_URL = 'https://ga2631.github.io';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * Builds fully dynamic SEO metadata, canonical URLs, and language alternates based on database languages.
 */
export async function buildDynamicMetadata(options: DynamicSeoOptions): Promise<Metadata> {
  const {
    locale,
    path = '',
    alternatePaths,
    title,
    description,
    siteName = 'Portfolio & Blog',
    imageUrl = DEFAULT_IMAGE,
    type = 'website',
  } = options;

  const cleanPath = path ? `${path.replace(/^\/+|\/+$/g, '')}/` : '';
  const canonicalUrl = `${BASE_URL}/${locale}/${cleanPath}`;

  // Dynamically query all active languages from Supabase
  const activeLanguages = await getActiveLanguages();
  const defaultPath = alternatePaths?.vi
    ? `${alternatePaths.vi.replace(/^\/+|\/+$/g, '')}/`
    : cleanPath;

  const languagesMap: Record<string, string> = {
    'x-default': `${BASE_URL}/vi/${defaultPath}`,
  };

  for (const lang of activeLanguages) {
    const langPath = alternatePaths?.[lang.code]
      ? `${alternatePaths[lang.code].replace(/^\/+|\/+$/g, '')}/`
      : cleanPath;
    languagesMap[lang.code] = `${BASE_URL}/${lang.code}/${langPath}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: languagesMap,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      locale: `${locale}_${locale.toUpperCase()}`,
      type,
      images: [
        {
          url: imageUrl,
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
      images: [imageUrl],
    },
  };
}
