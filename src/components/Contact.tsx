import React, { useState } from 'react';
import { PersonalInfo } from '../types/index.ts';
import { MailIcon, MapPinIcon, CopyIcon, CheckIcon, GithubIcon, LinkedinIcon } from './Icons.tsx';

interface ContactProps {
  data: PersonalInfo;
}

export const Contact: React.FC<ContactProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
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
            Interested in discussing opportunities, system architecture, or collaborating on engineering projects?
          </p>
        </div>

        <div className="contact-grid">
          {/* Left Column: Direct Info & Quick Copy */}
          <div className="contact-info-list">
            <div className="contact-info-item">
              <div className="contact-icon-box">
                <MailIcon size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Address</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                  {data.email}
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={copyEmailToClipboard}
                title="Copy Email to Clipboard"
                style={{ minWidth: '85px' }}
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
            </div>

            {data.phone && (
              <div className="contact-info-item">
                <div className="contact-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Phone Number</div>
                  <a href={`tel:${data.phone}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {data.phone}
                  </a>
                </div>
              </div>
            )}

            <div className="contact-info-item">
              <div className="contact-icon-box">
                <MapPinIcon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Location</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{data.location}</div>
                {data.birthday && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Born: {data.birthday}
                  </div>
                )}
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon-box">
                <GithubIcon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>GitHub Profile</div>
                <a
                  href={data.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 600, color: 'var(--text-accent)' }}
                >
                  github.com/ga2631
                </a>
              </div>
            </div>

            {data.linkedinUrl && (
              <div className="contact-info-item">
                <div className="contact-icon-box">
                  <LinkedinIcon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>LinkedIn Network</div>
                  <a
                    href={data.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 600, color: 'var(--text-accent)' }}
                  >
                    linkedin.com/in/tanhn
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Quick Contact Form */}
          <div className="glass-panel contact-form">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>
              Send a Direct Message
            </h3>

            {submitted ? (
              <div style={{
                padding: '24px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#10b981',
              }}>
                <CheckIcon size={32} style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>Message Prepared!</h4>
                <p style={{ fontSize: '0.9rem' }}>
                  Thank you! You can also directly reach out at <strong>{data.email}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Your Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    className="form-control"
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    className="form-control"
                    placeholder="Job Opportunity / Engineering Collaboration"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    className="form-control"
                    placeholder="Describe your project, position details, or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <MailIcon size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
