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
import { BLOG_CATEGORY_DEFINITIONS, BlogCategoryDef } from '../../data/blog/blogCategories.ts';

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

export const BlogTopic: React.FC<BlogTopicProps> = ({
  categories = BLOG_CATEGORY_DEFINITIONS,
  selectedCategory,
  categoryCounts,
  langKey = 'vi',
  title = 'Chuyên đề',
  onSelectCategory,
  onHoverCategory,
  className = '',
}) => {
  return (
    <div className={`blog-sidebar-section blog-sidebar-categories-section ${className}`.trim()}>
      <div className="sidebar-section-header">
        <span className="sidebar-section-title">
          <CalendarIcon size={16} />
          {title}
        </span>
      </div>

      <div className="category-track-list">
        {categories.map((cat: BlogCategoryDef) => {
          const isActive = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              type="button"
              className={`category-item-row day-${cat.dayCode.toLowerCase()} ${isActive ? 'active' : ''}`}
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
              <div className="category-item-left">
                <span className={`category-icon-box icon-${cat.dayCode.toLowerCase()}`}>
                  {renderCategoryIcon(cat.iconName, 15)}
                </span>
                <span className="category-item-name">{cat.title[langKey]}</span>
              </div>
              <span className="category-count-pill">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

BlogTopic.displayName = 'BlogTopic';
