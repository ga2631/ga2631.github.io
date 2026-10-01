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
        textColor: 'text-red-700',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200',
      };
    }
    // 2. Type Safety & Clean Code
    if (lower.includes('type') || lower.includes('clean code') || lower.includes('kiểu dữ liệu') || index === 1) {
      return {
        icon: <CodeIcon size={20} />,
        textColor: 'text-purple-700',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-200',
      };
    }
    // 3. DevOps & Automation
    if (lower.includes('devops') || lower.includes('automation') || lower.includes('tự động hóa') || index === 2) {
      return {
        icon: <RefreshCwIcon size={20} />,
        textColor: 'text-green-700',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
      };
    }
    // 4. Data & Performance Driven
    return {
      icon: <ZapIcon size={20} />,
      textColor: 'text-cyan-700',
      bgColor: 'bg-cyan-100',
      borderColor: 'border-cyan-200',
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
            <Card key={index} className="p-5 hover:shadow-md transition-shadow">
              <Card.Header className="mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 border ${config.bgColor} ${config.borderColor} ${config.textColor}`}
                >
                  {config.icon}
                </div>
                <h5 className="text-lg font-bold text-gray-900 leading-snug">
                  {item.title}
                </h5>
              </Card.Header>
              <Card.Body>
                <p className="text-sm text-gray-600 leading-relaxed">
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
