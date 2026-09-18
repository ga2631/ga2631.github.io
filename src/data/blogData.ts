import { BlogPost } from '../types/index.ts';
import { CATEGORY_STRUCTURE_DEFINITIONS } from './blogTemplates.ts';

import enBlog from './locales/en/blog.json';
import viBlog from './locales/vi/blog.json';

/**
 * Assembles a unified HTML string from structured sections dictionary.
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
 * Hydrates a blog post JSON object into a fully populated BlogPost instance.
 */
export function hydrateBlogPost(raw: any, lang: 'vi' | 'en'): BlogPost {
  const contentHtml = raw.contentHtml || assembleArticleHtml(raw.category, raw.sections, lang);
  return {
    ...raw,
    contentHtml,
  };
}

export const blogPostsEn: BlogPost[] = (enBlog as any[]).map((p) => hydrateBlogPost(p, 'en'));
export const blogPostsVi: BlogPost[] = (viBlog as any[]).map((p) => hydrateBlogPost(p, 'vi'));

export const blogPosts: BlogPost[] = blogPostsEn;
