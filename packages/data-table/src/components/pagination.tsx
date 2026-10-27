'use client';

import React, { memo, useMemo } from 'react';
import { Button } from '@unisane/ui/button';
import { Icon } from '@unisane/ui/icon';
import { IconButton } from '@unisane/ui/icon-button';
import { Pagination } from '@unisane/ui/pagination';
import { usePagination } from '../context';
import { useI18n } from '../i18n';

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

interface DataTablePaginationProps {
  totalItems?: number;
  currentCount?: number;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showPageInfo?: boolean;
  siblingCount?: number;
  mode?: 'offset' | 'cursor';
  cursor?: {
    nextCursor?: string;
    prevCursor?: string;
    onNext: () => void;
    onPrev: () => void;
    pageIndex?: number;
    limit?: number;
    onLimitChange?: (limit: number) => void;
  };
}

function PageSizeSelector({
  pageSize,
  pageSizeOptions,
  onChange,
}: {
  pageSize: number;
  pageSizeOptions: number[];
  onChange: (size: number) => void;
}) {
  const { t } = useI18n();

  return (
    <label className="flex items-center gap-2">
      <span className="text-body-medium text-on-surface-variant whitespace-nowrap">
        {t('rowsPerPage')}
      </span>
      <span className="relative">
        <select
          value={pageSize}
          onChange={(event) => onChange(Number(event.target.value))}
          className="text-body-medium text-on-surface focus-visible:ring-focus-ring rounded-button h-[var(--size-action-sm)] min-w-[var(--size-action-md)] cursor-pointer appearance-none border-none bg-transparent px-1 pr-5 focus-visible:outline-none focus-visible:ring-2"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <Icon
          symbol="arrow_drop_down"
          className="text-on-surface-variant pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2"
        />
      </span>
    </label>
  );
}

function OffsetPagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  setPage,
  setPageSize,
  pageSizeOptions,
  showPageSizeSelector,
  showPageInfo,
  siblingCount,
}: {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  pageSizeOptions: number[];
  showPageSizeSelector: boolean;
  showPageInfo: boolean;
  siblingCount: number;
}) {
  const { t, formatNumber } = useI18n();
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const canGoPrev = safePage > 1;
  const canGoNext = safePage < totalPages;
  const start = totalItems > 0 ? (safePage - 1) * pageSize + 1 : 0;
  const end = totalItems > 0 ? Math.min(safePage * pageSize, totalItems) : 0;
  const rangeLabel =
    totalItems > 0
      ? t('rangeOfTotal', {
          start: formatNumber(start),
          end: formatNumber(end),
          total: formatNumber(totalItems),
        })
      : t('noItems');
  const pageLabel = t('pageOfTotal', {
    page: formatNumber(safePage),
    totalPages: formatNumber(totalPages),
  });

  return (
    <footer className="border-outline-weak bg-surface @md:px-4 flex border-t px-3 py-2">
      <div className="@md:flex hidden w-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-5">
          {showPageSizeSelector && (
            <PageSizeSelector
              pageSize={pageSize}
              pageSizeOptions={pageSizeOptions}
              onChange={setPageSize}
            />
          )}
          {showPageInfo && (
            <span className="text-body-medium text-on-surface-variant whitespace-nowrap">
              {rangeLabel}
            </span>
          )}
        </div>

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          siblingCount={siblingCount}
          onPageChange={setPage}
          labels={{
            navigation: pageLabel,
            previous: t('previous'),
            next: t('next'),
            page: (pageNumber) =>
              t('pageOfTotal', {
                page: formatNumber(pageNumber),
                totalPages: formatNumber(totalPages),
              }),
          }}
        />
      </div>

      <nav
        aria-label={pageLabel}
        className="@md:hidden flex w-full items-center justify-between gap-2"
      >
        <Button
          variant="text"
          size="md"
          disabled={!canGoPrev}
          onClick={() => setPage(safePage - 1)}
        >
          {t('previous')}
        </Button>
        <span
          className="text-label-large text-on-surface-variant whitespace-nowrap"
          aria-current="page"
        >
          {pageLabel}
        </span>
        <Button
          variant="text"
          size="md"
          disabled={!canGoNext}
          onClick={() => setPage(safePage + 1)}
        >
          {t('next')}
        </Button>
      </nav>
    </footer>
  );
}

function CursorPagination({
  currentCount,
  totalItems,
  cursor,
  pageSizeOptions,
  showPageSizeSelector,
  showPageInfo,
}: {
  currentCount?: number;
  totalItems?: number;
  cursor: NonNullable<DataTablePaginationProps['cursor']>;
  pageSizeOptions: number[];
  showPageSizeSelector: boolean;
  showPageInfo: boolean;
}) {
  const { t, formatNumber } = useI18n();
  const hasPrev = Boolean(cursor.prevCursor);
  const hasNext = Boolean(cursor.nextCursor);
  const pageSize = cursor.limit ?? pageSizeOptions[0] ?? 25;
  const pageIndex = cursor.pageIndex ?? 1;
  const startItem =
    currentCount !== undefined && currentCount > 0 ? (pageIndex - 1) * pageSize + 1 : 0;
  const endItem = currentCount !== undefined && currentCount > 0 ? startItem + currentCount - 1 : 0;
  const rangeLabel =
    currentCount !== undefined && currentCount > 0
      ? totalItems !== undefined
        ? t('rangeOfTotal', {
            start: formatNumber(startItem),
            end: formatNumber(endItem),
            total: formatNumber(totalItems),
          })
        : `${formatNumber(startItem)}–${formatNumber(endItem)}`
      : totalItems !== undefined
        ? t('rangeOfTotal', {
            start: 0,
            end: 0,
            total: formatNumber(totalItems),
          })
        : t('noItems');
  const pageLabel = t('cursorPagination', {
    count: currentCount ?? 0,
    page: formatNumber(pageIndex),
  });

  return (
    <footer className="border-outline-weak bg-surface @md:px-4 flex border-t px-3 py-2">
      <div className="@md:flex hidden w-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-5">
          {showPageSizeSelector && cursor.onLimitChange && (
            <PageSizeSelector
              pageSize={pageSize}
              pageSizeOptions={pageSizeOptions}
              onChange={cursor.onLimitChange}
            />
          )}
          {showPageInfo && (
            <span className="text-body-medium text-on-surface-variant whitespace-nowrap">
              {rangeLabel}
            </span>
          )}
        </div>

        <nav aria-label={pageLabel} className="flex items-center">
          <IconButton
            variant="standard"
            onClick={cursor.onPrev}
            disabled={!hasPrev}
            aria-label={t('previous')}
            icon={<Icon symbol="chevron_left" className="rtl:rotate-180" />}
          />
          <span
            className="text-label-large text-on-surface-variant min-w-8 whitespace-nowrap text-center"
            aria-current="page"
          >
            {formatNumber(pageIndex)}
          </span>
          <IconButton
            variant="standard"
            onClick={cursor.onNext}
            disabled={!hasNext}
            aria-label={t('next')}
            icon={<Icon symbol="chevron_right" className="rtl:rotate-180" />}
          />
        </nav>
      </div>

      <nav
        aria-label={pageLabel}
        className="@md:hidden flex w-full items-center justify-between gap-2"
      >
        <Button variant="text" size="md" disabled={!hasPrev} onClick={cursor.onPrev}>
          {t('previous')}
        </Button>
        <span className="text-label-large text-on-surface-variant whitespace-nowrap">
          {formatNumber(pageIndex)}
        </span>
        <Button variant="text" size="md" disabled={!hasNext} onClick={cursor.onNext}>
          {t('next')}
        </Button>
      </nav>
    </footer>
  );
}

function DataTablePaginationInner({
  totalItems,
  currentCount,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  showPageSizeSelector = true,
  showPageInfo = true,
  siblingCount = 1,
  mode = 'offset',
  cursor,
}: DataTablePaginationProps) {
  const { page, pageSize, setPage, setPageSize } = usePagination();

  const totalPages = useMemo(() => {
    if (!totalItems) return 1;
    return Math.max(1, Math.ceil(totalItems / Math.max(pageSize, 1)));
  }, [totalItems, pageSize]);

  if (mode === 'cursor' && cursor) {
    return (
      <CursorPagination
        currentCount={currentCount}
        totalItems={totalItems}
        cursor={cursor}
        pageSizeOptions={pageSizeOptions}
        showPageSizeSelector={showPageSizeSelector}
        showPageInfo={showPageInfo}
      />
    );
  }

  return (
    <OffsetPagination
      page={page}
      pageSize={pageSize}
      totalItems={totalItems ?? 0}
      totalPages={totalPages}
      setPage={setPage}
      setPageSize={setPageSize}
      pageSizeOptions={pageSizeOptions}
      showPageSizeSelector={showPageSizeSelector}
      showPageInfo={showPageInfo}
      siblingCount={siblingCount}
    />
  );
}

export const DataTablePagination = memo(DataTablePaginationInner);
