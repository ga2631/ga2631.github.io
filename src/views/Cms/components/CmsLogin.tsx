'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { signInWithGitHub, signOut, getCurrentUser, onAuthStateChange } from '@/services/authService';
import { isSupabaseConfigured } from '@/utils/supabase/client';
import { CmsTab } from '@/components/layouts/CmsLayout';

interface CmsLoginProps {
  currentUser: User | null;
  onUserChange?: (user: User | null) => void;
  onSelectTab?: (tab: CmsTab) => void;
}

export interface OAuthErrorInfo {
  code: string;
  message: string;
}

export function CmsLogin({ currentUser, onUserChange, onSelectTab }: CmsLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [oauthError, setOauthError] = useState<OAuthErrorInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  // 1. Detect OAuth redirect error params from URL & listen to auth state changes
  useEffect(() => {
    let isMounted = true;
    setIsCheckingAuth(true);

    if (typeof window !== 'undefined') {
      // Check query params (?error=...&error_description=...)
      const urlParams = new URLSearchParams(window.location.search);
      const searchError = urlParams.get('error') || urlParams.get('error_code');
      const searchDesc = urlParams.get('error_description');

      // Also check hash fragments (#error=...&error_description=...)
      let hashError: string | null = null;
      let hashDesc: string | null = null;
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        hashError = hashParams.get('error') || hashParams.get('error_code');
        hashDesc = hashParams.get('error_description');
      }

      const detectedError = searchError || hashError;
      const detectedDesc = searchDesc || hashDesc;

      if (detectedError || detectedDesc) {
        setOauthError({
          code: detectedError || 'oauth_error',
          message: detectedDesc || 'Đăng nhập OAuth thất bại từ nhà cung cấp GitHub.',
        });

        // Clean query/hash from address bar without reloading
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }

    // Check active session
    getCurrentUser()
      .then((user) => {
        if (isMounted) {
          if (onUserChange) onUserChange(user);
          setIsCheckingAuth(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsCheckingAuth(false);
      });

    // Listen to Supabase Auth state changes
    const unsubscribe = onAuthStateChange((_event, session) => {
      if (isMounted) {
        const user = session?.user || null;
        if (onUserChange) onUserChange(user);
        setIsCheckingAuth(false);
        if (user) {
          setOauthError(null);
          setErrorMessage(null);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleRefreshStatus = async () => {
    setIsCheckingAuth(true);
    setErrorMessage(null);
    try {
      const user = await getCurrentUser();
      if (onUserChange) onUserChange(user);
      if (user) {
        setSuccessMessage('Đã đồng bộ phiên đăng nhập thành công.');
      } else {
        setSuccessMessage('Đã kiểm tra: Hiện chưa có phiên đăng nhập nào đang hoạt động.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi kiểm tra phiên đăng nhập.');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setOauthError(null);
    setSuccessMessage(null);

    const { error } = await signInWithGitHub();
    if (error) {
      setErrorMessage(error);
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setOauthError(null);
    try {
      const { error } = await signOut();
      if (error) {
        setErrorMessage(error);
      } else {
        if (onUserChange) onUserChange(null);
        setSuccessMessage('Đã đăng xuất thành công khỏi CMS Studio.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const avatarUrl = currentUser?.user_metadata?.avatar_url;
  const displayName =
    currentUser?.user_metadata?.full_name ||
    currentUser?.user_metadata?.name ||
    currentUser?.user_metadata?.user_name ||
    currentUser?.email ||
    'Quản trị viên';
  const githubUsername = currentUser?.user_metadata?.user_name;
  const userEmail = currentUser?.email || 'Chưa cung cấp email';

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 space-y-6" role="region" aria-label="Đăng nhập CMS">
      {/* 1. REAL-TIME AUTH STATUS HERO CARD */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-all ${
          isCheckingAuth
            ? 'bg-blue-50/80 border-blue-200 text-blue-900'
            : currentUser
            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950 shadow-sm'
            : 'bg-amber-50/90 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isCheckingAuth
                  ? 'bg-blue-500 text-white animate-spin'
                  : currentUser
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {isCheckingAuth ? (
                <i className="fa-solid fa-circle-notch text-base"></i>
              ) : currentUser ? (
                <i className="fa-solid fa-shield-check text-lg"></i>
              ) : (
                <i className="fa-solid fa-circle-exclamation text-lg"></i>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Trạng thái hiện tại:
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-black ${
                    isCheckingAuth
                      ? 'bg-blue-200/70 text-blue-800'
                      : currentUser
                      ? 'bg-emerald-200/70 text-emerald-800'
                      : 'bg-amber-200/70 text-amber-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isCheckingAuth
                        ? 'bg-blue-600 animate-ping'
                        : currentUser
                        ? 'bg-emerald-600'
                        : 'bg-amber-600'
                    }`}
                  />
                  {isCheckingAuth
                    ? 'Đang kiểm tra...'
                    : currentUser
                    ? 'ĐÃ ĐĂNG NHẬP'
                    : 'CHƯA ĐĂNG NHẬP'}
                </span>
              </div>

              <p className="text-xs mt-0.5 font-medium leading-relaxed">
                {isCheckingAuth
                  ? 'Đang đồng bộ phiên làm việc từ Supabase Auth...'
                  : currentUser
                  ? `Đang quản trị với tài khoản ${displayName} (${userEmail})`
                  : 'Chưa có phiên xác thực nào. Bấm nút đăng nhập GitHub bên dưới.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefreshStatus}
            disabled={isCheckingAuth}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 hover:text-gray-900 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Kiểm tra lại phiên đăng nhập"
          >
            <i className={`fa-solid fa-arrows-rotate text-xs ${isCheckingAuth ? 'fa-spin' : ''}`}></i>
            <span>Kiểm tra lại</span>
          </button>
        </div>
      </div>

      {/* 2. OAUTH ERROR DIAGNOSTIC BANNER (Specific for GitHub profile failures) */}
      {oauthError && (
        <div
          role="alert"
          className="p-5 rounded-3xl bg-red-50/95 border border-red-200 text-red-900 space-y-4 shadow-sm animate-in fade-in"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <i className="fa-solid fa-triangle-exclamation text-base"></i>
              </div>
              <div>
                <h2 className="text-sm font-black text-red-900">
                  Lỗi xác thực OAuth từ GitHub ({oauthError.code})
                </h2>
                <p className="text-xs text-red-700 mt-0.5 font-mono bg-red-100/70 p-1.5 rounded-lg">
                  {oauthError.message}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOauthError(null)}
              className="text-red-400 hover:text-red-700 font-bold text-lg cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* Guided Diagnostic Steps for "Error getting user profile from external provider" */}
          {oauthError.message.includes('Error getting user profile') && (
            <div className="pt-2 border-t border-red-200/80 text-xs text-red-800 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <i className="fa-solid fa-lightbulb text-amber-500"></i>
                <span>Nguyên nhân và cách khắc phục lỗi này:</span>
              </p>
              <ul className="list-decimal pl-5 space-y-1.5 text-xs text-red-700">
                <li>
                  <strong>Tài khoản GitHub ẩn email riêng tư (Phổ biến nhất):</strong> Mở{' '}
                  <a
                    href="https://github.com/settings/emails"
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold text-red-900 hover:text-black inline-flex items-center gap-1"
                  >
                    GitHub Settings &gt; Emails
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  , bỏ tích ô <em>&ldquo;Keep my email addresses private&rdquo;</em> (hoặc đảm bảo có ít nhất 1 email đã xác thực và chọn làm Public email tại{' '}
                  <a
                    href="https://github.com/settings/profile"
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold text-red-900 hover:text-black inline-flex items-center gap-1"
                  >
                    Profile
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  ).
                </li>
                <li>
                  <strong>Cấu hình Redirect URL trong Supabase:</strong> Truy cập Supabase Dashboard &gt;{' '}
                  <em>Authentication &gt; URL Configuration</em>, thêm{' '}
                  <code className="bg-red-100 px-1 py-0.5 rounded font-mono font-bold text-red-900">
                    http://localhost:3000/**
                  </code>{' '}
                  vào danh sách <em>Redirect URLs</em>.
                </li>
                <li>
                  <strong>Authorization Callback URL trong GitHub OAuth App:</strong> Đảm bảo Authorization Callback URL trong GitHub OAuth App đã nhập đúng:{' '}
                  <code className="bg-red-100 px-1 py-0.5 rounded font-mono font-bold text-red-900">
                    https://adagowczlvfdzcbaizws.supabase.co/auth/v1/callback
                  </code>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 3. ALERT NOTIFICATIONS */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3 shadow-2xs animate-in fade-in"
        >
          <i className="fa-solid fa-triangle-exclamation text-red-500 text-base mt-0.5 shrink-0"></i>
          <div className="flex-1">
            <p className="font-bold">Thông báo lỗi</p>
            <p className="text-xs text-red-600 mt-0.5 leading-relaxed">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-600 font-bold ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-3 shadow-2xs animate-in fade-in"
        >
          <i className="fa-solid fa-circle-check text-emerald-500 text-base mt-0.5 shrink-0"></i>
          <div className="flex-1">
            <p className="font-bold">Thông báo</p>
            <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">{successMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-500 hover:text-emerald-700 font-bold ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* 4. MAIN AUTHENTICATION CARD */}
      <div className="bg-white backdrop-blur-sm rounded-3xl border border-gray-100 border-t-4 border-t-gray-900 shadow-sm hover:shadow-md transition-all p-6 sm:p-10 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gray-900 text-white shadow-lg shadow-gray-900/15 mb-2 group">
            <i className="fa-brands fa-github text-3xl group-hover:scale-110 transition-transform"></i>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full ${configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>Xác thực qua Supabase Auth</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {currentUser ? 'Tài Khoản Quản Trị CMS' : 'Đăng Nhập CMS Studio'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              {currentUser
                ? 'Bạn đã đăng nhập thành công. Bạn có toàn quyền quản trị bài viết, chuyên mục và hồ sơ.'
                : 'Sử dụng duy nhất tài khoản GitHub để đăng nhập và đồng bộ nội dung với Supabase.'}
            </p>
          </div>
        </div>

        {/* State A: Authenticated User Profile */}
        {currentUser ? (
          <div className="space-y-6 pt-2">
            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-16 h-16 rounded-2xl border-2 border-white shadow-sm object-cover shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-2xl font-bold shrink-0">
                  <i className="fa-brands fa-github"></i>
                </div>
              )}

              <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-base font-bold text-gray-900 truncate">{displayName}</h2>
                  {githubUsername && (
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-gray-200 text-gray-700">
                      @{githubUsername}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    <i className="fa-solid fa-shield-halved text-[10px]"></i>
                    Admin
                  </span>
                </div>

                <div className="text-xs text-gray-600 font-mono truncate">{userEmail}</div>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-gray-400">
                  <span>
                    Phương thức: <strong className="text-gray-700">GitHub OAuth</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Trạng thái: <strong className="text-emerald-600 font-semibold">Đã xác thực</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => onSelectTab && onSelectTab('dashboard')}
                className="w-full py-3 px-4 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:shadow-md"
              >
                <i className="fa-solid fa-chart-pie"></i>
                <span>Vào Bảng Điều Khiển</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>{isLoading ? 'Đang xử lý...' : 'Đăng Xuất Tài Khoản'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* State B: Unauthenticated - Single Action: Sign in with GitHub */
          <div className="space-y-6 pt-2">
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGitHubLogin}
                disabled={isLoading || !configured}
                className="w-full py-3.5 px-6 rounded-2xl bg-gray-900 hover:bg-black text-white text-sm sm:text-base font-bold flex items-center justify-center gap-3 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin text-base"></i>
                    <span>Đang kết nối tới GitHub...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-brands fa-github text-xl group-hover:scale-110 transition-transform"></i>
                    <span>Đăng nhập bằng GitHub</span>
                  </>
                )}
              </button>

              {!configured && (
                <p className="text-center text-xs text-amber-600 font-medium">
                  ⚠️ Chưa cấu hình biến môi trường Supabase (`NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
                </p>
              )}
            </div>

            {/* Security Guarantee Box */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-200/80 flex items-center justify-center text-gray-700 shrink-0 mt-0.5">
                <i className="fa-solid fa-lock text-xs"></i>
              </div>
              <div className="text-xs text-gray-600 space-y-1 leading-relaxed">
                <p className="font-bold text-gray-800">Cơ chế xác thực bảo mật OAuth 2.0</p>
                <p className="text-[11px] text-gray-500">
                  Hệ thống xác thực trực tiếp qua Supabase và GitHub API. Thông tin đăng nhập không được lưu trữ trung gian, đảm bảo an toàn tuyệt đối cho tài nguyên quản trị.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature Information Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs text-gray-500 pt-2">
        <div className="p-3 rounded-2xl bg-white border border-gray-100 space-y-1">
          <i className="fa-solid fa-bolt text-red-500 text-sm"></i>
          <div className="font-bold text-gray-800">Đồng Bộ Thời Gian Thực</div>
          <div className="text-[11px] text-gray-400">Dữ liệu được cập nhật tức thời trên Supabase</div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-gray-100 space-y-1">
          <i className="fa-solid fa-shield-check text-emerald-500 text-sm"></i>
          <div className="font-bold text-gray-800">Phân Quyền RLS</div>
          <div className="text-[11px] text-gray-400">Row Level Security bảo vệ bảng dữ liệu</div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-gray-100 space-y-1">
          <i className="fa-solid fa-key text-blue-500 text-sm"></i>
          <div className="font-bold text-gray-800">100% Không Cần Mật Khẩu</div>
          <div className="text-[11px] text-gray-400">Xác thực duy nhất qua GitHub OAuth</div>
        </div>
      </div>
    </div>
  );
}
