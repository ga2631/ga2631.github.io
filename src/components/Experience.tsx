'use client';

import React from 'react';
import { ExperienceItem } from '../types/index.ts';
import { BriefcaseIcon } from './Icons.tsx';
import { UITranslation } from '../i18n';
import { Card, Badge } from './common';
import { Section } from './ui';
import { TechTagList } from './composite';

interface ExperienceProps {
  experiences: ExperienceItem[];
  t: UITranslation['experience'];
}

export const Experience: React.FC<ExperienceProps> = ({ experiences, t }) => {
  return (
    <Section
      id="experience"
      badge={t.badge}
      badgeIcon={<BriefcaseIcon size={14} />}
      title={t.title}
      subtitle={t.subtitle}
    >
      <div className="relative pl-6 md:pl-8 border-l-2 border-slate-200 ml-2 md:ml-4 flex flex-col gap-8 timeline">
        {experiences.map((item) => (
          <div key={item.id} className="relative timeline-item">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] md:-left-[39px] top-6 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-sm timeline-dot" />

            <Card className="p-6 md:p-8 timeline-card">
              <Card.Header className="mb-4 timeline-header">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 timeline-title-row">
                  <h3 className="text-xl font-bold text-slate-900 timeline-role">{item.role}</h3>
                  <div className="flex items-center gap-2 timeline-period-wrapper">
                    <span className="text-xs font-semibold text-slate-500 timeline-period">{item.period}</span>
                    {item.current && <Badge variant="emerald">{t.currentPosition}</Badge>}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-red-600 timeline-company">
                  <span>{item.company}</span>
                  <span className="text-slate-400 font-normal">• {item.location}</span>
                </div>
                {item.companySubtitle && (
                  <div className="text-xs text-slate-500 italic mt-1">
                    {item.companySubtitle}
                  </div>
                )}
              </Card.Header>

              <Card.Body className="timeline-body">
                <p className="text-sm text-slate-600 leading-relaxed mb-4 timeline-summary">{item.summary}</p>

                <div className="flex flex-col gap-2.5 mb-5 timeline-achievements">
                  {item.achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="text-sm text-slate-600 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-red-500 before:font-bold achievement-point"
                      dangerouslySetInnerHTML={{ __html: ach }}
                    />
                  ))}
                </div>
              </Card.Body>

              <Card.Footer className="pt-4 border-t border-slate-100 timeline-footer">
                <TechTagList tags={item.technologies} />
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Experience;
