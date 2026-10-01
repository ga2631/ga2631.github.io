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
      <div className="relative pl-6 md:pl-10 ml-2 md:ml-4 flex flex-col gap-8 before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-[11px] md:before:left-[15px] before:w-[2px] before:bg-gradient-to-b before:from-red-600 before:to-red-800">
        {experiences.map((item) => (
          <div key={item.id} className="relative">
            {/* Timeline Dot */}
            <div className="absolute -left-[20px] md:-left-[31px] top-6 w-5 h-5 rounded-full bg-slate-50 border-[3px] border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.5)] z-10" />

            <Card className="p-6 md:p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
              <Card.Header className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 font-heading group-hover:text-red-600 transition-colors duration-150">
                    {item.role}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      {item.period}
                    </span>
                    {item.current && <Badge variant="emerald">{t.currentPosition}</Badge>}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
                  <span>{item.company}</span>
                  <span className="text-slate-400 font-normal">• {item.location}</span>
                </div>
                {item.companySubtitle && (
                  <div className="text-xs text-slate-400 italic mt-1">
                    {item.companySubtitle}
                  </div>
                )}
              </Card.Header>

              <Card.Body>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {item.summary}
                </p>

                <div className="flex flex-col gap-2.5 mb-5">
                  {item.achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="text-sm text-slate-600 leading-relaxed pl-5 relative before:content-['▹'] before:absolute before:left-0 before:top-0 before:text-red-600 before:font-bold"
                      dangerouslySetInnerHTML={{ __html: ach }}
                    />
                  ))}
                </div>
              </Card.Body>

              <Card.Footer className="pt-4 border-t border-slate-100">
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
