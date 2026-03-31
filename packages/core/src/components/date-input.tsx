'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { cn } from '../lib/utils';
import { getFieldSizeStyles, type FieldSize } from '../lib/field-size';
import { useControllableState } from '../lib/use-controllable-state';
import {
  fieldContainerVariants,
  getFieldAffixClasses,
  getFieldHelperTextClasses,
  getFieldLabelClasses,
  type FieldShellVariant,
} from '../lib/field-shell';
import { useFieldState } from '../lib/use-field-state';

// ─── SEGMENT-BASED DATE INPUT ────────────────────────────────────────────────
// HeroUI-style segment-based date input with M3 styling
// Each date unit (month, day, year) is an individually focusable and editable segment

type DateSegment = 'month' | 'day' | 'year';

interface DateSegmentValue {
  month: number | null;
  day: number | null;
  year: number | null;
}

export type DateInputProps = {
  variant?: FieldShellVariant;
  /** The selected date value */
  value?: Date;
  /** The default date value for uncontrolled usage */
  defaultValue?: Date;
  /** Callback when date changes */
  onValueChange?: (date: Date | undefined) => void;
  /** Label text for the input field */
  label?: string;
  /** Whether the date input is disabled */
  disabled?: boolean;
  /** Whether to show error state */
  error?: boolean;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Additional class name */
  className?: string;
  /** Locale used to resolve segment order when format is not provided */
  locale?: string;
  /** Optional date format pattern (e.g. dd/MM/yyyy, MM/dd/yyyy) */
  format?: string;
  /** Minimum selectable date */
  min?: Date;
  /** Maximum selectable date */
  max?: Date;
  /** Background color class for the label (outlined variant) */
  labelBg?: string;
  /** Trailing icon/element */
  trailingIcon?: React.ReactNode;
  /** Called when a segment receives focus */
  onFocus?: () => void;
  /** Called when all segments lose focus */
  onBlur?: () => void;
  /** Custom ID for the input */
  id?: string;
  /** Shared control size */
  size?: FieldSize;
};

// Get max days for a given month/year
const getMaxDays = (month: number | null, year: number | null): number => {
  if (month === null) return 31;
  const y = year ?? 2024; // Use leap year as default
  return new Date(y, month, 0).getDate();
};

const DEFAULT_SEGMENT_ORDER: DateSegment[] = ['month', 'day', 'year'];

function resolveFormatSegmentOrder(format?: string): DateSegment[] | null {
  const pattern = format?.trim();
  if (!pattern) return null;

  const monthIndex = pattern.indexOf('M');
  const dayIndex = pattern.toLowerCase().indexOf('d');
  const yearIndex = pattern.toLowerCase().indexOf('y');
  if (monthIndex < 0 || dayIndex < 0 || yearIndex < 0) return null;

  const indexed: Array<{ segment: DateSegment; index: number }> = [
    { segment: 'month', index: monthIndex },
    { segment: 'day', index: dayIndex },
    { segment: 'year', index: yearIndex },
  ];

  indexed.sort((a, b) => a.index - b.index);
  return indexed.map((entry) => entry.segment);
}

function resolveLocaleSegmentOrder(locale?: string): DateSegment[] {
  try {
    const parts = new Intl.DateTimeFormat(locale || 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date(2006, 10, 22));
    const order = parts
      .filter((part) => part.type === 'day' || part.type === 'month' || part.type === 'year')
      .map((part) => part.type as DateSegment);
    if (order.length === 3) return order;
  } catch {
    // fallback to default
  }
  return DEFAULT_SEGMENT_ORDER;
}

function resolveSegmentOrder(locale?: string, format?: string): DateSegment[] {
  return resolveFormatSegmentOrder(format) ?? resolveLocaleSegmentOrder(locale);
}

function resolveSegmentSeparator(locale?: string, format?: string): string {
  const pattern = format?.trim();
  if (pattern) {
    const match = pattern.match(/[^dMy]+/);
    if (match?.[0]) return match[0];
  }

  try {
    const parts = new Intl.DateTimeFormat(locale || 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date(2006, 10, 22));
    const literal = parts.find((part) => part.type === 'literal')?.value?.trim();
    if (literal) return literal;
  } catch {
    // fallback to slash
  }
  return '/';
}

function resolveSegmentPlaceholder(segment: DateSegment): string {
  if (segment === 'month') return 'MM';
  if (segment === 'day') return 'DD';
  return 'YYYY';
}

// Segment component
interface SegmentProps {
  type: DateSegment;
  value: number | null;
  onChange: (value: number | null) => void;
  onNext: () => void;
  onPrev: () => void;
  disabled?: boolean;
  placeholder: string;
  min?: number;
  max?: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isFocused: boolean;
  onFocusChange: (focused: boolean) => void;
  id?: string;
  describedBy?: string;
  size: FieldSize;
}

const Segment: React.FC<SegmentProps> = ({
  type,
  value,
  onChange,
  onNext,
  onPrev,
  disabled,
  placeholder,
  min = 1,
  max,
  inputRef,
  isFocused,
  onFocusChange,
  id,
  describedBy,
  size,
}) => {
  const fieldSize = getFieldSizeStyles(size);
  const [enteredDigits, setEnteredDigits] = useState('');
  const maxValue = max ?? (type === 'month' ? 12 : type === 'day' ? 31 : 9999);
  const minValue = min;
  const digitCount = type === 'year' ? 4 : 2;

  // Format display value
  const getDisplayValue = () => {
    if (isFocused && enteredDigits) {
      // Show what user is typing without padding (like HeroUI)
      return enteredDigits;
    }
    if (value !== null) {
      return value.toString().padStart(digitCount, '0');
    }
    return placeholder;
  };

  // Reset entered digits when focus changes
  useEffect(() => {
    if (!isFocused) {
      setEnteredDigits('');
    }
  }, [isFocused]);

  const commitValue = (digits: string) => {
    if (!digits) {
      onChange(null);
      return;
    }
    const numVal = parseInt(digits, 10);
    const clampedVal = Math.max(minValue, Math.min(maxValue, numVal));
    onChange(clampedVal);
    setEnteredDigits('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setEnteredDigits('');
        if (value === null) {
          onChange(minValue);
        } else {
          onChange(value >= maxValue ? minValue : value + 1);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        setEnteredDigits('');
        if (value === null) {
          onChange(maxValue);
        } else {
          onChange(value <= minValue ? maxValue : value - 1);
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (enteredDigits) {
          commitValue(enteredDigits);
        }
        onPrev();
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (enteredDigits) {
          commitValue(enteredDigits);
        }
        onNext();
        break;

      case 'Tab':
        // Commit any entered digits before tabbing
        if (enteredDigits) {
          commitValue(enteredDigits);
        }
        // Let default tab behavior work
        break;

      case 'Backspace':
        e.preventDefault();
        if (enteredDigits) {
          // Remove last entered digit while typing
          setEnteredDigits(enteredDigits.slice(0, -1));
        } else if (value !== null) {
          // Convert current value to string and remove last digit
          const strVal = value.toString();
          if (strVal.length > 1) {
            // Remove last digit (e.g., 2026 -> 202)
            const newVal = parseInt(strVal.slice(0, -1), 10);
            onChange(newVal);
            // Put remaining digits into enteredDigits so user can continue editing
            setEnteredDigits(strVal.slice(0, -1));
          } else {
            // Only one digit left, clear it
            onChange(null);
          }
        } else {
          // Already empty, move to previous segment
          onPrev();
        }
        break;

      case 'Delete':
        e.preventDefault();
        onChange(null);
        setEnteredDigits('');
        break;

      default:
        // Handle numeric input
        if (/^[0-9]$/.test(e.key)) {
          e.preventDefault();

          // Start fresh or append
          const newDigits = enteredDigits + e.key;

          // Check if we've completed entering all digits
          if (newDigits.length >= digitCount) {
            commitValue(newDigits);
            onNext();
          } else {
            // Check if we should auto-advance (e.g., typing "5" for month)
            const numVal = parseInt(newDigits, 10);
            const multiplier = Math.pow(10, digitCount - newDigits.length);
            const minPossibleFinal = numVal * multiplier;

            if (minPossibleFinal > maxValue) {
              // Can't possibly make a valid number, commit now
              commitValue(newDigits);
              onNext();
            } else {
              // Keep building
              setEnteredDigits(newDigits);
            }
          }
        }
    }
  };

  const handleFocus = () => {
    onFocusChange(true);
    setEnteredDigits('');
  };

  const handleBlur = () => {
    // Commit any entered digits
    if (enteredDigits) {
      commitValue(enteredDigits);
    }
    onFocusChange(false);
  };

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="numeric"
      role="spinbutton"
      value={getDisplayValue()}
      onChange={() => {}} // Controlled by keydown
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      className={cn(
        'border-none bg-transparent text-center caret-transparent outline-none select-none focus:ring-0',
        'text-on-surface font-medium tabular-nums',
        fieldSize.segmentText,
        type === 'year' ? fieldSize.segmentYearWidth : fieldSize.segmentWidth,
        value === null && !enteredDigits && 'text-on-surface-variant',
        isFocused && 'bg-state-selected rounded-xs',
      )}
      aria-label={type}
      aria-valuenow={value ?? undefined}
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      aria-describedby={describedBy}
      readOnly={disabled}
    />
  );
};

export const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
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
      trailingIcon,
      onFocus,
      onBlur,
      id,
      size = 'md',
    },
    ref,
  ) => {
    const [currentValue, setCurrentValue] = useControllableState<Date | undefined>({
      value,
      defaultValue,
      onChange: onValueChange,
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const dayRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);
    const fieldSize = getFieldSizeStyles(size);
    const segmentOrder = useMemo(() => resolveSegmentOrder(locale, format), [locale, format]);
    const segmentSeparator = useMemo(
      () => resolveSegmentSeparator(locale, format),
      [locale, format],
    );

    const [focusedSegment, setFocusedSegment] = useState<DateSegment | null>(null);
    const [segments, setSegments] = useState<DateSegmentValue>(() => ({
      month: currentValue ? currentValue.getMonth() + 1 : null,
      day: currentValue ? currentValue.getDate() : null,
      year: currentValue ? currentValue.getFullYear() : null,
    }));
    const { fieldId: inputId, helperId, isFloating } = useFieldState({
      id,
      idPrefix: 'dateinput',
      helperText,
      active: focusedSegment !== null,
      forceFloating: true,
    });

    // Sync with external value
    useEffect(() => {
      if (currentValue) {
        setSegments({
          month: currentValue.getMonth() + 1,
          day: currentValue.getDate(),
          year: currentValue.getFullYear(),
        });
      } else {
        setSegments({ month: null, day: null, year: null });
      }
    }, [currentValue]);

    // Handle focus/blur callbacks
    useEffect(() => {
      if (focusedSegment !== null) {
        onFocus?.();
      }
    }, [focusedSegment, onFocus]);

    const handleContainerBlur = useCallback(
      (e: React.FocusEvent) => {
        // Check if focus is moving outside the container
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setFocusedSegment(null);
          onBlur?.();

          // Validate and emit date on blur
          if (segments.month !== null && segments.day !== null && segments.year !== null) {
            const date = new Date(segments.year, segments.month - 1, segments.day);
            // Validate the date is real (handles invalid dates like Feb 30)
            if (
              date.getFullYear() === segments.year &&
              date.getMonth() === segments.month - 1 &&
              date.getDate() === segments.day
            ) {
              // Check min/max constraints
              if (min && date < min) {
                setCurrentValue(undefined);
                return;
              }
              if (max && date > max) {
                setCurrentValue(undefined);
                return;
              }
              setCurrentValue(date);
            }
          } else if (segments.month === null && segments.day === null && segments.year === null) {
            setCurrentValue(undefined);
          }
        }
      },
      [segments, onBlur, min, max, setCurrentValue],
    );

    const updateSegment = useCallback((segment: DateSegment, newValue: number | null) => {
      setSegments((prev) => {
        const updated = { ...prev, [segment]: newValue };

        // Auto-correct day if it exceeds month's max days
        if (segment === 'month' || segment === 'year') {
          const maxDays = getMaxDays(updated.month, updated.year);
          if (updated.day !== null && updated.day > maxDays) {
            updated.day = maxDays;
          }
        }

        return updated;
      });
    }, []);

    const getSegmentRef = useCallback(
      (segment: DateSegment) => {
        if (segment === 'month') return monthRef;
        if (segment === 'day') return dayRef;
        return yearRef;
      },
      [monthRef, dayRef, yearRef],
    );

    const focusSegment = useCallback(
      (segment: DateSegment) => {
        getSegmentRef(segment).current?.focus();
      },
      [getSegmentRef],
    );

    const handleContainerClick = () => {
      if (!disabled && focusedSegment === null) {
        focusSegment(segmentOrder[0] ?? 'month');
      }
    };

    // Combine refs
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    return (
      <div className={cn('relative w-full', className)} ref={setRefs}>
        <div className="relative inline-flex w-full flex-col">
          <div
            className={cn(
              fieldContainerVariants({ variant, error, disabled }),
              fieldSize.containerHeight,
              'items-center',
            )}
            onClick={handleContainerClick}
            onBlur={handleContainerBlur}
          >
            <div
              className={cn(
                'relative flex h-full min-w-0 flex-1 items-center gap-0.5',
                fieldSize.horizontalPadding,
              )}
            >
              {segmentOrder.map((segment, index) => {
                const previousSegment = segmentOrder[index - 1];
                const nextSegment = segmentOrder[index + 1];
                const maxValue =
                  segment === 'month'
                    ? 12
                    : segment === 'day'
                      ? getMaxDays(segments.month, segments.year)
                      : 9999;

                return (
                  <React.Fragment key={segment}>
                    <Segment
                      type={segment}
                      value={segments[segment]}
                      onChange={(v) => updateSegment(segment, v)}
                      onNext={() => {
                        if (nextSegment) focusSegment(nextSegment);
                      }}
                      onPrev={() => {
                        if (previousSegment) focusSegment(previousSegment);
                      }}
                      disabled={disabled}
                      placeholder={resolveSegmentPlaceholder(segment)}
                      min={1}
                      max={maxValue}
                      inputRef={getSegmentRef(segment)}
                      isFocused={focusedSegment === segment}
                      onFocusChange={(f) => setFocusedSegment(f ? segment : null)}
                      size={size}
                      {...(index === 0 ? { id: inputId } : {})}
                      {...(index === 0 && helperText ? { describedBy: helperId } : {})}
                    />
                    {index < segmentOrder.length - 1 ? (
                      <span className={cn('text-on-surface-variant', fieldSize.segmentText)}>
                        {segmentSeparator}
                      </span>
                    ) : null}
                  </React.Fragment>
                );
              })}

              {/* Floating label */}
              <label
                htmlFor={inputId}
                className={getFieldLabelClasses({
                  size,
                  variant,
                  floating: isFloating,
                  error,
                  active: focusedSegment !== null,
                  labelBg,
                })}
              >
                {label}
              </label>
            </div>

            {/* Trailing icon */}
            {trailingIcon && (
              <span
                className={getFieldAffixClasses({
                  size,
                  error,
                  active: focusedSegment !== null,
                  side: 'trailing',
                })}
              >
                <div className={cn(fieldSize.iconSize, 'flex items-center justify-center')}>
                  {trailingIcon}
                </div>
              </span>
            )}
          </div>

          {/* Helper text */}
          {helperText && (
            <span
              id={helperId}
              className={getFieldHelperTextClasses(size, error)}
            >
              {helperText}
            </span>
          )}
        </div>
      </div>
    );
  },
);

DateInput.displayName = 'DateInput';
