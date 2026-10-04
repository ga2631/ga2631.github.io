'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { getCurrentUser, signOut, onAuthStateChange } from '@/services/authService';
import { isSupabaseConfigured } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export type CmsTab = 'dashboard' | 'posts' | 'categories' | 'tags' | 'cv' | 'login' | 'settings';

export const CMS_TAB_ROUTES: Record<CmsTab, string> = {
  dashboard: '/admin',
  posts: '/admin/blogs',
  categories: '/admin/categories',
  tags: '/admin/tags',
  cv: '/admin/cv',
  login: '/admin/login',
  settings: '/admin/login',
};

interface CmsLayoutProps {
  children: React.ReactNode;
  activeTab: CmsTab;
  onSelectTab: (tab: CmsTab) => void;
}

export function CmsLayout({ children, activeTab, onSelectTab }: CmsLayoutProps) {
  const { dict, getLocalizedHref } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured());
    getCurrentUser().then((user) => setCurrentUser(user));

    const unsubscribe = onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setCurrentUser(null);
    onSelectTab('login');
  };

  const handleTabClick = (tabId: CmsTab) => {
    if (!currentUser && tabId !== 'login') {
      onSelectTab('login');
      return;
    }
    onSelectTab(tabId);
  };

  const menuItems: { id: CmsTab; label: string; iconClass: string }[] = [
    { id: 'dashboard', label: 'Bảng Điều Khiển', iconClass: 'fa-solid fa-chart-pie' },
    { id: 'posts', label: 'Bài Viết', iconClass: 'fa-solid fa-file-lines' },
    { id: 'categories', label: 'Chuyên Mục', iconClass: 'fa-solid fa-folder' },
    { id: 'tags', label: 'Thẻ Tag', iconClass: 'fa-solid fa-tags' },
    { id: 'cv', label: 'Hồ Sơ CV', iconClass: 'fa-solid fa-id-card' },
    { id: 'login', label: currentUser ? 'Tài Khoản' : 'Đăng Nhập', iconClass: currentUser ? 'fa-solid fa-user-shield' : 'fa-solid fa-lock' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-gray-800 font-sans antialiased transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo & Connection Status */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center font-black text-white text-base shadow-md shadow-red-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-bolt text-sm"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-gray-900 group-hover:text-red-600 transition-colors">
                  CMS Studio
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  title={isConfigured ? 'Đã kết nối Supabase' : 'Chưa kết nối Supabase'}
                />
              </div>
              <div className="text-[10px] text-gray-400 font-mono hidden sm:block">
                {isConfigured ? 'Đã kết nối' : 'Chưa kết nối'}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Tabs (Horizontal Top Nav) */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1 rounded-2xl border border-gray-200/60">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'login' && activeTab === 'settings');
              const isLocked = !currentUser && item.id !== 'login';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  title={isLocked ? 'Cần đăng nhập để mở tab này' : item.label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${isActive
                    ? 'bg-white text-red-600 shadow-xs font-black'
                    : isLocked
                    ? 'text-gray-400 hover:text-gray-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 font-semibold'
                    }`}
                >
                  <i className={`${item.iconClass} text-xs`}></i>
                  <span>{item.label}</span>
                  {isLocked && <i className="fa-solid fa-lock text-[9px] text-gray-400 ml-0.5"></i>}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* View Site Link */}
            <Link
              href={getLocalizedHref('')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
              title="Xem Website"
            >
              <i className="fa-solid fa-globe text-xs"></i>
              <span className="hidden xl:inline">Xem Website</span>
            </Link>

            {/* User Profile / Auth Status Indicator */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200 text-xs">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-[11px]"
                  title={`Đã xác thực: ${currentUser.email || 'Admin'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="hidden sm:inline font-mono truncate max-w-[130px]">{currentUser.email || 'Admin'}</span>
                  <span className="sm:hidden font-bold">Admin</span>
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200 text-xs">
                <button
                  type="button"
                  onClick={() => onSelectTab('login')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-semibold text-[11px] transition-colors cursor-pointer"
                  title="Chưa đăng nhập. Bấm vào đây để tới trang đăng nhập"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Chưa đăng nhập</span>
                </button>
              </div>
            )}

            {/* Mobile Nav Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
              aria-label="Mở menu điều hướng"
            >
              {isMobileNavOpen ? (
                <i className="fa-solid fa-xmark text-sm"></i>
              ) : (
                <i className="fa-solid fa-bars text-sm"></i>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileNavOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md px-4 py-3 space-y-3 animate-in fade-in">
            <div className="grid grid-cols-2 gap-2">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id || (item.id === 'login' && activeTab === 'settings');
                const isLocked = !currentUser && item.id !== 'login';
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      handleTabClick(item.id);
                      setIsMobileNavOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${isActive
                      ? 'bg-red-50 text-red-600 border border-red-200 font-bold'
                      : isLocked
                      ? 'bg-gray-50/60 text-gray-400 font-medium'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <i className={`${item.iconClass} text-xs`}></i>
                      <span>{item.label}</span>
                    </div>
                    {isLocked && <i className="fa-solid fa-lock text-[10px] text-gray-400"></i>}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <Link
                href={getLocalizedHref('')}
                className="text-gray-600 font-medium hover:text-gray-900 flex items-center gap-1"
              >
                <i className="fa-solid fa-globe text-xs"></i>
                <span>Xem Website</span>
              </Link>
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-red-600 font-bold hover:underline"
                >
                  Đăng xuất ({currentUser.email || 'Admin'})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('login');
                    setIsMobileNavOpen(false);
                  }}
                  className="text-amber-700 font-bold hover:underline"
                >
                  Chưa đăng nhập (Đăng nhập ngay)
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main CMS Full Width Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
