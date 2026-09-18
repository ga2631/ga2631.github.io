import React from 'react';
import { UITranslation } from '../data/cvData.ts';

interface FooterProps {
  t: UITranslation['footer'];
  fullName: string;
}

export const Footer: React.FC<FooterProps> = ({ t, fullName }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          © {currentYear} {fullName}. {t.allRightsReserved}. {t.hostedOn}.
        </div>
      </div>
    </footer>
  );
};

