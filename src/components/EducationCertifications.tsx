import React from 'react';
import { EducationItem, CertificationItem } from '../types/index.ts';
import { GraduationCapIcon, AwardIcon, ExternalLinkIcon } from './Icons.tsx';

interface EducationCertificationsProps {
  educations: EducationItem[];
  certifications: CertificationItem[];
}

export const EducationCertifications: React.FC<EducationCertificationsProps> = ({
  educations,
  certifications,
}) => {
  return (
    <section className="section" id="education">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <GraduationCapIcon size={14} /> Background
          </span>
          <h2 className="section-title">Education & Certifications</h2>
          <p className="section-subtitle">
            Formal computer science education and verified industry credentials.
          </p>
        </div>

        <div className="edu-cert-grid">
          {/* Education Column */}
          <div>
            <h3 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '20px',
              color: 'var(--text-primary)',
            }}>
              <GraduationCapIcon size={22} style={{ color: 'var(--accent-cyan)' }} />
              <span>Academic Education</span>
            </h3>

            {educations.map((edu) => (
              <div key={edu.id} className="glass-panel edu-card">
                <h4 className="edu-degree">{edu.degree}</h4>
                <div className="edu-institution">{edu.institution}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
                  {edu.period} • {edu.location}
                </div>

                {edu.gpaOrHonors && (
                  <div style={{ marginBottom: '12px' }}>
                    <span className="badge badge-emerald">{edu.gpaOrHonors}</span>
                  </div>
                )}

                {edu.details && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                    {edu.details.map((detail, idx) => {
                      const [title, ...rest] = detail.split(': ');
                      return (
                        <div key={idx} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>• {title}: </span>
                          <span>{rest.join(': ')}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Certifications Column */}
          <div>
            <h3 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '20px',
              color: 'var(--text-primary)',
            }}>
              <AwardIcon size={22} style={{ color: 'var(--accent-purple)' }} />
              <span>Professional Certifications</span>
            </h3>

            {certifications.map((cert) => (
              <div key={cert.id} className="glass-panel cert-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
                      {cert.name}
                    </h4>
                    <div style={{ color: 'var(--text-accent)', fontSize: '0.9rem', fontWeight: 500 }}>
                      {cert.issuer}
                    </div>
                  </div>
                  <span className="badge">{cert.issueDate}</span>
                </div>

                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {cert.badgeCode && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Credential ID: {cert.badgeCode}
                    </span>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    >
                      <span>Verify</span>
                      <ExternalLinkIcon size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
