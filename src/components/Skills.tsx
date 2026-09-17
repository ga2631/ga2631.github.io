import React, { useState } from 'react';
import { SkillCategory } from '../types/index.ts';
import { CodeIcon, DatabaseIcon, ChartIcon, SparklesIcon } from './Icons.tsx';

interface SkillsProps {
  categories: SkillCategory[];
}

export const Skills: React.FC<SkillsProps> = ({ categories }) => {
  const [activeTab, setActiveTab] = useState<string>('All');

  const getCategoryIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('core') || lower.includes('engineering')) {
      return <CodeIcon size={18} style={{ color: 'var(--accent-cyan)' }} />;
    }
    if (lower.includes('database') || lower.includes('infrastructure')) {
      return <DatabaseIcon size={18} style={{ color: 'var(--accent-indigo)' }} />;
    }
    if (lower.includes('analytics') || lower.includes('data')) {
      return <ChartIcon size={18} style={{ color: 'var(--accent-purple)' }} />;
    }
    return <SparklesIcon size={18} style={{ color: 'var(--accent-emerald)' }} />;
  };

  const tabs = ['All', ...categories.map((c) => c.title)];

  const displayedCategories = activeTab === 'All'
    ? categories
    : categories.filter((c) => c.title === activeTab);

  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <CodeIcon size={14} /> Technical Arsenal
          </span>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">
            A comprehensive matrix of polyglot programming, distributed data pipelines, and cloud native tools.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="filter-bar" style={{ marginBottom: '28px' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`filter-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Optimized Compact Skills Grid */}
        <div className="skills-compact-grid">
          {displayedCategories.map((category) => (
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
