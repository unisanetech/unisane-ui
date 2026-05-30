import type { NormalizedEmailBrand } from '../brand/brand-contract';
import { cssFontFamily, escapeAttr, escapeCssUrl, escapeHtml } from '../utils/html';
import { renderButton, renderLinkFallback } from './primitives';

export type EmailLayoutArgs = {
  brand: NormalizedEmailBrand;
  eyebrow?: string | undefined;
  title: string;
  intro?: string | undefined;
  bodyHtml: string;
  align?: 'left' | 'center' | undefined;
  ctaUrl?: string | undefined;
  ctaLabel?: string | undefined;
  footerHtml?: string | undefined;
  outroText?: string | undefined;
  statusLabel?: string | undefined;
};

export function renderEmailLayout(args: EmailLayoutArgs): string {
  const logo = renderBrandLogo(args.brand);
  const align = args.align ?? 'left';
  const eyebrow = args.eyebrow
    ? `<div class="us-email-eyebrow" style="margin:0 0 12px;color:${args.brand.primary};font-size:12px;font-weight:700;letter-spacing:0.08em;text-align:${align};text-transform:uppercase">${escapeHtml(args.eyebrow)}</div>`
    : '';
  const intro = args.intro
    ? `<p class="us-email-intro" style="margin:0 0 16px;color:${args.brand.muted};font-size:15px;line-height:1.7;text-align:${align}">${escapeHtml(args.intro)}</p>`
    : '';
  const status = args.statusLabel
    ? `<div style="margin:0 0 18px;text-align:${align}"><span style="display:inline-block;border-radius:999px;background:${args.brand.successSurface};color:${args.brand.primary};padding:7px 13px;font-size:13px;font-weight:700;line-height:1">${escapeHtml(args.statusLabel)}</span></div>`
    : '';
  const cta =
    args.ctaUrl && args.ctaLabel
      ? `<div style="margin-top:26px">${renderButton(args.ctaUrl, args.ctaLabel, args.brand)}${renderLinkFallback(args.ctaUrl, args.brand)}</div>`
      : '';
  const outro = args.outroText
    ? `<div style="margin-top:20px;font-size:13px;line-height:1.7;color:${args.brand.muted}">${escapeHtml(args.outroText)}</div>`
    : '';
  const wordmark = args.brand.wordmark ?? args.brand.name;
  const wordmarkBaseFont = args.brand.wordmarkFontFamily ?? 'Arial';
  const wordmarkFontFamily = `${cssFontFamily(wordmarkBaseFont)},'Helvetica Neue',Helvetica,Arial,sans-serif`;
  const fontStyle = args.brand.wordmarkFontHref
    ? `<style>@import url('${escapeCssUrl(args.brand.wordmarkFontHref)}');</style>`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${fontStyle}
    <style>
      @media only screen and (max-width: 600px) {
        .us-email-page-cell { padding: 18px 10px !important; }
        .us-email-shell { width: 100% !important; max-width: 100% !important; }
        .us-email-brand-row { padding-bottom: 18px !important; }
        .us-email-card { padding: 0 !important; border-radius: 10px !important; }
        .us-email-card-inner { padding: 28px 20px !important; }
        .us-email-h1 { font-size: 24px !important; line-height: 1.25 !important; }
        .us-email-logo { width: 40px !important; height: 40px !important; }
        .us-email-wordmark { font-size: 26px !important; }
        .us-email-button-link { padding: 14px 14px !important; }
        .us-email-link-fallback { padding: 13px 14px !important; }
        .us-email-details-label, .us-email-details-value { display: block !important; width: auto !important; }
        .us-email-step-index { width: 32px !important; height: 32px !important; line-height: 32px !important; }
        .us-email-otp-digit { font-size: 28px !important; padding: 10px 6px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${args.brand.background};color:${args.brand.text};font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:${args.brand.background}">
      <tr>
        <td class="us-email-page-cell" align="center" style="padding:34px 14px">
          <table class="us-email-shell" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;border-collapse:collapse">
            <tr>
              <td class="us-email-brand-row" align="center" style="padding:0 0 24px">
                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                  <tr>
                    <td style="padding:0 16px 0 0;vertical-align:middle">${logo}</td>
                    <td class="us-email-wordmark" style="font-family:${wordmarkFontFamily};font-size:31px;font-weight:400;letter-spacing:0;line-height:1;color:${args.brand.text};vertical-align:middle;white-space:nowrap">${escapeHtml(wordmark)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="us-email-card" style="background:${args.brand.surface};border:1px solid ${args.brand.border};border-radius:12px;padding:0;box-shadow:0 16px 44px rgba(17,24,39,0.08);overflow:hidden">
                <div style="height:5px;background:${args.brand.primary};line-height:5px;font-size:5px">&nbsp;</div>
                <div class="us-email-card-inner" style="padding:40px 42px">
                  ${eyebrow}
                  ${status}
                  <h1 class="us-email-h1" style="margin:0 0 15px;font-size:30px;line-height:1.18;font-weight:700;color:${args.brand.text};letter-spacing:0;text-align:${align}">${escapeHtml(args.title)}</h1>
                  ${intro}
                  <div style="font-size:15px;line-height:1.72;color:${args.brand.text};text-align:${align}">${args.bodyHtml}</div>
                  ${cta}
                  ${outro}
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:22px 14px 0;font-size:12px;line-height:1.7;color:${args.brand.subtle}">
                ${args.footerHtml ?? ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderBrandLogo(brand: NormalizedEmailBrand): string {
  if (brand.logoUrl) {
    return `<img class="us-email-logo" src="${escapeAttr(brand.logoUrl)}" width="48" height="48" alt="" style="display:block;border:0;outline:none;text-decoration:none" />`;
  }

  return `<div class="us-email-logo" style="width:48px;height:48px;border-radius:0;background:${brand.primary};color:${brand.primaryText};font-weight:700;font-size:22px;line-height:48px;text-align:center">${escapeHtml(brand.name.charAt(0).toUpperCase())}</div>`;
}
