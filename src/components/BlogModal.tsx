'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Badge, Button } from 'flowbite-react';
import { BlogPost } from '../types';
import {
  CalendarIcon,
  ClockIcon,
  ListIcon,
  Maximize2Icon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCcwIcon,
} from './Icons';

export interface TocItem {
  id: string;
  text: string;
  level: 1 | 2;
  tagName: string;
}

export interface ProcessedContent {
  processedHtml: string;
  tocItems: TocItem[];
}

export const processArticleToc = (html: string): ProcessedContent => {
  if (typeof window === 'undefined' || !html) {
    return { processedHtml: html, tocItems: [] };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));

  if (headings.length === 0) {
    return { processedHtml: html, tocItems: [] };
  }

  const distinctTags = Array.from(new Set(headings.map((h) => h.tagName.toLowerCase()))).sort();
  const topTwoTags = distinctTags.slice(0, 2);

  const usedIds = new Set<string>();
  const tocItems: TocItem[] = [];

  headings.forEach((heading) => {
    const tagName = heading.tagName.toLowerCase();
    if (!topTwoTags.includes(tagName)) return;

    const text = heading.textContent?.trim() || '';
    if (!text) return;

    let rawSlug = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    if (!rawSlug) rawSlug = 'section';
    let uniqueId = `toc-${rawSlug}`;
    let counter = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = `toc-${rawSlug}-${counter}`;
      counter++;
    }
    usedIds.add(uniqueId);

    const level = (topTwoTags.indexOf(tagName) + 1) as 1 | 2;
    tocItems.push({
      id: uniqueId,
      text,
      level,
      tagName,
    });
  });

  let index = 0;
  headings.forEach((heading) => {
    const tagName = heading.tagName.toLowerCase();
    if (topTwoTags.includes(tagName) && tocItems[index]) {
      heading.id = tocItems[index].id;
      heading.classList.add('article-heading-target');
      index++;
    }
  });

  return {
    processedHtml: doc.body.innerHTML,
    tocItems,
  };
};

export const ArticleBody: React.FC<{
  processedHtml: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}> = React.memo(
  ({ processedHtml, onClick, onKeyDown }) => {
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const container = bodyRef.current;
      if (!container || !processedHtml) return;

      container.innerHTML = processedHtml;

      const mermaidBlocks = container.querySelectorAll<HTMLElement>('pre.mermaid, .mermaid');
      if (mermaidBlocks.length === 0) return;

      let isCancelled = false;

      const renderDiagrams = async () => {
        try {
          const mermaidModule = await import('mermaid');
          const mermaid = mermaidModule.default;
          if (isCancelled) return;

          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'base',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            themeVariables: {
              darkMode: false,
              background: '#ffffff',
              mainBkg: '#ffffff',
              primaryColor: '#ffffff',
              textColor: '#0f172a',
              nodeTextColor: '#0f172a',
              primaryTextColor: '#0f172a',
              noteBorderColor: '#dc2626',
              primaryBorderColor: '#dc2626',
              nodeBorder: '#dc2626',
              lineColor: '#dc2626',
              labelBackgroundColor: '#dc2626',
              labelTextColor: '#f8fafc',
              tertiaryTextColor: '#f8fafc',
              transitionLabelColor: '#f8fafc',
            },
            themeCSS: `
              .edgeLabel .labelBkg,
              .edgeLabel, .edgeLabel span p {
                background-color: #ffffff80 !important;
              }
              `,
          });

          for (let i = 0; i < mermaidBlocks.length; i++) {
            if (isCancelled) return;
            const el = mermaidBlocks[i];
            const rawCode = el.textContent || '';
            const cleanCode = rawCode
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .trim();

            if (!cleanCode) continue;

            const uniqueId = `mermaid-svg-${Date.now()}-${i}`;
            try {
              const { svg } = await mermaid.render(uniqueId, cleanCode);
              if (!isCancelled) {
                el.innerHTML =
                  svg +
                  '<span class="mermaid-fit-hint"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg> Fit View</span>';
                el.classList.add('mermaid-rendered');
                el.setAttribute('tabindex', '0');
                el.setAttribute('role', 'button');
                el.setAttribute('aria-label', 'Phóng to sơ đồ (Fit View)');
                el.setAttribute('title', 'Nhấn để phóng to toàn màn hình (Fit View)');
              }
            } catch (renderErr) {
              console.error('Failed to render Mermaid diagram:', renderErr);
            }
          }
        } catch (err) {
          console.error('Failed to initialize mermaid:', err);
        }
      };

      renderDiagrams();

      return () => {
        isCancelled = true;
      };
    }, [processedHtml]);

    return (
      <div
        ref={bodyRef}
        className="article-prose"
        onClick={onClick}
        onKeyDown={onKeyDown}
      />
    );
  },
  (prev, next) => prev.processedHtml === next.processedHtml
);
ArticleBody.displayName = 'ArticleBody';

export interface BlogModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  processedHtml: string;
  tocItems: TocItem[];
  tCommon: {
    overview: string;
    tableOfContents: string;
  };
}

export const BlogModal: React.FC<BlogModalProps> = ({
  post,
  isOpen,
  onClose,
  processedHtml,
  tocItems,
  tCommon,
}) => {
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [fitViewSvg, setFitViewSvg] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialPanX: number; initialPanY: number }>({
    startX: 0,
    startY: 0,
    initialPanX: 0,
    initialPanY: 0,
  });

  const modalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fitViewSvg) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [fitViewSvg]);

  const handleZoomIn = useCallback(() => setZoom((prev) => Math.min(prev + 0.25, 3.5)), []);
  const handleZoomOut = useCallback(() => setZoom((prev) => Math.max(prev - 0.25, 0.4)), []);
  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.4), 3.5));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y,
    };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    setPan({
      x: dragStartRef.current.initialPanX + dx,
      y: dragStartRef.current.initialPanY + dy,
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleSelectHeading = (id: string) => {
    const container = modalBodyRef.current;
    if (!container) return;

    const targetEl = document.getElementById(id);
    if (targetEl) {
      const containerTop = container.getBoundingClientRect().top;
      const targetTop = targetEl.getBoundingClientRect().top;
      const currentScroll = container.scrollTop;
      const targetScroll = currentScroll + (targetTop - containerTop) - 20;

      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
      setActiveHeadingId(id);
    }
  };

  const handleArticleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const mermaidContainer = target.closest<HTMLElement>('.mermaid-rendered, pre.mermaid');
    if (mermaidContainer) {
      const svgEl = mermaidContainer.querySelector('svg');
      if (svgEl) {
        setFitViewSvg(svgEl.outerHTML);
      }
    }
  };

  const handleArticleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      const mermaidContainer = target.closest<HTMLElement>('.mermaid-rendered, pre.mermaid');
      if (mermaidContainer) {
        e.preventDefault();
        const svgEl = mermaidContainer.querySelector('svg');
        if (svgEl) {
          setFitViewSvg(svgEl.outerHTML);
        }
      }
    }
  };

  if (!post) return null;

  return (
    <>
      <Modal
        show={isOpen}
        onClose={onClose}
        size="5xl"
        dismissible
      >
        <ModalHeader>
          <div className="flex flex-col gap-1 pr-6">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} color="info" size="xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <span id="article-modal-title" className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
              {post.title}
            </span>
          </div>
        </ModalHeader>
        <ModalBody ref={modalBodyRef}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-5 pb-4 border-b border-gray-200">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon size={14} /> <span>{post.publishedAt}</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon size={14} /> <span>{post.readTime}</span>
                </span>
              </div>

              {post.summary && (
                <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-gray-700 text-sm leading-relaxed">
                  <strong className="text-red-700 font-bold">{tCommon.overview}: </strong>
                  <span>{post.summary}</span>
                </div>
              )}

              <ArticleBody
                processedHtml={processedHtml}
                onClick={handleArticleClick}
                onKeyDown={handleArticleKeyDown}
              />
            </div>

            {tocItems.length > 0 && (
              <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-4 self-start pl-5 border-s border-gray-200" aria-label="Table of Contents">
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <ListIcon size={15} />
                  <span>{tCommon.tableOfContents}</span>
                </div>
                <nav>
                  <ul className="flex flex-col gap-1 text-xs">
                    {tocItems.map((item) => (
                      <li
                        key={item.id}
                        className={`transition-colors ${item.level === 2 ? 'pl-3' : ''}`}
                      >
                        <a
                          href={`#${item.id}`}
                          className={`block py-1 leading-snug truncate transition-colors ${
                            activeHeadingId === item.id
                              ? 'text-red-600 font-bold'
                              : 'text-gray-600 hover:text-red-600 font-medium'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelectHeading(item.id);
                          }}
                          title={item.text}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            )}
          </div>
        </ModalBody>
      </Modal>

      {/* Diagram Fullscreen Zoom Modal */}
      {fitViewSvg && (
        <Modal
          show={Boolean(fitViewSvg)}
          onClose={() => setFitViewSvg(null)}
          size="7xl"
          dismissible
        >
          <ModalHeader>
            <div className="flex items-center justify-between gap-4 w-full pr-6">
              <div className="flex items-center gap-2">
                <Maximize2Icon size={16} className="text-red-600 flex-shrink-0" />
                <span className="font-bold text-gray-900 text-sm sm:text-base truncate max-w-md">
                  {post.title}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
                <Button color="light" size="xs" onClick={handleZoomOut} title="Zoom out (-)" className="p-1">
                  <ZoomOutIcon size={14} />
                </Button>
                <span className="font-mono font-bold px-2 text-center min-w-[45px]">
                  {Math.round(zoom * 100)}%
                </span>
                <Button color="light" size="xs" onClick={handleZoomIn} title="Zoom in (+)" className="p-1">
                  <ZoomInIcon size={14} />
                </Button>
                <Button color="light" size="xs" onClick={handleResetZoom} title="Reset" className="ml-1">
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
                dangerouslySetInnerHTML={{ __html: fitViewSvg }}
              />
            </div>
          </ModalBody>
          <ModalFooter className="py-2 px-4 text-center text-xs text-gray-500 justify-center">
            <span>💡 Nhấp &amp; kéo để di chuyển • Cuộn chuột để phóng to/thu nhỏ • Nhấn <strong>Esc</strong> để đóng</span>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

export default BlogModal;
