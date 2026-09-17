import React from 'react';
import { GithubIcon } from './Icons.tsx';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          © {currentYear} Tan Huynh Nhat. All rights reserved. Hosted on GitHub Pages.
        </div>
      </div>
    </footer>
  );
};
