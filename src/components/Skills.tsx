'use client';

import React, { useState } from 'react';
import { SkillCategory } from '../types/index.ts';
import {
  CodeIcon,
  ServerIcon,
  DatabaseIcon,
  ShieldIcon,
  LayersIcon,
} from './Icons.tsx';
import { UITranslation } from '../i18n';
import { Card, Button } from './common';
import { Section } from './ui';

interface SkillsProps {
  categories: SkillCategory[];
  t: UITranslation['skills'];
}

export const Skills: React.FC<SkillsProps> = ({ categories, t }) => {
  // Interactive proficiency level filter: null (All), 5 (Mastery), 4 (Advanced), 3 (Proficient), 2 (Intermediate), 1 (Foundational)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const getCategoryConfig = (title: string, index: number) => {
    const lower = title.toLowerCase();
    // 1. Backend & Systems / Backend & Distributed Systems
    if (lower.includes('backend') || lower.includes('distributed') || lower.includes('hệ thống') || index === 0) {
      return {
        icon: <ServerIcon size={18} />,
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    }
    // 2. Data Engineering & Analytics / Dữ liệu
    if (lower.includes('data') || lower.includes('dữ liệu') || index === 1) {
      return {
        icon: <DatabaseIcon size={18} />,
        textColor: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
      };
    }
    // 3. DevOps, Cloud & Infra / DevOps
    if (lower.includes('devops') || lower.includes('cloud') || lower.includes('infra') || index === 2) {
      return {
        icon: <ShieldIcon size={18} />,
        textColor: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
      };
    }
    // 4. Frontend & Architecture / Architecture & Leadership
    return {
      icon: <LayersIcon size={18} />,
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
    };
  };

  // Convert level text or score into normalized 1-5 numeric rating
  const getLevelScore = (level?: string | number): number => {
    if (typeof level === 'number') return Math.min(Math.max(level, 1), 5);
    const l = String(level || '').toLowerCase();
    if (l.includes('mastery') || l.includes('chuyên sâu') || l.includes('expert') || l.includes('5')) return 5;
    if (l.includes('advanced') || l.includes('nâng cao') || l.includes('lead') || l.includes('4')) return 4;
    if (l.includes('proficient') || l.includes('thành thạo') || l.includes('solid') || l.includes('3')) return 3;
    if (l.includes('intermediate') || l.includes('trung cấp') || l.includes('khá') || l.includes('2')) return 2;
    return 1;
  };

  // Map 1-5 scale into clean visual indicator dot and tag badge styles
  const getLevelConfig = (level?: string | number) => {
    const score = getLevelScore(level);
    switch (score) {
      case 5:
        return {
          tagClass: 'bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100/70',
          label: `${t.level5} (5/5)`,
          dotCount: 5,
        };
      case 4:
        return {
          tagClass: 'bg-sky-50 text-sky-700 border-sky-200/80 hover:bg-sky-100/70',
          label: `${t.level4} (4/5)`,
          dotCount: 4,
        };
      case 3:
        return {
          tagClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/70',
          label: `${t.level3} (3/5)`,
          dotCount: 3,
        };
      case 2:
        return {
          tagClass: 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100/70',
          label: `${t.level2} (2/5)`,
          dotCount: 2,
        };
      default:
        return {
          tagClass: 'bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-200/70',
          label: `${t.level1} (1/5)`,
          dotCount: 1,
        };
    }
  };

  return (
    <Section
      id="skills"
      badge={t.badge}
      badgeIcon={<CodeIcon size={14} />}
      title={t.title}
      subtitle={t.subtitle}
    >
      {/* Standardized 1-5 Scale Proficiency Legend & Interactive Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.legendTitle}:</span>
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <Button
            variant="unstyled"
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              selectedLevel === null
                ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedLevel(null)}
            aria-pressed={selectedLevel === null}
            title={t.all || 'All'}
          >
            <span>{t.all || 'All'}</span>
          </Button>
          <Button
            variant="unstyled"
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              selectedLevel === 5
                ? 'bg-purple-50 text-purple-700 border border-purple-300 shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300 hover:text-purple-700'
            }`}
            onClick={() => setSelectedLevel(selectedLevel === 5 ? null : 5)}
            aria-pressed={selectedLevel === 5}
            title={`${t.level5} (5/5)`}
          >
            <span>{t.level5}</span>
          </Button>
          <Button
            variant="unstyled"
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              selectedLevel === 4
                ? 'bg-sky-50 text-sky-700 border border-sky-300 shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-700'
            }`}
            onClick={() => setSelectedLevel(selectedLevel === 4 ? null : 4)}
            aria-pressed={selectedLevel === 4}
            title={`${t.level4} (4/5)`}
          >
            <span>{t.level4}</span>
          </Button>
          <Button
            variant="unstyled"
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              selectedLevel === 3
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
            }`}
            onClick={() => setSelectedLevel(selectedLevel === 3 ? null : 3)}
            aria-pressed={selectedLevel === 3}
            title={`${t.level3} (3/5)`}
          >
            <span>{t.level3}</span>
          </Button>
          <Button
            variant="unstyled"
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              selectedLevel === 2
                ? 'bg-amber-50 text-amber-700 border border-amber-300 shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-amber-700'
            }`}
            onClick={() => setSelectedLevel(selectedLevel === 2 ? null : 2)}
            aria-pressed={selectedLevel === 2}
            title={`${t.level2} (2/5)`}
          >
            <span>{t.level2}</span>
          </Button>
          <Button
            variant="unstyled"
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              selectedLevel === 1
                ? 'bg-slate-200 text-slate-800 border border-slate-300 shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedLevel(selectedLevel === 1 ? null : 1)}
            aria-pressed={selectedLevel === 1}
            title={`${t.level1} (1/5)`}
          >
            <span>{t.level1}</span>
          </Button>
        </div>
      </div>

      {/* Optimized Compact Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, idx) => {
          const config = getCategoryConfig(category.title, idx);
          // Sort skills in descending order from highest level (5) to lowest level (1)
          const sortedSkills = [...category.skills].sort(
            (a, b) => getLevelScore(b.level) - getLevelScore(a.level)
          );

          // Filter skills if a proficiency level is selected
          const displayedSkills = selectedLevel !== null
            ? sortedSkills.filter((s) => getLevelScore(s.level) === selectedLevel)
            : sortedSkills;

          return (
            <Card key={category.title} className="p-6 transition-all duration-300 hover:-translate-y-1">
              <Card.Header className="mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${config.bgColor} ${config.borderColor} ${config.textColor}`}
                  >
                    {config.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{category.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{category.description}</p>
                  </div>
                </div>
              </Card.Header>

              <Card.Body>
                {/* Wrapping Skill Badges Cluster Sorted High-to-Low or Empty State */}
                {displayedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {displayedSkills.map((skill) => {
                      const levelCfg = getLevelConfig(skill.level);
                      return (
                        <span
                          key={skill.name}
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-default ${levelCfg.tagClass}`}
                        >
                          {skill.name}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400">
                    <span>{t.noSkills || 'No skills at this level.'}</span>
                  </div>
                )}
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </Section>
  );
};
