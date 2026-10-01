'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageSwitcher } from '../navigation/LanguageSwitcher';
import { ThemeToggle } from '../navigation/ThemeToggle';
import { getCurrentUser, signOut, onAuthStateChange } from '@/services/authService';
import { isSupabaseConfigured } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export type CmsTab = 'dashboard' | 'posts' | 'categories' | 'tags' | 'cv' | 'settings';

interface CmsLayoutProps {
  children: React.ReactNode;
  activeTab: CmsTab;
  onSelectTab: (tab: CmsTab) => void;
}

export function CmsLayout({ children, activeTab, onSelectTab }: CmsLayoutProps) {
  const { dict, getLocalizedHref } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
  };

  const menuItems: { id: CmsTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: dict.cms.dashboard, icon: '📊' },
    { id: 'posts', label: dict.cms.posts, icon: '📝' },
    { id: 'categories', label: dict.cms.categories, icon: '📁' },
    { id: 'tags', label: dict.cms.tags, icon: '🏷️' },
    { id: 'cv', label: dict.cms.cvEditor, icon: '📄' },
    { id: 'settings', label: dict.cms.settings, icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-100 transition-colors duration-200">
      {/* CMS Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 transform transition-transform duration-200 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-sm shadow">
                ⚡
              </div>
              <div className="font-bold text-sm tracking-tight text-white">
                CMS Studio
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Connection Status Badge */}
          <div className="px-6 py-3 border-b border-gray-800/60">
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-gray-400 font-mono text-[11px]">
                {isConfigured ? dict.cms.connected : dict.cms.disconnected}
              </span>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30 shadow-sm'
                      : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          {currentUser ? (
            <div className="bg-gray-800/60 p-2.5 rounded-xl border border-gray-700/60 text-xs">
              <div className="text-gray-400 text-[10px] uppercase font-mono">Đã đăng nhập</div>
              <div className="font-medium text-white truncate">{currentUser.email}</div>
              <button
                onClick={handleSignOut}
                className="mt-2 w-full px-2 py-1 text-[11px] bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors font-medium text-center"
              >
                {dict.cms.signOut}
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-gray-500 text-center">
              Chế độ quản trị viên Supabase
            </div>
          )}

          <Link
            href={getLocalizedHref('')}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
          >
            <span>🌐</span>
            <span>{dict.cms.viewSite}</span>
          </Link>
        </div>
      </aside>

      {/* Main CMS Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* CMS Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white"
            >
              ☰
            </button>
            <h1 className="text-base font-bold text-white capitalize">
              {menuItems.find((m) => m.id === activeTab)?.label || 'CMS Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        {/* CMS Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
