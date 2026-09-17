import React from 'react';
import { GithubIcon } from './Icons.tsx';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>
            Tan Huynh Nhat (ga2631)
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Senior Software Engineer • Building reliable and scalable web systems.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.78rem' }}>
            React 19 + TypeScript + Docker + CI/CD
          </span>

          <a
            href="https://github.com/ga2631/ga2631.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 12px' }}
          >
            <GithubIcon size={14} />
            <span>GitHub Repository</span>
          </a>
        </div>

        <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', paddingTop: '16px', borderTop: '1px solid var(--border-color)', marginTop: '16px' }}>
          © {currentYear} Tan Huynh Nhat. All rights reserved. Hosted on GitHub Pages.
        </div>
      </div>
    </footer>
  );
};
