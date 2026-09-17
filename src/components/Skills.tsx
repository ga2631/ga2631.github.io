import React from 'react';
import { SkillCategory } from '../types/index.ts';
import { CodeIcon, DatabaseIcon, ChartIcon, SparklesIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';

interface SkillsProps {
  categories: SkillCategory[];
  t: UITranslation['skills'];
}

export const Skills: React.FC<SkillsProps> = ({ categories, t }) => {
  const getCategoryIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('core') || lower.includes('engineering') || lower.includes('cốt lõi')) {
      return <CodeIcon size={18} style={{ color: 'var(--accent-cyan)' }} />;
    }
    if (lower.includes('database') || lower.includes('infrastructure') || lower.includes('cơ sở dữ liệu') || lower.includes('hạ tầng')) {
      return <DatabaseIcon size={18} style={{ color: 'var(--accent-indigo)' }} />;
    }
    if (lower.includes('analytics') || lower.includes('data') || lower.includes('dữ liệu lớn')) {
      return <ChartIcon size={18} style={{ color: 'var(--accent-purple)' }} />;
    }
    return <SparklesIcon size={18} style={{ color: 'var(--accent-emerald)' }} />;
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

        {/* Optimized Compact Skills Grid */}
        <div className="skills-compact-grid">
          {categories.map((category) => (
            <div key={category.title} className="glass-panel skill-card-compact">
              <div className="skill-card-header">
                <div className="skill-icon-badge">
                  {getCategoryIcon(category.title)}
                </div>
                <div>
                  <h3 className="skill-card-title">{category.title}</h3>
                  <p className="skill-card-desc">{category.description}</p>
                </div>
              </div>

              {/* Wrapping Skill Badges Cluster */}
              <div className="skills-pill-cluster">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="skill-pill-tag">
                    <span className="skill-pill-name">{skill.name}</span>
                    <span className={`skill-level-dot level-${skill.level.toLowerCase()}`} title={skill.level} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
