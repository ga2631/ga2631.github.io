'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageSwitcher } from '../navigation/LanguageSwitcher';
import { ThemeToggle } from '../navigation/ThemeToggle';
import { trackNavigation } from '@/utils/analytics';

export function BlogLayout({ children }: { children: React.ReactNode }) {
  const { dict, getLocalizedHref } = useLanguage();

  const handleNavClick = (name: string, target: string) => {
    trackNavigation(name, target, 'desktop_header');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 transition-colors duration-200">
      {/* Blog Dedicated Header */}
      <header className="sticky top-0 z-40 w-full glass-header backdrop-blur-md border-b border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-4">
            <Link
              href={getLocalizedHref('blog')}
              className="flex items-center gap-2.5 group"
              onClick={() => handleNavClick('BlogHome', '/blog')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-bold text-white text-base shadow-md group-hover:scale-105 transition-transform">
                ✍️
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                  Engineering Blog
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                  Architecture & High Load Logbook
                </div>
              </div>
            </Link>

            {/* Back to CV Link */}
            <Link
              href={getLocalizedHref('')}
              onClick={() => handleNavClick('BackToCV', '/')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-900/60 hover:bg-gray-800 border border-gray-700/60 rounded-lg transition-colors ml-4"
            >
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{dict.blog.backToHome}</span>
            </Link>
          </div>

          {/* Right actions: CMS Link, Lang Switcher, Theme Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href={getLocalizedHref('admin')}
              onClick={() => handleNavClick('CMS', '/admin')}
              className="px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 rounded-lg transition-colors flex items-center gap-1"
              title="CMS Admin"
            >
              <span>⚡</span>
              <span className="hidden sm:inline">CMS</span>
            </Link>

            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Blog Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Blog Footer */}
      <footer className="border-t border-gray-800/80 bg-gray-950/80 py-8 mt-12 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-gray-300">{dict.blog.title}</span>
            <span className="mx-2">•</span>
            <span>Huỳnh Nhật Tân</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href={getLocalizedHref('')} className="hover:text-indigo-400 transition-colors">
              {dict.nav.cv}
            </Link>
            <Link href={getLocalizedHref('admin')} className="hover:text-indigo-400 transition-colors">
              {dict.nav.cms}
            </Link>
            <a
              href="https://github.com/ga2631"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
