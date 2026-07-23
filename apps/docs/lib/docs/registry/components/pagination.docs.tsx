'use client';

import { Card } from '@unisane/ui/card';
import { Pagination } from '@unisane/ui/pagination';
import { HeroBackground } from '../../runtime/hero-background';
import type { ComponentDoc } from '../types';

const PaginationHeroVisual = () => (
  <HeroBackground tone="surface">
    <div className="bg-surface border-outline-variant rounded-sm border px-4 py-3 shadow-xl">
      <Pagination currentPage={5} totalPages={12} onPageChange={() => {}} />
    </div>
  </HeroBackground>
);

export const paginationDoc: ComponentDoc = {
  slug: 'pagination',
  name: 'Pagination',
  description:
    'Pagination provides deterministic page ranges with either button actions or real page links.',
  category: 'navigation',
  status: 'stable',
  icon: 'more_horiz',

  importPath: '@/components/ui/pagination',
  exports: ['Pagination'],

  heroVisual: <PaginationHeroVisual />,

  choosing: {
    description:
      'Choose button mode for client-owned state and link mode when every page must remain a real destination.',
    columns: {
      emphasis: 'Mode',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Button actions',
        component: <Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />,
        rationale: 'The current view owns page state without a destination URL.',
        examples: 'Client-filtered results, Embedded collections',
      },
      {
        emphasis: 'Page links',
        component: (
          <Pagination currentPage={5} totalPages={12} getPageHref={(page) => `?page=${page}`} />
        ),
        rationale: 'Every page, previous, and next control preserves native hyperlink behavior.',
        examples: 'Search results, Catalogs, Server-rendered indexes',
      },
    ],
  },

  hierarchy: {
    description:
      'Previous, numbered pages, semantic ellipses, and next share one navigation mode and one normalized current page.',
    items: [
      {
        component: <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />,
        title: 'Bounded controls',
        subtitle: 'Unavailable previous or next actions are disabled',
      },
      {
        component: <Pagination currentPage={6} totalPages={12} onPageChange={() => {}} />,
        title: 'Current page',
        subtitle: 'Exactly one page uses aria-current="page"',
      },
      {
        component: (
          <Pagination currentPage={10} totalPages={20} siblingCount={2} onPageChange={() => {}} />
        ),
        title: 'Range density',
        subtitle: 'siblingCount reveals nearby pages without changing the boundary model',
      },
    ],
  },

  placement: {
    description:
      'Place pagination next to result context and give repeated landmarks distinct accessible names.',
    examples: [
      {
        title: 'Below results',
        visual: (
          <Card variant="outlined" padding="md" className="mx-auto max-w-96">
            <div className="text-label-small text-on-surface-variant mb-3">
              Showing 21–30 of 120 items
            </div>
            <Pagination
              aria-label="Catalog result pages"
              currentPage={3}
              totalPages={12}
              getPageHref={(page) => `?page=${page}`}
            />
          </Card>
        ),
        caption: 'A native link boundary paired with result context',
      },
      {
        title: 'Compact controlled collection',
        visual: (
          <Card variant="outlined" padding="md" className="mx-auto max-w-96">
            <Pagination
              className="justify-center"
              currentPage={2}
              totalPages={5}
              siblingCount={0}
              onPageChange={() => {}}
            />
          </Card>
        ),
        caption: 'Button mode with a compact sibling range',
      },
    ],
  },

  props: [
    {
      name: 'currentPage',
      type: 'number',
      required: true,
      description:
        'Controlled 1-indexed page. It is truncated and clamped when a collection shrinks.',
    },
    {
      name: 'totalPages',
      type: 'number',
      required: true,
      description: 'Total page count. Zero, negative, or non-finite values render nothing.',
    },
    {
      name: 'siblingCount',
      type: 'number',
      default: '1',
      description: 'Number of visible pages on each side of the current page.',
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      description:
        'Required in button mode. Optional observation callback in link mode; it does not replace navigation.',
    },
    {
      name: 'getPageHref',
      type: '(page: number) => string',
      description:
        'Enables link mode and supplies a real destination for page, previous, and next links.',
    },
    {
      name: 'renderLink',
      type: '(page: number, props: PaginationLinkProps) => ReactElement',
      description:
        'Optional framework-link renderer. It receives the complete anchor contract including href, labels, current state, click observation, className, and children.',
    },
    {
      name: 'labels',
      type: 'Partial<PaginationLabels>',
      description: 'Localizes the navigation, previous, next, and per-page accessible names.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Classes applied to the native nav boundary.',
    },
  ],

  accessibility: {
    screenReader: [
      'The root is a named navigation landmark; use aria-label or aria-labelledby to distinguish repeated pagination sets.',
      'Exactly one normalized page uses aria-current="page".',
      'Previous, next, and page names are localizable; ellipses are presentation-only.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Moves through available page destinations in document order' },
      { key: 'Enter', description: 'Activates a focused button or link' },
      { key: 'Space', description: 'Activates a focused button in button mode' },
    ],
    focus: [
      'Every available action uses the shared visible focus treatment.',
      'Disabled boundary buttons leave the active destination set unambiguous.',
    ],
  },

  implementation: {
    description:
      'Use button mode for controlled local state, or supply getPageHref for native/framework link navigation.',
    code: `import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";

function ControlledResults({ currentPage, totalPages, setCurrentPage }) {
  return (
    <Pagination
      aria-label="Filtered result pages"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
}

function LinkedResults({ currentPage, totalPages }) {
  return (
    <Pagination
      aria-label="Search result pages"
      currentPage={currentPage}
      totalPages={totalPages}
      getPageHref={(page) => \`/search?page=\${page}\`}
      renderLink={(_page, props) => <Link {...props} />}
    />
  );
}`,
  },

  related: [
    {
      slug: 'table',
      reason:
        'Pair with paged table results while keeping data-fetching ownership outside Pagination.',
    },
    {
      slug: 'list',
      reason:
        'Pair with paged collections while keeping result count and page size as app concerns.',
    },
  ],
};
