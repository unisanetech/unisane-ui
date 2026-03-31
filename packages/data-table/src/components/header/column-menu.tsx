'use client';

import React, { useState, useCallback, useId } from 'react';
import {
  cn,
  Icon,
  Button,
  IconButton,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@unisane/ui';
import type { Column, PinPosition, FilterValue } from '../../types';
import { useI18n } from '../../i18n';

export interface ColumnMenuProps<T> {
  column: Column<T>;
  pinPosition: PinPosition;
  pinnable: boolean;
  currentFilter?: FilterValue;
  hasActiveFilter: boolean;
  onPin: (position: PinPosition) => void;
  onHide: () => void;
  onFilter?: (value: FilterValue) => void;
  /** Whether grouping is enabled for the table */
  groupingEnabled?: boolean;
  /** Current column(s) being grouped by */
  groupBy?: string | string[] | null;
  /** Normalized array of groupBy keys */
  groupByArray?: string[];
  /** Callback to set groupBy column(s) */
  onGroupBy?: (key: string | string[] | null) => void;
  /** Callback to add a column to multi-level grouping */
  onAddGroupBy?: (key: string) => void;
}

export function ColumnMenu<T>({
  column,
  pinPosition,
  pinnable,
  currentFilter,
  hasActiveFilter,
  onPin,
  onHide,
  onFilter,
  groupingEnabled = false,
  groupByArray = [],
  onGroupBy,
  onAddGroupBy,
}: ColumnMenuProps<T>) {
  const { t } = useI18n();
  const [filterInputValue, setFilterInputValue] = useState(
    typeof currentFilter === 'string' ? currentFilter : '',
  );

  const hasFilterOptions = column.filterable !== false;

  // Handle text filter submission
  const handleFilterSubmit = useCallback(() => {
    if (filterInputValue.trim()) {
      onFilter?.(filterInputValue.trim());
    }
  }, [filterInputValue, onFilter]);

  // Handle clearing the filter
  const handleFilterClear = useCallback(() => {
    setFilterInputValue('');
    onFilter?.(null);
  }, [onFilter]);

  return (
    <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            variant="standard"
            size="sm"
            aria-label={t('actions')}
            className={cn(
              'text-on-surface-variant',
              'hover:bg-state-hover hover:text-on-surface transition-colors',
            )}
          >
            <Icon symbol="more_vert" className="text-[18px]" />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" portal className="min-w-48">
          {/* Filter options */}
          {hasFilterOptions && (
            <>
              {column.filterType === 'select' && column.filterOptions ? (
                <SelectFilter
                  column={column}
                  currentFilter={currentFilter}
                  hasActiveFilter={hasActiveFilter}
                  onFilter={onFilter}
                />
              ) : (
                <TextFilter
                  column={column}
                  filterInputValue={filterInputValue}
                  hasActiveFilter={hasActiveFilter}
                  onInputChange={setFilterInputValue}
                  onSubmit={handleFilterSubmit}
                  onClear={handleFilterClear}
                />
              )}
              {((pinnable && column.pinnable !== false) || column.hideable !== false) && (
                <DropdownMenuSeparator />
              )}
            </>
          )}

          {/* Pin options */}
          {pinnable && column.pinnable !== false && (
            <>
              <DropdownMenuItem
                onClick={() => onPin(pinPosition === 'left' ? null : 'left')}
                icon={<Icon symbol="push_pin" className="h-4 w-4 -rotate-45" />}
              >
                {pinPosition === 'left' ? t('unpinLeft') : t('pinLeft')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onPin(pinPosition === 'right' ? null : 'right')}
                icon={<Icon symbol="push_pin" className="h-4 w-4 rotate-45" />}
              >
                {pinPosition === 'right' ? t('unpinRight') : t('pinRight')}
              </DropdownMenuItem>
              {(column.hideable !== false || groupingEnabled) && <DropdownMenuSeparator />}
            </>
          )}

          {/* Group by this column */}
          {/* Only show grouping for columns that are explicitly groupable OR have select filter (categorical data) */}
          {groupingEnabled &&
            (column.groupable === true ||
              (column.groupable !== false && column.filterType === 'select')) && (
              <>
                {(() => {
                  const columnKey = String(column.key);
                  const isColumnGrouped = groupByArray.includes(columnKey);
                  const hasExistingGrouping = groupByArray.length > 0;

                  return (
                    <>
                      {/* Primary grouping action */}
                      <DropdownMenuItem
                        onClick={() => {
                          if (isColumnGrouped) {
                            // Remove this column from grouping
                            if (groupByArray.length === 1) {
                              onGroupBy?.(null);
                            } else {
                              const newGroupBy = groupByArray.filter((k) => k !== columnKey);
                              onGroupBy?.(newGroupBy.length === 1 ? newGroupBy[0]! : newGroupBy);
                            }
                          } else {
                            // Set as the only grouping column
                            onGroupBy?.(columnKey);
                          }
                        }}
                        icon={<Icon symbol="workspaces" className="h-4 w-4" />}
                      >
                        {isColumnGrouped ? t('removeGrouping') : t('groupByColumn')}
                      </DropdownMenuItem>

                      {/* Add to multi-level grouping (only show if there's existing grouping and this column isn't grouped) */}
                      {hasExistingGrouping && !isColumnGrouped && onAddGroupBy && (
                        <DropdownMenuItem
                          onClick={() => onAddGroupBy(columnKey)}
                          icon={<Icon symbol="add" className="h-4 w-4" />}
                        >
                          {t('addToGrouping', { level: groupByArray.length + 1 })}
                        </DropdownMenuItem>
                      )}
                    </>
                  );
                })()}
                {column.hideable !== false && <DropdownMenuSeparator />}
              </>
            )}

          {/* Hide column */}
          {column.hideable !== false && (
            <DropdownMenuItem
              onClick={onHide}
              icon={<Icon symbol="visibility_off" className="h-4 w-4" />}
            >
              {t('hideColumn')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ─── SELECT FILTER ───────────────────────────────────────────────────────────

interface SelectFilterProps<T> {
  column: Column<T>;
  currentFilter?: FilterValue;
  hasActiveFilter: boolean;
  onFilter?: (value: FilterValue) => void;
}

function SelectFilter<T>({
  column,
  currentFilter,
  hasActiveFilter,
  onFilter,
}: SelectFilterProps<T>) {
  const { t } = useI18n();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger icon={<Icon symbol="filter_alt" className="h-4 w-4" />}>
        {t('filterBy', { column: String(column.header) })}
        {hasActiveFilter && (
          <span className="text-primary ml-auto text-xs">{t('filterActive')}</span>
        )}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="min-w-40">
        {column.filterOptions?.map((opt) => (
          <DropdownMenuItem
            key={String(opt.value)}
            onClick={() => onFilter?.(opt.value)}
            className={
              currentFilter === opt.value ? 'bg-primary-container text-on-primary-container' : ''
            }
          >
            <span className="flex w-full items-center gap-2">
              {currentFilter === opt.value && <Icon symbol="check" className="h-4 w-4" />}
              <span className={currentFilter !== opt.value ? 'ml-6' : ''}>{opt.label}</span>
              {opt.count !== undefined && (
                <span className="text-on-surface-variant ml-auto text-xs">{opt.count}</span>
              )}
            </span>
          </DropdownMenuItem>
        ))}
        {hasActiveFilter && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onFilter?.(null)}
              icon={<Icon symbol="close" className="h-4 w-4" />}
            >
              {t('clearFilter')}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

// ─── TEXT FILTER ─────────────────────────────────────────────────────────────

interface TextFilterProps<T> {
  column: Column<T>;
  filterInputValue: string;
  hasActiveFilter: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

function TextFilter<T>({
  column,
  filterInputValue,
  hasActiveFilter,
  onInputChange,
  onSubmit,
  onClear,
}: TextFilterProps<T>) {
  const { t } = useI18n();
  const inputId = useId();
  const descriptionId = `${inputId}-desc`;

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger icon={<Icon symbol="filter_alt" className="h-4 w-4" />}>
        {t('filterBy', { column: String(column.header) })}
        {hasActiveFilter && (
          <span className="text-primary ml-auto text-xs">{t('filterActive')}</span>
        )}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="min-w-56 p-2">
        <div
          className="flex flex-col gap-2"
          role="search"
          aria-label={t('filterBy', { column: String(column.header) })}
        >
          {/* Hidden description for screen readers */}
          <span id={descriptionId} className="sr-only">
            {t('searchColumn', { column: String(column.header) })}
          </span>
          <input
            id={inputId}
            type="text"
            value={filterInputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSubmit();
              } else if (e.key === 'Escape') {
                // Let Escape propagate to close the dropdown menu
                return;
              }
              // Stop propagation for other keys to prevent dropdown interference
              e.stopPropagation();
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            placeholder={t('searchColumn', { column: String(column.header) })}
            aria-describedby={descriptionId}
            aria-label={t('filterBy', { column: String(column.header) })}
            className={cn(
              'text-body-medium w-full px-3 py-2',
              'bg-surface border-outline-variant rounded-sm border',
              'focus:border-primary focus:ring-focus-ring focus:ring-1 focus:outline-none',
              'placeholder:text-on-surface-variant',
            )}
            autoFocus
          />
          <div className="flex gap-1">
            <Button
              type="button"
              variant="filled"
              size="sm"
              onClick={onSubmit}
              disabled={!filterInputValue.trim()}
              className="flex-1"
            >
              {t('apply')}
            </Button>
            {hasActiveFilter && (
              <Button
                type="button"
                variant="tonal"
                size="sm"
                onClick={onClear}
              >
                {t('clear')}
              </Button>
            )}
          </div>
        </div>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
