'use client';

import React, { useState, useEffect } from 'react';
import { getSecureEmail, getSecurePhone, getSecureMailtoUrl, getSecureTelUrl } from '../utils/obfuscation';
import { trackContactReveal } from '../utils/analytics';

export interface SecureEmailProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asLink?: boolean;
  className?: string;
  revealedText?: string;
  unrevealedText?: string;
}

export const SecureEmail: React.FC<SecureEmailProps> = ({
  asLink = false,
  className = '',
  revealedText,
  unrevealedText = 'contact [at] domain',
  ...restProps
}) => {
  const [email, setEmail] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  useEffect(() => {
    // Reveal once mounted on client side to protect against web crawlers
    setEmail(getSecureEmail());
    setIsRevealed(true);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackContactReveal('email');
    if (restProps.onClick) {
      restProps.onClick(e);
    }
  };

  const displayText = isRevealed ? (revealedText || email) : unrevealedText;

  if (asLink && isRevealed) {
    return (
      <a
        href={getSecureMailtoUrl()}
        className={className}
        onClick={handleClick}
        {...restProps}
      >
        {displayText}
      </a>
    );
  }

  return <span className={className}>{displayText}</span>;
};

export interface SecurePhoneProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asLink?: boolean;
  className?: string;
  revealedText?: string;
  unrevealedText?: string;
}

export const SecurePhone: React.FC<SecurePhoneProps> = ({
  asLink = false,
  className = '',
  revealedText,
  unrevealedText = '+84 (0) ••• ••• •••',
  ...restProps
}) => {
  const [phone, setPhone] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  useEffect(() => {
    setPhone(getSecurePhone());
    setIsRevealed(true);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackContactReveal('phone');
    if (restProps.onClick) {
      restProps.onClick(e);
    }
  };

  const displayText = isRevealed ? (revealedText || phone) : unrevealedText;

  if (asLink && isRevealed) {
    return (
      <a
        href={getSecureTelUrl()}
        className={className}
        onClick={handleClick}
        {...restProps}
      >
        {displayText}
      </a>
    );
  }

  return <span className={className}>{displayText}</span>;
};
