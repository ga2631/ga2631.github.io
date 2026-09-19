import { BlogPost } from '../types/index.ts';
import { CATEGORY_STRUCTURE_DEFINITIONS } from '../data/blog/blogTemplates.ts';
import { parseFrontmatter, markdownToHtml } from '../utils/markdownParser.ts';

// Vite glob importers for all markdown articles
const viMarkdownEager = import.meta.glob<string>('/src/data/blog/vi/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const enMarkdownEager = import.meta.glob<string>('/src/data/blog/en/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export interface MonthArchiveInfo {
  key: string; // e.g. "2026-09"
  year: number;
  month: number;
  path: string;
}

/**
 * Converts a raw Markdown file text + path into a hydrated BlogPost object.
 */
export function parseMarkdownToBlogPost(rawMd: string, path: string): BlogPost {
  const { metadata, content } = parseFrontmatter<any>(rawMd);
  const contentHtml = markdownToHtml(content);
  const fallbackSlug = path.replace(/.*\/([^/]+)\.md$/, '$1');

  return {
    id: metadata.id || fallbackSlug,
    slug: metadata.slug || fallbackSlug,
    title: metadata.title || '',
    summary: metadata.summary || '',
    category: metadata.category || '',
    publishedAt: metadata.publishedAt || '',
    date: metadata.date || '',
    readTime: metadata.readTime || '5 phút đọc',
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    author: metadata.author || 'Huỳnh Nhật Tân',
    contentHtml,
    content,
  };
}

/**
 * Retrieves all eager posts for a language sorted newest first.
 */
export function getEagerPosts(lang: 'vi' | 'en'): BlogPost[] {
  const modules = lang === 'vi' ? viMarkdownEager : enMarkdownEager;
  const posts: BlogPost[] = [];

  Object.entries(modules).forEach(([path, rawMd]) => {
    if (typeof rawMd === 'string') {
      posts.push(parseMarkdownToBlogPost(rawMd, path));
    }
  });

  return sortPostsByDateDesc(posts);
}

/**
 * Extracts and sorts all month archives represented in the blog collection.
 */
export function getAvailableMonthArchives(lang: 'vi' | 'en'): MonthArchiveInfo[] {
  const posts = getEagerPosts(lang);
  const monthMap = new Map<string, { year: number; month: number }>();

  posts.forEach((post) => {
    if (post.date) {
      const match = post.date.match(/^(\d{4})-(\d{2})/);
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const key = `${year}-${String(month).padStart(2, '0')}`;
        if (!monthMap.has(key)) {
          monthMap.set(key, { year, month });
        }
      }
    }
  });

  const archives: MonthArchiveInfo[] = Array.from(monthMap.entries()).map(([key, info]) => ({
    key,
    year: info.year,
    month: info.month,
    path: `/src/data/blog/${lang}/${key}`,
  }));

  return archives.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}

/**
 * Backward-compatible helper for legacy structured sections.
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
 * Hydrates any raw blog post object into a fully populated BlogPost instance.
 */
export function hydrateBlogPost(raw: any, lang: 'vi' | 'en' = 'vi'): BlogPost {
  if (raw.contentHtml) {
    return raw as BlogPost;
  }
  const contentHtml = assembleArticleHtml(raw.category, raw.sections, lang);
  return {
    ...raw,
    contentHtml,
  };
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
 * Returns initial batch of posts (or all posts).
 */
export async function loadInitialBlogPosts(
  lang: 'vi' | 'en'
): Promise<BlogLoadResult> {
  const allPosts = getEagerPosts(lang);
  const archives = getAvailableMonthArchives(lang);

  return {
    posts: allPosts,
    loadedMonthKeys: archives.map((a) => a.key),
    hasMore: false,
    totalArchivesCount: archives.length,
  };
}

/**
 * Loads the next batch of posts for pagination / infinite scroll.
 */
export async function loadNextMonthBatch(
  lang: 'vi' | 'en',
  currentLoadedMonthKeys: string[],
  targetBatchCount = 20
): Promise<BlogLoadResult> {
  const allPosts = getEagerPosts(lang);
  const archives = getAvailableMonthArchives(lang);

  return {
    posts: allPosts,
    loadedMonthKeys: archives.map((a) => a.key),
    hasMore: false,
    totalArchivesCount: archives.length,
  };
}

/**
 * Loads all archive posts (used for instant search and keyword filtering).
 */
export async function loadAllArchivePosts(lang: 'vi' | 'en'): Promise<BlogPost[]> {
  return getEagerPosts(lang);
}
