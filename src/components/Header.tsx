import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, MenuIcon, VietnamFlagIcon, UKFlagIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { PersonalInfo } from '../types/index.ts';
import { DrawerMenu, NavItem } from './DrawerMenu.tsx';
import { Button } from './common';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  lang: 'vi' | 'en';
  setLang: (lang: 'vi' | 'en') => void;
  t: UITranslation;
  personalInfo: PersonalInfo;
  currentRoute?: 'home' | 'blog';
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  lang,
  setLang,
  t,
  personalInfo,
  currentRoute = 'home',
}) => {
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
          { label: t.nav.about, href: '#about' },
          { label: t.nav.experience, href: '#experience' },
          { label: t.nav.projects, href: '#projects' },
          { label: t.nav.skills, href: '#skills' },
          { label: t.nav.education, href: '#education' },
          { label: t.nav.blog, href: '#/blog', isActive: true },
        ]
      : [
          { label: t.nav.about, href: '#about' },
          { label: t.nav.experience, href: '#experience' },
          { label: t.nav.projects, href: '#projects' },
          { label: t.nav.skills, href: '#skills' },
          { label: t.nav.education, href: '#education' },
          { label: t.nav.contact, href: '#contact' },
          { label: t.nav.blog, href: '#/blog' },
        ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);

    // Navigate to Blog Page
    if (href === '#/blog' || href.startsWith('#/blog')) {
      window.location.hash = '#/blog';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Navigate to Home / Top
    if (href === '#/' || href === '#hero' || href === '#') {
      if (currentRoute === 'blog') {
        window.location.hash = '#/';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If on blog page and navigating to a home section (#about, #experience, etc.)
    if (currentRoute === 'blog' && href.startsWith('#')) {
      window.location.hash = '#/';
      setTimeout(() => {
        const targetId = href.replace('#', '');
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
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
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          <a
            href="#/"
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#/');
            }}
          >
            <div className="logo-badge">T</div>
            <span className="logo-text">{personalInfo.fullName}</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="nav-links desktop-nav">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link ${item.isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            {/* Desktop Language Switcher Toggle */}
            <Button
              variant="unstyled"
              className="lang-toggle-btn header-lang-btn"
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              title={lang === 'vi' ? 'English' : 'Tiếng Việt'}
              aria-label="Toggle Language"
              icon={lang === 'vi' ? <VietnamFlagIcon size={16} /> : <UKFlagIcon size={16} />}
            >
              <span>{lang === 'vi' ? 'VI' : 'EN'}</span>
            </Button>

            {/* Theme Toggle Button */}
            <Button
              variant="unstyled"
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label="Toggle Theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              icon={theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            />

            {/* Mobile & Tablet Drawer Trigger Button */}
            <Button
              variant="unstyled"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Drawer Menu"
              aria-expanded={mobileMenuOpen}
              icon={<MenuIcon size={22} />}
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
        theme={theme}
        toggleTheme={toggleTheme}
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


