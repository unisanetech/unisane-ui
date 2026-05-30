import type { NormalizedEmailBrand } from '../brand/brand-contract';
import { renderEmailLayout } from '../components/layout';
import type { RenderedEmailTemplate } from '../render/types';
import { escapeHtml } from '../utils/html';
import { readText } from '../utils/props';

export function renderGenericTemplate(args: {
  template: string;
  props: Record<string, unknown>;
  scopeId: string | null;
  brand: NormalizedEmailBrand;
  footerHtml: string;
}): RenderedEmailTemplate {
  const subject =
    readText(args.props.subject) ?? readText(args.props.title) ?? `Notification: ${args.template}`;
  const text =
    readText(args.props.text) ??
    JSON.stringify(
      {
        template: args.template,
        ...(args.scopeId ? { scopeId: args.scopeId } : {}),
        ...args.props,
      },
      null,
      2,
    );
  const html =
    readText(args.props.html) ??
    renderEmailLayout({
      brand: args.brand,
      title: subject,
      bodyHtml: `<pre style="margin:0;white-space:pre-wrap;color:${args.brand.text};font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7">${escapeHtml(text)}</pre>`,
      footerHtml: args.footerHtml,
    });

  return { subject, text, html };
}
