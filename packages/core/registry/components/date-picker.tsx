'use client';

import React, { useState, useRef, useLayoutEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { type FieldSize } from '@/lib/field-size';
import { useControllableState } from '@/lib/use-controllable-state';
import { type FieldShellVariant } from '@/lib/field-shell';
import { Calendar } from './calendar';
import { DateInput } from './date-input';

// ─── M3 DOCKED DATE PICKER (HeroUI-STYLE SEGMENTS) ───────────────────────────
// Combines HeroUI's segment-based input with Material Design 3 styling
// - Each date unit (month, day, year) is individually focusable and editable
// - Calendar popover for visual date selection
// - Full keyboard navigation support

export type DatePickerProps = {
  variant?: FieldShellVariant;
  /** The selected date value */
  value?: Date;
  /** The default date value for uncontrolled usage */
  defaultValue?: Date;
  /** Callback when date changes */
  onValueChange?: (date: Date | undefined) => void;
  /** Controlled open state for the calendar popover */
  open?: boolean;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Callback when the calendar popover opens or closes */
  onOpenChange?: (open: boolean) => void;
  /** Label text for the input field */
  label?: string;
  /** Whether the date picker is disabled */
  disabled?: boolean;
  /** Whether to show error state */
  error?: boolean;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Additional class name */
  className?: string;
  /** Locale used by segmented input ordering */
  locale?: string;
  /** Optional date format pattern (e.g. dd/MM/yyyy, MM/dd/yyyy) */
  format?: string;
  /** Minimum selectable date */
  min?: Date;
  /** Maximum selectable date */
  max?: Date;
  /** Background color class for the label (outlined variant) */
  labelBg?: string;
  /** Whether to show the calendar button */
  showCalendarButton?: boolean;
  /** Shared control size */
  size?: FieldSize;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  label = 'Date',
  disabled = false,
  error = false,
  helperText,
  className,
  variant = 'outlined',
  locale,
  format,
  min,
  max,
  labelBg,
  showCalendarButton = true,
  size = 'md',
}) => {
  const [selectedValue, setSelectedValue] = useControllableState<Date | undefined>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [openState, setOpenState] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const isOpen = openState ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
    width: 320,
  });

  const updatePopoverPosition = useCallback(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    const rect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const preferredWidth = Math.max(rect.width, 320);
    const maxWidth = Math.max(240, viewportWidth - 16);
    const width = Math.min(preferredWidth, maxWidth);
    const left = Math.min(Math.max(8, rect.left), viewportWidth - width - 8);
    const popoverHeight = popoverRef.current?.offsetHeight ?? 360;
    const preferredTop = rect.bottom + 8;
    const shouldOpenUp =
      preferredTop + popoverHeight > viewportHeight - 8 && rect.top - popoverHeight > 8;
    const top = shouldOpenUp
      ? Math.max(8, rect.top - popoverHeight - 8)
      : Math.min(preferredTop, Math.max(8, viewportHeight - popoverHeight - 8));

    setPopoverPosition({
      top,
      left,
      width,
    });
  }, []);

  // Handle date selection from calendar
  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedValue(date);
      setOpenState(false);
    },
    [setOpenState, setSelectedValue],
  );

  // Calendar toggle button handler
  const handleCalendarButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setOpenState(!isOpen);
      }
    },
    [disabled, isOpen, setOpenState],
  );

  // Handle click outside to close
  useLayoutEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setOpenState(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenState(false);
      }
    };

    updatePopoverPosition();
    const rafId = window.requestAnimationFrame(updatePopoverPosition);
    window.addEventListener('resize', updatePopoverPosition);
    window.addEventListener('scroll', updatePopoverPosition, true);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePopoverPosition);
      window.removeEventListener('scroll', updatePopoverPosition, true);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setOpenState, updatePopoverPosition]);

  // Calendar button icon
  const calendarButton = showCalendarButton ? (
    <button
      type="button"
      disabled={disabled}
      onClick={handleCalendarButtonClick}
      aria-label="Open calendar"
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      aria-controls={popoverId}
      tabIndex={-1}
      className={cn(
        'rounded-icon-button -mr-1 p-1 transition-colors',
        'hover:bg-state-hover focus-visible:bg-state-focus focus-visible:outline-none',
        error ? 'text-error' : 'text-on-surface-variant',
      )}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
      </svg>
    </button>
  ) : undefined;

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      <DateInput
        value={selectedValue}
        onValueChange={setSelectedValue}
        label={label}
        disabled={disabled}
        error={error}
        helperText={helperText}
        variant={variant ?? 'outlined'}
        locale={locale}
        format={format}
        min={min}
        max={max}
        labelBg={labelBg}
        trailingIcon={calendarButton}
        size={size}
      />

      {/* Dropdown calendar */}
      {isOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={popoverRef}
              id={popoverId}
              role="dialog"
              aria-modal="true"
              aria-label="Choose date"
              className={cn(
                'animate-in fade-in zoom-in-95 duration-short ease-standard fixed z-[var(--z-popover,2000)]',
              )}
              style={{
                top: popoverPosition.top,
                left: popoverPosition.left,
                width: popoverPosition.width,
              }}
            >
              <Calendar
                className="max-w-none"
                selectedDate={selectedValue}
                onDateSelect={handleDateSelect}
                min={min}
                max={max}
              />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};

DatePicker.displayName = 'DatePicker';
