'use client';

import React from 'react';
import { ExperienceItem } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

interface ExperienceSectionProps {
  experiences?: ExperienceItem[];
}

export function ExperienceSection({ experiences = [] }: ExperienceSectionProps) {
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';

  if (!experiences || experiences.length === 0) {
    return null;
  }

  const items = experiences;

  return (
    <section id="experience" className="mb-16 scroll-mt-28">
      <div className="flex items-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          {isEn ? 'Professional Experience' : 'Professional Experience'}
        </h3>
        <div className="ml-6 flex-grow h-px bg-gradient-to-r from-gray-200 to-transparent" />
      </div>

      <ol className="relative border-s border-red-300 ml-4">
        {items.map((exp) => (
          <li key={exp.id} className="mb-12 ms-8">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-red-600 rounded-full -start-3 ring-2 ring-white shadow-lg" />
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-red-300 transition-all ease-in-out">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-red-600">{exp.role}</h3>
                  <p className="text-gray-900 font-medium mt-1">
                    {exp.company}{' '}
                    {exp.location && (
                      <span className="text-gray-500 font-normal">| {exp.location}</span>
                    )}
                  </p>
                </div>
                <time className="block mt-2 md:mt-0 text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm h-fit">
                  {exp.period}
                </time>
              </div>
              <p className="text-gray-600 leading-relaxed mt-4 text-justify">
                {exp.summary}
              </p>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="space-y-2.5 mt-4">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-gray-600 text-sm leading-relaxed text-justify flex items-start">
                      <svg
                        className="w-4 h-4 text-red-500 mr-2.5 mt-1 flex-shrink-0"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="m9 5 7 7-7 7"
                        />
                      </svg>
                      <span dangerouslySetInnerHTML={{ __html: achievement }} />
                    </li>
                  ))}
                </ul>
              )}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className='bg-gray-50 text-gray-700 border-gray-100 text-xs font-medium rounded-full px-2.5 py-1 border'
                      >
                        {t}
                      </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
