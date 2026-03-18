'use client';

import type { DocsBlock } from './types';
import { BLOCK_META } from './block-meta';
import {
  AI_CHAT_WORKSPACE_CODE_EXAMPLE,
  APP_SHELL_CODE_EXAMPLE,
  AUTH_CENTERED_CODE_EXAMPLE,
  AUTH_SPLIT_CODE_EXAMPLE,
  REVIEW_QUEUE_CODE_EXAMPLE,
  SUPPORTING_PANE_CODE_EXAMPLE,
  getCodeExampleEntryCode,
} from './block-code-examples';
import {
  AiChatWorkspaceBlock,
  AppShellBlock,
  AuthCenteredBlock,
  AuthSplitBlock,
  ReviewQueueBlock,
  SupportingPaneBlock,
} from '@/features/blocks/examples';

export const BLOCK_REGISTRY: DocsBlock[] = [
  {
    ...BLOCK_META.find((block) => block.slug === 'app-shell')!,
    preview: <AppShellBlock />,
    previewShell: {
      canvasHeight: 'screen-max',
      canvasInset: 'md',
      defaultViewport: 'desktop',
      viewportOptions: ['desktop', 'tablet', 'mobile'],
      viewportWidths: {
        desktop: 1320,
        tablet: 820,
        mobile: 390,
      },
    },
    previewConfig: {
      tone: 'surfaceContainerLow',
      minHeight: 'screen',
      padding: 'none',
      justify: 'start',
      align: 'start',
    },
    code: getCodeExampleEntryCode(APP_SHELL_CODE_EXAMPLE),
    codeExample: APP_SHELL_CODE_EXAMPLE,
    usedComponents: [
      { title: 'Sidebar', href: '/docs/components/sidebar' },
      { title: 'Top App Bar', href: '/docs/components/top-app-bar' },
      { title: 'Search Bar', href: '/docs/components/search-bar' },
    ],
  },
  {
    ...BLOCK_META.find((block) => block.slug === 'supporting-pane')!,
    preview: <SupportingPaneBlock />,
    previewShell: {
      canvasHeight: 'screen-tall',
      canvasInset: 'md',
      defaultViewport: 'desktop',
      viewportOptions: ['desktop', 'tablet', 'mobile'],
      viewportWidths: {
        desktop: 1220,
        tablet: 820,
        mobile: 390,
      },
    },
    previewConfig: {
      tone: 'surfaceContainerLow',
      minHeight: 'screen',
      padding: 'none',
      justify: 'start',
      align: 'start',
    },
    code: getCodeExampleEntryCode(SUPPORTING_PANE_CODE_EXAMPLE),
    codeExample: SUPPORTING_PANE_CODE_EXAMPLE,
    usedComponents: [
      { title: 'Canonical Layouts', href: '/docs/components/canonical-layouts' },
      { title: 'Pane Group', href: '/docs/components/pane-group' },
      { title: 'Button', href: '/docs/components/button' },
    ],
  },
  {
    ...BLOCK_META.find((block) => block.slug === 'auth-split')!,
    preview: <AuthSplitBlock />,
    previewShell: {
      canvasHeight: 'xl',
      canvasInset: 'md',
      defaultViewport: 'desktop',
      viewportOptions: ['desktop', 'tablet', 'mobile'],
    },
    previewConfig: {
      tone: 'surfaceContainerLow',
      minHeight: 'screen',
      padding: 'none',
      justify: 'start',
      align: 'start',
    },
    code: getCodeExampleEntryCode(AUTH_SPLIT_CODE_EXAMPLE),
    codeExample: AUTH_SPLIT_CODE_EXAMPLE,
    usedComponents: [
      { title: 'Text Field', href: '/docs/components/text-field' },
      { title: 'Checkbox', href: '/docs/components/checkbox' },
      { title: 'Button', href: '/docs/components/button' },
    ],
  },
  {
    ...BLOCK_META.find((block) => block.slug === 'auth-centered')!,
    preview: <AuthCenteredBlock />,
    previewShell: {
      canvasHeight: 'lg',
      canvasInset: 'md',
      defaultViewport: 'mobile',
      viewportOptions: ['mobile', 'tablet', 'desktop'],
    },
    previewConfig: {
      tone: 'surfaceContainerLow',
      minHeight: 'screen',
      padding: 'md',
      justify: 'center',
      align: 'center',
    },
    code: getCodeExampleEntryCode(AUTH_CENTERED_CODE_EXAMPLE),
    codeExample: AUTH_CENTERED_CODE_EXAMPLE,
    usedComponents: [
      { title: 'Text Field', href: '/docs/components/text-field' },
      { title: 'Checkbox', href: '/docs/components/checkbox' },
      { title: 'Button', href: '/docs/components/button' },
    ],
  },
  {
    ...BLOCK_META.find((block) => block.slug === 'review-queue')!,
    preview: <ReviewQueueBlock />,
    previewShell: {
      canvasHeight: 'xl',
      canvasInset: 'sm',
      defaultViewport: 'desktop',
      viewportOptions: ['desktop', 'tablet'],
    },
    previewConfig: {
      tone: 'surfaceContainerLow',
      minHeight: 'screen',
      padding: 'none',
      justify: 'start',
      align: 'start',
    },
    code: getCodeExampleEntryCode(REVIEW_QUEUE_CODE_EXAMPLE),
    codeExample: REVIEW_QUEUE_CODE_EXAMPLE,
    usedComponents: [
      { title: 'Table', href: '/docs/components/table' },
      { title: 'Pagination', href: '/docs/components/pagination' },
      { title: 'Badge', href: '/docs/components/badge' },
    ],
  },
  {
    ...BLOCK_META.find((block) => block.slug === 'ai-chat-workspace')!,
    preview: <AiChatWorkspaceBlock />,
    previewShell: {
      canvasHeight: 'xl',
      canvasInset: 'sm',
      defaultViewport: 'desktop',
      viewportOptions: ['desktop', 'tablet', 'mobile'],
    },
    previewConfig: {
      tone: 'surfaceContainerLow',
      minHeight: 'screen',
      padding: 'none',
      justify: 'start',
      align: 'start',
    },
    code: getCodeExampleEntryCode(AI_CHAT_WORKSPACE_CODE_EXAMPLE),
    codeExample: AI_CHAT_WORKSPACE_CODE_EXAMPLE,
    usedComponents: [
      { title: 'Text Field', href: '/docs/components/text-field' },
      { title: 'Button', href: '/docs/components/button' },
      { title: 'Card', href: '/docs/components/card' },
    ],
  },
];

export function getRegisteredBlockBySlug(slug: string): DocsBlock | undefined {
  return BLOCK_REGISTRY.find((block) => block.slug === slug);
}
