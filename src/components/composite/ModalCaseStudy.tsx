import React, { useEffect, useRef, useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ProjectItem } from '../../types/index.ts';
import {
  CalendarIcon,
  BriefcaseIcon,
  UserIcon,
  UsersIcon,
  TargetIcon,
  ShieldIcon,
  ZapIcon,
  RocketIcon,
  ToolsIcon,
} from '../Icons';

export interface ModalCaseStudyProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  isStickyTitleShown?: boolean;
  modalContentRef?: React.RefObject<HTMLDivElement | null>;
  t: {
    featuredProject?: string;
    team?: string;
    objective?: string;
    responsibilities?: string;
    challengesSolutions?: string;
    challengeLabel?: string;
    solutionLabel?: string;
    challenges?: string;
    achievements?: string;
    techStack?: string;
  };
  getTechColorInfo?: (tag: string) => { color: string; bg: string; border: string };
  closeAriaLabel?: string;
}

export const ModalCaseStudy: React.FC<ModalCaseStudyProps> = ({
  project,
  isOpen,
  onClose,
  isStickyTitleShown,
  modalContentRef,
  t,
  getTechColorInfo,
  closeAriaLabel = 'Close Project Details',
}) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const activeContentRef = modalContentRef || internalRef;
  const [internalStickyTitleShown, setInternalStickyTitleShown] = useState(false);

  const activeStickyTitleShown =
    isStickyTitleShown !== undefined ? isStickyTitleShown : internalStickyTitleShown;

  useEffect(() => {
    if (!isOpen || !project) return;
    const container = activeContentRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const titleEl = document.getElementById('case-study-modal-title');
      if (titleEl) {
        const titleRect = titleEl.getBoundingClientRect();
        setInternalStickyTitleShown(titleRect.bottom <= containerRect.top + 60);
      } else {
        setInternalStickyTitleShown(container.scrollTop > 80);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isOpen, project, activeContentRef]);

  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.title}
      stickyHeader={true}
      isStickyTitleShown={activeStickyTitleShown}
      closeAriaLabel={closeAriaLabel}
      backdropClassName="blog-modal-backdrop"
      contentClassName="blog-modal-content blog-article-modal project-modal-dialog"
      contentRef={activeContentRef}
      ariaLabelledBy="case-study-modal-title"
    >
      <Modal.Body className="article-modal-body project-modal-body">
        <div className="article-modal-layout">
          <div className="article-main-column">
            {/* 1. Category & Featured Tag Badges */}
            <div className="tech-tags-list" style={{ marginTop: '4px', marginBottom: '12px' }}>
              {project.category && <Badge variant="cyan">{project.category}</Badge>}
              {project.featured && t.featuredProject && <Badge variant="emerald">{t.featuredProject}</Badge>}
            </div>

            {/* 2. Main Title */}
            <h1 id="case-study-modal-title" className="article-full-title">
              {project.title}
            </h1>

            {/* 3. Meta Info Bar (Top-aligned icons) */}
            <div className="article-meta-bar">
              {project.company && (
                <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '5px' }}>
                  <BriefcaseIcon size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> <span>{project.company}</span>
                </span>
              )}
              {project.company && project.role && <span>•</span>}
              {project.role && (
                <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '5px' }}>
                  <UserIcon size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> <span>{project.role}</span>
                </span>
              )}
              {(project.company || project.role) && project.teamSize && <span>•</span>}
              {project.teamSize && (
                <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '5px' }}>
                  <UsersIcon size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> <span>{t.team ? `${t.team}: ` : ''}{project.teamSize}</span>
                </span>
              )}
              {(project.company || project.role || project.teamSize) && (project as any).period && <span>•</span>}
              {(project as any).period && (
                <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '5px' }}>
                  <CalendarIcon size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> <span>{(project as any).period}</span>
                </span>
              )}
            </div>

            {/* 4. Overview / Summary Callout */}
            {(project.shortDescription || project.description) && (
              <div className="article-summary-callout">
                <strong>{t.objective || 'Overview'}: </strong>
                <span>{project.shortDescription || project.description}</span>
              </div>
            )}

            {/* 5. Full Architecture & Implementation Sections */}
            <div className="article-body" style={{ marginTop: 0 }}>
              {/* Objective (if detailed description is distinct from shortDescription) */}
              {project.description && project.shortDescription && project.description !== project.shortDescription && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '10px' }}>
                    <TargetIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{t.objective}</span>
                  </h3>
                  <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                    {project.description}
                  </p>
                </div>
              )}

              {/* Key Responsibilities */}
              {project.responsibilities && project.responsibilities.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '12px' }}>
                    <ShieldIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{t.responsibilities}</span>
                  </h3>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {project.responsibilities.map((resp, idx) => (
                      <li
                        key={idx}
                        style={{ marginBottom: '8px', color: 'var(--text-secondary)', lineHeight: 1.55 }}
                        dangerouslySetInnerHTML={{ __html: resp }}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges & Solutions / Highlights */}
              {project.challengesSolutions && project.challengesSolutions.length > 0 ? (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '12px' }}>
                    <ZapIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{t.challengesSolutions}</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {project.challengesSolutions.map((item, idx) => (
                      <div
                        key={idx}
                        className="glass-panel"
                        style={{
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          borderLeft: '3px solid var(--accent-primary)',
                        }}
                      >
                        <div style={{ marginBottom: '6px', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          <span style={{ color: 'var(--accent-red, #ef4444)', marginRight: '6px' }}>
                            [{t.challengeLabel}]:
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: item.challenge }} />
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.55 }}>
                          <span style={{ color: 'var(--accent-emerald, #10b981)', marginRight: '6px', fontWeight: 600 }}>
                            → [{t.solutionLabel}]:
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: item.solution }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                project.highlights && project.highlights.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '12px' }}>
                      <ZapIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{t.challenges}</span>
                    </h3>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {project.highlights.map((item, idx) => (
                        <li
                          key={idx}
                          style={{ marginBottom: '8px', color: 'var(--text-secondary)', lineHeight: 1.55 }}
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      ))}
                    </ul>
                  </div>
                )
              )}

              {/* Achievements */}
              {project.achievements && project.achievements.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '12px' }}>
                    <RocketIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{t.achievements}</span>
                  </h3>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {project.achievements.map((ach, idx) => (
                      <li
                        key={idx}
                        style={{ marginBottom: '8px', color: 'var(--text-secondary)', lineHeight: 1.55 }}
                        dangerouslySetInnerHTML={{ __html: ach }}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack */}
              {project.tags && project.tags.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '12px' }}>
                    <ToolsIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{t.techStack}</span>
                  </h3>
                  <div className="tech-tags-list" style={{ marginTop: '8px' }}>
                    {project.tags.map((tag: string) => {
                      const info = getTechColorInfo
                        ? getTechColorInfo(tag)
                        : { color: 'var(--text-accent)', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.25)' };
                      return (
                        <span
                          key={tag}
                          className="badge badge-tech-tag"
                          style={{
                            color: info.color,
                            backgroundColor: info.bg,
                            borderColor: info.border,
                          }}
                        >
                          <span
                            className="lang-color-dot"
                            style={{
                              width: '6px',
                              height: '6px',
                              backgroundColor: info.color,
                              marginRight: '2px',
                            }}
                          />
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

ModalCaseStudy.displayName = 'ModalCaseStudy';


