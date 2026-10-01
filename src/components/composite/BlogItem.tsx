import React from 'react';
import { Card, Badge, Button } from 'flowbite-react';
import { BlogPost } from '../../types/index.ts';
import { SparklesIcon, ExternalLinkIcon } from '../Icons.tsx';
import { TechTagList } from './TechTagList.tsx';
import { BadgeSchedule } from './BadgeSchedule.tsx';
import { BlogCategoryDef } from '@/services/blogService';

export interface BlogItemProps {
  post: BlogPost;
  categoryDef?: BlogCategoryDef;
  langKey?: 'vi' | 'en';
  readArticleLabel?: string;
  selectedTag?: string;
  tagPrefix?: string;
  onTagClick?: (tag: string) => void;
  onSelect: (post: BlogPost) => void;
  className?: string;
}

export const BlogItem: React.FC<BlogItemProps> = ({
  post,
  categoryDef,
  langKey = 'vi',
  readArticleLabel,
  selectedTag,
  tagPrefix = '',
  onTagClick,
  onSelect,
  className = '',
}) => {
  return (
    <Card
      className={`p-6 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-xs hover:shadow-md ${className}`.trim()}
      onClick={() => onSelect(post)}
    >
      <div className="flex flex-col h-full">
        {/* Top Category Badge & Publishing Schedule Meta */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {categoryDef && categoryDef.id !== 'all' ? (
            <BadgeSchedule dayCode={categoryDef.dayCode}>
              {categoryDef.title[langKey]}
            </BadgeSchedule>
          ) : (
            <Badge color="purple" size="xs" icon={() => <SparklesIcon size={11} className="mr-1" />}>
              {langKey === 'vi' ? 'Bài viết' : 'Article'}
            </Badge>
          )}

          <span className="text-xs text-gray-500 font-medium">
            {post.publishedAt}
          </span>
        </div>

        <p className="text-xs text-gray-500 font-medium mb-1.5">
          {post.readTime}
        </p>

        <h2 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 hover:text-red-600 transition-colors mb-2">
          {post.title}
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {post.summary}
        </p>

        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-3">
          <TechTagList
            tags={post.tags}
            prefix={tagPrefix}
            selectedTag={selectedTag}
            onTagClick={onTagClick}
          />

          {readArticleLabel && (
            <Button
              color="light"
              size="xs"
              className="w-full mt-2"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(post);
              }}
            >
              <span className="flex items-center gap-1.5">
                <span>{readArticleLabel}</span>
                <ExternalLinkIcon size={14} />
              </span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

BlogItem.displayName = 'BlogItem';
