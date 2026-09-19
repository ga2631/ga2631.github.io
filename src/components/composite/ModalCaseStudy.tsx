import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ProjectItem } from '../../types/index.ts';
import { TargetIcon, ShieldIcon, ZapIcon, RocketIcon, ToolsIcon } from '../Icons';

export interface ModalCaseStudyProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
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
  t,
  getTechColorInfo,
  closeAriaLabel = 'Close Project Details',
}) => {
  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      closeAriaLabel={closeAriaLabel}
      backdropClassName="blog-modal-backdrop"
      contentClassName="blog-modal-content project-modal-dialog"
      bodyClassName="project-modal-body"
    >
      {/* Header Info */}
      <div className="project-modal-header">
        <div className="project-modal-header-meta">
          <Badge variant="cyan">{project.category}</Badge>
          {project.featured && t.featuredProject && <Badge variant="emerald">{t.featuredProject}</Badge>}
          {project.teamSize && t.team && <Badge>{t.team}: {project.teamSize}</Badge>}
        </div>

        <h2 className="project-modal-title">
          {project.title}
        </h2>

        {(project.company || project.role) && (
          <div className="project-modal-subtitle">
            {project.company} - {project.role}
          </div>
        )}
      </div>

      {/* Scrollable Content Body */}
      <div className="article-body">
        {/* 1. Project Objective */}
        {project.description && (
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

        {/* 2. Key Responsibilities */}
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

        {/* 3. Challenges & Solutions */}
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

        {/* 4. Achievements */}
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

        {/* 5. Tech Stack */}
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
    </Modal>
  );
};

ModalCaseStudy.displayName = 'ModalCaseStudy';

