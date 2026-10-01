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
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
        <TagIcon size={15} />
        <span>{title}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant="tag-pill"
          isActive={selectedTag === 'all'}
          count={totalPostsCount}
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
