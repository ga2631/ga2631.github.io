import React from 'react';
import { TagIcon } from '../Icons.tsx';
import { Badge } from '../common/Badge.tsx';

export interface BlogTagsKeywordProps {
  tags: string[];
  selectedTag: string;
  tagCounts: Record<string, number>;
  totalPostsCount: number;
  allTopicsLabel?: string;
  title?: string;
  onSelectTag: (tag: string) => void;
  className?: string;
}

export const BlogTagsKeyword: React.FC<BlogTagsKeywordProps> = ({
  tags,
  selectedTag,
  tagCounts,
  totalPostsCount,
  allTopicsLabel = 'Tất cả chủ đề',
  title = 'Thẻ công nghệ & Chủ đề',
  onSelectTag,
  className = '',
}) => {
  const displayTotalCount = totalPostsCount > 20 ? '20+' : totalPostsCount;

  return (
    <div className={`blog-sidebar-section blog-sidebar-tags-section ${className}`.trim()}>
      <div className="sidebar-section-header">
        <span className="sidebar-section-title">
          <TagIcon size={16} />
          {title}
        </span>
      </div>

      <div className="sidebar-tags-cloud">
        <Badge
          variant="tag-pill"
          isActive={selectedTag === 'all'}
          count={displayTotalCount}
          onClick={() => onSelectTag('all')}
        >
          {allTopicsLabel}
        </Badge>
        {tags.map((tag) => {
          const count = tagCounts[tag] || 0;
          const isTagActive = selectedTag === tag;
          return (
            <Badge
              key={tag}
              variant="tag-pill"
              isActive={isTagActive}
              count={count}
              onClick={() => onSelectTag(isTagActive ? 'all' : tag)}
            >
              #{tag}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

BlogTagsKeyword.displayName = 'BlogTagsKeyword';
