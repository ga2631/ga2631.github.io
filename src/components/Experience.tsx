import React from 'react';
import { ExperienceItem } from '../types/index.ts';
import { BriefcaseIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';

interface ExperienceProps {
  experiences: ExperienceItem[];
  t: UITranslation['experience'];
}

export const Experience: React.FC<ExperienceProps> = ({ experiences, t }) => {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <BriefcaseIcon size={14} /> {t.badge}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">
            {t.subtitle}
          </p>
        </div>

        <div className="timeline">
          {experiences.map((item) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-dot" />

              <div className="glass-panel timeline-card">
                <div className="timeline-header">
                  <div className="timeline-title-row">
                    <h3 className="timeline-role">{item.role}</h3>
                    <div className="timeline-period-wrapper">
                      <span className="timeline-period">{item.period}</span>
                      {item.current && <span className="badge badge-emerald">Current Position</span>}
                    </div>
                  </div>

                  <div className="timeline-company">
                    <span>{item.company}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{item.location}</span>
                  </div>
                  {item.companySubtitle && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
                      {item.companySubtitle}
                    </div>
                  )}
                </div>

                <p className="timeline-summary">{item.summary}</p>

                <div className="timeline-achievements">
                  {item.achievements.map((ach, idx) => (
                    <div key={idx} className="achievement-point">
                      {ach}
                    </div>
                  ))}
                </div>

                <div className="tech-tags-list">
                  {item.technologies.map((tech) => (
                    <span key={tech} className="badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
