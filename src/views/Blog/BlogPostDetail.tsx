'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { getPostContentHtml, getBlogCategories } from '@/services/blogService';
import { BlogPost } from '@/types';
import { trackBlogPostView, trackTocHeadingClick } from '@/utils/analytics';
import { getCategoryColorClasses } from '@/utils/categoryColors';

function getCategoryColor(category?: string) {
  switch (category) {
    case 'kien-truc-he-thong':
    case 'architecture-system-design':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'thuat-toan-va-hieu-nang-core':
    case 'thuat-toan-hieu-nang':
    case 'ky-thuat-lap-trinh':
    case 'core-algorithms-series':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'co-so-du-lieu-va-data-engineering':
    case 'ky-thuat-va-phan-tich-du-lieu':
    case 'ky-thuat-du-lieu':
    case 'database-data-engineering':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'frontend-va-ui-tai-su-dung':
    case 'devops-cloud-va-cong-cu':
    case 'dry-reusable-ui-components':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'tech-radar-va-goc-nhin-nghe-nghiep':
    case 'tech-radar-va-goc-nhin':
    case 'tech-radar-career-insights':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-red-50 text-red-700 border-red-200';
  }
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function BlogPostDetailSkeleton() {
  const { dict, getLocalizedHref } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto space-y-6" role="status" aria-label="Loading article detail">
      {/* Back to Blog Breadcrumb */}
      <div>
        <Link
          href={getLocalizedHref ? getLocalizedHref('blog') : '/vi/blog'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{dict?.blog?.backToBlog || 'Quay lại danh sách bài viết'}</span>
        </Link>
      </div>

      {/* Article Header Card Skeleton */}
      <header className="bg-white backdrop-blur-sm border border-gray-100 border-t-4 border-t-red-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 animate-pulse">
        <div className="flex items-center gap-2">
          {/* Category Badge Pill */}
          <div className="h-6 w-28 bg-gray-100 rounded-full" />
          <span className="text-xs text-gray-300 font-mono">•</span>
          {/* Date */}
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <span className="text-xs text-gray-300 font-mono">•</span>
          {/* Read Time */}
          <div className="h-4 w-20 bg-gray-100 rounded" />
        </div>

        {/* Title */}
        <div className="space-y-2.5 pt-1">
          <div className="h-8 sm:h-9 w-4/5 bg-gray-200 rounded-lg" />
          <div className="h-8 sm:h-9 w-3/5 bg-gray-200 rounded-lg" />
        </div>

        {/* Summary Callout Box */}
        <div className="border-l-4 border-red-200/70 bg-red-50/40 p-4 rounded-r-xl space-y-2">
          <div className="h-4 w-full bg-gray-200/70 rounded" />
          <div className="h-4 w-4/5 bg-gray-200/70 rounded" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          <div className="h-6 w-24 bg-gray-100 rounded-md" />
          <div className="h-6 w-20 bg-gray-100 rounded-md" />
          <div className="h-6 w-28 bg-gray-100 rounded-md" />
        </div>
      </header>

      {/* Main Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Article Body Skeleton */}
        <article className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white backdrop-blur-sm border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-pulse">
            {/* Intro Paragraph */}
            <div className="space-y-2.5">
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-[95%] bg-gray-100 rounded" />
              <div className="h-4 w-[90%] bg-gray-100 rounded" />
              <div className="h-4 w-[75%] bg-gray-100 rounded" />
            </div>

            {/* Heading 2 + Paragraph */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="h-6 w-2/5 bg-gray-200 rounded-md" />
              <div className="space-y-2.5">
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-[92%] bg-gray-100 rounded" />
                <div className="h-4 w-[85%] bg-gray-100 rounded" />
              </div>
            </div>

            {/* Code Block Skeleton */}
            <div className="bg-gray-900/10 rounded-xl p-5 space-y-2.5 my-4 border border-gray-100">
              <div className="h-3.5 w-1/3 bg-gray-300/80 rounded" />
              <div className="h-3.5 w-2/3 bg-gray-300/80 rounded" />
              <div className="h-3.5 w-1/2 bg-gray-300/80 rounded" />
              <div className="h-3.5 w-3/4 bg-gray-300/80 rounded" />
            </div>

            {/* Heading 2 + Paragraph */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="h-6 w-1/3 bg-gray-200 rounded-md" />
              <div className="space-y-2.5">
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-[96%] bg-gray-100 rounded" />
                <div className="h-4 w-[80%] bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </article>

        {/* Table of Contents Skeleton Card (Sticky on Desktop) */}
        <aside className="lg:col-span-4 xl:col-span-3 hidden lg:block sticky top-24">
          <div className="bg-white backdrop-blur-sm border border-gray-100 border-t-4 border-t-red-200/60 rounded-3xl p-5 shadow-sm space-y-3 animate-pulse">
            <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                {dict?.blog?.tocTitle || 'Mục Lục Bài Viết'}
              </h3>
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-4/5 bg-gray-100 rounded" />
              <div className="h-3.5 w-3/4 bg-gray-100 rounded ml-2" />
              <div className="h-3.5 w-5/6 bg-gray-100 rounded ml-2" />
              <div className="h-3.5 w-2/3 bg-gray-100 rounded" />
              <div className="h-3.5 w-4/5 bg-gray-100 rounded ml-2" />
              <div className="h-3.5 w-1/2 bg-gray-100 rounded" />
            </div>
          </div>
        </aside>
      </div>

      {/* Article Footer Skeleton */}
      <footer className="bg-white backdrop-blur-sm border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200" />
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-3 w-36 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="h-8 w-32 bg-gray-100 rounded-xl" />
      </footer>
    </div>
  );
}

export function BlogPostDetailView({
  post,
  isLoading = false,
}: {
  post?: BlogPost | null;
  isLoading?: boolean;
}) {
  const { dict, currentLang, getLocalizedHref } = useLanguage();
  const isEn = currentLang === 'en';
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(false);
  const [isStickyDetailsOpen, setIsStickyDetailsOpen] = useState<boolean>(false);
  const [categoryTitle, setCategoryTitle] = useState<string>(post?.categoryName || '');
  const [categoryColor, setCategoryColor] = useState<string>(post?.categoryColor || '');
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (post?.categoryName) {
      setCategoryTitle(post.categoryName);
    }
    if (post?.categoryColor) {
      setCategoryColor(post.categoryColor);
    }
    if (!post?.category) return;
    const postCat = post.category;
    let isMounted = true;
    getBlogCategories(currentLang)
      .then((cats) => {
        if (!isMounted) return;
        const cat = cats.find((c) => c.id === postCat || Boolean(c.allSlugs?.includes(postCat)));
        if (cat) {
          const title = cat.title[currentLang] || cat.title.vi || cat.title.en;
          if (title) setCategoryTitle(title);
          if (cat.color) setCategoryColor(cat.color);
        }
      })
      .catch(() => { });
    return () => {
      isMounted = false;
    };
  }, [post?.category, post?.categoryName, post?.categoryColor, currentLang]);

  // Render Mermaid diagrams on the client
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isMounted = true;
    import('mermaid')
      .then((m) => {
        if (!isMounted) return;
        m.default.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
          fontFamily: 'Roboto, sans-serif',
        });

        const containers = document.querySelectorAll('.mermaid-diagram');
        containers.forEach(async (el, idx) => {
          const rawCode = decodeURIComponent(el.getAttribute('data-mermaid') || '');
          if (rawCode) {
            try {
              const uniqueId = `mermaid-detail-svg-${idx}-${Date.now()}`;
              const { svg } = await m.default.render(uniqueId, rawCode);
              el.innerHTML = svg;
            } catch {
              // keep fallback
            }
          }
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [post?.content, post?.contentHtml]);

  useEffect(() => {
    if (!post) return;
    trackBlogPostView(post, currentLang);

    // Extract headings from markdown content for TOC
    const content = post.content || '';
    const headingMatches = content.match(/^(#{2,4})\s+(.+)$/gm) || [];
    const items: TocItem[] = headingMatches.map((h) => {
      const level = (h.match(/^#+/) || ['##'])[0].length;
      const text = h.replace(/^#+\s+/, '').trim();
      const id = text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return { id, text, level };
    });
    setToc(items);
  }, [post, currentLang]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past the main header
      if (headerRef.current) {
        const headerRect = headerRef.current.getBoundingClientRect();
        const collapsed = headerRect.bottom < 72;
        setIsHeaderCollapsed(collapsed);
        if (!collapsed) {
          setIsStickyDetailsOpen(false);
        }
      } else {
        const collapsed = window.scrollY > 280;
        setIsHeaderCollapsed(collapsed);
        if (!collapsed) {
          setIsStickyDetailsOpen(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (isLoading || !post) {
    return <BlogPostDetailSkeleton />;
  }

  const htmlContent = getPostContentHtml(post);

  const handleTocClick = (item: TocItem) => {
    trackTocHeadingClick(post.slug, item.id, item.text);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Collapsed Anchored Header Bar (Appears when scrolled past full header) */}
      <div
        className={`fixed top-[64px] lg:top-[72px] inset-x-0 z-30 transition-all duration-300 ease-in-out px-4 py-2 pointer-events-none ${isHeaderCollapsed
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4'
          }`}
        role="region"
        aria-label="Sticky article header"
        aria-hidden={!isHeaderCollapsed}
      >
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md border border-gray-200/90 border-t-4 border-t-red-500 rounded-2xl shadow-lg shadow-gray-900/5 transition-all duration-300 overflow-hidden pointer-events-auto">
            {/* Clickable Title Row: Clicking toggles summary & tags */}
            <button
              type="button"
              onClick={() => setIsStickyDetailsOpen((prev) => !prev)}
              className="w-full p-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer group hover:bg-gray-50/60 transition-colors"
              aria-expanded={isStickyDetailsOpen}
              aria-controls="sticky-article-details"
              title={
                isStickyDetailsOpen
                  ? (isEn ? 'Collapse summary & tags' : 'Thu gọn tóm tắt & thẻ')
                  : (isEn ? 'Show summary & tags' : 'Xem tóm tắt & thẻ')
              }
            >
              {/* Left: Category Badge + Title */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {post.category && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0 hidden sm:inline-block ${
                      categoryColor
                        ? getCategoryColorClasses(categoryColor).badge
                        : getCategoryColor(post.category)
                    }`}
                  >
                    {categoryTitle || post.category}
                  </span>
                )}
                <h2 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate tracking-tight">
                  {post.title}
                </h2>
              </div>

              {/* Right: Expand/Collapse indicator Chevron */}
              <div className="flex items-center gap-1.5 shrink-0 text-gray-400 group-hover:text-red-600 transition-colors">
                <span className="text-[11px] font-medium hidden md:inline text-gray-500">
                  {isStickyDetailsOpen
                    ? (isEn ? 'Collapse' : 'Thu gọn')
                    : (isEn ? 'Details' : 'Chi tiết')}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isStickyDetailsOpen ? 'rotate-180 text-red-600' : 'text-gray-400 group-hover:text-red-600'
                    }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Expandable Content: Summary and Tags */}
            {isStickyDetailsOpen && (
              <div
                id="sticky-article-details"
                className="px-4 pb-4 pt-1 sm:px-5 sm:pb-4 border-t border-gray-100 bg-gray-50/50 space-y-3"
              >
                {post.summary && (
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic border-l-3 border-red-500 bg-white p-3 rounded-r-xl shadow-2xs">
                    {post.summary}
                  </p>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {post.tags.map((tg, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white text-gray-700 text-[11px] font-mono border border-gray-200 shadow-2xs"
                      >
                        #{tg}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Header Card */}
      <header
        ref={headerRef}
        className="bg-white backdrop-blur-sm border border-gray-100 border-t-4 border-t-red-500 hover:border-red-500 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all ease-in-out space-y-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          {post.category && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                categoryColor
                  ? getCategoryColorClasses(categoryColor).badge
                  : getCategoryColor(post.category)
              }`}
            >
              {categoryTitle || post.category}
            </span>
          )}
          <span className="text-xs text-gray-400 font-mono">•</span>
          <span className="text-xs text-gray-500 font-mono">{post.date}</span>
          <span className="text-xs text-gray-400 font-mono">•</span>
          <span className="text-xs text-gray-700 font-semibold">{post.readTime}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        {post.summary && (
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic border-l-4 border-red-500 bg-red-50/50 p-4 rounded-r-xl">
            {post.summary}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {post.tags.map((tg, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-mono border border-gray-200"
              >
                #{tg}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Main Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Article Body */}
        <article className={`${toc.length > 0 ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'}`}>
          <div className="bg-white backdrop-blur-sm border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all ease-in-out">
            <div
              className="space-y-4 text-gray-800 leading-relaxed text-sm sm:text-base [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:pt-4 [&>h2]:border-t [&>h2]:border-gray-100 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1 [&>blockquote]:border-l-4 [&>blockquote]:border-red-400 [&>blockquote]:bg-red-50/40 [&>blockquote]:p-3.5 [&>blockquote]:rounded-r-lg [&>blockquote]:italic [&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>pre]:my-4 [&>pre]:text-xs [&>pre]:sm:text-sm [&>pre]:font-mono [&>code]:bg-gray-100 [&>code]:text-red-600 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>code]:font-mono [&>img]:rounded-xl [&>img]:my-4 [&>img]:shadow-xs"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </article>

        {/* Table of Contents (Sticky on Desktop) */}
        {toc.length > 0 && (
          <aside className="lg:col-span-4 xl:col-span-3 hidden lg:block sticky top-32 lg:top-36">
            <div className="bg-white backdrop-blur-sm border border-gray-100 border-t-4 border-t-red-500 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all ease-in-out space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  {dict.blog.tocTitle}
                </h3>
              </div>
              <nav className="space-y-1 text-xs max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                {toc.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#${item.id}`}
                    onClick={() => handleTocClick(item)}
                    className={`block text-gray-600 hover:text-red-600 hover:font-medium transition-colors truncate py-1 ${item.level === 3 ? 'pl-3 text-[11px]' : ''
                      } ${item.level === 4 ? 'pl-5 text-[10px]' : ''}`}
                    title={item.text}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>

      {/* Floating Back to Blog Button */}
      <Link
        href={getLocalizedHref('blog')}
        aria-label={dict.blog.backToBlog}
        title={dict.blog.backToBlog}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg shadow-red-500/35 hover:shadow-xl hover:shadow-red-500/45 transition-all duration-300 ease-out hover:-translate-y-1 active:scale-95 group cursor-pointer"
      >
        <svg
          className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="tracking-tight">{dict.blog.backToBlog}</span>
      </Link>
    </div>
  );
}
