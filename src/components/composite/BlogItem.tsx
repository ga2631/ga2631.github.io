import React from 'react';
import { BlogPost } from '../../types/index.ts';
import { Card, Badge, Button } from '../common';
import { SparklesIcon, ExternalLinkIcon } from '../Icons.tsx';
import { TechTagList } from './TechTagList.tsx';
import { BadgeSchedule } from './BadgeSchedule.tsx';
import { BlogCategoryDef } from '../../data/blog/blogCategories.ts';

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
  const dayCode = categoryDef ? categoryDef.dayCode.toLowerCase() : 'all';

  return (
    <Card
      className={`blog-card card-day-${dayCode} ${className}`.trim()}
      onClick={() => onSelect(post)}
    >
      <Card.Header>
        {/* Top Category Badge & Publishing Schedule Meta */}
        <div style={{ marginBottom: '12px' }}>
          {categoryDef && categoryDef.id !== 'all' ? (
            <BadgeSchedule
              dayCode={categoryDef.dayCode}
              style={{ fontSize: '0.72rem', padding: '3px 8px' }}
            >
              {categoryDef.title[langKey]}
            </BadgeSchedule>
          ) : (
            <Badge variant="purple" style={{ fontSize: '0.72rem' }} icon={<SparklesIcon size={11} />}>
              {langKey === 'vi' ? 'Bài viết' : 'Article'}
            </Badge>
          )}
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {post.publishedAt} • {post.readTime}
        </p>

        <h2 className="blog-title" style={{ fontSize: '1.22rem', marginTop: '4px' }}>
          {post.title}
        </h2>
      </Card.Header>

      <Card.Body>
        <p className="blog-summary">{post.summary}</p>
      </Card.Body>

      <Card.Footer>
        <TechTagList
          tags={post.tags}
          prefix={tagPrefix}
          selectedTag={selectedTag}
          onTagClick={onTagClick}
          style={{ marginTop: 'auto', paddingTop: '10px' }}
        />

        {readArticleLabel && (
          <Button
            variant="outline"
            size="sm"
            style={{ width: '100%', marginTop: '14px' }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(post);
            }}
            icon={<ExternalLinkIcon size={14} />}
            iconPosition="right"
          >
            <span>{readArticleLabel}</span>
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

BlogItem.displayName = 'BlogItem';
