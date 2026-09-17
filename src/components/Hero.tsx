import React from 'react';
import { PersonalInfo } from '../types/index.ts';
import { GithubIcon, LinkedinIcon, MailIcon, DownloadIcon, ExternalLinkIcon } from './Icons.tsx';

interface HeroProps {
  data: PersonalInfo;
}

export const Hero: React.FC<HeroProps> = ({ data }) => {
  return (
    <section className="hero-section" id="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Introduction & CTA */}
          <div className="hero-content">
            <div className="hero-status-pill">
              <span className="status-dot"></span>
              <span>{data.availability}</span>
            </div>

            <h1 className="hero-name">
              Hi, I'm <span className="gradient-text">{data.fullName}</span>
            </h1>

            <h2 className="hero-title">{data.jobTitle}</h2>

            <p className="hero-bio">{data.bio}</p>

            <div className="hero-cta-group">
              <a href="#projects" className="btn btn-primary">
                <span>View Featured Projects</span>
                <ExternalLinkIcon size={16} />
              </a>

              <a href="#contact" className="btn btn-secondary">
                <MailIcon size={16} />
                <span>Get In Touch</span>
              </a>

              <button
                onClick={() => window.print()}
                className="btn btn-outline"
                title="Export or Print CV"
              >
                <DownloadIcon size={16} />
                <span>Save CV (PDF)</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="hero-stats-grid">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="stat-item">
                  <span className="stat-value gradient-text">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                  {stat.subtext && <span className="stat-subtext">{stat.subtext}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Developer Profile Card */}
          <div className="hero-visual">
            <div className="glass-panel avatar-card">
              <div className="avatar-wrapper">
                <div className="avatar-inner">TN</div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>
                {data.fullName}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{data.location}</p>

              <div className="avatar-info-box">
                <div>$ git status</div>
                <div style={{ color: 'var(--accent-emerald)', marginTop: '4px' }}>
                  ✔ Working tree clean
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  $ current_focus: "Cloud & Distributed Systems"
                </div>
              </div>

              <div className="social-links">
                <a
                  href={data.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  aria-label="GitHub Profile"
                  title="GitHub @ga2631"
                >
                  <GithubIcon size={20} />
                </a>

                {data.linkedinUrl && (
                  <a
                    href={data.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-btn"
                    aria-label="LinkedIn Profile"
                    title="LinkedIn"
                  >
                    <LinkedinIcon size={20} />
                  </a>
                )}

                <a
                  href={`mailto:${data.email}`}
                  className="social-icon-btn"
                  aria-label="Send Email"
                  title="Email"
                >
                  <MailIcon size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
