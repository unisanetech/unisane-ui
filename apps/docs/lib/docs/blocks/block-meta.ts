import type { DocsBlockMeta } from './types';

export const BLOCK_META: DocsBlockMeta[] = [
  {
    slug: 'app-shell',
    title: 'App shell',
    description:
      'A real workspace shell with rail, queue list, header actions, and content region.',
    primarySegment: 'application',
    primaryCategory: 'navigation',
    categories: ['navigation', 'layout'],
    segments: ['application'],
    icon: 'dashboard',
  },
  {
    slug: 'supporting-pane',
    title: 'Supporting pane',
    description: 'Primary content with a contextual properties pane for dense product workflows.',
    primarySegment: 'application',
    primaryCategory: 'layout',
    categories: ['layout', 'workflow'],
    segments: ['application'],
    icon: 'view_sidebar',
  },
  {
    slug: 'auth-split',
    title: 'Auth split page',
    description: 'A split authentication screen with brand panel and focused sign-in form.',
    primarySegment: 'application',
    primaryCategory: 'auth',
    categories: ['auth', 'forms'],
    segments: ['application'],
    icon: 'login',
  },
  {
    slug: 'auth-centered',
    title: 'Auth centered page',
    description: 'A centered account-creation screen for cleaner onboarding and invite flows.',
    primarySegment: 'application',
    primaryCategory: 'auth',
    categories: ['auth', 'forms'],
    segments: ['application'],
    icon: 'person_add',
  },
  {
    slug: 'review-queue',
    title: 'Review queue',
    description:
      'A lightweight operational queue with status, owner, pagination, and a table handoff action.',
    primarySegment: 'application',
    primaryCategory: 'dashboard',
    categories: ['dashboard', 'workflow'],
    segments: ['application'],
    icon: 'fact_check',
  },
  {
    slug: 'ai-chat-workspace',
    title: 'AI chat workspace',
    description:
      'A focused AI assistant surface with message history, suggestions, and a bottom composer.',
    primarySegment: 'application',
    primaryCategory: 'workflow',
    categories: ['workflow', 'dashboard'],
    segments: ['application'],
    icon: 'smart_toy',
  },
];
