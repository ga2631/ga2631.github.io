import React, { useState } from 'react';
import { ProjectItem } from '../types/index.ts';
import { CodeIcon, GithubIcon, ExternalLinkIcon } from './Icons.tsx';

interface ProjectsProps {
  projects: ProjectItem[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
            A selection of production systems, developer tools, and architectures I've designed and built.
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

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="glass-panel project-card">
              <div className="project-top">
                <div className="project-meta">
                  <span className="badge badge-cyan">{project.category}</span>
                  {project.featured && <span className="badge badge-emerald">Featured</span>}
                </div>

                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>

                <div className="project-highlights">
                  {project.highlights.map((item, idx) => (
                    <div key={idx} className="highlight-item">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="tech-tags-list" style={{ marginBottom: '16px' }}>
                  {project.tags.map((t) => (
                    <span key={t} className="badge">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="project-actions">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      title="View GitHub Repository"
                    >
                      <GithubIcon size={16} />
                      <span>Source Code</span>
                    </a>
                  )}

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      title="View Live Demo"
                    >
                      <ExternalLinkIcon size={16} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
