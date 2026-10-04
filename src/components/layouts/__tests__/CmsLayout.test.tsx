import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/vi/admin',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/authService', () => ({
  getCurrentUser: vi.fn().mockResolvedValue({ email: 'admin@example.com' }),
  signOut: vi.fn().mockResolvedValue(undefined),
  onAuthStateChange: vi.fn().mockReturnValue(() => {}),
}));

vi.mock('@/utils/supabase/client', () => ({
  isSupabaseConfigured: vi.fn().mockReturnValue(true),
}));

import { CmsLayout } from '../CmsLayout';
import { LanguageProvider } from '@/i18n/LanguageContext';

describe('CmsLayout Top Navigation Bar', () => {
  it('renders top navigation bar with brand, horizontal tabs, and tools', async () => {
    const handleSelectTab = vi.fn();

    render(
      <LanguageProvider>
        <CmsLayout activeTab="posts" onSelectTab={handleSelectTab}>
          <div data-testid="cms-content">Test CMS Content</div>
        </CmsLayout>
      </LanguageProvider>
    );

    // Verify Brand Logo
    expect(screen.getByText('CMS Studio')).toBeDefined();

    // Verify Desktop Nav Tabs
    expect(screen.getByText(/Bài Viết/i)).toBeDefined();
    expect(screen.getByText(/Chuyên Mục/i)).toBeDefined();
    expect(screen.getByText(/Thẻ Tag/i)).toBeDefined();
    expect(screen.getByText(/Hồ Sơ CV/i)).toBeDefined();
    expect(screen.getByText(/Cài Đặt/i)).toBeDefined();

    // Click on Dashboard tab
    const dashboardTab = screen.getByRole('button', { name: /Bảng Điều Khiển/i });
    fireEvent.click(dashboardTab);
    expect(handleSelectTab).toHaveBeenCalledWith('dashboard');

    // Verify children content is rendered full-width
    expect(screen.getByTestId('cms-content')).toBeDefined();
  });

  it('toggles mobile dropdown menu when clicking hamburger icon', () => {
    render(
      <LanguageProvider>
        <CmsLayout activeTab="dashboard" onSelectTab={vi.fn()}>
          <div>Content</div>
        </CmsLayout>
      </LanguageProvider>
    );

    const toggleBtn = screen.getByLabelText(/Mở menu điều hướng/i);
    fireEvent.click(toggleBtn);

    // Should switch icon to fa-xmark
    expect(toggleBtn.querySelector('.fa-xmark')).not.toBeNull();
  });
});
