import type { DocsBlockCategory, DocsBlockSegment } from './types';

export const BLOCK_SEGMENT_ORDER: DocsBlockSegment[] = [
  'marketing',
  'commerce',
  'application',
];

export const BLOCK_SEGMENT_META: Record<
  DocsBlockSegment,
  {
    id: DocsBlockSegment;
    label: string;
    description: string;
  }
> = {
  marketing: {
    id: 'marketing',
    label: 'Marketing',
    description: 'Hero, header, footer, pricing, CTA, grid, and social-proof blocks for marketing surfaces.',
  },
  commerce: {
    id: 'commerce',
    label: 'Commerce',
    description: 'Product, catalog, cart, checkout, account, and merchandising blocks for commerce flows.',
  },
  application: {
    id: 'application',
    label: 'Application',
    description: 'Auth, onboarding, settings, billing, dashboard, workflow, layout, and navigation blocks for product surfaces.',
  },
};

export const BLOCK_CATEGORY_ORDER: DocsBlockCategory[] = [
  'hero',
  'header',
  'footer',
  'grids',
  'pricing',
  'cta',
  'social-proof',
  'product',
  'catalog',
  'cart',
  'checkout',
  'account',
  'layout',
  'navigation',
  'dashboard',
  'workflow',
  'forms',
  'auth',
  'onboarding',
  'settings',
  'billing',
];

export const BLOCK_SEGMENT_CATEGORY_ORDER: Record<DocsBlockSegment, DocsBlockCategory[]> = {
  marketing: ['hero', 'header', 'footer', 'grids', 'pricing', 'cta', 'social-proof'],
  commerce: ['product', 'catalog', 'cart', 'checkout', 'account', 'pricing'],
  application: [
    'layout',
    'navigation',
    'dashboard',
    'workflow',
    'forms',
    'auth',
    'onboarding',
    'settings',
    'billing',
  ],
};

export const BLOCK_CATEGORY_META: Record<
  DocsBlockCategory,
  {
    id: DocsBlockCategory;
    label: string;
    description: string;
  }
> = {
  hero: {
    id: 'hero',
    label: 'Hero',
    description: 'Prominent introductory blocks for product marketing and landing experiences.',
  },
  header: {
    id: 'header',
    label: 'Headers',
    description: 'Top-of-page navigational and brand framing blocks for site and app surfaces.',
  },
  footer: {
    id: 'footer',
    label: 'Footers',
    description: 'Lower-page support and navigation blocks for site and product content.',
  },
  grids: {
    id: 'grids',
    label: 'Grids',
    description: 'Feature and content grid compositions, including asymmetrical editorial layouts.',
  },
  pricing: {
    id: 'pricing',
    label: 'Pricing',
    description: 'Plan comparison and package-pricing blocks for conversion and upgrade surfaces.',
  },
  cta: {
    id: 'cta',
    label: 'CTA',
    description: 'Call-to-action bands and conversion blocks for product and campaign pages.',
  },
  'social-proof': {
    id: 'social-proof',
    label: 'Social Proof',
    description: 'Testimonials, logos, trust, and proof-oriented sections for marketing surfaces.',
  },
  product: {
    id: 'product',
    label: 'Product',
    description: 'Product-detail and merchandising blocks for commerce browsing and evaluation.',
  },
  catalog: {
    id: 'catalog',
    label: 'Catalog',
    description: 'Collection, listing, and browse blocks for category and search-driven commerce surfaces.',
  },
  cart: {
    id: 'cart',
    label: 'Cart',
    description: 'Cart summary and line-item blocks for pre-checkout review flows.',
  },
  checkout: {
    id: 'checkout',
    label: 'Checkout',
    description: 'Checkout, payment, shipping, and completion blocks for commerce transactions.',
  },
  account: {
    id: 'account',
    label: 'Account',
    description: 'Account, orders, and profile-management blocks for signed-in commerce experiences.',
  },
  layout: {
    id: 'layout',
    label: 'Layouts',
    description: 'Structural shells, split panes, and workspace framing patterns.',
  },
  navigation: {
    id: 'navigation',
    label: 'Navigation',
    description: 'Shell and navigation-entry blocks for rails, drawers, headers, and app framing.',
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboards',
    description: 'Summaries, analytics, and data-oriented overview blocks for product surfaces.',
  },
  workflow: {
    id: 'workflow',
    label: 'Workflows',
    description: 'Operational blocks for queues, assistant surfaces, and dense task flows.',
  },
  forms: {
    id: 'forms',
    label: 'Forms',
    description: 'Structured forms and task-entry blocks for settings, onboarding, and operations.',
  },
  auth: {
    id: 'auth',
    label: 'Auth',
    description: 'Authentication and account-entry blocks for product onboarding and sign-in flows.',
  },
  onboarding: {
    id: 'onboarding',
    label: 'Onboarding',
    description: 'Getting-started, setup, and activation blocks for new product users.',
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    description: 'Configuration and preference-management blocks for application administration.',
  },
  billing: {
    id: 'billing',
    label: 'Billing',
    description: 'Subscription, plan, invoice, and payment-management blocks for applications.',
  },
};

export function getBlockSegmentHref(segment: DocsBlockSegment): string {
  return `/docs/blocks/${segment}`;
}

export function getBlockSegmentCategoryHref(
  segment: DocsBlockSegment,
  category: DocsBlockCategory,
): string {
  return `/docs/blocks/${segment}/${category}`;
}
