import React from 'react';
import { PersonalInfo } from '../types/index.ts';
import { CodeIcon, AwardIcon } from './Icons.tsx';

interface AboutProps {
  data: PersonalInfo;
}

export const About: React.FC<AboutProps> = ({ data }) => {
  const principles = [
    {
      title: 'Architectural Resilience',
      description: 'Designing modular microservices and event-driven architectures with high availability, fault tolerance, and low latency.',
    },
    {
      title: 'Type Safety & Clean Code',
      description: 'Leveraging modern TypeScript, Rust, and domain-driven design to ensure maintainability, maintain high test coverage, and eliminate runtime exceptions.',
    },
    {
      title: 'DevOps & Automation',
      description: 'Automating multi-stage Docker containerization and GitHub Actions CI/CD workflows for reliable, zero-downtime deployment pipelines.',
    },
    {
      title: 'User-Centric Performance',
      description: 'Optimizing Core Web Vitals, tree-shaking bundles, and crafting responsive user experiences with minimal latency.',
    },
  ];

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <AwardIcon size={14} /> About Me
          </span>
          <h2 className="section-title">Engineering Excellence & Philosophy</h2>
          <p className="section-subtitle">
            {data.tagline}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {principles.map((item, index) => (
            <div key={index} className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: 'var(--text-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CodeIcon size={18} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{item.title}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
