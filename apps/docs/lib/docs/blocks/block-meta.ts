import type { DocsBlockMeta } from './types';

export const BLOCK_META: DocsBlockMeta[] = [
  {
    slug: 'app-shell',
    title: 'App shell',
    description:
      'A real workspace shell with rail, queue list, header actions, and content region.',
    category: 'layout',
    icon: 'dashboard',
  },
  {
    slug: 'supporting-pane',
    title: 'Supporting pane',
    description: 'Primary content with a contextual properties pane for dense product workflows.',
    category: 'layout',
    icon: 'view_sidebar',
  },
  {
    slug: 'auth-split',
    title: 'Auth split page',
    description: 'A split authentication screen with brand panel and focused sign-in form.',
    category: 'auth',
    icon: 'login',
  },
  {
    slug: 'auth-centered',
    title: 'Auth centered page',
    description: 'A centered account-creation screen for cleaner onboarding and invite flows.',
    category: 'auth',
    icon: 'person_add',
  },
  {
    slug: 'review-queue',
    title: 'Review queue',
    description:
      'A lightweight operational queue with status, owner, pagination, and a table handoff action.',
    category: 'workflow',
    icon: 'fact_check',
  },
  {
    slug: 'ai-chat-workspace',
    title: 'AI chat workspace',
    description:
      'A focused AI assistant surface with message history, suggestions, and a bottom composer.',
    category: 'workflow',
    icon: 'smart_toy',
  },
];
