import { describe, it, expect } from 'vitest';
import {
  getAvailableMonthArchives,
  loadInitialBlogPosts,
  loadNextMonthBatch,
  loadAllArchivePosts,
  sortPostsByDateDesc,
  isPostPublished,
  getLocalDateString,
  getEagerPosts,
} from '../../../src/services/blogService';

describe('TU-SERVICES-01: Services - BlogService & Storage Loader', () => {
  describe('isPostPublished logic', () => {
    const fixedNow = new Date('2026-09-21T12:00:00Z');

    it('should format date string correctly with getLocalDateString', () => {
      const formatted = getLocalDateString(new Date('2026-09-21T10:00:00Z'));
      expect(formatted).toMatch(/^2026-09-2[12]$/);
    });

    it('should return true for past dates', () => {
      const post = { id: '1', date: '2026-09-15', title: 'Past' } as any;
      expect(isPostPublished(post, fixedNow)).toBe(true);
    });

    it('should return true for articles published today', () => {
      const todayPost = { id: '2', date: '2026-09-21', title: 'Today' } as any;
      expect(isPostPublished(todayPost, fixedNow)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futurePost1 = { id: '61', date: '2026-09-28', title: 'Future 1' } as any;
      const futurePost2 = { id: '62', date: '2026-10-05', title: 'Future 2' } as any;
      expect(isPostPublished(futurePost1, fixedNow)).toBe(false);
      expect(isPostPublished(futurePost2, fixedNow)).toBe(false);
    });

    it('should evaluate publishedAt when date is absent', () => {
      const pastPost = { id: '3', publishedAt: '15/09/2026', title: 'Past' } as any;
      const futurePost = { id: '4', publishedAt: '30/09/2026', title: 'Future' } as any;
      expect(isPostPublished(pastPost, fixedNow)).toBe(true);
      expect(isPostPublished(futurePost, fixedNow)).toBe(false);
    });

    it('should evaluate timestamp when date includes ISO time', () => {
      const pastTime = { id: '5', date: '2026-09-21T10:00:00Z', title: 'Past Time' } as any;
      const futureTime = { id: '6', date: '2026-09-21T18:00:00Z', title: 'Future Time' } as any;
      expect(isPostPublished(pastTime, fixedNow)).toBe(true);
      expect(isPostPublished(futureTime, fixedNow)).toBe(false);
    });

    it('should exclude future articles when loading eager posts with reference date', () => {
      const posts = getEagerPosts('vi', fixedNow);
      // All loaded articles must have date <= 2026-09-21
      posts.forEach((post) => {
        if (post.date) {
          expect(post.date <= '2026-09-21').toBe(true);
        }
      });
      // Future posts 61 and 62 should not be present
      expect(posts.some((p) => p.date === '2026-09-28')).toBe(false);
      expect(posts.some((p) => p.date === '2026-10-05')).toBe(false);
    });
  });

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
      expect(post.contentHtml).toMatch(/<h[23]/);
    });

    enToCheck.forEach((post) => {
      expect(post.id).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.category).toBeTruthy();
      expect(post.contentHtml).toBeTruthy();
      expect(post.contentHtml).toMatch(/<h[23]/);
    });
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

  it('should sort posts with the same date descending by numeric ID and fallback to slug', () => {
    const posts = [
      { id: '25', date: '2026-09-18', slug: 'refactoring' } as any,
      { id: '55', date: '2026-09-18', slug: 'data-engineering' } as any,
      { id: '23', date: '2026-09-17', slug: 'sticky-grid' } as any,
      { id: '54', date: '2026-09-17', slug: 'graph-bfs-dfs' } as any,
      { id: '53', date: '2026-09-17', slug: 'bst-traversal' } as any,
    ];

    const sorted = sortPostsByDateDesc(posts);
    expect(sorted[0].id).toBe('55');
    expect(sorted[1].id).toBe('25');
    expect(sorted[2].id).toBe('54');
    expect(sorted[3].id).toBe('53');
    expect(sorted[4].id).toBe('23');
  });

  it('should correctly prioritize publishedAt when date is absent', () => {
    const posts = [
      { id: '1', publishedAt: '10/01/2026', title: 'Jan 10' } as any,
      { id: '2', publishedAt: '20/05/2026', title: 'May 20' } as any,
    ];

    const sorted = sortPostsByDateDesc(posts);
    expect(sorted[0].id).toBe('2');
    expect(sorted[1].id).toBe('1');
  });
});
