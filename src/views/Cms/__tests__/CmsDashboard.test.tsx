import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

let mockPathname = '/vi/admin';
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => new URLSearchParams(),
}));

// Mock analytics
vi.mock('@/utils/analytics', () => ({
  GA_MEASUREMENT_ID: 'G-TEST123456',
  GTM_ID: 'GTM-TEST9999',
  APP_ENV: 'test',
  trackEvent: vi.fn(),
}));

import { trackEvent } from '@/utils/analytics';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { CmsDashboard } from '../components/CmsDashboard';
import { CmsView } from '../index';
import { AdminPost, AdminCategory, AdminTag } from '@/services/blogAdminService';

vi.mock('@/services/blogAdminService', async () => {
  const actual = await vi.importActual<any>('@/services/blogAdminService');
  return {
    ...actual,
    getAllAdminPosts: vi.fn().mockResolvedValue([]),
    getAllAdminCategories: vi.fn().mockResolvedValue([]),
    getAllAdminTags: vi.fn().mockResolvedValue([]),
  };
});

vi.mock('@/services/authService', () => ({
  getCurrentUser: vi.fn().mockResolvedValue(null),
  signInWithEmail: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChange: vi.fn().mockReturnValue(() => {}),
}));

vi.mock('@/services/cvService', () => ({
  getCvData: vi.fn().mockResolvedValue(null),
  saveCvData: vi.fn(),
}));

describe('CMS Dashboard (Phase 1)', () => {
  const mockCategories: AdminCategory[] = [
    {
      id: 'cat-1',
      slug: 'kien-truc-he-thong',
      post_schedule: 1, // Thứ 2
      translations: {
        vi: { lang_code: 'vi', name: 'Kiến trúc Hệ thống', description: 'Hệ thống quy mô lớn' },
        en: { lang_code: 'en', name: 'System Architecture', description: 'Large scale systems' },
      },
    },
    {
      id: 'cat-2',
      slug: 'thuat-toan-hieu-nang',
      post_schedule: 2, // Thứ 3
      translations: {
        vi: { lang_code: 'vi', name: 'Thuật toán & Hiệu năng Core', description: 'Tối ưu hoá code' },
        en: { lang_code: 'en', name: 'Algorithms & Performance', description: 'Code optimization' },
      },
    },
    {
      id: 'cat-3',
      slug: 'co-so-du-lieu',
      post_schedule: 3, // Thứ 4
      translations: {
        vi: { lang_code: 'vi', name: 'Cơ sở Dữ liệu & Data Engineering', description: 'Data pipelines' },
        en: { lang_code: 'en', name: 'Database & Data Engineering', description: 'Data pipelines' },
      },
    },
    {
      id: 'cat-4',
      slug: 'frontend-ui',
      post_schedule: 4, // Thứ 5
      translations: {
        vi: { lang_code: 'vi', name: 'Frontend & UI Tái sử dụng', description: 'Giao diện và UX' },
        en: { lang_code: 'en', name: 'Frontend & Reusable UI', description: 'UI and UX' },
      },
    },
    {
      id: 'cat-5',
      slug: 'tech-radar',
      post_schedule: 5, // Thứ 6
      translations: {
        vi: { lang_code: 'vi', name: 'Tech Radar & Góc nhìn Nghề nghiệp', description: 'Xu hướng công nghệ' },
        en: { lang_code: 'en', name: 'Tech Radar & Career Insights', description: 'Tech insights' },
      },
    },
  ];

  const mockTags: AdminTag[] = [
    {
      id: 'tag-1',
      slug: 'microservices',
      translations: {
        vi: { lang_code: 'vi', name: 'Microservices' },
        en: { lang_code: 'en', name: 'Microservices' },
      },
    },
    {
      id: 'tag-2',
      slug: 'high-concurrency',
      translations: {
        vi: { lang_code: 'vi', name: 'Chịu tải cao' },
        en: { lang_code: 'en', name: 'High Concurrency' },
      },
    },
  ];

  const mockPosts: AdminPost[] = [
    {
      id: 'post-1',
      slug: 'kien-truc-microservices-thuc-chien',
      read_time: 8,
      category_id: 'cat-1',
      tag_ids: ['tag-1'],
      tags: [],
      published_at: '2026-01-15T00:00:00Z', // Published in past
      translations: {
        vi: { lang_code: 'vi', title: 'Kiến trúc Microservices Thực Chiến', summary: 'Tổng quan microservices', content_md: 'Nội dung bài viết về kiến trúc...' },
        en: { lang_code: 'en', title: 'Microservices Architecture in Practice', summary: 'Microservices overview', content_md: 'Practical guide to microservices...' },
      },
    },
    {
      id: 'post-2',
      slug: 'thuat-toan-sap-xep-toi-uu',
      read_time: 6,
      category_id: 'cat-2',
      tag_ids: [],
      tags: [],
      published_at: '2030-10-10T00:00:00Z', // Scheduled in future
      translations: {
        vi: { lang_code: 'vi', title: 'Thuật toán Sắp xếp Tối ưu', summary: 'Tối ưu độ phức tạp', content_md: 'Nội dung thuật toán...' },
        en: { lang_code: 'en', title: 'Optimal Sorting Algorithms', summary: 'Optimizing complexity', content_md: 'Algorithm deep dive...' },
      },
    },
    {
      id: 'post-3',
      slug: 'ban-nhap-chua-xuat-ban',
      read_time: 4,
      category_id: 'cat-3',
      tag_ids: [],
      tags: [],
      published_at: null, // Draft
      translations: {
        vi: { lang_code: 'vi', title: 'Bản Nháp Chưa Xuất Bản', summary: 'Đang soạn thảo', content_md: 'Nội dung nháp...' },
        en: { lang_code: 'en', title: 'Unpublished Draft', summary: 'Work in progress', content_md: 'Draft content...' },
      },
    },
  ];

  it('renders 3.1 KPI Statistics cards with correct calculated counts', () => {
    render(
      <LanguageProvider>
        <CmsDashboard
          posts={mockPosts}
          categories={mockCategories}
          tags={mockTags}
          isLoading={false}
          onSelectTab={vi.fn()}
          onEditPost={vi.fn()}
          onRefreshData={vi.fn()}
          currentLang="vi"
        />
      </LanguageProvider>
    );

    // Total posts = 3
    expect(screen.getByText('Tổng Bài Viết')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();

    // Published, Scheduled, Drafts all equal 1 in mock
    expect(screen.getByText('Đã Xuất Bản')).toBeDefined();
    expect(screen.getByText('Đã Lên Lịch')).toBeDefined();
    expect(screen.getByText('Bản Nháp')).toBeDefined();
    const countOnes = screen.getAllByText('1');
    expect(countOnes.length).toBeGreaterThanOrEqual(3);

    // Weekly 5 category breakdown headings
    expect(screen.getByText(/Phân bổ bài viết theo 5 Chuyên đề/i)).toBeDefined();
    expect(screen.getAllByText('Kiến trúc Hệ thống').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Thuật toán & Hiệu năng Core').length).toBeGreaterThan(0);
  });

  it('renders 3.2 Recent Articles table with proper titles, categories, and actions', () => {
    const handleEditPost = vi.fn();

    render(
      <LanguageProvider>
        <CmsDashboard
          posts={mockPosts}
          categories={mockCategories}
          tags={mockTags}
          isLoading={false}
          onSelectTab={vi.fn()}
          onEditPost={handleEditPost}
          onRefreshData={vi.fn()}
          currentLang="vi"
        />
      </LanguageProvider>
    );

    expect(screen.getByText('3.2 Bài Đăng Gần Đây')).toBeDefined();
    expect(screen.getByText('Kiến trúc Microservices Thực Chiến')).toBeDefined();
    expect(screen.getByText('/kien-truc-microservices-thuc-chien')).toBeDefined();

    // Edit button clicks
    const editButtons = screen.getAllByRole('button', { name: 'Sửa' });
    expect(editButtons.length).toBeGreaterThan(0);
    fireEvent.click(editButtons[0]);
    expect(handleEditPost).toHaveBeenCalled();
  });

  it('renders 3.3 Next Week Publishing Pipeline with 5 workdays and callback for scheduling', () => {
    const handleCreatePostWithSchedule = vi.fn();

    render(
      <LanguageProvider>
        <CmsDashboard
          posts={mockPosts}
          categories={mockCategories}
          tags={mockTags}
          isLoading={false}
          onSelectTab={vi.fn()}
          onCreatePostWithSchedule={handleCreatePostWithSchedule}
          onEditPost={vi.fn()}
          onRefreshData={vi.fn()}
          currentLang="vi"
        />
      </LanguageProvider>
    );

    expect(screen.getByText('3.3 Lịch Đăng Bài Tuần Tới (Thứ 2 – Thứ 6)')).toBeDefined();

    // Workdays Monday through Friday are rendered
    expect(screen.getAllByText('Thứ 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Thứ 3').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Thứ 4').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Thứ 5').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Thứ 6').length).toBeGreaterThan(0);

    // Schedule buttons
    const scheduleButtons = screen.getAllByRole('button', { name: /\+ Lên lịch bài mới/i });
    expect(scheduleButtons.length).toBe(5);
    fireEvent.click(scheduleButtons[0]);
    expect(handleCreatePostWithSchedule).toHaveBeenCalled();
  });

  it('renders 3.4 GA4 Telemetry card and dispatches test ping event on button click', () => {
    render(
      <LanguageProvider>
        <CmsDashboard
          posts={mockPosts}
          categories={mockCategories}
          tags={mockTags}
          isLoading={false}
          onSelectTab={vi.fn()}
          onEditPost={vi.fn()}
          onRefreshData={vi.fn()}
          currentLang="vi"
        />
      </LanguageProvider>
    );

    expect(screen.getByText('3.4 Chỉ số GA4 & Hiệu quả')).toBeDefined();
    expect(screen.getByText('G-TEST123456')).toBeDefined();
    expect(screen.getByText('GTM-TEST9999')).toBeDefined();
    expect(screen.getByText(/Lượt xem \(Pageviews\)/i)).toBeDefined();

    // Click test ping button
    const pingButton = screen.getByRole('button', { name: /Gửi Test Ping sự kiện GA4/i });
    fireEvent.click(pingButton);

    expect(trackEvent).toHaveBeenCalledWith('cms_dashboard_ping', expect.objectContaining({
      source: 'cms_studio',
      admin_tab: 'dashboard',
      posts_count: 3,
    }));

    expect(screen.getByText(/Đã gửi sự kiện GA4 & GTM thành công!/i)).toBeDefined();
  });

  it('renders CmsDashboard within CmsView when activeTab is "dashboard"', async () => {
    const handleSelectTab = vi.fn();

    render(
      <LanguageProvider>
        <CmsView activeTab="dashboard" onSelectTab={handleSelectTab} />
      </LanguageProvider>
    );

    // Dashboard heading should be rendered
    expect(screen.getByText('Bảng Điều Khiển CMS Studio')).toBeDefined();
    expect(screen.getByText('3.1 Thống kê Số lượng Bài viết & Xuất bản')).toBeDefined();
    expect(screen.getByText('3.3 Lịch Đăng Bài Tuần Tới (Thứ 2 – Thứ 6)')).toBeDefined();
  });
});
