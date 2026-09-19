import React, { useState } from 'react';
import { SkillCategory } from '../types/index.ts';
import {
  CodeIcon,
  ServerIcon,
  DatabaseIcon,
  ShieldIcon,
  LayersIcon,
} from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
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
        color: 'var(--accent-red)',
        bg: 'rgba(255, 56, 92, 0.12)',
        border: 'rgba(255, 56, 92, 0.25)',
      };
    }
    // 2. Data Engineering & Analytics / Dữ liệu
    if (lower.includes('data') || lower.includes('dữ liệu') || lower.includes('analytics') || index === 1) {
      return {
        icon: <DatabaseIcon size={18} />,
        color: 'var(--accent-crimson)',
        bg: 'rgba(225, 29, 72, 0.12)',
        border: 'rgba(225, 29, 72, 0.25)',
      };
    }
    // 3. DevOps, Cloud & Infra / DevOps
    if (lower.includes('devops') || lower.includes('cloud') || lower.includes('infra') || index === 2) {
      return {
        icon: <ShieldIcon size={18} />,
        color: 'var(--accent-rose)',
        bg: 'rgba(251, 113, 133, 0.12)',
        border: 'rgba(251, 113, 133, 0.25)',
      };
    }
    // 4. Frontend & Architecture / Architecture & Leadership
    return {
      icon: <LayersIcon size={18} />,
      color: 'var(--accent-red)',
      bg: 'rgba(255, 77, 109, 0.12)',
      border: 'rgba(255, 77, 109, 0.25)',
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
          tagClass: 'level-mastery skill-tag-5 skill-tag-expert',
          label: `${t.level5} (5/5)`,
          dotCount: 5,
        };
      case 4:
        return {
          tagClass: 'level-advanced skill-tag-4 skill-tag-advanced',
          label: `${t.level4} (4/5)`,
          dotCount: 4,
        };
      case 3:
        return {
          tagClass: 'level-proficient skill-tag-3 skill-tag-proficient',
          label: `${t.level3} (3/5)`,
          dotCount: 3,
        };
      case 2:
        return {
          tagClass: 'level-intermediate skill-tag-2 skill-tag-familiar',
          label: `${t.level2} (2/5)`,
          dotCount: 2,
        };
      default:
        return {
          tagClass: 'level-foundational skill-tag-1 skill-tag-fundamental',
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
      <div className="skills-legend-bar">
        <span className="skills-legend-title">{t.legendTitle}:</span>
        <div className="skills-legend-items">
          <Button
            variant="unstyled"
            className={`skills-legend-item legend-all ${selectedLevel === null ? 'active' : ''}`}
            onClick={() => setSelectedLevel(null)}
            aria-pressed={selectedLevel === null}
            title={t.all || 'All'}
          >
            <span>{t.all || 'All'}</span>
          </Button>
          <Button
            variant="unstyled"
            className={`skills-legend-item legend-level-5 ${selectedLevel === 5 ? 'active' : ''}`}
            onClick={() => setSelectedLevel(selectedLevel === 5 ? null : 5)}
            aria-pressed={selectedLevel === 5}
            title={`${t.level5} (5/5)`}
          >
            <span>{t.level5}</span>
          </Button>
          <Button
            variant="unstyled"
            className={`skills-legend-item legend-level-4 ${selectedLevel === 4 ? 'active' : ''}`}
            onClick={() => setSelectedLevel(selectedLevel === 4 ? null : 4)}
            aria-pressed={selectedLevel === 4}
            title={`${t.level4} (4/5)`}
          >
            <span>{t.level4}</span>
          </Button>
          <Button
            variant="unstyled"
            className={`skills-legend-item legend-level-3 ${selectedLevel === 3 ? 'active' : ''}`}
            onClick={() => setSelectedLevel(selectedLevel === 3 ? null : 3)}
            aria-pressed={selectedLevel === 3}
            title={`${t.level3} (3/5)`}
          >
            <span>{t.level3}</span>
          </Button>
          <Button
            variant="unstyled"
            className={`skills-legend-item legend-level-2 ${selectedLevel === 2 ? 'active' : ''}`}
            onClick={() => setSelectedLevel(selectedLevel === 2 ? null : 2)}
            aria-pressed={selectedLevel === 2}
            title={`${t.level2} (2/5)`}
          >
            <span>{t.level2}</span>
          </Button>
          <Button
            variant="unstyled"
            className={`skills-legend-item legend-level-1 ${selectedLevel === 1 ? 'active' : ''}`}
            onClick={() => setSelectedLevel(selectedLevel === 1 ? null : 1)}
            aria-pressed={selectedLevel === 1}
            title={`${t.level1} (1/5)`}
          >
            <span>{t.level1}</span>
          </Button>
        </div>
      </div>

      {/* Optimized Compact Skills Grid */}
      <div className="skills-compact-grid">
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
            <Card key={category.title} className="skill-card-compact">
              <Card.Header className="skill-card-header">
                <div
                  className="skill-icon-badge"
                  style={{
                    color: config.color,
                    backgroundColor: config.bg,
                    borderColor: config.border,
                  }}
                >
                  {config.icon}
                </div>
                <div>
                  <h3 className="skill-card-title">{category.title}</h3>
                  <p className="skill-card-desc">{category.description}</p>
                </div>
              </Card.Header>

              <Card.Body>
                {/* Wrapping Skill Badges Cluster Sorted High-to-Low or Empty State */}
                {displayedSkills.length > 0 ? (
                  <div className="skills-pill-cluster">
                    {displayedSkills.map((skill) => {
                      const levelCfg = getLevelConfig(skill.level);
                      return (
                        <span
                          key={skill.name}
                          className={`skill-pill-tag ${levelCfg.tagClass}`}
                        >
                          {skill.name}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="skills-empty-state">
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
