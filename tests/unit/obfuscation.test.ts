import { describe, it, expect } from 'vitest';
import {
  decodeBase64Safe,
  getSecureEmail,
  getSecureMailtoUrl,
  getSecurePhone,
  getSecureZaloUrl,
  getSecureTelUrl,
} from '../../src/utils/obfuscation';

describe('TS-11: Contact Anti-Scraping Obfuscation Unit Tests', () => {
  it('should correctly decode base64 strings safely in all environments', () => {
    const original = 'Hello World';
    const encoded = btoa(original);
    expect(decodeBase64Safe(encoded)).toBe(original);
    expect(decodeBase64Safe('')).toBe('');
  });

  it('should securely reconstruct the email from chunked tokens without exposing raw email in source code', () => {
    const email = getSecureEmail();
    expect(email).toBe('tanhuynh2631@gmail.com');
    expect(email).toContain('@');
    expect(email).toContain('.com');
  });

  it('should generate valid mailto URL with dynamic optional subject', () => {
    const basicMailto = getSecureMailtoUrl();
    expect(basicMailto).toBe('mailto:tanhuynh2631@gmail.com');

    const customMailto = getSecureMailtoUrl('Inquiry regarding Senior Role');
    expect(customMailto).toBe('mailto:tanhuynh2631@gmail.com?subject=Inquiry%20regarding%20Senior%20Role');
  });

  it('should securely reconstruct the phone number from chunked tokens', () => {
    const phone = getSecurePhone();
    expect(phone).toBe('+84-963684520');
  });

  it('should generate a sanitized tel: URL suitable for mobile click-to-call dialer', () => {
    const telUrl = getSecureTelUrl();
    expect(telUrl).toBe('tel:+84963684520');
    expect(telUrl).not.toContain('-');
  });

  it('should generate a valid secure Zalo direct contact link', () => {
    const zaloUrl = getSecureZaloUrl();
    expect(zaloUrl).toBe('https://zalo.me/0963684520');
  });
});
