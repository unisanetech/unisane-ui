export const EMAIL_TEMPLATE_NAMES = {
  GENERIC: 'generic',
  WELCOME: 'welcome',
  AUTH_WELCOME: 'auth_welcome',
  AUTH_VERIFY_EMAIL: 'auth_verify_email',
  AUTH_PASSWORD_RESET: 'auth_password_reset',
  AUTH_OTP_CODE: 'auth_otp_code',
  AUTH_MAGIC_LINK: 'auth_magic_link',
  WORKSPACE_INVITE: 'workspace_invite',
  BILLING_PAYMENT_SUCCEEDED: 'billing_payment_succeeded',
  BILLING_SUBSCRIPTION_CREATED: 'billing_subscription_created',
  BILLING_INVOICE_PAID: 'billing_invoice_paid',
} as const;

export type EmailTemplateName =
  (typeof EMAIL_TEMPLATE_NAMES)[keyof typeof EMAIL_TEMPLATE_NAMES] | string;
