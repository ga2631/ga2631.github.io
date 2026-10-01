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
      {/* Flowbite Timeline */}
      <ol className="relative border-s border-gray-200 ms-3 md:ms-6 flex flex-col gap-8">
        {experiences.map((item) => (
          <li key={item.id} className="ms-6">
            {/* Flowbite Timeline Point */}
            <span className="absolute flex items-center justify-center w-6 h-6 bg-red-100 rounded-full -start-3 ring-8 ring-white text-red-600">
              <BriefcaseIcon size={12} />
            </span>

            {/* Flowbite Timeline Card Content */}
            <Card className="p-6 hover:shadow-md transition-shadow">
              <Card.Header className="mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h4 className="text-xl font-bold text-gray-900 leading-snug">
                    {item.role}
                  </h4>
                  <div className="flex items-center gap-2">
                    <time className="text-xs font-normal text-gray-400">
                      {item.period}
                    </time>
                    {item.current && <Badge variant="emerald">{t.currentPosition}</Badge>}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
                  <span>{item.company}</span>
                  <span className="text-gray-400 font-normal">• {item.location}</span>
                </div>
                {item.companySubtitle && (
                  <p className="text-xs text-gray-400 italic mt-1">
                    {item.companySubtitle}
                  </p>
                )}
              </Card.Header>

              <Card.Body>
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
              </Card.Body>

              <Card.Footer className="pt-4 border-t border-gray-100">
                <TechTagList tags={item.technologies} />
              </Card.Footer>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default Experience;
