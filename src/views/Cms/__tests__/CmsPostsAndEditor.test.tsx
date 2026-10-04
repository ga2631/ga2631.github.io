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
import { CmsPosts } from '../components/CmsPosts';
import { CmsPostEditor } from '../components/CmsPostEditor';
import { AdminPost, AdminCategory, AdminTag } from '@/services/blogAdminService';
import { renderMarkdownToHtml, analyzePostSeo, calculateReadingTime } from '@/utils/markdownRenderer';

describe('CMS Phase 3: Articles Management & Notion-Style Rich Editor', () => {
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
      slug: 'thuat-toan-core',
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
      tags: ['microservices'],
      published_at: '2026-01-15T00:00:00Z', // Published
      translations: {
        vi: {
          lang_code: 'vi',
          title: 'Kiến trúc Microservices Thực Chiến',
          summary: 'Hướng dẫn thiết kế hệ thống chịu tải cao với Event-Driven.',
          content_md: '## Tổng quan kiến trúc\nNội dung chi tiết...',
        },
        en: {
          lang_code: 'en',
          title: 'Microservices Architecture in Practice',
          summary: 'Designing high-concurrency systems with Event-Driven Architecture.',
          content_md: '## Architecture Overview\nDeep dive content...',
        },
      },
    },
    {
      id: 'post-2',
      slug: 'thuat-toan-sap-xep-nhanh',
      read_time: 5,
      category_id: 'cat-2',
      tag_ids: ['tag-2'],
      tags: ['high-concurrency'],
      published_at: '2030-10-10T00:00:00Z', // Scheduled in future
      translations: {
        vi: {
          lang_code: 'vi',
          title: 'Thuật toán Sắp xếp Nhanh',
          summary: 'Phân tích độ phức tạp thời gian và tối ưu bộ nhớ cache.',
          content_md: '## Phân tích độ phức tạp\n$$ O(n \\log n) $$',
        },
        en: {
          lang_code: 'en',
          title: 'Quick Sort Algorithm Analysis',
          summary: 'Time complexity analysis and memory cache locality.',
          content_md: '## Complexity Analysis\n$$ O(n \\log n) $$',
        },
      },
    },
    {
      id: 'post-3',
      slug: 'ban-nhap-chua-xuat-ban',
      read_time: 3,
      category_id: 'cat-1',
      tag_ids: [],
      tags: [],
      published_at: null, // Draft
      translations: {
        vi: {
          lang_code: 'vi',
          title: 'Bản Nháp Chưa Xuất Bản',
          summary: 'Đang biên soạn nội dung nháp.',
          content_md: 'Nội dung đang viết dở...',
        },
        en: {
          lang_code: 'en',
          title: 'Unpublished Draft Article',
          summary: 'Draft in progress.',
          content_md: 'Work in progress...',
        },
      },
    },
  ];

  describe('2.3 CmsPosts List Component', () => {
    it('renders articles management header, KPI cards, and posts table', () => {
      render(
        <LanguageProvider>
          <CmsPosts
            posts={mockPosts}
            categories={mockCategories}
            tags={mockTags}
            isLoading={false}
            editingPost={null}
            onSetEditingPost={vi.fn()}
            onSavePost={vi.fn()}
            onDeletePost={vi.fn()}
            onCreateNewPost={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      expect(screen.getByText(/Quản Lý Bài Viết/i)).toBeDefined();
      expect(screen.getByText('Tổng Bài Viết')).toBeDefined();
      expect(screen.getAllByText('3').length).toBeGreaterThan(0);

      // Check article titles rendered
      expect(screen.getByText('Kiến trúc Microservices Thực Chiến')).toBeDefined();
      expect(screen.getByText('Thuật toán Sắp xếp Nhanh')).toBeDefined();
      expect(screen.getByText('Bản Nháp Chưa Xuất Bản')).toBeDefined();
    });

    it('filters articles by search query', () => {
      render(
        <LanguageProvider>
          <CmsPosts
            posts={mockPosts}
            categories={mockCategories}
            tags={mockTags}
            isLoading={false}
            editingPost={null}
            onSetEditingPost={vi.fn()}
            onSavePost={vi.fn()}
            onDeletePost={vi.fn()}
            onCreateNewPost={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      const searchInput = screen.getByPlaceholderText(/Tìm kiếm theo tiêu đề hoặc slug/i);
      fireEvent.change(searchInput, { target: { value: 'Sắp xếp' } });

      expect(screen.getByText('Thuật toán Sắp xếp Nhanh')).toBeDefined();
      expect(screen.queryByText('Kiến trúc Microservices Thực Chiến')).toBeNull();
    });

    it('filters articles by status pill click', () => {
      render(
        <LanguageProvider>
          <CmsPosts
            posts={mockPosts}
            categories={mockCategories}
            tags={mockTags}
            isLoading={false}
            editingPost={null}
            onSetEditingPost={vi.fn()}
            onSavePost={vi.fn()}
            onDeletePost={vi.fn()}
            onCreateNewPost={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      // Click "Bản Nháp" KPI card
      const draftCard = screen.getByText('Bản Nháp');
      fireEvent.click(draftCard);

      expect(screen.getByText('Bản Nháp Chưa Xuất Bản')).toBeDefined();
      expect(screen.queryByText('Kiến trúc Microservices Thực Chiến')).toBeNull();
    });

    it('calls onSetEditingPost when Sửa button is clicked', () => {
      const handleSetEditing = vi.fn();

      render(
        <LanguageProvider>
          <CmsPosts
            posts={mockPosts}
            categories={mockCategories}
            tags={mockTags}
            isLoading={false}
            editingPost={null}
            onSetEditingPost={handleSetEditing}
            onSavePost={vi.fn()}
            onDeletePost={vi.fn()}
            onCreateNewPost={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      const editButtons = screen.getAllByRole('button', { name: 'Sửa' });
      fireEvent.click(editButtons[0]);

      expect(handleSetEditing).toHaveBeenCalledWith(mockPosts[0]);
    });

    it('transitions seamlessly between list mode and editor mode without hook violations', () => {
      const { rerender } = render(
        <LanguageProvider>
          <CmsPosts
            posts={mockPosts}
            categories={mockCategories}
            tags={mockTags}
            isLoading={false}
            editingPost={null}
            onSetEditingPost={vi.fn()}
            onSavePost={vi.fn()}
            onDeletePost={vi.fn()}
            onCreateNewPost={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      expect(screen.getByText(/Quản Lý Bài Viết/i)).toBeDefined();

      // Transition to editor mode (tests that hooks count remains stable)
      rerender(
        <LanguageProvider>
          <CmsPosts
            posts={mockPosts}
            categories={mockCategories}
            tags={mockTags}
            isLoading={false}
            editingPost={mockPosts[0]}
            onSetEditingPost={vi.fn()}
            onSavePost={vi.fn()}
            onDeletePost={vi.fn()}
            onCreateNewPost={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      expect(screen.getByText('/kien-truc-microservices-thuc-chien')).toBeDefined();

      // Transition back to list mode
      rerender(
        <LanguageProvider>
          <CmsPosts
            posts={mockPosts}
            categories={mockCategories}
            tags={mockTags}
            isLoading={false}
            editingPost={null}
            onSetEditingPost={vi.fn()}
            onSavePost={vi.fn()}
            onDeletePost={vi.fn()}
            onCreateNewPost={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      expect(screen.getByText(/Quản Lý Bài Viết/i)).toBeDefined();
    });

    it('supports pagination, page navigation, and page size switching in articles table', () => {
      const manyPosts: AdminPost[] = Array.from({ length: 25 }, (_, idx) => ({
        id: `post-page-${idx + 1}`,
        slug: `post-page-${idx + 1}`,
        read_time: 5,
        category_id: 'cat-1',
        tag_ids: ['tag-1'],
        tags: ['microservices'],
        published_at: '2026-01-15T00:00:00Z',
        translations: {
          vi: { lang_code: 'vi', title: `Bài Viết Số #${idx + 1}`, summary: `Tóm tắt #${idx + 1}`, content_md: '' },
          en: { lang_code: 'en', title: `Article Number #${idx + 1}`, summary: `Summary #${idx + 1}`, content_md: '' },
        },
      }));

      render(
        <LanguageProvider>
          <CmsPosts
            posts={manyPosts}
            categories={mockCategories}
            tags={mockTags}
            isLoading={false}
            editingPost={null}
            onSetEditingPost={vi.fn()}
            onSavePost={vi.fn()}
            onDeletePost={vi.fn()}
            onCreateNewPost={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      // Verify page 1 items are shown (1-10) and page 2 items are not
      expect(screen.getByText('Bài Viết Số #1')).toBeDefined();
      expect(screen.getByText('Bài Viết Số #10')).toBeDefined();
      expect(screen.queryByText('Bài Viết Số #11')).toBeNull();

      // Verify pagination summary indicator
      expect(screen.getAllByText(/Hiển thị/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/trên tổng số/i)).toBeDefined();
      expect(screen.getByText(/Trang/i)).toBeDefined();

      // Click "Sau" (Next page)
      const nextBtn = screen.getByRole('button', { name: /Trang sau|Sau/i });
      fireEvent.click(nextBtn);

      // Now page 2 should be displayed (11-20)
      expect(screen.queryByText('Bài Viết Số #1')).toBeNull();
      expect(screen.getByText('Bài Viết Số #11')).toBeDefined();
      expect(screen.getByText('Bài Viết Số #20')).toBeDefined();
      expect(screen.queryByText('Bài Viết Số #21')).toBeNull();

      // Change page size to 20
      const pageSizeSelect = screen.getByRole('combobox', { name: /Số bài viết mỗi trang/i });
      fireEvent.change(pageSizeSelect, { target: { value: '20' } });

      // Automatically reset to page 1 with 20 items
      expect(screen.getByText('Bài Viết Số #1')).toBeDefined();
      expect(screen.getByText('Bài Viết Số #20')).toBeDefined();
      expect(screen.queryByText('Bài Viết Số #21')).toBeNull();
    });
  });

  describe('2.3.4 Notion-Style CmsPostEditor Component', () => {
    it('renders editor with bilingual tabs, category selector, smart scheduler, and tools', () => {
      render(
        <LanguageProvider>
          <CmsPostEditor
            post={mockPosts[0]}
            categories={mockCategories}
            tags={mockTags}
            onSave={vi.fn()}
            onCancel={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      // Header actions & Title
      expect(screen.getByText('/kien-truc-microservices-thuc-chien')).toBeDefined();
      expect(screen.getByText('Đã Xuất Bản')).toBeDefined();

      // Check Category & Tag options
      expect(screen.getByText(/Chuyên Mục Kỹ Thuật/i)).toBeDefined();
      expect(screen.getByText('#microservices')).toBeDefined();

      // Check Notion commands button
      expect(screen.getByText(/Lệnh Notion/i)).toBeDefined();

      // Check SEO toggle button
      expect(screen.getByText(/SEO \d+%/i)).toBeDefined();
    });

    it('supports 2.3.1 bilingual language switching between VI and EN', () => {
      render(
        <LanguageProvider>
          <CmsPostEditor
            post={mockPosts[0]}
            categories={mockCategories}
            tags={mockTags}
            onSave={vi.fn()}
            onCancel={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      const enTab = screen.getByRole('button', { name: 'EN' });
      fireEvent.click(enTab);

      // Verify English title appears in input
      const titleInput = screen.getByDisplayValue('Microservices Architecture in Practice');
      expect(titleInput).toBeDefined();

      const viTab = screen.getByRole('button', { name: 'VI' });
      fireEvent.click(viTab);
      expect(screen.getByDisplayValue('Kiến trúc Microservices Thực Chiến')).toBeDefined();
    });

    it('2.3.4 recommends smart date based on selected category weekday schedule', () => {
      render(
        <LanguageProvider>
          <CmsPostEditor
            post={{ ...mockPosts[2], category_id: 'cat-1' }} // Category 1 has post_schedule = 1 (Thứ 2)
            categories={mockCategories}
            tags={mockTags}
            onSave={vi.fn()}
            onCancel={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      const recommendBtn = screen.getByText('Gợi ý lịch');
      fireEvent.click(recommendBtn);

      // The published_at date field should now have a calculated future date
      const dateInput = screen.getByDisplayValue(/^\d{4}-\d{2}-\d{2}$/);
      expect(dateInput).toBeDefined();
    });

    it('2.3.4.3 opens Notion slash menu and inserts Mermaid diagram (2.3.4.1)', () => {
      render(
        <LanguageProvider>
          <CmsPostEditor
            post={mockPosts[0]}
            categories={mockCategories}
            tags={mockTags}
            onSave={vi.fn()}
            onCancel={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      // Open slash commands palette
      const slashButton = screen.getByText(/Lệnh Notion/i);
      fireEvent.click(slashButton);

      expect(screen.getByText(/Menu Lệnh Notion/i)).toBeDefined();
      expect(screen.getByText('Kiến trúc Mermaid')).toBeDefined();
      expect(screen.getByText('Công thức Toán LaTeX')).toBeDefined();

      // Click to insert Mermaid diagram
      const mermaidBtn = screen.getByText('Kiến trúc Mermaid');
      fireEvent.click(mermaidBtn);

      // Verify mermaid block is inserted into the textarea
      const textarea = screen.getByPlaceholderText(/Bắt đầu viết bài viết kỹ thuật/i) as HTMLTextAreaElement;
      expect(textarea.value).toContain('```mermaid');
    });

    it('2.3.4.5 opens SEO Analyzer and evaluates Google SERP snippet preview', () => {
      render(
        <LanguageProvider>
          <CmsPostEditor
            post={mockPosts[0]}
            categories={mockCategories}
            tags={mockTags}
            onSave={vi.fn()}
            onCancel={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      const seoToggle = screen.getByText(/SEO \d+%/i);
      fireEvent.click(seoToggle);

      expect(screen.getByText(/2.3.4.5 Công Cụ Tính Toán & Tối Ưu Hóa SEO Google/i)).toBeDefined();
      expect(screen.getByText(/huynhnhattan.dev/i)).toBeDefined();
      expect(screen.getByText(/Độ dài Tiêu đề \(SEO Title\)/i)).toBeDefined();
    });

    it('supports tag selection via select dropdown and removes tags via chip buttons', () => {
      render(
        <LanguageProvider>
          <CmsPostEditor
            post={{ ...mockPosts[0], tag_ids: ['tag-1'], tags: ['microservices'] }}
            categories={mockCategories}
            tags={mockTags}
            onSave={vi.fn()}
            onCancel={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      // Verify microservices tag is selected
      expect(screen.getByText('#microservices')).toBeDefined();

      // Select tag-2 (high-concurrency) from the dropdown
      const selectElem = screen.getByRole('combobox', { name: 'Chọn thẻ kỹ thuật' });
      fireEvent.change(selectElem, { target: { value: 'tag-2' } });

      // Both tags should now be in the chips
      expect(screen.getByText('#microservices')).toBeDefined();
      expect(screen.getByText('#high-concurrency')).toBeDefined();

      // Click remove button on #microservices
      const removeBtn = screen.getByTitle('Bỏ thẻ #microservices');
      fireEvent.click(removeBtn);

      // Verify #microservices is removed while #high-concurrency remains
      expect(screen.queryByTitle('Bỏ thẻ #microservices')).toBeNull();
      expect(screen.getByText('#high-concurrency')).toBeDefined();
    });

    it('toggles the right sidebar visibility when clicking the settings toggle', () => {
      render(
        <LanguageProvider>
          <CmsPostEditor
            post={mockPosts[0]}
            categories={mockCategories}
            tags={mockTags}
            onSave={vi.fn()}
            onCancel={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      // Sidebar is visible initially
      expect(screen.getByText('Cài Đặt Bài Viết')).toBeDefined();

      // Click toggle sidebar button
      const toggleBtn = screen.getByTitle(/Ẩn \/ Hiện cài đặt bài viết bên phải/i);
      fireEvent.click(toggleBtn);

      // Sidebar should now be hidden
      expect(screen.queryByText('Cài Đặt Bài Viết')).toBeNull();

      // Click toggle again
      fireEvent.click(toggleBtn);
      expect(screen.getByText('Cài Đặt Bài Viết')).toBeDefined();
    });

    it('calls onSave with updated content and compiled HTML when saving', async () => {
      const handleSave = vi.fn().mockResolvedValue(undefined);

      render(
        <LanguageProvider>
          <CmsPostEditor
            post={mockPosts[0]}
            categories={mockCategories}
            tags={mockTags}
            onSave={handleSave}
            onCancel={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      const saveBtn = screen.getByRole('button', { name: /Lưu Bài Viết/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(handleSave).toHaveBeenCalledWith(expect.objectContaining({
          slug: 'kien-truc-microservices-thuc-chien',
          translations: expect.objectContaining({
            vi: expect.objectContaining({
              title: 'Kiến trúc Microservices Thực Chiến',
              content_html: expect.stringContaining('Tổng quan kiến trúc'),
            }),
          }),
        }));
      });
    });

    it('defaults to Vietnamese and shows English translation aids when English is selected', () => {
      render(
        <LanguageProvider>
          <CmsPostEditor
            post={mockPosts[0]}
            categories={mockCategories}
            tags={mockTags}
            onSave={vi.fn()}
            onCancel={vi.fn()}
            currentLang="vi"
          />
        </LanguageProvider>
      );

      // Default active is Vietnamese
      expect(screen.getByText('Bản Tiếng Việt')).toBeDefined();
      expect(screen.getByText('(Mặc định hiển thị)')).toBeDefined();

      // Switch to English
      const enTab = screen.getByRole('button', { name: 'EN' });
      fireEvent.click(enTab);

      // English translation banner appears
      expect(screen.getByText(/Bản Tiếng Anh \(English Translation\)/i)).toBeDefined();
      expect(screen.getByText('Sao chép sườn từ bản Tiếng Việt')).toBeDefined();

      // Toggle Vietnamese reference panel
      const toggleRefBtn = screen.getByRole('button', { name: /Đối chiếu bản Tiếng Việt/i });
      fireEvent.click(toggleRefBtn);

      // Verify Vietnamese reference drawer is visible
      expect(screen.getByText(/Đối chiếu bản Tiếng Việt gốc/i)).toBeDefined();
      expect(screen.getAllByText('Kiến trúc Microservices Thực Chiến').length).toBeGreaterThan(0);
      expect(screen.getByText('Hướng dẫn thiết kế hệ thống chịu tải cao với Event-Driven.')).toBeDefined();
    });

    it('opens editor with English directly when initialLang is en', () => {
      render(
        <LanguageProvider>
          <CmsPostEditor
            post={mockPosts[0]}
            categories={mockCategories}
            tags={mockTags}
            onSave={vi.fn()}
            onCancel={vi.fn()}
            currentLang="vi"
            initialLang="en"
          />
        </LanguageProvider>
      );

      // Verify active language is directly English
      expect(screen.getByText(/Bản Tiếng Anh \(English Translation\)/i)).toBeDefined();
      const titleInput = screen.getByDisplayValue('Microservices Architecture in Practice');
      expect(titleInput).toBeDefined();
    });
  });

  describe('Markdown, KaTeX, and SEO Utilities', () => {
    it('renders LaTeX equations with KaTeX (2.3.4.2)', () => {
      // 1. Single line & inline
      const mathMarkdown = 'Phương trình: $$ E = mc^2 $$ và inline $ a^2 + b^2 = c^2 $.';
      const html = renderMarkdownToHtml(mathMarkdown);
      expect(html).toContain('katex');

      // 2. Multi-line LaTeX block ($$ ... $$)
      const multiLineMath = `$$
\\mathcal{O}(n \\log n) \\quad \\text{và} \\quad E = mc^2 \\quad \\sum_{i=1}^{n} \\frac{1}{i} \\approx \\ln(n) + \\gamma
$$`;
      const htmlMulti = renderMarkdownToHtml(multiLineMath);
      expect(htmlMulti).toContain('katex');
      expect(htmlMulti).toContain('katex-display');

      // 3. Fenced LaTeX code block (```latex ... ```)
      const fencedMath = '```latex\n\\int_0^1 x^2 dx = \\frac{1}{3}\n```';
      const htmlFenced = renderMarkdownToHtml(fencedMath);
      expect(htmlFenced).toContain('katex');
      expect(htmlFenced).toContain('katex-display');
    });

    it('renders Mermaid diagram blocks (2.3.4.1)', () => {
      const mermaidMarkdown = '```mermaid\nflowchart LR\n  A --> B\n```';
      const html = renderMarkdownToHtml(mermaidMarkdown);
      expect(html).toContain('mermaid-diagram');
      expect(html).toContain('Kiến trúc Mermaid Diagram');
    });

    it('calculates reading time and words accurately (2.3.4.4)', () => {
      const sampleText = 'Từ vựng kỹ thuật '.repeat(100); // 400 words
      const stats = calculateReadingTime(sampleText);
      expect(stats.words).toBe(400);
      expect(stats.minutes).toBe(2);
    });

    it('analyzes SEO factors correctly (2.3.4.5)', () => {
      const seo = analyzePostSeo(
        'Thiết kế Hệ thống Microservices với Event-Driven',
        'Tổng quan chi tiết về mô hình vi dịch vụ phân tán, xử lý hàng triệu thông điệp mỗi giây với Kafka và Redis.',
        '## Phần 1: Tổng quan\nNội dung bài viết rất dài và chuyên sâu...\n## Phần 2: Kiến trúc lõi\nChi tiết phần 2...',
        'thiet-ke-microservices-event-driven'
      );
      expect(seo.score).toBeGreaterThanOrEqual(60);
      expect(seo.checks.length).toBe(5);
    });
  });
});
