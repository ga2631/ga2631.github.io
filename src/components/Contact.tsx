import React, { useState } from 'react';
import { PersonalInfo } from '../types/index.ts';
import { MailIcon, MapPinIcon, CopyIcon, CheckIcon, GithubIcon, LinkedinIcon, ExternalLinkIcon } from './Icons.tsx';

interface ContactProps {
  data: PersonalInfo;
}

export const Contact: React.FC<ContactProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <MailIcon size={14} /> Connect
          </span>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Interested in discussing engineering leadership, distributed systems, data architecture, or collaborating on high-impact projects?
          </p>
        </div>

        <div className="contact-cards-grid">
          {/* Email Card */}
          <div className="glass-panel contact-card">
            <div className="contact-card-icon">
              <MailIcon size={26} />
            </div>
            <div className="contact-card-body">
              <div className="contact-card-label">Direct Email</div>
              <a href={`mailto:${data.email}`} className="contact-card-value">
                {data.email}
              </a>
              <p className="contact-card-hint">
                Best way to reach out for interview invitations & technical discussions.
              </p>
            </div>
            <div className="contact-card-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={copyEmailToClipboard}
                title="Copy Email to Clipboard"
              >
                {copied ? (
                  <>
                    <CheckIcon size={14} style={{ color: 'var(--accent-emerald)' }} />
                    <span style={{ color: 'var(--accent-emerald)' }}>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <a
                href={`mailto:${data.email}?subject=Job%20Opportunity%20-%20Tan%20Huynh%20Nhat`}
                className="btn btn-primary btn-sm"
              >
                <MailIcon size={14} />
                <span>Compose</span>
              </a>
            </div>
          </div>

          {/* Phone Card */}
          {data.phone && (
            <div className="glass-panel contact-card">
              <div className="contact-card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="contact-card-body">
                <div className="contact-card-label">Phone & Zalo</div>
                <a href={`tel:${data.phone}`} className="contact-card-value">
                  {data.phone}
                </a>
                <p className="contact-card-hint">
                  Available for phone screens, recruiters, and quick syncs.
                </p>
              </div>
              <div className="contact-card-actions">
                <a href={`tel:${data.phone}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  <span>Call Directly</span>
                </a>
              </div>
            </div>
          )}

          {/* Location & Personal Card */}
          <div className="glass-panel contact-card">
            <div className="contact-card-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
              <MapPinIcon size={26} />
            </div>
            <div className="contact-card-body">
              <div className="contact-card-label">Location & Status</div>
              <div className="contact-card-value" style={{ fontSize: '1.05rem' }}>
                {data.location}
              </div>
              {data.birthday && (
                <p className="contact-card-hint" style={{ marginTop: '4px' }}>
                  Born: {data.birthday} • Relocation / Hybrid / Remote friendly
                </p>
              )}
            </div>
            <div className="contact-card-actions">
              <span className="badge badge-emerald" style={{ width: '100%', justifyContent: 'center', padding: '8px 12px' }}>
                {data.availability}
              </span>
            </div>
          </div>

          {/* GitHub Profile Card */}
          <div className="glass-panel contact-card">
            <div className="contact-card-icon" style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-primary)' }}>
              <GithubIcon size={26} />
            </div>
            <div className="contact-card-body">
              <div className="contact-card-label">GitHub Repository</div>
              <a
                href={data.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-value"
              >
                github.com/ga2631
              </a>
              <p className="contact-card-hint">
                Explore open source repositories, architecture templates & demo systems.
              </p>
            </div>
            <div className="contact-card-actions">
              <a
                href={data.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                <span>Visit GitHub</span>
                <ExternalLinkIcon size={14} />
              </a>
            </div>
          </div>

          {/* LinkedIn Profile Card (if available) */}
          {data.linkedinUrl && (
            <div className="glass-panel contact-card">
              <div className="contact-card-icon" style={{ background: 'rgba(14, 118, 168, 0.15)', color: '#0ea5e9' }}>
                <LinkedinIcon size={26} />
              </div>
              <div className="contact-card-body">
                <div className="contact-card-label">Professional Network</div>
                <a
                  href={data.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-card-value"
                >
                  linkedin.com/in/tanhn
                </a>
                <p className="contact-card-hint">
                  Connect on LinkedIn for professional references and endorsements.
                </p>
              </div>
              <div className="contact-card-actions">
                <a
                  href={data.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  <span>Connect on LinkedIn</span>
                  <ExternalLinkIcon size={14} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
