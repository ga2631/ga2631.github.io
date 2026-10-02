'use client';

import React from 'react';
import { PersonalInfo } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { trackSocialClick } from '@/utils/analytics';

interface ContactSectionProps {
  personalInfo?: PersonalInfo;
}

export function ContactSection({ personalInfo }: ContactSectionProps) {
  const { dict } = useLanguage();

  const email = personalInfo?.email || 'hello@example.com';
  const phone = personalInfo?.phone || '+84 901 234 567';
  const location = personalInfo?.location || 'TP. Hồ Chí Minh, VN';
  const linkedinUrl = personalInfo?.linkedinUrl || 'https://linkedin.com/in/huynhnhattan';

  const handleLinkClick = (platform: string, url: string) => {
    trackSocialClick(platform, url);
  };

  return (
    <section id="contact" className="mb-16 scroll-mt-28">
      <div className="flex items-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          {dict.sections.contactTitle}
        </h3>
        <div className="ml-6 flex-grow h-px bg-gradient-to-r from-gray-200 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Box Email */}
        <a
          href={`mailto:${email}`}
          onClick={() => handleLinkClick('Email', `mailto:${email}`)}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-100 shadow-lg shadow-red-100/40 flex flex-col items-center justify-center text-center border-t-4 border-t-red-500 hover:-translate-y-1 hover:border-red-500 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-gray-500 font-medium text-sm mb-1">{dict.contact.email}</span>
          <strong className="text-gray-900 font-bold">{email}</strong>
        </a>

        {/* Box Sđt & Zalo */}
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          onClick={() => handleLinkClick('Phone', `tel:${phone}`)}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-100 shadow-lg shadow-red-100/40 flex flex-col items-center justify-center text-center border-t-4 border-t-blue-500 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <span className="text-gray-500 font-medium text-sm mb-1">
            {dict.contact.phone}
          </span>
          <strong className="text-gray-900 font-bold">{phone}</strong>
        </a>

        {/* Box Địa chỉ */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-100 shadow-lg shadow-red-100/40 flex flex-col items-center justify-center text-center border-t-4 border-t-emerald-500 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg transition-all group">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <span className="text-gray-500 font-medium text-sm mb-1">
            {dict.contact.location}
          </span>
          <strong className="text-gray-900 font-bold">{location}</strong>
        </div>

        {/* Box LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleLinkClick('LinkedIn', linkedinUrl)}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-100 shadow-lg shadow-red-100/40 flex flex-col items-center justify-center text-center border-t-4 border-t-amber-500 hover:-translate-y-1 hover:border-amber-500 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 bg-[#0077b5]/10 text-[#0077b5] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#0077b5] group-hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-gray-500 font-medium text-sm mb-1">LinkedIn</span>
          <strong className="text-gray-900 font-bold">/in/huynhnhattan</strong>
        </a>
      </div>
    </section>
  );
}
