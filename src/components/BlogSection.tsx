import React, { useState } from 'react';
import { BlogPost } from '../types/index.ts';
import { BookOpenIcon, CloseIcon, ExternalLinkIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';

interface BlogSectionProps {
  posts: BlogPost[];
  t: UITranslation['blog'];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts, t }) => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  return (
    <section className="section" id="blog">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <BookOpenIcon size={14} /> {t.badge}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">
            {t.subtitle}
          </p>
        </div>

        <div className="blog-grid">
          {posts.map((post) => (
            <div
              key={post.id}
              className="glass-panel blog-card"
              onClick={() => setActivePost(post)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {post.publishedAt} • {post.readTime}
                  </span>
                </div>

                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-summary">{post.summary}</p>
              </div>

              <div>
                <div className="tech-tags-list" style={{ marginBottom: '16px' }}>
                  {post.tags.map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePost(post);
                  }}
                >
                  <span>{t.readArticle}</span>
                  <ExternalLinkIcon size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Reader for HTML Blog Articles */}
        {activePost && (
          <div className="blog-modal-backdrop" onClick={() => setActivePost(null)}>
            <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close-btn"
                onClick={() => setActivePost(null)}
                aria-label="Close Article"
              >
                <CloseIcon size={18} />
              </button>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {activePost.tags.map((tag) => (
                  <span key={tag} className="badge badge-cyan">
                    {tag}
                  </span>
                ))}
              </div>

              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.85rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '12px',
                lineHeight: 1.25,
              }}>
                {activePost.title}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.88rem', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <span>By {activePost.author}</span>
                <span>•</span>
                <span>{activePost.publishedAt}</span>
                <span>•</span>
                <span>{activePost.readTime}</span>
              </div>

              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: activePost.contentHtml }}
              />

              <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setActivePost(null)}>
                  {t.closeArticle}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
