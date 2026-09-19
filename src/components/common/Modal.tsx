import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../Icons';

export interface ModalHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  sticky?: boolean;
  isStickyTitleShown?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  closeAriaLabel?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subtitle,
  icon,
  badge,
  sticky = false,
  isStickyTitleShown = false,
  showCloseButton = true,
  onClose,
  closeAriaLabel = 'Close modal',
  className = '',
  children,
  ...restProps
}) => {
  if (sticky) {
    return (
      <div
        className={`modal-sticky-header ${isStickyTitleShown ? 'has-title' : ''} ${className}`.trim()}
        {...restProps}
      >
        <div className="modal-header-title-wrapper">
          {title && (
            <span className="modal-header-article-title" title={typeof title === 'string' ? title : undefined}>
              {title}
            </span>
          )}
        </div>
        {showCloseButton && onClose && (
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={closeAriaLabel}
          >
            <CloseIcon size={18} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`modal-header ${className}`.trim()} {...restProps}>
      {children ? (
        children
      ) : (
        <>
          <div className="modal-title-wrapper">
            {(badge || icon) && (
              <div className="modal-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                {icon}
                {badge}
              </div>
            )}
            {title && (
              typeof title === 'string' ? (
                <h2 className="modal-title" style={{ margin: 0 }}>{title}</h2>
              ) : (
                title
              )
            )}
            {subtitle && (
              typeof subtitle === 'string' ? (
                <div className="modal-subtitle" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{subtitle}</div>
              ) : (
                subtitle
              )
            )}
          </div>
          {showCloseButton && onClose && (
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label={closeAriaLabel}
            >
              <CloseIcon size={18} />
            </button>
          )}
        </>
      )}
    </div>
  );
};
ModalHeader.displayName = 'ModalHeader';

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalBody: React.FC<ModalBodyProps> = ({
  className = '',
  children,
  ...restProps
}) => {
  return (
    <div className={`modal-body ${className}`.trim()} {...restProps}>
      {children}
    </div>
  );
};
ModalBody.displayName = 'ModalBody';

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  actions,
  className = '',
  children,
  ...restProps
}) => {
  return (
    <div
      className={`modal-footer ${className}`.trim()}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px',
        padding: '16px 24px',
        borderTop: '1px solid var(--border-color)',
        ...restProps.style,
      }}
      {...restProps}
    >
      {children}
      {actions && <div className="modal-footer-actions">{actions}</div>}
    </div>
  );
};
ModalFooter.displayName = 'ModalFooter';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  stickyHeader?: boolean;
  isStickyTitleShown?: boolean;
  showCloseButton?: boolean;
  closeAriaLabel?: string;
  backdropClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  onContentScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  ariaLabelledBy?: string;
  ariaLabel?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export interface ModalComponent extends React.FC<ModalProps> {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
}

export const Modal: ModalComponent = ({
  isOpen,
  onClose,
  title,
  stickyHeader = false,
  isStickyTitleShown = false,
  showCloseButton,
  closeAriaLabel = 'Close modal',
  backdropClassName = 'blog-modal-backdrop',
  contentClassName = 'blog-modal-content',
  headerClassName = '',
  bodyClassName = '',
  contentRef,
  onContentScroll,
  ariaLabelledBy,
  ariaLabel,
  header,
  footer,
  children,
}) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const activeContentRef = contentRef || internalRef;
  const isCloseButtonVisible = showCloseButton !== undefined ? showCloseButton : Boolean(title || stickyHeader);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={backdropClassName}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel || (typeof title === 'string' ? title : undefined)}
    >
      <div
        ref={activeContentRef as any}
        className={contentClassName}
        onClick={(e) => e.stopPropagation()}
        onScroll={onContentScroll}
      >
        {header ? (
          header
        ) : stickyHeader ? (
          <ModalHeader
            title={title}
            sticky={true}
            isStickyTitleShown={isStickyTitleShown}
            showCloseButton={isCloseButtonVisible}
            onClose={onClose}
            closeAriaLabel={closeAriaLabel}
            className={headerClassName}
          />
        ) : title ? (
          <ModalHeader
            title={title}
            showCloseButton={isCloseButtonVisible}
            onClose={onClose}
            closeAriaLabel={closeAriaLabel}
            className={headerClassName}
          />
        ) : isCloseButtonVisible ? (
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={closeAriaLabel}
          >
            <CloseIcon size={18} />
          </button>
        ) : null}

        {bodyClassName ? (
          <div className={bodyClassName}>
            {children}
          </div>
        ) : (
          children
        )}

        {footer}
      </div>
    </div>,
    document.body
  );
};

Modal.displayName = 'Modal';
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
