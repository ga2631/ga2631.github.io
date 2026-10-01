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
} from '../Icons';
import { UITranslation } from '@/i18n';
import { PersonalInfo } from '../../types';
import { getSecureZaloUrl } from '../../utils/obfuscation';
import { ButtonPrint } from './ButtonPrint';
import { trackNavigation } from '../../utils/analytics';

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
      className={`fixed inset-0 z-[1200] transition-all duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-label="Close navigation drawer"
      />

      {/* Slide-in Panel */}
      <aside
        className={`absolute top-0 right-0 bottom-0 w-[min(350px,86vw)] bg-white border-s border-gray-200 shadow-xl flex flex-col transition-transform duration-300 ease-out overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-extrabold text-base flex-shrink-0 bg-red-600">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-base font-extrabold text-gray-900 leading-tight">
                {personalInfo.fullName}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {personalInfo.jobTitle.split('|')[0].trim()}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer transition-colors"
            onClick={onClose}
            aria-label="Close drawer menu"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Drawer Body - Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 pl-1">
            {tDrawer.navigation}
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
                  onNavClick(item.href);
                }}
              >
                <div className="text-red-600 flex-shrink-0 mt-0.5">{getItemIcon(item.href)}</div>
                <span className="flex-1">{item.label}</span>
                {item.href.includes('blog') && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                    {tCommon.articlesBadge}
                  </span>
                )}
                <ChevronRightIcon size={16} className="text-gray-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </a>
            ))}
          </nav>

          {/* Quick Actions in Drawer */}
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 pl-1">
            {tDrawer.preferences}
          </div>

          <div className="flex flex-col gap-3.5 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            {/* Save CV PDF button */}
            <ButtonPrint
              variant="default"
              buttonVariant="primary"
              className="w-full h-10 inline-flex items-center justify-center gap-2 px-4 text-sm font-semibold rounded-lg"
              label={`${tNav.saveCv} (PDF)`}
              onPrint={() => {
                onClose();
                setTimeout(() => onPrint(), 300);
              }}
            />

            {/* Language Selection Buttons */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-600">
                {tDrawer.language}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className={`h-9 w-full inline-flex items-center justify-center gap-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    lang === 'vi'
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-red-600'
                  }`}
                  onClick={() => {
                    setLang('vi');
                    onClose();
                  }}
                >
                  <VietnamFlagIcon size={16} />
                  <span>Tiếng Việt</span>
                </button>
                <button
                  className={`h-9 w-full inline-flex items-center justify-center gap-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    lang === 'en'
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-red-600'
                  }`}
                  onClick={() => {
                    setLang('en');
                    onClose();
                  }}
                >
                  <UKFlagIcon size={16} />
                  <span>English</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-200 flex flex-col gap-2.5 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <a
              href={personalInfo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-9 inline-flex items-center justify-center gap-2 px-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-100 hover:text-red-600 transition-all"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={16} />
              <span>GitHub</span>
            </a>
            {personalInfo.linkedinUrl && (
              <a
                href={personalInfo.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-9 inline-flex items-center justify-center gap-2 px-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-100 hover:text-red-600 transition-all"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon size={16} />
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
              className="flex-1 h-9 inline-flex items-center justify-center gap-2 px-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-100 hover:text-red-600 transition-all"
              aria-label="Zalo Profile"
            >
              <ZaloIcon size={16} />
              <span>Zalo</span>
            </a>
          </div>
          <div className="text-[0.72rem] text-gray-400 text-center">
            <span>{personalInfo.fullName} • {tDrawer.footerNote}</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DrawerMenu;
