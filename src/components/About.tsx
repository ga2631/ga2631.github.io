'use client';

import React from 'react';
import { PersonalInfo, PrincipleItem } from '../types/index.ts';
import { CodeIcon, AwardIcon, LayersIcon, RefreshCwIcon, ZapIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { Card } from './common';
import { Section } from './ui';

interface AboutProps {
  data: PersonalInfo;
  principles: PrincipleItem[];
  t: UITranslation['about'];
}

export const About: React.FC<AboutProps> = ({ data, principles = [], t }) => {
  const getPrincipleConfig = (title: string, index: number) => {
    const lower = title.toLowerCase();
    // 1. Architectural Resilience / Kiến trúc Bền bỉ & Chịu tải
    if (lower.includes('architect') || lower.includes('kiến trúc') || lower.includes('resilience') || index === 0) {
      return {
        icon: <LayersIcon size={18} />,
        color: 'var(--accent-red)',
        bg: 'rgba(255, 56, 92, 0.12)',
        border: 'rgba(255, 56, 92, 0.25)',
      };
    }
    // 2. Type Safety & Clean Code / An toàn Kiểu dữ liệu & Clean Code
    if (lower.includes('type') || lower.includes('clean code') || lower.includes('kiểu dữ liệu') || index === 1) {
      return {
        icon: <CodeIcon size={18} />,
        color: 'var(--accent-purple)',
        bg: 'rgba(225, 29, 72, 0.12)',
        border: 'rgba(225, 29, 72, 0.25)',
      };
    }
    // 3. DevOps & Automation / Tự động hóa & DevOps
    if (lower.includes('devops') || lower.includes('automation') || lower.includes('tự động hóa') || index === 2) {
      return {
        icon: <RefreshCwIcon size={18} />,
        color: 'var(--accent-emerald)',
        bg: 'rgba(251, 113, 133, 0.12)',
        border: 'rgba(251, 113, 133, 0.25)',
      };
    }
    // 4. Data & Performance Driven / Tối ưu hóa Hiệu năng & Dữ liệu
    return {
      icon: <ZapIcon size={18} />,
      color: 'var(--accent-cyan)',
      bg: 'rgba(255, 77, 109, 0.12)',
      border: 'rgba(255, 77, 109, 0.25)',
    };
  };

  return (
    <Section
      id="about"
      badge={t.badge}
      badgeIcon={<AwardIcon size={14} />}
      title={t.title}
      subtitle={data.tagline}
    >
      <div className="principles-grid">
        {principles.map((item, index) => {
          const config = getPrincipleConfig(item.title, index);
          return (
            <Card key={index} className="principle-card">
              <Card.Header className="principle-card-header">
                <div
                  className="principle-icon-badge"
                  style={{
                    color: config.color,
                    backgroundColor: config.bg,
                    borderColor: config.border,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                >
                  {config.icon}
                </div>
                <h3 className="principle-card-title">{item.title}</h3>
              </Card.Header>
              <Card.Body>
                <p className="principle-card-desc">
                  {item.description}
                </p>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </Section>
  );
};
