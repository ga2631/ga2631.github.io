import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

let mockPathname = '/admin';
let mockSearchParams = new URLSearchParams();
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
  useParams: () => ({ slug: mockSearchParams.get('slug') || '' }),
}));

let mockUser: any = null;
let authListenerCallback: any = null;

const { samplePost } = vi.hoisted(() => ({
  samplePost: {
    id: 'post-123',
    slug: 'test-edit-post',
    read_time: 5,
    published_at: '2026-10-04',
    translations: {
      vi: { lang_code: 'vi', title: 'Bài viết chỉnh sửa mẫu', summary: 'Tóm tắt', content_md: 'Nội dung' },
      en: { lang_code: 'en', title: 'Sample Edited Post', summary: 'Summary', content_md: 'Content' },
    },
  },
}));

vi.mock('@/services/authService', () => ({
  getCurrentUser: vi.fn().mockImplementation(() => Promise.resolve(mockUser)),
  onAuthStateChange: vi.fn().mockImplementation((cb) => {
    authListenerCallback = cb;
    return () => {};
  }),
  signInWithGoogle: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn().mockImplementation(() => {
    mockUser = null;
    return Promise.resolve({ error: null });
  }),
}));

vi.mock('@/utils/supabase/client', () => ({
  isSupabaseConfigured: vi.fn().mockReturnValue(true),
  getSupabaseClient: vi.fn().mockReturnValue({}),
}));

vi.mock('@/services/blogAdminService', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    getAllAdminPosts: vi.fn().mockResolvedValue([samplePost]),
    getAllAdminCategories: vi.fn().mockResolvedValue([]),
    getAllAdminTags: vi.fn().mockResolvedValue([]),
    saveAdminPost: vi.fn().mockResolvedValue({}),
    deleteAdminPost: vi.fn().mockResolvedValue({}),
    saveAdminCategory: vi.fn().mockResolvedValue({}),
    deleteAdminCategory: vi.fn().mockResolvedValue({}),
    saveAdminTag: vi.fn().mockResolvedValue({}),
    deleteAdminTag: vi.fn().mockResolvedValue({}),
  };
});

vi.mock('@/services/cvService', () => ({
  getCvData: vi.fn().mockResolvedValue(null),
  saveCvData: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/utils/analytics', () => ({
  GA_MEASUREMENT_ID: 'G-TEST',
  GTM_ID: 'GTM-TEST',
  APP_ENV: 'test',
  trackEvent: vi.fn(),
  trackLanguageChange: vi.fn(),
}));

import AdminLoginPage from '../login/page';
import AuthenticatedCmsLayout from '../(authenticated)/layout';
import AdminDashboardPage from '../(authenticated)/page';
import AdminBlogsPage from '../(authenticated)/blogs/page';
import AdminNewBlogPage from '../(authenticated)/blogs/new/page';
import AdminEditBlogPage from '../(authenticated)/blogs/edit/page';
import AdminCategoriesPage from '../(authenticated)/categories/page';
import AdminTagsPage from '../(authenticated)/tags/page';
import AdminCvPage from '../(authenticated)/cv/page';
import { LanguageProvider } from '@/i18n/LanguageContext';

describe('CMS Route Restructuring & Authentication Guard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
    mockPathname = '/admin';
    mockSearchParams = new URLSearchParams();
  });

  describe('Independent Standalone Login Page (/admin/login)', () => {
    it('renders standalone login card with Google login button and no CMS navigation bar', async () => {
      render(
        <LanguageProvider>
          <AdminLoginPage />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Đăng nhập bằng Google/i })).toBeDefined();
      });

      // Verify it has link back to home
      expect(screen.getByText(/Về trang chủ/i)).toBeDefined();

      // Verify CMS Studio navigation tabs are NOT rendered (independent page)
      expect(screen.queryByRole('button', { name: /Bảng Điều Khiển/i })).toBeNull();
      expect(screen.queryByRole('button', { name: /Bài Viết/i })).toBeNull();
      expect(screen.queryByRole('button', { name: /Chuyên Mục/i })).toBeNull();
    });

    it('automatically redirects authenticated user from /admin/login to /admin', async () => {
      mockUser = { id: 'usr-1', email: 'admin@google.com', user_metadata: { full_name: 'Admin User' } };

      render(
        <LanguageProvider>
          <AdminLoginPage />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/admin');
      });
    });
  });

  describe('Authentication Guard in AuthenticatedCmsLayout', () => {
    it('blocks unauthenticated visitors and redirects them to /admin/login', async () => {
      mockUser = null;
      mockPathname = '/admin';

      render(
        <LanguageProvider>
          <AuthenticatedCmsLayout>
            <div data-testid="protected-content">Secret CMS Content</div>
          </AuthenticatedCmsLayout>
        </LanguageProvider>
      );

      // Verify redirect was invoked
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/admin/login');
      });

      // Protected content MUST NOT be displayed
      expect(screen.queryByTestId('protected-content')).toBeNull();
    });

    it('grants access, renders CMSLayout top navigation, and displays protected content when user is authenticated', async () => {
      mockUser = { id: 'usr-1', email: 'admin@google.com', user_metadata: { full_name: 'Admin Google' } };
      mockPathname = '/admin';

      render(
        <LanguageProvider>
          <AuthenticatedCmsLayout>
            <div data-testid="protected-content">Secret CMS Content</div>
          </AuthenticatedCmsLayout>
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeDefined();
      });

      // Top navigation bar should now be visible
      expect(screen.getByText('CMS Studio')).toBeDefined();
      expect(screen.getByRole('button', { name: /Bảng Điều Khiển/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Bài Viết/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Chuyên Mục/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Thẻ Tag/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Hồ Sơ CV/i })).toBeDefined();
    });

    it('navigates to proper route when clicking top navigation tabs', async () => {
      mockUser = { id: 'usr-1', email: 'admin@google.com' };
      mockPathname = '/admin';

      render(
        <LanguageProvider>
          <AuthenticatedCmsLayout>
            <div>Content</div>
          </AuthenticatedCmsLayout>
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/admin@google.com/i)).toBeDefined();
      });

      // Click Bài Viết -> should push /admin/blogs
      fireEvent.click(screen.getByRole('button', { name: /Bài Viết/i }));
      expect(mockPush).toHaveBeenCalledWith('/admin/blogs');

      // Click Chuyên Mục -> should push /admin/categories
      fireEvent.click(screen.getByRole('button', { name: /Chuyên Mục/i }));
      expect(mockPush).toHaveBeenCalledWith('/admin/categories');

      // Click Thẻ Tag -> should push /admin/tags
      fireEvent.click(screen.getByRole('button', { name: /Thẻ Tag/i }));
      expect(mockPush).toHaveBeenCalledWith('/admin/tags');

      // Click Hồ Sơ CV -> should push /admin/cv
      fireEvent.click(screen.getByRole('button', { name: /Hồ Sơ CV/i }));
      expect(mockPush).toHaveBeenCalledWith('/admin/cv');
    });
  });

  describe('Route Pages (/admin, /admin/blogs, /admin/categories, /admin/tags, /admin/cv)', () => {
    beforeEach(() => {
      mockUser = { id: 'usr-1', email: 'admin@google.com' };
    });

    it('renders Dashboard on /admin', async () => {
      mockPathname = '/admin';
      render(
        <LanguageProvider>
          <AuthenticatedCmsLayout>
            <AdminDashboardPage />
          </AuthenticatedCmsLayout>
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Bảng Điều Khiển CMS Studio/i)).toBeDefined();
      });
    });

    it('renders Articles / Posts on /admin/blogs', async () => {
      mockPathname = '/admin/blogs';
      render(
        <LanguageProvider>
          <AuthenticatedCmsLayout>
            <AdminBlogsPage />
          </AuthenticatedCmsLayout>
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Quản Lý Bài Viết/i)).toBeDefined();
      });
    });

    it('renders Categories on /admin/categories', async () => {
      mockPathname = '/admin/categories';
      render(
        <LanguageProvider>
          <AuthenticatedCmsLayout>
            <AdminCategoriesPage />
          </AuthenticatedCmsLayout>
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole('region', { name: /Quản lý chuyên mục/i })).toBeDefined();
      });
    });

    it('renders Tags on /admin/tags', async () => {
      mockPathname = '/admin/tags';
      render(
        <LanguageProvider>
          <AuthenticatedCmsLayout>
            <AdminTagsPage />
          </AuthenticatedCmsLayout>
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole('region', { name: /Quản lý thẻ/i })).toBeDefined();
      });
    });

    it('renders CV Editor on /admin/cv', async () => {
      mockPathname = '/admin/cv';
      render(
        <LanguageProvider>
          <AuthenticatedCmsLayout>
            <AdminCvPage />
          </AuthenticatedCmsLayout>
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Hồ Sơ Năng Lực & CV/i)).toBeDefined();
      });
    });
  });

  describe('Post Creation and Editing Routes (/admin/blogs/new, /admin/blogs/edit)', () => {
    beforeEach(() => {
      mockUser = { id: 'usr-1', email: 'admin@google.com' };
    });

    it('renders New Post Editor on /admin/blogs/new and navigates back to /admin/blogs on cancel', async () => {
      mockPathname = '/admin/blogs/new';
      render(
        <LanguageProvider>
          <AuthenticatedCmsLayout>
            <AdminNewBlogPage />
          </AuthenticatedCmsLayout>
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Tiêu đề bài viết kỹ thuật/i)).toBeDefined();
      });

      // Verify Back/Cancel button navigates to /admin/blogs
      const cancelBtn = screen.getByRole('button', { name: /Quay lại/i });
      fireEvent.click(cancelBtn);
      expect(mockPush).toHaveBeenCalledWith('/admin/blogs');
    });

    it('renders Edit Post Editor on /admin/blogs/edit?slug=test-edit-post preloaded with post data', async () => {
      mockPathname = '/admin/blogs/edit';
      mockSearchParams = new URLSearchParams({ slug: 'test-edit-post' });

      render(
        <LanguageProvider>
          <AuthenticatedCmsLayout>
            <AdminEditBlogPage />
          </AuthenticatedCmsLayout>
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Bài viết chỉnh sửa mẫu')).toBeDefined();
      });
    });

    it('renders "Không tìm thấy bài viết" on /admin/blogs/edit with nonexistent slug', async () => {
      mockPathname = '/admin/blogs/edit';
      mockSearchParams = new URLSearchParams({ slug: 'nonexistent-slug' });

      render(
        <LanguageProvider>
          <AuthenticatedCmsLayout>
            <AdminEditBlogPage />
          </AuthenticatedCmsLayout>
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Không tìm thấy bài viết/i })).toBeDefined();
      });
    });

    it('renders "Chưa chọn bài viết" guidance state when visiting /admin/blogs/edit without query param', async () => {
      mockPathname = '/admin/blogs/edit';
      mockSearchParams = new URLSearchParams();

      render(
        <LanguageProvider>
          <AuthenticatedCmsLayout>
            <AdminEditBlogPage />
          </AuthenticatedCmsLayout>
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Chưa chọn bài viết/i)).toBeDefined();
      });
    });
  });
});
