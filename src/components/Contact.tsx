import React, { useState } from 'react';
import { PersonalInfo } from '../types/index.ts';
import { MailIcon, MapPinIcon, CopyIcon, CheckIcon, LinkedinIcon, ExternalLinkIcon, PhoneIcon, ZaloIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { SecureEmail, SecurePhone, getSecureEmail, getSecureMailtoUrl, getSecureTelUrl, getSecureZaloUrl } from '../utils/obfuscation.tsx';
import { Card, Button, Badge } from './common';
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
      <div className="contact-cards-grid">
        {/* Email Card */}
        <Card className="contact-card">
          <Card.Header>
            <div className="contact-card-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <MailIcon size={26} />
            </div>
          </Card.Header>

          <Card.Body className="contact-card-body">
            <div className="contact-card-label">{t.emailLabel}</div>
            <SecureEmail asLink className="contact-card-value" />
            <p className="contact-card-hint">
              {t.emailHint}
            </p>
          </Card.Body>

          <Card.Footer className="contact-card-actions">
            <Button
              as="a"
              href="#"
              variant="primary"
              size="sm"
              onClick={handleEmailCompose}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.href = getSecureMailtoUrl(); }}
              icon={<MailIcon size={14} />}
              title="Open default email client"
            >
              <span>{t.compose}</span>
            </Button>
          </Card.Footer>
        </Card>

        {/* Phone Card */}
        {data.phone && (
          <Card className="contact-card">
            <Card.Header>
              <div className="contact-card-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                <PhoneIcon size={26} />
              </div>
            </Card.Header>

            <Card.Body className="contact-card-body">
              <div className="contact-card-label">{t.phoneLabel}</div>
              <SecurePhone asLink className="contact-card-value" />
              <p className="contact-card-hint">
                {t.phoneHint}
              </p>
            </Card.Body>

            <Card.Footer className="contact-card-actions">
              <Button
                as="a"
                href="#"
                variant="primary"
                size="sm"
                onClick={handlePhoneCall}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.href = getSecureTelUrl(); }}
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
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.href = getSecureZaloUrl(); }}
                icon={<ZaloIcon size={14} />}
                title="Chat via Zalo"
              >
                <span>{t.zalo}</span>
              </Button>
            </Card.Footer>
          </Card>
        )}

        {/* Location & Personal Card */}
        <Card className="contact-card">
          <Card.Header>
            <div className="contact-card-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
              <MapPinIcon size={26} />
            </div>
          </Card.Header>

          <Card.Body className="contact-card-body">
            <div className="contact-card-label">{t.locationLabel}</div>
            <div className="contact-card-value" style={{ fontSize: '1.05rem' }}>
              {data.location}
            </div>
            {data.birthday && (
              <p className="contact-card-hint" style={{ marginTop: '4px' }}>
                {t.locationHint}
              </p>
            )}
          </Card.Body>

          <Card.Footer className="contact-card-actions">
            <Badge variant="emerald">
              {t.locationCta}
            </Badge>
          </Card.Footer>
        </Card>

        {/* LinkedIn Profile Card (if available) */}
        {data.linkedinUrl && (
          <Card className="contact-card">
            <Card.Header>
              <div className="contact-card-icon" style={{ background: 'rgba(14, 118, 168, 0.15)', color: '#0ea5e9' }}>
                <LinkedinIcon size={26} />
              </div>
            </Card.Header>

            <Card.Body className="contact-card-body">
              <div className="contact-card-label">{t.linkedinLabel}</div>
              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-value"
              >
                {data.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </a>
              <p className="contact-card-hint">
                {t.linkedinHint}
              </p>
            </Card.Body>

            <Card.Footer className="contact-card-actions">
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
