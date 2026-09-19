import React from 'react';
import { BlogPost } from '../../types/index.ts';
import { Card, Button } from '../common';
import { ExternalLinkIcon } from '../Icons.tsx';
import { TechTagList } from './TechTagList.tsx';

export interface BlogItemProps {
  post: BlogPost;
  readArticleLabel?: string;
  onSelect: (post: BlogPost) => void;
  className?: string;
}

export const BlogItem: React.FC<BlogItemProps> = ({
  post,
  readArticleLabel = 'Read Article',
  onSelect,
  className = '',
}) => {
  return (
    <Card
      className={`blog-card ${className}`.trim()}
      onClick={() => onSelect(post)}
    >
      <Card.Header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {post.publishedAt} • {post.readTime}
          </span>
        </div>

        <h3 className="blog-title">{post.title}</h3>
      </Card.Header>

      <Card.Body>
        <p className="blog-summary">{post.summary}</p>
      </Card.Body>

      <Card.Footer>
        <TechTagList tags={post.tags} style={{ marginBottom: '16px' }} />

        <Button
          variant="outline"
          size="sm"
          style={{ width: '100%' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(post);
          }}
          icon={<ExternalLinkIcon size={14} />}
          iconPosition="right"
        >
          <span>{readArticleLabel}</span>
        </Button>
      </Card.Footer>
    </Card>
  );
};

BlogItem.displayName = 'BlogItem';
