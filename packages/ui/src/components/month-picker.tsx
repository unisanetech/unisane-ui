'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';
import { type FieldSize } from '../lib/field-size';
import { type FieldShellVariant } from '../lib/field-shell';
import { getPortalLayerStyle } from '../lib/portal-layer';
import { useAnchoredOverlayPosition } from '../lib/use-anchored-overlay-position';
import { useControllableState } from '../lib/use-controllable-state';
import { useOverlayBehavior } from '../lib/use-overlay-behavior';
import { Surface } from '../primitives/surface';
import { Text } from '../primitives/text';
import { IconButton } from './icon-button';
import { TextField } from './text-field';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export type MonthPickerProps = {
  variant?: FieldShellVariant;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  className?: string;
  min?: string;
  max?: string;
  size?: FieldSize;
};

export const MonthPicker: React.FC<MonthPickerProps> = ({
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  label = 'Month',
  disabled = false,
  error = false,
  helperText,
  className,
  variant = 'outlined',
  min,
  max,
  size = 'md',
}) => {
  const [selectedValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue: normalizeMonthValue(defaultValue) ?? '',
    onChange: onValueChange,
  });
  const [openState, setOpenState] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const normalizedValue = normalizeMonthValue(selectedValue) ?? '';
  const normalizedMin = normalizeMonthValue(min);
  const normalizedMax = normalizeMonthValue(max);
  const isOpen = openState ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [viewYear, setViewYear] = useState(
    () => readYear(normalizedValue) ?? new Date().getFullYear(),
  );
  const [inputValue, setInputValue] = useState(() => formatMonthLabel(normalizedValue));
  const inputFocusedRef = useRef(false);
  const popoverPosition = useAnchoredOverlayPosition({
    open: isOpen,
    anchorRef: containerRef,
    contentRef: popoverRef,
    portal: true,
    minimumWidth: 320,
    estimatedHeight: 280,
  });

  const displayValue = useMemo(() => formatMonthLabel(normalizedValue), [normalizedValue]);

  useEffect(() => {
    if (!inputFocusedRef.current) setInputValue(displayValue);
  }, [displayValue]);

  const openPicker = useCallback(() => {
    if (disabled) return;
    setViewYear(readYear(normalizedValue) ?? new Date().getFullYear());
    setOpenState(true);
  }, [disabled, normalizedValue, setOpenState]);

  const selectMonth = useCallback(
    (monthIndex: number) => {
      const nextValue = `${viewYear}-${String(monthIndex + 1).padStart(2, '0')}`;
      if (isMonthDisabled(nextValue, normalizedMin, normalizedMax)) return;
      setSelectedValue(nextValue);
      setInputValue(formatMonthLabel(nextValue));
      setOpenState(false);
    },
    [normalizedMax, normalizedMin, setOpenState, setSelectedValue, viewYear],
  );

  const commitInputValue = useCallback(() => {
    const nextValue = parseMonthInput(inputValue);
    inputFocusedRef.current = false;

    if (!inputValue.trim()) {
      setSelectedValue('');
      setInputValue('');
      setOpenState(false);
      return;
    }

    if (!nextValue || isMonthDisabled(nextValue, normalizedMin, normalizedMax)) {
      setInputValue(displayValue);
      return;
    }

    setSelectedValue(nextValue);
    setViewYear(readYear(nextValue) ?? viewYear);
    setInputValue(formatMonthLabel(nextValue));
    setOpenState(false);
  }, [
    displayValue,
    inputValue,
    normalizedMax,
    normalizedMin,
    setOpenState,
    setSelectedValue,
    viewYear,
  ]);
  const scheduleInputCommit = useCallback(() => {
    window.setTimeout(() => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (containerRef.current?.contains(activeElement) ||
          popoverRef.current?.contains(activeElement))
      ) {
        return;
      }
      commitInputValue();
    }, 0);
  }, [commitInputValue]);

  useOverlayBehavior({
    open: isOpen,
    contentRef: popoverRef,
    rootRef: containerRef,
    onDismiss: () => setOpenState(false),
    modal: false,
    dismissOnEscape: true,
    dismissOnInteractOutside: true,
    initialFocus: true,
    restoreFocus: true,
  });

  const pickerButton = (
    <button
      type="button"
      disabled={disabled}
      aria-label="Open month picker"
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      tabIndex={-1}
      className={cn(
        'rounded-icon-button -mr-1 p-1 transition-colors',
        'hover:bg-state-hover focus-visible:bg-state-focus focus-visible:outline-none',
        error ? 'text-error' : 'text-on-surface-variant',
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isOpen) {
          setOpenState(false);
        } else {
          openPicker();
        }
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
      </svg>
    </button>
  );

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      <TextField
        disabled={disabled}
        {...(error ? { errorMessage: helperText } : { description: helperText })}
        invalid={error}
        label={label}
        size={size}
        trailingIcon={pickerButton}
        value={inputValue}
        variant={variant}
        onClick={openPicker}
        onBlur={scheduleInputCommit}
        onValueChange={setInputValue}
        onFocus={() => {
          inputFocusedRef.current = true;
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commitInputValue();
            return;
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            openPicker();
          }
        }}
      />

      {isOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={popoverRef}
              role="dialog"
              aria-label="Choose month"
              tabIndex={-1}
              className="fixed z-[var(--z-popover,2000)] transition-none"
              style={{
                top: popoverPosition.top,
                left: popoverPosition.left,
                width: popoverPosition.width,
                visibility: popoverPosition.positioned ? 'visible' : 'hidden',
                ...getPortalLayerStyle(containerRef.current),
              }}
            >
              <Surface tone="surface" elevation={1} className="overflow-hidden rounded-sm">
                <div className="border-outline-weak flex items-center justify-between border-b p-3">
                  <IconButton
                    aria-label="Previous year"
                    icon={<span className="material-symbols-outlined">chevron_left</span>}
                    onClick={() => setViewYear((year) => year - 1)}
                  />
                  <Text as="span" variant="titleMedium" aria-live="polite">
                    {viewYear}
                  </Text>
                  <IconButton
                    aria-label="Next year"
                    icon={<span className="material-symbols-outlined">chevron_right</span>}
                    onClick={() => setViewYear((year) => year + 1)}
                  />
                </div>
                <div
                  className="grid grid-cols-3 gap-2 p-3"
                  role="grid"
                  aria-label={`Months in ${viewYear}`}
                >
                  {MONTHS.map((month, monthIndex) => {
                    const optionValue = `${viewYear}-${String(monthIndex + 1).padStart(2, '0')}`;
                    const selected = normalizedValue === optionValue;
                    const disabledMonth = isMonthDisabled(
                      optionValue,
                      normalizedMin,
                      normalizedMax,
                    );

                    return (
                      <button
                        key={month}
                        type="button"
                        disabled={disabledMonth}
                        role="gridcell"
                        aria-selected={selected}
                        aria-label={`${month} ${viewYear}`}
                        className={cn(
                          'text-label-large relative min-h-10 overflow-hidden rounded-sm px-2 transition-colors',
                          'focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:outline-none',
                          selected
                            ? 'bg-primary text-on-primary'
                            : 'text-on-surface hover:bg-state-hover',
                          disabledMonth && 'pointer-events-none cursor-not-allowed opacity-38',
                        )}
                        onClick={() => selectMonth(monthIndex)}
                      >
                        {month.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </Surface>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};

MonthPicker.displayName = 'MonthPicker';

function normalizeMonthValue(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed || !/^\d{4}-\d{2}$/.test(trimmed)) return undefined;
  const month = Number(trimmed.slice(5));
  if (month < 1 || month > 12) return undefined;
  return trimmed;
}

function readYear(value: string) {
  const normalized = normalizeMonthValue(value);
  return normalized ? Number(normalized.slice(0, 4)) : null;
}

function parseMonthInput(value: string): string | undefined {
  const normalized = normalizeMonthValue(value);
  if (normalized) return normalized;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const numeric = /^(0?[1-9]|1[0-2])[/\-\s]+(\d{4})$/.exec(trimmed);
  if (numeric?.[1] && numeric[2]) {
    return `${numeric[2]}-${numeric[1].padStart(2, '0')}`;
  }

  const named = /^([a-zA-Z]+)\s+(\d{4})$/.exec(trimmed);
  if (!named?.[1] || !named[2]) return undefined;

  const monthIndex = MONTHS.findIndex((month) =>
    month.toLowerCase().startsWith(named[1]!.toLowerCase()),
  );
  if (monthIndex < 0) return undefined;
  return `${named[2]}-${String(monthIndex + 1).padStart(2, '0')}`;
}

function formatMonthLabel(value: string) {
  const normalized = normalizeMonthValue(value);
  if (!normalized) return '';
  const year = Number(normalized.slice(0, 4));
  const month = Number(normalized.slice(5, 7));
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  );
}

function isMonthDisabled(value: string, min?: string, max?: string) {
  if (min && value < min) return true;
  if (max && value > max) return true;
  return false;
}
