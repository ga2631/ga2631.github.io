import React, { useEffect } from 'react';
import {
  CloseIcon,
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
  VietnamFlagIcon,
  UKFlagIcon,
} from '../Icons.tsx';
import { UITranslation } from '../../data/cvData.ts';
import { PersonalInfo } from '../../types/index.ts';
import { getSecureZaloUrl } from '../../utils/obfuscation.tsx';
import { ButtonPrint } from './ButtonPrint.tsx';

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
  lang: 'vi' | 'en';
  setLang: (lang: 'vi' | 'en') => void;
  tNav: UITranslation['nav'];
  tDrawer: UITranslation['drawer'];
  tCommon: UITranslation['common'];
  personalInfo: PersonalInfo;
  onPrint: () => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  onNavClick,
  lang,
  setLang,
  tNav,
  tDrawer,
  tCommon,
  personalInfo,
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
            <div className="logo-badge">T</div>
            <div className="drawer-brand-text">
              <span className="drawer-brand-name">{personalInfo.fullName}</span>
              <span className="drawer-brand-sub">{personalInfo.jobTitle.split('|')[0].trim()}</span>
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
            {tDrawer.navigation}
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
                  <span className="badge badge-cyan drawer-badge">{tCommon.articlesBadge}</span>
                )}
                <ChevronRightIcon size={16} className="drawer-nav-arrow" />
              </a>
            ))}
          </nav>

          {/* Quick Actions in Drawer */}
          <div className="drawer-section-title">
            {tDrawer.preferences}
          </div>

          <div className="drawer-actions-card">
            {/* Save CV PDF button */}
            <ButtonPrint
              variant="default"
              buttonVariant="primary"
              className="drawer-cv-btn"
              label={`${tNav.saveCv} (PDF)`}
              onPrint={() => {
                onClose();
                setTimeout(() => onPrint(), 300);
              }}
            />

            {/* Language Selection Buttons */}
            <div className="drawer-lang-selector">
              <span className="drawer-label-text">
                {tDrawer.language}
              </span>
              <div className="drawer-lang-pills">
                <button
                  className={`drawer-lang-pill ${lang === 'vi' ? 'active' : ''}`}
                  onClick={() => setLang('vi')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <VietnamFlagIcon size={18} />
                  <span>Tiếng Việt</span>
                </button>
                <button
                  className={`drawer-lang-pill ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => setLang('en')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <UKFlagIcon size={18} />
                  <span>English</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div className="drawer-social-links">
            <a
              href={personalInfo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-social-btn"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={18} />
              <span>GitHub</span>
            </a>
            {personalInfo.linkedinUrl && (
              <a
                href={personalInfo.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-social-btn"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon size={18} />
                <span>LinkedIn</span>
              </a>
            )}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.open(getSecureZaloUrl(), '_blank', 'noopener,noreferrer');
              }}
              onMouseEnter={(e) => { e.currentTarget.href = getSecureZaloUrl(); }}
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
            <span>{personalInfo.fullName} • {tDrawer.footerNote}</span>
          </div>
        </div>
      </aside>
    </div>
  );
};
