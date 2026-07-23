'use client';

import { cn } from '@unisane/ui/utils';
import { Icon } from '@unisane/ui/icon';
import { Button } from '@unisane/ui/button';
import { Chip } from '@unisane/ui/chip';
import { IconButton } from '@unisane/ui/icon-button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@unisane/ui/dropdown-menu';
import type { BulkAction } from '../../types';
import { useFiltering, useColumns, useGrouping, usePagination } from '../../context';
import { useI18n } from '../../i18n';

// ─── SELECTION BAR ────────────────────────────────────────────────────────

export function SelectionBar({
  selectedCount,
  selectedIds,
  bulkActions,
  onClearSelection,
}: {
  selectedCount: number;
  selectedIds: string[];
  bulkActions: BulkAction[];
  onClearSelection?: () => void;
}) {
  const { t } = useI18n();

  // Render bulk action button (used in both dropdown items and inline buttons)
  const renderActionButton = (action: BulkAction, idx: number, inline: boolean) => {
    const isDisabled =
      typeof action.disabled === 'function' ? action.disabled(selectedIds) : action.disabled;
    const isDanger = action.variant === 'danger';

    if (!inline) {
      // Dropdown menu item
      return (
        <DropdownMenuItem
          key={idx}
          onClick={() => action.onClick(selectedIds)}
          disabled={isDisabled}
          icon={
            typeof action.icon === 'string' ? (
              <Icon symbol={action.icon} className="h-5 w-5" />
            ) : action.icon ? (
              <span>{action.icon}</span>
            ) : undefined
          }
          className={isDanger ? 'text-error' : undefined}
        >
          {action.label}
        </DropdownMenuItem>
      );
    }

    // Inline button for larger screens
    return (
      <Button
        key={idx}
        onClick={() => action.onClick(selectedIds)}
        disabled={isDisabled}
        variant="text"
        size="sm"
        leadingIcon={
          typeof action.icon === 'string' ? (
            <Icon symbol={action.icon} className="text-[20px]" />
          ) : action.icon ? (
            <span>{action.icon}</span>
          ) : undefined
        }
        className={cn(
          'gap-1.5 px-2',
          isDanger
            ? 'text-error hover:bg-state-error'
            : 'text-on-surface-variant hover:bg-state-hover hover:text-on-surface',
        )}
      >
        <span className="text-body-medium font-medium">{action.label}</span>
      </Button>
    );
  };

  return (
    <div className="flex w-full items-center justify-between gap-2 @md:gap-4">
      {/* Left: Selection count and clear button */}
      <div className="flex items-center gap-2">
        <span className="text-body-medium text-primary font-semibold whitespace-nowrap">
          {t('selectedCount', { count: selectedCount })}
        </span>
        {onClearSelection && (
          <IconButton
            onClick={onClearSelection}
            variant="standard"
            size="sm"
            selected
            aria-label={t('deselectAll')}
            icon={<Icon symbol="close" />}
          />
        )}
      </div>

      {/* Right: Bulk actions */}
      {bulkActions.length > 0 && (
        <div className="flex items-center gap-2">
          {/* Small screens: Actions in dropdown (right-aligned) */}
          <div className="@md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  variant="standard"
                  size="md"
                  aria-label={t('actions')}
                  icon={<Icon symbol="more_vert" />}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48">
                {bulkActions.map((action, idx) => renderActionButton(action, idx, false))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Larger screens: Inline buttons */}
          <div className="hidden items-center gap-2 @md:flex">
            {bulkActions.map((action, idx) => renderActionButton(action, idx, true))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TITLE BAR ────────────────────────────────────────────────────────────

export function TitleBar({
  title,
  startItem,
  endItem,
  totalItems,
}: {
  title?: string;
  startItem?: number;
  endItem?: number;
  totalItems?: number;
}) {
  const { t, formatNumber } = useI18n();

  // Get pagination info from context to calculate range when not provided
  const { page, pageSize } = usePagination();

  // Calculate range from pagination context if totalItems is provided but range is not
  const computedStart =
    startItem ?? (totalItems !== undefined ? (page - 1) * pageSize + 1 : undefined);
  const computedEnd =
    endItem ?? (totalItems !== undefined ? Math.min(page * pageSize, totalItems) : undefined);

  const hasRange =
    computedStart !== undefined &&
    computedEnd !== undefined &&
    totalItems !== undefined &&
    totalItems > 0;
  const showInfo = hasRange || (totalItems !== undefined && totalItems > 0);

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
      {title && <h2 className="text-title-medium text-on-surface truncate font-medium">{title}</h2>}
      {title && showInfo && <div className="bg-outline-soft h-6 w-px shrink-0" />}
      {showInfo && (
        <span className="text-body-small text-on-surface-variant whitespace-nowrap">
          {hasRange
            ? t('rangeOfTotal', {
                start: formatNumber(computedStart),
                end: formatNumber(computedEnd),
                total: formatNumber(totalItems),
              })
            : totalItems !== undefined
              ? t('itemCount', { count: totalItems })
              : null}
        </span>
      )}
    </div>
  );
}

// ─── ACTIVE FILTERS BAR ────────────────────────────────────────────────────

export function ActiveFiltersBar<T>() {
  const { t } = useI18n();
  const { searchText, columnFilters, setSearch, removeFilter, clearAllFilters, hasActiveFilters } =
    useFiltering();
  const { columns } = useColumns<T>();

  if (!hasActiveFilters) return null;

  const getColumnHeader = (key: string) => {
    const col = columns.find((c) => String(c.key) === key);
    return col?.header ?? key;
  };

  return (
    <div className="bg-surface-container-low border-outline-subtle flex items-center gap-2 border-b px-3 py-2">
      <span className="text-label-small text-on-surface-variant">{t('filtersLabel')}:</span>

      {searchText && (
        <Chip
          variant="filter"
          selected
          label={`${t('searchLabel')}: "${searchText}"`}
          onDelete={() => setSearch('')}
        />
      )}

      {Object.entries(columnFilters).map(([key, value]) => (
        <Chip
          key={key}
          variant="filter"
          selected
          label={`${getColumnHeader(key)}: ${String(value)}`}
          onDelete={() => removeFilter(key)}
        />
      ))}

      <Button variant="text" size="sm" onClick={clearAllFilters} className="text-error">
        {t('clearAll')}
      </Button>
    </div>
  );
}

// ─── GROUPING PILLS BAR ─────────────────────────────────────────────────────

export interface GroupingPillsBarProps {
  /** Whether to show the bar even when no grouping is active (shows "No grouping" state) */
  showEmpty?: boolean;
}

/**
 * Displays active row groupings as removable chips/pills.
 * Shows grouping hierarchy with drag handles for reordering (future).
 */
export function GroupingPillsBar<T>({ showEmpty = false }: GroupingPillsBarProps = {}) {
  const { t } = useI18n();
  const { groupByArray, removeGroupBy, setGroupBy, isGrouped } = useGrouping();
  const { columns } = useColumns<T>();

  // Don't render if no grouping and showEmpty is false
  if (!isGrouped && !showEmpty) return null;

  const getColumnHeader = (key: string) => {
    const col = columns.find((c) => String(c.key) === key);
    return col?.header ?? key;
  };

  return (
    <div className="bg-surface-container-low border-outline-subtle flex items-center gap-2 border-b px-3 py-2">
      <div className="text-on-surface-variant flex items-center gap-1.5">
        <Icon symbol="account_tree" className="text-[16px]" />
        <span className="text-label-small font-medium">{t('groupedByLabel')}:</span>
      </div>

      {isGrouped ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {groupByArray.map((key, index) => (
            <div key={key} className="flex items-center">
              {/* Hierarchy arrow for multi-level grouping */}
              {index > 0 && (
                <Icon
                  symbol="chevron_right"
                  className="text-on-surface-variant mx-0.5 text-[16px]"
                />
              )}
              <GroupingPill
                label={getColumnHeader(key)}
                level={index + 1}
                onRemove={() => removeGroupBy(key)}
              />
            </div>
          ))}

          {/* Clear all grouping button */}
          {groupByArray.length > 1 && (
            <Button
              variant="text"
              size="sm"
              onClick={() => setGroupBy(null)}
              className="text-error"
            >
              {t('clearAll')}
            </Button>
          )}
        </div>
      ) : (
        <span className="text-label-small text-on-surface-variant italic">{t('none')}</span>
      )}
    </div>
  );
}

// ─── GROUPING PILL ──────────────────────────────────────────────────────────

interface GroupingPillProps {
  label: string;
  level: number;
  onRemove: () => void;
}

function GroupingPill({ label, level, onRemove }: GroupingPillProps) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full py-0.5 pr-1 pl-2',
        'text-label-small font-medium transition-colors',
        'bg-secondary-container text-on-secondary-container',
        'hover:bg-secondary-container',
      )}
    >
      {/* Level indicator for multi-level grouping */}
      {level > 1 && <span className="text-[10px] font-bold opacity-60">{level}</span>}
      <span>{label}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="hover:bg-secondary-container inline-flex h-4 w-4 items-center justify-center rounded-full transition-colors"
        aria-label={t('removeGroupingLabel', { label })}
      >
        <Icon symbol="close" className="text-[12px]" />
      </button>
    </span>
  );
}

// ─── FROZEN COLUMNS INDICATOR ───────────────────────────────────────────────

export interface FrozenColumnsIndicatorProps {
  /** Number of columns frozen on the left */
  frozenLeftCount: number;
  /** Number of columns frozen on the right */
  frozenRightCount: number;
  /** Callback to unfreeze all columns */
  onUnfreezeAll?: () => void;
}

/**
 * Displays a compact indicator showing the number of frozen columns.
 * Can be placed in the toolbar to inform users about column freezing state.
 */
export function FrozenColumnsIndicator({
  frozenLeftCount,
  frozenRightCount,
  onUnfreezeAll,
}: FrozenColumnsIndicatorProps) {
  const { t } = useI18n();
  const totalFrozen = frozenLeftCount + frozenRightCount;

  if (totalFrozen === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded px-2 py-0.5',
          'text-label-small font-medium',
          'bg-tertiary-container text-on-tertiary-container',
        )}
      >
        <Icon symbol="push_pin" className="-rotate-45 text-[14px]" />
        <span>
          {frozenLeftCount > 0 && t('frozenLeft', { count: frozenLeftCount })}
          {frozenLeftCount > 0 && frozenRightCount > 0 && ', '}
          {frozenRightCount > 0 && t('frozenRight', { count: frozenRightCount })}
        </span>
        {onUnfreezeAll && (
          <button
            onClick={onUnfreezeAll}
            className="hover:bg-tertiary-container ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded transition-colors"
            aria-label={t('unfreezeAll')}
          >
            <Icon symbol="close" className="text-[12px]" />
          </button>
        )}
      </span>
    </div>
  );
}
