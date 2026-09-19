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
      className={className}
      style={{
        gridColumn: '1 / -1',
        padding: '48px 24px',
        textAlign: 'center',
        marginTop: '12px',
        ...style,
      }}
    >
      <Card.Body>
        {icon && (
          <div style={{ color: 'var(--text-muted)', margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>
            {icon}
          </div>
        )}
        {typeof title === 'string' ? (
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{title}</h3>
        ) : (
          title
        )}
        {description && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '450px', margin: '0 auto 16px' }}>
            {description}
          </div>
        )}
      </Card.Body>

      {(action || (actionText && onAction)) && (
        <Card.Footer style={{ justifyContent: 'center', borderTop: 'none', padding: 0 }}>
          {action ? (
            action
          ) : actionText && onAction ? (
            <Button
              variant="secondary"
              size="sm"
              style={{ marginTop: '8px' }}
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
