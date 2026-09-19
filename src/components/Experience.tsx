import React from 'react';
import { ExperienceItem } from '../types/index.ts';
import { BriefcaseIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { Card, Badge } from './common';
import { SectionHeader, TechTagList } from './composite';

interface ExperienceProps {
  experiences: ExperienceItem[];
  t: UITranslation['experience'];
}

export const Experience: React.FC<ExperienceProps> = ({ experiences, t }) => {
  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHeader
          badge={t.badge}
          badgeIcon={<BriefcaseIcon size={14} />}
          title={t.title}
          subtitle={t.subtitle}
        />

        <div className="timeline">
          {experiences.map((item) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-dot" />

              <Card className="timeline-card">
                <div className="timeline-header">
                  <div className="timeline-title-row">
                    <h3 className="timeline-role">{item.role}</h3>
                    <div className="timeline-period-wrapper">
                      <span className="timeline-period">{item.period}</span>
                      {item.current && <Badge variant="emerald">{t.currentPosition}</Badge>}
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
                    <div
                      key={idx}
                      className="achievement-point"
                      dangerouslySetInnerHTML={{ __html: ach }}
                    />
                  ))}
                </div>

                <TechTagList tags={item.technologies} />
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

