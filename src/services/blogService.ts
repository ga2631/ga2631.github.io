import { BlogPost } from '../types/index';
import { markdownToHtml } from '../utils/markdownParser';
import { getSupabaseClient, isSupabaseConfigured } from '@/utils/supabase/client';
import { requestClient } from './requestClient';

export interface BlogCategoryDef {
  id: string;
  dayCode: 'ALL' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | string;
  scheduleDay: {
    vi: string;
    en: string;
  };
  scheduleFull: {
    vi: string;
    en: string;
  };
  title: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  iconName: string;
  color?: string;
}

export interface MonthArchiveInfo {
  key: string; // e.g. "2026-09"
  year: number;
  month: number;
  path: string;
}

export interface BlogStatistics {
  totalCount: number;
  categoryCounts: Record<string, number>;
  tagCounts: Record<string, number>;
  allTags: string[];
}

export interface BlogLoadResult {
  posts: BlogPost[];
  loadedMonthKeys: string[];
  hasMore: boolean;
  totalArchivesCount: number;
}

export interface TagWithTranslation {
  id: string;
  slug: string;
  name: string;
}

const htmlCache = new Map<string, string>();

/**
 * Returns rendered HTML of a blog post, parsing Markdown and caching on demand.
 */
export function getPostContentHtml(post: BlogPost): string {
  if (post.contentHtml && post.contentHtml.length > 0) {
    return post.contentHtml;
  }
  const cacheKey = `${post.slug || post.id || ''}_${post.title || ''}_${post.content?.length || 0}`;
  if (htmlCache.has(cacheKey)) {
    return htmlCache.get(cacheKey)!;
  }
  const html = markdownToHtml(post.content || '');
  htmlCache.set(cacheKey, html);
  return html;
}

/**
 * Maps a raw Supabase Post row with joins into the standard BlogPost interface.
 */
function mapDbPostToBlogPost(row: any, lang: 'vi' | 'en'): BlogPost {
  const translations = Array.isArray(row.post_translations) ? row.post_translations : [];
  const translation =
    translations.find((t: any) => t.lang_code === lang) ||
    translations.find((t: any) => t.lang_code === 'vi') ||
    translations[0] ||
    {};

  const categories = row.categories || {};
  const categorySlug = categories.slug || 'tech-radar-career-insights';

  const postTags = Array.isArray(row.post_tags) ? row.post_tags : [];
  const tags: string[] = postTags
    .map((pt: any) => {
      const tagObj = pt.tags;
      if (!tagObj) return null;
      const tagTranslations = Array.isArray(tagObj.tag_translations) ? tagObj.tag_translations : [];
      const tagTrans =
        tagTranslations.find((tt: any) => tt.lang_code === lang) ||
        tagTranslations[0];
      return tagTrans?.name || tagObj.slug;
    })
    .filter((t: any): t is string => Boolean(t));

  const publishedAt = row.published_at || row.created_at || new Date().toISOString();
  const dateStr = publishedAt ? publishedAt.substring(0, 10) : '';
  const readTimeStr = `${row.read_time || 5} ${lang === 'vi' ? 'phút đọc' : 'min read'}`;

  return {
    id: row.id || row.slug,
    slug: row.slug,
    title: translation.title || 'Untitled',
    summary: translation.summary || '',
    category: categorySlug,
    publishedAt,
    date: dateStr,
    readTime: readTimeStr,
    tags,
    author: 'Huỳnh Nhật Tân',
    contentHtml: translation.content_html || '',
    content: translation.content_md || '',
  };
}

const SCHEDULE_DAY_MAP: Record<number, { dayCode: string; viDay: string; enDay: string; viFull: string; enFull: string }> = {
  1: { dayCode: 'MON', viDay: 'Thứ 2', enDay: 'Mon', viFull: 'Thứ 2 hàng tuần', enFull: 'Every Monday' },
  2: { dayCode: 'TUE', viDay: 'Thứ 3', enDay: 'Tue', viFull: 'Thứ 3 hàng tuần', enFull: 'Every Tuesday' },
  3: { dayCode: 'WED', viDay: 'Thứ 4', enDay: 'Wed', viFull: 'Thứ 4 hàng tuần', enFull: 'Every Wednesday' },
  4: { dayCode: 'THU', viDay: 'Thứ 5', enDay: 'Thu', viFull: 'Thứ 5 hàng tuần', enFull: 'Every Thursday' },
  5: { dayCode: 'FRI', viDay: 'Thứ 6', enDay: 'Fri', viFull: 'Thứ 6 hàng tuần', enFull: 'Every Friday' },
};

/**
 * Fetches all blog categories with multi-language translations from Supabase.
 * Retries up to 3 times (GET).
 */
export async function getBlogCategories(): Promise<BlogCategoryDef[]> {
  return requestClient.executeWithRetry<BlogCategoryDef[]>(
    'getBlogCategories',
    async () => {
      if (!isSupabaseConfigured()) {
        throw new Error('[blogService] Supabase is not configured.');
      }
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('[blogService] Supabase client unavailable.');

      console.log(`\x1b[34m[Supabase 🗂️ Categories]\x1b[0m Querying table "categories" JOIN "category_translations"`);
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          slug,
          post_schedule,
          icon,
          color,
          category_translations (
            lang_code,
            name,
            description
          )
        `)
        .order('post_schedule', { ascending: true });

      if (error) throw new Error(error.message);
      if (!data) return [];

      const allCategory: BlogCategoryDef = {
        id: 'all',
        dayCode: 'ALL',
        scheduleDay: {
          vi: 'T2 - T6',
          en: 'Mon - Fri',
        },
        scheduleFull: {
          vi: 'Thứ 2 – Thứ 6 hàng tuần',
          en: 'Every weekday (Mon - Fri)',
        },
        title: {
          vi: 'Tất cả chuyên đề',
          en: 'All Topics',
        },
        description: {
          vi: 'Tổng hợp toàn bộ các bài viết ghi chép kiến trúc, kỹ thuật và bài học kinh nghiệm.',
          en: 'Complete collection of system architecture notes, engineering insights, and technical articles.',
        },
        iconName: 'BookOpenIcon',
        color: '#6366F1',
      };

      const mappedCategories: BlogCategoryDef[] = data.map((cat: any) => {
        const transList = Array.isArray(cat.category_translations) ? cat.category_translations : [];
        const viTrans = transList.find((t: any) => t.lang_code === 'vi') || {};
        const enTrans = transList.find((t: any) => t.lang_code === 'en') || {};

        const scheduleInfo = SCHEDULE_DAY_MAP[cat.post_schedule || 1] || {
          dayCode: 'ALL',
          viDay: 'Hàng tuần',
          enDay: 'Weekly',
          viFull: 'Hàng tuần',
          enFull: 'Weekly',
        };

        return {
          id: cat.slug,
          dayCode: scheduleInfo.dayCode,
          scheduleDay: {
            vi: scheduleInfo.viDay,
            en: scheduleInfo.enDay,
          },
          scheduleFull: {
            vi: scheduleInfo.viFull,
            en: scheduleInfo.enFull,
          },
          title: {
            vi: viTrans.name || cat.slug,
            en: enTrans.name || cat.slug,
          },
          description: {
            vi: viTrans.description || '',
            en: enTrans.description || '',
          },
          iconName: cat.icon || 'LayersIcon',
          color: cat.color || '#3B82F6',
        };
      });

      return [allCategory, ...mappedCategories];
    },
    'GET'
  );
}

/**
 * Fetches all blog tags with translations from Supabase.
 * Retries up to 3 times (GET).
 */
export async function getBlogTags(lang: 'vi' | 'en'): Promise<TagWithTranslation[]> {
  return requestClient.executeWithRetry<TagWithTranslation[]>(
    `getBlogTags[${lang.toUpperCase()}]`,
    async () => {
      if (!isSupabaseConfigured()) {
        throw new Error('[blogService] Supabase is not configured.');
      }
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('[blogService] Supabase client unavailable.');

      console.log(`\x1b[36m[Supabase 🏷️ Tags]\x1b[0m Querying table "tags" JOIN "tag_translations" (lang: ${lang})`);
      const { data, error } = await supabase
        .from('tags')
        .select(`
          id,
          slug,
          tag_translations (
            lang_code,
            name
          )
        `)
        .order('slug', { ascending: true });

      if (error) throw new Error(error.message);
      if (!data) return [];

      return data.map((tag: any) => {
        const transList = Array.isArray(tag.tag_translations) ? tag.tag_translations : [];
        const trans = transList.find((t: any) => t.lang_code === lang) || transList[0] || {};
        return {
          id: tag.id,
          slug: tag.slug,
          name: trans.name || tag.slug,
        };
      });
    },
    'GET'
  );
}

/**
 * Fetches published blog posts dynamically from Supabase.
 * Retries up to 3 times (GET).
 */
export async function getBlogPosts(
  lang: 'vi' | 'en',
  options: {
    limit?: number;
    offset?: number;
    categorySlug?: string;
    tagSlug?: string;
  } = {}
): Promise<BlogPost[]> {
  return requestClient.executeWithRetry<BlogPost[]>(
    `getBlogPosts[${lang.toUpperCase()}]`,
    async () => {
      if (!isSupabaseConfigured()) {
        throw new Error(
          '[blogService] Supabase is not configured. Please supply NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.'
        );
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('[blogService] Failed to initialize Supabase client.');
      }

      console.log(`\x1b[32m[Supabase 📰 Posts]\x1b[0m Querying table "posts" with relations (lang: ${lang}, limit: ${options.limit || 'all'})`);
      let query = supabase
        .from('posts')
        .select(`
          id,
          slug,
          read_time,
          published_at,
          created_at,
          updated_at,
          categories (
            id,
            slug,
            post_schedule,
            icon,
            color,
            category_translations (
              lang_code,
              name,
              description
            )
          ),
          post_translations (
            lang_code,
            title,
            summary,
            content_md,
            content_html
          ),
          post_tags (
            tags (
              id,
              slug,
              tag_translations (
                lang_code,
                name
              )
            )
          )
        `)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });

      if (options.limit) {
        const offset = options.offset || 0;
        query = query.range(offset, offset + options.limit - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`[blogService] Supabase query error: ${error.message}`);
      }

      if (!data) return [];

      let posts = data.map((row: any) => mapDbPostToBlogPost(row, lang));

      // Optional category filter
      if (options.categorySlug && options.categorySlug !== 'all') {
        posts = posts.filter((p) => p.category === options.categorySlug);
      }

      // Optional tag filter
      if (options.tagSlug && options.tagSlug !== 'all') {
        posts = posts.filter((p) => p.tags.includes(options.tagSlug!));
      }

      return posts;
    },
    'GET'
  );
}

/**
 * Fetches a single blog post by its slug from Supabase (Post Detail).
 * Retries up to 3 times (GET).
 */
export async function getBlogPostBySlug(slug: string, lang: 'vi' | 'en'): Promise<BlogPost | null> {
  return requestClient.executeWithRetry<BlogPost | null>(
    `getBlogPostBySlug[${slug}:${lang.toUpperCase()}]`,
    async () => {
      if (!isSupabaseConfigured()) {
        throw new Error('[blogService] Supabase is not configured.');
      }

      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('[blogService] Supabase client unavailable.');

      console.log(`\x1b[33m[Supabase 📖 Post Detail]\x1b[0m Querying table "posts" WHERE slug = "${slug}" (lang: ${lang})`);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          slug,
          read_time,
          published_at,
          created_at,
          updated_at,
          categories (
            id,
            slug,
            post_schedule,
            icon,
            color,
            category_translations (
              lang_code,
              name,
              description
            )
          ),
          post_translations (
            lang_code,
            title,
            summary,
            content_md,
            content_html
          ),
          post_tags (
            tags (
              id,
              slug,
              tag_translations (
                lang_code,
                name
              )
            )
          )
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        throw new Error(`[blogService] Supabase query error for post "${slug}": ${error.message}`);
      }

      if (!data) return null;

      return mapDbPostToBlogPost(data, lang);
    },
    'GET'
  );
}

/**
 * Extracts all month archive keys represented in the posts collection.
 */
export function getAvailableMonthArchives(posts: BlogPost[], lang: 'vi' | 'en'): MonthArchiveInfo[] {
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
    path: `/${lang}/blog?month=${key}`,
  }));

  return archives.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}

/**
 * Computes aggregate statistics across all published articles.
 */
export function getBlogStatistics(posts: BlogPost[], categories: BlogCategoryDef[] = []): BlogStatistics {
  const categoryCounts: Record<string, number> = { all: posts.length };

  categories.forEach((cat) => {
    if (cat.id !== 'all') {
      categoryCounts[cat.id] = posts.filter((p) => p.category === cat.id).length;
    }
  });

  const tagCounts: Record<string, number> = {};
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      tagSet.add(tag);
    });
  });

  return {
    totalCount: posts.length,
    categoryCounts,
    tagCounts,
    allTags: Array.from(tagSet),
  };
}

/**
 * Initial load: loads initial batch of posts (e.g. 20) from Supabase.
 */
export async function loadInitialBlogPosts(
  lang: 'vi' | 'en',
  initialBatchCount = 20
): Promise<BlogLoadResult> {
  const allPosts = await getBlogPosts(lang);
  const archives = getAvailableMonthArchives(allPosts, lang);
  const initialPosts = allPosts.slice(0, initialBatchCount);
  const hasMore = allPosts.length > initialBatchCount;

  const loadedMonthKeys = Array.from(
    new Set(
      initialPosts
        .map((p) => {
          const match = p.date?.match(/^(\d{4})-(\d{2})/);
          return match ? `${match[1]}-${match[2]}` : null;
        })
        .filter((k): k is string => k !== null)
    )
  );

  return {
    posts: initialPosts,
    loadedMonthKeys,
    hasMore,
    totalArchivesCount: archives.length,
  };
}

/**
 * Loads next batch of posts for client-side pagination from Supabase.
 */
export async function loadNextMonthBatch(
  lang: 'vi' | 'en',
  currentLoaded: string[] | number,
  targetBatchCount = 20
): Promise<BlogLoadResult> {
  const allPosts = await getBlogPosts(lang);
  const archives = getAvailableMonthArchives(allPosts, lang);

  let offset = 0;
  if (typeof currentLoaded === 'number') {
    offset = currentLoaded;
  } else if (Array.isArray(currentLoaded)) {
    const matchingCount = allPosts.filter((p) => {
      const match = p.date?.match(/^(\d{4})-(\d{2})/);
      const key = match ? `${match[1]}-${match[2]}` : '';
      return currentLoaded.includes(key);
    }).length;
    offset = matchingCount > 0 ? matchingCount : currentLoaded.length * targetBatchCount;
  }

  const nextPosts = allPosts.slice(offset, offset + targetBatchCount);
  const hasMore = offset + targetBatchCount < allPosts.length;

  const nextMonthKeys = Array.from(
    new Set(
      nextPosts
        .map((p) => {
          const match = p.date?.match(/^(\d{4})-(\d{2})/);
          return match ? `${match[1]}-${match[2]}` : null;
        })
        .filter((k): k is string => k !== null)
    )
  );

  return {
    posts: nextPosts,
    loadedMonthKeys: nextMonthKeys,
    hasMore,
    totalArchivesCount: archives.length,
  };
}

/**
 * Loads all archive posts for instant client search and filtering.
 */
export async function loadAllArchivePosts(lang: 'vi' | 'en'): Promise<BlogPost[]> {
  return getBlogPosts(lang);
}
