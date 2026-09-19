import React from 'react';
import { FilterIcon } from '../Icons.tsx';
import { InputSearch } from '../ui/InputSearch.tsx';
import { BadgeFilterChip } from './BadgeFilterChip.tsx';
import { Button } from '../common/Button.tsx';

export interface BlogInputFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  selectedCategory: string;
  selectedCategoryTitle?: string;
  onClearCategory: () => void;
  selectedTag: string;
  onClearTag: () => void;
  onResetAll: () => void;
  isStuck?: boolean;
  activeFiltersLabel?: string;
  categoryFilterLabel?: string;
  tagFilterLabel?: string;
  resetLabel?: string;
  className?: string;
}

export const BlogInputFilter: React.FC<BlogInputFilterProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm bài viết...',
  selectedCategory,
  selectedCategoryTitle,
  onClearCategory,
  selectedTag,
  onClearTag,
  onResetAll,
  isStuck = false,
  activeFiltersLabel = 'Đang lọc:',
  categoryFilterLabel = 'Chuyên đề',
  tagFilterLabel = 'Thẻ',
  resetLabel = 'Xóa bộ lọc',
  className = '',
}) => {
  const hasActiveFilters = selectedCategory !== 'all' || selectedTag !== 'all' || Boolean(searchQuery.trim());

  return (
    <div className={`blog-controls-panel ${isStuck ? 'is-stuck' : ''} ${className}`.trim()}>
      <InputSearch
        placeholder={searchPlaceholder}
        value={searchQuery}
        onValueChange={onSearchChange}
      />

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="blog-active-chips-bar">
          <span className="active-chips-label">
            <FilterIcon size={13} /> {activeFiltersLabel}
          </span>

          {selectedCategory !== 'all' && selectedCategoryTitle && (
            <BadgeFilterChip
              chipKey={categoryFilterLabel}
              chipValue={selectedCategoryTitle}
              onRemove={onClearCategory}
              removeAriaLabel="Remove category filter"
            />
          )}

          {selectedTag !== 'all' && (
            <BadgeFilterChip
              chipKey={tagFilterLabel}
              chipValue={`#${selectedTag}`}
              onRemove={onClearTag}
              removeAriaLabel="Remove tag filter"
            />
          )}

          {searchQuery.trim() && (
            <BadgeFilterChip
              chipKey="Search"
              chipValue={`"${searchQuery}"`}
              onRemove={() => onSearchChange('')}
              removeAriaLabel="Remove search query"
            />
          )}

          <Button
            variant="text-reset"
            onClick={onResetAll}
            style={{ marginLeft: 'auto' }}
          >
            {resetLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

BlogInputFilter.displayName = 'BlogInputFilter';
