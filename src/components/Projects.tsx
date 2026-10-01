'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, ModalHeader, ModalBody } from 'flowbite-react';
import { ProjectItem } from '../types/index.ts';
import {
  CodeIcon,
  SparklesIcon,
  GitRepoIcon,
  StarIcon,
  GitForkIcon,
  GithubIcon,
  ExternalLinkIcon,
  CalendarIcon,
  BriefcaseIcon,
  UserIcon,
  UsersIcon,
  TargetIcon,
  ShieldIcon,
  ZapIcon,
  RocketIcon,
  ToolsIcon,
} from './Icons.tsx';
import { UITranslation } from '../i18n';
import { trackProjectModalOpen, trackProjectLinkClick, trackEvent } from '../utils/analytics';

interface ProjectsProps {
  projects: ProjectItem[];
  t: UITranslation['projects'];
  tCommon: UITranslation['common'];
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  pushed_at: string;
}

type ProjectViewTab = 'all' | 'case-studies' | 'github';

export const Projects: React.FC<ProjectsProps> = ({ projects, t, tCommon }) => {
  const [activeTab, setActiveTab] = useState<ProjectViewTab>('all');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);

  // Fetch live public repositories from GitHub
  useEffect(() => {
    let isMounted = true;
    const fetchRepos = async () => {
      setIsLoadingRepos(true);
      try {
        const response = await fetch(
          'https://api.github.com/users/ga2631/repos?sort=updated&per_page=6'
        );
        if (response.ok) {
          const data: GitHubRepo[] = await response.json();
          if (isMounted) {
            const ownRepos = data.filter((r: any) => !r.fork);
            setRepos(ownRepos.length > 0 ? ownRepos : data);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live github repos, fallback to local data', err);
      } finally {
        if (isMounted) setIsLoadingRepos(false);
      }
    };

    fetchRepos();
    return () => {
      isMounted = false;
    };
  }, []);

  const getTechColorInfo = (name: string = ''): { color: string; bg: string; border: string } => {
    const n = name.toLowerCase().trim();

    if (n === 'typescript' || n === 'ts') {
      return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.35)' };
    }
    if (n === 'javascript' || n === 'js') {
      return { color: '#facc15', bg: 'rgba(250, 204, 21, 0.12)', border: 'rgba(250, 204, 21, 0.35)' };
    }
    if (n === 'python' || n.includes('fastapi') || n.includes('django')) {
      return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.35)' };
    }
    if (n === 'go' || n === 'golang') {
      return { color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.12)', border: 'rgba(34, 211, 238, 0.35)' };
    }
    if (n === 'java' || n.includes('spring')) {
      return { color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)', border: 'rgba(248, 113, 113, 0.35)' };
    }
    if (n === 'php' || n.includes('laravel') || n.includes('codeigniter')) {
      return { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)', border: 'rgba(167, 139, 250, 0.35)' };
    }
    if (n.includes('react') || n.includes('next')) {
      return { color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.12)', border: 'rgba(34, 211, 238, 0.35)' };
    }
    if (n.includes('vue')) {
      return { color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', border: 'rgba(52, 211, 153, 0.35)' };
    }
    if (n.includes('postgres')) {
      return { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)', border: 'rgba(96, 165, 250, 0.35)' };
    }
    if (n.includes('mysql') || n.includes('mariadb') || n.includes('binlog')) {
      return { color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.12)', border: 'rgba(14, 165, 233, 0.35)' };
    }
    if (n.includes('redis')) {
      return { color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)', border: 'rgba(248, 113, 113, 0.35)' };
    }
    if (n.includes('kafka') || n.includes('rabbitmq') || n.includes('cdc')) {
      return { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.12)', border: 'rgba(251, 146, 60, 0.35)' };
    }
    if (n.includes('clickhouse') || n.includes('olap') || n.includes('medallion') || n.includes('warehouse')) {
      return { color: '#facc15', bg: 'rgba(250, 204, 21, 0.12)', border: 'rgba(250, 204, 21, 0.35)' };
    }
    if (n.includes('docker')) {
      return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.35)' };
    }
    if (n.includes('kubernetes') || n.includes('k8s')) {
      return { color: '#818cf8', bg: 'rgba(129, 140, 248, 0.12)', border: 'rgba(129, 140, 248, 0.35)' };
    }
    if (n.includes('linux') || n.includes('shell') || n.includes('bash')) {
      return { color: '#a3e635', bg: 'rgba(163, 230, 53, 0.12)', border: 'rgba(163, 230, 53, 0.35)' };
    }
    if (n.includes('bigquery') || n === 'sql') {
      return { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)', border: 'rgba(96, 165, 250, 0.35)' };
    }
    if (n === 'html' || n === 'css' || n === 'scss') {
      return { color: '#f472b6', bg: 'rgba(244, 114, 182, 0.12)', border: 'rgba(244, 114, 182, 0.35)' };
    }
    if (n === 'rust') {
      return { color: '#fdba74', bg: 'rgba(253, 186, 116, 0.12)', border: 'rgba(253, 186, 116, 0.35)' };
    }
    if (n.includes('c++') || n.includes('c#')) {
      return { color: '#fb7185', bg: 'rgba(251, 113, 133, 0.12)', border: 'rgba(251, 113, 133, 0.35)' };
    }
    if (n.includes('git') || n.includes('ci/cd') || n.includes('devops')) {
      return { color: '#fb7185', bg: 'rgba(251, 113, 133, 0.12)', border: 'rgba(251, 113, 133, 0.35)' };
    }

    return { color: '#dc2626', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.25)' };
  };

  const formatDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const showCaseStudies = activeTab === 'all' || activeTab === 'case-studies';
  const showRepos = activeTab === 'all' || activeTab === 'github';

  return (
    <section id="projects" className="py-20 md:py-24">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="mb-14 text-center">
          <div className="mb-3 inline-flex justify-center">
            <Badge color="failure" size="sm" icon={() => <CodeIcon size={14} className="mr-1" />}>
              {t.badge}
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3 font-heading">
            {t.title}
          </h2>
          {t.subtitle && (
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          )}
        </div>

        {/* Primary View Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          <Button
            color={activeTab === 'all' ? 'failure' : 'light'}
            size="sm"
            onClick={() => {
              setActiveTab('all');
              trackEvent('project_tab_switch', { tab: 'all' });
            }}
          >
            <span className="flex items-center gap-2">
              <span>{t.allWorks}</span>
              <Badge color={activeTab === 'all' ? 'failure' : 'gray'} size="xs">
                {projects.length + (repos.length || 3)}
              </Badge>
            </span>
          </Button>
          <Button
            color={activeTab === 'case-studies' ? 'failure' : 'light'}
            size="sm"
            onClick={() => {
              setActiveTab('case-studies');
              trackEvent('project_tab_switch', { tab: 'case-studies' });
            }}
          >
            <span className="flex items-center gap-2">
              <SparklesIcon size={15} />
              <span>{t.caseStudies}</span>
              <Badge color={activeTab === 'case-studies' ? 'failure' : 'gray'} size="xs">
                {projects.length}
              </Badge>
            </span>
          </Button>
          <Button
            color={activeTab === 'github' ? 'failure' : 'light'}
            size="sm"
            onClick={() => {
              setActiveTab('github');
              trackEvent('project_tab_switch', { tab: 'github' });
            }}
          >
            <span className="flex items-center gap-2">
              <GitRepoIcon size={15} />
              <span>{t.githubRepos}</span>
              <Badge color={activeTab === 'github' ? 'failure' : 'gray'} size="xs">
                {repos.length || 'Live'}
              </Badge>
            </span>
          </Button>
        </div>

        {/* Unified Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Enterprise Architecture Case Studies */}
          {showCaseStudies &&
            projects.map((project: ProjectItem) => (
              <Card
                key={project.id}
                className="p-6 cursor-pointer hover:shadow-md transition-shadow flex flex-col h-full"
                onClick={() => {
                  setActiveProject(project);
                  trackProjectModalOpen({
                    id: project.id,
                    title: project.title,
                    category: project.category,
                  });
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge color="info" size="xs">{project.category}</Badge>
                    <Badge color="purple" size="xs">
                      {t.enterpriseSystem}
                    </Badge>
                  </div>

                  <h5 className="text-lg font-bold text-gray-900 mb-1 leading-snug line-clamp-2">
                    {project.title}
                  </h5>

                  {project.company && (
                    <div className="text-xs font-semibold text-red-600 mb-2">
                      {project.company} {project.role ? `• ${project.role}` : ''}
                    </div>
                  )}

                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {project.shortDescription || project.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tech: string) => {
                        const info = getTechColorInfo(tech);
                        return (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border"
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
                            {tech}
                          </span>
                        );
                      })}
                      {project.tags.length > 4 && (
                        <Badge color="pink" size="xs">
                          +{project.tags.length - 4} {tCommon.more}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-end w-full pt-1">
                      <Button
                        color="failure"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProject(project);
                        }}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{t.viewArchitecture}</span>
                          <ExternalLinkIcon size={14} />
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

          {/* 2. Loading Skeleton */}
          {showRepos && isLoadingRepos && repos.length === 0 && (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={`skeleton-${i}`} className="p-6 animate-pulse">
                  <div className="w-3/5 h-5 bg-gray-200 rounded mb-3" />
                  <div className="w-full h-3.5 bg-gray-100 rounded mb-2" />
                  <div className="w-4/5 h-3.5 bg-gray-100 rounded mb-5" />
                  <div className="w-2/5 h-4 bg-gray-200 rounded" />
                </Card>
              ))}
            </>
          )}

          {/* 3. Live GitHub Public Repositories */}
          {showRepos &&
            repos.map((repo: GitHubRepo) => {
              const repoTags = repo.topics && repo.topics.length > 0
                ? repo.topics
                : (repo.language ? [repo.language] : []);

              const mainLangInfo = getTechColorInfo(repo.language);

              return (
                <Card key={repo.id} className="p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge color="info" size="xs" icon={() => <GitRepoIcon size={12} className="mr-1" />}>
                        {t.publicRepo}
                      </Badge>
                      <Badge color="gray" size="xs">
                        {formatDate(repo.updated_at)}
                      </Badge>
                    </div>

                    <h5 className="text-lg font-bold text-gray-900 mb-1 leading-snug">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-red-600 transition-colors"
                      >
                        {repo.name}
                      </a>
                    </h5>

                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                      {repo.description || 'Public GitHub repository by @ga2631 with active source code and configuration.'}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-2 text-xs text-gray-500 w-full">
                        {repo.language && (
                          <div className="inline-flex items-center gap-1.5 font-bold" style={{ color: mainLangInfo.color }}>
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: mainLangInfo.color,
                                boxShadow: `0 0 8px ${mainLangInfo.color}`,
                              }}
                            />
                            <span>{repo.language}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 ml-auto">
                          <span className="inline-flex items-center gap-1 text-gray-600 font-medium" title="Stars">
                            <StarIcon size={14} className="text-yellow-400" />
                            <span>{repo.stargazers_count}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-gray-600 font-medium" title="Forks">
                            <GitForkIcon size={14} className="text-gray-400" />
                            <span>{repo.forks_count}</span>
                          </span>
                        </div>
                      </div>

                      {repoTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {repoTags.slice(0, 4).map((tag: string) => {
                            const info = getTechColorInfo(tag);
                            return (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border"
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
                          {repoTags.length > 4 && (
                            <Badge color="pink" size="xs">
                              +{repoTags.length - 4} {tCommon.more}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          as="a"
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="light"
                          size="xs"
                          onClick={() =>
                            trackProjectLinkClick(repo.name, repo.html_url, 'github_repo')
                          }
                        >
                          <span className="flex items-center gap-1.5">
                            <GithubIcon size={14} />
                            <span>{t.sourceCode}</span>
                          </span>
                        </Button>

                        {repo.homepage && (
                          <Button
                            as="a"
                            href={repo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="light"
                            size="xs"
                            title="Live Preview"
                            onClick={() =>
                              trackProjectLinkClick(repo.name, repo.homepage, 'live_demo')
                            }
                          >
                            <span className="flex items-center gap-1.5">
                              <ExternalLinkIcon size={14} />
                              <span>{t.demo}</span>
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>

        {/* Detailed Architecture & Case Study Modal */}
        {activeProject && (
          <Modal
            show={Boolean(activeProject)}
            onClose={() => setActiveProject(null)}
            size="4xl"
            dismissible
          >
            <ModalHeader>
              <div className="flex flex-col gap-1 pr-6">
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.category && <Badge color="info" size="xs">{activeProject.category}</Badge>}
                  {activeProject.featured && t.featuredProject && <Badge color="success" size="xs">{t.featuredProject}</Badge>}
                </div>
                <span className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                  {activeProject.title}
                </span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium pb-4 border-b border-gray-200 flex-wrap">
                  {activeProject.company && (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                      <BriefcaseIcon size={14} className="text-gray-400 flex-shrink-0" /> <span>{activeProject.company}</span>
                    </span>
                  )}
                  {activeProject.company && activeProject.role && <span>•</span>}
                  {activeProject.role && (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                      <UserIcon size={14} className="text-gray-400 flex-shrink-0" /> <span>{activeProject.role}</span>
                    </span>
                  )}
                  {(activeProject.company || activeProject.role) && activeProject.teamSize && <span>•</span>}
                  {activeProject.teamSize && (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                      <UsersIcon size={14} className="text-gray-400 flex-shrink-0" /> <span>{t.team ? `${t.team}: ` : ''}{activeProject.teamSize}</span>
                    </span>
                  )}
                  {(activeProject.company || activeProject.role || activeProject.teamSize) && (activeProject as any).period && <span>•</span>}
                  {(activeProject as any).period && (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                      <CalendarIcon size={14} className="text-gray-400 flex-shrink-0" /> <span>{(activeProject as any).period}</span>
                    </span>
                  )}
                </div>

                {(activeProject.shortDescription || activeProject.description) && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-gray-700 text-sm leading-relaxed">
                    <strong className="text-red-700 font-bold">{t.objective || 'Overview'}: </strong>
                    <span>{activeProject.shortDescription || activeProject.description}</span>
                  </div>
                )}

                <div className="flex flex-col gap-6 text-sm text-gray-700 leading-relaxed">
                  {activeProject.description && activeProject.shortDescription && activeProject.description !== activeProject.shortDescription && (
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-2">
                        <TargetIcon size={18} className="text-red-600 flex-shrink-0" />
                        <span>{t.objective}</span>
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {activeProject.description}
                      </p>
                    </div>
                  )}

                  {activeProject.responsibilities && activeProject.responsibilities.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-2.5">
                        <ShieldIcon size={18} className="text-red-600 flex-shrink-0" />
                        <span>{t.responsibilities}</span>
                      </h3>
                      <ul className="pl-5 list-disc space-y-2 text-gray-600">
                        {activeProject.responsibilities.map((resp, idx) => (
                          <li
                            key={idx}
                            className="leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: resp }}
                          />
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeProject.challengesSolutions && activeProject.challengesSolutions.length > 0 ? (
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
                        <ZapIcon size={18} className="text-red-600 flex-shrink-0" />
                        <span>{t.challengesSolutions}</span>
                      </h3>
                      <div className="flex flex-col gap-3">
                        {activeProject.challengesSolutions.map((item, idx) => (
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
                    activeProject.highlights && activeProject.highlights.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-2.5">
                          <ZapIcon size={18} className="text-red-600 flex-shrink-0" />
                          <span>{t.challenges}</span>
                        </h3>
                        <ul className="pl-5 list-disc space-y-2 text-gray-600">
                          {activeProject.highlights.map((item, idx) => (
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

                  {activeProject.achievements && activeProject.achievements.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-2.5">
                        <RocketIcon size={18} className="text-red-600 flex-shrink-0" />
                        <span>{t.achievements}</span>
                      </h3>
                      <ul className="pl-5 list-disc space-y-2 text-gray-600">
                        {activeProject.achievements.map((ach, idx) => (
                          <li
                            key={idx}
                            className="leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: ach }}
                          />
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeProject.tags && activeProject.tags.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
                        <ToolsIcon size={18} className="text-red-600 flex-shrink-0" />
                        <span>{t.techStack}</span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProject.tags.map((tag: string) => {
                          const info = getTechColorInfo(tag);
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
        )}
      </div>
    </section>
  );
};

export default Projects;
