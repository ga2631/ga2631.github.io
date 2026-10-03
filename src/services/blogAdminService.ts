import { getSupabaseClient, isSupabaseConfigured } from '@/utils/supabase/client';
import { requestClient } from './requestClient';

export interface AdminCategoryTranslation {
  lang_code: string;
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

      return data.map((cat: any) => {
        const transMap: Record<string, AdminCategoryTranslation> = {};
        const transList = Array.isArray(cat.category_translations) ? cat.category_translations : [];
        transList.forEach((t: any) => {
          transMap[t.lang_code] = {
            lang_code: t.lang_code,
            name: t.name,
            description: t.description || '',
          };
        });

        return {
          id: cat.id,
          slug: cat.slug,
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
        slug: category.slug.trim(),
        post_schedule: Number(category.post_schedule) || 1,
        icon: category.icon || 'LayersIcon',
        color: category.color || 'blue',
      };
      if (category.id) {
        payload.id = category.id;
      }

      const { data: catData, error: catErr } = await supabase
        .from('categories')
        .upsert(payload, { onConflict: 'slug' })
        .select('id')
        .single();

      if (catErr) throw new Error(catErr.message);
      const categoryId = catData.id;

      // 2. Upsert Translations
      for (const [langCode, trans] of Object.entries(category.translations)) {
        if (trans.name) {
          const { error: transErr } = await supabase
            .from('category_translations')
            .upsert({
              category_id: categoryId,
              lang_code: langCode,
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
          slug,
          read_time,
          published_at,
          created_at,
          updated_at,
          category_id,
          categories (
            id,
            slug
          ),
          post_translations (
            lang_code,
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
            title: t.title || '',
            summary: t.summary || '',
            content_md: t.content_md || '',
            content_html: t.content_html || null,
          };
        });

        const postTags = Array.isArray(row.post_tags) ? row.post_tags : [];
        const tag_ids = postTags.map((pt: any) => pt.tag_id).filter(Boolean);
        const tags = postTags.map((pt: any) => pt.tags?.slug).filter(Boolean);

        return {
          id: row.id,
          slug: row.slug,
          category_id: row.category_id || row.categories?.id || null,
          category_slug: row.categories?.slug || '',
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
        slug: post.slug.trim(),
        category_id: post.category_id || null,
        read_time: Number(post.read_time) || 5,
        published_at: post.published_at ? new Date(post.published_at).toISOString() : null,
      };
      if (post.id) {
        payload.id = post.id;
      }

      const { data: postData, error: postErr } = await supabase
        .from('posts')
        .upsert(payload, { onConflict: 'slug' })
        .select('id')
        .single();

      if (postErr) throw new Error(postErr.message);
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

      // 3. Upsert Translations
      for (const [langCode, trans] of Object.entries(post.translations)) {
        if (trans.title || trans.content_md) {
          const { error: transErr } = await supabase
            .from('post_translations')
            .upsert({
              post_id: postId,
              lang_code: langCode,
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
