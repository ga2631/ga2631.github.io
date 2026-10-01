'use client';

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
      contentRef={activeContentRef}
      ariaLabelledBy="case-study-modal-title"
    >
      <Modal.Body>
        <div className="flex flex-col gap-6">
          <div className="flex-1 min-w-0">
            {/* 1. Category & Featured Tag Badges */}
            <div className="flex flex-wrap gap-1.5 mt-1 mb-3">
              {project.category && <Badge variant="cyan" size="sm">{project.category}</Badge>}
              {project.featured && t.featuredProject && <Badge variant="emerald" size="sm">{t.featuredProject}</Badge>}
            </div>

            {/* 2. Main Title */}
            <h1 id="case-study-modal-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
              {project.title}
            </h1>

            {/* 3. Meta Info Bar (Top-aligned icons) */}
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-5 pb-4 border-b border-slate-100 flex-wrap">
              {project.company && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                  <BriefcaseIcon size={14} className="text-slate-400 flex-shrink-0" /> <span>{project.company}</span>
                </span>
              )}
              {project.company && project.role && <span>•</span>}
              {project.role && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                  <UserIcon size={14} className="text-slate-400 flex-shrink-0" /> <span>{project.role}</span>
                </span>
              )}
              {(project.company || project.role) && project.teamSize && <span>•</span>}
              {project.teamSize && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                  <UsersIcon size={14} className="text-slate-400 flex-shrink-0" /> <span>{t.team ? `${t.team}: ` : ''}{project.teamSize}</span>
                </span>
              )}
              {(project.company || project.role || project.teamSize) && (project as any).period && <span>•</span>}
              {(project as any).period && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                  <CalendarIcon size={14} className="text-slate-400 flex-shrink-0" /> <span>{(project as any).period}</span>
                </span>
              )}
            </div>

            {/* 4. Overview / Summary Callout */}
            {(project.shortDescription || project.description) && (
              <div className="p-4 mb-6 bg-red-50/60 border border-red-200/80 rounded-xl text-slate-700 text-sm leading-relaxed">
                <strong className="text-red-700 font-bold">{t.objective || 'Overview'}: </strong>
                <span>{project.shortDescription || project.description}</span>
              </div>
            )}

            {/* 5. Full Architecture & Implementation Sections */}
            <div className="flex flex-col gap-6 text-sm text-slate-700 leading-relaxed">
              {/* Objective (if detailed description is distinct from shortDescription) */}
              {project.description && project.shortDescription && project.description !== project.shortDescription && (
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-2">
                    <TargetIcon size={18} className="text-red-600 flex-shrink-0" />
                    <span>{t.objective}</span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              )}

              {/* Key Responsibilities */}
              {project.responsibilities && project.responsibilities.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-2.5">
                    <ShieldIcon size={18} className="text-red-600 flex-shrink-0" />
                    <span>{t.responsibilities}</span>
                  </h3>
                  <ul className="pl-5 list-disc space-y-2 text-slate-600">
                    {project.responsibilities.map((resp, idx) => (
                      <li
                        key={idx}
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: resp }}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges & Solutions / Highlights */}
              {project.challengesSolutions && project.challengesSolutions.length > 0 ? (
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
                    <ZapIcon size={18} className="text-red-600 flex-shrink-0" />
                    <span>{t.challengesSolutions}</span>
                  </h3>
                  <div className="flex flex-col gap-3">
                    {project.challengesSolutions.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 border-l-4 border-l-red-500"
                      >
                        <div className="font-semibold text-slate-900 text-sm mb-1.5">
                          <span className="text-red-600 font-bold mr-1.5">
                            [{t.challengeLabel}]:
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: item.challenge }} />
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed">
                          <span className="text-emerald-600 font-bold mr-1.5">
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
                  <div>
                    <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-2.5">
                      <ZapIcon size={18} className="text-red-600 flex-shrink-0" />
                      <span>{t.challenges}</span>
                    </h3>
                    <ul className="pl-5 list-disc space-y-2 text-slate-600">
                      {project.highlights.map((item, idx) => (
                        <li
                          key={idx}
                          className="leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      ))}
                    </ul>
                  </div>
                )
              )}

              {/* Achievements */}
              {project.achievements && project.achievements.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-2.5">
                    <RocketIcon size={18} className="text-red-600 flex-shrink-0" />
                    <span>{t.achievements}</span>
                  </h3>
                  <ul className="pl-5 list-disc space-y-2 text-slate-600">
                    {project.achievements.map((ach, idx) => (
                      <li
                        key={idx}
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: ach }}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack */}
              {project.tags && project.tags.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
                    <ToolsIcon size={18} className="text-red-600 flex-shrink-0" />
                    <span>{t.techStack}</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag: string) => {
                      const info = getTechColorInfo
                        ? getTechColorInfo(tag)
                        : { color: '#dc2626', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.25)' };
                      return (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border"
                          style={{
                            color: info.color,
                            backgroundColor: info.bg,
                            borderColor: info.border,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: info.color,
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


