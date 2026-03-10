import type { NavigationItem } from '@unisane/ui';
import { getAllComponents } from '../registry/selectors';
import { getAllFoundationPages } from '../content/foundations/selectors';
import { getAllBlocks } from '../blocks/selectors';

export type { NavigationItem };

const componentNavItems: NavigationItem[] = [
  { id: 'components-overview', label: 'Overview', href: '/docs/components' },
  ...getAllComponents().map((component) => ({
    id: component.slug,
    label: component.name,
    href: `/docs/components/${component.slug}`,
  })),
];

const foundationNavItems: NavigationItem[] = getAllFoundationPages().map((page) => ({
  id: page.slug,
  label: page.title,
  href: `/docs/foundations/${page.slug}`,
}));

const blockNavItems: NavigationItem[] = getAllBlocks().map((block) => ({
  id: block.slug,
  label: block.title,
  href: `/docs/blocks/${block.slug}`,
}));

export const DOCS_NAVIGATION: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
    href: '/',
    items: [],
  },
  {
    id: 'getting-started',
    label: 'Get Started',
    icon: 'rocket_launch',
    href: '/docs/getting-started',
    items: [
      {
        id: 'installation',
        label: 'Installation',
        href: '/docs/getting-started/installation',
      },
      {
        id: 'quick-start',
        label: 'Quick Start',
        href: '/docs/getting-started/quick-start',
      },
      {
        id: 'styling',
        label: 'Styling',
        href: '/docs/getting-started/styling',
      },
      {
        id: 'theming',
        label: 'Building Themes',
        href: '/docs/getting-started/theming',
      },
    ],
  },
  {
    id: 'foundations',
    label: 'Foundations',
    icon: 'palette',
    href: '/docs/foundations',
    items: foundationNavItems,
  },
  {
    id: 'components',
    label: 'Components',
    icon: 'widgets',
    href: '/docs/components',
    items: componentNavItems,
  },
  {
    id: 'datatable',
    label: 'Data Table',
    icon: 'table_chart',
    href: '/datatable',
    items: [],
  },
  {
    id: 'blocks',
    label: 'Blocks',
    icon: 'dashboard',
    href: '/docs/blocks',
    items: blockNavItems,
  },
];

export function getActiveCategoryId(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/docs/getting-started')) return 'getting-started';
  if (pathname.startsWith('/docs/foundations')) return 'foundations';
  if (pathname.startsWith('/docs/components')) return 'components';
  if (pathname.startsWith('/datatable')) return 'datatable';
  if (pathname.startsWith('/docs/blocks')) return 'blocks';
  return 'home';
}

export function findNavigationCategory(id: string): NavigationItem | undefined {
  return DOCS_NAVIGATION.find((category) => category.id === id);
}
