import { BlogPost } from '../types/index.ts';
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
 * Formats a Date object into a local date string "YYYY-MM-DD".
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks whether a blog post is scheduled/published on or before the given reference date.
 * Future posts (date > referenceDate) return false.
 */
export function isPostPublished(post: BlogPost, referenceDate: Date = new Date()): boolean {
  const todayStr = getLocalDateString(referenceDate);

  if (post.date) {
    const trimmedDate = post.date.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
      return trimmedDate <= todayStr;
    }
    const timestamp = new Date(trimmedDate).getTime();
    if (!isNaN(timestamp)) {
      return timestamp <= referenceDate.getTime();
    }
  }

  if (post.publishedAt) {
    const parts = post.publishedAt.trim().split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      const iso = `${year}-${month}-${day}`;
      return iso <= todayStr;
    }
  }

  return true;
}

/**
 * Retrieves all eager posts for a language sorted newest first,
 * filtering out any articles scheduled for future dates.
 */
export function getEagerPosts(lang: 'vi' | 'en', referenceDate: Date = new Date()): BlogPost[] {
  const modules = lang === 'vi' ? viMarkdownEager : enMarkdownEager;
  const posts: BlogPost[] = [];

  Object.entries(modules).forEach(([path, rawMd]) => {
    if (typeof rawMd === 'string') {
      const post = parseMarkdownToBlogPost(rawMd, path);
      if (isPostPublished(post, referenceDate)) {
        posts.push(post);
      }
    }
  });

  return sortPostsByDateDesc(posts);
}

/**
 * Extracts and sorts all month archives represented in the blog collection.
 */
export function getAvailableMonthArchives(lang: 'vi' | 'en', referenceDate: Date = new Date()): MonthArchiveInfo[] {
  const posts = getEagerPosts(lang, referenceDate);
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
 * Helper to convert date strings (ISO "YYYY-MM-DD" or "DD/MM/YYYY") into numeric timestamp.
 */
function parseDateToTimestamp(dateStr?: string, publishedAtStr?: string): number {
  if (dateStr) {
    const timestamp = new Date(dateStr).getTime();
    if (!isNaN(timestamp)) return timestamp;
  }
  if (publishedAtStr) {
    const parts = publishedAtStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const timestamp = new Date(year, month, day).getTime();
      if (!isNaN(timestamp)) return timestamp;
    }
  }
  return 0;
}

/**
 * Sorts articles descending by date/publishedAt, then numeric ID descending, then slug.
 * Ensures the latest articles always appear first.
 */
export function sortPostsByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    // 1. Primary: Compare timestamp descending (e.g. 2026-09-18 > 2026-09-17)
    const timeA = parseDateToTimestamp(a.date, a.publishedAt);
    const timeB = parseDateToTimestamp(b.date, b.publishedAt);
    if (timeB !== timeA) {
      return timeB - timeA;
    }

    // 2. Secondary: Compare numeric article ID descending (e.g. ID 55 > 25, 54 > 27)
    const numIdA = parseInt(String(a.id), 10);
    const numIdB = parseInt(String(b.id), 10);
    if (!isNaN(numIdA) && !isNaN(numIdB) && numIdB !== numIdA) {
      return numIdB - numIdA;
    }

    // 3. Fallback: Reverse alphabetical by slug / ID
    const keyA = a.slug || String(a.id) || '';
    const keyB = b.slug || String(b.id) || '';
    return keyB.localeCompare(keyA);
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
  lang: 'vi' | 'en',
  _initialBatchCount = 20,
  referenceDate: Date = new Date()
): Promise<BlogLoadResult> {
  const allPosts = getEagerPosts(lang, referenceDate);
  const archives = getAvailableMonthArchives(lang, referenceDate);

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
  _currentLoadedMonthKeys: string[],
  _targetBatchCount = 20,
  referenceDate: Date = new Date()
): Promise<BlogLoadResult> {
  const allPosts = getEagerPosts(lang, referenceDate);
  const archives = getAvailableMonthArchives(lang, referenceDate);

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
export async function loadAllArchivePosts(lang: 'vi' | 'en', referenceDate: Date = new Date()): Promise<BlogPost[]> {
  return getEagerPosts(lang, referenceDate);
}
