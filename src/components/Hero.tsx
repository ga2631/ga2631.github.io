'use client';

import React from 'react';
import { PersonalInfo } from '../types';
import { GithubIcon, LinkedinIcon, ZaloIcon, MailIcon, ExternalLinkIcon, CheckIcon } from './Icons';
import { UITranslation } from '../i18n';
import { getSecureMailtoUrl, getSecureZaloUrl } from '../utils/obfuscation';
import { Card, Button } from './common';
import { ButtonPrint } from './composite';
import { trackSocialClick, trackNavigation, trackContactReveal } from '../utils/analytics';

interface HeroProps {
  data: PersonalInfo;
  t: UITranslation['hero'];
}

export const Hero: React.FC<HeroProps> = ({ data, t }) => {
  const handleZaloClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackSocialClick('Zalo', 'https://zalo.me');
    window.open(getSecureZaloUrl(), '_blank', 'noopener,noreferrer');
  };

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackContactReveal('email');
    window.location.href = getSecureMailtoUrl();
  };

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24" id="hero">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-14 items-center">
          {/* Left Column: Visual Developer Profile Card */}
          <div className="flex justify-center lg:justify-start">
            <Card className="avatar-card w-full max-w-[360px] p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
              <div className="relative w-36 h-36 mx-auto mb-4">
                {data.avatarUrl ? (
                  <img
                    src={data.avatarUrl}
                    alt={data.fullName}
                    className="w-full h-full object-cover rounded-full border-2 border-white shadow-sm"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-red-600 text-white font-extrabold text-4xl flex items-center justify-center">
                    T
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 font-heading mb-1">
                {data.fullName}
              </h3>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 mx-auto my-2 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>{data.availability}</span>
              </div>

              <p className="text-sm text-gray-500 mb-4">{data.location}</p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 text-left text-xs font-mono text-gray-700 mb-5">
                <div className="flex items-start gap-1.5">
                  <span className="text-gray-400">$</span>
                  <span>git status</span>
                </div>
                <div className="text-green-600 mt-1 flex items-start gap-1.5">
                  <CheckIcon size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{t.workingTreeClean}</span>
                </div>
                <div className="text-gray-500 mt-1.5 text-[0.8rem]">
                  {t.focusPrompt}
                  <span className="inline-block w-1.5 h-3.5 bg-gray-400 ml-1 animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button
                  as="a"
                  href={data.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="social-icon"
                  aria-label="GitHub Profile"
                  title="GitHub @ga2631"
                  onClick={() => trackSocialClick('GitHub', data.githubUrl)}
                  icon={<GithubIcon size={20} />}
                />

                {data.linkedinUrl && (
                  <Button
                    as="a"
                    href={data.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="social-icon"
                    aria-label="LinkedIn Profile"
                    title="LinkedIn"
                    onClick={() => trackSocialClick('LinkedIn', data.linkedinUrl!)}
                    icon={<LinkedinIcon size={20} />}
                  />
                )}

                {data.zaloUrl && (
                  <Button
                    as="a"
                    href="#"
                    variant="social-icon"
                    aria-label="Zalo Chat"
                    title="Chat via Zalo"
                    onClick={handleZaloClick}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.currentTarget.href = getSecureZaloUrl();
                    }}
                    icon={<ZaloIcon size={20} />}
                  />
                )}

                <Button
                  as="a"
                  href="#"
                  variant="social-icon"
                  aria-label="Send Email"
                  title="Email"
                  onClick={handleEmailClick}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.href = getSecureMailtoUrl();
                  }}
                  icon={<MailIcon size={20} />}
                />
              </div>
            </Card>
          </div>

          {/* Right Column: Hero Headline & Summary */}
          <div className="text-center lg:text-left">
            <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 mb-5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>{data.availability}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 font-heading mb-4 leading-tight">
              {t.greeting} <span className="text-red-600">{data.fullName}</span>
            </h1>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 font-heading">
              {data.jobTitle}
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
              {data.bio}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <Button
                as="a"
                href="#projects"
                variant="primary"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  trackNavigation('#projects', 'Hero Projects CTA', 'hero_cta');
                  const elem = document.getElementById('projects');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                icon={<ExternalLinkIcon size={16} />}
                iconPosition="right"
              >
                <span>{t.viewProjects}</span>
              </Button>

              <Button
                as="a"
                href="#contact"
                variant="secondary"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  trackNavigation('#contact', 'Hero Contact CTA', 'hero_cta');
                  const elem = document.getElementById('contact');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>{t.getInTouch}</span>
              </Button>

              <ButtonPrint
                label={t.saveCv || 'Print ATS CV'}
                title={t.saveCv || 'Print ATS CV'}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        {data.stats && data.stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
            {data.stats.map((stat, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-center">
                <div className="text-2xl lg:text-3xl font-extrabold text-red-600 font-heading">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-gray-500 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
