import React from 'react';
import { Badge } from 'flowbite-react';

export interface TechTagListProps {
  tags: string[];
  selectedTag?: string;
  onTagClick?: (tag: string) => void;
  prefix?: string;
  className?: string;
  itemClassName?: string;
  getItemStyle?: (tag: string) => React.CSSProperties | undefined;
  style?: React.CSSProperties;
}

export const TechTagList: React.FC<TechTagListProps> = ({
  tags,
  selectedTag,
  onTagClick,
  prefix = '',
  className = '',
  itemClassName = '',
  getItemStyle,
  style,
}) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`.trim()} style={style}>
      {tags.map((tag) => {
        const isSelected = selectedTag === tag;
        const customStyle = getItemStyle ? getItemStyle(tag) : undefined;

        return (
          <Badge
            key={tag}
            color={isSelected ? 'failure' : 'gray'}
            size="xs"
            className={`${onTagClick ? 'cursor-pointer hover:bg-gray-200' : ''} ${itemClassName}`.trim()}
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

export default TechTagList;
