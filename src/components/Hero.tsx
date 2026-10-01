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
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 hero-section" id="hero">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-14 items-center hero-grid">
          {/* Left Column: Visual Developer Profile Card */}
          <div className="flex justify-center lg:justify-start hero-visual">
            <Card className="avatar-card w-full max-w-[360px] p-6 text-center">
              <div className="relative w-36 h-36 mx-auto mb-4 avatar-wrapper">
                {data.avatarUrl ? (
                  <img
                    src={data.avatarUrl}
                    alt={data.fullName}
                    className="w-full h-full object-cover rounded-full border-2 border-white shadow-md avatar-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-brand-gradient text-white font-extrabold text-4xl flex items-center justify-center avatar-inner">
                    T
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-bold text-slate-900 font-heading mb-1 avatar-name">
                {data.fullName}
              </h3>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto my-2 hero-status-pill avatar-status-pill mobile-only-status">
                <span className="w-2 h-2 rounded-full bg-emerald-500 status-dot animate-pulse"></span>
                <span>{data.availability}</span>
              </div>

              <p className="text-sm text-slate-500 mb-4 avatar-location">{data.location}</p>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-left text-xs font-mono text-slate-700 mb-5 avatar-info-box">
                <div className="flex items-start gap-1.5">
                  <span className="text-slate-400">$</span>
                  <span>git status</span>
                </div>
                <div className="text-emerald-600 mt-1 flex items-start gap-1.5">
                  <CheckIcon size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{t.workingTreeClean}</span>
                </div>
                <div className="text-slate-500 mt-1.5 text-[0.8rem]">
                  {t.focusPrompt}
                  <span className="inline-block w-1.5 h-3.5 bg-slate-400 ml-1 animate-pulse cursor-blink" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 social-links">
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
          <div className="hero-content text-center lg:text-left">
            <div className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-5 hero-status-pill desktop-only-status">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse status-dot"></span>
              <span>{data.availability}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-heading mb-4 leading-tight hero-title">
              {t.greeting} <span className="text-brand-gradient">{data.fullName}</span>
            </h1>

            <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-6 font-heading hero-subtitle">
              {data.jobTitle}
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8 hero-bio">
              {data.bio}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center lg:justify-start gap-4 hero-actions">
              <Button
                as="a"
                href="#projects"
                variant="primary"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  trackNavigation('#projects', 'Hero Projects CTA', 'hero');
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
                  trackNavigation('#contact', 'Hero Contact CTA', 'hero');
                  const elem = document.getElementById('contact');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>{t.contactMe}</span>
              </Button>

              <ButtonPrint
                label={t.downloadCv || 'Print ATS CV'}
                title={t.downloadCv || 'Print ATS CV'}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        {data.stats && data.stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
            {data.stats.map((stat, index) => (
              <div key={index} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center stat-item">
                <div className="text-2xl lg:text-3xl font-extrabold text-red-600 font-heading stat-value">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1 stat-label">
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
