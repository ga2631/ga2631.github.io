import React, { useState, useEffect } from 'react';
import { trackContactReveal } from './analytics';

/**
 * Obfuscation utility for sensitive contact information (Email, Phone, Zalo)
 * Protects against automated web crawlers, regex scanners, and scraping bots
 * while maintaining 100% seamless display and usability for human users.
 */

// Chunked obfuscated tokens to prevent static regex scanning in bundle files
const OBFUSCATED_EMAIL_CHUNKS = ['dGFu', 'aHV5', 'bmgy', 'NjMx', 'QGdt', 'YWls', 'LmNv', 'bQ=='];
const OBFUSCATED_PHONE_CHUNKS = ['Kzg0', 'LTk2', 'MzY4', 'NDUy', 'MA=='];
const OBFUSCATED_ZALO_CHUNKS = ['aHR0cHM6', 'Ly96YWxv', 'Lm1lLzA5', 'NjM2ODQ1', 'MjA='];

export const decodeBase64Safe = (encoded: string): string => {
  if (!encoded) return '';
  try {
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      return window.atob(encoded);
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(encoded, 'base64').toString('utf-8');
    }
  } catch {
    // fallback
  }
  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    const str = encoded.replace(/=+$/, '');
    let output = '';
    for (let bc = 0, bs = 0, buffer = 0, idx = 0; (buffer = chars.indexOf(str.charAt(idx++))) > -1; ) {
      bs = bc % 4 ? bs * 64 + buffer : buffer;
      if (bc++ % 4) {
        output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
      }
    }
    return output;
  } catch {
    return encoded;
  }
};

export const getSecureEmail = (): string => decodeBase64Safe(OBFUSCATED_EMAIL_CHUNKS.join(''));

export const getSecureMailtoUrl = (subject?: string): string => {
  const email = getSecureEmail();
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${email}${query}`;
};

export const getSecurePhone = (): string => decodeBase64Safe(OBFUSCATED_PHONE_CHUNKS.join(''));

export const getSecureZaloUrl = (): string => decodeBase64Safe(OBFUSCATED_ZALO_CHUNKS.join(''));

export const getSecureTelUrl = (): string => {
  const phone = getSecurePhone();
  return `tel:${phone.replace(/[^0-9+]/g, '')}`;
};

interface SecureContactProps {
  asLink?: boolean;
  className?: string;
}

/**
 * SecureEmail Component:
 * - Employs runtime dynamic decoding and split-span rendering.
 * - Prevents raw email addresses from appearing in static HTML scraper dumps.
 * - Human visitors see the normal decrypted email instantly without any extra interaction.
 */
export const SecureEmail: React.FC<SecureContactProps> = ({ asLink = false, className = '' }) => {
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
export const SecurePhone: React.FC<SecureContactProps> = ({ asLink = false, className = '' }) => {
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
