'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { getPostContentHtml } from '@/services/blogService';
import { BlogPost } from '@/types';
import { trackBlogPostView, trackTocHeadingClick } from '@/utils/analytics';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function BlogPostDetailView({ post }: { post: BlogPost }) {
  const { dict, currentLang, getLocalizedHref } = useLanguage();
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
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

  const htmlContent = getPostContentHtml(post);

  const handleTocClick = (item: TocItem) => {
    trackTocHeadingClick(post.slug, item.id, item.text);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back to Blog Breadcrumb */}
      <div>
        <Link
          href={getLocalizedHref('blog')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{dict.blog.backToBlog}</span>
        </Link>
      </div>

      {/* Article Header Card */}
      <header className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {post.category && (
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {post.category}
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
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div
              className="space-y-4 text-gray-800 leading-relaxed text-sm sm:text-base [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:pt-4 [&>h2]:border-t [&>h2]:border-gray-100 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1 [&>blockquote]:border-l-4 [&>blockquote]:border-red-400 [&>blockquote]:bg-red-50/40 [&>blockquote]:p-3.5 [&>blockquote]:rounded-r-lg [&>blockquote]:italic [&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>pre]:my-4 [&>pre]:text-xs [&>pre]:sm:text-sm [&>pre]:font-mono [&>code]:bg-gray-100 [&>code]:text-red-600 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>code]:font-mono [&>img]:rounded-xl [&>img]:my-4 [&>img]:shadow-xs"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </article>

        {/* Table of Contents (Sticky on Desktop) */}
        {toc.length > 0 && (
          <aside className="lg:col-span-4 xl:col-span-3 hidden lg:block sticky top-24">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
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
                    className={`block text-gray-600 hover:text-red-600 hover:font-medium transition-colors truncate py-1 ${
                      item.level === 3 ? 'pl-3 text-[11px]' : ''
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

      {/* Article Footer */}
      <footer className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-red-500/20">
            T
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">{post.author}</div>
            <div className="text-[11px] text-gray-500">{dict.blog.authorRole || 'Kỹ sư Full stack & Dữ liệu'}</div>
          </div>
        </div>

        <Link
          href={getLocalizedHref('blog')}
          className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200 hover:text-red-600 transition-colors shadow-2xs"
        >
          {dict.blog.backToBlog}
        </Link>
      </footer>
    </div>
  );
}
