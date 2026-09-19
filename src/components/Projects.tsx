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
import { UITranslation } from '../data/cvData.ts';
import { Card, Button, Badge } from './common';
import { Section, CaseStudyModal } from './ui';

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
      {/* Primary View Switcher Tabs */}
      <div className="project-view-tabs">
        <Button
          variant="unstyled"
          className={`project-view-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>{t.allWorks}</span>
          <span className="view-tab-count">{projects.length + (repos.length || 3)}</span>
        </Button>
        <Button
          variant="unstyled"
          className={`project-view-tab ${activeTab === 'case-studies' ? 'active' : ''}`}
          onClick={() => setActiveTab('case-studies')}
          icon={<SparklesIcon size={15} />}
        >
          <span>{t.caseStudies}</span>
          <span className="view-tab-count">{projects.length}</span>
        </Button>
        <Button
          variant="unstyled"
          className={`project-view-tab ${activeTab === 'github' ? 'active' : ''}`}
          onClick={() => setActiveTab('github')}
          icon={<GitRepoIcon size={15} />}
        >
          <span>{t.githubRepos}</span>
          <span className="view-tab-count">{repos.length || 'Live'}</span>
        </Button>
      </div>

      {/* Unified Projects Grid */}
      <div className="projects-grid">
        {/* 1. Enterprise Architecture Case Studies */}
        {showCaseStudies &&
          projects.map((project: ProjectItem) => (
            <Card
              key={project.id}
              className="project-card-compact"
              onClick={() => setActiveProject(project)}
            >
              <Card.Header className="project-card-header">
                <div className="project-meta-row">
                  <Badge variant="cyan">{project.category}</Badge>
                  <Badge variant="purple" style={{ fontSize: '0.75rem' }}>
                    {t.enterpriseSystem}
                  </Badge>
                </div>

                <h3 className="project-card-title">{project.title}</h3>

                {project.company && (
                  <div className="project-company-tag">
                    {project.company} {project.role ? `• ${project.role}` : ''}
                  </div>
                )}
              </Card.Header>

              <Card.Body className="project-card-body">
                <p className="project-card-desc">
                  {project.shortDescription || project.description}
                </p>
              </Card.Body>

              <Card.Footer className="project-card-footer">
                <div className="tech-tags-list" style={{ marginBottom: '14px' }}>
                  {project.tags.slice(0, 4).map((tech: string) => {
                    const info = getTechColorInfo(tech);
                    return (
                      <span
                        key={tech}
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
                        {tech}
                      </span>
                    );
                  })}
                  {project.tags.length > 4 && (
                    <Badge style={{ color: 'var(--text-accent)' }}>
                      +{project.tags.length - 4} {tCommon.more}
                    </Badge>
                  )}
                </div>

                <div className="project-actions-compact">
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
              <Card key={`skeleton-${i}`} className="github-repo-card repo-skeleton-card">
                <Card.Body>
                  <div className="skeleton-line" style={{ width: '60%', height: '22px', marginBottom: '12px' }} />
                  <div className="skeleton-line" style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
                  <div className="skeleton-line" style={{ width: '80%', height: '14px', marginBottom: '20px' }} />
                  <div className="skeleton-line" style={{ width: '40%', height: '18px' }} />
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
              <Card key={repo.id} className="github-repo-card">
                <Card.Header className="project-card-header">
                  <div className="project-meta-row">
                    <Badge variant="cyan" icon={<GitRepoIcon size={13} />}>
                      {t.publicRepo}
                    </Badge>
                    <Badge style={{ fontSize: '0.75rem' }}>
                      {formatDate(repo.updated_at)}
                    </Badge>
                  </div>

                  <h3 className="project-card-title repo-title">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-link-title"
                    >
                      {repo.name}
                    </a>
                  </h3>
                </Card.Header>

                <Card.Body className="project-card-body">
                  <p className="project-card-desc repo-desc">
                    {repo.description || 'Public GitHub repository by @ga2631 with active source code and configuration.'}
                  </p>
                </Card.Body>

                <Card.Footer className="project-card-footer">
                  <div className="repo-stats-row">
                    {repo.language && (
                      <div className="repo-lang-pill" style={{ color: mainLangInfo.color }}>
                        <span
                          className="lang-color-dot"
                          style={{
                            backgroundColor: mainLangInfo.color,
                            boxShadow: `0 0 8px ${mainLangInfo.color}`,
                          }}
                        />
                        <span style={{ fontWeight: 700 }}>{repo.language}</span>
                      </div>
                    )}

                    <div className="repo-counts">
                      <span className="repo-count-item" title="Stars">
                        <StarIcon size={14} />
                        <span>{repo.stargazers_count}</span>
                      </span>
                      <span className="repo-count-item" title="Forks">
                        <GitForkIcon size={14} />
                        <span>{repo.forks_count}</span>
                      </span>
                    </div>
                  </div>

                  {repoTags.length > 0 && (
                    <div className="tech-tags-list" style={{ marginBottom: '14px' }}>
                      {repoTags.slice(0, 4).map((tag: string) => {
                        const info = getTechColorInfo(tag);
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
                      {repoTags.length > 4 && (
                        <Badge style={{ color: 'var(--text-accent)' }}>
                          +{repoTags.length - 4} {tCommon.more}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="project-actions-compact">
                    <Button
                      as="a"
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      size="sm"
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
      <CaseStudyModal
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
