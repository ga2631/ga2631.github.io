import React from 'react';
import { PersonalInfo } from '../types/index.ts';
import { GithubIcon, LinkedinIcon, ZaloIcon, MailIcon, DownloadIcon, ExternalLinkIcon, CheckIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { getSecureMailtoUrl, getSecureZaloUrl } from '../utils/obfuscation.tsx';
import { Card, Button } from './common';

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
            <Card className="avatar-card">
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
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>$</span>
                  <span>git status</span>
                </div>
                <div style={{ color: 'var(--accent-emerald)', marginTop: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <CheckIcon size={14} style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{t.workingTreeClean}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.82rem' }}>
                  {t.focusPrompt}
                  <span className="cursor-blink" />
                </div>
              </div>

              <div className="social-links">
                <Button
                  as="a"
                  href={data.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="social-icon"
                  aria-label="GitHub Profile"
                  title="GitHub @ga2631"
                  icon={<GithubIcon size={20} />}
                />

                {data.linkedinUrl && (
                  <Button
                    as="a"
                    href={data.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="social-icon"
                    aria-label="LinkedIn Profile"
                    title="LinkedIn"
                    icon={<LinkedinIcon size={20} />}
                  />
                )}

                {data.zaloUrl && (
                  <Button
                    as="a"
                    href="#"
                    onClick={handleZaloClick}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.href = getSecureZaloUrl(); }}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="social-icon"
                    aria-label="Zalo Profile"
                    title="Zalo"
                    icon={<ZaloIcon size={20} />}
                  />
                )}

                <Button
                  as="a"
                  href="#"
                  onClick={handleEmailClick}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.href = getSecureMailtoUrl(); }}
                  variant="social-icon"
                  aria-label="Send Email"
                  title="Email"
                  icon={<MailIcon size={20} />}
                />
              </div>
            </Card>
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
              <Button
                as="a"
                href="#projects"
                variant="primary"
                icon={<ExternalLinkIcon size={16} />}
                iconPosition="right"
              >
                <span>{t.viewProjects}</span>
              </Button>

              <Button
                as="a"
                href="#contact"
                variant="secondary"
                icon={<MailIcon size={16} />}
              >
                <span>{t.getInTouch}</span>
              </Button>

              <Button
                variant="secondary"
                onClick={() => window.print()}
                title="Save CV as PDF"
                icon={<DownloadIcon size={16} />}
              >
                <span>{t.saveCv}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Full-width Standalone Hero Stats Banner */}
        <Card className="hero-stats-banner">
          {data.stats.map((stat, idx) => (
            <div key={idx} className="hero-stat-card">
              <div className="hero-stat-value gradient-text">{stat.value}</div>
              <div className="hero-stat-label">{stat.label}</div>
              {stat.subtext && <div className="hero-stat-subtext">{stat.subtext}</div>}
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
};

