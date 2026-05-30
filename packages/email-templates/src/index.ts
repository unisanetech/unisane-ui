export {
  EMAIL_TEMPLATE_CATALOG,
  type EmailTemplateCatalogItem,
} from './catalog/template-catalog';
export { EMAIL_TEMPLATE_NAMES, type EmailTemplateName } from './catalog/template-names';
export type { EmailTemplateBrand, NormalizedEmailBrand } from './brand/brand-contract';
export { normalizeEmailBrand } from './brand/normalize-brand';
export { DEFAULT_EMAIL_THEME, type EmailTheme } from './themes/email-theme';
export {
  createEmailTemplateRenderer,
  renderEmailTemplate,
} from './render/render-email-template';
export type { RenderEmailTemplateInput, RenderedEmailTemplate } from './render/types';
export { renderEmailLayout, type EmailLayoutArgs } from './components/layout';
export {
  renderBillingDetails,
  renderButton,
  renderDetailsTable,
  renderFooterHtml,
  renderHeroMetric,
  renderLinkFallback,
  renderNote,
  renderStepList,
} from './components/primitives';
