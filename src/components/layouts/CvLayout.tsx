'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { trackNavigation } from '@/utils/analytics';

export function CvLayout({ children }: { children: React.ReactNode }) {
  const { currentLang, changeLanguage, getLocalizedHref, dict } = useLanguage();
  const isEn = currentLang === 'en';
  const [activeSection, setActiveSection] = useState<string>('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            if (currentId) {
              setActiveSection(currentId);
            }
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  // Auto-close menu on tablet/mobile when clicking outside, pressing ESC, or resizing to desktop
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (name: string, target: string) => {
    trackNavigation(name, target, 'desktop_header');
    setIsMobileMenuOpen(false);
  };

  const handleLanguageToggle = () => {
    const nextLang = isEn ? 'vi' : 'en';
    changeLanguage(nextLang);
  };

  const navLinks = [
    { id: 'about', label: dict.nav.about, href: '#about' },
    { id: 'experience', label: dict.nav.experience, href: '#experience' },
    { id: 'projects', label: dict.nav.projects, href: '#projects' },
    { id: 'skills', label: dict.nav.skills, href: '#skills' },
    { id: 'education', label: dict.nav.education, href: '#education' },
  ];

  return (
    <>
      {/* Mobile/Tablet Menu Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-30 lg:hidden transition-opacity duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* NAVBAR */}
      <nav
        ref={navRef}
        className="bg-white/80 backdrop-blur-md fixed w-full z-40 top-0 start-0 border-b border-gray-100 shadow-sm transition-all duration-300"
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            href={getLocalizedHref('')}
            className="flex items-center space-x-3 rtl:space-x-reverse group"
            onClick={() => handleNavClick('Brand', '/')}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-rose-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-red-500/30 group-hover:scale-105 transition-transform">
              T
            </div>
            <span className="self-center text-2xl font-bold whitespace-nowrap text-gray-900 tracking-tight">
              {dict.nav.brand}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
            aria-controls="navbar-sticky"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          {/* Navbar Links */}
          <div
            className={`items-center justify-between ${
              isMobileMenuOpen ? 'block' : 'hidden'
            } w-full lg:flex lg:w-auto lg:order-1`}
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 lg:p-0 mt-4 font-medium border border-gray-100 rounded-2xl bg-gray-50 lg:space-x-6 rtl:space-x-reverse lg:flex-row lg:mt-0 lg:border-0 lg:bg-transparent shadow-sm lg:shadow-none">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      onClick={() => handleNavClick(link.label, link.href)}
                      className={`nav-link block py-2 px-3 transition-colors lg:p-0 ${
                        isActive
                          ? 'text-red-600 font-bold'
                          : 'text-gray-700 hover:text-red-600'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}

              <li>
                <Link
                  href={getLocalizedHref('blog')}
                  onClick={() => handleNavClick('Blog', '/blog')}
                  className="block py-2 px-3 text-gray-700 hover:text-red-600 lg:p-0 transition-colors"
                >
                  {dict.nav.blog}
                </Link>
              </li>

              {/* Language Toggle in Tablet/Mobile Menu */}
              <li className="lg:hidden pt-3 mt-2 border-t border-gray-200/80 flex items-center justify-between px-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {dict.nav.language}
                </span>
                <div className="flex items-center space-x-2 bg-white border border-gray-200 px-2.5 py-1 rounded-full shadow-inner">
                  <span className={`text-xs font-bold ${!isEn ? 'text-gray-900' : 'text-gray-400'}`}>
                    VN
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEn}
                      onChange={handleLanguageToggle}
                      className="sr-only peer"
                      aria-label="Toggle language mobile"
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600 shadow-sm transition-colors" />
                  </label>
                  <span className={`text-xs ${isEn ? 'font-bold text-gray-900' : 'font-medium text-gray-400'}`}>
                    EN
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Desktop Language Toggle */}
          <div className="hidden lg:flex lg:order-2 items-center space-x-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full shadow-inner">
            <span className={`text-sm font-bold ${!isEn ? 'text-gray-900' : 'text-gray-400'}`}>
              VN
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEn}
                onChange={handleLanguageToggle}
                className="sr-only peer"
                aria-label="Toggle language"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 shadow-sm transition-colors" />
            </label>
            <span className={`text-sm ${isEn ? 'font-bold text-gray-900' : 'font-medium text-gray-400'}`}>
              EN
            </span>
          </div>
        </div>
      </nav>

      {/* Main container */}
      <main className="max-w-screen-xl mx-auto w-full p-4 pt-28 flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="w-full mt-auto relative z-10 bg-transparent">
        <div className="mx-auto max-w-screen-xl p-6 text-center">
          <span className="text-sm text-gray-400">
            {dict.footer.copyright}
          </span>
        </div>
      </footer>
    </>
  );
}
