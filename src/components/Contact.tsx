'use client';

import React from 'react';
import { Card, Button, Badge } from 'flowbite-react';
import { PersonalInfo } from '../types/index.ts';
import { MailIcon, MapPinIcon, LinkedinIcon, ExternalLinkIcon, PhoneIcon, ZaloIcon } from './Icons.tsx';
import { UITranslation } from '../i18n';
import { getSecureMailtoUrl, getSecureTelUrl, getSecureZaloUrl } from '../utils/obfuscation';
import { SecureEmail, SecurePhone } from './SecureContact';

interface ContactProps {
  data: PersonalInfo;
  t: UITranslation['contact'];
}

export const Contact: React.FC<ContactProps> = ({ data, t }) => {
  const handleEmailCompose = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = getSecureMailtoUrl();
  };

  const handlePhoneCall = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = getSecureTelUrl();
  };

  const handleZaloChat = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(getSecureZaloUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-20 md:py-24">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="mb-14 text-center">
          <div className="mb-3 inline-flex justify-center">
            <Badge color="failure" size="sm" icon={() => <MailIcon size={14} className="mr-1" />}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Email Card */}
          <Card className="p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-3">
                <MailIcon size={24} />
              </div>

              <div className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-1">
                {t.emailLabel}
              </div>
              <SecureEmail asLink className="text-base font-semibold text-gray-900 hover:text-red-600 transition-colors" />
              <p className="text-xs text-gray-500 mt-2 mb-4">
                {t.emailHint}
              </p>

              <div className="pt-3 border-t border-gray-100 mt-auto">
                <Button
                  as="a"
                  href="#"
                  color="failure"
                  size="xs"
                  onClick={handleEmailCompose}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.href = getSecureMailtoUrl();
                  }}
                  title="Open default email client"
                >
                  <span className="flex items-center gap-1.5">
                    <MailIcon size={14} />
                    <span>{t.compose}</span>
                  </span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Phone Card */}
          {data.phone && (
            <Card className="p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full">
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                  <PhoneIcon size={24} />
                </div>

                <div className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-1">
                  {t.phoneLabel}
                </div>
                <SecurePhone asLink className="text-base font-semibold text-gray-900 hover:text-red-600 transition-colors" />
                <p className="text-xs text-gray-500 mt-2 mb-4">
                  {t.phoneHint}
                </p>

                <div className="pt-3 border-t border-gray-100 flex items-center gap-2 mt-auto">
                  <Button
                    as="a"
                    href="#"
                    color="failure"
                    size="xs"
                    onClick={handlePhoneCall}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.currentTarget.href = getSecureTelUrl();
                    }}
                    title="Direct Phone Call"
                  >
                    <span className="flex items-center gap-1.5">
                      <PhoneIcon size={14} />
                      <span>{t.call}</span>
                    </span>
                  </Button>
                  <Button
                    as="a"
                    href="#"
                    color="light"
                    size="xs"
                    onClick={handleZaloChat}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.currentTarget.href = getSecureZaloUrl();
                    }}
                    title="Chat via Zalo"
                  >
                    <span className="flex items-center gap-1.5">
                      <ZaloIcon size={14} />
                      <span>{t.zalo}</span>
                    </span>
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Location & Personal Card */}
          <Card className="p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-3">
                <MapPinIcon size={24} />
              </div>

              <div className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-1">
                {t.locationLabel}
              </div>
              <div className="text-base font-semibold text-gray-900">
                {data.location}
              </div>
              {data.birthday && (
                <p className="text-xs text-gray-500 mt-2 mb-4">
                  {t.locationHint}
                </p>
              )}

              <div className="pt-3 border-t border-gray-100 mt-auto">
                <Badge color="success" size="xs">
                  {t.locationCta}
                </Badge>
              </div>
            </div>
          </Card>

          {/* LinkedIn Profile Card */}
          {data.linkedinUrl && (
            <Card className="p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  <LinkedinIcon size={24} />
                </div>

                <div className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-1">
                  {t.linkedinLabel}
                </div>
                <a
                  href={data.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-gray-900 truncate block hover:text-red-600 transition-colors"
                >
                  {data.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
                <p className="text-xs text-gray-500 mt-2 mb-4">
                  {t.linkedinHint}
                </p>

                <div className="pt-3 border-t border-gray-100 mt-auto">
                  <Button
                    as="a"
                    href={data.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="light"
                    size="xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{t.viewProfile}</span>
                      <ExternalLinkIcon size={14} />
                    </span>
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
