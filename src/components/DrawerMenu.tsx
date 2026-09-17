import React, { useEffect } from 'react';
import {
  CloseIcon,
  DownloadIcon,
  SunIcon,
  MoonIcon,
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
} from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  onNavClick: (href: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  lang: 'vi' | 'en';
  setLang: (lang: 'vi' | 'en') => void;
  tNav: UITranslation['nav'];
  onPrint: () => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  onNavClick,
  theme,
  toggleTheme,
  lang,
  setLang,
  tNav,
  onPrint,
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    <div
      className={`drawer-wrapper ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="drawer-backdrop"
        onClick={onClose}
        aria-label="Close navigation drawer"
      />

      {/* Slide-in Panel */}
      <aside className="drawer-panel">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-brand">
            <div className="logo-badge">TN</div>
            <div className="drawer-brand-text">
              <span className="drawer-brand-name">Tan Huynh Nhat</span>
              <span className="drawer-brand-sub">Senior Software Engineer</span>
            </div>
          </div>
          <button
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close drawer menu"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Drawer Body - Navigation Links */}
        <div className="drawer-body">
          <div className="drawer-section-title">
            {lang === 'vi' ? 'ĐIỀU HƯỚNG' : 'NAVIGATION'}
          </div>
          <nav className="drawer-nav-list">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`drawer-nav-item ${item.isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(item.href);
                }}
              >
                <div className="drawer-nav-icon">{getItemIcon(item.href)}</div>
                <span className="drawer-nav-label">{item.label}</span>
                {item.href.includes('blog') && (
                  <span className="badge badge-cyan drawer-badge">Articles</span>
                )}
                <ChevronRightIcon size={16} className="drawer-nav-arrow" />
              </a>
            ))}
          </nav>

          {/* Quick Actions in Drawer */}
          <div className="drawer-section-title">
            {lang === 'vi' ? 'TÙY CHỌN & TIỆN ÍCH' : 'PREFERENCES & ACTIONS'}
          </div>

          <div className="drawer-actions-card">
            {/* Save CV PDF button */}
            <button
              onClick={() => {
                onClose();
                setTimeout(() => onPrint(), 300);
              }}
              className="btn btn-primary drawer-cv-btn"
            >
              <DownloadIcon size={18} />
              <span>{tNav.saveCv} (PDF)</span>
            </button>

            {/* Language Selection Buttons */}
            <div className="drawer-lang-selector">
              <span className="drawer-label-text">
                {lang === 'vi' ? 'Ngôn ngữ:' : 'Language:'}
              </span>
              <div className="drawer-lang-pills">
                <button
                  className={`drawer-lang-pill ${lang === 'vi' ? 'active' : ''}`}
                  onClick={() => setLang('vi')}
                >
                  <span>🇻🇳 Tiếng Việt</span>
                </button>
                <button
                  className={`drawer-lang-pill ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => setLang('en')}
                >
                  <span>🇬🇧 English</span>
                </button>
              </div>
            </div>

            {/* Theme Mode Toggle */}
            <div className="drawer-theme-selector">
              <span className="drawer-label-text">
                {lang === 'vi' ? 'Giao diện:' : 'Theme Mode:'}
              </span>
              <button
                className="drawer-theme-toggle-btn"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? (
                  <>
                    <SunIcon size={18} />
                    <span>{lang === 'vi' ? 'Chuyển sang Giao diện Sáng' : 'Switch to Light Mode'}</span>
                  </>
                ) : (
                  <>
                    <MoonIcon size={18} />
                    <span>{lang === 'vi' ? 'Chuyển sang Giao diện Tối' : 'Switch to Dark Mode'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div className="drawer-social-links">
            <a
              href="https://github.com/ga2631"
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-social-btn"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={18} />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/tan-huynh-nhat/"
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-social-btn"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon size={18} />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://zalo.me/0963684520"
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-social-btn"
              aria-label="Zalo Profile"
            >
              <ZaloIcon size={18} />
              <span>Zalo</span>
            </a>
          </div>
          <div className="drawer-footer-note">
            <span>Tan Huynh Nhat • Engineering Portfolio</span>
          </div>
        </div>
      </aside>
    </div>
  );
};
