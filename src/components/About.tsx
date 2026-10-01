'use client';

import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { PersonalInfo, PrincipleItem } from '../types/index.ts';
import { CodeIcon, AwardIcon, LayersIcon, RefreshCwIcon, ZapIcon } from './Icons.tsx';
import { UITranslation } from '../i18n';

interface AboutProps {
  data: PersonalInfo;
  principles: PrincipleItem[];
  t: UITranslation['about'];
}

export const About: React.FC<AboutProps> = ({ data, principles = [], t }) => {
  const getPrincipleConfig = (title: string, index: number) => {
    const lower = title.toLowerCase();
    if (lower.includes('architect') || lower.includes('kiến trúc') || lower.includes('resilience') || index === 0) {
      return {
        icon: <LayersIcon size={20} />,
        textColor: 'text-red-700',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200',
      };
    }
    if (lower.includes('type') || lower.includes('clean code') || lower.includes('kiểu dữ liệu') || index === 1) {
      return {
        icon: <CodeIcon size={20} />,
        textColor: 'text-purple-700',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-200',
      };
    }
    if (lower.includes('devops') || lower.includes('automation') || lower.includes('tự động hóa') || index === 2) {
      return {
        icon: <RefreshCwIcon size={20} />,
        textColor: 'text-green-700',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
      };
    }
    return {
      icon: <ZapIcon size={20} />,
      textColor: 'text-cyan-700',
      bgColor: 'bg-cyan-100',
      borderColor: 'border-cyan-200',
    };
  };

  return (
    <section id="about" className="py-20 md:py-24">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="mb-14 text-center">
          <div className="mb-3 inline-flex justify-center">
            <Badge color="failure" size="sm" icon={() => <AwardIcon size={14} className="mr-1" />}>
              {t.badge}
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3 font-heading">
            {t.title}
          </h2>
          {data.tagline && (
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {data.tagline}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((item, index) => {
            const config = getPrincipleConfig(item.title, index);
            return (
              <Card key={index} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col h-full">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 border ${config.bgColor} ${config.borderColor} ${config.textColor}`}
                  >
                    {config.icon}
                  </div>
                  <h5 className="text-lg font-bold text-gray-900 leading-snug mb-2">
                    {item.title}
                  </h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
