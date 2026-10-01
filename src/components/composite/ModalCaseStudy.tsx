'use client';

import React from 'react';
import { Modal, ModalHeader, ModalBody, Badge } from 'flowbite-react';
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
  t,
  getTechColorInfo,
}) => {
  if (!project) return null;

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="4xl"
      dismissible
    >
      <ModalHeader>
        <div className="flex flex-col gap-1 pr-6">
          <div className="flex flex-wrap gap-1.5">
            {project.category && <Badge color="info" size="xs">{project.category}</Badge>}
            {project.featured && t.featuredProject && <Badge color="success" size="xs">{t.featuredProject}</Badge>}
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            {project.title}
          </span>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-6">
          {/* Meta Info Bar */}
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium pb-4 border-b border-gray-200 flex-wrap">
            {project.company && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                <BriefcaseIcon size={14} className="text-gray-400 flex-shrink-0" /> <span>{project.company}</span>
              </span>
            )}
            {project.company && project.role && <span>•</span>}
            {project.role && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                <UserIcon size={14} className="text-gray-400 flex-shrink-0" /> <span>{project.role}</span>
              </span>
            )}
            {(project.company || project.role) && project.teamSize && <span>•</span>}
            {project.teamSize && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                <UsersIcon size={14} className="text-gray-400 flex-shrink-0" /> <span>{t.team ? `${t.team}: ` : ''}{project.teamSize}</span>
              </span>
            )}
            {(project.company || project.role || project.teamSize) && (project as any).period && <span>•</span>}
            {(project as any).period && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                <CalendarIcon size={14} className="text-gray-400 flex-shrink-0" /> <span>{(project as any).period}</span>
              </span>
            )}
          </div>

          {/* Overview Callout */}
          {(project.shortDescription || project.description) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-gray-700 text-sm leading-relaxed">
              <strong className="text-red-700 font-bold">{t.objective || 'Overview'}: </strong>
              <span>{project.shortDescription || project.description}</span>
            </div>
          )}

          {/* Full Architecture & Implementation Sections */}
          <div className="flex flex-col gap-6 text-sm text-gray-700 leading-relaxed">
            {/* Objective */}
            {project.description && project.shortDescription && project.description !== project.shortDescription && (
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-2">
                  <TargetIcon size={18} className="text-red-600 flex-shrink-0" />
                  <span>{t.objective}</span>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* Key Responsibilities */}
            {project.responsibilities && project.responsibilities.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-2.5">
                  <ShieldIcon size={18} className="text-red-600 flex-shrink-0" />
                  <span>{t.responsibilities}</span>
                </h3>
                <ul className="pl-5 list-disc space-y-2 text-gray-600">
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

            {/* Challenges & Solutions */}
            {project.challengesSolutions && project.challengesSolutions.length > 0 ? (
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
                  <ZapIcon size={18} className="text-red-600 flex-shrink-0" />
                  <span>{t.challengesSolutions}</span>
                </h3>
                <div className="flex flex-col gap-3">
                  {project.challengesSolutions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 border-s-4 border-s-red-500"
                    >
                      <div className="font-semibold text-gray-900 text-sm mb-1.5">
                        <span className="text-red-600 font-bold mr-1.5">
                          [{t.challengeLabel}]:
                        </span>
                        <span dangerouslySetInnerHTML={{ __html: item.challenge }} />
                      </div>
                      <div className="text-gray-600 text-sm leading-relaxed">
                        <span className="text-green-600 font-bold mr-1.5">
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
                  <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-2.5">
                    <ZapIcon size={18} className="text-red-600 flex-shrink-0" />
                    <span>{t.challenges}</span>
                  </h3>
                  <ul className="pl-5 list-disc space-y-2 text-gray-600">
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
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-2.5">
                  <RocketIcon size={18} className="text-red-600 flex-shrink-0" />
                  <span>{t.achievements}</span>
                </h3>
                <ul className="pl-5 list-disc space-y-2 text-gray-600">
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
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
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
      </ModalBody>
    </Modal>
  );
};

ModalCaseStudy.displayName = 'ModalCaseStudy';
