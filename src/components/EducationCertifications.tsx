'use client';

import React from 'react';
import { Card, Badge, Button } from 'flowbite-react';
import { EducationItem, CertificationItem } from '../types/index.ts';
import { GraduationCapIcon, AwardIcon, ExternalLinkIcon } from './Icons.tsx';
import { UITranslation } from '../i18n';

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
    <section id="education" className="py-20 md:py-24">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="mb-14 text-center">
          <div className="mb-3 inline-flex justify-center">
            <Badge color="failure" size="sm" icon={() => <GraduationCapIcon size={14} className="mr-1" />}>
              {t.badge}
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3 font-heading">
            {t.title}
          </h2>
          {t.subtitle && (
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education Column */}
          <div className="flex flex-col gap-6">
            <h4 className="flex items-center gap-2.5 text-xl font-bold text-gray-900 mb-2">
              <GraduationCapIcon size={22} className="text-red-600 flex-shrink-0" />
              <span>{t.academicBg}</span>
            </h4>

            {educations.map((edu) => (
              <Card key={edu.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col h-full">
                  <h5 className="text-lg font-bold text-gray-900 mb-1 leading-snug">{edu.degree}</h5>
                  <div className="text-sm font-semibold text-red-600">{edu.institution}</div>
                  <div className="text-xs text-gray-400 mt-1 mb-3">
                    {edu.period} • {edu.location}
                  </div>

                  {edu.gpaOrHonors && (
                    <div className="mb-3">
                      <Badge color="success" size="xs">
                        {edu.gpaOrHonors}
                      </Badge>
                    </div>
                  )}

                  {edu.details && (
                    <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-gray-100">
                      {edu.details.map((detail, idx) => {
                        const [title, ...rest] = detail.split(': ');
                        return (
                          <div key={idx} className="text-sm text-gray-600 leading-relaxed">
                            <span className="font-semibold text-gray-800">• {title}: </span>
                            <span>{rest.join(': ')}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Certifications Column */}
          <div className="flex flex-col gap-6">
            <h4 className="flex items-center gap-2.5 text-xl font-bold text-gray-900 mb-2">
              <AwardIcon size={22} className="text-purple-600 flex-shrink-0" />
              <span>{t.certificationsTitle}</span>
            </h4>

            {certifications.map((cert) => (
              <Card key={cert.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div>
                      <h5 className="text-lg font-bold text-gray-900 mb-1 leading-snug">
                        {cert.name}
                      </h5>
                      <div className="text-sm font-medium text-gray-600">
                        {cert.issuer}
                      </div>
                    </div>
                    <Badge color={cert.isCompleted ? 'success' : 'warning'} size="xs">
                      {cert.issueDate}
                    </Badge>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center w-full mt-auto">
                    {cert.badgeCode ? (
                      <span className="font-mono text-xs text-gray-400">
                        {t.credentialId}: {cert.badgeCode}
                      </span>
                    ) : <div />}

                    {cert.credentialUrl && (
                      <Button
                        as="a"
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="failure"
                        size="xs"
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{t.viewCredential}</span>
                          <ExternalLinkIcon size={14} />
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationCertifications;
