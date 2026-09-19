import { describe, it, expect } from 'vitest';
import { cvDataEn, cvDataVi, uiTranslations } from '../../../src/data/cvData';
import { blogPostsEn, blogPostsVi } from '../../../src/data/blogData';
import { validateBlogPostStructure } from '../../../src/data/blog/blogTemplates';

// Recursive helper to get all nested object keys
const getAllKeys = (obj: Record<string, any>, prefix = ''): string[] => {
  return Object.keys(obj).reduce((res: string[], el) => {
    const key = prefix ? `${prefix}.${el}` : el;
    if (Array.isArray(obj[el])) {
      return [...res, key];
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, key, ...getAllKeys(obj[el], key)];
    }
    return [...res, key];
  }, []);
};

describe('TU-DATA-01: Data - Localization & Data Integrity Verification', () => {
  it('should have identical UI translation dictionary keys between English and Vietnamese', () => {
    const enKeys = getAllKeys(uiTranslations.en).sort();
    const viKeys = getAllKeys(uiTranslations.vi).sort();
    expect(enKeys).toEqual(viKeys);
  });

  it('should have complete personal information and non-empty contact fields in both locales', () => {
    [cvDataEn, cvDataVi].forEach((cv) => {
      expect(cv.personalInfo.fullName).toBeTruthy();
      expect(cv.personalInfo.jobTitle).toBeTruthy();
      expect(cv.personalInfo.email).toBeTruthy();
      expect(cv.personalInfo.location).toBeTruthy();
      expect(cv.personalInfo.githubUrl).toContain('github.com');
      if (cv.personalInfo.linkedinUrl) {
        expect(cv.personalInfo.linkedinUrl).toContain('linkedin.com');
      }
    });
  });

  it('should have equal number of experiences with valid period and accomplishment bullets', () => {
    expect(cvDataEn.experiences.length).toBe(cvDataVi.experiences.length);
    expect(cvDataEn.experiences.length).toBeGreaterThanOrEqual(3);

    cvDataEn.experiences.forEach((exp, idx) => {
      const viExp = cvDataVi.experiences[idx];
      expect(exp.id).toBe(viExp.id);
      expect(exp.role).toBeTruthy();
      expect(exp.company).toBeTruthy();
      expect(exp.achievements.length).toBeGreaterThan(0);
      expect(exp.achievements.length).toBe(viExp.achievements.length);
      expect(exp.technologies.length).toBeGreaterThan(0);
    });
  });

  it('should have equal number of architectural project case studies with full detail schema', () => {
    expect(cvDataEn.projects.length).toBe(cvDataVi.projects.length);
    expect(cvDataEn.projects.length).toBeGreaterThanOrEqual(3);

    cvDataEn.projects.forEach((proj, idx) => {
      const viProj = cvDataVi.projects[idx];
      expect(proj.id).toBe(viProj.id);
      expect(proj.title).toBeTruthy();
      expect(proj.category).toBeTruthy();
      expect(proj.description).toBeTruthy();
      expect(proj.tags.length).toBeGreaterThan(0);
      expect(proj.highlights.length).toBeGreaterThan(0);
    });
  });

  it('should have complete skill categories with populated skill items', () => {
    expect(cvDataEn.skillCategories.length).toBe(cvDataVi.skillCategories.length);
    cvDataEn.skillCategories.forEach((cat) => {
      expect(cat.title).toBeTruthy();
      expect(cat.skills.length).toBeGreaterThan(0);
      cat.skills.forEach((skill) => {
        expect(skill.name).toBeTruthy();
        expect(skill.level).toBeDefined();
      });
    });
  });

  it('should have verified education and professional certification entries', () => {
    expect(cvDataEn.educations.length).toBeGreaterThan(0);
    expect(cvDataEn.certifications.length).toBeGreaterThan(0);

    cvDataEn.certifications.forEach((cert) => {
      expect(cert.name).toBeTruthy();
      expect(cert.issuer).toBeTruthy();
      expect(cert.issueDate).toBeTruthy();
    });
  });

  it('should have matching blog posts across English and Vietnamese with required metadata (up to 20 articles)', () => {
    expect(blogPostsEn.length).toBe(blogPostsVi.length);
    expect(blogPostsEn.length).toBeGreaterThan(0);

    const postsToTest = blogPostsEn.slice(0, 20);
    postsToTest.forEach((post, idx) => {
      const viPost = blogPostsVi[idx];
      expect(post.id).toBe(viPost.id);
      expect(post.slug).toBe(viPost.slug);
      expect(post.title).toBeTruthy();
      expect(post.summary).toBeTruthy();
      expect(post.contentHtml).toBeTruthy();
      expect(post.readTime).toBeTruthy();
      expect(post.publishedAt).toBeTruthy();
      expect(post.tags.length).toBeGreaterThan(0);

      // Validate strict adherence to category 5-section standard structure
      expect(validateBlogPostStructure(post, 'en').isValid).toBe(true);
      expect(validateBlogPostStructure(viPost, 'vi').isValid).toBe(true);
    });
  });
});
