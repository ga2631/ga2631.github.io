import React, { useState, useEffect } from 'react';
import { ProjectItem } from '../types/index.ts';
import {
  CodeIcon,
  GithubIcon,
  ExternalLinkIcon,
  GitRepoIcon,
  StarIcon,
  GitForkIcon,
  SparklesIcon,
  TargetIcon,
  ZapIcon,
  ToolsIcon,
  RocketIcon,
  ShieldIcon,
} from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { Card, Badge, Button, Modal } from './common';
import { SectionHeader } from './composite';

interface ProjectsProps {
  projects: ProjectItem[];
  t: UITranslation['projects'];
  tCommon: UITranslation['common'];
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  fork: boolean;
}

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 101,
    name: 'ga2631.github.io',
    full_name: 'ga2631/ga2631.github.io',
    html_url: 'https://github.com/ga2631/ga2631.github.io',
    description: 'Modern Portfolio & Interactive Engineering CV built with React 19, TypeScript, and Vite.',
    homepage: 'https://ga2631.github.io',
    stargazers_count: 1,
    forks_count: 0,
    language: 'TypeScript',
    topics: ['react', 'typescript', 'vite', 'portfolio', 'resume'],
    updated_at: new Date().toISOString(),
    fork: false,
  },
  {
    id: 102,
    name: 'microservices-cdc-pipeline',
    full_name: 'ga2631/microservices-cdc-pipeline',
    html_url: 'https://github.com/ga2631',
    description: 'High-throughput CDC pipeline implementation using Debezium, Apache Kafka, and ClickHouse OLAP.',
    homepage: null,
    stargazers_count: 3,
    forks_count: 1,
    language: 'Go',
    topics: ['golang', 'kafka', 'clickhouse', 'cdc', 'debezium'],
    updated_at: new Date().toISOString(),
    fork: false,
  },
  {
    id: 103,
    name: 'spring-boot-ecommerce-core',
    full_name: 'ga2631/spring-boot-ecommerce-core',
    html_url: 'https://github.com/ga2631',
    description: 'Enterprise ERP & E-Commerce microservices engine with Spring Boot, Redis Cache, and PostgreSQL.',
    homepage: null,
    stargazers_count: 2,
    forks_count: 0,
    language: 'Java',
    topics: ['java', 'spring-boot', 'postgresql', 'redis', 'microservices'],
    updated_at: new Date().toISOString(),
    fork: false,
  },
];

export const Projects: React.FC<ProjectsProps> = ({ projects, t, tCommon }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'case-studies' | 'github'>('all');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRepos = async () => {
      try {
        setIsLoadingRepos(true);
        const res = await fetch('https://api.github.com/users/ga2631/repos?sort=updated&per_page=12');
        if (!res.ok) {
          throw new Error(`GitHub API returned status ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data) && isMounted) {
          const userRepos = data.filter((r: GitHubRepo) => !r.fork);
          setRepos(userRepos.length > 0 ? userRepos : data);
        }
      } catch (err) {
        console.warn('GitHub API fetch notice (using curated fallback data):', err);
        if (isMounted) {
          setRepos(FALLBACK_REPOS);
        }
      } finally {
        if (isMounted) {
          setIsLoadingRepos(false);
        }
      }
    };

    fetchRepos();
    return () => {
      isMounted = false;
    };
  }, []);

  const getTechColorInfo = (name: string | null) => {
    if (!name) {
      return { color: 'var(--text-accent)', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' };
    }
    const n = name.trim().toLowerCase();

    // 1. Go / Golang
    if (n === 'go' || n === 'golang') {
      return { color: '#00add8', bg: 'rgba(0, 173, 216, 0.12)', border: 'rgba(0, 173, 216, 0.35)' };
    }
    // 2. TypeScript / TS
    if (n === 'typescript' || n === 'ts') {
      return { color: '#3178c6', bg: 'rgba(49, 120, 198, 0.12)', border: 'rgba(49, 120, 198, 0.35)' };
    }
    // 3. JavaScript / JS
    if (n === 'javascript' || n === 'js') {
      return { color: '#eab308', bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.35)' };
    }
    // 4. Python
    if (n === 'python') {
      return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.35)' };
    }
    // 5. Java / Spring Boot
    if (n === 'java' || n.includes('spring')) {
      return { color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.35)' };
    }
    // 6. PHP / Laravel / CodeIgniter
    if (n === 'php' || n.includes('laravel') || n.includes('codeigniter')) {
      return { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)', border: 'rgba(167, 139, 250, 0.35)' };
    }
    // 7. React / ReactJS / Next.js
    if (n.includes('react') || n.includes('next')) {
      return { color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.12)', border: 'rgba(34, 211, 238, 0.35)' };
    }
    // 8. Vue / VueJS
    if (n.includes('vue')) {
      return { color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', border: 'rgba(52, 211, 153, 0.35)' };
    }
    // 9. PostgreSQL
    if (n.includes('postgres')) {
      return { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)', border: 'rgba(96, 165, 250, 0.35)' };
    }
    // 10. MySQL / MariaDB / Binlogs
    if (n.includes('mysql') || n.includes('mariadb') || n.includes('binlog')) {
      return { color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.12)', border: 'rgba(14, 165, 233, 0.35)' };
    }
    // 11. Redis
    if (n.includes('redis')) {
      return { color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)', border: 'rgba(248, 113, 113, 0.35)' };
    }
    // 12. Kafka / RabbitMQ / CDC
    if (n.includes('kafka') || n.includes('rabbitmq') || n.includes('cdc')) {
      return { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.12)', border: 'rgba(251, 146, 60, 0.35)' };
    }
    // 13. ClickHouse / OLAP / Medallion / Data Warehouse
    if (n.includes('clickhouse') || n.includes('olap') || n.includes('medallion') || n.includes('warehouse')) {
      return { color: '#facc15', bg: 'rgba(250, 204, 21, 0.12)', border: 'rgba(250, 204, 21, 0.35)' };
    }
    // 14. Docker / Dockerfile / Container
    if (n.includes('docker')) {
      return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.35)' };
    }
    // 15. Kubernetes / K8s
    if (n.includes('kubernetes') || n.includes('k8s')) {
      return { color: '#818cf8', bg: 'rgba(129, 140, 248, 0.12)', border: 'rgba(129, 140, 248, 0.35)' };
    }
    // 16. Linux / Shell / Bash
    if (n.includes('linux') || n.includes('shell') || n.includes('bash')) {
      return { color: '#a3e635', bg: 'rgba(163, 230, 53, 0.12)', border: 'rgba(163, 230, 53, 0.35)' };
    }
    // 17. BigQuery / SQL
    if (n.includes('bigquery') || n === 'sql') {
      return { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)', border: 'rgba(96, 165, 250, 0.35)' };
    }
    // 18. HTML / CSS / SCSS
    if (n === 'html' || n === 'css' || n === 'scss') {
      return { color: '#f472b6', bg: 'rgba(244, 114, 182, 0.12)', border: 'rgba(244, 114, 182, 0.35)' };
    }
    // 19. Rust
    if (n === 'rust') {
      return { color: '#fdba74', bg: 'rgba(253, 186, 116, 0.12)', border: 'rgba(253, 186, 116, 0.35)' };
    }
    // 20. C++ / C#
    if (n.includes('c++') || n.includes('c#')) {
      return { color: '#fb7185', bg: 'rgba(251, 113, 133, 0.12)', border: 'rgba(251, 113, 133, 0.35)' };
    }
    // 21. Git / CI/CD / DevOps
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
    <section className="section" id="projects">
      <div className="container">
        <SectionHeader
          badge={t.badge}
          badgeIcon={<CodeIcon size={14} />}
          title={t.title}
          subtitle={t.subtitle}
        />

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
                <div className="project-card-header">
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

                  <p className="project-card-desc">
                    {project.shortDescription || project.description}
                  </p>
                </div>

                <div className="project-card-footer">
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
                </div>
              </Card>
            ))}

          {/* 2. Loading Skeleton for GitHub Repos */}
          {showRepos && isLoadingRepos && repos.length === 0 && (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={`skeleton-${i}`} className="github-repo-card repo-skeleton-card">
                  <div className="skeleton-line" style={{ width: '60%', height: '22px', marginBottom: '12px' }} />
                  <div className="skeleton-line" style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
                  <div className="skeleton-line" style={{ width: '80%', height: '14px', marginBottom: '20px' }} />
                  <div className="skeleton-line" style={{ width: '40%', height: '18px' }} />
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
                  <div className="project-card-header">
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

                    <p className="project-card-desc repo-desc">
                      {repo.description || 'Public GitHub repository by @ga2631 with active source code and configuration.'}
                    </p>
                  </div>

                  <div className="project-card-footer">
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

                    {/* Unified Tech Tags List with distinct language colors */}
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
                  </div>
                </Card>
              );
            })}
        </div>

        {/* Detailed Architecture & Case Study Modal */}
        <Modal
          isOpen={Boolean(activeProject)}
          onClose={() => setActiveProject(null)}
          closeAriaLabel="Close Project Details"
          backdropClassName="blog-modal-backdrop"
          contentClassName="blog-modal-content project-modal-dialog"
          bodyClassName="project-modal-body"
        >
          {activeProject && (
            <>
              {/* Header Info */}
              <div className="project-modal-header">
                <div className="project-modal-header-meta">
                  <Badge variant="cyan">{activeProject.category}</Badge>
                  {activeProject.featured && <Badge variant="emerald">{t.featuredProject}</Badge>}
                  {activeProject.teamSize && <Badge>{t.team}: {activeProject.teamSize}</Badge>}
                </div>

                <h2 className="project-modal-title">
                  {activeProject.title}
                </h2>

                {(activeProject.company || activeProject.role) && (
                  <div className="project-modal-subtitle">
                    {activeProject.company} — {activeProject.role}
                  </div>
                )}
              </div>

              {/* Scrollable Content Body */}
              <div className="article-body">
                {/* 1. Project Objective */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '10px' }}>
                    <TargetIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <span>{t.objective}</span>
                  </h3>
                  <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                    {activeProject.description}
                  </p>
                </div>

                {/* 2. Key Responsibilities & Strengths */}
                {activeProject.responsibilities && activeProject.responsibilities.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '12px' }}>
                      <ShieldIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                      <span>{t.responsibilities}</span>
                    </h3>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {activeProject.responsibilities.map((resp, idx) => (
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
                {activeProject.challengesSolutions && activeProject.challengesSolutions.length > 0 ? (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '12px' }}>
                      <ZapIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                      <span>{t.challengesSolutions}</span>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {activeProject.challengesSolutions.map((item, idx) => (
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
                  activeProject.highlights && activeProject.highlights.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '12px' }}>
                        <ZapIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                        <span>{t.challenges}</span>
                      </h3>
                      <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {activeProject.highlights.map((item, idx) => (
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
                {activeProject.achievements && activeProject.achievements.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '12px' }}>
                      <RocketIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                      <span>{t.achievements}</span>
                    </h3>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {activeProject.achievements.map((ach, idx) => (
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
                <div style={{ marginBottom: '8px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '12px' }}>
                    <ToolsIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <span>{t.techStack}</span>
                  </h3>
                  <div className="tech-tags-list" style={{ marginTop: '8px' }}>
                    {activeProject.tags.map((tag: string) => {
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
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal>
      </div>
    </section>
  );
};

