import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon, ZoomInIcon, ZoomOutIcon, Maximize2Icon, RotateCcwIcon } from '../Icons';

export interface ModalDiagramViewerProps {
  isOpen: boolean;
  onClose: () => void;
  svgContent: string | null;
  title?: string;
  closeAriaLabel?: string;
}

export const ModalDiagramViewer: React.FC<ModalDiagramViewerProps> = ({
  isOpen,
  onClose,
  svgContent,
  title = 'Diagram Fit View',
  closeAriaLabel = 'Close diagram view',
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialPanX: number; initialPanY: number }>({
    startX: 0,
    startY: 0,
    initialPanX: 0,
    initialPanY: 0,
  });

  // Reset zoom and pan when opening a new diagram
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen, svgContent]);

  // Lock body scroll and intercept Escape key to prevent closing parent modal
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        onClose();
      }
    };

    // Use capture phase to intercept before parent modal's listener
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, onClose]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 3.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.25, 0.4));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.4), 3.5));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only drag with left mouse click
      if (e.button !== 0) return;
      setIsDragging(true);
      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
      };
    },
    [pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      setPan({
        x: dragStartRef.current.initialPanX + dx,
        y: dragStartRef.current.initialPanY + dy,
      });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processedSvg = React.useMemo(() => {
    if (!svgContent) return '';
    return svgContent
      .replace(/style="([^"]*max-width:[^;"]*;?)([^"]*)"/i, 'style="$2"')
      .replace(/<svg\b([^>]*)\bwidth="[^"]*"/i, '<svg$1 width="100%"')
      .replace(/<svg\b((?:(?!width=)[^>])*?)>/i, '<svg$1 width="100%">');
  }, [svgContent]);

  if (!isOpen || !svgContent) return null;

  return createPortal(
    <div
      className="diagram-viewer-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Top Floating Control Bar */}
      <div
        className="diagram-viewer-header"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="diagram-viewer-info">
          <span className="diagram-viewer-badge" title={title}>
            <Maximize2Icon size={14} />
            <span className="diagram-viewer-title-text" title={title}>{title}</span>
          </span>
        </div>


        {/* Interactive Controls */}
        <div className="diagram-viewer-controls">
          <button
            type="button"
            className="diagram-viewer-btn"
            onClick={handleZoomOut}
            title="Zoom out (-)"
            aria-label="Zoom out"
          >
            <ZoomOutIcon size={14} />
          </button>
          <span className="diagram-viewer-zoom-level" title="Current zoom level">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            className="diagram-viewer-btn"
            onClick={handleZoomIn}
            title="Zoom in (+)"
            aria-label="Zoom in"
          >
            <ZoomInIcon size={14} />
          </button>
          <div className="diagram-viewer-divider" />
          <button
            type="button"
            className="diagram-viewer-btn"
            onClick={handleResetZoom}
            title="Reset view (100%)"
            aria-label="Reset zoom and position"
          >
            <RotateCcwIcon size={14} />
            <span style={{ marginLeft: '4px' }}>Reset</span>
          </button>
        </div>

        {/* Prominent Top-Right Close Button */}
        <div className="diagram-viewer-actions">
          <button
            type="button"
            className="diagram-viewer-close-btn"
            onClick={onClose}
            aria-label={closeAriaLabel}
            title={`${closeAriaLabel} (Esc)`}
          >
            <CloseIcon size={18} />
          </button>
        </div>
      </div>

      {/* Main Fullscreen Viewport Area */}
      <div
        className={`diagram-viewer-viewport ${isDragging ? 'is-dragging' : ''}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="diagram-viewer-canvas"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
          dangerouslySetInnerHTML={{ __html: processedSvg }}
        />
      </div>


      {/* Bottom helper tip */}
      <div className="diagram-viewer-hint" onClick={(e) => e.stopPropagation()}>
        <span>💡 Nhấp &amp; kéo để di chuyển • Cuộn chuột để phóng to/thu nhỏ • Nhấn <strong>Esc</strong> để đóng</span>
      </div>
    </div>,
    document.body
  );
};

ModalDiagramViewer.displayName = 'ModalDiagramViewer';
