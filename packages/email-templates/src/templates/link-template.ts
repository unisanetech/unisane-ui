import type { NormalizedEmailBrand } from '../brand/brand-contract';
import { renderEmailLayout } from '../components/layout';
import { renderNote } from '../components/primitives';
import type { RenderedEmailTemplate } from '../render/types';
import { escapeHtml } from '../utils/html';
import { joinText } from '../utils/props';

export type LinkTemplateArgs = {
  subject: string;
  eyebrow: string;
  title: string;
  intro: string;
  url: string;
  ctaLabel: string;
  ttlText?: string | undefined;
  outroText: string;
  brand: NormalizedEmailBrand;
  footerHtml: string;
};

export function renderLinkTemplate(args: LinkTemplateArgs): RenderedEmailTemplate {
  const bodyParts = [
    `<p style="margin:0 auto;max-width:460px;color:${args.brand.muted};font-size:16px;line-height:1.7">${escapeHtml(args.intro)}</p>`,
    args.ttlText ? renderNote(args.ttlText, args.brand) : '',
  ];
  const text = joinText(
    args.url ? `${args.subject}: ${args.url}` : args.subject,
    args.ttlText,
    args.outroText,
  );

  return {
    subject: args.subject,
    text,
    html: renderEmailLayout({
      brand: args.brand,
      eyebrow: args.eyebrow,
      title: args.title,
      align: 'center',
      bodyHtml: bodyParts.join(''),
      ...(args.url ? { ctaUrl: args.url, ctaLabel: args.ctaLabel } : {}),
      outroText: args.outroText,
      footerHtml: args.footerHtml,
    }),
  };
}
