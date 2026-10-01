'use client';

import React, { useState } from 'react';
import { Card, Button, Badge } from 'flowbite-react';
import { SkillCategory } from '../types/index.ts';
import {
  CodeIcon,
  ServerIcon,
  DatabaseIcon,
  ShieldIcon,
  LayersIcon,
} from './Icons.tsx';
import { UITranslation } from '../i18n';
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
        textColor: 'text-red-700',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200',
      };
    }
    // 2. Data Engineering & Analytics / Dữ liệu
    if (lower.includes('data') || lower.includes('dữ liệu') || index === 1) {
      return {
        icon: <DatabaseIcon size={18} />,
        textColor: 'text-purple-700',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-200',
      };
    }
    // 3. DevOps, Cloud & Infra / DevOps
    if (lower.includes('devops') || lower.includes('cloud') || lower.includes('infra') || index === 2) {
      return {
        icon: <ShieldIcon size={18} />,
        textColor: 'text-green-700',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
      };
    }
    // 4. Frontend & Architecture / Architecture & Leadership
    return {
      icon: <LayersIcon size={18} />,
      textColor: 'text-cyan-700',
      bgColor: 'bg-cyan-100',
      borderColor: 'border-cyan-200',
    };
  };

  const getLevelScore = (level?: string | number): number => {
    if (typeof level === 'number') return Math.min(Math.max(level, 1), 5);
    const l = String(level || '').toLowerCase();
    if (l.includes('mastery') || l.includes('chuyên sâu') || l.includes('expert') || l.includes('5')) return 5;
    if (l.includes('advanced') || l.includes('nâng cao') || l.includes('lead') || l.includes('4')) return 4;
    if (l.includes('proficient') || l.includes('thành thạo') || l.includes('solid') || l.includes('3')) return 3;
    if (l.includes('intermediate') || l.includes('trung cấp') || l.includes('khá') || l.includes('2')) return 2;
    return 1;
  };

  const getLevelColor = (level?: string | number): 'purple' | 'info' | 'success' | 'warning' | 'gray' => {
    const score = getLevelScore(level);
    switch (score) {
      case 5:
        return 'purple';
      case 4:
        return 'info';
      case 3:
        return 'success';
      case 2:
        return 'warning';
      default:
        return 'gray';
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
      {/* Proficiency Filter Bar using Flowbite Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.legendTitle}:</span>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <Button
            color={selectedLevel === null ? 'failure' : 'light'}
            size="xs"
            onClick={() => setSelectedLevel(null)}
          >
            {t.all || 'All'}
          </Button>
          <Button
            color={selectedLevel === 5 ? 'purple' : 'light'}
            size="xs"
            onClick={() => setSelectedLevel(selectedLevel === 5 ? null : 5)}
          >
            {t.level5} (5/5)
          </Button>
          <Button
            color={selectedLevel === 4 ? 'info' : 'light'}
            size="xs"
            onClick={() => setSelectedLevel(selectedLevel === 4 ? null : 4)}
          >
            {t.level4} (4/5)
          </Button>
          <Button
            color={selectedLevel === 3 ? 'success' : 'light'}
            size="xs"
            onClick={() => setSelectedLevel(selectedLevel === 3 ? null : 3)}
          >
            {t.level3} (3/5)
          </Button>
          <Button
            color={selectedLevel === 2 ? 'warning' : 'light'}
            size="xs"
            onClick={() => setSelectedLevel(selectedLevel === 2 ? null : 2)}
          >
            {t.level2} (2/5)
          </Button>
          <Button
            color={selectedLevel === 1 ? 'gray' : 'light'}
            size="xs"
            onClick={() => setSelectedLevel(selectedLevel === 1 ? null : 1)}
          >
            {t.level1} (1/5)
          </Button>
        </div>
      </div>

      {/* Grid of Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, idx) => {
          const config = getCategoryConfig(category.title, idx);
          const sortedSkills = [...category.skills].sort(
            (a, b) => getLevelScore(b.level) - getLevelScore(a.level)
          );

          const displayedSkills = selectedLevel !== null
            ? sortedSkills.filter((s) => getLevelScore(s.level) === selectedLevel)
            : sortedSkills;

          return (
            <Card key={category.title} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border flex-shrink-0 ${config.bgColor} ${config.borderColor} ${config.textColor}`}
                  >
                    {config.icon}
                  </div>
                  <div>
                    <h5 className="text-base font-bold text-gray-900 leading-tight">{category.title}</h5>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{category.description}</p>
                  </div>
                </div>

                {displayedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {displayedSkills.map((skill) => {
                      const color = getLevelColor(skill.level);
                      return (
                        <Badge
                          key={skill.name}
                          color={color}
                          size="xs"
                          className="cursor-default"
                        >
                          {skill.name}
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-gray-400">
                    <span>{t.noSkills || 'No skills at this level.'}</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
};

export default Skills;
