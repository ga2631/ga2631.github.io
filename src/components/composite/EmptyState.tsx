import React from 'react';
import { Card, Button } from 'flowbite-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  actionText,
  onAction,
  className = '',
  style,
}) => {
  return (
    <Card
      className={`col-span-full py-12 px-6 text-center mt-3 bg-white border border-gray-200 rounded-lg shadow-xs ${className}`.trim()}
      style={style}
    >
      <div className="flex flex-col items-center">
        {icon && (
          <div className="text-gray-400 mx-auto mb-4 flex justify-center">
            {icon}
          </div>
        )}
        {typeof title === 'string' ? (
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        ) : (
          title
        )}
        {description && (
          <div className="text-gray-500 text-sm max-w-md mx-auto mb-4 leading-relaxed">
            {description}
          </div>
        )}

        {(action || (actionText && onAction)) && (
          <div className="flex justify-center mt-2">
            {action ? (
              action
            ) : actionText && onAction ? (
              <Button
                color="light"
                size="sm"
                onClick={onAction}
              >
                {actionText}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </Card>
  );
};

EmptyState.displayName = 'EmptyState';
