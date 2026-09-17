import React, { useState } from 'react';
import { ProjectItem } from '../types/index.ts';
import { CodeIcon, GithubIcon, ExternalLinkIcon, CloseIcon } from './Icons.tsx';

interface ProjectsProps {
  projects: ProjectItem[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const categories = ['All', 'Fullstack', 'Frontend', 'Backend / Cloud', 'Data / AI'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <CodeIcon size={14} /> Portfolio
          </span>
          <h2 className="section-title">Featured Engineering Projects</h2>
          <p className="section-subtitle">
            A curated selection of high-concurrency systems, data warehouse migrations, and enterprise platforms.
          </p>
        </div>

        {/* Category Filter */}
        <div className="filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Optimized Compact Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel project-card-compact"
              onClick={() => setActiveProject(project)}
            >
              <div className="project-card-header">
                <div className="project-meta-row">
                  <span className="badge badge-cyan">{project.category}</span>
                  {project.featured && <span className="badge badge-emerald">Featured</span>}
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
                    style={{ flex: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProject(project);
                    }}
                  >
                    <span>View Architecture</span>
                    <ExternalLinkIcon size={14} />
                  </button>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      title="View GitHub Repository"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GithubIcon size={15} />
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

              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '8px',
                lineHeight: 1.25,
              }}>
                {activeProject.title}
              </h2>

              {(activeProject.company || activeProject.role) && (
                <div style={{
                  color: 'var(--text-accent)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border-color)',
                }}>
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

              <div style={{
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {activeProject.githubUrl && (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <GithubIcon size={16} />
                      <span>GitHub Repo</span>
                    </a>
                  )}
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
