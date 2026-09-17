import React, { useState, useEffect } from 'react';

/**
 * Obfuscation utility for sensitive contact information (Email, Phone, Zalo)
 * Protects against automated web crawlers, regex scanners, and scraping bots
 * while maintaining 100% seamless display and usability for human users.
 */

// Chunked obfuscated tokens to prevent static regex scanning in bundle files
const OBFUSCATED_EMAIL_CHUNKS = ['dGFu', 'aHV5', 'bmgy', 'NjMx', 'QGdt', 'YWls', 'LmNv', 'bQ=='];
const OBFUSCATED_PHONE_CHUNKS = ['Kzg0', 'LTk2', 'MzY4', 'NDUy', 'MA=='];
const OBFUSCATED_ZALO_CHUNKS = ['aHR0cHM6', 'Ly96YWxv', 'Lm1lLzA5', 'NjM2ODQ1', 'MjA='];

export const getSecureEmail = (): string => {
  try {
    return atob(OBFUSCATED_EMAIL_CHUNKS.join(''));
  } catch {
    return ['tanhuynh', '2631', '@gmail', '.com'].join('');
  }
};

export const getSecureMailtoUrl = (subject?: string): string => {
  const email = getSecureEmail();
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${email}${query}`;
};

export const getSecurePhone = (): string => {
  try {
    return atob(OBFUSCATED_PHONE_CHUNKS.join(''));
  } catch {
    return ['+84-', '9636', '84520'].join('');
  }
};

export const getSecureZaloUrl = (): string => {
  try {
    return atob(OBFUSCATED_ZALO_CHUNKS.join(''));
  } catch {
    return ['https:', '//zalo.me/', '0963684520'].join('');
  }
};

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
 * - Human visitors see the normal "tanhuynh2631@gmail.com" format instantly without any extra interaction.
 */
export const SecureEmail: React.FC<SecureContactProps> = ({ asLink = false, className = '' }) => {
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    setEmail(getSecureEmail());
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
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
 * - Human visitors see the normal "+84-963684520" format instantly without any extra interaction.
 */
export const SecurePhone: React.FC<SecureContactProps> = ({ asLink = false, className = '' }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  useEffect(() => {
    setPhoneNumber(getSecurePhone());
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
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

  const part1 = phoneNumber.slice(0, 4); // "+84-"
  const part2 = phoneNumber.slice(4, 7); // "963"
  const part3 = phoneNumber.slice(7);    // "684520"

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
