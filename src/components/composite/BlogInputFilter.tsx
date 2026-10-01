import React from 'react';
import { TextInput, Button } from 'flowbite-react';
import { FilterIcon, SearchIcon } from '../Icons.tsx';
import { BadgeFilterChip } from './BadgeFilterChip.tsx';

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
    <div
      className={`sticky top-0 z-20 mb-8 p-4 bg-white/95 backdrop-blur-md rounded-lg border transition-all ${
        isStuck ? 'border-red-300 shadow-sm' : 'border-gray-200 shadow-xs'
      } ${className}`.trim()}
    >
      <TextInput
        type="text"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={() => <SearchIcon size={18} className="text-gray-400" />}
        sizing="md"
      />

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 flex-wrap text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold text-gray-500 uppercase tracking-wider text-xs mr-1">
            <FilterIcon size={13} className="text-red-600" /> {activeFiltersLabel}
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
            color="light"
            size="xs"
            onClick={onResetAll}
            className="ml-auto text-red-600 hover:text-red-700 font-semibold cursor-pointer"
          >
            {resetLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

BlogInputFilter.displayName = 'BlogInputFilter';
