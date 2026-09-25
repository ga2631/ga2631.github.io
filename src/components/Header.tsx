import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MenuIcon, VietnamFlagIcon, UKFlagIcon } from './Icons';
import { UITranslation } from '../data/cvData';
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
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          <a
            href={`/${lang}/`}
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              if (currentRoute === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                router.push(`/${lang}/`);
              }
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
              title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              aria-label="Toggle Language"
              icon={lang === 'vi' ? <VietnamFlagIcon size={16} /> : <UKFlagIcon size={16} />}
            >
              <span>{lang === 'vi' ? 'VI' : 'EN'}</span>
            </Button>

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
