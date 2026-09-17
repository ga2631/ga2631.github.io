import React from 'react';
import { SkillCategory } from '../types/index.ts';
import { CodeIcon } from './Icons.tsx';

interface SkillsProps {
  categories: SkillCategory[];
}

export const Skills: React.FC<SkillsProps> = ({ categories }) => {
  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <CodeIcon size={14} /> Technical Arsenal
          </span>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">
            A comprehensive matrix of technical capabilities, programming languages, frameworks, and infrastructure tools.
          </p>
        </div>

        <div className="skills-grid">
          {categories.map((category, idx) => (
            <div key={idx} className="glass-panel skill-category-card">
              <h3 className="skill-cat-title">{category.title}</h3>
              <p className="skill-cat-desc">{category.description}</p>

              <div className="skills-chip-list">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="skill-chip">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-level">{skill.level}</span>
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
