'use client';

import React from 'react';
import { SkillCategory, SkillItem } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

interface SkillsSectionProps {
  skillCategories?: SkillCategory[];
}

/**
 * Maps skill proficiency level to corresponding color style:
 * 1 => Basic => blue
 * 2 => Familiar => emerald
 * 3 => Proficient => amber
 * 4 => Advanced => orange
 * 5 => Expert => red
 */
export function getProficiencyStyle(level: string | number | undefined): string {
  const numLevel = typeof level === 'number' ? level : parseInt(String(level), 10);

  switch(numLevel)
  {
    case 5:
      return 'bg-red-100 text-red-500 border border-red-300';
    case 4:
      return 'bg-orange-100 text-orange-500 border border-orange-300';
    case 3:
      return 'bg-amber-100 text-amber-500 border border-amber-300';
    case 2:
      return 'bg-emerald-100 text-emerald-500 border border-emerald-300';
    case 1:
    default:
      return 'bg-blue-100 text-blue-500 border border-blue-300';
  }
}

const DEFAULT_CATEGORIES: {
  title: string;
  borderColor: string;
  skills: SkillItem[];
}[] = [
  {
    title: 'Lập trình & Cốt lõi',
    borderColor: 'border-red-500',
    skills: [
      { name: 'Rust', level: 5 },
      { name: 'TS / Node.js', level: 4 },
      { name: 'Go (Golang)', level: 3 },
      { name: 'Python', level: 3 },
      { name: 'PHP', level: 2 },
    ],
  },
  {
    title: 'CSDL & Hạ tầng',
    borderColor: 'border-rose-500',
    skills: [
      { name: 'PostgreSQL', level: 5 },
      { name: 'DuckDB', level: 4 },
      { name: 'Docker', level: 4 },
      { name: 'Redis', level: 3 },
      { name: 'Linux (Arch)', level: 3 },
    ],
  },
  {
    title: 'Phân tích Sản phẩm',
    borderColor: 'border-orange-500',
    skills: [
      { name: 'GA4 (Google Analytics)', level: 5 },
      { name: 'GTM (Tag Manager)', level: 5 },
      { name: 'Looker Studio', level: 4 },
      { name: 'BigQuery', level: 3 },
    ],
  },
  {
    title: 'Agile & AI',
    borderColor: 'border-amber-500',
    skills: [
      { name: 'Scrum Framework', level: 4 },
      { name: 'Jira / Confluence', level: 3 },
      { name: 'Prompt Engineering', level: 3 },
      { name: 'GitHub Copilot', level: 2 },
    ],
  },
];

export function SkillsSection({ skillCategories }: SkillsSectionProps) {
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';

  const categories =
    skillCategories && skillCategories.length > 0
      ? skillCategories.map((c) => ({
          title: c.title,
          skills: [...(c.skills || [])].sort(
            (a, b) => Number(b.level || 0) - Number(a.level || 0)
          ),
        }))
      : DEFAULT_CATEGORIES.map((c) => ({
          ...c,
          skills: [...c.skills].sort(
            (a, b) => Number(b.level || 0) - Number(a.level || 0)
          ),
        }));

  return (
    <section id="skills" className="mb-16 scroll-mt-28">
      <div className="flex items-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          {isEn ? 'Tech Stack & Tools' : 'Tech Stack & Tools'}
        </h3>
        <div className="ml-6 flex-grow h-px bg-gradient-to-r from-gray-200 to-transparent" />
      </div>

      {/* Proficiency Scale Legend */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 pb-6 bg-white backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {isEn ? 'PROFICIENCY SCALE:' : 'THANG ĐIỂM THÀNH THẠO:'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-300" />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Expert' : 'Chuyên gia'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-300" />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Advanced' : 'Nâng cao'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-300" />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Proficient' : 'Thành thạo'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-300" />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Familiar' : 'Tiếp cận'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-300" />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Basic' : 'Cơ bản'}</span>
        </div>
      </div>

      {/* Skills Matrix Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-red-300 p-6 transition-shadow ease-in-out"
          >
            <h4
              className={`text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-b-2 border-red-500 inline-block pb-1`}
            >
              {cat.title}
            </h4>
            <div className="flex flex-col gap-3">
              {cat.skills.map((skill, sIdx) => {
                const styleClass = getProficiencyStyle(skill.level);
                return (
                  <span
                    key={sIdx}
                    className={`px-4 py-2 rounded-xl text-sm font-bold ${styleClass} hover:scale-105 transition-transform`}
                  >
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
