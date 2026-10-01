'use client';

import React from 'react';
import { PersonalInfo } from '../types/index.ts';
import { MailIcon, MapPinIcon, LinkedinIcon, ExternalLinkIcon, PhoneIcon, ZaloIcon } from './Icons.tsx';
import { UITranslation } from '../i18n';
import { getSecureMailtoUrl, getSecureTelUrl, getSecureZaloUrl } from '../utils/obfuscation';
import { Card, Button, Badge, SecureEmail, SecurePhone } from './common';
import { Section } from './ui';

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
    <Section
      id="contact"
      badge={t.badge}
      title={t.title}
      subtitle={t.subtitle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 contact-cards-grid">
        {/* Email Card */}
        <Card className="p-6 contact-card">
          <Card.Header className="mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-2 contact-card-icon">
              <MailIcon size={26} />
            </div>
          </Card.Header>

          <Card.Body className="mb-4 contact-card-body">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1 contact-card-label">
              {t.emailLabel}
            </div>
            <SecureEmail asLink className="text-base font-semibold text-slate-900 contact-card-value hover:text-red-600 transition-colors" />
            <p className="text-xs text-slate-500 mt-2 contact-card-hint">
              {t.emailHint}
            </p>
          </Card.Body>

          <Card.Footer className="pt-3 border-t border-slate-100 contact-card-actions">
            <Button
              as="a"
              href="#"
              variant="primary"
              size="sm"
              onClick={handleEmailCompose}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.href = getSecureMailtoUrl();
              }}
              icon={<MailIcon size={14} />}
              title="Open default email client"
            >
              <span>{t.compose}</span>
            </Button>
          </Card.Footer>
        </Card>

        {/* Phone Card */}
        {data.phone && (
          <Card className="p-6 contact-card">
            <Card.Header className="mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 contact-card-icon">
                <PhoneIcon size={26} />
              </div>
            </Card.Header>

            <Card.Body className="mb-4 contact-card-body">
              <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1 contact-card-label">
                {t.phoneLabel}
              </div>
              <SecurePhone asLink className="text-base font-semibold text-slate-900 contact-card-value hover:text-red-600 transition-colors" />
              <p className="text-xs text-slate-500 mt-2 contact-card-hint">
                {t.phoneHint}
              </p>
            </Card.Body>

            <Card.Footer className="pt-3 border-t border-slate-100 flex items-center gap-2 contact-card-actions">
              <Button
                as="a"
                href="#"
                variant="primary"
                size="sm"
                onClick={handlePhoneCall}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.href = getSecureTelUrl();
                }}
                icon={<PhoneIcon size={14} />}
                title="Direct Phone Call"
              >
                <span>{t.call}</span>
              </Button>
              <Button
                as="a"
                href="#"
                variant="secondary"
                size="sm"
                onClick={handleZaloChat}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.href = getSecureZaloUrl();
                }}
                icon={<ZaloIcon size={14} />}
                title="Chat via Zalo"
              >
                <span>{t.zalo}</span>
              </Button>
            </Card.Footer>
          </Card>
        )}

        {/* Location & Personal Card */}
        <Card className="p-6 contact-card">
          <Card.Header className="mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 contact-card-icon">
              <MapPinIcon size={26} />
            </div>
          </Card.Header>

          <Card.Body className="mb-4 contact-card-body">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1 contact-card-label">
              {t.locationLabel}
            </div>
            <div className="text-base font-semibold text-slate-900 contact-card-value">
              {data.location}
            </div>
            {data.birthday && (
              <p className="text-xs text-slate-500 mt-2 contact-card-hint">
                {t.locationHint}
              </p>
            )}
          </Card.Body>

          <Card.Footer className="pt-3 border-t border-slate-100 contact-card-actions">
            <Badge variant="emerald">
              {t.locationCta}
            </Badge>
          </Card.Footer>
        </Card>

        {/* LinkedIn Profile Card */}
        {data.linkedinUrl && (
          <Card className="p-6 contact-card">
            <Card.Header className="mb-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2 contact-card-icon">
                <LinkedinIcon size={26} />
              </div>
            </Card.Header>

            <Card.Body className="mb-4 contact-card-body">
              <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1 contact-card-label">
                {t.linkedinLabel}
              </div>
              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-slate-900 truncate block hover:text-red-600 transition-colors contact-card-value"
              >
                {data.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </a>
              <p className="text-xs text-slate-500 mt-2 contact-card-hint">
                {t.linkedinHint}
              </p>
            </Card.Body>

            <Card.Footer className="pt-3 border-t border-slate-100 contact-card-actions">
              <Button
                as="a"
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="sm"
                icon={<ExternalLinkIcon size={14} />}
                iconPosition="right"
              >
                <span>{t.viewProfile}</span>
              </Button>
            </Card.Footer>
          </Card>
        )}
      </div>
    </Section>
  );
};

export default Contact;
