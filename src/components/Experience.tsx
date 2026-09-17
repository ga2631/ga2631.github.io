import React from 'react';
import { ExperienceItem } from '../types/index.ts';
import { BriefcaseIcon, ExternalLinkIcon } from './Icons.tsx';

interface ExperienceProps {
  experiences: ExperienceItem[];
}

export const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <BriefcaseIcon size={14} /> Career Path
          </span>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">
            A track record of engineering leadership, system modernization, and delivering enterprise-grade web platforms.
          </p>
        </div>

        <div className="timeline">
          {experiences.map((item) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-dot" />

              <div className="glass-panel timeline-card">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">{item.role}</h3>
                    <div className="timeline-company">
                      {item.companyUrl ? (
                        <a
                          href={item.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          {item.company}
                          <ExternalLinkIcon size={14} />
                        </a>
                      ) : (
                        item.company
                      )}
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>• {item.location}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span className="timeline-period">{item.period}</span>
                    {item.current && <span className="badge badge-emerald">Current Position</span>}
                  </div>
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
