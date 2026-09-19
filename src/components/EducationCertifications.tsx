import React from 'react';
import { EducationItem, CertificationItem } from '../types/index.ts';
import { GraduationCapIcon, AwardIcon, ExternalLinkIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { Card, Badge, Button } from './common';
import { Section } from './ui';

interface EducationCertificationsProps {
  educations: EducationItem[];
  certifications: CertificationItem[];
  t: UITranslation['education'];
}

export const EducationCertifications: React.FC<EducationCertificationsProps> = ({
  educations,
  certifications,
  t,
}) => {
  return (
    <Section
      id="education"
      badge={t.badge}
      badgeIcon={<GraduationCapIcon size={14} />}
      title={t.title}
      subtitle={t.subtitle}
    >
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
            <span>{t.academicBg}</span>
          </h3>

          {educations.map((edu) => (
            <Card key={edu.id} className="edu-card">
              <Card.Header>
                <h4 className="edu-degree">{edu.degree}</h4>
                <div className="edu-institution">{edu.institution}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
                  {edu.period} • {edu.location}
                </div>

                {edu.gpaOrHonors && (
                  <div style={{ marginBottom: '12px' }}>
                    <Badge variant="emerald">{edu.gpaOrHonors}</Badge>
                  </div>
                )}
              </Card.Header>

              {edu.details && (
                <Card.Body>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
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
                </Card.Body>
              )}
            </Card>
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
            <span>{t.certificationsTitle}</span>
          </h3>

          {certifications.map((cert) => (
            <Card key={cert.id} className="cert-card">
              <Card.Header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div>
                    <h4 className="cert-title" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
                      {cert.name}
                    </h4>
                    <div style={{ color: 'var(--text-accent)', fontSize: '0.9rem', fontWeight: 500 }}>
                      {cert.issuer}
                    </div>
                  </div>
                  <Badge>{cert.issueDate}</Badge>
                </div>
              </Card.Header>

              <Card.Footer>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  {cert.badgeCode ? (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {t.credentialId}: {cert.badgeCode}
                    </span>
                  ) : <div />}

                  {cert.credentialUrl && (
                    <Button
                      as="a"
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      size="sm"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      icon={<ExternalLinkIcon size={12} />}
                      iconPosition="right"
                    >
                      <span>{t.viewCredential}</span>
                    </Button>
                  )}
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
};
