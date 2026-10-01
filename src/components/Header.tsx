import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MenuIcon, VietnamFlagIcon, UKFlagIcon } from './Icons';
import { UITranslation } from '../i18n';
import { PersonalInfo } from '../types';
import { DrawerMenu, NavItem } from './composite';
import { Button } from './common';
import { trackNavigation } from '../utils/analytics';

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

  const handlePrint = () => {
    window.print();
  };

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

    // If navigating to Blog page
    if (href.includes('/blog')) {
      router.push(`/${lang}/blog/`);
      return;
    }

    // If on blog page and navigating to Home or section in Home
    if (currentRoute === 'blog') {
      if (href.includes('#')) {
        const hash = href.substring(href.indexOf('#'));
        router.push(`/${lang}/${hash}`);
      } else {
        router.push(`/${lang}/`);
      }
      return;
    }

    // If on home page and clicking Home / Top
    if (href === `/${lang}/` || href === '#hero' || href === '#' || href === '#/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If on home page, scroll directly to section
    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
            {/* Desktop Language Switcher Toggle */}
            <Button
              variant="unstyled"
              className="h-9 min-w-[60px] px-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-200 inline-flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-gray-200 hover:text-red-600 transition-all cursor-pointer focus:ring-2 focus:ring-gray-300"
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              aria-label="Toggle Language"
              icon={lang === 'vi' ? <VietnamFlagIcon size={16} /> : <UKFlagIcon size={16} />}
            >
              <span>{lang === 'vi' ? 'VI' : 'EN'}</span>
            </Button>

            {/* Mobile & Tablet Drawer Trigger Button */}
            <Button
              variant="unstyled"
              className="lg:hidden w-9 h-9 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-800 hover:bg-gray-200 hover:text-red-600 transition-all cursor-pointer focus:ring-2 focus:ring-gray-300"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Drawer Menu"
              aria-expanded={mobileMenuOpen}
              icon={<MenuIcon size={20} />}
            />
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Slide-in Drawer Menu */}
      <DrawerMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        onNavClick={handleNavClick}
        lang={lang}
        setLang={setLang}
        tNav={t.nav}
        tDrawer={t.drawer}
        tCommon={t.common}
        personalInfo={personalInfo}
        onPrint={handlePrint}
      />
    </>
  );
};

export default Header;
