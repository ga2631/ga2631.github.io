import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

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

import { LanguageProvider } from '@/i18n/LanguageContext';
import { CmsCategories } from '../components/CmsCategories';
import { CmsTags } from '../components/CmsTags';
import { AdminCategory, AdminTag, AdminPost } from '@/services/blogAdminService';

describe('CMS Phase 2: Categories and Tags Management', () => {
  const mockCategories: AdminCategory[] = [
    {
      id: 'cat-1',
      slug: 'kien-truc-he-thong',
      post_schedule: 1, // Thứ 2
      color: '#3B82F6',
      icon: 'LayersIcon',
      translations: {
        vi: { lang_code: 'vi', name: 'Kiến trúc Hệ thống', description: 'Hệ thống quy mô lớn' },
        en: { lang_code: 'en', name: 'System Architecture', description: 'Large scale systems' },
      },
    },
    {
      id: 'cat-2',
      slug: 'thuat-toan-hieu-nang',
      post_schedule: 2, // Thứ 3
      color: '#10B981',
      icon: 'CpuIcon',
      translations: {
        vi: { lang_code: 'vi', name: 'Thuật toán & Hiệu năng Core', description: 'Tối ưu hoá code' },
        en: { lang_code: 'en', name: 'Algorithms & Performance', description: 'Code optimization' },
      },
    },
  ];

  const mockTags: AdminTag[] = [
    {
      id: 'tag-1',
      slug: 'microservices',
      translations: {
        vi: { lang_code: 'vi', name: 'Kiến trúc Microservices' },
        en: { lang_code: 'en', name: 'Microservices Architecture' },
      },
    },
    {
      id: 'tag-2',
      slug: 'postgresql',
      translations: {
        vi: { lang_code: 'vi', name: 'Cơ sở dữ liệu PostgreSQL' },
        en: { lang_code: 'en', name: 'PostgreSQL Database' },
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
      tags: ['microservices'],
      published_at: '2026-01-15T00:00:00Z',
      translations: {
        vi: { lang_code: 'vi', title: 'Kiến trúc Microservices', summary: 'Tổng quan', content_md: 'Nội dung...' },
        en: { lang_code: 'en', title: 'Microservices Architecture', summary: 'Overview', content_md: 'Content...' },
      },
    },
  ];

  describe('2.1 CmsCategories Component', () => {
    it('renders category management header and weekday schedule status', () => {
      render(
        <LanguageProvider>
          <CmsCategories
            categories={mockCategories}
            posts={mockPosts}
            isLoading={false}
            onSaveCategory={vi.fn()}
            onDeleteCategory={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      expect(screen.getByText('2.1 Quản Lý Chuyên Mục')).toBeDefined();
      expect(screen.getByText(/Độ Bao Phủ Lịch Xuất Bản Tuần/i)).toBeDefined();
      expect(screen.getByText('2 / 5 chuyên mục')).toBeDefined();

      // Check category cards rendered
      expect(screen.getAllByText('Kiến trúc Hệ thống').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Thuật toán & Hiệu năng Core').length).toBeGreaterThan(0);
    });

    it('filters categories when user types into the search box', () => {
      render(
        <LanguageProvider>
          <CmsCategories
            categories={mockCategories}
            posts={mockPosts}
            isLoading={false}
            onSaveCategory={vi.fn()}
            onDeleteCategory={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      const searchInput = screen.getByPlaceholderText(/Tìm kiếm theo tên hoặc slug/i);
      fireEvent.change(searchInput, { target: { value: 'Thuật toán' } });

      expect(screen.getAllByText('Thuật toán & Hiệu năng Core').length).toBeGreaterThan(0);
      expect(screen.queryByText('/kien-truc-he-thong')).toBeNull();
    });

    it('opens create category modal, allows input, and saves', async () => {
      const handleSave = vi.fn().mockResolvedValue(undefined);

      render(
        <LanguageProvider>
          <CmsCategories
            categories={mockCategories}
            posts={mockPosts}
            isLoading={false}
            onSaveCategory={handleSave}
            onDeleteCategory={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      // Click "+ Thêm Chuyên Mục Mới"
      const createButton = screen.getByRole('button', { name: /\+ Thêm Chuyên Mục Mới/i });
      fireEvent.click(createButton);

      expect(screen.getAllByText('Thêm Chuyên Mục Mới').length).toBeGreaterThanOrEqual(1);

      // Fill in Vietnamese Name
      const nameInput = screen.getByPlaceholderText(/Ví dụ: Kiến trúc Hệ thống/i);
      fireEvent.change(nameInput, { target: { value: 'Kỹ thuật Phân tán' } });

      // Click save
      const submitButton = screen.getByRole('button', { name: /Lưu Chuyên Mục/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(handleSave).toHaveBeenCalledWith(expect.objectContaining({
          translations: expect.objectContaining({
            vi: expect.objectContaining({ name: 'Kỹ thuật Phân tán' }),
          }),
        }));
      });
    });

    it('calls onDeleteCategory when delete is clicked and confirmed', async () => {
      const handleDelete = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(
        <LanguageProvider>
          <CmsCategories
            categories={mockCategories}
            posts={mockPosts}
            isLoading={false}
            onSaveCategory={vi.fn()}
            onDeleteCategory={handleDelete}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      const deleteButtons = screen.getAllByTitle('Xoá chuyên mục');
      expect(deleteButtons.length).toBeGreaterThan(0);
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(handleDelete).toHaveBeenCalledWith('cat-1');
      });
    });
  });

  describe('2.2 CmsTags Component', () => {
    it('renders tag management header and 4 KPI metrics', () => {
      render(
        <LanguageProvider>
          <CmsTags
            tags={mockTags}
            posts={mockPosts}
            isLoading={false}
            onSaveTag={vi.fn()}
            onDeleteTag={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      expect(screen.getByText('2.2 Quản Lý Thẻ Kỹ Thuật')).toBeDefined();
      expect(screen.getByText('Tổng Số Thẻ')).toBeDefined();
      expect(screen.getByText('Đang Sử Dụng')).toBeDefined();
      expect(screen.getByText('Chưa Có Bài Viết')).toBeDefined();
      expect(screen.getByText('Thẻ Dùng Nhiều Nhất')).toBeDefined();

      // Top tag in mock is microservices
      expect(screen.getAllByText('#microservices').length).toBeGreaterThan(0);
      expect(screen.getAllByText('#postgresql').length).toBeGreaterThan(0);
    });

    it('toggles between Grid and Cloud views', () => {
      render(
        <LanguageProvider>
          <CmsTags
            tags={mockTags}
            posts={mockPosts}
            isLoading={false}
            onSaveTag={vi.fn()}
            onDeleteTag={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      const cloudButton = screen.getByRole('button', { name: /Đám mây/i });
      fireEvent.click(cloudButton);

      // Verify Cloud view rendered with displayName
      expect(screen.getByText('(Kiến trúc Microservices)')).toBeDefined();

      const gridButton = screen.getByRole('button', { name: /Dạng thẻ/i });
      fireEvent.click(gridButton);
      expect(screen.getAllByText('Xem bài viết →').length).toBeGreaterThan(0);
    });

    it('opens create tag modal, allows input, and saves tag', async () => {
      const handleSaveTag = vi.fn().mockResolvedValue(undefined);

      render(
        <LanguageProvider>
          <CmsTags
            tags={mockTags}
            posts={mockPosts}
            isLoading={false}
            onSaveTag={handleSaveTag}
            onDeleteTag={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      const createTagButton = screen.getByRole('button', { name: /\+ Thêm Thẻ Mới/i });
      fireEvent.click(createTagButton);

      expect(screen.getAllByText('Thêm Thẻ Mới').length).toBeGreaterThanOrEqual(1);

      const viInput = screen.getByPlaceholderText(/Ví dụ: Kiến trúc Microservices/i);
      fireEvent.change(viInput, { target: { value: 'Docker & Kubernetes' } });

      const saveButton = screen.getByRole('button', { name: /Lưu Thẻ/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(handleSaveTag).toHaveBeenCalledWith(expect.objectContaining({
          slug: 'docker-kubernetes',
          translations: expect.objectContaining({
            vi: expect.objectContaining({ name: 'Docker & Kubernetes' }),
          }),
        }));
      });
    });

    it('prompts confirmation and calls onDeleteTag', async () => {
      const handleDeleteTag = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(
        <LanguageProvider>
          <CmsTags
            tags={mockTags}
            posts={mockPosts}
            isLoading={false}
            onSaveTag={vi.fn()}
            onDeleteTag={handleDeleteTag}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      const deleteButtons = screen.getAllByTitle('Xoá thẻ');
      expect(deleteButtons.length).toBeGreaterThan(0);
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(handleDeleteTag).toHaveBeenCalled();
      });
    });
  });
});
