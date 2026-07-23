'use client';

import React, { memo, useMemo } from 'react';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { usePagination } from '@/components/ui/data-table/context';
import { useI18n } from '@/components/ui/data-table/i18n';

// ─── PAGE SIZE OPTIONS ─────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

// ─── PAGINATION PROPS ──────────────────────────────────────────────────────

interface DataTablePaginationProps {
  /** Total number of items */
  totalItems?: number;
  /** Current page count (for remote data) */
  currentCount?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Pagination mode */
  mode?: 'offset' | 'cursor';
  /** Cursor pagination controls */
  cursor?: {
    nextCursor?: string;
    prevCursor?: string;
    onNext: () => void;
    onPrev: () => void;
    pageIndex?: number;
    /** Current page size / limit */
    limit?: number;
    /** Callback when page size changes */
    onLimitChange?: (limit: number) => void;
  };
}

// ─── PAGE SIZE SELECTOR ────────────────────────────────────────────────────

function PageSizeSelector({
  pageSize,
  pageSizeOptions,
  onChange,
  label,
}: {
  pageSize: number;
  pageSizeOptions: number[];
  onChange: (size: number) => void;
  label?: string;
}) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2">
      <span className="text-body-medium text-on-surface-variant whitespace-nowrap">
        {label ?? t('rowsPerPage')}
      </span>
      <div className="relative">
        <select
          value={pageSize}
          onChange={(e) => onChange(Number(e.target.value))}
          className="text-body-medium text-on-surface focus-visible:ring-focus-ring min-h-[36px] min-w-[48px] cursor-pointer appearance-none rounded border-none bg-transparent px-1 pr-5 focus-visible:ring-2 focus-visible:outline-none"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <Icon
          symbol="arrow_drop_down"
          className="text-on-surface-variant pointer-events-none absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2"
        />
      </div>
    </div>
  );
}

// ─── OFFSET PAGINATION ─────────────────────────────────────────────────────

function OffsetPagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  setPage,
  setPageSize,
  pageSizeOptions,
}: {
  page: number;
  pageSize: number;
  totalItems?: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  pageSizeOptions: number[];
}) {
  const { t, formatNumber } = useI18n();
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  // Calculate range display
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems ?? 0);
  const total = totalItems ?? 0;

  return (
    <div className="flex items-center justify-end gap-6 px-1">
      {/* Page size selector with label */}
      <PageSizeSelector
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onChange={setPageSize}
      />

      {/* Range display: "1-5 of 13" */}
      <span className="text-body-medium text-on-surface-variant whitespace-nowrap">
        {total > 0
          ? `${formatNumber(start)}–${formatNumber(end)} ${t('of')} ${formatNumber(total)}`
          : t('noItems')}
      </span>

      {/* Navigation buttons */}
      <div className="flex items-center">
        <IconButton
          variant="standard"
          onClick={() => setPage(page - 1)}
          disabled={!canGoPrev}
          aria-label={t('previous')}
          icon={<Icon symbol="chevron_left" />}
        />

        <IconButton
          variant="standard"
          onClick={() => setPage(page + 1)}
          disabled={!canGoNext}
          aria-label={t('next')}
          icon={<Icon symbol="chevron_right" />}
        />
      </div>
    </div>
  );
}

// ─── CURSOR PAGINATION ─────────────────────────────────────────────────────

function CursorPagination({
  currentCount,
  totalItems,
  cursor,
  pageSizeOptions,
}: {
  currentCount?: number;
  totalItems?: number;
  cursor: NonNullable<DataTablePaginationProps['cursor']>;
  pageSizeOptions: number[];
}) {
  const { t, formatNumber } = useI18n();
  const hasPrev = !!cursor.prevCursor;
  const hasNext = !!cursor.nextCursor;

  // Use cursor's limit for page size, fallback to first option
  const pageSize = cursor.limit ?? pageSizeOptions[0] ?? 25;

  // Calculate display range for cursor pagination
  const pageIndex = cursor.pageIndex ?? 1;
  const startItem =
    currentCount !== undefined && currentCount > 0 ? (pageIndex - 1) * pageSize + 1 : 0;
  const endItem = currentCount !== undefined && currentCount > 0 ? startItem + currentCount - 1 : 0;

  // Handler for page size change - calls cursor's onLimitChange
  const handlePageSizeChange = (newSize: number) => {
    cursor.onLimitChange?.(newSize);
  };

  // Build range display string: "1–25" or "1–25 of 100"
  const rangeDisplay =
    currentCount !== undefined && currentCount > 0
      ? totalItems !== undefined
        ? `${formatNumber(startItem)}–${formatNumber(endItem)} ${t('of')} ${formatNumber(totalItems)}`
        : `${formatNumber(startItem)}–${formatNumber(endItem)}`
      : totalItems !== undefined
        ? `0 ${t('of')} ${formatNumber(totalItems)}`
        : t('noItems');

  return (
    <div className="flex items-center justify-end gap-6 px-1">
      {/* Page size selector - only show if onLimitChange is provided */}
      {cursor.onLimitChange && (
        <PageSizeSelector
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onChange={handlePageSizeChange}
        />
      )}

      {/* Range display: "1–5 of 13" */}
      <span className="text-body-medium text-on-surface-variant whitespace-nowrap">
        {rangeDisplay}
      </span>

      {/* Navigation buttons */}
      <div className="flex items-center">
        <IconButton
          variant="standard"
          onClick={cursor.onPrev}
          disabled={!hasPrev}
          aria-label={t('previous')}
          icon={<Icon symbol="chevron_left" />}
        />

        <IconButton
          variant="standard"
          onClick={cursor.onNext}
          disabled={!hasNext}
          aria-label={t('next')}
          icon={<Icon symbol="chevron_right" />}
        />
      </div>
    </div>
  );
}

// ─── PAGINATION COMPONENT ──────────────────────────────────────────────────

function DataTablePaginationInner({
  totalItems,
  currentCount,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
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
      />
    );
  }

  return (
    <OffsetPagination
      page={page}
      pageSize={pageSize}
      totalItems={totalItems}
      totalPages={totalPages}
      setPage={setPage}
      setPageSize={setPageSize}
      pageSizeOptions={pageSizeOptions}
    />
  );
}

export const DataTablePagination = memo(DataTablePaginationInner);
