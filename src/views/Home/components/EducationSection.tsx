'use client';

import React from 'react';
import { EducationItem, CertificationItem } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

interface EducationSectionProps {
  educations?: EducationItem[];
  certifications?: CertificationItem[];
}

export function EducationSection({
  educations = [],
  certifications = [],
}: EducationSectionProps) {
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';

  const eduItems = educations || [];
  const certItems = certifications || [];

  if (eduItems.length === 0 && certItems.length === 0) {
    return null;
  }

  return (
    <section id="education" className="mb-16 scroll-mt-28">
      <div className="flex items-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          {isEn ? 'Education & Certifications' : 'Education & Certifications'}
        </h3>
        <div className="ml-6 flex-grow h-px bg-gradient-to-r from-gray-200 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Education */}
        <div className="p-8 bg-white backdrop-blur-sm border border-gray-100 rounded-3xl shadow-sm border-t-4 border-t-red-500 hover:border-red-500 hover:shadow-lg h-full transition-all ease-in-out">
          {eduItems.map((edu) => (
            <div key={edu.id}>
              <div className="flex items-start space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-1">{edu.institution}</h4>
                  <p className="text-red-600 font-medium text-md mb-1">{edu.degree}</p>
                  <small className="text-gray-500">
                    {edu.period} • {edu.location}
                  </small>
                </div>
              </div>

              {edu.details && edu.details.length > 0 && (
                <ul className="space-y-3 text-md list-inside font-normal">
                  {edu.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-red-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Right: Certifications */}
        <div className="h-full">
          {certItems.map((cert) => (
            <div
              key={cert.id}
              className="bg-white backdrop-blur-sm border border-gray-100 rounded-2xl p-5 shadow-sm border-t-4 border-t-red-500 hover:border-red-500 hover:shadow-lg transition-all ease-in-out mb-8"
            >
              <div className="flex flex-wrap items-start justify-between">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{cert.name}</h4>
                  <p className="text-gray-500 text-sm mb-4">{cert.issuer}</p>
                </div>
                <time className="block md:mt-0 sm:mb-2 text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm h-fit">
                  {cert.issueDate}
                </time>
              </div>
              {cert.isCompleted &&
                (
                  <a
                    href={cert.credentialUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    {isEn ? 'Verify Certificate' : 'Xác minh chứng chỉ'}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )
              }
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
