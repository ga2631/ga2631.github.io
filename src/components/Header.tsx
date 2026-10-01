'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Drawer, DrawerHeader, DrawerItems } from 'flowbite-react';
import {
  MenuIcon,
  VietnamFlagIcon,
  UKFlagIcon,
  UserIcon,
  BriefcaseIcon,
  CodeIcon,
  SparklesIcon,
  GraduationCapIcon,
  MailIcon,
  BookOpenIcon,
  ChevronRightIcon,
  GithubIcon,
  LinkedinIcon,
  ZaloIcon,
  DownloadIcon,
} from './Icons';
import { UITranslation } from '../i18n';
import { PersonalInfo } from '../types';
import { getSecureZaloUrl } from '../utils/obfuscation';
import { trackNavigation, trackPrintCV } from '../utils/analytics';

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface HeaderProps {
  lang: 'vi' | 'en';
  setLang: (lang: 'vi' | 'en') => void;
  t: UITranslation;
  personalInfo: PersonalInfo;
  currentRoute?: 'home' | 'blog';
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  t,
  personalInfo,
  currentRoute = 'home',
}) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] =
    currentRoute === 'blog'
      ? [
          { label: t.nav.about, href: `/${lang}/#about` },
          { label: t.nav.experience, href: `/${lang}/#experience` },
          { label: t.nav.projects, href: `/${lang}/#projects` },
          { label: t.nav.skills, href: `/${lang}/#skills` },
          { label: t.nav.education, href: `/${lang}/#education` },
          { label: t.nav.contact, href: `/${lang}/#contact` },
          { label: t.nav.blog, href: `/${lang}/blog/`, isActive: true },
        ]
      : [
          { label: t.nav.about, href: '#about' },
          { label: t.nav.experience, href: '#experience' },
          { label: t.nav.projects, href: '#projects' },
          { label: t.nav.skills, href: '#skills' },
          { label: t.nav.education, href: '#education' },
          { label: t.nav.contact, href: '#contact' },
          { label: t.nav.blog, href: `/${lang}/blog/` },
        ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    trackNavigation(href, href, 'desktop_header');

    if (href.includes('/blog')) {
      router.push(`/${lang}/blog/`);
      return;
    }

    if (currentRoute === 'blog') {
      if (href.includes('#')) {
        const hash = href.substring(href.indexOf('#'));
        router.push(`/${lang}/${hash}`);
      } else {
        router.push(`/${lang}/`);
      }
      return;
    }

    if (href === `/${lang}/` || href === '#hero' || href === '#' || href === '#/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getItemIcon = (href: string) => {
    if (href.includes('about')) return <UserIcon size={18} />;
    if (href.includes('experience')) return <BriefcaseIcon size={18} />;
    if (href.includes('projects')) return <CodeIcon size={18} />;
    if (href.includes('skills')) return <SparklesIcon size={18} />;
    if (href.includes('education')) return <GraduationCapIcon size={18} />;
    if (href.includes('contact')) return <MailIcon size={18} />;
    if (href.includes('blog')) return <BookOpenIcon size={18} />;
    return <ChevronRightIcon size={18} />;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 h-[72px] bg-white/90 backdrop-blur-md border-b border-gray-200 z-[1100] transition-all duration-200 ${
          isScrolled ? 'shadow-xs bg-white/95' : ''
        }`}
      >
        <div className="container mx-auto max-w-[1200px] px-6 h-full flex items-center justify-between">
          <a
            href={`/${lang}/`}
            className="flex items-center gap-3 font-heading text-xl font-extrabold tracking-tight whitespace-nowrap select-none"
            onClick={(e) => {
              e.preventDefault();
              if (currentRoute === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                router.push(`/${lang}/`);
              }
            }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-extrabold text-base flex-shrink-0 bg-red-600">
              T
            </div>
            <span className="text-gray-900">{personalInfo.fullName}</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-gray-600 hover:text-red-600 text-sm font-medium transition-colors duration-150 ${
                  item.isActive ? '!text-red-600 font-semibold' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Desktop Language Switcher */}
            <Button
              color="light"
              size="xs"
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              aria-label="Toggle Language"
              className="h-9 px-2.5 font-semibold text-gray-700 hover:text-red-600 border-gray-300"
            >
              <span className="flex items-center gap-1.5 font-semibold">
                {lang === 'vi' ? <VietnamFlagIcon size={16} /> : <UKFlagIcon size={16} />}
                <span>{lang === 'vi' ? 'VI' : 'EN'}</span>
              </span>
            </Button>

            {/* Mobile Menu Trigger */}
            <Button
              color="light"
              size="xs"
              className="lg:hidden w-9 h-9 p-0 flex items-center justify-center border-gray-300"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Drawer Menu"
              aria-expanded={mobileMenuOpen}
            >
              <MenuIcon size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer Menu using Flowbite Drawer */}
      <Drawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} position="right" className="w-[min(350px,86vw)] p-0">
        <DrawerHeader
          title={personalInfo.fullName}
          titleIcon={() => (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-sm bg-red-600 mr-2">
              T
            </div>
          )}
          className="p-4 border-b border-gray-200"
        />
        <DrawerItems className="p-4 flex flex-col gap-5 overflow-y-auto flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 pl-1">
            {t.drawer.navigation}
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-gray-700 font-medium text-sm transition-all hover:text-red-600 hover:bg-gray-100 group ${
                  item.isActive ? '!text-red-600 bg-red-50 border border-red-200 font-semibold' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  trackNavigation(item.href, item.href, 'mobile_drawer');
                  handleNavClick(item.href);
                }}
              >
                <div className="text-red-600 flex-shrink-0 mt-0.5">{getItemIcon(item.href)}</div>
                <span className="flex-1">{item.label}</span>
                {item.href.includes('blog') && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                    {t.common.articlesBadge}
                  </span>
                )}
                <ChevronRightIcon size={16} className="text-gray-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </a>
            ))}
          </nav>

          {/* Preferences */}
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 pl-1">
            {t.drawer.preferences}
          </div>

          <div className="flex flex-col gap-3.5 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Button
              color="failure"
              size="sm"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                trackPrintCV('trigger_print');
                setTimeout(() => window.print(), 300);
              }}
            >
              <span className="flex items-center gap-2">
                <DownloadIcon size={16} />
                <span>{t.nav.saveCv} (PDF)</span>
              </span>
            </Button>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-600">
                {t.drawer.language}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  color={lang === 'vi' ? 'failure' : 'light'}
                  size="xs"
                  onClick={() => {
                    setLang('vi');
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    <VietnamFlagIcon size={16} />
                    <span>Tiếng Việt</span>
                  </span>
                </Button>
                <Button
                  color={lang === 'en' ? 'failure' : 'light'}
                  size="xs"
                  onClick={() => {
                    setLang('en');
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    <UKFlagIcon size={16} />
                    <span>English</span>
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Social Footer */}
          <div className="pt-4 border-t border-gray-200 flex flex-col gap-2.5 mt-auto">
            <div className="flex items-center gap-2">
              <Button
                as="a"
                href={personalInfo.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="light"
                size="xs"
                className="flex-1"
              >
                <span className="flex items-center gap-1.5">
                  <GithubIcon size={14} />
                  <span>GitHub</span>
                </span>
              </Button>
              {personalInfo.linkedinUrl && (
                <Button
                  as="a"
                  href={personalInfo.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="light"
                  size="xs"
                  className="flex-1"
                >
                  <span className="flex items-center gap-1.5">
                    <LinkedinIcon size={14} />
                    <span>LinkedIn</span>
                  </span>
                </Button>
              )}
              <Button
                as="a"
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  window.open(getSecureZaloUrl(), '_blank', 'noopener,noreferrer');
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.href = getSecureZaloUrl(); }}
                color="light"
                size="xs"
                className="flex-1"
              >
                <span className="flex items-center gap-1.5">
                  <ZaloIcon size={14} />
                  <span>Zalo</span>
                </span>
              </Button>
            </div>
            <div className="text-[0.72rem] text-gray-400 text-center">
              <span>{personalInfo.fullName} • {t.drawer.footerNote}</span>
            </div>
          </div>
        </DrawerItems>
      </Drawer>
    </>
  );
};

export default Header;
