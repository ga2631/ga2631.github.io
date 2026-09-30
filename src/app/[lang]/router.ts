import type { Metadata } from 'next';
import React from 'react';
import { Locale, locales } from './dictionaries';
import { PageHome, generateHomeMetadata } from './pageHome';
import { PageBlog, generateBlogMetadata } from './pageBlog';

export type AppRouteKey = 'home' | 'blog';

export interface AppRouteConfig {
  key: AppRouteKey;
  path: string;
  slugs: string[];
  component: (props: { lang: Locale }) => Promise<React.ReactElement>;
  generateMetadata: (lang: Locale) => Promise<Metadata>;
}

export const routeRegistry: Record<AppRouteKey, AppRouteConfig> = {
  home: {
    key: 'home',
    path: '/',
    slugs: [],
    component: PageHome,
    generateMetadata: generateHomeMetadata,
  },
  blog: {
    key: 'blog',
    path: '/blog',
    slugs: ['blog'],
    component: PageBlog,
    generateMetadata: generateBlogMetadata,
  },
};

/**
 * Resolves route configuration by slug array
 */
export function resolveRoute(slugSegments?: string[]): AppRouteConfig | null {
  if (!slugSegments || slugSegments.length === 0) {
    return routeRegistry.home;
  }
  const mainSegment = slugSegments[0];
  if (mainSegment === 'blog' && slugSegments.length === 1) {
    return routeRegistry.blog;
  }
  return null;
}

import { getActiveLanguageCodes } from '@/services/languageService';

/**
 * Generates all static route permutations for static export dynamically from active database languages.
 */
export async function getStaticRouteParams(): Promise<{ lang: string; slug: string[] }[]> {
  const langCodes = await getActiveLanguageCodes();
  const params: { lang: string; slug: string[] }[] = [];
  for (const lang of langCodes) {
    for (const route of Object.values(routeRegistry)) {
      params.push({
        lang,
        slug: route.slugs,
      });
    }
  }
  return params;
}
