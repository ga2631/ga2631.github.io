import React from 'react';
import { FilterIcon, CloseIcon } from '../Icons.tsx';
import { Button } from '../common/Button.tsx';
import { BlogTopic } from './BlogTopic.tsx';
import { BlogTagsKeyword } from './BlogTagsKeyword.tsx';
import { BlogCategoryDef } from '../../data/blog/blogCategories.ts';

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
    <aside className={`blog-sidebar ${isMobileOpen ? 'mobile-open' : ''} ${className}`.trim()}>
      {/* Mobile Sidebar Close Header */}
      <div className="blog-sidebar-mobile-header">
        <span style={{ fontWeight: 700, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FilterIcon size={16} style={{ color: 'var(--accent-red)' }} />
          {categoriesTitle}
        </span>
        <Button
          variant="unstyled"
          className="modal-close-btn"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
          style={{ position: 'static' }}
        >
          <CloseIcon size={18} />
        </Button>
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
