import type { EmailTemplateBrand, NormalizedEmailBrand } from './brand-contract';
import { DEFAULT_EMAIL_THEME } from '../themes/email-theme';

export function normalizeEmailBrand(brand: EmailTemplateBrand): NormalizedEmailBrand {
  return {
    name: brand.name,
    wordmark: brand.wordmark ?? brand.name,
    wordmarkFontFamily: brand.wordmarkFontFamily ?? 'Arial',
    primary: brand.primary ?? DEFAULT_EMAIL_THEME.primary,
    primaryText: brand.primaryText ?? DEFAULT_EMAIL_THEME.primaryText,
    text: brand.text ?? DEFAULT_EMAIL_THEME.text,
    muted: brand.muted ?? DEFAULT_EMAIL_THEME.muted,
    subtle: brand.subtle ?? DEFAULT_EMAIL_THEME.subtle,
    background: brand.background ?? DEFAULT_EMAIL_THEME.background,
    surface: brand.surface ?? DEFAULT_EMAIL_THEME.surface,
    border: brand.border ?? DEFAULT_EMAIL_THEME.border,
    softSurface: brand.softSurface ?? DEFAULT_EMAIL_THEME.softSurface,
    successSurface: brand.successSurface ?? DEFAULT_EMAIL_THEME.successSurface,
    ...(brand.logoUrl ? { logoUrl: brand.logoUrl } : {}),
    ...(brand.wordmarkFontHref ? { wordmarkFontHref: brand.wordmarkFontHref } : {}),
    ...(brand.supportEmail ? { supportEmail: brand.supportEmail } : {}),
    ...(brand.productUrl ? { productUrl: brand.productUrl } : {}),
    ...(brand.footerLine ? { footerLine: brand.footerLine } : {}),
  };
}
