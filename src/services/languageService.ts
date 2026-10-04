import { getSupabaseClient, isSupabaseConfigured } from '@/utils/supabase/client';
import { requestClient } from './requestClient';

export interface Language {
  code: string;
  name: string;
  is_active: boolean;
}

let cachedLanguages: Language[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache for SSR

/**
 * Fetches all active languages from Supabase `languages` table.
 * Uses 3-retry GET policy with in-memory caching.
 */
export async function getActiveLanguages(): Promise<Language[]> {
  const now = Date.now();
  if (cachedLanguages && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedLanguages;
  }

  if (!isSupabaseConfigured()) {
    return [];
  }

  return requestClient.executeWithRetry<Language[]>(
    'getActiveLanguages',
    async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return [];

      console.log('[Supabase 🌐 Languages] Querying active languages from table "languages"');
      const { data, error } = await supabase
        .from('languages')
        .select('code, name, is_active')
        .eq('is_active', true)
        .order('code', { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn(`[languageService] Failed to load languages from Supabase: ${error?.message}`);
        return [];
      }

      cachedLanguages = data as Language[];
      cacheTimestamp = Date.now();
      return cachedLanguages;
    },
    'GET'
  );
}

/**
 * Returns string array of active language codes (e.g. ['vi', 'en'])
 */
export async function getActiveLanguageCodes(): Promise<string[]> {
  const languages = await getActiveLanguages();
  return languages.map((lang) => lang.code);
}
