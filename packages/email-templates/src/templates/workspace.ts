import type { NormalizedEmailBrand } from '../brand/brand-contract';
import { renderEmailLayout } from '../components/layout';
import { renderNote, renderStepList } from '../components/primitives';
import type { RenderedEmailTemplate } from '../render/types';
import { escapeHtml } from '../utils/html';
import {
  formatDateTime,
  joinText,
  readStringList,
  readText,
  readUserName,
} from '../utils/props';

export function renderWelcomeTemplate(args: {
  props: Record<string, unknown>;
  brand: NormalizedEmailBrand;
  footerHtml: string;
}): RenderedEmailTemplate {
  const name = readText(args.props.name) ?? readUserName(args.props.user);
  const ctaUrl = readText(args.props.ctaUrl);
  const ctaLabel = readText(args.props.ctaLabel) ?? 'Open workspace';
  const summary = readText(args.props.summary) ?? 'Get started with your workspace.';
  const steps = readStringList(args.props.steps);
  const defaultSteps = ['Explore your workspace', 'Invite your team', 'Complete your profile'];
  const items = steps.length ? steps : defaultSteps;
  const subject = `Welcome to ${args.brand.name}`;
  const title = readText(args.props.title) ?? `Welcome to ${args.brand.name}`;
  const intro = name
    ? `Welcome, ${name}. Your account is ready.`
    : `Welcome to ${args.brand.name}. Your account is ready.`;
  const bodyHtml = `<p style="margin:0 auto 8px;max-width:460px;color:${args.brand.text};font-size:16px;line-height:1.7">${escapeHtml(intro)}</p>
    <p style="margin:0 auto 18px;max-width:460px;color:${args.brand.muted};font-size:15px;line-height:1.7">${escapeHtml(summary)}</p>
    <div style="margin:22px 0 0;color:${args.brand.primary};font-size:15px;font-weight:700;text-align:center">Get started in ${items.length} simple steps</div>
    ${renderStepList(items, args.brand)}`;

  return {
    subject,
    text: joinText(
      intro,
      summary,
      ...items.map((item, index) => `${index + 1}. ${item}`),
      ctaUrl ? `${ctaLabel}: ${ctaUrl}` : undefined,
    ),
    html: renderEmailLayout({
      brand: args.brand,
      eyebrow: 'Welcome',
      title,
      align: 'center',
      bodyHtml,
      ...(ctaUrl ? { ctaUrl, ctaLabel } : {}),
      footerHtml: args.footerHtml,
    }),
  };
}

export function renderWorkspaceInviteTemplate(args: {
  props: Record<string, unknown>;
  brand: NormalizedEmailBrand;
  footerHtml: string;
}): RenderedEmailTemplate {
  const workspaceName = readText(args.props.workspaceName) ?? 'Workspace';
  const inviterName = readText(args.props.inviterName) ?? 'A workspace admin';
  const roleLabel = readText(args.props.roleLabel) ?? 'member';
  const ctaUrl = readText(args.props.ctaUrl);
  const ctaLabel = readText(args.props.ctaLabel) ?? 'Accept invite';
  const expiresLabel = formatDateTime(args.props.expiresAt) ?? readText(args.props.expiresAt);
  const subject = `Invitation to join ${workspaceName}`;
  const intro = `${inviterName} invited you to join ${workspaceName} as ${roleLabel}.`;

  return {
    subject,
    text: joinText(
      intro,
      expiresLabel ? `This invitation expires on ${expiresLabel}.` : undefined,
      ctaUrl ? `${ctaLabel}: ${ctaUrl}` : undefined,
    ),
    html: renderEmailLayout({
      brand: args.brand,
      eyebrow: 'Workspace invite',
      title: `Join ${workspaceName}`,
      bodyHtml: `<p style="margin:0">${escapeHtml(inviterName)} invited you to join <strong>${escapeHtml(workspaceName)}</strong> as <strong>${escapeHtml(roleLabel)}</strong>.</p>${
        expiresLabel ? renderNote(`This invitation expires on ${expiresLabel}.`, args.brand) : ''
      }`,
      ...(ctaUrl ? { ctaUrl, ctaLabel } : {}),
      footerHtml: args.footerHtml,
    }),
  };
}
