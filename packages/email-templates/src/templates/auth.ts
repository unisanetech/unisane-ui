import type { NormalizedEmailBrand } from '../brand/brand-contract';
import { renderEmailLayout } from '../components/layout';
import { renderNote } from '../components/primitives';
import type { RenderedEmailTemplate } from '../render/types';
import { escapeHtml } from '../utils/html';
import { joinText, readText, ttlSentence } from '../utils/props';
import { renderLinkTemplate } from './link-template';

export function renderVerifyEmailTemplate(args: {
  props: Record<string, unknown>;
  brand: NormalizedEmailBrand;
  footerHtml: string;
}): RenderedEmailTemplate {
  return renderLinkTemplate({
    subject: `Verify your ${args.brand.name} email`,
    eyebrow: 'Account security',
    title: 'Confirm your email address',
    intro: `Finish setting up your ${args.brand.name} account by confirming this email address.`,
    url: readText(args.props.url) ?? '',
    ctaLabel: 'Verify email',
    ttlText: ttlSentence(args.props.ttlSec, 'This link expires soon.'),
    outroText: 'If you did not create this account, you can ignore this email.',
    brand: args.brand,
    footerHtml: args.footerHtml,
  });
}

export function renderPasswordResetTemplate(args: {
  props: Record<string, unknown>;
  brand: NormalizedEmailBrand;
  footerHtml: string;
}): RenderedEmailTemplate {
  return renderLinkTemplate({
    subject: `Reset your ${args.brand.name} password`,
    eyebrow: 'Account security',
    title: 'Reset your password',
    intro: `Use this secure link to choose a new password for your ${args.brand.name} account.`,
    url: readText(args.props.url) ?? '',
    ctaLabel: 'Reset password',
    ttlText: ttlSentence(args.props.ttlSec, 'This link expires soon.'),
    outroText: 'If you did not request a password reset, you can ignore this email.',
    brand: args.brand,
    footerHtml: args.footerHtml,
  });
}

export function renderMagicLinkTemplate(args: {
  props: Record<string, unknown>;
  brand: NormalizedEmailBrand;
  footerHtml: string;
}): RenderedEmailTemplate {
  return renderLinkTemplate({
    subject: `Your ${args.brand.name} sign-in link`,
    eyebrow: 'Secure sign-in',
    title: 'Sign in to your account',
    intro: `Use this one-time link to sign in to ${args.brand.name}.`,
    url: readText(args.props.url) ?? '',
    ctaLabel: readText(args.props.ctaLabel) ?? 'Sign in securely',
    ttlText: ttlSentence(args.props.ttlSec, 'This link expires soon.'),
    outroText: 'If you did not request this link, you can ignore this email.',
    brand: args.brand,
    footerHtml: args.footerHtml,
  });
}

export function renderOtpTemplate(args: {
  props: Record<string, unknown>;
  brand: NormalizedEmailBrand;
  footerHtml: string;
}): RenderedEmailTemplate {
  const code = readText(args.props.code) ?? '';
  const normalizedCode = normalizeOtpCode(code);
  const ttlText = ttlSentence(args.props.ttlSec, 'This code expires soon.');
  const subject = `Your ${args.brand.name} verification code`;
  const bodyHtml = `<p style="margin:0 auto 18px;max-width:430px;color:${args.brand.muted};font-size:16px;line-height:1.7">Enter the verification code below to continue.</p>
    ${renderOtpCode(normalizedCode, args.brand)}
    ${renderNote(ttlText, args.brand)}
    <div style="margin-top:18px;border:1px solid ${args.brand.border};border-radius:8px;background:${args.brand.softSurface};padding:14px 16px;color:${args.brand.text};font-size:14px;line-height:1.6;font-weight:700;text-align:center">Do not share this code.</div>`;

  return {
    subject,
    text: joinText(`Your ${args.brand.name} verification code is ${normalizedCode}.`, ttlText, 'Do not share this code.'),
    html: renderEmailLayout({
      brand: args.brand,
      eyebrow: 'Verification code',
      title: 'Your verification code',
      align: 'center',
      bodyHtml,
      outroText: 'If you did not request this code, you can ignore this email.',
      footerHtml: args.footerHtml,
    }),
  };
}

function normalizeOtpCode(code: string): string {
  return code.replace(/\s+/g, '').trim();
}

function renderOtpCode(normalizedCode: string, brand: NormalizedEmailBrand): string {
  if (!normalizedCode.length) {
    return `<div style="margin:0 0 16px;border:1px solid ${brand.border};border-radius:8px;background:${brand.softSurface};padding:18px 12px;text-align:center;color:${brand.subtle};font-size:14px">Verification code unavailable</div>`;
  }

  return `<div style="margin:0 auto 16px;border:1px solid ${brand.border};border-radius:8px;background:${brand.surface};padding:18px 16px;text-align:center;color:${brand.text};font-size:32px;font-weight:700;line-height:1.2;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace">${escapeHtml(normalizedCode)}</div>`;
}
