import type { EmailTemplateBrand } from '../brand/brand-contract';
import type { EmailTemplateName } from '../catalog/template-names';

export type RenderEmailTemplateInput = {
  template: EmailTemplateName;
  props?: Record<string, unknown> | undefined;
  scopeId?: string | null | undefined;
  locale?: string | undefined;
  brand: EmailTemplateBrand;
};

export type RenderedEmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

export type EmailTemplateRenderContext = {
  props: Record<string, unknown>;
  scopeId: string | null;
  footerHtml: string;
};
