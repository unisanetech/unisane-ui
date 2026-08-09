import type { NavigationItem } from '@unisane/ui/navigation';
import { getAllComponents } from '../registry/selectors';
import { getAllFoundationPages } from '../content/foundations/selectors';
import {
  BLOCK_CATEGORY_META,
  BLOCK_SEGMENT_CATEGORY_ORDER,
  BLOCK_SEGMENT_META,
  BLOCK_SEGMENT_ORDER,
  getBlockSegmentCategoryHref,
  getBlockSegmentHref,
} from '../blocks/block-taxonomy';
import { getPrimaryCategoryBySlug, getPrimarySegmentBySlug } from '../blocks/selectors';

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

const blockNavItems: NavigationItem[] = [
  { id: 'blocks-overview', label: 'Overview', href: '/docs/blocks' },
  ...BLOCK_SEGMENT_ORDER.map((segment) => ({
    id: `blocks-${segment}`,
    label: BLOCK_SEGMENT_META[segment].label,
    href: getBlockSegmentHref(segment),
    items: BLOCK_SEGMENT_CATEGORY_ORDER[segment].map((category) => ({
      id: `blocks-${segment}-${category}`,
      label: BLOCK_CATEGORY_META[category].label,
      href: getBlockSegmentCategoryHref(segment, category),
    })),
  })),
];

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
    items: [
      { id: 'datatable-overview', label: 'Overview', href: '/datatable' },
      {
        id: 'datatable-responsiveness',
        label: 'Responsive behavior',
        href: '/docs/data-table/responsiveness',
      },
    ],
  },
  {
    id: 'blocks',
    label: 'Blocks',
    icon: 'dashboard',
    href: '/docs/blocks',
    items: blockNavItems,
  },
];

export function getActiveNavigationId(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname === '/docs/getting-started') return 'getting-started';
  if (pathname.startsWith('/docs/getting-started/')) {
    return pathname.split('/').filter(Boolean).at(-1) ?? 'getting-started';
  }
  if (pathname === '/docs/foundations') return 'foundations';
  if (pathname.startsWith('/docs/foundations/')) {
    return pathname.split('/').filter(Boolean).at(-1) ?? 'foundations';
  }
  if (pathname === '/docs/components') return 'components-overview';
  if (pathname.startsWith('/docs/components/')) {
    return pathname.split('/').filter(Boolean).at(-1) ?? 'components';
  }
  if (pathname.startsWith('/datatable')) return 'datatable-overview';
  if (pathname.startsWith('/docs/data-table/')) {
    return pathname.split('/').filter(Boolean).at(-1) === 'responsiveness'
      ? 'datatable-responsiveness'
      : 'datatable';
  }
  if (pathname === '/docs/blocks') return 'blocks-overview';
  if (pathname.startsWith('/docs/blocks/')) {
    const parts = pathname.split('/').filter(Boolean);
    const segment = parts.at(2);
    const category = parts.at(3);
    const slug = parts.at(-1);

    if (!slug) return 'blocks-overview';
    if (segment && segment in BLOCK_SEGMENT_META && category && category in BLOCK_CATEGORY_META) {
      return `blocks-${segment}-${category}`;
    }
    if (segment && segment in BLOCK_SEGMENT_META) {
      return `blocks-${segment}`;
    }
    const primarySegment = getPrimarySegmentBySlug(slug);
    const primaryCategory = getPrimaryCategoryBySlug(slug);
    return primarySegment && primaryCategory
      ? `blocks-${primarySegment}-${primaryCategory}`
      : 'blocks-overview';
  }
  return 'home';
}

export function findNavigationCategory(id: string): NavigationItem | undefined {
  return DOCS_NAVIGATION.find((category) => category.id === id);
}
