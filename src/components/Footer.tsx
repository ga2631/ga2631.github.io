import React from 'react';
import { UITranslation } from '../i18n';

interface FooterProps {
  t: UITranslation['footer'];
  fullName: string;
}

export const Footer: React.FC<FooterProps> = ({ t, fullName }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-slate-100/60 border-t border-slate-200/80 mt-16 footer">
      <div className="container mx-auto max-w-[1200px] px-6 text-center text-xs text-slate-500 font-medium footer-content">
        © {currentYear} {fullName}. {t.allRightsReserved}. {t.hostedOn}.
      </div>
    </footer>
  );
};

export default Footer;
