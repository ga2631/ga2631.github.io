'use client';

import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { signInWithGitHub, signOut } from '@/services/authService';
import { isSupabaseConfigured } from '@/utils/supabase/client';
import { CmsTab } from '@/components/layouts/CmsLayout';

interface CmsLoginProps {
  currentUser: User | null;
  onUserChange?: (user: User | null) => void;
  onSelectTab?: (tab: CmsTab) => void;
}

export function CmsLogin({ currentUser, onUserChange, onSelectTab }: CmsLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
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
      {/* Alert Notifications */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3 shadow-2xs animate-in fade-in"
        >
          <i className="fa-solid fa-triangle-exclamation text-red-500 text-base mt-0.5 shrink-0"></i>
          <div className="flex-1">
            <p className="font-bold">Lỗi xác thực</p>
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

      {/* Main Authentication Card */}
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
                ? 'Bạn đã đăng nhập thành công. Bạn có toàn quyền quản trị bài viết, chuyên mục và cấu hình hệ thống.'
                : 'Sử dụng tài khoản GitHub được cấp quyền quản trị để đăng nhập và đồng bộ nội dung với Supabase.'}
            </p>
          </div>
        </div>

        {/* State 1: Authenticated User Profile */}
        {currentUser ? (
          <div className="space-y-6 pt-2">
            {/* User Profile Card */}
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
          /* State 2: Unauthenticated - Single Action: Sign in with GitHub */
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
