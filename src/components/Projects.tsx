'use client';

import React, { useState, useEffect } from 'react';
import { ProjectItem } from '../types/index.ts';
import {
  CodeIcon,
  SparklesIcon,
  GitRepoIcon,
  StarIcon,
  GitForkIcon,
  GithubIcon,
  ExternalLinkIcon,
} from './Icons.tsx';
import { UITranslation } from '../i18n';
import { Card, Button, Badge } from './common';
import { Section } from './ui';
import { ModalCaseStudy } from './composite';
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
            // Filter out forks or keep all non-forks
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

  // Distinct language / tech tag badge colors
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

    return { color: 'var(--text-accent)', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.25)' };
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
    <Section
      id="projects"
      badge={t.badge}
      badgeIcon={<CodeIcon size={14} />}
      title={t.title}
      subtitle={t.subtitle}
    >
      {/* Primary View Switcher Tabs (Flowbite Button Group / Pills) */}
      <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
        <Button
          variant="unstyled"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2 cursor-pointer border ${
            activeTab === 'all'
              ? 'bg-red-600 text-white border-red-600 shadow-xs'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900'
          }`}
          onClick={() => {
            setActiveTab('all');
            trackEvent('project_tab_switch', { tab: 'all' });
          }}
        >
          <span>{t.allWorks}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'all' ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
            {projects.length + (repos.length || 3)}
          </span>
        </Button>
        <Button
          variant="unstyled"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2 cursor-pointer border ${
            activeTab === 'case-studies'
              ? 'bg-red-600 text-white border-red-600 shadow-xs'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900'
          }`}
          onClick={() => {
            setActiveTab('case-studies');
            trackEvent('project_tab_switch', { tab: 'case-studies' });
          }}
          icon={<SparklesIcon size={15} />}
        >
          <span>{t.caseStudies}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'case-studies' ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
            {projects.length}
          </span>
        </Button>
        <Button
          variant="unstyled"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2 cursor-pointer border ${
            activeTab === 'github'
              ? 'bg-red-600 text-white border-red-600 shadow-xs'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900'
          }`}
          onClick={() => {
            setActiveTab('github');
            trackEvent('project_tab_switch', { tab: 'github' });
          }}
          icon={<GitRepoIcon size={15} />}
        >
          <span>{t.githubRepos}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'github' ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
            {repos.length || 'Live'}
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
              <Card.Header className="mb-3">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="cyan">{project.category}</Badge>
                  <Badge variant="purple" size="sm">
                    {t.enterpriseSystem}
                  </Badge>
                </div>

                <h5 className="text-lg font-bold text-gray-900 mb-1 leading-snug line-clamp-2">{project.title}</h5>

                {project.company && (
                  <div className="text-xs font-semibold text-red-600 mb-2">
                    {project.company} {project.role ? `• ${project.role}` : ''}
                  </div>
                )}
              </Card.Header>

              <Card.Body className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {project.shortDescription || project.description}
                </p>
              </Card.Body>

              <Card.Footer className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
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
                    <Badge variant="rose">
                      +{project.tags.length - 4} {tCommon.more}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-end w-full pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProject(project);
                    }}
                    icon={<ExternalLinkIcon size={15} />}
                  >
                    <span>{t.viewArchitecture}</span>
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          ))}

        {/* 2. Loading Skeleton for GitHub Repos */}
        {showRepos && isLoadingRepos && repos.length === 0 && (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={`skeleton-${i}`} className="p-6 animate-pulse">
                <Card.Body>
                  <div className="w-3/5 h-5 bg-gray-200 rounded mb-3" />
                  <div className="w-full h-3.5 bg-gray-100 rounded mb-2" />
                  <div className="w-4/5 h-3.5 bg-gray-100 rounded mb-5" />
                  <div className="w-2/5 h-4 bg-gray-200 rounded" />
                </Card.Body>
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
                <Card.Header className="mb-3">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="cyan" icon={<GitRepoIcon size={13} />}>
                      {t.publicRepo}
                    </Badge>
                    <Badge size="sm">
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
                </Card.Header>

                <Card.Body className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {repo.description || 'Public GitHub repository by @ga2631 with active source code and configuration.'}
                  </p>
                </Card.Body>

                <Card.Footer className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
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
                        <Badge variant="rose">
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
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        trackProjectLinkClick(repo.name, repo.html_url, 'github_repo')
                      }
                      icon={<GithubIcon size={15} />}
                    >
                      <span>{t.sourceCode}</span>
                    </Button>

                    {repo.homepage && (
                      <Button
                        as="a"
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="secondary"
                        size="sm"
                        title="Live Preview"
                        onClick={() =>
                          trackProjectLinkClick(repo.name, repo.homepage, 'live_demo')
                        }
                        icon={<ExternalLinkIcon size={14} />}
                      >
                        <span>{t.demo}</span>
                      </Button>
                    )}
                  </div>
                </Card.Footer>
              </Card>
            );
          })}
      </div>

      {/* Detailed Architecture & Case Study Modal */}
      <ModalCaseStudy
        project={activeProject}
        isOpen={Boolean(activeProject)}
        onClose={() => setActiveProject(null)}
        t={t}
        getTechColorInfo={getTechColorInfo}
        closeAriaLabel="Close Project Details"
      />
    </Section>
  );
};
