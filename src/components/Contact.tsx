import React, { useState } from 'react';
import { PersonalInfo } from '../types/index.ts';
import { MailIcon, MapPinIcon, CopyIcon, CheckIcon, LinkedinIcon, ExternalLinkIcon, PhoneIcon, ZaloIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { SecureEmail, SecurePhone, getSecureEmail, getSecureMailtoUrl, getSecureTelUrl, getSecureZaloUrl } from '../utils/obfuscation.tsx';

interface ContactProps {
  data: PersonalInfo;
  t: UITranslation['contact'];
}

export const Contact: React.FC<ContactProps> = ({ data, t }) => {
  const [copied, setCopied] = useState(false);

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getSecureEmail());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleEmailCompose = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = getSecureMailtoUrl();
  };

  const handlePhoneCall = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = getSecureTelUrl();
  };

  const handleZaloChat = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(getSecureZaloUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">{t.badge}</div>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.subtitle}</p>
        </div>

        <div className="contact-cards-grid">
          {/* Email Card */}
          <div className="glass-panel contact-card">
            <div className="contact-card-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <MailIcon size={26} />
            </div>
            <div className="contact-card-body">
              <div className="contact-card-label">{t.emailLabel}</div>
              <SecureEmail asLink className="contact-card-value" />
              <p className="contact-card-hint">
                {t.emailHint}
              </p>
            </div>
            <div className="contact-card-actions">
              <button
                type="button"
                onClick={copyEmailToClipboard}
                className={`btn ${copied ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                title="Copy email to clipboard"
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                <span>{copied ? t.copied : t.copyEmail}</span>
              </button>
              <a
                href="#"
                onClick={handleEmailCompose}
                onMouseEnter={(e) => { e.currentTarget.href = getSecureMailtoUrl(); }}
                className="btn btn-primary btn-sm"
                title="Open default email client"
              >
                <MailIcon size={14} />
                <span>{t.compose}</span>
              </a>
            </div>
          </div>

          {/* Phone Card */}
          {data.phone && (
            <div className="glass-panel contact-card">
              <div className="contact-card-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                <PhoneIcon size={26} />
              </div>
              <div className="contact-card-body">
                <div className="contact-card-label">{t.phoneLabel}</div>
                <SecurePhone asLink className="contact-card-value" />
                <p className="contact-card-hint">
                  {t.phoneHint}
                </p>
              </div>
              <div className="contact-card-actions">
                <a
                  href="#"
                  onClick={handlePhoneCall}
                  onMouseEnter={(e) => { e.currentTarget.href = getSecureTelUrl(); }}
                  className="btn btn-secondary btn-sm"
                  title="Direct Phone Call"
                >
                  <PhoneIcon size={14} />
                  <span>{t.call}</span>
                </a>
                <a
                  href="#"
                  onClick={handleZaloChat}
                  onMouseEnter={(e) => { e.currentTarget.href = getSecureZaloUrl(); }}
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
                {t.locationCta}
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
