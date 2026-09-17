import React, { useState, useEffect } from 'react';
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
} from './Icons.tsx';

interface ProjectsProps {
  projects: ProjectItem[];
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

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
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
              <CodeIcon size={14} /> Portfolio & Repositories
            </span>
          </div>

          <h2 className="section-title">Featured Engineering Projects</h2>
          <p className="section-subtitle">
            Enterprise architecture deep-dives and public open-source repositories loaded live from GitHub.
          </p>
        </div>

        {/* Primary View Switcher Tabs */}
        <div className="project-view-tabs">
          <button
            className={`project-view-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>All Works</span>
            <span className="view-tab-count">{projects.length + (repos.length || 3)}</span>
          </button>
          <button
            className={`project-view-tab ${activeTab === 'case-studies' ? 'active' : ''}`}
            onClick={() => setActiveTab('case-studies')}
          >
            <SparklesIcon size={15} />
            <span>Architecture Case Studies</span>
            <span className="view-tab-count">{projects.length}</span>
          </button>
          <button
            className={`project-view-tab ${activeTab === 'github' ? 'active' : ''}`}
            onClick={() => setActiveTab('github')}
          >
            <GitRepoIcon size={15} />
            <span>GitHub Repositories</span>
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
                      Enterprise System
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
                          {impact}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="project-card-footer">
                  <div className="tech-tags-list" style={{ marginBottom: '14px' }}>
                    {project.tags.slice(0, 4).map((t) => (
                      <span key={t} className="badge">
                        {t}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="badge" style={{ color: 'var(--text-accent)' }}>
                        +{project.tags.length - 4} more
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
                      <span>View Architecture</span>
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
            repos.map((repo) => (
              <div key={repo.id} className="glass-panel github-repo-card">
                <div className="project-card-header">
                  <div className="project-meta-row">
                    <span className="repo-source-badge">
                      <GitRepoIcon size={14} /> Public Repo
                    </span>
                    <span className="repo-date">{formatDate(repo.updated_at)}</span>
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

                  {/* Topic Tags */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="tech-tags-list" style={{ marginBottom: '14px' }}>
                      {repo.topics.slice(0, 4).map((topic) => (
                        <span key={topic} className="badge badge-topic">
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
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

                  <div className="project-actions-compact">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      <GithubIcon size={15} />
                      <span>Source Code</span>
                    </a>

                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        title="Live Preview"
                        style={{ flex: '0 0 auto', padding: '0 16px' }}
                      >
                        <ExternalLinkIcon size={14} />
                        <span>Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Detailed Architecture & Case Study Modal */}
        {activeProject && (
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
                {activeProject.featured && <span className="badge badge-emerald">Featured Project</span>}
                {activeProject.teamSize && <span className="badge">Team: {activeProject.teamSize}</span>}
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
                <h3>🎯 Project Objective</h3>
                <p>{activeProject.description}</p>

                <h3>⚡ Key Engineering Challenges & Technical Solutions</h3>
                <ul>
                  {activeProject.highlights.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '10px' }}>
                      {item}
                    </li>
                  ))}
                </ul>

                <h3>🛠️ Full Technology Stack</h3>
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
                      <span>Live System</span>
                    </a>
                  )}
                </div>

                <button className="btn btn-secondary btn-sm" onClick={() => setActiveProject(null)}>
                  Close Case Study
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
