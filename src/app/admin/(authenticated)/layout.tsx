'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CmsLayout, CmsTab, CMS_TAB_ROUTES } from '@/components/layouts/CmsLayout';
import { CmsProvider } from '@/views/Cms';
import { getCurrentUser, onAuthStateChange } from '@/services/authService';
import { User } from '@supabase/supabase-js';

function getActiveTabFromPath(pathname: string): CmsTab {
  if (pathname.includes('/admin/blogs')) return 'posts';
  if (pathname.includes('/admin/categories')) return 'categories';
  if (pathname.includes('/admin/tags')) return 'tags';
  if (pathname.includes('/admin/cv')) return 'cv';
  if (pathname.includes('/admin/login')) return 'login';
  return 'dashboard';
}

export default function AuthenticatedCmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((user) => {
        if (!isMounted) return;
        if (!user) {
          router.replace('/admin/login');
        } else {
          setCurrentUser(user);
          setIsCheckingAuth(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          router.replace('/admin/login');
        }
      });

    const unsubscribe = onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      const user = session?.user || null;
      if (!user) {
        router.replace('/admin/login');
      } else {
        setCurrentUser(user);
        setIsCheckingAuth(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [router]);

  // Loading state: screen shown while verifying admin session
  if (isCheckingAuth || !currentUser) {
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
            <p className="text-xs text-gray-500">Đang kiểm tra quyền quản trị viên...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeTab = getActiveTabFromPath(pathname || '');

  const handleSelectTab = (tab: CmsTab) => {
    const targetRoute = CMS_TAB_ROUTES[tab] || '/admin';
    router.push(targetRoute);
  };

  return (
    <CmsProvider>
      <CmsLayout activeTab={activeTab} onSelectTab={handleSelectTab}>
        {children}
      </CmsLayout>
    </CmsProvider>
  );
}
