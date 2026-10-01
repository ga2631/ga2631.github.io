'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageSwitcher } from '../navigation/LanguageSwitcher';
import { ThemeToggle } from '../navigation/ThemeToggle';
import { trackNavigation, trackPrintCV, trackScrollToTop } from '@/utils/analytics';

export function CvLayout({ children }: { children: React.ReactNode }) {
  const { dict, currentLang, getLocalizedHref } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (name: string, target: string) => {
    trackNavigation(name, target, 'desktop_header');
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackScrollToTop();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 transition-colors duration-200">
      {/* CV Sticky Header */}
      <header className="sticky top-0 z-40 w-full glass-header backdrop-blur-md border-b border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link
            href={getLocalizedHref('')}
            className="flex items-center gap-2.5 group"
            onClick={() => handleNavClick('Brand', '/')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center font-black text-white text-base shadow-md group-hover:scale-105 transition-transform">
              T
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
                Huỳnh Nhật Tân
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                Software Architect
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <a
              href="#about"
              onClick={() => handleNavClick('About', '#about')}
              className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors"
            >
              {dict.nav.about}
            </a>
            <a
              href="#experience"
              onClick={() => handleNavClick('Experience', '#experience')}
              className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors"
            >
              {dict.nav.experience}
            </a>
            <a
              href="#projects"
              onClick={() => handleNavClick('Projects', '#projects')}
              className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors"
            >
              {dict.nav.projects}
            </a>
            <a
              href="#skills"
              onClick={() => handleNavClick('Skills', '#skills')}
              className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors"
            >
              {dict.nav.skills}
            </a>
            <a
              href="#contact"
              onClick={() => handleNavClick('Contact', '#contact')}
              className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors"
            >
              {dict.nav.contact}
            </a>

            <div className="w-[1px] h-4 bg-gray-800 mx-1.5" />

            {/* Link to Tech Blog View */}
            <Link
              href={getLocalizedHref('blog')}
              onClick={() => handleNavClick('Blog', '/blog')}
              className="px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>📰</span>
              <span>{dict.nav.blog}</span>
            </Link>

            {/* Link to CMS Admin View */}
            <Link
              href={getLocalizedHref('admin')}
              onClick={() => handleNavClick('CMS', '/admin')}
              className="px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 rounded-lg transition-colors flex items-center gap-1"
              title="CMS Admin Panel"
            >
              <span>⚡</span>
              <span>CMS</span>
            </Link>
          </nav>

          {/* Right Action Tools: Language, Theme, Print */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                trackPrintCV('trigger_print');
                window.print();
              }}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-900/80 hover:bg-gray-800 border border-gray-700/60 rounded-lg transition-colors shadow-sm"
              title={dict.nav.printCv}
            >
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              <span>PDF</span>
            </button>

            <LanguageSwitcher />
            <ThemeToggle />

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-800/80 text-gray-300 hover:text-white border border-gray-700"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-950/95 px-4 pt-3 pb-4 space-y-2">
            <a
              href="#about"
              onClick={() => handleNavClick('About', '#about')}
              className="block px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-lg"
            >
              {dict.nav.about}
            </a>
            <a
              href="#experience"
              onClick={() => handleNavClick('Experience', '#experience')}
              className="block px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-lg"
            >
              {dict.nav.experience}
            </a>
            <a
              href="#projects"
              onClick={() => handleNavClick('Projects', '#projects')}
              className="block px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-lg"
            >
              {dict.nav.projects}
            </a>
            <a
              href="#skills"
              onClick={() => handleNavClick('Skills', '#skills')}
              className="block px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-lg"
            >
              {dict.nav.skills}
            </a>
            <a
              href="#contact"
              onClick={() => handleNavClick('Contact', '#contact')}
              className="block px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-lg"
            >
              {dict.nav.contact}
            </a>
            <div className="pt-2 border-t border-gray-800 flex flex-col gap-2">
              <Link
                href={getLocalizedHref('blog')}
                onClick={() => handleNavClick('Blog', '/blog')}
                className="px-3 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg flex items-center gap-2"
              >
                <span>📰</span>
                <span>{dict.nav.blog}</span>
              </Link>
              <Link
                href={getLocalizedHref('admin')}
                onClick={() => handleNavClick('CMS', '/admin')}
                className="px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 rounded-lg flex items-center gap-2"
              >
                <span>⚡</span>
                <span>{dict.nav.cms}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* CV Footer */}
      <footer className="border-t border-gray-800/80 bg-gray-950/80 py-8 mt-12 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-200">Huỳnh Nhật Tân</span>
            <span>•</span>
            <span>Executive Portfolio & ATS CV</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-gray-500">v1.0 (Next.js 16)</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href={getLocalizedHref('blog')} className="hover:text-red-400 transition-colors">
              {dict.nav.blog}
            </Link>
            <Link href={getLocalizedHref('admin')} className="hover:text-red-400 transition-colors">
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

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg z-30 transition-all hover:scale-110 focus:outline-none"
          title="Scroll to Top"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
