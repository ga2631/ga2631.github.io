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
  if (c === 't2' || c === 'mon') return 'bg-amber-100 text-amber-700';
  if (c === 't3' || c === 'tue') return 'bg-purple-100 text-purple-700';
  if (c === 't4' || c === 'wed') return 'bg-sky-100 text-sky-700';
  if (c === 't5' || c === 'thu') return 'bg-emerald-100 text-emerald-700';
  if (c === 't6' || c === 'fri') return 'bg-rose-100 text-rose-700';
  return 'bg-slate-200 text-slate-700';
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
      <div className="flex items-center gap-2 mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
        <CalendarIcon size={15} />
        <span>{title}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {categories.map((cat: BlogCategoryDef) => {
          const isActive = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;
          const iconColorClasses = getDayIconStyle(cat.dayCode);

          return (
            <button
              key={cat.id}
              type="button"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all text-sm font-semibold cursor-pointer border group ${
                isActive
                  ? 'bg-red-50/90 text-red-600 border-red-200 shadow-sm'
                  : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100 hover:text-slate-900'
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
                className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 transition-colors ${
                  isActive
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
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
