import { describe, it, expect } from 'vitest';
import { blogPostsEn, blogPostsVi } from '../../../src/data/blogData';
import { BLOG_CATEGORY_DEFINITIONS } from '../../../src/data/blog/blogCategories';
import {
  CATEGORY_STRUCTURE_DEFINITIONS,
  validateBlogPostStructure,
} from '../../../src/data/blog/blogTemplates';
import { markdownToHtml } from '../../../src/utils/markdownParser';

describe('TU-DATA-02: Data - Standardized Blog Post Structure & Category Schema Validation', () => {
  const activeCategories = BLOG_CATEGORY_DEFINITIONS.filter((c) => c.id !== 'all');

  it('should have standard structure definitions for all 5 active blog categories', () => {
    expect(activeCategories.length).toBe(5);

    activeCategories.forEach((cat) => {
      const structure = CATEGORY_STRUCTURE_DEFINITIONS[cat.id];
      expect(structure, `Category "${cat.id}" must have a standard structure definition`).toBeDefined();
      expect(structure.sections.length).toBe(5);

      // Verify each section has id, order 1-5, and bilingual titles
      structure.sections.forEach((sec, idx) => {
        expect(sec.order).toBe(idx + 1);
        expect(sec.id).toBeTruthy();
        expect(sec.title.vi).toBeTruthy();
        expect(sec.title.en).toBeTruthy();
        expect(sec.keywords.vi.length).toBeGreaterThan(0);
        expect(sec.keywords.en.length).toBeGreaterThan(0);
      });
    });
  });

  it('should validate that all Vietnamese Markdown blog posts adhere to standard structure and have non-empty content', () => {
    expect(blogPostsVi.length).toBeGreaterThanOrEqual(1);

    blogPostsVi.forEach((post) => {
      expect(post.id, `Post must have an id`).toBeTruthy();
      expect(post.slug, `Post "${post.id}" must have a slug`).toBeTruthy();
      expect(post.title, `Post "${post.id}" must have a title`).toBeTruthy();
      expect(post.summary, `Post "${post.id}" must have a summary`).toBeTruthy();
      expect(post.publishedAt, `Post "${post.id}" must have publishedAt`).toBeTruthy();
      expect(post.readTime, `Post "${post.id}" must have readTime`).toBeTruthy();
      expect(Array.isArray(post.tags) && post.tags.length > 0, `Post "${post.id}" must have tags`).toBe(true);
      expect(post.contentHtml, `Post "${post.id}" must have rendered contentHtml`).toBeTruthy();
      expect(post.contentHtml.length).toBeGreaterThan(100);

      const structure = CATEGORY_STRUCTURE_DEFINITIONS[post.category || ''];
      expect(structure, `Category "${post.category}" of post "${post.id}" must exist in schema`).toBeDefined();

      const validation = validateBlogPostStructure(post, 'vi');
      expect(
        validation.isValid,
        `Vietnamese post "${post.id}" (${post.title}) in category "${post.category}" failed validation:\n${validation.errors.join('\n')}`
      ).toBe(true);
    });
  });

  it('should validate that all English Markdown blog posts adhere to standard structure and have non-empty content', () => {
    expect(blogPostsEn.length).toBeGreaterThanOrEqual(1);

    blogPostsEn.forEach((post) => {
      expect(post.id, `Post must have an id`).toBeTruthy();
      expect(post.slug, `Post "${post.id}" must have a slug`).toBeTruthy();
      expect(post.title, `Post "${post.id}" must have a title`).toBeTruthy();
      expect(post.summary, `Post "${post.id}" must have a summary`).toBeTruthy();
      expect(post.publishedAt, `Post "${post.id}" must have publishedAt`).toBeTruthy();
      expect(post.readTime, `Post "${post.id}" must have readTime`).toBeTruthy();
      expect(Array.isArray(post.tags) && post.tags.length > 0, `Post "${post.id}" must have tags`).toBe(true);
      expect(post.contentHtml, `Post "${post.id}" must have rendered contentHtml`).toBeTruthy();
      expect(post.contentHtml.length).toBeGreaterThan(100);

      const structure = CATEGORY_STRUCTURE_DEFINITIONS[post.category || ''];
      expect(structure, `Category "${post.category}" of post "${post.id}" must exist in schema`).toBeDefined();

      const validation = validateBlogPostStructure(post, 'en');
      expect(
        validation.isValid,
        `English post "${post.id}" (${post.title}) in category "${post.category}" failed validation:\n${validation.errors.join('\n')}`
      ).toBe(true);
    });
  });

  it('should reject non-conforming articles with missing section headings', () => {
    const invalidPost = {
      id: 'test-invalid-post',
      slug: 'test-invalid-post',
      category: 'architecture-system-design',
      title: 'Incomplete Post',
      summary: 'Missing sections test',
      publishedAt: '2026',
      readTime: '3 min',
      tags: ['Test'],
      author: 'Test Author',
      contentHtml: '<h2>1. Bối cảnh & Vấn đề</h2><p>Only one section here.</p>',
    };

    const result = validateBlogPostStructure(invalidPost, 'vi');
    expect(result.isValid).toBe(false);
    expect(result.missingSections.length).toBe(4);
  });

  it('should calculate accurate category and tag statistics across all existing posts (39 posts)', () => {
    expect(blogPostsVi.length).toBe(39);
    expect(blogPostsEn.length).toBe(39);

    // Verify category distribution totals exactly 39 posts
    const viCategorySum = activeCategories.reduce((sum, cat) => {
      return sum + blogPostsVi.filter((p) => p.category === cat.id).length;
    }, 0);
    expect(viCategorySum).toBe(39);

    const enCategorySum = activeCategories.reduce((sum, cat) => {
      return sum + blogPostsEn.filter((p) => p.category === cat.id).length;
    }, 0);
    expect(enCategorySum).toBe(39);
  });

  it('should safely escape HTML tags and generic types inside inline code backticks', () => {
    const rawMd = 'Sample with `<div class="card">`, `std::vector<int>`, and `> svg` selector.';
    const html = markdownToHtml(rawMd);
    expect(html).toContain('<code>&lt;div class=&quot;card&quot;&gt;</code>');
    expect(html).toContain('<code>std::vector&lt;int&gt;</code>');
    expect(html).toContain('<code>&gt; svg</code>');
    expect(html).not.toContain('<code><div class="card"></code>');
  });
});
