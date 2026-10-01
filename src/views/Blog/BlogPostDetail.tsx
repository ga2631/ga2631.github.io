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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back to Blog Breadcrumb */}
      <div>
        <Link
          href={getLocalizedHref('blog')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{dict.blog.backToBlog}</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-gray-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {post.category && (
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
              {post.category}
            </span>
          )}
          <span className="text-xs text-gray-500 font-mono">•</span>
          <span className="text-xs text-gray-400 font-mono">{post.date}</span>
          <span className="text-xs text-gray-500 font-mono">•</span>
          <span className="text-xs text-indigo-400 font-semibold">{post.readTime}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        {post.summary && (
          <p className="text-base text-gray-300 leading-relaxed italic border-l-2 border-indigo-500 pl-4">
            {post.summary}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {post.tags.map((tg, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-gray-900 text-gray-400 text-[11px] font-mono border border-gray-800"
              >
                #{tg}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Main Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table of Contents (Sticky on Desktop) */}
        {toc.length > 0 && (
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 glass-panel p-4 rounded-2xl border border-gray-800 space-y-3">
              <div className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                {dict.blog.tocTitle}
              </div>
              <nav className="space-y-1.5 text-xs">
                {toc.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#${item.id}`}
                    onClick={() => handleTocClick(item)}
                    className={`block text-gray-400 hover:text-indigo-400 transition-colors truncate ${
                      item.level === 3 ? 'pl-2 text-[11px]' : ''
                    } ${item.level === 4 ? 'pl-4 text-[10px]' : ''}`}
                    title={item.text}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Article Body */}
        <article className={`${toc.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          <div
            className="prose-custom text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </div>

      {/* Article Footer */}
      <footer className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
            T
          </div>
          <div>
            <div className="text-xs font-bold text-white">{post.author}</div>
            <div className="text-[11px] text-gray-400">Software Architect</div>
          </div>
        </div>

        <Link
          href={getLocalizedHref('blog')}
          className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 text-xs font-semibold border border-gray-700 transition-colors"
        >
          {dict.blog.backToBlog}
        </Link>
      </footer>
    </div>
  );
}
