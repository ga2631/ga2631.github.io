'use client';

import React from 'react';
import { EducationItem, CertificationItem } from '../types/index.ts';
import { GraduationCapIcon, AwardIcon, ExternalLinkIcon } from './Icons.tsx';
import { UITranslation } from '../i18n';
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 edu-cert-grid">
        {/* Education Column */}
        <div className="flex flex-col gap-6">
          <h3 className="flex items-center gap-2.5 text-xl font-bold text-slate-900 mb-2">
            <GraduationCapIcon size={22} className="text-red-600 flex-shrink-0" />
            <span>{t.academicBg}</span>
          </h3>

          {educations.map((edu) => (
            <Card key={edu.id} className="p-6 edu-card">
              <Card.Header className="mb-3">
                <h4 className="text-lg font-bold text-slate-900 mb-1 edu-degree">{edu.degree}</h4>
                <div className="text-sm font-semibold text-red-600 edu-institution">{edu.institution}</div>
                <div className="text-xs text-slate-400 mt-1 mb-3">
                  {edu.period} • {edu.location}
                </div>

                {edu.gpaOrHonors && (
                  <div className="mb-3">
                    <Badge variant="emerald">{edu.gpaOrHonors}</Badge>
                  </div>
                )}
              </Card.Header>

              {edu.details && (
                <Card.Body>
                  <div className="flex flex-col gap-2.5 mt-2">
                    {edu.details.map((detail, idx) => {
                      const [title, ...rest] = detail.split(': ');
                      return (
                        <div key={idx} className="text-sm text-slate-600 leading-relaxed">
                          <span className="font-semibold text-slate-800">• {title}: </span>
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
        <div className="flex flex-col gap-6">
          <h3 className="flex items-center gap-2.5 text-xl font-bold text-slate-900 mb-2">
            <AwardIcon size={22} className="text-purple-600 flex-shrink-0" />
            <span>{t.certificationsTitle}</span>
          </h3>

          {certifications.map((cert) => (
            <Card key={cert.id} className="p-6 cert-card">
              <Card.Header className="mb-4">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1 cert-title">
                      {cert.name}
                    </h4>
                    <div className="text-sm font-medium text-slate-600">
                      {cert.issuer}
                    </div>
                  </div>
                  <Badge 
                    variant={cert.isCompleted ? "emerald" : "amber"}
                  >
                    {cert.issueDate}
                  </Badge>
                </div>
              </Card.Header>

              <Card.Footer className="pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center w-full">
                  {cert.badgeCode ? (
                    <span className="font-mono text-xs text-slate-400">
                      {t.credentialId}: {cert.badgeCode}
                    </span>
                  ) : <div />}

                  {cert.credentialUrl && (
                    <Button
                      as="a"
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="primary"
                      size="sm"
                      icon={<ExternalLinkIcon size={14} />}
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

export default EducationCertifications;
