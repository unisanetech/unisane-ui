import { EMAIL_TEMPLATE_NAMES } from './template-names';

export type EmailTemplateCatalogItem = {
  name: (typeof EMAIL_TEMPLATE_NAMES)[keyof typeof EMAIL_TEMPLATE_NAMES];
  label: string;
  category: 'auth' | 'workspace' | 'billing' | 'marketing' | 'system';
  audience: 'user' | 'workspace_member' | 'billing_contact' | 'subscriber';
  description: string;
  previewProps: Record<string, unknown>;
};

export const EMAIL_TEMPLATE_CATALOG = [
  {
    name: EMAIL_TEMPLATE_NAMES.AUTH_MAGIC_LINK,
    label: 'Magic sign-in link',
    category: 'auth',
    audience: 'user',
    description: 'One-time sign-in link for passwordless account access.',
    previewProps: {
      url: '/sign-in/preview-token',
      ttlSec: 900,
      ctaLabel: 'Sign in securely',
    },
  },
  {
    name: EMAIL_TEMPLATE_NAMES.AUTH_OTP_CODE,
    label: 'Verification code',
    category: 'auth',
    audience: 'user',
    description: 'Six-digit code for sign-in, verification, or sensitive account actions.',
    previewProps: {
      code: '739216',
      ttlSec: 600,
    },
  },
  {
    name: EMAIL_TEMPLATE_NAMES.AUTH_VERIFY_EMAIL,
    label: 'Verify email',
    category: 'auth',
    audience: 'user',
    description: 'Email ownership confirmation during account setup.',
    previewProps: {
      url: '/verify-email/preview-token',
      ttlSec: 3600,
    },
  },
  {
    name: EMAIL_TEMPLATE_NAMES.AUTH_PASSWORD_RESET,
    label: 'Password reset',
    category: 'auth',
    audience: 'user',
    description: 'Secure password reset link for account recovery.',
    previewProps: {
      url: '/reset-password/preview-token',
      ttlSec: 1800,
    },
  },
  {
    name: EMAIL_TEMPLATE_NAMES.AUTH_WELCOME,
    label: 'Welcome',
    category: 'workspace',
    audience: 'user',
    description: 'First-run onboarding email after account or workspace activation.',
    previewProps: {
      name: 'Aarav',
      title: 'Welcome to True Resume',
      summary: 'Create polished resumes, tune your content, and export when ready.',
      steps: ['Create your first resume', 'Choose a job-ready template', 'Review and export'],
      ctaUrl: '/app/resumes',
      ctaLabel: 'Open workspace',
    },
  },
  {
    name: EMAIL_TEMPLATE_NAMES.WORKSPACE_INVITE,
    label: 'Workspace invite',
    category: 'workspace',
    audience: 'workspace_member',
    description: 'Invitation for a teammate to join a workspace.',
    previewProps: {
      workspaceName: 'Acme Careers',
      inviterName: 'Maya Rao',
      roleLabel: 'editor',
      ctaUrl: '/invite/preview-token',
      ctaLabel: 'Accept invite',
      expiresAt: '2026-06-04T09:30:00.000Z',
    },
  },
  {
    name: EMAIL_TEMPLATE_NAMES.BILLING_PAYMENT_SUCCEEDED,
    label: 'Payment received',
    category: 'billing',
    audience: 'billing_contact',
    description: 'Receipt-style confirmation after a successful payment.',
    previewProps: {
      amount: 2400,
      currency: 'USD',
      plan: 'Professional Annual',
      invoiceNumber: 'INV-2026-0487',
      billingPeriod: 'May 2026 - May 2027',
      ctaUrl: '/app/billing/invoices/INV-2026-0487',
      ctaLabel: 'Download invoice',
    },
  },
  {
    name: EMAIL_TEMPLATE_NAMES.BILLING_SUBSCRIPTION_CREATED,
    label: 'Subscription activated',
    category: 'billing',
    audience: 'billing_contact',
    description: 'Plan activation confirmation after subscription creation.',
    previewProps: {
      plan: 'Professional Annual',
      ctaUrl: '/app/billing',
      ctaLabel: 'Manage subscription',
    },
  },
  {
    name: EMAIL_TEMPLATE_NAMES.BILLING_INVOICE_PAID,
    label: 'Invoice paid',
    category: 'billing',
    audience: 'billing_contact',
    description: 'Invoice paid notification with billing metadata.',
    previewProps: {
      amount: 2400,
      currency: 'USD',
      plan: 'Professional Annual',
      invoiceNumber: 'INV-2026-0487',
      billingPeriod: 'May 2026 - May 2027',
      ctaUrl: '/app/billing/invoices/INV-2026-0487',
      ctaLabel: 'View invoice',
    },
  },
  {
    name: EMAIL_TEMPLATE_NAMES.GENERIC,
    label: 'Generic notification',
    category: 'system',
    audience: 'user',
    description: 'Fallback structured notification template for platform messages.',
    previewProps: {
      subject: 'Your resume export is ready',
      text: 'Your PDF export finished successfully and is ready to download.',
    },
  },
] as const satisfies readonly EmailTemplateCatalogItem[];
