import type { NormalizedEmailBrand } from '../brand/brand-contract';
import { renderEmailLayout } from '../components/layout';
import { renderBillingDetails, renderHeroMetric } from '../components/primitives';
import type { RenderedEmailTemplate } from '../render/types';
import { escapeHtml } from '../utils/html';
import { formatAmount, joinText, readText } from '../utils/props';

export function renderBillingPaymentSucceededTemplate(args: {
  props: Record<string, unknown>;
  brand: NormalizedEmailBrand;
  footerHtml: string;
}): RenderedEmailTemplate {
  const amount = formatAmount(args.props.amount, args.props.currency);
  const ctaUrl = readText(args.props.ctaUrl);
  const ctaLabel = readText(args.props.ctaLabel) ?? 'Manage billing';
  const subject = 'Payment received';

  return {
    subject,
    text: joinText(
      amount ? `We received your payment of ${amount}.` : 'We received your payment.',
      ctaUrl ? `${ctaLabel}: ${ctaUrl}` : undefined,
    ),
    html: renderEmailLayout({
      brand: args.brand,
      eyebrow: 'Billing',
      statusLabel: 'Success',
      title: subject,
      align: 'center',
      bodyHtml: `<p style="margin:0 auto 18px;max-width:430px;color:${args.brand.muted};font-size:16px;line-height:1.7">Your payment has been received successfully.</p>${amount ? renderHeroMetric(amount, args.brand) : ''}${renderBillingDetails(args.props, args.brand)}`,
      ...(ctaUrl ? { ctaUrl, ctaLabel } : {}),
      footerHtml: args.footerHtml,
    }),
  };
}

export function renderBillingSubscriptionCreatedTemplate(args: {
  props: Record<string, unknown>;
  brand: NormalizedEmailBrand;
  footerHtml: string;
}): RenderedEmailTemplate {
  const planId = readText(args.props.planId) ?? readText(args.props.plan);
  const ctaUrl = readText(args.props.ctaUrl);
  const ctaLabel = readText(args.props.ctaLabel) ?? 'Manage subscription';
  const subject = 'Subscription activated';

  return {
    subject,
    text: joinText(
      planId ? `Your subscription is active for ${planId}.` : 'Your subscription is active.',
      ctaUrl ? `${ctaLabel}: ${ctaUrl}` : undefined,
    ),
    html: renderEmailLayout({
      brand: args.brand,
      eyebrow: 'Billing',
      statusLabel: 'Active',
      title: subject,
      align: 'center',
      bodyHtml: `<p style="margin:0">${planId ? `Your subscription is now active for <strong>${escapeHtml(planId)}</strong>.` : 'Your subscription is now active.'}</p>`,
      ...(ctaUrl ? { ctaUrl, ctaLabel } : {}),
      footerHtml: args.footerHtml,
    }),
  };
}

export function renderBillingInvoicePaidTemplate(args: {
  props: Record<string, unknown>;
  brand: NormalizedEmailBrand;
  footerHtml: string;
}): RenderedEmailTemplate {
  const amount = formatAmount(args.props.amount, args.props.currency);
  const ctaUrl = readText(args.props.ctaUrl);
  const ctaLabel = readText(args.props.ctaLabel) ?? 'View invoice';
  const subject = 'Invoice paid';

  return {
    subject,
    text: joinText(
      amount ? `Your invoice for ${amount} has been paid.` : 'Your invoice has been paid.',
      ctaUrl ? `${ctaLabel}: ${ctaUrl}` : undefined,
    ),
    html: renderEmailLayout({
      brand: args.brand,
      eyebrow: 'Billing',
      statusLabel: 'Paid',
      title: subject,
      align: 'center',
      bodyHtml: `<p style="margin:0">${amount ? `Your invoice for <strong>${escapeHtml(amount)}</strong> has been paid.` : 'Your invoice has been paid.'}</p>${renderBillingDetails(args.props, args.brand)}`,
      ...(ctaUrl ? { ctaUrl, ctaLabel } : {}),
      footerHtml: args.footerHtml,
    }),
  };
}
