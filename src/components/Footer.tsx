import React from 'react';
import { Footer as FlowbiteFooter } from 'flowbite-react';
import { UITranslation } from '../i18n';

interface FooterProps {
  t: UITranslation['footer'];
  fullName: string;
}

export const Footer: React.FC<FooterProps> = ({ t, fullName }) => {
  const currentYear = new Date().getFullYear();

  return (
    <FlowbiteFooter container className="bg-gray-50 border-t border-gray-200 mt-16 rounded-none shadow-none py-8">
      <div className="container mx-auto max-w-[1200px] px-6 text-center text-xs text-gray-500 font-medium">
        © {currentYear} {fullName}. {t.allRightsReserved}. {t.hostedOn}.
      </div>
    </FlowbiteFooter>
  );
};

export default Footer;
