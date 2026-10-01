import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

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
      variant="glass"
      className={`col-span-full py-12 px-6 text-center mt-3 ${className}`.trim()}
      style={style}
    >
      <Card.Body>
        {icon && (
          <div className="text-slate-400 mx-auto mb-4 flex justify-center">
            {icon}
          </div>
        )}
        {typeof title === 'string' ? (
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        ) : (
          title
        )}
        {description && (
          <div className="text-slate-500 text-sm max-w-md mx-auto mb-4 leading-relaxed">
            {description}
          </div>
        )}
      </Card.Body>

      {(action || (actionText && onAction)) && (
        <Card.Footer className="flex justify-center border-t-0 p-0">
          {action ? (
            action
          ) : actionText && onAction ? (
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={onAction}
            >
              {actionText}
            </Button>
          ) : null}
        </Card.Footer>
      )}
    </Card>
  );
};

EmptyState.displayName = 'EmptyState';
