'use client';

import React from 'react';
import { SkillCategory } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

interface SkillsSectionProps {
  skillCategories?: SkillCategory[];
}

type ProficiencyClass =
  | 'bg-expert text-expertText border-expertBorder'
  | 'bg-advanced text-advancedText border-advancedBorder'
  | 'bg-proficient text-proficientText border-proficientBorder'
  | 'bg-familiar text-familiarText border-familiarBorder'
  | 'bg-basic text-basicText border-basicBorder';

const DEFAULT_CATEGORIES: {
  title: string;
  borderColor: string;
  skills: { name: string; style: ProficiencyClass }[];
}[] = [
  {
    title: 'Lập trình & Cốt lõi',
    borderColor: 'border-red-500',
    skills: [
      { name: 'Rust', style: 'bg-expert text-expertText border-expertBorder' },
      { name: 'TS / Node.js', style: 'bg-advanced text-advancedText border-advancedBorder' },
      { name: 'Go (Golang)', style: 'bg-proficient text-proficientText border-proficientBorder' },
      { name: 'Python', style: 'bg-proficient text-proficientText border-proficientBorder' },
      { name: 'PHP', style: 'bg-familiar text-familiarText border-familiarBorder' },
    ],
  },
  {
    title: 'CSDL & Hạ tầng',
    borderColor: 'border-rose-500',
    skills: [
      { name: 'PostgreSQL', style: 'bg-expert text-expertText border-expertBorder' },
      { name: 'DuckDB', style: 'bg-advanced text-advancedText border-advancedBorder' },
      { name: 'Docker', style: 'bg-advanced text-advancedText border-advancedBorder' },
      { name: 'Redis', style: 'bg-proficient text-proficientText border-proficientBorder' },
      { name: 'Linux (Arch)', style: 'bg-proficient text-proficientText border-proficientBorder' },
    ],
  },
  {
    title: 'Phân tích Sản phẩm',
    borderColor: 'border-orange-500',
    skills: [
      { name: 'GA4 (Google Analytics)', style: 'bg-expert text-expertText border-expertBorder' },
      { name: 'GTM (Tag Manager)', style: 'bg-expert text-expertText border-expertBorder' },
      { name: 'Looker Studio', style: 'bg-advanced text-advancedText border-advancedBorder' },
      { name: 'BigQuery', style: 'bg-proficient text-proficientText border-proficientBorder' },
    ],
  },
  {
    title: 'Agile & AI',
    borderColor: 'border-amber-500',
    skills: [
      { name: 'Scrum Framework', style: 'bg-advanced text-advancedText border-advancedBorder' },
      { name: 'Jira / Confluence', style: 'bg-proficient text-proficientText border-proficientBorder' },
      { name: 'Prompt Engineering', style: 'bg-proficient text-proficientText border-proficientBorder' },
      { name: 'GitHub Copilot', style: 'bg-familiar text-familiarText border-familiarBorder' },
    ],
  },
];

const BORDER_PALETTE = ['border-red-500', 'border-rose-500', 'border-orange-500', 'border-amber-500'];

function getProficiencyStyle(level: any): ProficiencyClass {
  if (typeof level === 'string') {
    const l = level.toLowerCase();
    if (l.includes('expert') || l.includes('chuyên gia')) return 'bg-expert text-expertText border-expertBorder';
    if (l.includes('advanced') || l.includes('nâng cao')) return 'bg-advanced text-advancedText border-advancedBorder';
    if (l.includes('proficient') || l.includes('thành thạo')) return 'bg-proficient text-proficientText border-proficientBorder';
    if (l.includes('familiar') || l.includes('tiếp cận')) return 'bg-familiar text-familiarText border-familiarBorder';
    if (l.includes('basic') || l.includes('cơ bản')) return 'bg-basic text-basicText border-basicBorder';
  }
  if (typeof level === 'number') {
    if (level >= 90) return 'bg-expert text-expertText border-expertBorder';
    if (level >= 80) return 'bg-advanced text-advancedText border-advancedBorder';
    if (level >= 70) return 'bg-proficient text-proficientText border-proficientBorder';
    if (level >= 50) return 'bg-familiar text-familiarText border-familiarBorder';
    return 'bg-basic text-basicText border-basicBorder';
  }
  return 'bg-proficient text-proficientText border-proficientBorder';
}

export function SkillsSection({ skillCategories }: SkillsSectionProps) {
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';

  const categories =
    skillCategories && skillCategories.length > 0
      ? skillCategories.map((c, i) => ({
          title: c.title,
          borderColor: BORDER_PALETTE[i % BORDER_PALETTE.length],
          skills: (c.skills || []).map((s) => ({
            name: s.name,
            style: getProficiencyStyle(s.level),
          })),
        }))
      : DEFAULT_CATEGORIES;

  return (
    <section id="skills" className="mb-16 scroll-mt-28">
      <div className="flex items-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          {isEn ? 'Tech Stack & Tools' : 'Tech Stack & Tools'}
        </h3>
        <div className="ml-6 flex-grow h-px bg-gradient-to-r from-gray-200 to-transparent" />
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 pb-6 bg-white backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {isEn ? 'PROFICIENCY SCALE:' : 'THANG ĐIỂM THÀNH THẠO:'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-expertText shadow-sm shadow-red-300" />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Expert' : 'Chuyên gia'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-advancedText shadow-sm shadow-orange-300" />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Advanced' : 'Nâng cao'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-proficientText shadow-sm shadow-amber-300" />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Proficient' : 'Thành thạo'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-familiarText shadow-sm shadow-emerald-300" />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Familiar' : 'Tiếp cận'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-basicText shadow-sm shadow-blue-300" />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Basic' : 'Cơ bản'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-red-300 p-6 transition-shadow ease-in-out"
          >
            <h4
              className={`text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-b-2 ${cat.borderColor} inline-block pb-1`}
            >
              {cat.title}
            </h4>
            <div className="flex flex-col gap-3">
              {cat.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className={`px-4 py-2 rounded-xl text-sm font-bold ${skill.style} hover:scale-105 transition-transform`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
