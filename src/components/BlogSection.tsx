import React, { useState, useEffect, useRef } from 'react';
import { BlogPost } from '../types/index.ts';
import { BookOpenIcon, ExternalLinkIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { Card, Button } from './common';
import { Section, ModalArticle, processArticleToc, TocItem } from './ui';
import { TechTagList } from './composite';

interface BlogSectionProps {
  posts: BlogPost[];
  t: UITranslation['blog'];
  tCommon: UITranslation['common'];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts, t, tCommon }) => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [processedHtml, setProcessedHtml] = useState<string>('');
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Parse Headings (h2, h3) from activePost content to generate TOC items
  useEffect(() => {
    const rawHtml = activePost?.contentHtml || activePost?.content || '';
    if (!activePost || !rawHtml) {
      setTocItems([]);
      setProcessedHtml('');
      setActiveHeadingId('');
      return;
    }

    const { processedHtml: htmlWithIds, tocItems: items } = processArticleToc(rawHtml);
    setProcessedHtml(htmlWithIds);
    setTocItems(items);
    if (items.length > 0) {
      setActiveHeadingId(items[0].id);
    }
  }, [activePost]);

  // Scroll spy inside modal content
  useEffect(() => {
    if (!activePost || tocItems.length === 0) return;

    const modalEl = modalContentRef.current;
    if (!modalEl) return;

    const handleScroll = () => {
      const headingElements = tocItems
        .map((item) => modalEl.querySelector(`#${item.id}`))
        .filter(Boolean) as HTMLElement[];

      const scrollPos = modalEl.scrollTop + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPos) {
          setActiveHeadingId(el.id);
          break;
        }
      }
    };

    modalEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => modalEl.removeEventListener('scroll', handleScroll);
  }, [activePost, tocItems]);

  const handleSelectHeading = (id: string) => {
    const modalEl = modalContentRef.current;
    if (!modalEl) return;

    const targetEl = modalEl.querySelector(`#${id}`) as HTMLElement;
    if (targetEl) {
      const targetOffset = targetEl.offsetTop - 80;
      modalEl.scrollTo({
        top: Math.max(0, targetOffset),
        behavior: 'smooth',
      });
      setActiveHeadingId(id);
    }
  };

  return (
    <Section
      id="blog"
      badge={t.badge}
      badgeIcon={<BookOpenIcon size={14} />}
      title={t.title}
      subtitle={t.subtitle}
    >
      <div className="blog-grid">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="blog-card"
            onClick={() => setActivePost(post)}
          >
            <Card.Header>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {post.publishedAt} • {post.readTime}
                </span>
              </div>

              <h3 className="blog-title">{post.title}</h3>
            </Card.Header>

            <Card.Body>
              <p className="blog-summary">{post.summary}</p>
            </Card.Body>

            <Card.Footer>
              <TechTagList tags={post.tags} style={{ marginBottom: '16px' }} />

              <Button
                variant="outline"
                size="sm"
                style={{ width: '100%' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePost(post);
                }}
                icon={<ExternalLinkIcon size={14} />}
                iconPosition="right"
              >
                <span>{t.readArticle}</span>
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {/* Standardized Modal Reader for HTML Blog Articles */}
      <ModalArticle
        post={activePost}
        isOpen={Boolean(activePost)}
        onClose={() => setActivePost(null)}
        processedHtml={processedHtml}
        tocItems={tocItems}
        activeHeadingId={activeHeadingId}
        onSelectHeading={handleSelectHeading}
        modalContentRef={modalContentRef}
        tCommon={tCommon}
        closeAriaLabel="Close Article"
      />
    </Section>
  );
};
