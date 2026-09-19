import { describe, it, expect } from 'vitest';
import { blogPostsEn, blogPostsVi } from '../../../src/data/blogData';
import { BLOG_CATEGORY_DEFINITIONS } from '../../../src/data/blog/blogCategories';
import {
  CATEGORY_STRUCTURE_DEFINITIONS,
  validateBlogPostStructure,
} from '../../../src/data/blog/blogTemplates';
import viBlogRaw from '../../../src/data/blog/vi/2026/09.json';
import enBlogRaw from '../../../src/data/blog/en/2026/09.json';

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

  it('should have structured sections dictionary with exactly 5 keys for all raw Vietnamese articles in blog storage', () => {
    expect(viBlogRaw.length).toBeGreaterThanOrEqual(1);

    viBlogRaw.forEach((rawPost: any) => {
      expect(rawPost.sections, `Post "${rawPost.id}" must have a sections object`).toBeDefined();
      expect(typeof rawPost.sections).toBe('object');
      expect(Array.isArray(rawPost.sections)).toBe(false);

      const sectionKeys = Object.keys(rawPost.sections);
      expect(sectionKeys.length).toBe(5);

      const structure = CATEGORY_STRUCTURE_DEFINITIONS[rawPost.category];
      expect(structure, `Category "${rawPost.category}" must exist in schema`).toBeDefined();

      structure.sections.forEach((expectedDef) => {
        const content = rawPost.sections[expectedDef.id];
        expect(content, `Section "${expectedDef.id}" in post "${rawPost.id}" must exist`).toBeDefined();
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(20);
      });

      const validation = validateBlogPostStructure(rawPost, 'vi');
      expect(validation.isValid, `Raw post "${rawPost.id}" failed validation:\n${validation.errors.join('\n')}`).toBe(true);
    });
  });

  it('should have structured sections dictionary with exactly 5 keys for all raw English articles in blog storage', () => {
    expect(enBlogRaw.length).toBeGreaterThanOrEqual(1);

    enBlogRaw.forEach((rawPost: any) => {
      expect(rawPost.sections, `Post "${rawPost.id}" must have a sections object`).toBeDefined();
      expect(typeof rawPost.sections).toBe('object');
      expect(Array.isArray(rawPost.sections)).toBe(false);

      const sectionKeys = Object.keys(rawPost.sections);
      expect(sectionKeys.length).toBe(5);

      const structure = CATEGORY_STRUCTURE_DEFINITIONS[rawPost.category];
      expect(structure, `Category "${rawPost.category}" must exist in schema`).toBeDefined();

      structure.sections.forEach((expectedDef) => {
        const content = rawPost.sections[expectedDef.id];
        expect(content, `Section "${expectedDef.id}" in post "${rawPost.id}" must exist`).toBeDefined();
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(20);
      });

      const validation = validateBlogPostStructure(rawPost, 'en');
      expect(validation.isValid, `Raw post "${rawPost.id}" failed validation:\n${validation.errors.join('\n')}`).toBe(true);
    });
  });

  it('should validate that hydrated Vietnamese blog posts (up to 20) assemble complete contentHtml and adhere to standard structure', () => {
    expect(blogPostsVi.length).toBeGreaterThanOrEqual(1);

    const postsToTest = blogPostsVi.slice(0, 20);
    postsToTest.forEach((post) => {
      expect(post.contentHtml).toBeTruthy();
      expect(post.contentHtml).toContain('<h3');

      const result = validateBlogPostStructure(post, 'vi');
      expect(
        result.isValid,
        `Vietnamese post "${post.id}" (${post.title}) in category "${post.category}" failed structure validation:\n${result.errors.join('\n')}`
      ).toBe(true);
      expect(result.missingSections).toHaveLength(0);
      expect(result.foundSections).toHaveLength(5);
    });
  });

  it('should validate that hydrated English blog posts (up to 20) assemble complete contentHtml and adhere to standard structure', () => {
    expect(blogPostsEn.length).toBeGreaterThanOrEqual(1);

    const postsToTest = blogPostsEn.slice(0, 20);
    postsToTest.forEach((post) => {
      expect(post.contentHtml).toBeTruthy();
      expect(post.contentHtml).toContain('<h3');

      const result = validateBlogPostStructure(post, 'en');
      expect(
        result.isValid,
        `English post "${post.id}" (${post.title}) in category "${post.category}" failed structure validation:\n${result.errors.join('\n')}`
      ).toBe(true);
      expect(result.missingSections).toHaveLength(0);
      expect(result.foundSections).toHaveLength(5);
    });
  });

  it('should reject non-conforming articles with missing section keys in dictionary', () => {
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
      sections: {
        'context-problem': '<p>Only one section here.</p>',
      },
      contentHtml: '',
    };

    const result = validateBlogPostStructure(invalidPost, 'vi');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBe(4);
    expect(result.missingSections.length).toBe(4);
  });
});
