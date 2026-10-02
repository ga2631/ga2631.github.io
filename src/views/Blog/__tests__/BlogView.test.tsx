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
    expect(getAllByText('← Quay lại danh sách bài viết').length).toBeGreaterThan(0);
  });
});
