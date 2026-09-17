import React from 'react';
import { UITranslation } from '../data/cvData.ts';

interface FooterProps {
  t: UITranslation['footer'];
}

export const Footer: React.FC<FooterProps> = ({ t }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          © {currentYear} Tan Huynh Nhat. All rights reserved. {t.hostedOn}.
        </div>
      </div>
    </footer>
  );
};
