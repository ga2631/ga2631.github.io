import React from 'react';
import { Badge } from 'flowbite-react';
import { TagIcon } from '../Icons.tsx';

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
      <div className="flex items-center gap-2 mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <TagIcon size={15} />
        <span>{title}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge
          color={selectedTag === 'all' ? 'failure' : 'gray'}
          size="xs"
          className="cursor-pointer hover:bg-gray-200"
          onClick={() => onSelectTag('all')}
        >
          <span>{allTopicsLabel}</span>
          <span className="ml-1 opacity-75">({totalPostsCount})</span>
        </Badge>
        {tags.map((tag) => {
          const count = tagCounts[tag] || 0;
          const isTagActive = selectedTag === tag;
          return (
            <Badge
              key={tag}
              color={isTagActive ? 'failure' : 'gray'}
              size="xs"
              className="cursor-pointer hover:bg-gray-200"
              onClick={() => onSelectTag(isTagActive ? 'all' : tag)}
            >
              <span>#{tag}</span>
              <span className="ml-1 opacity-75">({count})</span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

BlogTagsKeyword.displayName = 'BlogTagsKeyword';
