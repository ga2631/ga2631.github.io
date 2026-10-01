'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'flowbite-react';
import { ZoomInIcon, ZoomOutIcon, Maximize2Icon, RotateCcwIcon } from '../Icons';

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
      show={isOpen}
      onClose={onClose}
      size="7xl"
      dismissible
    >
      <ModalHeader>
        <div className="flex items-center justify-between gap-4 w-full pr-6">
          <div className="flex items-center gap-2">
            <Maximize2Icon size={16} className="text-red-600 flex-shrink-0" />
            <span className="font-bold text-gray-900 text-sm sm:text-base truncate max-w-md">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
            <Button
              color="light"
              size="xs"
              onClick={handleZoomOut}
              title="Zoom out (-)"
              className="p-1"
            >
              <ZoomOutIcon size={14} />
            </Button>
            <span className="font-mono font-bold px-2 text-center min-w-[45px]">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              color="light"
              size="xs"
              onClick={handleZoomIn}
              title="Zoom in (+)"
              className="p-1"
            >
              <ZoomInIcon size={14} />
            </Button>
            <Button
              color="light"
              size="xs"
              onClick={handleResetZoom}
              title="Reset view (100%)"
              className="ml-1"
            >
              <span className="flex items-center gap-1">
                <RotateCcwIcon size={12} />
                <span>Reset</span>
              </span>
            </Button>
          </div>
        </div>
      </ModalHeader>
      <ModalBody className="p-0 overflow-hidden bg-gray-50 h-[70vh]">
        <div
          className={`w-full h-full relative p-0 select-none overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="w-full h-full flex items-center justify-center p-8 origin-center transition-transform duration-75"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
            dangerouslySetInnerHTML={{ __html: processedSvg }}
          />
        </div>
      </ModalBody>
      <ModalFooter className="py-2 px-4 text-center text-xs text-gray-500 justify-center">
        <span>💡 Nhấp &amp; kéo để di chuyển • Cuộn chuột để phóng to/thu nhỏ • Nhấn <strong>Esc</strong> để đóng</span>
      </ModalFooter>
    </Modal>
  );
};

ModalDiagramViewer.displayName = 'ModalDiagramViewer';
