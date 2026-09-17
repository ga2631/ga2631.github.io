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

        <div className="principles-grid">
          {t.principles.map((item, index) => (
            <div key={index} className="glass-panel principle-card">
              <div className="principle-card-header">
                <div className="principle-icon-badge">
                  <CodeIcon size={18} />
                </div>
                <h3 className="principle-card-title">{item.title}</h3>
              </div>
              <p className="principle-card-desc">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
