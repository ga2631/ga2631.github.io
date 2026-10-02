'use client';

import React from 'react';
import { PrincipleItem } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

interface PrinciplesSectionProps {
  principles?: PrincipleItem[];
}

const THEME_MAP = [
  { borderClass: 'border-t-red-500 hover:border-red-500', textClass: 'text-red-500', bgClass: 'bg-red-50 text-red-500' },
  { borderClass: 'border-t-blue-500 hover:border-blue-500', textClass: 'text-blue-500', bgClass: 'bg-blue-50 text-blue-500' },
  { borderClass: 'border-t-emerald-500 hover:border-emerald-500', textClass: 'text-emerald-500', bgClass: 'bg-emerald-50 text-emerald-500' },
  { borderClass: 'border-t-amber-500 hover:border-amber-500', textClass: 'text-amber-500', bgClass: 'bg-amber-50 text-amber-500' },
];

export function PrinciplesSection({ principles = [] }: PrinciplesSectionProps) {
  const { dict } = useLanguage();

  if (!principles || principles.length === 0) {
    return null;
  }

  const items = principles.map((p, idx) => ({
    title: p.title,
    desc: p.description,
    ...(THEME_MAP[idx % THEME_MAP.length]),
  }));

  return (
    <section id="about" className="mb-16 scroll-mt-28">
      <div className="flex items-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          {dict.sections.principlesTitle}
        </h3>
        <div className="ml-6 flex-grow h-px bg-gradient-to-r from-gray-200 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-100 border-t-4 ${item.borderClass} hover:shadow-lg transition-all ease-in-out`}
          >
            <div className={`w-12 h-12 rounded-full ${item.bgClass} flex items-center justify-center mb-4`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h4 className={`text-lg font-bold ${item.textClass} mb-1`}>{item.title}</h4>
            <p className="text-md text-justify">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
