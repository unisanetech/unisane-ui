'use client';

import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { type FieldSize } from '@/lib/field-size';
import { type FieldShellVariant } from '@/lib/field-shell';
import { getPortalLayerStyle } from '@/lib/portal-layer';
import { useControllableState } from '@/lib/use-controllable-state';
import { Surface } from '@/primitives/surface';
import { Text } from '@/primitives/text';
import { IconButton } from '@/components/ui/icon-button';
import { TextField } from '@/components/ui/text-field';

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
  labelBg?: string;
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
  labelBg,
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
  const [viewYear, setViewYear] = useState(() => readYear(normalizedValue) ?? new Date().getFullYear());
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
    width: 320,
  });
  const [isPositioned, setIsPositioned] = useState(false);

  const displayValue = useMemo(() => formatMonthLabel(normalizedValue), [normalizedValue]);

  const updatePopoverPosition = useCallback(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    const rect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const width = Math.min(Math.max(rect.width, 320), Math.max(240, viewportWidth - 16));
    const left = Math.min(Math.max(8, rect.left), viewportWidth - width - 8);
    const popoverHeight = popoverRef.current?.offsetHeight ?? 280;
    const preferredTop = rect.bottom + 8;
    const shouldOpenUp =
      preferredTop + popoverHeight > viewportHeight - 8 && rect.top - popoverHeight > 8;
    const top = shouldOpenUp
      ? Math.max(8, rect.top - popoverHeight - 8)
      : Math.min(preferredTop, Math.max(8, viewportHeight - popoverHeight - 8));

    setPopoverPosition({ top, left, width });
  }, []);

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
      setOpenState(false);
    },
    [normalizedMax, normalizedMin, setOpenState, setSelectedValue, viewYear],
  );

  useLayoutEffect(() => {
    if (!isOpen) {
      setIsPositioned(false);
      return;
    }

    const updatePosition = () => {
      updatePopoverPosition();
      setIsPositioned(true);
    };
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setOpenState(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenState(false);
    };

    setIsPositioned(false);
    updatePosition();
    const rafId = window.requestAnimationFrame(updatePosition);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setOpenState, updatePopoverPosition]);

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
        readOnly
        disabled={disabled}
        error={error}
        helperText={helperText}
        label={label}
        labelBg={labelBg}
        size={size}
        trailingIcon={pickerButton}
        value={displayValue}
        variant={variant}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
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
              aria-modal="true"
              aria-label="Choose month"
              className="fixed z-[var(--z-popover,2000)] transition-none"
              style={{
                top: popoverPosition.top,
                left: popoverPosition.left,
                width: popoverPosition.width,
                visibility: isPositioned ? 'visible' : 'hidden',
                ...getPortalLayerStyle(containerRef.current),
              }}
            >
              <Surface tone="surface" elevation={1} className="rounded-sm overflow-hidden">
                <div className="border-outline-subtle flex items-center justify-between border-b p-3">
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
                <div className="grid grid-cols-3 gap-2 p-3" role="grid" aria-label={`Months in ${viewYear}`}>
                  {MONTHS.map((month, monthIndex) => {
                    const optionValue = `${viewYear}-${String(monthIndex + 1).padStart(2, '0')}`;
                    const selected = normalizedValue === optionValue;
                    const disabledMonth = isMonthDisabled(optionValue, normalizedMin, normalizedMax);

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
                          'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none',
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
