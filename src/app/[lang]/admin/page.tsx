'use client';

import React, { useState, useEffect } from 'react';
import { CmsLayout, CmsTab } from '@/components/layouts/CmsLayout';
import { CmsView } from '@/views/Cms';
import { CmsLogin } from '@/views/Cms/components/CmsLogin';
import { getCurrentUser, onAuthStateChange } from '@/services/authService';
import { User } from '@supabase/supabase-js';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<CmsTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCurrentUser()
      .then((user) => {
        if (!isMounted) return;
        setCurrentUser(user);
        setIsCheckingAuth(false);
      })
      .catch(() => {
        if (isMounted) setIsCheckingAuth(false);
      });

    const unsubscribe = onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      const user = session?.user || null;
      setCurrentUser(user);
      setIsCheckingAuth(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 1. Loading screen while verifying credentials
  if (isCheckingAuth) {
    return (
      <CmsLayout activeTab="login" onSelectTab={() => {}}>
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-in fade-in" role="status">
          <div className="w-14 h-14 rounded-3xl bg-gray-900 text-white flex items-center justify-center text-2xl shadow-xl shadow-gray-900/10">
            <i className="fa-solid fa-shield-halved text-red-500 animate-pulse"></i>
          </div>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-circle-notch fa-spin text-sm text-red-600"></i>
              <span className="text-sm font-bold text-gray-900">CMS Studio</span>
            </div>
            <p className="text-xs text-gray-500">Đang kiểm tra quyền quản trị viên...</p>
          </div>
        </div>
      </CmsLayout>
    );
  }

  // 2. Mandatory Authentication Gate: Block all CMS access if unauthenticated
  if (!currentUser) {
    return (
      <CmsLayout activeTab="login" onSelectTab={() => {}}>
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center gap-3 shadow-2xs">
            <i className="fa-solid fa-lock text-amber-600 text-base shrink-0"></i>
            <div>
              <p className="font-bold">Khu vực bảo mật CMS Studio</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Trang quản trị bắt buộc đăng nhập tài khoản quản trị để bảo vệ dữ liệu. Vui lòng đăng nhập bằng Google bên dưới.
              </p>
            </div>
          </div>
          <CmsLogin
            currentUser={null}
            onUserChange={(user) => {
              setCurrentUser(user);
              if (user) setActiveTab('dashboard');
            }}
            onSelectTab={setActiveTab}
          />
        </div>
      </CmsLayout>
    );
  }

  // 3. Authenticated: Full access to CMS features
  return (
    <CmsLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      <CmsView activeTab={activeTab} onSelectTab={setActiveTab} />
    </CmsLayout>
  );
}
