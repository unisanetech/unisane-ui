import { normalizeEmailBrand } from '../brand/normalize-brand';
import { EMAIL_TEMPLATE_NAMES } from '../catalog/template-names';
import { renderFooterHtml } from '../components/primitives';
import {
  renderMagicLinkTemplate,
  renderOtpTemplate,
  renderPasswordResetTemplate,
  renderVerifyEmailTemplate,
} from '../templates/auth';
import {
  renderBillingInvoicePaidTemplate,
  renderBillingPaymentSucceededTemplate,
  renderBillingSubscriptionCreatedTemplate,
} from '../templates/billing';
import { renderGenericTemplate } from '../templates/generic';
import { renderWelcomeTemplate, renderWorkspaceInviteTemplate } from '../templates/workspace';
import { isMarketingCategory, readText } from '../utils/props';
import type { RenderEmailTemplateInput, RenderedEmailTemplate } from './types';

export function renderEmailTemplate(input: RenderEmailTemplateInput): RenderedEmailTemplate {
  const brand = normalizeEmailBrand(input.brand);
  const props = input.props ?? {};
  const category = readText(props.category);
  const footerHtml = renderFooterHtml({
    brand,
    isMarketing: isMarketingCategory(category),
    unsubscribeUrl: readText(props.unsubscribeUrl),
    preferencesUrl: readText(props.preferencesUrl),
  });

  if (input.template === EMAIL_TEMPLATE_NAMES.AUTH_VERIFY_EMAIL) {
    return renderVerifyEmailTemplate({ props, brand, footerHtml });
  }

  if (input.template === EMAIL_TEMPLATE_NAMES.AUTH_PASSWORD_RESET) {
    return renderPasswordResetTemplate({ props, brand, footerHtml });
  }

  if (input.template === EMAIL_TEMPLATE_NAMES.AUTH_MAGIC_LINK) {
    return renderMagicLinkTemplate({ props, brand, footerHtml });
  }

  if (input.template === EMAIL_TEMPLATE_NAMES.AUTH_OTP_CODE) {
    return renderOtpTemplate({ props, brand, footerHtml });
  }

  if (
    input.template === EMAIL_TEMPLATE_NAMES.AUTH_WELCOME ||
    input.template === EMAIL_TEMPLATE_NAMES.WELCOME
  ) {
    return renderWelcomeTemplate({ props, brand, footerHtml });
  }

  if (input.template === EMAIL_TEMPLATE_NAMES.WORKSPACE_INVITE) {
    return renderWorkspaceInviteTemplate({ props, brand, footerHtml });
  }

  if (input.template === EMAIL_TEMPLATE_NAMES.BILLING_PAYMENT_SUCCEEDED) {
    return renderBillingPaymentSucceededTemplate({ props, brand, footerHtml });
  }

  if (input.template === EMAIL_TEMPLATE_NAMES.BILLING_SUBSCRIPTION_CREATED) {
    return renderBillingSubscriptionCreatedTemplate({ props, brand, footerHtml });
  }

  if (input.template === EMAIL_TEMPLATE_NAMES.BILLING_INVOICE_PAID) {
    return renderBillingInvoicePaidTemplate({ props, brand, footerHtml });
  }

  return renderGenericTemplate({
    template: input.template,
    props,
    scopeId: input.scopeId ?? null,
    brand,
    footerHtml,
  });
}

export function createEmailTemplateRenderer(args: {
  brand: RenderEmailTemplateInput['brand'];
}) {
  return (input: Omit<RenderEmailTemplateInput, 'brand'>): RenderedEmailTemplate =>
    renderEmailTemplate({ ...input, brand: args.brand });
}
