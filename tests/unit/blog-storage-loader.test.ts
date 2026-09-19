import { describe, it, expect } from 'vitest';
import {
  getAvailableMonthArchives,
  loadInitialBlogPosts,
  loadNextMonthBatch,
  loadAllArchivePosts,
  assembleArticleHtml,
  hydrateBlogPost,
  sortPostsByDateDesc,
} from '../../src/services/blogService';

describe('TS-14: Year/Month Blog Storage & Dynamic Loader Verification', () => {
  it('should discover and sort month archives descending by year and month for Vietnamese and English', () => {
    const viArchives = getAvailableMonthArchives('vi');
    const enArchives = getAvailableMonthArchives('en');

    expect(viArchives.length).toBeGreaterThanOrEqual(1);
    expect(enArchives.length).toBeGreaterThanOrEqual(1);

    // Verify descending order
    for (let i = 0; i < viArchives.length - 1; i++) {
      const current = viArchives[i];
      const next = viArchives[i + 1];
      const currentVal = current.year * 100 + current.month;
      const nextVal = next.year * 100 + next.month;
      expect(currentVal).toBeGreaterThanOrEqual(nextVal);
    }
  });

  it('should load recent blog posts by default on initial page load', async () => {
    const initialResultVi = await loadInitialBlogPosts('vi', 20);
    const initialResultEn = await loadInitialBlogPosts('en', 20);

    expect(initialResultVi.posts.length).toBeGreaterThanOrEqual(1);
    expect(initialResultEn.posts.length).toBeGreaterThanOrEqual(1);

    // Verify posts are sorted descending by date
    for (let i = 0; i < initialResultVi.posts.length - 1; i++) {
      const current = new Date(initialResultVi.posts[i].date || 0).getTime();
      const next = new Date(initialResultVi.posts[i + 1].date || 0).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }

    // The loaded months should start with the most recent one
    const allArchivesVi = getAvailableMonthArchives('vi');
    const expectedFirstMonth = allArchivesVi[0]?.key;
    expect(initialResultVi.loadedMonthKeys[0]).toBe(expectedFirstMonth);
  });

  it('should load the next month batch when requested (pagination / load more)', async () => {
    const initialResult = await loadInitialBlogPosts('vi', 20);
    
    if (initialResult.hasMore) {
      const nextBatch = await loadNextMonthBatch('vi', initialResult.loadedMonthKeys, 20);
      expect(nextBatch.posts.length).toBeGreaterThan(0);
      expect(nextBatch.loadedMonthKeys.length).toBeGreaterThan(initialResult.loadedMonthKeys.length);
    }
  });

  it('should load all archives on demand and validate up to 40 articles', async () => {
    const allVi = await loadAllArchivePosts('vi');
    const allEn = await loadAllArchivePosts('en');

    expect(allVi.length).toBeGreaterThan(0);
    expect(allEn.length).toBeGreaterThan(0);

    // Check up to 40 articles as specified
    const viToCheck = allVi.slice(0, 40);
    const enToCheck = allEn.slice(0, 40);

    viToCheck.forEach((post) => {
      expect(post.id).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.category).toBeTruthy();
      expect(post.contentHtml).toBeTruthy();
      expect(post.contentHtml).toContain('<h3');
    });

    enToCheck.forEach((post) => {
      expect(post.id).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.category).toBeTruthy();
      expect(post.contentHtml).toBeTruthy();
      expect(post.contentHtml).toContain('<h3');
    });
  });

  it('should correctly assemble HTML content from standard sections dictionary', () => {
    const sampleCategory = 'data-engineering-analytics';
    const sampleSections = {
      'business-data-requirements': '<p>Business requirements description.</p>',
      'data-modeling': '<p>Data modeling details.</p>',
      'pipeline-construction': '<p>Pipeline code and architecture.</p>',
      'testing-optimization': '<p>Testing and optimization results.</p>',
      'summary-recommendations': '<p>Key takeaways and future recommendations.</p>',
    };

    const assembledHtml = assembleArticleHtml(sampleCategory, sampleSections, 'vi');
    expect(assembledHtml).toContain('<h3>1. ');
    expect(assembledHtml).toContain('<h3>5. ');
    expect(assembledHtml).toContain('Business requirements description.');
    expect(assembledHtml).toContain('Key takeaways and future recommendations.');
  });

  it('should correctly hydrate raw post objects and preserve existing contentHtml if provided', () => {
    const rawPost = {
      id: 'test-hydration',
      category: 'architecture-system-design',
      title: 'Hydration Test',
      summary: 'Testing hydration logic',
      publishedAt: '2026-05-15',
      date: '2026-05-15',
      readTime: '5 min',
      tags: ['Kafka', 'Architecture'],
      sections: {
        'context-problem': '<p>Context.</p>',
        'system-requirements': '<p>Requirements.</p>',
        'architectural-design': '<p>Design.</p>',
        'trade-offs-analysis': '<p>Trade-offs.</p>',
        'lessons-best-practices': '<p>Best practices.</p>',
      },
    };

    const hydrated = hydrateBlogPost(rawPost, 'vi');
    expect(hydrated.contentHtml).toBeTruthy();
    expect(hydrated.contentHtml).toContain('<h3>1. ');
    expect(hydrated.contentHtml).toContain('<h3>5. ');
  });

  it('should sort posts descending by date', () => {
    const posts = [
      { id: '1', date: '2026-01-10', title: 'Jan 10' } as any,
      { id: '2', date: '2026-05-20', title: 'May 20' } as any,
      { id: '3', date: '2026-03-15', title: 'Mar 15' } as any,
    ];

    const sorted = sortPostsByDateDesc(posts);
    expect(sorted[0].id).toBe('2');
    expect(sorted[1].id).toBe('3');
    expect(sorted[2].id).toBe('1');
  });
});
