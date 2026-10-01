'use client';

import React, { useState, useEffect } from 'react';
import { ProjectItem } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { trackProjectModalOpen, trackProjectLinkClick } from '@/utils/analytics';
import { getPublicGithubProjects, FALLBACK_PUBLIC_PROJECTS } from '@/services/githubService';

export interface ProjectsSectionProps {
  /**
   * Enterprise projects loaded from Supabase cv_documents table
   */
  projects?: ProjectItem[];
  /**
   * Explicit list of Enterprise projects (from Supabase)
   */
  enterpriseProjects?: ProjectItem[];
  /**
   * Explicit list of Public projects (from GitHub)
   */
  publicProjects?: ProjectItem[];
}

/**
 * Checks whether a project is an internal company Enterprise project
 */
export function isEnterpriseProject(proj: ProjectItem): boolean {
  if (proj.projectType === 'enterprise') return true;
  if (proj.projectType === 'public') return false;
  if (proj.isPrivate === true) return true;
  if (proj.isPrivate === false) return false;
  if (typeof proj.category === 'string') {
    const cat = proj.category.toLowerCase();
    if (cat.includes('enterprise') || cat.includes('công ty') || cat.includes('doanh nghiệp')) {
      return true;
    }
    if (cat.includes('public') || cat.includes('github') || cat.includes('mã nguồn mở')) {
      return false;
    }
  }
  if (proj.company && proj.company.trim().length > 0) return true;
  return true;
}

export function ProjectsSection({
  projects,
  enterpriseProjects,
  publicProjects,
}: ProjectsSectionProps) {
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  // GitHub public projects
  const [fetchedGithubProjects, setFetchedGithubProjects] = useState<ProjectItem[]>(
    publicProjects || FALLBACK_PUBLIC_PROJECTS
  );

  // Fetch public GitHub repositories
  useEffect(() => {
    if (publicProjects && publicProjects.length > 0) {
      setFetchedGithubProjects(publicProjects);
      return;
    }

    let isMounted = true;
    async function loadGithubRepos() {
      try {
        const ghRepos = await getPublicGithubProjects('ga2631', 6);
        if (isMounted && ghRepos.length > 0) {
          setFetchedGithubProjects(ghRepos);
        }
      } catch (err) {
        console.warn('[ProjectsSection] Error fetching GitHub public projects:', err);
      }
    }
    loadGithubRepos();

    return () => {
      isMounted = false;
    };
  }, [publicProjects]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // 1. Enterprise projects: All projects from Supabase cv_documents
  const enterpriseItems: ProjectItem[] = (() => {
    if (enterpriseProjects && enterpriseProjects.length > 0) {
      return enterpriseProjects.map((p) => ({
        ...p,
        category: 'Enterprise',
        projectType: 'enterprise' as const,
        isPrivate: true,
      }));
    }
    if (projects && projects.length > 0) {
      return projects.map((p) => ({
        ...p,
        category: 'Enterprise',
        projectType: 'enterprise' as const,
        isPrivate: true,
      }));
    }
    return [];
  })();

  // 2. Public projects: Fetched from GitHub
  const publicItems: ProjectItem[] = (() => {
    if (publicProjects && publicProjects.length > 0) {
      return publicProjects.map((p) => ({
        ...p,
        category: 'Public',
        projectType: 'public' as const,
        isPrivate: false,
      }));
    }
    if (fetchedGithubProjects && fetchedGithubProjects.length > 0) {
      return fetchedGithubProjects.map((p) => ({
        ...p,
        category: 'Public',
        projectType: 'public' as const,
        isPrivate: false,
      }));
    }
    return FALLBACK_PUBLIC_PROJECTS;
  })();

  // Combined project display list: Enterprise projects from Supabase first, followed by Public projects from GitHub
  const displayProjects: ProjectItem[] = [...enterpriseItems, ...publicItems];

  const handleOpenModal = (proj: ProjectItem) => {
    setActiveModalProject(proj);
    setIsModalOpen(true);
    trackProjectModalOpen(proj);
  };

  const handleLinkClick = (title: string, url: string) => {
    trackProjectLinkClick(title, url, 'github_repo');
  };

  // Derive bullet points to show in modal
  const modalHighlights: string[] = (() => {
    if (!activeModalProject) return [];
    if (activeModalProject.highlights && activeModalProject.highlights.length > 0) {
      return activeModalProject.highlights;
    }
    if (activeModalProject.achievements && activeModalProject.achievements.length > 0) {
      return activeModalProject.achievements;
    }
    if (activeModalProject.responsibilities && activeModalProject.responsibilities.length > 0) {
      return activeModalProject.responsibilities;
    }
    return [
      'Phân tích và convert định dạng JSONB/Avro phức tạp.',
      'Đồng bộ đa luồng đẩy 600+ shard file vào PostgreSQL.',
      'Kiến trúc Docker gọn nhẹ, chạy trên schedule cron/Airflow.',
    ];
  })();

  return (
    <section id="projects" className="mb-16 scroll-mt-28">
      <div className="flex items-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          {isEn ? 'Featured Projects' : 'Featured Projects'}
        </h3>
        <div className="ml-6 flex-grow h-px bg-gradient-to-r from-gray-200 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProjects.map((proj) => {
          const isEnterprise = isEnterpriseProject(proj);

          return (
            <div
              key={proj.id}
              className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg hover:border-red-200 transition-all ease-in-out"
            >
              {/* Type 1: Enterprise Pill vs Type 2: Public Pill */}
              <div className="flex justify-between items-start mb-4">
                {isEnterprise ? (
                  <span className="bg-rose-50 text-rose-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>{' '}
                    Enterprise
                  </span>
                ) : (
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>{' '}
                    Public
                  </span>
                )}
              </div>

              {/* Title & Company */}
              <h5 className="text-xl font-bold text-gray-900 mb-1">{proj.title}</h5>
              {proj.company ? (
                <small className="text-gray-500 mb-3">{proj.company}</small>
              ) : (
                <small className="text-gray-400 mb-3">GitHub Open Source</small>
              )}

              {/* Description */}
              <p className="text-gray-600 text-md mb-6 flex-grow text-justify">
                {proj.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(proj.tags || []).map((tg: string, i: number) => (
                  <span
                    key={i}
                    className="bg-white text-gray-600 text-xs font-medium px-2 py-1 rounded-full border border-gray-200"
                  >
                    {tg}
                  </span>
                ))}
              </div>

              {/* Action Button: Enterprise -> Open Modal; Public -> Open GitHub Link */}
              {isEnterprise ? (
                <button
                  type="button"
                  data-modal-target="private-project-modal"
                  data-modal-toggle="private-project-modal"
                  onClick={() => handleOpenModal(proj)}
                  className="w-full text-center text-red-600 bg-red-50 font-medium py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                >
                  {isEn ? 'View Details' : 'Xem chi tiết'}
                </button>
              ) : (
                <a
                  href={proj.githubUrl || 'https://github.com/ga2631'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    handleLinkClick(proj.title, proj.githubUrl || 'https://github.com/ga2631')
                  }
                  className="flex justify-center items-center gap-2 w-full text-center text-gray-700 bg-white border border-gray-200 font-medium py-2.5 rounded-xl hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View Source
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Structure (Private / Enterprise Project) */}
      <div
        id="private-project-modal"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isModalOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsModalOpen(false);
          }
        }}
        className={`${
          isModalOpen ? 'flex' : 'hidden'
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full backdrop-blur-sm bg-gray-900/50 p-4 transition-all ease-in-out`}
      >
        <div
          className="relative p-4 w-full max-w-2xl max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-white rounded-3xl shadow">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-xl font-bold text-gray-900">
                {isEn ? 'Enterprise Project Details' : 'Chi tiết Dự án Công ty'}
              </h3>
              <button
                type="button"
                data-modal-hide="private-project-modal"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center cursor-pointer"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Đóng modal</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 md:p-5 space-y-4">
              <p className="text-base leading-relaxed text-gray-600 font-normal">
                <strong>{activeModalProject?.title || 'Enterprise Data Hub'}</strong>{' '}
                {activeModalProject?.company ? `(${activeModalProject.company}) ` : ''}
                {activeModalProject?.description ||
                  (isEn
                    ? 'is an internal enterprise solution built to replace manual ETL pipelines.'
                    : 'là giải pháp xây dựng riêng nội bộ để thay thế quy trình tải dữ liệu thủ công.')}
              </p>

              {/* Highlights list */}
              <ul className="list-disc list-inside text-gray-600 space-y-2 font-normal">
                {modalHighlights.map((hl, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: hl }} />
                ))}
              </ul>

              {/* Tags */}
              {activeModalProject?.tags && activeModalProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeModalProject.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* NDA Notice */}
              <div className="mt-4 p-4 bg-orange-50 text-orange-800 rounded-xl text-sm border border-orange-200 font-medium">
                🔒{' '}
                {isEn
                  ? 'Source code is closed due to enterprise NDA agreements.'
                  : 'Mã nguồn không được công khai (Closed Source) do thỏa thuận bảo mật NDA với doanh nghiệp.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
