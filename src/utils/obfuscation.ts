/**
 * Obfuscation utility for sensitive contact information (Email, Phone, Zalo)
 * Pure functions callable from both Server Components (RSC) and Client Components.
 * Protects against automated web crawlers, regex scanners, and scraping bots.
 */

// Chunked obfuscated tokens to prevent static regex scanning in bundle files
export const OBFUSCATED_EMAIL_CHUNKS = ['dGFu', 'aHV5', 'bmgy', 'NjMx', 'QGdt', 'YWls', 'LmNv', 'bQ=='];
export const OBFUSCATED_PHONE_CHUNKS = ['Kzg0', 'LTk2', 'MzY4', 'NDUy', 'MA=='];
export const OBFUSCATED_ZALO_CHUNKS = ['aHR0cHM6', 'Ly96YWxv', 'Lm1lLzA5', 'NjM2ODQ1', 'MjA='];

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
