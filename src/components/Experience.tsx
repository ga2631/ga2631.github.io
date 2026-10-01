'use client';

import React from 'react';
import { Timeline, TimelineItem, TimelinePoint, TimelineContent, Card, Badge } from 'flowbite-react';
import { ExperienceItem } from '../types/index.ts';
import { BriefcaseIcon } from './Icons.tsx';
import { UITranslation } from '../i18n';
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
      <Timeline>
        {experiences.map((item) => (
          <TimelineItem key={item.id}>
            <TimelinePoint icon={() => <BriefcaseIcon size={14} className="text-red-600" />} />
            <TimelineContent className="mb-8">
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h4 className="text-xl font-bold text-gray-900 leading-snug">
                    {item.role}
                  </h4>
                  <div className="flex items-center gap-2">
                    <time className="text-xs font-normal text-gray-400">
                      {item.period}
                    </time>
                    {item.current && (
                      <Badge color="success" size="xs">
                        {t.currentPosition}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-red-600 mb-3">
                  <span>{item.company}</span>
                  <span className="text-gray-400 font-normal">• {item.location}</span>
                </div>
                {item.companySubtitle && (
                  <p className="text-xs text-gray-400 italic mb-3">
                    {item.companySubtitle}
                  </p>
                )}

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {item.summary}
                </p>

                <div className="flex flex-col gap-2.5 mb-4">
                  {item.achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="text-sm text-gray-600 leading-relaxed ps-5 relative before:content-['▹'] before:absolute before:start-0 before:top-0 before:text-red-600 before:font-bold"
                      dangerouslySetInnerHTML={{ __html: ach }}
                    />
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <TechTagList tags={item.technologies} />
                </div>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Section>
  );
};

export default Experience;
