'use client';

import React from 'react';
import { PersonalInfo } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { trackSocialClick } from '@/utils/analytics';

interface HeroSectionProps {
  personalInfo: PersonalInfo;
}

export function HeroSection({ personalInfo }: HeroSectionProps) {
  const { dict } = useLanguage();

  const stats = personalInfo.stats && personalInfo.stats.length >= 4
    ? personalInfo.stats
    : [
        { label: dict.hero.statYears, value: '5 Năm' },
        { label: dict.hero.statMatching, value: '96%' },
        { label: dict.hero.statQuery, value: '70%+' },
        { label: dict.hero.statUsers, value: '1,000+' },
      ];

  const handleSocialClick = (platform: string, url: string) => {
    trackSocialClick(platform, url);
  };

  const phone = personalInfo.phone || '0901234567';
  const email = personalInfo.email || 'hello@example.com';
  const githubUrl = personalInfo.githubUrl || 'https://github.com/ga2631';
  const linkedinUrl = personalInfo.linkedinUrl || 'https://linkedin.com/in/huynhnhattan';

  return (
    <section className="mb-16 scroll-mt-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Info Card (Left) */}
        <div className="lg:col-span-4 relative group rounded-3xl p-[3px] overflow-hidden shadow-xl shadow-red-100/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 h-full">
          <div
            className="absolute inset-[-50%] z-0 animate-spin-slow opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0 65deg, #e11d48 90deg, transparent 115deg 245deg, #e11d48 270deg, transparent 295deg 360deg)',
            }}
          />

          <div className="relative z-10 w-full h-full bg-white/95 backdrop-blur-sm rounded-[21px] p-8 flex flex-col items-center text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-red-100 to-rose-50 -z-10" />

            <div className="p-1.5 bg-white rounded-full shadow-lg mb-4 mt-2">
              <img
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
                src={personalInfo.avatarUrl || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'}
                alt={personalInfo.fullName || 'Avatar'}
              />
            </div>

            <h5 className="mb-1 text-4xl font-bold text-gray-900">
              {personalInfo.fullName || dict.nav.brand}
            </h5>
            <span className="text-xl font-bold text-rose-600 px-3 py-1 mb-3">
              {personalInfo.jobTitle || 'Software Engineer'}
            </span>

            <div className="flex items-center space-x-2 text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-full mb-6 border border-green-200 shadow-sm">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <span>
                {personalInfo.availability || dict.hero.availability}
              </span>
            </div>

            <p className="text-gray-500 text-md italic mb-6 leading-relaxed flex-grow">
              &quot;{personalInfo.tagline || dict.hero.defaultTagline}&quot;
            </p>

            {/* Các liên kết Social */}
            <div className="mt-auto w-full pt-6 flex justify-center space-x-4 border-t border-gray-100">
              <a
                href={`tel:${phone}`}
                onClick={() => handleSocialClick('Phone', `tel:${phone}`)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#0077b5] hover:shadow-lg transition-all border border-gray-200"
                title="Phone"
                aria-label="Phone"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </a>

              <a
                href={`mailto:${email}`}
                onClick={() => handleSocialClick('Email', `mailto:${email}`)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#0077b5] hover:shadow-lg transition-all border border-gray-200"
                title="Email"
                aria-label="Email"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('GitHub', githubUrl)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#333] hover:shadow-lg transition-all border border-gray-200"
                title="GitHub"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('LinkedIn', linkedinUrl)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#0077b5] hover:shadow-lg transition-all border border-gray-200"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Introduce (Right) */}
        <div className="lg:col-span-8 p-8 lg:p-12 flex flex-col justify-center h-full">
          <p className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-3">
            {dict.hero.greeting}
          </p>

          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900 mb-6 leading-[1.15]">
            {dict.hero.headlinePrefix} <br />
            <span className="text-gradient-shimmer animate-text-shimmer inline-block pb-1">
              {dict.hero.headlineHighlight}
            </span>
            <br />
            {dict.hero.headlineSuffix}
          </h2>

          <div className="text-gray-600 text-lg leading-relaxed space-y-4 font-normal">
            <p className="text-justify">
              {personalInfo.bio || dict.hero.defaultBio1}
            </p>
            <p className="text-justify">
              {dict.hero.defaultBio2Prefix}{' '}
              <strong className="text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                Rust, Python, Go &amp; TypeScript
              </strong>
              , {dict.hero.defaultBio2Suffix}
            </p>
          </div>

          <div className="flex mt-6">
            <a
              href="#projects"
              className="text-white bg-gradient-to-r from-red-500 to-rose-600 px-6 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-rose-200 transition-all transform hover:-translate-y-1"
            >
              <span className="flex items-center space-x-2">
                <span>{dict.hero.featuredProjects}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* 4 Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 border-t-4 border-t-red-500 hover:shadow-lg hover:border-red-500 transition-all ease-in-out">
        {/* 5 Năm kinh nghiệm */}
        <div className="p-8 pt-10 pb-10 text-center flex flex-col items-center justify-center">
          <dt className="mb-1 text-5xl font-bold text-red-500">{stats[0]?.value || '5 Năm'}</dt>
          <dd className="text-gray-500 font-medium text-sm">
            {stats[0]?.label || 'Kinh Nghiệm Thực Chiến'}
          </dd>
        </div>

        {/* 96% khớp nối dữ liệu */}
        <div className="p-8 pt-10 pb-10 text-center flex flex-col items-center justify-center">
          <dt className="mb-1 text-5xl font-bold text-blue-500">{stats[1]?.value || '96%'}</dt>
          <dd className="text-gray-500 font-medium text-sm">
            {stats[1]?.label || 'Tỷ Lệ Khớp Nối Dữ Liệu'}
          </dd>
        </div>

        {/* 70%+ hiệu năng truy vấn */}
        <div className="p-8 pt-10 pb-10 text-center flex flex-col items-center justify-center">
          <dt className="mb-1 text-5xl font-bold text-emerald-500">{stats[2]?.value || '70%+'}</dt>
          <dd className="text-gray-500 font-medium text-sm">
            {stats[2]?.label || 'Tăng Hiệu Năng Truy Vấn'}
          </dd>
        </div>

        {/* 1,000+ người dùng đồng thời */}
        <div className="p-8 pt-10 pb-10 text-center flex flex-col items-center justify-center">
          <dt className="mb-1 text-5xl font-bold text-amber-500">{stats[3]?.value || '1,000+'}</dt>
          <dd className="text-gray-500 font-medium text-sm">
            {stats[3]?.label || 'Users Đồng Thời Xử Lý'}
          </dd>
        </div>
      </div>
    </section>
  );
}
