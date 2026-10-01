import React from 'react';
import { FilterIcon, CloseIcon } from '../Icons.tsx';
import { Button } from '../common/Button.tsx';
import { BlogTopic } from './BlogTopic.tsx';
import { BlogTagsKeyword } from './BlogTagsKeyword.tsx';
import { BlogCategoryDef } from '@/services/blogService';

export interface BlogSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  // Topic / Category props
  categories?: BlogCategoryDef[];
  selectedCategory: string;
  categoryCounts: Record<string, number>;
  categoriesTitle?: string;
  onSelectCategory: (categoryId: string) => void;
  onHoverCategory?: (info: { cat: BlogCategoryDef; top: number; left: number } | null) => void;
  // Tags / Keywords props
  tags: string[];
  selectedTag: string;
  tagCounts: Record<string, number>;
  totalPostsCount: number;
  allTopicsLabel?: string;
  tagsTitle?: string;
  onSelectTag: (tag: string) => void;
  // General
  langKey?: 'vi' | 'en';
  className?: string;
}

export const BlogSidebar: React.FC<BlogSidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
  categories,
  selectedCategory,
  categoryCounts,
  categoriesTitle = 'Chuyên đề',
  onSelectCategory,
  onHoverCategory,
  tags,
  selectedTag,
  tagCounts,
  totalPostsCount,
  allTopicsLabel,
  tagsTitle = 'Thẻ công nghệ & Chủ đề',
  onSelectTag,
  langKey = 'vi',
  className = '',
}) => {
  const handleSelectCategory = (catId: string) => {
    onSelectCategory(catId);
    onCloseMobile();
  };

  const handleSelectTag = (tag: string) => {
    onSelectTag(tag);
    onCloseMobile();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl p-6 shadow-2xl transition-transform duration-300 overflow-y-auto lg:static lg:w-72 lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-200/80 lg:bg-transparent flex-shrink-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${className}`.trim()}
    >
      {/* Mobile Sidebar Close Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 lg:hidden">
        <span className="font-bold text-base text-slate-900 inline-flex items-center gap-2">
          <FilterIcon size={16} className="text-red-600" />
          {categoriesTitle}
        </span>
        <button
          type="button"
          className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
        >
          <CloseIcon size={18} />
        </button>
      </div>

      {/* Section 1: Topics & Categories */}
      <BlogTopic
        categories={categories}
        selectedCategory={selectedCategory}
        categoryCounts={categoryCounts}
        langKey={langKey}
        title={categoriesTitle}
        onSelectCategory={handleSelectCategory}
        onHoverCategory={onHoverCategory}
      />

      {/* Section 2: Tags & Keywords */}
      <BlogTagsKeyword
        tags={tags}
        selectedTag={selectedTag}
        tagCounts={tagCounts}
        totalPostsCount={totalPostsCount}
        allTopicsLabel={allTopicsLabel}
        title={tagsTitle}
        onSelectTag={handleSelectTag}
      />
    </aside>
  );
};

BlogSidebar.displayName = 'BlogSidebar';
