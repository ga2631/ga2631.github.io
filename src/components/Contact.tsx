import React, { useState } from 'react';
import { PersonalInfo } from '../types/index.ts';
import { MailIcon, MapPinIcon, CopyIcon, CheckIcon, LinkedinIcon, ExternalLinkIcon, PhoneIcon, ZaloIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';

interface ContactProps {
  data: PersonalInfo;
  t: UITranslation['contact'];
}

export const Contact: React.FC<ContactProps> = ({ data, t }) => {
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
            <MailIcon size={14} /> {t.badge}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">
            {t.subtitle}
          </p>
        </div>

        <div className="contact-cards-grid">
          {/* Email Card */}
          <div className="glass-panel contact-card">
            <div className="contact-card-icon">
              <MailIcon size={26} />
            </div>
            <div className="contact-card-body">
              <div className="contact-card-label">{t.emailLabel}</div>
              <a href={`mailto:${data.email}`} className="contact-card-value">
                {data.email}
              </a>
              <p className="contact-card-hint">
                {t.emailHint}
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
                    <span style={{ color: 'var(--accent-emerald)' }}>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size={14} />
                    <span>{t.copyEmail}</span>
                  </>
                )}
              </button>
              <a
                href={`mailto:${data.email}?subject=Job%20Opportunity%20-%20Tan%20Huynh%20Nhat`}
                className="btn btn-primary btn-sm"
              >
                <MailIcon size={14} />
                <span>{t.compose}</span>
              </a>
            </div>
          </div>

          {/* Phone Card */}
          {data.phone && (
            <div className="glass-panel contact-card">
              <div className="contact-card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <PhoneIcon size={26} />
              </div>
              <div className="contact-card-body">
                <div className="contact-card-label">{t.phoneLabel}</div>
                <a href={`tel:${data.phone}`} className="contact-card-value">
                  {data.phone}
                </a>
                <p className="contact-card-hint">
                  {t.phoneHint}
                </p>
              </div>
              <div className="contact-card-actions">
                <a
                  href={`tel:${data.phone}`}
                  className="btn btn-secondary btn-sm"
                  title="Direct Phone Call"
                >
                  <PhoneIcon size={14} />
                  <span>{t.call}</span>
                </a>
                <a
                  href={data.zaloUrl || `https://zalo.me/${data.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  title="Chat via Zalo"
                >
                  <ZaloIcon size={14} />
                  <span>{t.zalo}</span>
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
              <div className="contact-card-label">{t.locationLabel}</div>
              <div className="contact-card-value" style={{ fontSize: '1.05rem' }}>
                {data.location}
              </div>
              {data.birthday && (
                <p className="contact-card-hint" style={{ marginTop: '4px' }}>
                  {t.locationHint}
                </p>
              )}
            </div>
            <div className="contact-card-actions">
              <span className="badge badge-emerald">
                {data.availability}
              </span>
            </div>
          </div>

          {/* LinkedIn Profile Card (if available) */}
          {data.linkedinUrl && (
            <div className="glass-panel contact-card">
              <div className="contact-card-icon" style={{ background: 'rgba(14, 118, 168, 0.15)', color: '#0ea5e9' }}>
                <LinkedinIcon size={26} />
              </div>
              <div className="contact-card-body">
                <div className="contact-card-label">{t.linkedinLabel}</div>
                <a
                  href={data.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-card-value"
                >
                  {data.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
                <p className="contact-card-hint">
                  {t.linkedinHint}
                </p>
              </div>
              <div className="contact-card-actions">
                <a
                  href={data.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <span>{t.viewProfile}</span>
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
