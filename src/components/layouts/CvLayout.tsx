'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { trackNavigation } from '@/utils/analytics';

export function CvLayout({ children }: { children: React.ReactNode }) {
  const { currentLang, changeLanguage, getLocalizedHref } = useLanguage();
  const isEn = currentLang === 'en';
  const [activeSection, setActiveSection] = useState<string>('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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

  const handleNavClick = (name: string, target: string) => {
    trackNavigation(name, target, 'desktop_header');
    setIsMobileMenuOpen(false);
  };

  const handleLanguageToggle = () => {
    const nextLang = isEn ? 'vi' : 'en';
    changeLanguage(nextLang);
  };

  const navLinks = [
    { id: 'about', label: isEn ? 'About' : 'Năng lực', href: '#about' },
    { id: 'experience', label: isEn ? 'Experience' : 'Kinh nghiệm', href: '#experience' },
    { id: 'projects', label: isEn ? 'Projects' : 'Dự án', href: '#projects' },
    { id: 'skills', label: isEn ? 'Skills' : 'Kỹ năng', href: '#skills' },
    { id: 'education', label: isEn ? 'Education' : 'Học vấn', href: '#education' },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-40 top-0 start-0 border-b border-gray-100 shadow-sm transition-all duration-300">
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
              Huỳnh Nhật Tân
            </span>
          </Link>

          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
            } w-full md:flex md:w-auto md:order-1`}
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-6 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      onClick={() => handleNavClick(link.label, link.href)}
                      className={`nav-link block py-2 px-3 transition-colors md:p-0 ${
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
                  className="block py-2 px-3 text-gray-700 hover:text-red-600 md:p-0 transition-colors"
                >
                  Blog
                </Link>
              </li>

              <li>
                <Link
                  href={getLocalizedHref('admin')}
                  onClick={() => handleNavClick('CMS', '/admin')}
                  className="block py-2 px-3 text-gray-400 hover:text-red-600 md:p-0 transition-colors"
                  title="CMS Admin"
                >
                  CMS
                </Link>
              </li>
            </ul>
          </div>

          {/* Language Toggle */}
          <div className="hidden md:flex md:order-2 items-center space-x-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full shadow-inner">
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
            © 2026{' '}
            <a href="#" className="hover:text-red-600 transition-colors">
              Huỳnh Nhật Tân
            </a>
            . All Rights Reserved. Hosted on GitHub Pages.
          </span>
        </div>
      </footer>
    </>
  );
}
