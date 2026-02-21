'use client';

import React, { useState, useRef, useEffect, useId, useCallback, useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ─── SEGMENT-BASED DATE INPUT ────────────────────────────────────────────────
// HeroUI-style segment-based date input with M3 styling
// Each date unit (month, day, year) is an individually focusable and editable segment

const dateInputVariants = cva('relative w-full', {
  variants: {
    variant: {
      outlined: '',
      filled: '',
    },
  },
  defaultVariants: {
    variant: 'outlined',
  },
});

const inputContainerVariants = cva(
  'relative flex w-full transition-all duration-snappy ease-emphasized group cursor-text',
  {
    variants: {
      variant: {
        outlined:
          'rounded-sm border border-outline-variant bg-surface hover:border-outline focus-within:border-primary! focus-within:ring-1 focus-within:ring-primary/20',
        filled:
          'rounded-t-sm rounded-b-none border-b border-outline-variant bg-surface-container-low hover:bg-surface-container focus-within:bg-surface',
      },
      error: {
        true: 'border-error focus-within:border-error hover:border-error ring-error/20',
      },
      disabled: {
        true: 'opacity-38 cursor-not-allowed pointer-events-none',
      },
    },
    defaultVariants: {
      variant: 'outlined',
      error: false,
    },
  },
);

type DateSegment = 'month' | 'day' | 'year';

interface DateSegmentValue {
  month: number | null;
  day: number | null;
  year: number | null;
}

export type DateInputProps = VariantProps<typeof dateInputVariants> & {
  /** The selected date value */
  value?: Date;
  /** Callback when date changes */
  onChange?: (date: Date | undefined) => void;
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
}) => {
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
        'text-on-surface text-body-large font-medium tabular-nums',
        type === 'year' ? 'w-12' : 'w-7',
        value === null && !enteredDigits && 'text-on-surface-variant',
        isFocused && 'bg-primary/10 rounded-xs',
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
      onChange,
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
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || `dateinput-${generatedId}`;
    const helperId = `${inputId}-helper`;
    const containerRef = useRef<HTMLDivElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const dayRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);
    const segmentOrder = useMemo(() => resolveSegmentOrder(locale, format), [locale, format]);
    const segmentSeparator = useMemo(
      () => resolveSegmentSeparator(locale, format),
      [locale, format],
    );

    const [focusedSegment, setFocusedSegment] = useState<DateSegment | null>(null);
    const [segments, setSegments] = useState<DateSegmentValue>(() => ({
      month: value ? value.getMonth() + 1 : null,
      day: value ? value.getDate() : null,
      year: value ? value.getFullYear() : null,
    }));

    // Sync with external value
    useEffect(() => {
      if (value) {
        setSegments({
          month: value.getMonth() + 1,
          day: value.getDate(),
          year: value.getFullYear(),
        });
      } else {
        setSegments({ month: null, day: null, year: null });
      }
    }, [value]);

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
                onChange?.(undefined);
                return;
              }
              if (max && date > max) {
                onChange?.(undefined);
                return;
              }
              onChange?.(date);
            }
          } else if (segments.month === null && segments.day === null && segments.year === null) {
            onChange?.(undefined);
          }
        }
      },
      [segments, onChange, onBlur, min, max],
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

    // For segment-based inputs, label is ALWAYS floated since placeholders are visible
    const isFloating = true;

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
      <div className={cn(dateInputVariants({ variant }), className)} ref={setRefs}>
        <div className="relative inline-flex w-full flex-col">
          <div
            className={cn(
              inputContainerVariants({ variant, error, disabled }),
              'h-10 items-center',
            )}
            onClick={handleContainerClick}
            onBlur={handleContainerBlur}
          >
            <div className="relative flex h-full min-w-0 flex-1 items-center gap-0.5 px-4">
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
                      {...(index === 0 ? { id: inputId } : {})}
                      {...(index === 0 && helperText ? { describedBy: helperId } : {})}
                    />
                    {index < segmentOrder.length - 1 ? (
                      <span className="text-on-surface-variant text-body-large">
                        {segmentSeparator}
                      </span>
                    ) : null}
                  </React.Fragment>
                );
              })}

              {/* Floating label */}
              <label
                htmlFor={inputId}
                className={cn(
                  'duration-medium ease-emphasized pointer-events-none absolute left-4 origin-left truncate transition-all',
                  !isFloating && [
                    'text-body-large text-on-surface-variant',
                    'top-1/2 -translate-y-1/2',
                  ],
                  isFloating && [
                    'text-label-small font-medium',
                    variant === 'outlined' && [
                      'top-0 -ml-1 -translate-y-1/2 px-1',
                      labelBg || 'bg-surface',
                    ],
                    variant === 'filled' && 'top-1 translate-y-0',
                    error
                      ? 'text-error'
                      : focusedSegment !== null
                        ? 'text-primary'
                        : 'text-on-surface-variant',
                  ],
                )}
              >
                {label}
              </label>
            </div>

            {/* Trailing icon */}
            {trailingIcon && (
              <span
                className={cn(
                  'flex h-full shrink-0 items-center justify-center pr-4 transition-colors',
                  error ? 'text-error' : 'text-on-surface-variant',
                )}
              >
                <div className="size-icon-sm flex items-center justify-center">{trailingIcon}</div>
              </span>
            )}
          </div>

          {/* Helper text */}
          {helperText && (
            <span
              id={helperId}
              className={cn(
                'text-label-small mt-1.5 px-4 font-medium',
                error ? 'text-error' : 'text-on-surface-variant',
              )}
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
