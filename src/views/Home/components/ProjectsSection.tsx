'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ProjectItem } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { trackProjectModalOpen, trackProjectLinkClick } from '@/utils/analytics';
import { getPublicGithubProjects } from '@/services/githubService';

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
  const { currentLang, changeLanguage } = useLanguage();
  const isEn = currentLang === 'en';
  const { dict } = useLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalProjectId, setActiveModalProjectId] = useState<string | null>(null);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  // GitHub public projects
  const [fetchedGithubProjects, setFetchedGithubProjects] = useState<ProjectItem[]>(
    publicProjects || []
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

  // Manage root & body scroll lock and handle ESC key to close modal
  useEffect(() => {
    if (isModalOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden');
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
      document.querySelectorAll('[modal-backdrop], [drawer-backdrop]').forEach((el) => el.remove());
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
    };
  }, [isModalOpen]);

  // 1. Enterprise projects: All projects from Supabase cv_documents
  const enterpriseItems: ProjectItem[] = useMemo(() => {
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
  }, [enterpriseProjects, projects]);

  // 2. Public projects: Fetched from GitHub
  const publicItems: ProjectItem[] = useMemo(() => {
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
    return [];
  }, [publicProjects, fetchedGithubProjects]);

  // Combined project display list: Enterprise projects from Supabase first, followed by Public projects from GitHub
  const displayProjects: ProjectItem[] = useMemo(
    () => [...enterpriseItems, ...publicItems],
    [enterpriseItems, publicItems]
  );

  // Derive activeModalProject from displayProjects, activeModalProjectId, and activeModalIndex
  const activeModalProject: ProjectItem | null = useMemo(() => {
    if (!isModalOpen) return null;
    if (activeModalProjectId) {
      const byId = displayProjects.find(
        (p) => p.id === activeModalProjectId || p.title === activeModalProjectId
      );
      if (byId) return byId;
    }
    if (activeModalIndex !== null && displayProjects[activeModalIndex]) {
      return displayProjects[activeModalIndex];
    }
    return displayProjects[0] || null;
  }, [displayProjects, activeModalProjectId, activeModalIndex, isModalOpen]);

  const handleOpenModal = (proj: ProjectItem, index: number) => {
    setActiveModalProjectId(proj.id || proj.title || String(index));
    setActiveModalIndex(index);
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
          {dict.sections.projectsTitle}
        </h3>
        <div className="ml-6 flex-grow h-px bg-gradient-to-r from-gray-200 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProjects.map((proj, idx) => {
          const isEnterprise = isEnterpriseProject(proj);

          return (
            <div
              key={proj.id || idx}
              className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg hover:border-red-400 transition-all ease-in-out"
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
                  onClick={() => handleOpenModal(proj, idx)}
                  className="w-full text-center text-red-600 bg-red-50 font-medium py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                >
                  {dict.projects.viewDetails}
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
                  {dict.projects.sourceCode}
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
        } overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full p-4 md:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300 overscroll-contain`}
      >
        <div
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
            {/* Flowbite Modal Header */}
            <div className="p-6 pb-4 border-b border-gray-100 bg-gray-50/50 rounded-t-3xl space-y-3">
              {/* Row 1: Pill (Left) + Language Toggle & Close Button (Right) */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  {activeModalProject?.category ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      {activeModalProject.category}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      Enterprise
                    </span>
                  )}
                </div>

                {/* Right: Language Toggle + Close Button */}
                <div className="flex items-center gap-2.5">
                  {/* Segmented Language Switcher in Modal */}
                  <div className="inline-flex items-center p-0.5 bg-gray-100/90 rounded-full border border-gray-200 shadow-inner">
                    <button
                      type="button"
                      onClick={() => changeLanguage('vi')}
                      className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-all duration-150 cursor-pointer ${
                        !isEn
                          ? 'bg-white text-red-600 shadow-xs'
                          : 'text-gray-400 hover:text-gray-700'
                      }`}
                      aria-label="Tiếng Việt"
                    >
                      VI
                    </button>
                    <button
                      type="button"
                      onClick={() => changeLanguage('en')}
                      className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-all duration-150 cursor-pointer ${
                        isEn
                          ? 'bg-white text-red-600 shadow-xs'
                          : 'text-gray-400 hover:text-gray-700'
                      }`}
                      aria-label="English"
                    >
                      EN
                    </button>
                  </div>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-7 h-7 inline-flex justify-center items-center cursor-pointer transition-colors flex-shrink-0"
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
              </div>

              {/* Row 2: Title full-width */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-snug w-full">
                  {activeModalProject?.title || (isEn ? 'Enterprise Project Details' : 'Chi tiết Dự án Công ty')}
                </h3>
                {activeModalProject?.company && (
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {activeModalProject.company}
                  </p>
                )}
              </div>
            </div>

            {/* Flowbite Modal Body (Scrollable) */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(92vh-180px)] text-base overscroll-contain">
              {/* Quick Info */}
              {(activeModalProject?.role || activeModalProject?.teamSize || activeModalProject?.period) && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {activeModalProject.role && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {dict.modal.role}
                      </span>
                      <span className="text-base font-bold text-gray-800">{activeModalProject.role}</span>
                    </div>
                  )}
                  {activeModalProject.teamSize && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {dict.modal.teamSize}
                      </span>
                      <span className="text-base font-bold text-gray-800">{activeModalProject.teamSize}</span>
                    </div>
                  )}
                  {activeModalProject.period && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {dict.modal.timeline}
                      </span>
                      <span className="text-base font-bold text-gray-800">{activeModalProject.period}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Project Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {dict.modal.overview}
                </h4>
                <p className="text-base text-gray-700 leading-relaxed text-justify">
                  {activeModalProject?.description ||
                    (isEn
                      ? 'Enterprise backend infrastructure and scalable software architecture.'
                      : 'Hạ tầng backend doanh nghiệp và kiến trúc phần mềm chịu tải cao.')}
                </p>
              </div>

              {/* Highlights & Achievements */}
              {modalHighlights.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {dict.modal.highlights}
                  </h4>
                  <ul className="space-y-2.5">
                    {modalHighlights.map((hl, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-red-400 transition-colors ease-in-out"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <span
                          className="text-base text-gray-700 leading-relaxed text-justify"
                          dangerouslySetInnerHTML={{ __html: hl }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges & Solutions */}
              {activeModalProject?.challengesSolutions &&
                activeModalProject.challengesSolutions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {isEn ? 'Challenges & Technical Solutions' : 'Thách thức & Giải pháp kỹ thuật'}
                    </h4>
                    <div className="space-y-3">
                      {activeModalProject.challengesSolutions.map((cs, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-sm"
                        >
                          <div
                            className="grid items-start gap-x-3 gap-y-3 text-base"
                            style={{ gridTemplateColumns: 'max-content 1fr' }}
                          >
                            {/* Row 1: Challenge */}
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 whitespace-nowrap self-start">
                              {isEn ? 'Challenge' : 'Thách thức'}
                            </span>
                            <p className="pl-2 text-gray-800 font-medium leading-relaxed text-justify text-base">
                              {cs.challenge}
                            </p>

                            {/* Row 2: Solution */}
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap self-start">
                              {isEn ? 'Solution' : 'Giải pháp'}
                            </span>
                            <p className="pl-2 text-gray-600 leading-relaxed text-justify text-base">
                              {cs.solution}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Technologies / Tags */}
              {activeModalProject?.tags && activeModalProject.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {isEn ? 'Technologies & Frameworks' : 'Công nghệ sử dụng'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeModalProject.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Flowbite NDA Alert Box */}
              <div className="flex items-start p-4 text-sm text-amber-800 rounded-2xl bg-amber-50 border border-amber-200 gap-3">
                <svg
                  className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="leading-relaxed">
                  <span className="font-bold">
                    {isEn ? 'Confidentiality Notice (NDA): ' : 'Thỏa thuận Bảo mật (NDA): '}
                  </span>
                  {isEn
                    ? 'Source code is closed due to enterprise NDA agreements.'
                    : 'Mã nguồn không được công khai (Closed Source) do thỏa thuận bảo mật NDA với doanh nghiệp.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
