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
        className={`sticky top-0 z-20 flex items-center justify-between p-4 md:p-5 bg-white/95 backdrop-blur-md border-b border-gray-200 flex-shrink-0 transition-all ${className}`.trim()}
        {...restProps}
      >
        <div className="flex-1 min-w-0 pr-4">
          {title && (
            <span
              className={`block font-bold text-gray-900 text-sm sm:text-base truncate transition-opacity duration-200 ${
                isStickyTitleShown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
              }`}
              title={typeof title === 'string' ? title : undefined}
            >
              {title}
            </span>
          )}
        </div>
        {showCloseButton && onClose && (
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center cursor-pointer transition-colors"
            onClick={onClose}
            aria-label={closeAriaLabel}
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-start justify-between p-4 md:p-5 border-b border-gray-200 rounded-t flex-shrink-0 ${className}`.trim()} {...restProps}>
      {children ? (
        children
      ) : (
        <>
          <div className="flex-1 min-w-0 pr-4">
            {(badge || icon) && (
              <div className="flex items-center gap-2 mb-2">
                {icon}
                {badge}
              </div>
            )}
            {title && (
              typeof title === 'string' ? (
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              ) : (
                title
              )
            )}
            {subtitle && (
              typeof subtitle === 'string' ? (
                <p className="text-sm font-normal text-gray-500 mt-1">{subtitle}</p>
              ) : (
                subtitle
              )
            )}
          </div>
          {showCloseButton && onClose && (
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center cursor-pointer transition-colors"
              onClick={onClose}
              aria-label={closeAriaLabel}
            >
              <CloseIcon size={16} />
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
    <div className={`flex-1 overflow-y-auto p-4 md:p-5 space-y-4 text-gray-600 text-sm leading-relaxed ${className}`.trim()} {...restProps}>
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
      className={`flex items-center justify-end gap-3 p-4 md:p-5 border-t border-gray-200 rounded-b bg-gray-50/50 flex-shrink-0 ${className}`.trim()}
      {...restProps}
    >
      {children}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
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
  backdropClassName = 'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-xs',
  contentClassName = 'relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden',
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
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center cursor-pointer transition-colors absolute top-4 right-4 z-10"
            onClick={onClose}
            aria-label={closeAriaLabel}
          >
            <CloseIcon size={16} />
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
