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

  const getLevelInfo = (level: string) => {
    const lower = level.toLowerCase();
    if (lower === 'expert') {
      return {
        label: t.expert,
        colorClass: 'level-expert',
      };
    }
    if (lower === 'advanced') {
      return {
        label: t.advanced,
        colorClass: 'level-advanced',
      };
    }
    return {
      label: t.proficient,
      colorClass: 'level-proficient',
    };
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

        {/* Proficiency Level Legend Explanation Bar */}
        <div className="skills-legend-bar">
          <span className="skills-legend-title">{t.legendTitle}:</span>
          <div className="skills-legend-items">
            <div className="skills-legend-item">
              <span className="skill-level-dot level-expert" />
              <span>{t.expert}</span>
            </div>
            <div className="skills-legend-item">
              <span className="skill-level-dot level-advanced" />
              <span>{t.advanced}</span>
            </div>
            <div className="skills-legend-item">
              <span className="skill-level-dot level-proficient" />
              <span>{t.proficient}</span>
            </div>
          </div>
        </div>

        {/* Optimized Compact Skills Grid */}
        <div className="skills-compact-grid">
          {categories.map((category, idx) => {
            const config = getCategoryConfig(category.title, idx);
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

                {/* Wrapping Skill Badges Cluster with Level Tooltips */}
                <div className="skills-pill-cluster">
                  {category.skills.map((skill) => {
                    const levelInfo = getLevelInfo(skill.level);
                    return (
                      <div
                        key={skill.name}
                        className={`skill-pill-tag skill-tag-${skill.level.toLowerCase()}`}
                        tabIndex={0}
                        role="tooltip"
                        aria-label={`${skill.name} - ${levelInfo.label}`}
                      >
                        <span className="skill-pill-name">{skill.name}</span>
                        <span className={`skill-level-dot ${levelInfo.colorClass}`} />

                        {/* Interactive Tooltip showing proficiency level */}
                        <div className="skill-tooltip" role="presentation">
                          <span className={`skill-level-dot ${levelInfo.colorClass}`} />
                          <span className="skill-tooltip-text">{levelInfo.label}</span>
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
