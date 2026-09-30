import {
  PersonalInfo,
  ExperienceItem,
  ProjectItem,
  SkillCategory,
  EducationItem,
  CertificationItem,
  PrincipleItem,
} from '@/types';

/**
 * Core: Languages
 */
export interface DbLanguage {
  code: string; // 'vi' | 'en'
  name: string;
  is_active?: boolean;
  created_at?: string;
}

/**
 * Blog: Categories & Category Translations
 */
export interface DbCategory {
  id?: string;
  slug: string;
  post_schedule?: number | null;
  icon?: string | null;
  color?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbCategoryTranslation {
  category_id: string;
  lang_code: string;
  name: string;
  description?: string | null;
}

/**
 * Blog: Tags & Tag Translations
 */
export interface DbTag {
  id?: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbTagTranslation {
  tag_id: string;
  lang_code: string;
  name: string;
}

/**
 * Blog: Posts, Post Tags & Post Translations
 */
export interface DbPost {
  id?: string;
  category_id?: string | null;
  slug: string;
  read_time?: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
}

export interface DbPostTag {
  post_id: string;
  tag_id: string;
}

export interface DbPostTranslation {
  post_id: string;
  lang_code: string;
  title: string;
  summary?: string | null;
  content_md: string;
  content_html?: string | null;
}

/**
 * CV: Document-based structure per language
 */
export interface DbCvDocument {
  lang_code: string; // 'vi' | 'en'
  personal_info: PersonalInfo;
  principles: PrincipleItem[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skill_categories: SkillCategory[];
  educations: EducationItem[];
  certifications: CertificationItem[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Joined Post with Translations and Tags for UI / Frontend
 */
export interface DetailedBlogPost {
  id: string;
  slug: string;
  readTime: string;
  publishedAt: string;
  category?: {
    slug: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    postSchedule?: number;
  } | null;
  tags: string[];
  translation: {
    langCode: string;
    title: string;
    summary: string;
    contentMd: string;
    contentHtml?: string;
  };
}
