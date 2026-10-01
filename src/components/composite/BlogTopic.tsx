import React from 'react';
import {
  BookOpenIcon,
  CalendarIcon,
  LayersIcon,
  DatabaseIcon,
  ServerIcon,
  CodeIcon,
  SparklesIcon,
} from '../Icons.tsx';
import { BlogCategoryDef } from '@/services/blogService';

export interface BlogTopicProps {
  categories?: BlogCategoryDef[];
  selectedCategory: string;
  categoryCounts: Record<string, number>;
  langKey?: 'vi' | 'en';
  title?: string;
  onSelectCategory: (categoryId: string) => void;
  onHoverCategory?: (info: { cat: BlogCategoryDef; top: number; left: number } | null) => void;
  className?: string;
}

export const renderCategoryIcon = (iconName: string, size = 15) => {
  switch (iconName) {
    case 'LayersIcon':
      return <LayersIcon size={size} />;
    case 'DatabaseIcon':
      return <DatabaseIcon size={size} />;
    case 'ServerIcon':
      return <ServerIcon size={size} />;
    case 'CodeIcon':
      return <CodeIcon size={size} />;
    case 'SparklesIcon':
      return <SparklesIcon size={size} />;
    default:
      return <BookOpenIcon size={size} />;
  }
};

export const getDayIconStyle = (code: string) => {
  const c = code.toLowerCase();
  if (c === 't2' || c === 'mon') return 'bg-yellow-100 text-yellow-800';
  if (c === 't3' || c === 'tue') return 'bg-purple-100 text-purple-800';
  if (c === 't4' || c === 'wed') return 'bg-blue-100 text-blue-800';
  if (c === 't5' || c === 'thu') return 'bg-green-100 text-green-800';
  if (c === 't6' || c === 'fri') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

export const BlogTopic: React.FC<BlogTopicProps> = ({
  categories = [],
  selectedCategory,
  categoryCounts,
  langKey = 'vi',
  title = 'Chuyên đề',
  onSelectCategory,
  onHoverCategory,
  className = '',
}) => {
  return (
    <div className={`mb-6 ${className}`.trim()}>
      <div className="flex items-center gap-2 mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <CalendarIcon size={15} />
        <span>{title}</span>
      </div>

      <div className="flex flex-col gap-1">
        {categories.map((cat: BlogCategoryDef) => {
          const isActive = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;
          const iconColorClasses = getDayIconStyle(cat.dayCode);

          return (
            <button
              key={cat.id}
              type="button"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all text-sm font-medium cursor-pointer border group ${
                isActive
                  ? 'bg-red-50 text-red-600 border-red-200 shadow-xs font-semibold'
                  : 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => {
                onSelectCategory(cat.id);
                if (onHoverCategory) onHoverCategory(null);
              }}
              onMouseEnter={(e) => {
                if (onHoverCategory) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  onHoverCategory({
                    cat,
                    top: rect.top + rect.height / 2,
                    left: rect.right + 12,
                  });
                }
              }}
              onMouseLeave={() => {
                if (onHoverCategory) onHoverCategory(null);
              }}
              aria-label={`${cat.title[langKey]} - ${cat.scheduleFull[langKey]}`}
            >
              <div className="flex items-center min-w-0 pr-2">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mr-2.5 ${iconColorClasses}`}>
                  {renderCategoryIcon(cat.iconName, 14)}
                </span>
                <span className="truncate text-sm">{cat.title[langKey]}</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 transition-colors ${
                  isActive
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

BlogTopic.displayName = 'BlogTopic';
