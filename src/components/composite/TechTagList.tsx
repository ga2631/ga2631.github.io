import React from 'react';
import { Badge, BadgeVariant } from '../common/Badge';

export interface TechTagListProps {
  tags: string[];
  selectedTag?: string;
  onTagClick?: (tag: string) => void;
  prefix?: string;
  badgeVariant?: BadgeVariant;
  className?: string;
  itemClassName?: string;
  getItemStyle?: (tag: string) => React.CSSProperties | undefined;
}

export const TechTagList: React.FC<TechTagListProps> = ({
  tags,
  selectedTag,
  onTagClick,
  prefix = '',
  badgeVariant = 'default',
  className = '',
  itemClassName = '',
  getItemStyle,
}) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`tech-tags-list ${className}`.trim()}>
      {tags.map((tag) => {
        const isSelected = selectedTag === tag;
        const customStyle = getItemStyle ? getItemStyle(tag) : undefined;

        return (
          <Badge
            key={tag}
            variant={badgeVariant}
            isActive={isSelected}
            interactive={Boolean(onTagClick)}
            className={`${itemClassName} ${isSelected ? 'badge-cyan' : ''}`.trim()}
            style={customStyle}
            onClick={
              onTagClick
                ? (e) => {
                    e.stopPropagation();
                    onTagClick(tag);
                  }
                : undefined
            }
          >
            {prefix}{tag}
          </Badge>
        );
      })}
    </div>
  );
};
