import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../Icons';

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
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  stickyHeader = false,
  isStickyTitleShown = false,
  showCloseButton = true,
  closeAriaLabel = 'Close modal',
  backdropClassName = 'blog-modal-backdrop',
  contentClassName = 'blog-modal-content',
  headerClassName = '',
  bodyClassName = '',
  contentRef,
  onContentScroll,
  ariaLabelledBy,
  children,
}) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const activeContentRef = contentRef || internalRef;

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
    >
      <div
        ref={activeContentRef as any}
        className={contentClassName}
        onClick={(e) => e.stopPropagation()}
        onScroll={onContentScroll}
      >
        {stickyHeader ? (
          <div
            className={`modal-sticky-header ${isStickyTitleShown ? 'has-title' : ''} ${headerClassName}`.trim()}
          >
            <div className="modal-header-title-wrapper">
              {title && (
                <span className="modal-header-article-title" title={typeof title === 'string' ? title : undefined}>
                  {title}
                </span>
              )}
            </div>
            {showCloseButton && (
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
        ) : title ? (
          <div className={`modal-header ${headerClassName}`.trim()}>
            <div className="modal-title-wrapper">{title}</div>
            {showCloseButton && (
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
        ) : showCloseButton ? (
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={closeAriaLabel}
          >
            <CloseIcon size={18} />
          </button>
        ) : null}

        <div className={bodyClassName || undefined}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
