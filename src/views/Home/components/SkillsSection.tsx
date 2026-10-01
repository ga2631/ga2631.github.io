'use client';

import React from 'react';
import { SkillCategory, SkillItem } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

interface SkillsSectionProps {
  skillCategories?: SkillCategory[];
}

interface LevelStyle {
  dot: string;
  badge: string;
}

const LEVEL_MAP: Record<string | number, LevelStyle> = {
  5: {
    dot: 'bg-violet-500 shadow-violet-300',
    badge: 'bg-violet-100 text-violet-700 border-violet-300',
  },
  4: {
    dot: 'bg-blue-500 shadow-blue-300',
    badge: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  3: {
    dot: 'bg-emerald-500 shadow-emerald-300',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
  2: {
    dot: 'bg-amber-500 shadow-amber-300',
    badge: 'bg-amber-100 text-amber-700 border-amber-300',
  },
  1: {
    dot: 'bg-gray-500 shadow-gray-300',
    badge: 'bg-gray-100 text-gray-700 border-gray-300',
  },
};

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

export function getProficiencyStyle(level: string | number | undefined): string {
  const numLevel = typeof level === 'number' ? level : parseInt(String(level), 10);
  return (LEVEL_MAP[numLevel] || LEVEL_MAP[1]).badge;
}

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
          <span className={`w-3 h-3 rounded-full shadow-sm ${LEVEL_MAP[5].dot}`} />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Expert' : 'Chuyên gia'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full shadow-sm ${LEVEL_MAP[4].dot}`} />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Advanced' : 'Nâng cao'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full shadow-sm ${LEVEL_MAP[3].dot}`} />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Proficient' : 'Thành thạo'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full shadow-sm ${LEVEL_MAP[2].dot}`} />
          <span className="text-sm font-medium text-gray-700">{isEn ? 'Familiar' : 'Tiếp cận'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full shadow-sm ${LEVEL_MAP[1].dot}`} />
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
                const badgeStyle = getProficiencyStyle(skill.level);
                return (
                  <span
                    key={sIdx}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border ${badgeStyle} hover:scale-105 transition-transform`}
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
