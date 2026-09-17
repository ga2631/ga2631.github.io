import React from 'react';
import { PersonalInfo } from '../types/index.ts';
import { CodeIcon, AwardIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';

interface AboutProps {
  data: PersonalInfo;
  t: UITranslation['about'];
}

export const About: React.FC<AboutProps> = ({ data, t }) => {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <AwardIcon size={14} /> {t.badge}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">
            {data.tagline}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {t.principles.map((item, index) => (
            <div key={index} className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: 'var(--text-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CodeIcon size={18} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{item.title}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
