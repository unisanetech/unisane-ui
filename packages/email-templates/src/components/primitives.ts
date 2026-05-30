import type { NormalizedEmailBrand } from '../brand/brand-contract';
import { escapeAttr, escapeHtml } from '../utils/html';
import { readText } from '../utils/props';

export function renderButton(url: string, label: string, brand: NormalizedEmailBrand): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
    <tr>
      <td align="center" bgcolor="${brand.primary}" style="background:${brand.primary};border-radius:8px;box-shadow:0 8px 18px rgba(15,81,50,0.20)">
        <a class="us-email-button-link" href="${escapeAttr(url)}" target="_blank" rel="noopener" style="display:block;color:${brand.primaryText};font-size:15px;font-weight:700;text-decoration:none;padding:15px 18px;border-radius:8px">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;
}

export function renderLinkFallback(url: string, brand: NormalizedEmailBrand): string {
  return `<div class="us-email-link-fallback" style="margin-top:16px;border:1px solid ${brand.border};border-radius:8px;background:${brand.softSurface};padding:14px 16px;font-size:13px;line-height:1.6;color:${brand.muted}">
    <div style="margin:0 0 5px;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${brand.subtle}">Or use this link</div>
    <a href="${escapeAttr(url)}" target="_blank" rel="noopener" style="color:${brand.primary};text-decoration:underline;word-break:break-all">${escapeHtml(url)}</a>
  </div>`;
}

export function renderNote(message: string, brand: NormalizedEmailBrand): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin-top:16px;text-align:left">
    <tr>
      <td width="24" style="width:24px;vertical-align:top;padding:1px 8px 0 0">
        <div style="width:18px;height:18px;border-radius:999px;background:${brand.successSurface};color:${brand.primary};font-size:12px;font-weight:700;line-height:18px;text-align:center">i</div>
      </td>
      <td style="vertical-align:top;color:${brand.muted};font-size:13px;line-height:1.6">${escapeHtml(message)}</td>
    </tr>
  </table>`;
}

export function renderStepList(items: string[], brand: NormalizedEmailBrand): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:0;margin-top:18px;border:1px solid ${brand.border};border-radius:10px;overflow:hidden;background:${brand.surface};text-align:left">
    ${items
      .map((item, index) => {
        const border = index === items.length - 1 ? '0' : `1px solid ${brand.border}`;
        return `<tr>
          <td width="56" style="width:56px;padding:14px 0 14px 16px;vertical-align:top;border-bottom:${border}">
            <div class="us-email-step-index" style="width:36px;height:36px;border-radius:10px;background:${brand.successSurface};color:${brand.primary};font-size:14px;font-weight:700;line-height:36px;text-align:center">${index + 1}</div>
          </td>
          <td style="padding:14px 16px 14px 0;vertical-align:top;border-bottom:${border}">
            <div style="font-size:15px;font-weight:700;color:${brand.text};line-height:1.35">${escapeHtml(item)}</div>
          </td>
        </tr>`;
      })
      .join('')}
  </table>`;
}

export function renderHeroMetric(value: string, brand: NormalizedEmailBrand): string {
  return `<div style="margin:18px 0 22px;border:1px solid ${brand.border};border-radius:10px;background:${brand.softSurface};padding:18px 16px;text-align:center">
    <div style="font-size:13px;line-height:1.4;font-weight:700;color:${brand.muted};text-transform:uppercase;letter-spacing:0.08em">Amount</div>
    <div style="margin-top:4px;font-size:34px;line-height:1.18;font-weight:700;color:${brand.primary}">${escapeHtml(value)}</div>
  </div>`;
}

export function renderDetailsTable(
  rows: readonly [string, string][],
  brand: NormalizedEmailBrand,
): string {
  if (!rows.length) return '';

  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:0;margin-top:18px;border:1px solid ${brand.border};border-radius:10px;overflow:hidden;background:${brand.surface};text-align:left">
    ${rows
      .map(([label, value], index) => {
        const border = index === rows.length - 1 ? '0' : `1px solid ${brand.border}`;
        const background = index % 2 === 0 ? brand.surface : brand.softSurface;
        return `<tr>
          <td class="us-email-details-label" style="padding:13px 14px;border-bottom:${border};font-size:13px;font-weight:700;color:${brand.text};width:42%;background:${background}">${escapeHtml(label)}</td>
          <td class="us-email-details-value" style="padding:13px 14px;border-bottom:${border};font-size:13px;color:${brand.text};background:${background}">${escapeHtml(value)}</td>
        </tr>`;
      })
      .join('')}
  </table>`;
}

export function renderBillingDetails(
  props: Record<string, unknown>,
  brand: NormalizedEmailBrand,
): string {
  const rows = [
    ['Plan', readText(props.plan) ?? readText(props.planId)],
    ['Invoice number', readText(props.invoiceNumber)],
    ['Billing period', readText(props.billingPeriod)],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  return renderDetailsTable(rows, brand);
}

export function renderFooterHtml(args: {
  brand: NormalizedEmailBrand;
  isMarketing: boolean;
  unsubscribeUrl: string | undefined;
  preferencesUrl: string | undefined;
}): string {
  const base =
    args.brand.footerLine ??
    (args.isMarketing
      ? `You are receiving this email because you opted in to updates from ${args.brand.name}.`
      : `Sent by ${args.brand.name} for account or workspace activity.`);
  const links: string[] = [];
  if (args.isMarketing && args.unsubscribeUrl) {
    links.push(
      `<a href="${escapeAttr(args.unsubscribeUrl)}" style="color:${args.brand.primary};text-decoration:none">Unsubscribe</a>`,
    );
  }
  if (args.preferencesUrl) {
    links.push(
      `<a href="${escapeAttr(args.preferencesUrl)}" style="color:${args.brand.primary};text-decoration:none">Manage preferences</a>`,
    );
  }
  if (args.brand.supportEmail) {
    links.push(
      `<a href="mailto:${escapeAttr(args.brand.supportEmail)}" style="color:${args.brand.primary};text-decoration:none">Contact support</a>`,
    );
  }
  if (!links.length) return escapeHtml(base);
  return `${escapeHtml(base)}<br />${links.join(' &middot; ')}`;
}
