'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal } from '../common/Modal';
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      closeAriaLabel={closeAriaLabel}
      ariaLabel={title}
      backdropClassName="fixed inset-0 z-[1100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md"
      contentClassName="relative w-[96vw] max-w-7xl h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden"
      header={
        <div
          className="flex items-center justify-between px-5 py-3 border-b border-slate-200/80 bg-white/95 backdrop-blur-md flex-shrink-0 gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center min-w-0 pr-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold max-w-[200px] sm:max-w-xs truncate" title={title}>
              <Maximize2Icon size={14} className="flex-shrink-0" />
              <span className="truncate">{title}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700">
            <button
              type="button"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-red-600 transition-colors cursor-pointer"
              onClick={handleZoomOut}
              title="Zoom out (-)"
              aria-label="Zoom out"
            >
              <ZoomOutIcon size={14} />
            </button>
            <span className="font-mono font-bold px-1 min-w-[42px] text-center" title="Current zoom level">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-red-600 transition-colors cursor-pointer"
              onClick={handleZoomIn}
              title="Zoom in (+)"
              aria-label="Zoom in"
            >
              <ZoomInIcon size={14} />
            </button>
            <div className="w-px h-4 bg-slate-300 mx-1" />
            <button
              type="button"
              className="px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-slate-600 hover:bg-white hover:text-red-600 transition-colors cursor-pointer font-semibold"
              onClick={handleResetZoom}
              title="Reset view (100%)"
              aria-label="Reset zoom and position"
            >
              <RotateCcwIcon size={13} />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              onClick={onClose}
              aria-label={closeAriaLabel}
              title={`${closeAriaLabel} (Esc)`}
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>
      }
      footer={
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-500 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <span>💡 Nhấp &amp; kéo để di chuyển • Cuộn chuột để phóng to/thu nhỏ • Nhấn <strong>Esc</strong> để đóng</span>
        </div>
      }
    >
      <div
        className={`flex-1 overflow-hidden relative bg-slate-50/50 p-0 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full h-full flex items-center justify-center p-8 origin-center transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
          dangerouslySetInnerHTML={{ __html: processedSvg }}
        />
      </div>
    </Modal>
  );
};

ModalDiagramViewer.displayName = 'ModalDiagramViewer';
