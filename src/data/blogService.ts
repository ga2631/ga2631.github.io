import { BlogPost } from '../types/index.ts';
import { CATEGORY_STRUCTURE_DEFINITIONS } from './blogTemplates.ts';

// Dynamic loaders for all blog month JSON chunks
const viMonthModules = import.meta.glob<{ default: any[] }>('/src/data/blog/vi/*/*.json');
const enMonthModules = import.meta.glob<{ default: any[] }>('/src/data/blog/en/*/*.json');

// Eager modules for fast synchronous initial access
const viMonthEager = import.meta.glob<{ default: any[] }>('/src/data/blog/vi/*/*.json', { eager: true });
const enMonthEager = import.meta.glob<{ default: any[] }>('/src/data/blog/en/*/*.json', { eager: true });

export interface MonthArchiveInfo {
  key: string; // e.g. "2026-05"
  year: number;
  month: number;
  path: string;
}

/**
 * Extracts and sorts all month archive paths descending (newest first).
 */
export function getAvailableMonthArchives(lang: 'vi' | 'en'): MonthArchiveInfo[] {
  const modules = lang === 'vi' ? viMonthModules : enMonthModules;
  const paths = Object.keys(modules);

  const archives: MonthArchiveInfo[] = paths.map((path) => {
    // Match /src/data/blog/{lang}/{YYYY}/{MM}.json
    const match = path.match(/(\d{4})\/(\d{2})\.json$/);
    if (!match) {
      return { key: path, year: 0, month: 0, path };
    }
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const key = `${year}-${String(month).padStart(2, '0')}`;
    return { key, year, month, path };
  });

  return archives.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}

/**
 * Assembles HTML from structured sections dictionary according to standard category layout.
 */
export function assembleArticleHtml(
  category?: string,
  sections?: Record<string, string>,
  lang: 'vi' | 'en' = 'vi'
): string {
  if (!sections || typeof sections !== 'object') return '';
  const structure = category ? CATEGORY_STRUCTURE_DEFINITIONS[category] : undefined;
  if (!structure) {
    return Object.entries(sections)
      .map(([key, content]) => `<h3>${key}</h3>${content}`)
      .join('');
  }

  return structure.sections
    .map((sec) => {
      const content = sections[sec.id] || '';
      return `<h3>${sec.order}. ${sec.title[lang]}</h3>${content}`;
    })
    .join('');
}

/**
 * Hydrates a raw blog post JSON object into a fully populated BlogPost instance.
 */
export function hydrateBlogPost(raw: any, lang: 'vi' | 'en'): BlogPost {
  const contentHtml = raw.contentHtml || assembleArticleHtml(raw.category, raw.sections, lang);
  return {
    ...raw,
    contentHtml,
  };
}

/**
 * Loads a single month JSON archive by path.
 */
export async function loadMonthPosts(path: string, lang: 'vi' | 'en'): Promise<BlogPost[]> {
  const modules = lang === 'vi' ? viMonthModules : enMonthModules;
  const loader = modules[path];
  if (!loader) {
    // Check eager fallback
    const eagerMap = lang === 'vi' ? viMonthEager : enMonthEager;
    const eagerData = eagerMap[path];
    if (eagerData && eagerData.default) {
      return (eagerData.default as any[]).map((p) => hydrateBlogPost(p, lang));
    }
    return [];
  }

  const mod = await loader();
  const rawList = (mod.default || mod) as any[];
  return rawList.map((p) => hydrateBlogPost(p, lang));
}

/**
 * Synchronously retrieves raw posts from eager modules (for initial state or unit tests).
 */
export function getEagerPosts(lang: 'vi' | 'en'): BlogPost[] {
  const eagerMap = lang === 'vi' ? viMonthEager : enMonthEager;
  const archives = getAvailableMonthArchives(lang);
  const posts: BlogPost[] = [];

  archives.forEach((archive) => {
    const data = eagerMap[archive.path];
    if (data && data.default) {
      const list = (data.default as any[]).map((p) => hydrateBlogPost(p, lang));
      posts.push(...list);
    }
  });

  return sortPostsByDateDesc(posts);
}

/**
 * Sorts articles descending by date or publishedAt.
 */
export function sortPostsByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
}

export interface BlogLoadResult {
  posts: BlogPost[];
  loadedMonthKeys: string[];
  hasMore: boolean;
  totalArchivesCount: number;
}

/**
 * Initial load:
 * Loads the most recent months until targetMinPosts (default 20) is reached or all archives are exhausted.
 */
export async function loadInitialBlogPosts(
  lang: 'vi' | 'en',
  targetMinPosts = 20
): Promise<BlogLoadResult> {
  const archives = getAvailableMonthArchives(lang);
  const posts: BlogPost[] = [];
  const loadedMonthKeys: string[] = [];

  for (let i = 0; i < archives.length; i++) {
    const archive = archives[i];
    const monthPosts = await loadMonthPosts(archive.path, lang);
    posts.push(...monthPosts);
    loadedMonthKeys.push(archive.key);

    if (posts.length >= targetMinPosts) {
      break;
    }
  }

  const sorted = sortPostsByDateDesc(posts);
  return {
    posts: sorted,
    loadedMonthKeys,
    hasMore: loadedMonthKeys.length < archives.length,
    totalArchivesCount: archives.length,
  };
}

/**
 * Loads the next batch of month archives (e.g. next 20 articles or remaining months).
 */
export async function loadNextMonthBatch(
  lang: 'vi' | 'en',
  currentLoadedMonthKeys: string[],
  targetBatchCount = 20
): Promise<BlogLoadResult> {
  const archives = getAvailableMonthArchives(lang);
  const remainingArchives = archives.filter((a) => !currentLoadedMonthKeys.includes(a.key));

  const newPosts: BlogPost[] = [];
  const newLoadedKeys = [...currentLoadedMonthKeys];

  for (const archive of remainingArchives) {
    const monthPosts = await loadMonthPosts(archive.path, lang);
    newPosts.push(...monthPosts);
    newLoadedKeys.push(archive.key);

    if (newPosts.length >= targetBatchCount) {
      break;
    }
  }

  return {
    posts: sortPostsByDateDesc(newPosts),
    loadedMonthKeys: newLoadedKeys,
    hasMore: newLoadedKeys.length < archives.length,
    totalArchivesCount: archives.length,
  };
}

/**
 * Loads all month archives on-demand (used when applying filters or searching whole history).
 */
export async function loadAllArchivePosts(lang: 'vi' | 'en'): Promise<BlogPost[]> {
  const archives = getAvailableMonthArchives(lang);
  const posts: BlogPost[] = [];

  for (const archive of archives) {
    const monthPosts = await loadMonthPosts(archive.path, lang);
    posts.push(...monthPosts);
  }

  return sortPostsByDateDesc(posts);
}
