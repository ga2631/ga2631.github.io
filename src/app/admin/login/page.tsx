'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, onAuthStateChange } from '@/services/authService';
import { CmsLogin } from '@/views/Cms/components/CmsLogin';
import { User } from '@supabase/supabase-js';

export default function AdminLoginPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Check existing session
    getCurrentUser()
      .then((user) => {
        if (!isMounted) return;
        setCurrentUser(user);
        setIsCheckingAuth(false);
        if (user) {
          router.replace('/admin');
        }
      })
      .catch(() => {
        if (isMounted) setIsCheckingAuth(false);
      });

    // Listen to auth events (e.g. after Google OAuth redirect callback)
    const unsubscribe = onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      const user = session?.user || null;
      setCurrentUser(user);
      setIsCheckingAuth(false);
      if (user) {
        router.replace('/admin');
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [router]);

  // Loading indicator while verifying credentials
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in" role="status">
          <div className="w-16 h-16 rounded-3xl bg-gray-900 text-white flex items-center justify-center text-2xl shadow-xl shadow-gray-900/10">
            <i className="fa-solid fa-shield-halved text-red-500 animate-pulse"></i>
          </div>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-circle-notch fa-spin text-sm text-red-600"></i>
              <span className="text-sm font-bold text-gray-900">CMS Studio</span>
            </div>
            <p className="text-xs text-gray-500">Đang kiểm tra quyền đăng nhập...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/70 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans antialiased text-gray-800">
      {/* Top Bar with Brand & Back Link */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-xs"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          <span>Về trang chủ</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white text-xs font-black shadow-md shadow-red-500/20">
            <i className="fa-solid fa-bolt text-xs"></i>
          </div>
          <span className="font-black text-sm tracking-tight text-gray-900 hidden sm:inline">
            CMS Studio
          </span>
        </div>
      </div>

      {/* Main Standalone Card */}
      <main className="flex-1 flex items-center justify-center py-6 sm:py-10">
        <div className="w-full max-w-xl">
          <CmsLogin
            currentUser={currentUser}
            onUserChange={(user) => {
              setCurrentUser(user);
              if (user) {
                router.replace('/admin');
              }
            }}
            onSelectTab={(tab) => {
              if (tab === 'dashboard' || tab === 'posts') {
                router.replace('/admin');
              }
            }}
          />
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="max-w-4xl w-full mx-auto text-center py-4 border-t border-gray-200/60 text-xs text-gray-400">
        <p>CMS Studio &copy; {new Date().getFullYear()} &bull; Hệ thống quản trị nội dung an toàn với Supabase Auth</p>
      </footer>
    </div>
  );
}
