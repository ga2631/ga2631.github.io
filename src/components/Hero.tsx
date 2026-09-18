import React from 'react';
import { PersonalInfo } from '../types/index.ts';
import { GithubIcon, LinkedinIcon, ZaloIcon, MailIcon, DownloadIcon, ExternalLinkIcon, CheckIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { getSecureMailtoUrl, getSecureZaloUrl } from '../utils/obfuscation.tsx';

interface HeroProps {
  data: PersonalInfo;
  t: UITranslation['hero'];
}

export const Hero: React.FC<HeroProps> = ({ data, t }) => {
  const handleZaloClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(getSecureZaloUrl(), '_blank', 'noopener,noreferrer');
  };

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = getSecureMailtoUrl();
  };
  return (
    <section className="hero-section" id="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Visual Developer Profile Card */}
          <div className="hero-visual">
            <div className="glass-panel avatar-card">
              <div className="avatar-wrapper">
                {data.avatarUrl ? (
                  <img
                    src={data.avatarUrl}
                    alt={data.fullName}
                    className="avatar-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="avatar-inner">T</div>
                )}
              </div>

              <h3 className="avatar-name">
                {data.fullName}
              </h3>

              <div className="hero-status-pill avatar-status-pill mobile-only-status">
                <span className="status-dot"></span>
                <span>{data.availability}</span>
              </div>

              <p className="avatar-location">{data.location}</p>

              <div className="avatar-info-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>$</span>
                  <span>git status</span>
                </div>
                <div style={{ color: 'var(--accent-emerald)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckIcon size={14} style={{ flexShrink: 0 }} />
                  <span>{t.workingTreeClean}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.82rem' }}>
                  {t.focusPrompt}
                  <span className="cursor-blink" />
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

                {data.zaloUrl && (
                  <a
                    href="#"
                    onClick={handleZaloClick}
                    onMouseEnter={(e) => { e.currentTarget.href = getSecureZaloUrl(); }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-btn"
                    aria-label="Zalo Profile"
                    title="Zalo"
                  >
                    <ZaloIcon size={20} />
                  </a>
                )}

                <a
                  href="#"
                  onClick={handleEmailClick}
                  onMouseEnter={(e) => { e.currentTarget.href = getSecureMailtoUrl(); }}
                  className="social-icon-btn"
                  aria-label="Send Email"
                  title="Email"
                >
                  <MailIcon size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Introduction & CTA */}
          <div className="hero-content">
            <div className="hero-status-pill desktop-only-status">
              <span className="status-dot"></span>
              <span>{data.availability}</span>
            </div>

            <h1 className="hero-name">
              {t.greeting} <span className="gradient-text">{data.fullName}</span>
            </h1>

            <h2 className="hero-title">{data.jobTitle}</h2>

            <p className="hero-bio">{data.bio}</p>

            <div className="hero-cta-group">
              <a href="#projects" className="btn btn-primary">
                <span>{t.viewProjects}</span>
                <ExternalLinkIcon size={16} />
              </a>

              <a href="#contact" className="btn btn-secondary">
                <MailIcon size={16} />
                <span>{t.getInTouch}</span>
              </a>

              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
                title="Save CV as PDF"
              >
                <DownloadIcon size={16} />
                <span>{t.saveCv}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full-width Standalone Hero Stats Banner */}
        <div className="glass-panel hero-stats-banner">
          {data.stats.map((stat, idx) => (
            <div key={idx} className="hero-stat-card">
              <div className="hero-stat-value gradient-text">{stat.value}</div>
              <div className="hero-stat-label">{stat.label}</div>
              {stat.subtext && <div className="hero-stat-subtext">{stat.subtext}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
