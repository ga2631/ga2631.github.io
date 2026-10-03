import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/vi/blog',
  useSearchParams: () => new URLSearchParams(),
}));

import { LanguageProvider } from '@/i18n/LanguageContext';
import { BlogView } from '../index';
import { BlogPostDetailView } from '../BlogPostDetail';
import { BlogPost } from '@/types';
import { BlogCategoryDef } from '@/services/blogService';

describe('Blog Components', () => {
  const mockCategories: BlogCategoryDef[] = [
    {
      id: 'all',
      dayCode: 'ALL',
      scheduleDay: { vi: 'T2 - T6', en: 'Mon - Fri' },
      scheduleFull: { vi: 'Thứ 2 – Thứ 6 hàng tuần', en: 'Every weekday (Mon - Fri)' },
      title: { vi: 'Tất cả chuyên đề', en: 'All Topics' },
      description: { vi: 'Toàn bộ bài viết', en: 'All articles' },
      iconName: 'BookOpenIcon',
    },
    {
      id: 'kien-truc-he-thong',
      dayCode: 'MON',
      scheduleDay: { vi: 'Thứ 2', en: 'Mon' },
      scheduleFull: { vi: 'Thứ 2 hàng tuần', en: 'Every Monday' },
      title: { vi: 'Kiến trúc Hệ thống', en: 'System Architecture' },
      description: { vi: 'Thiết kế hệ thống chịu tải', en: 'High concurrency systems' },
      iconName: 'LayersIcon',
    },
    {
      id: 'ky-thuat-du-lieu',
      dayCode: 'TUE',
      scheduleDay: { vi: 'Thứ 3', en: 'Tue' },
      scheduleFull: { vi: 'Thứ 3 hàng tuần', en: 'Every Tuesday' },
      title: { vi: 'Kỹ thuật và Phân tích Dữ liệu', en: 'Data Engineering' },
      description: { vi: 'Xử lý dữ liệu lớn', en: 'Big data pipelines' },
      iconName: 'DatabaseIcon',
    },
  ];

  const mockPosts: BlogPost[] = [
    {
      id: 'post-1',
      slug: 'kien-truc-tong-the',
      title: 'Kiến trúc tổng thể giải cứu hệ thống',
      summary: 'Phân tích chi tiết bài toán OOM và giải pháp Medallion Architecture.',
      category: 'ky-thuat-du-lieu',
      publishedAt: '2026-09-29T00:00:00.000Z',
      date: '2026-09-29',
      readTime: '6 phút đọc',
      tags: ['Data Engineering', 'Rust', 'DuckDB'],
      author: 'Huỳnh Nhật Tân',
      contentHtml: '<h2>Giới thiệu</h2><p>Nội dung bài viết kiến trúc...</p>',
      content: '## Giới thiệu\n\nNội dung bài viết kiến trúc...',
    },
    {
      id: 'post-2',
      slug: 'he-thong-phan-tan-01',
      title: 'Thiết Kế Hệ Thống Phân Tán: Tầng Giao Tiếp',
      summary: 'Chiến lược phân tải và phòng chống DDOS hiệu quả.',
      category: 'kien-truc-he-thong',
      publishedAt: '2026-09-28T00:00:00.000Z',
      date: '2026-09-28',
      readTime: '8 phút đọc',
      tags: ['System Design', 'Distributed Systems'],
      author: 'Huỳnh Nhật Tân',
      contentHtml: '<h2>Tầng Giao Tiếp</h2><p>Phân tích tầng giao tiếp...</p>',
      content: '## Tầng Giao Tiếp\n\nPhân tích tầng giao tiếp...',
    },
  ];

  it('renders BlogView list, categories, and tags correctly in Vietnamese', () => {
    const { getByText, getAllByText } = render(
      <LanguageProvider initialLang="vi">
        <BlogView initialPosts={mockPosts} initialCategories={mockCategories} />
      </LanguageProvider>
    );

    // Headers and labels
    expect(getByText('Ghi chép Kỹ thuật & Kiến trúc Hệ thống')).toBeDefined();
    expect(getByText('Chuyên đề')).toBeDefined();
    expect(getByText('Thẻ & Từ khoá')).toBeDefined();

    // Category pills
    expect(getAllByText('Tất cả chuyên đề').length).toBeGreaterThan(0);
    expect(getAllByText('Kiến trúc Hệ thống').length).toBeGreaterThan(0);
    expect(getAllByText('Kỹ thuật và Phân tích Dữ liệu').length).toBeGreaterThan(0);

    // Posts rendered
    expect(getByText('Kiến trúc tổng thể giải cứu hệ thống')).toBeDefined();
    expect(getByText('Thiết Kế Hệ Thống Phân Tán: Tầng Giao Tiếp')).toBeDefined();

    // Tags cloud rendered
    expect(getAllByText(/#Data Engineering/).length).toBeGreaterThan(0);
    expect(getAllByText(/#System Design/).length).toBeGreaterThan(0);
  });

  it('filters posts by search query correctly', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <LanguageProvider initialLang="vi">
        <BlogView initialPosts={mockPosts} initialCategories={mockCategories} />
      </LanguageProvider>
    );

    const searchInput = getByPlaceholderText('Tìm kiếm bài viết theo tiêu đề, thẻ, từ khóa...');
    fireEvent.change(searchInput, { target: { value: 'Phân Tán' } });

    expect(getByText('Thiết Kế Hệ Thống Phân Tán: Tầng Giao Tiếp')).toBeDefined();
    expect(queryByText('Kiến trúc tổng thể giải cứu hệ thống')).toBeNull();
  });

  it('filters posts when selecting a category', () => {
    const { getByText, getAllByText, queryByText } = render(
      <LanguageProvider initialLang="vi">
        <BlogView initialPosts={mockPosts} initialCategories={mockCategories} />
      </LanguageProvider>
    );

    const dataCatButton = getAllByText('Kỹ thuật và Phân tích Dữ liệu')[0].closest('button')!;
    fireEvent.click(dataCatButton);

    expect(getByText('Kiến trúc tổng thể giải cứu hệ thống')).toBeDefined();
    expect(queryByText('Thiết Kế Hệ Thống Phân Tán: Tầng Giao Tiếp')).toBeNull();
  });

  it('renders BlogPostDetailView correctly with Table of Contents and markdown content', () => {
    const { getByText, getAllByText } = render(
      <LanguageProvider initialLang="vi">
        <BlogPostDetailView post={mockPosts[0]} />
      </LanguageProvider>
    );

    expect(getByText('Kiến trúc tổng thể giải cứu hệ thống')).toBeDefined();
    expect(getByText('Phân tích chi tiết bài toán OOM và giải pháp Medallion Architecture.')).toBeDefined();
    expect(getByText('Mục Lục Bài Viết')).toBeDefined();
    expect(getAllByText(/Quay lại danh sách bài viết/).length).toBeGreaterThan(0);
  });

  it('supports pagination across multiple pages and updates current page view', () => {
    const manyPosts: BlogPost[] = Array.from({ length: 25 }, (_, idx) => ({
      id: `post-${idx + 1}`,
      slug: `slug-post-${idx + 1}`,
      title: `Tiêu đề bài viết số ${idx + 1}`,
      summary: `Tóm tắt bài viết số ${idx + 1}`,
      category: 'ky-thuat-du-lieu',
      publishedAt: '2026-09-29T00:00:00.000Z',
      date: '2026-09-29',
      readTime: '5 phút đọc',
      tags: ['Data'],
      author: 'Huỳnh Nhật Tân',
      contentHtml: '<p>Content</p>',
      content: 'Content',
    }));

    const { getByText, queryByText } = render(
      <LanguageProvider initialLang="vi">
        <BlogView initialPosts={manyPosts} initialCategories={mockCategories} />
      </LanguageProvider>
    );

    // Page 1 should show posts 1 to 20
    expect(getByText('Tiêu đề bài viết số 1')).toBeDefined();
    expect(getByText('Tiêu đề bài viết số 20')).toBeDefined();
    expect(queryByText('Tiêu đề bài viết số 21')).toBeNull();

    // Verify pagination controls: Trang 1 / 2
    expect(getByText(/Trang/)).toBeDefined();

    // Click Next button or Page 2 button
    const nextButton = getByText('Sau').closest('button')!;
    fireEvent.click(nextButton);

    // Page 2 should now show post 21 and 25, and post 1 should not be visible
    expect(getByText('Tiêu đề bài viết số 21')).toBeDefined();
    expect(getByText('Tiêu đề bài viết số 25')).toBeDefined();
    expect(queryByText('Tiêu đề bài viết số 1')).toBeNull();
  });

  it('renders skeleton loading inside the article area when initialPosts is empty without modal loading', () => {
    const { getByRole, getByText, queryByRole } = render(
      <LanguageProvider initialLang="vi">
        <BlogView initialPosts={[]} initialCategories={mockCategories} />
      </LanguageProvider>
    );

    // Blog View layout is rendered immediately
    expect(getByText('Ghi chép Kỹ thuật & Kiến trúc Hệ thống')).toBeDefined();
    expect(getByText('Chuyên đề')).toBeDefined();

    // Loading status is visible inside article area
    expect(getByRole('status', { name: 'Loading articles' })).toBeDefined();

    // No modal dialog or blocking overlay
    expect(queryByRole('dialog')).toBeNull();
  });

  it('renders static box headers and skeleton bodies for categories and tags when initial data is empty', () => {
    const { getByRole, getByText, queryByText } = render(
      <LanguageProvider initialLang="vi">
        <BlogView initialPosts={[]} initialCategories={[]} />
      </LanguageProvider>
    );

    // Both box headers are always visible
    expect(getByText('Chuyên đề')).toBeDefined();
    expect(getByText('Thẻ & Từ khoá')).toBeDefined();

    // Bodies show skeletons
    expect(getByRole('status', { name: 'Loading categories' })).toBeDefined();
    expect(getByRole('status', { name: 'Loading tags' })).toBeDefined();
    expect(getByRole('status', { name: 'Loading articles' })).toBeDefined();

    // No crude text loading banner
    expect(queryByText('Đang tải danh sách bài viết...')).toBeNull();
  });
});

