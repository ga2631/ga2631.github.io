import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ProjectItem } from '../types/index.ts';
import {
  CodeIcon,
  GithubIcon,
  ExternalLinkIcon,
  CloseIcon,
  GitRepoIcon,
  StarIcon,
  GitForkIcon,
  SparklesIcon,
  TargetIcon,
  ZapIcon,
  ToolsIcon,
  LockIcon,
  RocketIcon,
  ShieldIcon,
  ClockIcon,
  UsersIcon,
  TrendingDownIcon,
  PuzzleIcon,
  HourglassIcon,
  RefreshCwIcon,
} from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';

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

const getImpactIcon = (impact: string) => {
  const lower = impact.toLowerCase();
  // 1. Lock 🔒: reconciliation, zero data loss, data integrity
  if (lower.includes('reconciliation') || lower.includes('zero data loss') || lower.includes('khớp nối') || lower.includes('mất mát')) {
    return <LockIcon size={12} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />;
  }
  // 2. Rocket 🚀: real-time CDC sync, latency <2s
  if (lower.includes('cdc') || lower.includes('real-time') || lower.includes('thời gian thực')) {
    return <RocketIcon size={12} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />;
  }
  // 3. Shield 🛡️: PII privacy, compliance, security
  if (lower.includes('pii') || lower.includes('privacy') || lower.includes('compliance') || lower.includes('quyền riêng tư') || lower.includes('tuân thủ')) {
    return <ShieldIcon size={12} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />;
  }
  // 4. Clock ⏱️: Report generation time reduction
  if (lower.includes('daily report') || lower.includes('tổng hợp báo cáo')) {
    return <ClockIcon size={12} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />;
  }
  // 5. Users 👥: Concurrent users, scaled smoothly, traffic
  if (lower.includes('concurrent users') || lower.includes('scaled') || lower.includes('người dùng đồng thời') || lower.includes('vận hành ổn định')) {
    return <UsersIcon size={12} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />;
  }
  // 6. Hourglass ⏳: Saved hours/week
  if (lower.includes('saved') || lower.includes('tiết kiệm') || lower.includes('hours/week') || lower.includes('giờ/tuần')) {
    return <HourglassIcon size={12} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />;
  }
  // 7. Refresh 🔄: Zero-downtime, automated deployments, CI/CD
  if (lower.includes('zero-downtime') || lower.includes('automated deployments') || lower.includes('triển khai') || lower.includes('không gián đoạn')) {
    return <RefreshCwIcon size={12} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />;
  }
  // 8. Puzzle 🧩: Modular frontend charts, adaptable UX
  if (lower.includes('modular') || lower.includes('mô-đun') || lower.includes('charts') || lower.includes('biểu đồ')) {
    return <PuzzleIcon size={12} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />;
  }
  // 9. Trending Down 📉: Reduction in manual requests, decreased query/report time
  if (lower.includes('reduction') || lower.includes('decreased') || lower.includes('giảm 40%') || lower.includes('giảm 63%') || lower.includes('giảm ')) {
    if (!lower.includes('analytical query times') && !lower.includes('thời gian thực thi truy vấn')) {
      return <TrendingDownIcon size={12} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />;
    }
  }
  // 10. Zap ⚡: Query times, sub-second latency, speed
  return <ZapIcon size={12} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />;
};

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

  const getLanguageColor = (lang: string | null): string => {
    if (!lang) return 'var(--accent-primary)';
    const colorMap: Record<string, string> = {
      TypeScript: '#3178c6',
      JavaScript: '#f7df1e',
      Python: '#3572A5',
      Go: '#00add8',
      Golang: '#00add8',
      Java: '#b07219',
      PHP: '#4F5D95',
      HTML: '#e34c26',
      CSS: '#563d7c',
      SCSS: '#c6538c',
      'C++': '#f34b7d',
      'C#': '#178600',
      Rust: '#dea584',
      Shell: '#89e051',
      Vue: '#41b883',
      Dockerfile: '#384d54',
    };
    return colorMap[lang] || 'var(--accent-primary)';
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
        <div className="section-header">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span className="section-badge">
              <CodeIcon size={14} /> {t.badge}
            </span>
          </div>

          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">
            {t.subtitle}
          </p>
        </div>

        {/* Primary View Switcher Tabs */}
        <div className="project-view-tabs">
          <button
            className={`project-view-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>{t.allWorks}</span>
            <span className="view-tab-count">{projects.length + (repos.length || 3)}</span>
          </button>
          <button
            className={`project-view-tab ${activeTab === 'case-studies' ? 'active' : ''}`}
            onClick={() => setActiveTab('case-studies')}
          >
            <SparklesIcon size={15} />
            <span>{t.caseStudies}</span>
            <span className="view-tab-count">{projects.length}</span>
          </button>
          <button
            className={`project-view-tab ${activeTab === 'github' ? 'active' : ''}`}
            onClick={() => setActiveTab('github')}
          >
            <GitRepoIcon size={15} />
            <span>{t.githubRepos}</span>
            <span className="view-tab-count">{repos.length || 'Live'}</span>
          </button>
        </div>

        {/* Unified Projects Grid */}
        <div className="projects-grid">
          {/* 1. Enterprise Architecture Case Studies */}
          {showCaseStudies &&
            projects.map((project) => (
              <div
                key={project.id}
                className="glass-panel project-card-compact"
                onClick={() => setActiveProject(project)}
              >
                <div className="project-card-header">
                  <div className="project-meta-row">
                    <span className="badge badge-cyan">{project.category}</span>
                    <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                      {t.enterpriseSystem}
                    </span>
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

                  {/* Key Metric Highlights */}
                  {project.keyImpacts && project.keyImpacts.length > 0 && (
                    <div className="project-impact-pills">
                      {project.keyImpacts.slice(0, 3).map((impact, idx) => (
                        <div key={idx} className="impact-pill">
                          {getImpactIcon(impact)}
                          <span>{impact}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="project-card-footer">
                  <div className="tech-tags-list" style={{ marginBottom: '14px' }}>
                    {project.tags.slice(0, 4).map((tech) => (
                      <span key={tech} className="badge">
                        {tech}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="badge" style={{ color: 'var(--text-accent)' }}>
                        +{project.tags.length - 4} {tCommon.more}
                      </span>
                    )}
                  </div>

                  <div className="project-actions-compact">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProject(project);
                      }}
                    >
                      <ExternalLinkIcon size={15} />
                      <span>{t.viewArchitecture}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* 2. Loading Skeleton for GitHub Repos */}
          {showRepos && isLoadingRepos && repos.length === 0 && (
            <>
              {[1, 2, 3].map((i) => (
                <div key={`skeleton-${i}`} className="glass-panel github-repo-card repo-skeleton-card">
                  <div className="skeleton-line" style={{ width: '60%', height: '22px', marginBottom: '12px' }} />
                  <div className="skeleton-line" style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
                  <div className="skeleton-line" style={{ width: '80%', height: '14px', marginBottom: '20px' }} />
                  <div className="skeleton-line" style={{ width: '40%', height: '18px' }} />
                </div>
              ))}
            </>
          )}

          {/* 3. Live GitHub Public Repositories */}
          {showRepos &&
            repos.map((repo) => {
              const repoTags = repo.topics && repo.topics.length > 0
                ? repo.topics
                : (repo.language ? [repo.language] : []);

              return (
                <div key={repo.id} className="glass-panel github-repo-card">
                  <div className="project-card-header">
                    <div className="project-meta-row">
                      <span className="badge badge-cyan">
                        <GitRepoIcon size={13} /> {t.publicRepo}
                      </span>
                      <span className="badge" style={{ fontSize: '0.75rem' }}>
                        {formatDate(repo.updated_at)}
                      </span>
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
                        <div className="repo-lang-pill">
                          <span
                            className="lang-color-dot"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                          <span>{repo.language}</span>
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

                    {/* Unified Tech Tags List */}
                    {repoTags.length > 0 && (
                      <div className="tech-tags-list" style={{ marginBottom: '14px' }}>
                        {repoTags.slice(0, 4).map((tag) => (
                          <span key={tag} className="badge">
                            {tag}
                          </span>
                        ))}
                        {repoTags.length > 4 && (
                          <span className="badge" style={{ color: 'var(--text-accent)' }}>
                            +{repoTags.length - 4} {tCommon.more}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="project-actions-compact">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        <GithubIcon size={15} />
                        <span>{t.sourceCode}</span>
                      </a>

                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          title="Live Preview"
                        >
                          <ExternalLinkIcon size={14} />
                          <span>{t.demo}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Detailed Architecture & Case Study Modal */}
        {activeProject &&
          createPortal(
            <div className="blog-modal-backdrop" onClick={() => setActiveProject(null)}>
              <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                  className="modal-close-btn"
                  onClick={() => setActiveProject(null)}
                  aria-label="Close Project Details"
                >
                  <CloseIcon size={18} />
                </button>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span className="badge badge-cyan">{activeProject.category}</span>
                  {activeProject.featured && <span className="badge badge-emerald">{t.featuredProject}</span>}
                  {activeProject.teamSize && <span className="badge">{t.team}: {activeProject.teamSize}</span>}
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                    lineHeight: 1.25,
                  }}
                >
                  {activeProject.title}
                </h2>

                {(activeProject.company || activeProject.role) && (
                  <div
                    style={{
                      color: 'var(--text-accent)',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      marginBottom: '16px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid var(--border-color)',
                    }}
                  >
                    {activeProject.company} — {activeProject.role}
                  </div>
                )}

                <div className="article-body" style={{ marginTop: '16px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TargetIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <span>{t.objective}</span>
                  </h3>
                  <p>{activeProject.description}</p>

                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ZapIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <span>{t.challenges}</span>
                  </h3>
                  <ul>
                    {activeProject.highlights.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '10px' }}>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ToolsIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <span>{t.fullStack}</span>
                  </h3>
                  <div className="tech-tags-list" style={{ marginTop: '8px', marginBottom: '24px' }}>
                    {activeProject.tags.map((tag) => (
                      <span key={tag} className="badge badge-cyan">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '28px',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    {activeProject.demoUrl && (
                      <a
                        href={activeProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        <ExternalLinkIcon size={16} />
                        <span>{t.demo}</span>
                      </a>
                    )}
                  </div>

                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveProject(null)}>
                    {t.closeModal}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </section>
  );
};
