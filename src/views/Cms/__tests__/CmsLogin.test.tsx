import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CmsLogin } from '../components/CmsLogin';
import * as authService from '@/services/authService';
import * as supabaseClient from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

vi.mock('@/services/authService', () => ({
  signInWithGoogle: vi.fn(),
  signInWithGitHub: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
  onAuthStateChange: vi.fn(),
}));

vi.mock('@/utils/supabase/client', () => ({
  isSupabaseConfigured: vi.fn(),
}));

describe('CmsLogin Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabaseClient.isSupabaseConfigured).mockReturnValue(true);
    vi.mocked(authService.getCurrentUser).mockResolvedValue(null);
    vi.mocked(authService.onAuthStateChange).mockReturnValue(() => {});
  });

  describe('Unauthenticated State (Single Google Login)', () => {
    it('renders the Google login interface with title, status badge, and security guarantee', async () => {
      render(<CmsLogin currentUser={null} />);

      expect(screen.getByText('Đăng Nhập CMS Studio')).toBeDefined();
      expect(screen.getByRole('button', { name: /Đăng nhập bằng Google/i })).toBeDefined();
      expect(screen.getByText(/Cơ chế xác thực bảo mật Google OAuth 2.0/i)).toBeDefined();

      await waitFor(() => {
        expect(screen.getByText(/CHƯA ĐĂNG NHẬP/i)).toBeDefined();
      });
    });

    it('triggers signInWithGoogle when clicking the Google login button', async () => {
      vi.mocked(authService.signInWithGoogle).mockResolvedValue({ error: null });

      render(<CmsLogin currentUser={null} />);

      const loginButton = screen.getByRole('button', { name: /Đăng nhập bằng Google/i });
      fireEvent.click(loginButton);

      expect(authService.signInWithGoogle).toHaveBeenCalledTimes(1);
    });

    it('displays error alert if signInWithGoogle fails', async () => {
      vi.mocked(authService.signInWithGoogle).mockResolvedValue({
        error: 'Tài khoản Google chưa được cấp quyền quản trị.',
      });

      render(<CmsLogin currentUser={null} />);

      const loginButton = screen.getByRole('button', { name: /Đăng nhập bằng Google/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(
          screen.getByText('Tài khoản Google chưa được cấp quyền quản trị.')
        ).toBeDefined();
      });
    });

    it('displays warning when Supabase is not configured', () => {
      vi.mocked(supabaseClient.isSupabaseConfigured).mockReturnValue(false);

      render(<CmsLogin currentUser={null} />);

      expect(
        screen.getByText(/Chưa cấu hình biến môi trường Supabase/i)
      ).toBeDefined();
    });

    it('allows manually re-checking auth status via refresh button', async () => {
      render(<CmsLogin currentUser={null} />);

      const refreshBtn = screen.getByRole('button', { name: /Kiểm tra lại/i });
      fireEvent.click(refreshBtn);

      await waitFor(() => {
        expect(authService.getCurrentUser).toHaveBeenCalled();
      });
    });
  });

  describe('OAuth Diagnostic Error from URL', () => {
    it('detects and displays diagnostic guide when URL contains error_description', async () => {
      delete (window as any).location;
      (window as any).location = new URL(
        'http://localhost:3000/vi/admin?error=server_error&error_description=Error+authenticating+with+Google'
      );

      render(<CmsLogin currentUser={null} />);

      await waitFor(() => {
        expect(
          screen.getByText(/Error authenticating with Google/i)
        ).toBeDefined();
        expect(
          screen.getByText(/Cần cấu hình Google Provider trong Supabase Dashboard/i)
        ).toBeDefined();
      });
    });
  });

  describe('Authenticated State (User Profile & Management)', () => {
    const mockUser: User = {
      id: 'test-google-user-id',
      app_metadata: {},
      user_metadata: {
        full_name: 'Tan Huynh Nhat',
        picture: 'https://lh3.googleusercontent.com/a/test-avatar',
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: 'tanhuynh2631@gmail.com',
    };

    it('renders authenticated user profile with avatar, name, and admin status', async () => {
      vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);
      render(<CmsLogin currentUser={mockUser} />);

      expect(screen.getByText('Tài Khoản Quản Trị CMS')).toBeDefined();
      expect(screen.getByText('Tan Huynh Nhat')).toBeDefined();
      expect(screen.getByText('tanhuynh2631@gmail.com')).toBeDefined();
      expect(screen.getByText('Admin')).toBeDefined();

      await waitFor(() => {
        expect(screen.getByText(/ĐÃ ĐĂNG NHẬP/i)).toBeDefined();
      });
    });

    it('navigates to dashboard when clicking "Vào Bảng Điều Khiển"', () => {
      const handleSelectTab = vi.fn();
      render(<CmsLogin currentUser={mockUser} onSelectTab={handleSelectTab} />);

      const dashboardBtn = screen.getByRole('button', { name: /Vào Bảng Điều Khiển/i });
      fireEvent.click(dashboardBtn);

      expect(handleSelectTab).toHaveBeenCalledWith('dashboard');
    });

    it('calls signOut and updates state when clicking "Đăng Xuất Tài Khoản"', async () => {
      vi.mocked(authService.signOut).mockResolvedValue({ error: null });
      const handleUserChange = vi.fn();

      render(<CmsLogin currentUser={mockUser} onUserChange={handleUserChange} />);

      const signOutBtn = screen.getByRole('button', { name: /Đăng Xuất Tài Khoản/i });
      fireEvent.click(signOutBtn);

      await waitFor(() => {
        expect(authService.signOut).toHaveBeenCalledTimes(1);
        expect(handleUserChange).toHaveBeenCalledWith(null);
        expect(screen.getByText(/Đã đăng xuất thành công/i)).toBeDefined();
      });
    });
  });
});
