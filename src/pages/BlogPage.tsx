import React, { useState, useMemo, useEffect } from 'react';
import { BlogPost } from '../types/index.ts';
import {
  BookOpenIcon,
  CloseIcon,
  ExternalLinkIcon,
  SearchIcon,
  ArrowLeftIcon,
  SparklesIcon,
  CopyIcon,
  CheckIcon,
} from '../components/Icons.tsx';
import { UITranslation } from '../data/cvData.ts';

interface BlogPageProps {
  posts: BlogPost[];
  t: UITranslation['blog'];
  lang: 'vi' | 'en';
}

export const BlogPage: React.FC<BlogPageProps> = ({ posts, t }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Extract all unique tags across posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [posts]);

  // Sync with URL hash for deep linking (e.g. #/blog/post-slug)
  useEffect(() => {
    const checkHashForPost = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/blog/') && hash.length > 7) {
        const slug = hash.replace('#/blog/', '');
        const matchedPost = posts.find((p) => p.slug === slug || p.id === slug);
        if (matchedPost) {
          setActivePost(matchedPost);
        }
      }
    };

    checkHashForPost();
    window.addEventListener('hashchange', checkHashForPost);
    return () => window.removeEventListener('hashchange', checkHashForPost);
  }, [posts]);

  // Open / Close Post helper
  const handleOpenPost = (post: BlogPost) => {
    setActivePost(post);
    window.location.hash = `#/blog/${post.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClosePost = () => {
    setActivePost(null);
    window.location.hash = '#/blog';
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesTag && matchesQuery;
    });
  }, [posts, searchQuery, selectedTag]);

  return (
    <div className="blog-page-root">
      <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + 32px)', paddingBottom: '96px' }}>
        
        {/* Top Breadcrumb / Return Navigation Bar */}
        <div className="blog-top-bar">
          <a href="#/" className="btn btn-secondary btn-sm blog-back-btn">
            <ArrowLeftIcon size={16} />
            <span>{t.backToHome}</span>
          </a>

          <div className="blog-route-indicator">
            <span style={{ color: 'var(--text-muted)' }}>Portfolio</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Blog & Articles</span>
          </div>
        </div>

        {/* Dedicated Article Detail View (When an article is selected) */}
        {activePost ? (
          <article className="glass-panel blog-article-full-view">
            <div className="article-top-nav">
              <button onClick={handleClosePost} className="btn btn-secondary btn-sm">
                <ArrowLeftIcon size={15} />
                <span>{t.closeArticle}</span>
              </button>

              <button onClick={handleCopyLink} className="btn btn-outline btn-sm">
                {copiedLink ? (
                  <>
                    <CheckIcon size={14} style={{ color: 'var(--accent-emerald)' }} />
                    <span style={{ color: 'var(--accent-emerald)' }}>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size={14} />
                    <span>Share / Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="tech-tags-list" style={{ marginTop: '16px', marginBottom: '12px' }}>
              {activePost.tags.map((tag) => (
                <span key={tag} className="badge badge-cyan">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="article-full-title">{activePost.title}</h1>

            <div className="article-meta-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="avatar-inner" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                  TN
                </div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{activePost.author}</span>
              </div>
              <span>•</span>
              <span>📅 {activePost.publishedAt}</span>
              <span>•</span>
              <span>⏱️ {activePost.readTime}</span>
            </div>

            <div className="article-summary-callout">
              <strong>Overview: </strong>
              <span>{activePost.summary}</span>
            </div>

            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: activePost.contentHtml }}
            />

            <div className="article-bottom-bar">
              <button onClick={handleClosePost} className="btn btn-primary">
                <ArrowLeftIcon size={16} />
                <span>{t.closeArticle}</span>
              </button>

              <a href="#/" className="btn btn-secondary">
                <span>{t.backToHome}</span>
              </a>
            </div>
          </article>
        ) : (
          /* Main Blog Listing View */
          <>
            {/* Header Hero */}
            <div className="blog-hero-header">
              <span className="section-badge">
                <BookOpenIcon size={14} /> {t.badge}
              </span>
              <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                {t.title}
              </h1>
              <p className="section-subtitle" style={{ maxWidth: '780px', margin: '0 auto 36px' }}>
                {t.subtitle}
              </p>
            </div>

            {/* Search & Topic Filters Bar */}
            <div className="glass-panel blog-controls-panel">
              {/* Search Bar */}
              <div className="blog-search-wrapper">
                <SearchIcon size={18} className="search-input-icon" />
                <input
                  type="text"
                  className="blog-search-input"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <CloseIcon size={14} />
                  </button>
                )}
              </div>

              {/* Tag Filter Pills */}
              <div className="blog-tags-filter">
                <button
                  className={`blog-tag-pill ${selectedTag === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedTag('all')}
                >
                  <span>{t.allTopics}</span>
                  <span className="tag-count">{posts.length}</span>
                </button>
                {allTags.map((tag) => {
                  const count = posts.filter((p) => p.tags.includes(tag)).length;
                  return (
                    <button
                      key={tag}
                      className={`blog-tag-pill ${selectedTag === tag ? 'active' : ''}`}
                      onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
                    >
                      <span>#{tag}</span>
                      <span className="tag-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Count Info */}
            <div className="blog-results-meta">
              <span>
                Showing <strong>{filteredPosts.length}</strong> of {posts.length} articles
              </span>
              {(searchQuery || selectedTag !== 'all') && (
                <button
                  className="btn-text-reset"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag('all');
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>

            {/* Articles Grid */}
            {filteredPosts.length > 0 ? (
              <div className="blog-grid">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="glass-panel blog-card"
                    onClick={() => handleOpenPost(post)}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {post.publishedAt} • {post.readTime}
                        </span>
                        <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                          <SparklesIcon size={11} /> Article
                        </span>
                      </div>

                      <h2 className="blog-title" style={{ fontSize: '1.28rem' }}>{post.title}</h2>
                      <p className="blog-summary">{post.summary}</p>
                    </div>

                    <div>
                      <div className="tech-tags-list" style={{ marginBottom: '18px' }}>
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`badge ${selectedTag === tag ? 'badge-cyan' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(tag);
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPost(post);
                        }}
                      >
                        <span>{t.readArticle}</span>
                        <ExternalLinkIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center', marginTop: '24px' }}>
                <BookOpenIcon size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{t.noArticlesFound}</h3>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '16px' }}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag('all');
                  }}
                >
                  Reset Search & Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
