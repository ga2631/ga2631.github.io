import { CVData, PersonalInfo } from '@/types';
import { getSupabaseClient, isSupabaseConfigured } from '@/utils/supabase/client';
import { DbCvDocument } from '@/utils/supabase/types';
import { decodeBase64Safe, getSecureEmail, getSecurePhone, getSecureZaloUrl } from '@/utils/obfuscation';
import { requestClient } from './requestClient';

/**
 * Sanitizes sensitive contact fields (email, phone, zalo) without static source fallback
 */
function sanitizePersonalInfo(raw: PersonalInfo): PersonalInfo {
  return {
    ...raw,
    fullName: raw.fullName || '',
    jobTitle: raw.jobTitle || '',
    tagline: raw.tagline || '',
    bio: raw.bio || '',
    email: raw.email ? decodeBase64Safe(raw.email) : getSecureEmail(),
    phone: raw.phone ? decodeBase64Safe(raw.phone) : getSecurePhone(),
    location: raw.location || '',
    availability: raw.availability || 'Available',
    githubUrl: raw.githubUrl || 'https://github.com/ga2631',
    linkedinUrl: raw.linkedinUrl || '',
    zaloUrl: raw.zaloUrl ? decodeBase64Safe(raw.zaloUrl) : getSecureZaloUrl(),
    avatarUrl: raw.avatarUrl || '',
    resumePdfUrl: raw.resumePdfUrl || '',
    stats: Array.isArray(raw.stats) ? raw.stats : [],
  };
}

/**
 * Fetches CV data exclusively from Supabase `cv_documents` table using RequestClient.
 * Applies automatic 3-retry policy for GET operations.
 * Throws error if Supabase is unconfigured or data is not found.
 */
export async function getCvData(lang: string): Promise<CVData> {
  return requestClient.executeWithRetry<CVData>(
    `getCvData[${lang.toUpperCase()}]`,
    async () => {
      if (!isSupabaseConfigured()) {
        throw new Error(
          `[cvService] Supabase is not configured. Please provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.`
        );
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('[cvService] Failed to initialize Supabase client.');
      }

      console.log(`\x1b[35m[Supabase 📄 CV]\x1b[0m Querying table "cv_documents" WHERE lang_code = "${lang}"`);
      const { data, error } = await supabase
        .from('cv_documents')
        .select('*')
        .eq('lang_code', lang)
        .maybeSingle<DbCvDocument>();

      if (error) {
        throw new Error(`[cvService] Supabase error fetching CV (${lang}): ${error.message}`);
      }

      if (!data) {
        throw new Error(`[cvService] CV document not found in Supabase for language: "${lang}".`);
      }

      const cvData: CVData = {
        personalInfo: sanitizePersonalInfo(data.personal_info),
        principles: Array.isArray(data.principles) ? data.principles : [],
        experiences: Array.isArray(data.experiences) ? data.experiences : [],
        projects: Array.isArray(data.projects) ? data.projects : [],
        skillCategories: Array.isArray(data.skill_categories) ? data.skill_categories : [],
        educations: Array.isArray(data.educations) ? data.educations : [],
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
      };

      return cvData;
    },
    'GET' // Triggers up to 3 retries on failure
  );
}

/**
 * Saves/Updates CV data on Supabase using RequestClient.
 * Applies 1-retry policy for write (POST) operations.
 */
export async function saveCvData(lang: string, cvData: CVData): Promise<{ success: boolean; error?: string }> {
  return requestClient.executeWithRetry<{ success: boolean; error?: string }>(
    `saveCvData[${lang.toUpperCase()}]`,
    async () => {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured.');
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('Supabase client unavailable.');
      }

      const payload: DbCvDocument = {
        lang_code: lang,
        personal_info: cvData.personalInfo,
        principles: cvData.principles,
        experiences: cvData.experiences,
        projects: cvData.projects,
        skill_categories: cvData.skillCategories,
        educations: cvData.educations,
        certifications: cvData.certifications,
      };

      const { error } = await supabase
        .from('cv_documents')
        .upsert(payload, { onConflict: 'lang_code' });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    },
    'POST' // Triggers 1 retry on failure
  );
}
