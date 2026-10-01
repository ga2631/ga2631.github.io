'use client';

import React from 'react';
import { PersonalInfo, PrincipleItem } from '../types/index.ts';
import { CodeIcon, AwardIcon, LayersIcon, RefreshCwIcon, ZapIcon } from './Icons.tsx';
import { UITranslation } from '../i18n';
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
    // 1. Architectural Resilience
    if (lower.includes('architect') || lower.includes('kiến trúc') || lower.includes('resilience') || index === 0) {
      return {
        icon: <LayersIcon size={20} />,
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    }
    // 2. Type Safety & Clean Code
    if (lower.includes('type') || lower.includes('clean code') || lower.includes('kiểu dữ liệu') || index === 1) {
      return {
        icon: <CodeIcon size={20} />,
        textColor: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
      };
    }
    // 3. DevOps & Automation
    if (lower.includes('devops') || lower.includes('automation') || lower.includes('tự động hóa') || index === 2) {
      return {
        icon: <RefreshCwIcon size={20} />,
        textColor: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
      };
    }
    // 4. Data & Performance Driven
    return {
      icon: <ZapIcon size={20} />,
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {principles.map((item, index) => {
          const config = getPrincipleConfig(item.title, index);
          return (
            <Card key={index} className="p-6 transition-all duration-300 hover:-translate-y-1">
              <Card.Header className="mb-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${config.bgColor} ${config.borderColor} ${config.textColor}`}
                >
                  {config.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
              </Card.Header>
              <Card.Body>
                <p className="text-sm text-slate-600 leading-relaxed">
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

export default About;
