import React from 'react';
import { UITranslation } from '../i18n';

interface FooterProps {
  t: UITranslation['footer'];
  fullName: string;
}

export const Footer: React.FC<FooterProps> = ({ t, fullName }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-gray-50 border-t border-gray-200 mt-16">
      <div className="container mx-auto max-w-[1200px] px-6 text-center text-xs text-gray-500 font-medium">
        © {currentYear} {fullName}. {t.allRightsReserved}. {t.hostedOn}.
      </div>
    </footer>
  );
};

export default Footer;
