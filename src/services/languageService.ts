import { getSupabaseClient, isSupabaseConfigured } from '@/utils/supabase/client';
import { requestClient } from './requestClient';

export interface Language {
  code: string;
  name: string;
  is_active: boolean;
}

const DEFAULT_LANGUAGES: Language[] = [
  { code: 'vi', name: 'Tiếng Việt', is_active: true },
  { code: 'en', name: 'English', is_active: true },
];

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
    return DEFAULT_LANGUAGES;
  }

  return requestClient.executeWithRetry<Language[]>(
    'getActiveLanguages',
    async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return DEFAULT_LANGUAGES;

      console.log('\x1b[34m[Supabase 🌐 Languages]\x1b[0m Querying active languages from table "languages"');
      const { data, error } = await supabase
        .from('languages')
        .select('code, name, is_active')
        .eq('is_active', true)
        .order('code', { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn(`[languageService] Failed to load languages, using defaults: ${error?.message}`);
        return DEFAULT_LANGUAGES;
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
