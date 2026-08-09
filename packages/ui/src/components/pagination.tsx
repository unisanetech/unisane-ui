import React, { forwardRef } from 'react';
import { paginationButtonClass } from '../lib/action-size';
import { cn, focusRing } from '../lib/utils';
import { Text } from '../primitives/text';
import { Icon } from './icon';
import { Ripple } from './ripple';

export interface PaginationLabels {
  navigation: string;
  previous: string;
  next: string;
  page: (page: number) => string;
}

export interface PaginationLinkProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> {
  href: string;
  children: React.ReactNode;
}

export type PaginationLinkRenderer = (
  page: number,
  props: PaginationLinkProps,
) => React.ReactElement;

type PaginationCommonProps = Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> & {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  labels?: Partial<PaginationLabels>;
};

export type PaginationButtonProps = PaginationCommonProps & {
  onPageChange: (page: number) => void;
  getPageHref?: never;
  renderLink?: never;
};

export type PaginationNavigationProps = PaginationCommonProps & {
  getPageHref: (page: number) => string;
  renderLink?: PaginationLinkRenderer;
  onPageChange?: (page: number) => void;
};

export type PaginationProps = PaginationButtonProps | PaginationNavigationProps;

type PaginationRangeItem = number | 'start-ellipsis' | 'end-ellipsis';

const defaultLabels: PaginationLabels = {
  navigation: 'Pagination',
  previous: 'Previous page',
  next: 'Next page',
  page: (page) => `Page ${page}`,
};

function normalizeInteger(value: number, fallback: number, minimum: number) {
  return Number.isFinite(value) ? Math.max(minimum, Math.trunc(value)) : fallback;
}

function range(start: number, end: number) {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
}

function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PaginationRangeItem[] {
  const completeRangeSize = siblingCount * 2 + 5;

  if (totalPages <= completeRangeSize) {
    return range(1, totalPages);
  }

  if (currentPage <= siblingCount + 3) {
    const end = siblingCount * 2 + 3;
    return [...range(1, end), 'end-ellipsis', totalPages];
  }

  if (currentPage >= totalPages - siblingCount - 2) {
    const start = totalPages - siblingCount * 2 - 2;
    return [1, 'start-ellipsis', ...range(start, totalPages)];
  }

  return [
    1,
    'start-ellipsis',
    ...range(currentPage - siblingCount, currentPage + siblingCount),
    'end-ellipsis',
    totalPages,
  ];
}

interface PaginationActionProps {
  page: number;
  current?: boolean;
  disabled?: boolean;
  label: string;
  onPageChange?: (page: number) => void;
  getPageHref?: (page: number) => string;
  renderLink?: PaginationLinkRenderer;
  children: React.ReactNode;
}

function PaginationAction({
  page,
  current = false,
  disabled = false,
  label,
  onPageChange,
  getPageHref,
  renderLink,
  children,
}: PaginationActionProps) {
  const className = cn(
    paginationButtonClass,
    focusRing,
    current ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-state-hover',
    disabled && 'cursor-default opacity-38',
  );
  const content = (
    <>
      {!disabled && <Ripple />}
      <span className="relative z-10 inline-flex items-center justify-center">{children}</span>
    </>
  );

  if (!disabled && getPageHref) {
    const linkProps: PaginationLinkProps = {
      href: getPageHref(page),
      className,
      'aria-current': current ? 'page' : undefined,
      'aria-label': label,
      onClick: () => onPageChange?.(page),
      children: content,
    };

    return renderLink ? renderLink(page, linkProps) : <a {...linkProps} />;
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      aria-current={current ? 'page' : undefined}
      aria-label={label}
      onClick={() => onPageChange?.(page)}
    >
      {content}
    </button>
  );
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      siblingCount = 1,
      labels,
      onPageChange,
      getPageHref,
      renderLink,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const pageCount = normalizeInteger(totalPages, 0, 0);
    if (pageCount === 0) return null;

    const activePage = Math.min(normalizeInteger(currentPage, 1, 1), pageCount);
    const visibleSiblingCount = normalizeInteger(siblingCount, 1, 0);
    const resolvedLabels = { ...defaultLabels, ...labels };
    const pageRange = getPaginationRange(activePage, pageCount, visibleSiblingCount);

    return (
      <nav
        {...props}
        ref={ref}
        aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : resolvedLabels.navigation)}
        aria-labelledby={ariaLabelledBy}
        className={cn('flex items-center gap-2', className)}
      >
        <PaginationAction
          page={activePage - 1}
          disabled={activePage === 1}
          label={resolvedLabels.previous}
          onPageChange={onPageChange}
          getPageHref={getPageHref}
          renderLink={renderLink}
        >
          <Icon symbol="chevron_left" className="rtl:rotate-180" />
        </PaginationAction>

        <div className="flex items-center gap-1">
          {pageRange.map((item) =>
            typeof item === 'number' ? (
              <PaginationAction
                key={item}
                page={item}
                current={item === activePage}
                label={resolvedLabels.page(item)}
                onPageChange={onPageChange}
                getPageHref={getPageHref}
                renderLink={renderLink}
              >
                <Text variant="bodyMedium">{item}</Text>
              </PaginationAction>
            ) : (
              <Text
                key={item}
                aria-hidden="true"
                variant="bodyMedium"
                className="text-on-surface-variant px-2"
              >
                …
              </Text>
            ),
          )}
        </div>

        <PaginationAction
          page={activePage + 1}
          disabled={activePage === pageCount}
          label={resolvedLabels.next}
          onPageChange={onPageChange}
          getPageHref={getPageHref}
          renderLink={renderLink}
        >
          <Icon symbol="chevron_right" className="rtl:rotate-180" />
        </PaginationAction>
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';
