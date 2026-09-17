import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, DownloadIcon, MenuIcon, CloseIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  lang: 'vi' | 'en';
  setLang: (lang: 'vi' | 'en') => void;
  t: UITranslation['nav'];
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, lang, setLang, t }) => {
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

  const navItems = [
    { label: t.about, href: '#about' },
    { label: t.experience, href: '#experience' },
    { label: t.projects, href: '#projects' },
    { label: t.skills, href: '#skills' },
    { label: t.education, href: '#education' },
    { label: t.blog, href: '#blog' },
    { label: t.contact, href: '#contact' },
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <a href="#hero" className="logo">
          <div className="logo-badge">TN</div>
          <span>Tan Huynh Nhat</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          {/* Language Switcher */}
          <div className="lang-toggle-group" role="group" aria-label="Language Selector">
            <button
              className={`lang-btn ${lang === 'vi' ? 'active' : ''}`}
              onClick={() => setLang('vi')}
              title="Tiếng Việt"
              aria-pressed={lang === 'vi'}
            >
              <span>🇻🇳</span>
              <span>VI</span>
            </button>
            <button
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
              title="English"
              aria-pressed={lang === 'en'}
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          {/* Save CV Button */}
          <button
            onClick={handlePrint}
            className="btn btn-secondary btn-sm"
            title="Save / Export Clean CV as PDF"
            id="print-cv-btn"
          >
            <DownloadIcon size={16} />
            <span>{t.saveCv}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
