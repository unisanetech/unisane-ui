import type { EmailTheme } from '../themes/email-theme';

export type EmailTemplateBrand = Partial<EmailTheme> & {
  name: string;
  wordmark?: string | undefined;
  wordmarkFontFamily?: string | undefined;
  wordmarkFontHref?: string | undefined;
  logoUrl?: string | undefined;
  supportEmail?: string | undefined;
  productUrl?: string | undefined;
  footerLine?: string | undefined;
};

export type NormalizedEmailBrand = Required<
  Pick<
    EmailTemplateBrand,
    | 'name'
    | 'wordmark'
    | 'wordmarkFontFamily'
    | 'primary'
    | 'primaryText'
    | 'text'
    | 'muted'
    | 'subtle'
    | 'background'
    | 'surface'
    | 'border'
    | 'softSurface'
    | 'successSurface'
  >
> &
  Pick<
    EmailTemplateBrand,
    'wordmarkFontHref' | 'logoUrl' | 'supportEmail' | 'productUrl' | 'footerLine'
  >;
