import { getSupabaseClient, isSupabaseConfigured } from '@/utils/supabase/client';
import { requestClient } from './requestClient';
import { FlowbiteCategoryColor, normalizeCategoryColor } from '@/utils/categoryColors';

export interface ScheduleDayOption {
  value: number;
  vi: string;
  en: string;
  viDay: string;
  enDay: string;
  color: FlowbiteCategoryColor;
  categoryNameVi?: string;
  categoryNameEn?: string;
  isAssigned: boolean;
}

export interface CategoryIconOption {
  id: string;
  label: string;
  iconClass: string;
}

export interface WeekdayDetails {
  dayCode: string;
  viDay: string;
  enDay: string;
  viFull: string;
  enFull: string;
  enName: string;
}

/**
 * Resolves standard weekday representation dynamically without static config arrays.
 */
export function getWeekdayDetails(dayNumber: number): WeekdayDetails {
  switch (dayNumber) {
    case 1:
      return { dayCode: 'MON', viDay: 'Thứ 2', enDay: 'Mon', viFull: 'Thứ 2 hàng tuần', enFull: 'Every Monday', enName: 'Monday' };
    case 2:
      return { dayCode: 'TUE', viDay: 'Thứ 3', enDay: 'Tue', viFull: 'Thứ 3 hàng tuần', enFull: 'Every Tuesday', enName: 'Tuesday' };
    case 3:
      return { dayCode: 'WED', viDay: 'Thứ 4', enDay: 'Wed', viFull: 'Thứ 4 hàng tuần', enFull: 'Every Wednesday', enName: 'Wednesday' };
    case 4:
      return { dayCode: 'THU', viDay: 'Thứ 5', enDay: 'Thu', viFull: 'Thứ 5 hàng tuần', enFull: 'Every Thursday', enName: 'Thursday' };
    case 5:
      return { dayCode: 'FRI', viDay: 'Thứ 6', enDay: 'Fri', viFull: 'Thứ 6 hàng tuần', enFull: 'Every Friday', enName: 'Friday' };
    case 6:
      return { dayCode: 'SAT', viDay: 'Thứ 7', enDay: 'Sat', viFull: 'Thứ 7 hàng tuần', enFull: 'Every Saturday', enName: 'Saturday' };
    case 7:
      return { dayCode: 'SUN', viDay: 'Chủ Nhật', enDay: 'Sun', viFull: 'Chủ nhật hàng tuần', enFull: 'Every Sunday', enName: 'Sunday' };
    default:
      return {
        dayCode: 'ALL',
        viDay: `Lịch #${dayNumber}`,
        enDay: `Schedule #${dayNumber}`,
        viFull: 'Hàng tuần',
        enFull: 'Weekly',
        enName: `Schedule #${dayNumber}`,
      };
  }
}

/**
 * Resolves standard weekday label from day sequence number (1=Mon, 2=Tue, etc.)
 */
export function getWeekdayLabel(dayNumber: number): { vi: string; en: string } {
  const details = getWeekdayDetails(dayNumber);
  return { vi: details.viDay, en: details.enName };
}

/**
 * Builds schedule day options dynamically from categories loaded from the Supabase database.
 * No hardcoded schedule const arrays.
 */
export function getScheduleDayOptions(categories: AdminCategory[] = []): ScheduleDayOption[] {
  const categoryScheduleMap = new Map<number, AdminCategory>();
  categories.forEach((cat) => {
    if (cat.post_schedule != null) {
      categoryScheduleMap.set(Number(cat.post_schedule), cat);
    }
  });

  // Base weekdays 1..5 plus any extra category schedules in database
  const slots = new Set<number>([1, 2, 3, 4, 5]);
  categoryScheduleMap.forEach((_, key) => slots.add(key));

  return Array.from(slots)
    .sort((a, b) => a - b)
    .map((slot) => {
      const weekday = getWeekdayLabel(slot);
      const matched = categoryScheduleMap.get(slot);
      if (matched) {
        const nameVi = matched.translations?.vi?.name?.trim() || matched.slug;
        const nameEn = matched.translations?.en?.name?.trim() || matched.slug;
        const normColor = (normalizeCategoryColor(matched.color) || 'blue') as FlowbiteCategoryColor;
        return {
          value: slot,
          vi: `${weekday.vi} (${nameVi})`,
          en: `${weekday.en} (${nameEn})`,
          viDay: weekday.vi,
          enDay: weekday.en,
          color: normColor,
          categoryNameVi: nameVi,
          categoryNameEn: nameEn,
          isAssigned: true,
        };
      }
      return {
        value: slot,
        vi: weekday.vi,
        en: weekday.en,
        viDay: weekday.vi,
        enDay: weekday.en,
        color: 'gray' as FlowbiteCategoryColor,
        isAssigned: false,
      };
    });
}

/**
 * Loads schedule day options directly from Supabase database.
 */
export async function fetchScheduleDayOptionsFromDb(): Promise<ScheduleDayOption[]> {
  const categories = await getAllAdminCategories();
  return getScheduleDayOptions(categories);
}

/**
 * Formats icon name to FontAwesome icon class dynamically without static registry const
 */
export function getCategoryIconClass(iconId?: string): string {
  if (!iconId) return 'fa-solid fa-folder';
  if (iconId.startsWith('fa-')) return iconId;

  const key = iconId.replace(/Icon$/, '').toLowerCase();
  switch (key) {
    case 'layers': return 'fa-solid fa-layer-group';
    case 'cpu': return 'fa-solid fa-microchip';
    case 'database': return 'fa-solid fa-database';
    case 'component': return 'fa-solid fa-cubes';
    case 'compass': return 'fa-solid fa-compass';
    case 'sparkles': return 'fa-solid fa-wand-magic-sparkles';
    case 'radar': return 'fa-solid fa-tower-broadcast';
    case 'bookopen': case 'book': return 'fa-solid fa-book-open';
    case 'terminal': return 'fa-solid fa-terminal';
    case 'code': return 'fa-solid fa-code';
    case 'server': return 'fa-solid fa-server';
    case 'cloud': return 'fa-solid fa-cloud';
    case 'shield': return 'fa-solid fa-shield-halved';
    default: return 'fa-solid fa-folder';
  }
}

/**
 * Builds category icon options dynamically from the icons in the Supabase categories.
 * No static registry const.
 */
export function getCategoryIconOptions(categories: AdminCategory[] = []): CategoryIconOption[] {
  const iconSet = new Set<string>();
  categories.forEach((cat) => {
    if (cat.icon) iconSet.add(cat.icon);
  });

  return Array.from(iconSet).map((iconId) => ({
    id: iconId,
    label: iconId.replace(/Icon$/, ''),
    iconClass: getCategoryIconClass(iconId),
  }));
}

/**
 * Resolves details for a specific icon ID with reliable fallback.
 */
export function getCategoryIconDetails(iconId?: string): { label: string; iconClass: string } {
  return {
    label: iconId ? iconId.replace(/Icon$/, '') : 'Chuyên mục',
    iconClass: getCategoryIconClass(iconId),
  };
}

export interface AdminCategoryTranslation {
  lang_code: string;
  slug?: string;
  name: string;
  description?: string;
}

export interface AdminCategory {
  id?: string;
  slug: string;
  post_schedule: number;
  icon?: string;
  color?: string;
  translations: Record<string, AdminCategoryTranslation>;
}

export interface AdminTagTranslation {
  lang_code: string;
  name: string;
}

export interface AdminTag {
  id?: string;
  slug: string;
  translations: Record<string, AdminTagTranslation>;
}

export interface AdminPostTranslation {
  lang_code: string;
  slug?: string;
  title: string;
  summary?: string;
  content_md: string;
  content_html?: string | null;
}

export interface AdminPost {
  id?: string;
  slug: string;
  category_id?: string | null;
  category_slug?: string;
  read_time: number;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  tag_ids: string[];
  tags: string[];
  translations: Record<string, AdminPostTranslation>;
}

/**
 * ============================================================================
 * CATEGORIES CRUD
 * ============================================================================
 */

export async function getAllAdminCategories(): Promise<AdminCategory[]> {
  return requestClient.executeWithRetry<AdminCategory[]>(
    'getAllAdminCategories',
    async () => {
      if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase unavailable');

      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          post_schedule,
          icon,
          color,
          category_translations (
            lang_code,
            slug,
            name,
            description
          )
        `)
        .order('post_schedule', { ascending: true });

      if (error) throw new Error(error.message);
      if (!data) return [];

      return data.map((cat: any) => {
        const transMap: Record<string, AdminCategoryTranslation> = {};
        const transList = Array.isArray(cat.category_translations) ? cat.category_translations : [];
        let primarySlug = cat.slug || '';
        transList.forEach((t: any) => {
          transMap[t.lang_code] = {
            lang_code: t.lang_code,
            slug: t.slug || '',
            name: t.name,
            description: t.description || '',
          };
          if (!primarySlug && t.slug) {
            primarySlug = t.slug;
          }
        });
        if (!primarySlug && transMap['vi']?.slug) {
          primarySlug = transMap['vi'].slug;
        } else if (!primarySlug && transMap['en']?.slug) {
          primarySlug = transMap['en'].slug;
        }

        return {
          id: cat.id,
          slug: primarySlug,
          post_schedule: cat.post_schedule ?? 1,
          icon: cat.icon || 'LayersIcon',
          color: cat.color || 'blue',
          translations: transMap,
        };
      });
    },
    'GET'
  );
}

export async function saveAdminCategory(category: AdminCategory): Promise<{ success: boolean; id?: string; error?: string }> {
  return requestClient.executeWithRetry(
    `saveCategory[${category.slug}]`,
    async () => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client unavailable');

      // 1. Upsert Category
      const payload: any = {
        post_schedule: Number(category.post_schedule) || 1,
        icon: category.icon || 'LayersIcon',
        color: category.color || 'blue',
      };
      if (category.id) {
        payload.id = category.id;
      }
      if (category.slug) {
        payload.slug = category.slug.trim();
      }

      const upsertConfig = category.id ? { onConflict: 'id' } : (payload.slug ? { onConflict: 'slug' } : undefined);
      let catData: any;
      let catErr: any;

      if (upsertConfig) {
        const res = await supabase
          .from('categories')
          .upsert(payload, upsertConfig)
          .select('id')
          .single();
        catData = res.data;
        catErr = res.error;
      } else {
        const res = await supabase
          .from('categories')
          .insert(payload)
          .select('id')
          .single();
        catData = res.data;
        catErr = res.error;
      }

      // If categories table already migrated and dropped column 'slug', retry without 'slug'
      if (catErr && catErr.message && catErr.message.includes('slug')) {
        delete payload.slug;
        const fallbackConfig = category.id ? { onConflict: 'id' } : undefined;
        const res = fallbackConfig
          ? await supabase.from('categories').upsert(payload, fallbackConfig).select('id').single()
          : await supabase.from('categories').insert(payload).select('id').single();
        catData = res.data;
        catErr = res.error;
      }

      if (catErr || !catData) throw new Error(catErr?.message || 'Failed to save category');
      const categoryId = catData.id;

      // 2. Upsert Translations with localized slug
      for (const [langCode, trans] of Object.entries(category.translations)) {
        if (trans.name) {
          const transSlug = trans.slug?.trim() || category.slug?.trim() || '';
          const { error: transErr } = await supabase
            .from('category_translations')
            .upsert({
              category_id: categoryId,
              lang_code: langCode,
              slug: transSlug,
              name: trans.name,
              description: trans.description || '',
            }, { onConflict: 'category_id,lang_code' });

          if (transErr) throw new Error(transErr.message);
        }
      }

      requestClient.invalidateCache();
      return { success: true, id: categoryId };
    },
    'POST'
  );
}

export async function deleteAdminCategory(id: string): Promise<{ success: boolean; error?: string }> {
  return requestClient.executeWithRetry(
    `deleteCategory[${id}]`,
    async () => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client unavailable');

      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw new Error(error.message);

      requestClient.invalidateCache();
      return { success: true };
    },
    'DELETE'
  );
}

/**
 * ============================================================================
 * TAGS CRUD
 * ============================================================================
 */

export async function getAllAdminTags(): Promise<AdminTag[]> {
  return requestClient.executeWithRetry<AdminTag[]>(
    'getAllAdminTags',
    async () => {
      if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase unavailable');

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
        const transMap: Record<string, AdminTagTranslation> = {};
        const transList = Array.isArray(tag.tag_translations) ? tag.tag_translations : [];
        transList.forEach((t: any) => {
          transMap[t.lang_code] = {
            lang_code: t.lang_code,
            name: t.name,
          };
        });

        return {
          id: tag.id,
          slug: tag.slug,
          translations: transMap,
        };
      });
    },
    'GET'
  );
}

export async function saveAdminTag(tag: AdminTag): Promise<{ success: boolean; id?: string; error?: string }> {
  return requestClient.executeWithRetry(
    `saveTag[${tag.slug}]`,
    async () => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client unavailable');

      const payload: any = { slug: tag.slug.trim() };
      if (tag.id) payload.id = tag.id;

      const { data: tagData, error: tagErr } = await supabase
        .from('tags')
        .upsert(payload, { onConflict: 'slug' })
        .select('id')
        .single();

      if (tagErr) throw new Error(tagErr.message);
      const tagId = tagData.id;

      for (const [langCode, trans] of Object.entries(tag.translations)) {
        if (trans.name) {
          const { error: transErr } = await supabase
            .from('tag_translations')
            .upsert({
              tag_id: tagId,
              lang_code: langCode,
              name: trans.name,
            }, { onConflict: 'tag_id,lang_code' });

          if (transErr) throw new Error(transErr.message);
        }
      }

      requestClient.invalidateCache();
      return { success: true, id: tagId };
    },
    'POST'
  );
}

export async function deleteAdminTag(id: string): Promise<{ success: boolean; error?: string }> {
  return requestClient.executeWithRetry(
    `deleteTag[${id}]`,
    async () => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client unavailable');

      const { error } = await supabase.from('tags').delete().eq('id', id);
      if (error) throw new Error(error.message);

      requestClient.invalidateCache();
      return { success: true };
    },
    'DELETE'
  );
}

/**
 * ============================================================================
 * POSTS CRUD
 * ============================================================================
 */

export async function getAllAdminPosts(): Promise<AdminPost[]> {
  return requestClient.executeWithRetry<AdminPost[]>(
    'getAllAdminPosts',
    async () => {
      if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase unavailable');

      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          read_time,
          published_at,
          created_at,
          updated_at,
          category_id,
          categories (
            id,
            category_translations (
              lang_code,
              slug,
              name
            )
          ),
          post_translations (
            lang_code,
            slug,
            title,
            summary,
            content_md,
            content_html
          ),
          post_tags (
            tag_id,
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
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      if (!data) return [];

      return data.map((row: any) => {
        const transMap: Record<string, AdminPostTranslation> = {};
        const transList = Array.isArray(row.post_translations) ? row.post_translations : [];
        transList.forEach((t: any) => {
          transMap[t.lang_code] = {
            lang_code: t.lang_code,
            slug: t.slug || row.slug || '',
            title: t.title || '',
            summary: t.summary || '',
            content_md: t.content_md || '',
            content_html: t.content_html || null,
          };
        });

        const postTags = Array.isArray(row.post_tags) ? row.post_tags : [];
        const tag_ids = postTags.map((pt: any) => pt.tag_id).filter(Boolean);
        const tags = postTags.map((pt: any) => pt.tags?.slug).filter(Boolean);
        const resolvedSlug = transMap['vi']?.slug || transMap['en']?.slug || row.slug || '';

        const catTrans = Array.isArray(row.categories?.category_translations) ? row.categories.category_translations : [];
        const viCatTrans = catTrans.find((ct: any) => ct.lang_code === 'vi');
        const resolvedCategorySlug = viCatTrans?.slug || catTrans[0]?.slug || row.categories?.slug || '';

        return {
          id: row.id,
          slug: resolvedSlug,
          category_id: row.category_id || row.categories?.id || null,
          category_slug: resolvedCategorySlug,
          read_time: row.read_time ?? 5,
          published_at: row.published_at || null,
          created_at: row.created_at,
          updated_at: row.updated_at,
          tag_ids,
          tags,
          translations: transMap,
        };
      });
    },
    'GET',
    3,
    400,
    { skipCache: true } // Always fresh for admin
  );
}

export async function saveAdminPost(post: AdminPost): Promise<{ success: boolean; id?: string; error?: string }> {
  return requestClient.executeWithRetry(
    `savePost[${post.slug}]`,
    async () => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client unavailable');

      // 1. Upsert Post
      const payload: any = {
        category_id: post.category_id || null,
        read_time: Number(post.read_time) || 5,
        published_at: post.published_at ? new Date(post.published_at).toISOString() : null,
      };
      if (post.id) {
        payload.id = post.id;
      }

      let postData: any;
      let postErr: any;

      if (post.id) {
        const res = await supabase
          .from('posts')
          .upsert(payload, { onConflict: 'id' })
          .select('id')
          .single();
        postData = res.data;
        postErr = res.error;
      } else {
        const res = await supabase
          .from('posts')
          .insert(payload)
          .select('id')
          .single();
        postData = res.data;
        postErr = res.error;
      }

      // If DB is pre-migration and requires posts.slug NOT NULL, retry with post.slug
      if (postErr && postErr.message && postErr.message.includes('slug') && post.slug) {
        payload.slug = post.slug.trim();
        const fallbackConfig = post.id ? { onConflict: 'id' } : { onConflict: 'slug' };
        const res = await supabase.from('posts').upsert(payload, fallbackConfig).select('id').single();
        postData = res.data;
        postErr = res.error;
      }

      if (postErr || !postData) throw new Error(postErr?.message || 'Failed to save post');
      const postId = postData.id;

      // 2. Link Tags (delete existing and re-insert)
      await supabase.from('post_tags').delete().eq('post_id', postId);
      if (post.tag_ids && post.tag_ids.length > 0) {
        const tagRows = post.tag_ids.map((tagId) => ({
          post_id: postId,
          tag_id: tagId,
        }));
        const { error: tagInsertErr } = await supabase.from('post_tags').insert(tagRows);
        if (tagInsertErr) throw new Error(tagInsertErr.message);
      }

      // 3. Upsert Translations with localized slug
      for (const [langCode, trans] of Object.entries(post.translations)) {
        if (trans.title || trans.content_md) {
          const transSlug = trans.slug?.trim() || (langCode === 'vi' ? post.slug.trim() : post.slug.trim());
          const { error: transErr } = await supabase
            .from('post_translations')
            .upsert({
              post_id: postId,
              lang_code: langCode,
              slug: transSlug,
              title: trans.title || 'Untitled',
              summary: trans.summary || '',
              content_md: trans.content_md || '',
              content_html: trans.content_html || null,
            }, { onConflict: 'post_id,lang_code' });

          if (transErr) throw new Error(transErr.message);
        }
      }

      requestClient.invalidateCache();
      return { success: true, id: postId };
    },
    'POST'
  );
}

export async function deleteAdminPost(id: string): Promise<{ success: boolean; error?: string }> {
  return requestClient.executeWithRetry(
    `deletePost[${id}]`,
    async () => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client unavailable');

      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw new Error(error.message);

      requestClient.invalidateCache();
      return { success: true };
    },
    'DELETE'
  );
}
