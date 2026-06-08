import { describe, expect, it } from 'vitest';
import { EMAIL_TEMPLATE_CATALOG, EMAIL_TEMPLATE_NAMES, renderEmailTemplate } from './index';

const brand = {
  name: 'Unisane',
  logoUrl: 'https://assets.unisane.test/logo.svg',
  primary: '#0f5132',
};

describe('renderEmailTemplate', () => {
  it('renders responsive auth link HTML and text fallback', () => {
    const rendered = renderEmailTemplate({
      template: EMAIL_TEMPLATE_NAMES.AUTH_MAGIC_LINK,
      brand,
      props: {
        url: 'https://unisane.test/sign-in/token',
        ttlSec: 900,
      },
    });

    expect(rendered.subject).toBe('Your Unisane sign-in link');
    expect(rendered.text).toContain('https://unisane.test/sign-in/token');
    expect(rendered.text).toContain('15 minutes');
    expect(rendered.html).toContain('<!doctype html>');
    expect(rendered.html).toContain('Sign in securely');
    expect(rendered.html).toContain('max-width:640px');
    expect(rendered.html).toContain('@media only screen and (max-width: 600px)');
    expect(rendered.html).toContain('us-email-card');
    expect(rendered.html).toContain('https://assets.unisane.test/logo.svg');
  });

  it('renders OTP codes as contiguous copyable text without leaking raw HTML', () => {
    const rendered = renderEmailTemplate({
      template: EMAIL_TEMPLATE_NAMES.AUTH_OTP_CODE,
      brand,
      props: {
        code: '<7 3 9 2 1 6>',
        ttlSec: 600,
      },
    });

    expect(rendered.subject).toBe('Your Unisane verification code');
    expect(rendered.html).not.toContain('us-email-otp-digit');
    expect(rendered.html).toContain('&lt;739216&gt;');
    expect(rendered.html).not.toContain('&lt;7 3 9 2 1 6&gt;');
    expect(rendered.html).not.toContain('<7 3 9 2 1 6>');
    expect(rendered.text).toContain('verification code is <739216>.');
    expect(rendered.text).not.toContain('<7 3 9 2 1 6>');
    expect(rendered.text).toContain('10 minutes');
  });

  it('renders billing payment details with a metric and details table', () => {
    const rendered = renderEmailTemplate({
      template: EMAIL_TEMPLATE_NAMES.BILLING_PAYMENT_SUCCEEDED,
      brand,
      props: {
        amount: 2400,
        currency: 'usd',
        plan: 'Professional Annual',
        invoiceNumber: 'INV-2026-0001',
        billingPeriod: 'May 2026 - May 2027',
      },
    });

    expect(rendered.subject).toBe('Payment received');
    expect(rendered.html).toContain('2400 USD');
    expect(rendered.html).toContain('Professional Annual');
    expect(rendered.html).toContain('INV-2026-0001');
  });

  it('keeps catalog preview props renderable', () => {
    const names = new Set(EMAIL_TEMPLATE_CATALOG.map((template) => template.name));

    expect(names.has(EMAIL_TEMPLATE_NAMES.AUTH_MAGIC_LINK)).toBe(true);
    expect(names.has(EMAIL_TEMPLATE_NAMES.AUTH_OTP_CODE)).toBe(true);
    expect(names.has(EMAIL_TEMPLATE_NAMES.BILLING_PAYMENT_SUCCEEDED)).toBe(true);

    for (const template of EMAIL_TEMPLATE_CATALOG) {
      const rendered = renderEmailTemplate({
        template: template.name,
        brand,
        props: template.previewProps,
      });

      expect(rendered.subject.length).toBeGreaterThan(0);
      expect(rendered.html).toContain('<!doctype html>');
      expect(rendered.text.length).toBeGreaterThan(0);
    }
  });
});
