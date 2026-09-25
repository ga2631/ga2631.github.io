'use client';

import React, { useState, useEffect } from 'react';
import { trackContactReveal } from '../../utils/analytics';
import {
  getSecureEmail,
  getSecureMailtoUrl,
  getSecurePhone,
  getSecureTelUrl,
} from '../../utils/obfuscation';

export interface SecureContactProps {
  asLink?: boolean;
  className?: string;
}

/**
 * SecureEmail Component:
 * - Employs runtime dynamic decoding and split-span rendering.
 * - Prevents raw email addresses from appearing in static HTML scraper dumps.
 * - Human visitors see the normal decrypted email instantly without any extra interaction.
 */
export const SecureEmail: React.FC<SecureContactProps> = ({
  asLink = false,
  className = '',
}) => {
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    setEmail(getSecureEmail());
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackContactReveal('email');
    window.location.href = getSecureMailtoUrl();
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.href = getSecureMailtoUrl();
  };

  if (!email) {
    return (
      <span
        className={className}
        aria-label="Direct Email"
        style={{ unicodeBidi: 'bidi-override', direction: 'rtl' }}
      >
        <span style={{ display: 'none' }}>protected-email-verification</span>
        moc.liamg@1362hnyuhnat
      </span>
    );
  }

  const atIndex = email.indexOf('@');
  const userPart = atIndex > -1 ? email.slice(0, atIndex) : email;
  const domainPart = atIndex > -1 ? email.slice(atIndex) : '';

  if (asLink) {
    return (
      <a
        href="#"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={className}
        title="Send Email"
      >
        <span>{userPart.slice(0, Math.floor(userPart.length / 2))}</span>
        <span>{userPart.slice(Math.floor(userPart.length / 2))}</span>
        <span>{domainPart}</span>
      </a>
    );
  }

  return (
    <span className={className}>
      <span>{userPart.slice(0, Math.floor(userPart.length / 2))}</span>
      <span>{userPart.slice(Math.floor(userPart.length / 2))}</span>
      <span>{domainPart}</span>
    </span>
  );
};

/**
 * SecurePhone Component:
 * - Employs runtime dynamic decoding and split-span rendering.
 * - Prevents raw phone numbers from appearing in static HTML scraper dumps.
 * - Human visitors see the normal decrypted phone number instantly without any extra interaction.
 */
export const SecurePhone: React.FC<SecureContactProps> = ({
  asLink = false,
  className = '',
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  useEffect(() => {
    setPhoneNumber(getSecurePhone());
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackContactReveal('phone');
    window.location.href = getSecureTelUrl();
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.href = getSecureTelUrl();
  };

  if (!phoneNumber) {
    return (
      <span
        className={className}
        aria-label="Contact Phone"
        style={{ unicodeBidi: 'bidi-override', direction: 'rtl' }}
      >
        <span style={{ display: 'none' }}>protected-contact-verification</span>
        025486369-48+
      </span>
    );
  }

  const part1 = phoneNumber.slice(0, 4);
  const part2 = phoneNumber.slice(4, 7);
  const part3 = phoneNumber.slice(7);

  if (asLink) {
    return (
      <a
        href="#"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={className}
        title="Direct Phone Call"
      >
        <span>{part1}</span>
        <span>{part2}</span>
        <span>{part3}</span>
      </a>
    );
  }

  return (
    <span className={className}>
      <span>{part1}</span>
      <span>{part2}</span>
      <span>{part3}</span>
    </span>
  );
};
