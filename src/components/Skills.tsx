import React from 'react';
import { SkillCategory } from '../types/index.ts';
import { CodeIcon, DatabaseIcon, ChartIcon, SparklesIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';

interface SkillsProps {
  categories: SkillCategory[];
  t: UITranslation['skills'];
}

export const Skills: React.FC<SkillsProps> = ({ categories, t }) => {
  const getCategoryConfig = (title: string, index: number) => {
    const lower = title.toLowerCase();
    // 1. Core Engineering / Lập trình & Kiến trúc Cốt lõi
    if (lower.includes('core') || lower.includes('cốt lõi') || index === 0) {
      return {
        icon: <CodeIcon size={20} />,
        color: 'var(--accent-red)',
        bg: 'rgba(255, 56, 92, 0.12)',
        border: 'rgba(255, 56, 92, 0.25)',
      };
    }
    // 2. Database & Infrastructure / Cơ sở Dữ liệu & Hạ tầng
    if (
      lower.includes('database') ||
      lower.includes('cơ sở dữ liệu') ||
      lower.includes('infrastructure') ||
      lower.includes('hạ tầng') ||
      index === 1
    ) {
      return {
        icon: <DatabaseIcon size={20} />,
        color: 'var(--accent-crimson)',
        bg: 'rgba(225, 29, 72, 0.12)',
        border: 'rgba(225, 29, 72, 0.25)',
      };
    }
    // 3. Product Analytics & Data Engineering / Phân tích Sản phẩm & Kỹ thuật Dữ liệu
    if (
      lower.includes('analytics') ||
      lower.includes('phân tích') ||
      index === 2
    ) {
      return {
        icon: <ChartIcon size={20} />,
        color: 'var(--accent-rose)',
        bg: 'rgba(251, 113, 133, 0.12)',
        border: 'rgba(251, 113, 133, 0.25)',
      };
    }
    // 4. Product, Agile & AI Workflow / Quản trị Sản phẩm, Agile & Quy trình AI
    return {
      icon: <SparklesIcon size={20} />,
      color: 'var(--accent-cyan)',
      bg: 'rgba(255, 77, 109, 0.12)',
      border: 'rgba(255, 77, 109, 0.25)',
    };
  };

  const getLevelScore = (level: string | number): number => {
    if (typeof level === 'number') return Math.max(1, Math.min(5, level));
    const num = parseInt(level, 10);
    if (!isNaN(num) && num >= 1 && num <= 5) return num;
    const lower = level.toLowerCase();
    if (lower.includes('expert') || lower.includes('master') || lower.includes('chuyên gia') || lower === '5') return 5;
    if (lower.includes('advanced') || lower.includes('nâng cao') || lower.includes('senior') || lower === '4') return 4;
    if (lower.includes('proficient') || lower.includes('thành thạo') || lower.includes('intermediate') || lower === '3') return 3;
    if (lower.includes('familiar') || lower.includes('tiếp cận') || lower.includes('competent') || lower.includes('cơ bản') || lower === '2') return 2;
    return 1;
  };

  const getLevelConfig = (level: string | number) => {
    const score = getLevelScore(level);
    switch (score) {
      case 5:
        return {
          score: 5,
          scoreText: '5/5',
          label: t.level5,
          shortLabel: t.expert,
          levelClass: 'level-5',
          tagClass: 'skill-tag-5',
        };
      case 4:
        return {
          score: 4,
          scoreText: '4/5',
          label: t.level4,
          shortLabel: t.advanced,
          levelClass: 'level-4',
          tagClass: 'skill-tag-4',
        };
      case 3:
        return {
          score: 3,
          scoreText: '3/5',
          label: t.level3,
          shortLabel: t.proficient,
          levelClass: 'level-3',
          tagClass: 'skill-tag-3',
        };
      case 2:
        return {
          score: 2,
          scoreText: '2/5',
          label: t.level2,
          shortLabel: t.familiar,
          levelClass: 'level-2',
          tagClass: 'skill-tag-2',
        };
      case 1:
      default:
        return {
          score: 1,
          scoreText: '1/5',
          label: t.level1,
          shortLabel: t.fundamental,
          levelClass: 'level-1',
          tagClass: 'skill-tag-1',
        };
    }
  };

  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <CodeIcon size={14} /> {t.badge}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">
            {t.subtitle}
          </p>
        </div>

        {/* Standardized 1-5 Scale Proficiency Legend Bar */}
        <div className="skills-legend-bar">
          <span className="skills-legend-title">{t.legendTitle}:</span>
          <div className="skills-legend-items">
            <div className="skills-legend-item legend-level-5" title={t.level5}>
              <span className="skill-level-dot level-5" />
              <span>{t.level5}</span>
            </div>
            <div className="skills-legend-item legend-level-4" title={t.level4}>
              <span className="skill-level-dot level-4" />
              <span>{t.level4}</span>
            </div>
            <div className="skills-legend-item legend-level-3" title={t.level3}>
              <span className="skill-level-dot level-3" />
              <span>{t.level3}</span>
            </div>
            <div className="skills-legend-item legend-level-2" title={t.level2}>
              <span className="skill-level-dot level-2" />
              <span>{t.level2}</span>
            </div>
            <div className="skills-legend-item legend-level-1" title={t.level1}>
              <span className="skill-level-dot level-1" />
              <span>{t.level1}</span>
            </div>
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

            return (
              <div key={category.title} className="glass-panel skill-card-compact">
                <div className="skill-card-header">
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
                </div>

                {/* Wrapping Skill Badges Cluster Sorted High-to-Low with Interactive Tooltips */}
                <div className="skills-pill-cluster">
                  {sortedSkills.map((skill) => {
                    const levelCfg = getLevelConfig(skill.level);
                    return (
                      <div
                        key={skill.name}
                        className={`skill-pill-tag ${levelCfg.tagClass}`}
                        tabIndex={0}
                        role="tooltip"
                        aria-label={`${skill.name} - ${levelCfg.label}`}
                      >
                        <span className="skill-pill-name">{skill.name}</span>
                        <span className={`skill-level-dot ${levelCfg.levelClass}`} />

                        {/* Interactive Tooltip showing 1-5 score and level */}
                        <div className="skill-tooltip" role="presentation">
                          <span className={`skill-level-dot ${levelCfg.levelClass}`} />
                          <span className="skill-tooltip-score">{levelCfg.scoreText}</span>
                          <span className="skill-tooltip-divider">•</span>
                          <span className="skill-tooltip-text">{levelCfg.shortLabel}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
