import React from 'react';
import { Drawer, DrawerHeader, DrawerItems, Button } from 'flowbite-react';
import {
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
    <Drawer open={isOpen} onClose={onClose} position="right" className="w-[min(350px,86vw)] p-0">
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

        {/* Preferences / Quick actions */}
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 pl-1">
          {tDrawer.preferences}
        </div>

        <div className="flex flex-col gap-3.5 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          {/* Save CV PDF button */}
          <ButtonPrint
            label={`${tNav.saveCv} (PDF)`}
            className="w-full justify-center"
            size="sm"
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
              <Button
                color={lang === 'vi' ? 'failure' : 'light'}
                size="xs"
                onClick={() => {
                  setLang('vi');
                  onClose();
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
                  onClose();
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

        {/* Drawer Social Links Footer */}
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
            <span>{personalInfo.fullName} • {tDrawer.footerNote}</span>
          </div>
        </div>
      </DrawerItems>
    </Drawer>
  );
};

export default DrawerMenu;
