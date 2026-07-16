'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { getFieldSizeStyles, type FieldSize } from '../lib/field-size';
import { useControllableState } from '../lib/use-controllable-state';
import {
  fieldContainerVariants,
  getFieldAffixClasses,
  getFieldLabelClasses,
  type FieldShellVariant,
} from '../lib/field-shell';
import { Field, FieldDescription, FieldError, FieldLabel } from './field';

type DateSegment = 'month' | 'day' | 'year';

interface DateSegmentValue {
  month: number | null;
  day: number | null;
  year: number | null;
}

export interface DateInputProps {
  variant?: FieldShellVariant;
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  label: string;
  hideLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  className?: string;
  locale?: string;
  format?: string;
  min?: Date;
  max?: Date;
  name?: string;
  trailingIcon?: React.ReactNode;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  id?: string;
  size?: FieldSize;
}

const DEFAULT_SEGMENT_ORDER: DateSegment[] = ['month', 'day', 'year'];

function toDateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(left: Date | undefined, right: Date | undefined) {
  if (!left || !right) return left === right;
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function serializeDate(date: Date | undefined) {
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function getMaxDays(month: number | null, year: number | null) {
  if (month === null) return 31;
  return new Date(year ?? 2024, month, 0).getDate();
}

function resolveFormatSegmentOrder(format?: string): DateSegment[] | null {
  const pattern = format?.trim();
  if (!pattern) return null;

  const monthIndex = pattern.search(/M/i);
  const dayIndex = pattern.search(/d/i);
  const yearIndex = pattern.search(/y/i);
  if (monthIndex < 0 || dayIndex < 0 || yearIndex < 0) return null;

  return [
    { segment: 'month' as const, index: monthIndex },
    { segment: 'day' as const, index: dayIndex },
    { segment: 'year' as const, index: yearIndex },
  ]
    .sort((left, right) => left.index - right.index)
    .map((entry) => entry.segment);
}

function resolveLocaleSegmentOrder(locale?: string): DateSegment[] {
  try {
    const order = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(new Date(2006, 10, 22))
      .filter((part) => part.type === 'day' || part.type === 'month' || part.type === 'year')
      .map((part) => part.type as DateSegment);
    if (order.length === 3) return order;
  } catch {
    return DEFAULT_SEGMENT_ORDER;
  }
  return DEFAULT_SEGMENT_ORDER;
}

function resolveSegmentOrder(locale?: string, format?: string) {
  return resolveFormatSegmentOrder(format) ?? resolveLocaleSegmentOrder(locale);
}

function resolveSegmentSeparator(locale?: string, format?: string) {
  const pattern = format?.trim();
  if (pattern) {
    const literal = pattern.match(/[^dmy]+/i)?.[0];
    if (literal) return literal;
  }

  try {
    const literal = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(new Date(2006, 10, 22))
      .find((part) => part.type === 'literal')
      ?.value.trim();
    if (literal) return literal;
  } catch {
    return '/';
  }
  return '/';
}

function resolveSegmentPlaceholder(segment: DateSegment) {
  if (segment === 'month') return 'MM';
  if (segment === 'day') return 'DD';
  return 'YYYY';
}

function resolveDate(segments: DateSegmentValue, min?: Date, max?: Date) {
  if (segments.month === null || segments.day === null || segments.year === null) return undefined;
  const date = new Date(segments.year, segments.month - 1, segments.day);
  if (
    date.getFullYear() !== segments.year ||
    date.getMonth() !== segments.month - 1 ||
    date.getDate() !== segments.day
  ) {
    return undefined;
  }
  const normalized = toDateOnly(date);
  if (min && normalized < toDateOnly(min)) return undefined;
  if (max && normalized > toDateOnly(max)) return undefined;
  return normalized;
}

interface SegmentProps {
  type: DateSegment;
  value: number | null;
  onChange: (value: number | null) => void;
  onNext: () => void;
  onPrevious: () => void;
  disabled: boolean;
  placeholder: string;
  min: number;
  max: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
  focused: boolean;
  onFocusedChange: (focused: boolean) => void;
  id?: string;
  describedBy?: string;
  label: string;
  required: boolean;
  invalid: boolean;
  size: FieldSize;
}

function Segment({
  type,
  value,
  onChange,
  onNext,
  onPrevious,
  disabled,
  placeholder,
  min,
  max,
  inputRef,
  focused,
  onFocusedChange,
  id,
  describedBy,
  label,
  required,
  invalid,
  size,
}: SegmentProps) {
  const fieldSize = getFieldSizeStyles(size);
  const [enteredDigits, setEnteredDigits] = React.useState('');
  const enteredDigitsRef = React.useRef('');
  const digitCount = type === 'year' ? 4 : 2;

  const updateEnteredDigits = React.useCallback((nextDigits: string) => {
    enteredDigitsRef.current = nextDigits;
    setEnteredDigits(nextDigits);
  }, []);

  React.useEffect(() => {
    if (!focused) updateEnteredDigits('');
  }, [focused, updateEnteredDigits]);

  const commitValue = React.useCallback(
    (digits: string) => {
      if (!digits) {
        onChange(null);
        return;
      }
      const parsed = Number.parseInt(digits, 10);
      onChange(Math.max(min, Math.min(max, parsed)));
      updateEnteredDigits('');
    },
    [max, min, onChange, updateEnteredDigits],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || event.altKey || event.ctrlKey || event.metaKey) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        updateEnteredDigits('');
        onChange(value === null ? min : value >= max ? min : value + 1);
        return;
      case 'ArrowDown':
        event.preventDefault();
        updateEnteredDigits('');
        onChange(value === null ? max : value <= min ? max : value - 1);
        return;
      case 'ArrowLeft':
        event.preventDefault();
        if (enteredDigits) commitValue(enteredDigits);
        onPrevious();
        return;
      case 'ArrowRight':
        event.preventDefault();
        if (enteredDigits) commitValue(enteredDigits);
        onNext();
        return;
      case 'Tab':
        if (enteredDigits) commitValue(enteredDigits);
        return;
      case 'Backspace': {
        event.preventDefault();
        if (enteredDigits) {
          updateEnteredDigits(enteredDigits.slice(0, -1));
          return;
        }
        if (value === null) {
          onPrevious();
          return;
        }
        const remaining = String(value).slice(0, -1);
        if (!remaining) {
          onChange(null);
          return;
        }
        onChange(Number.parseInt(remaining, 10));
        updateEnteredDigits(remaining);
        return;
      }
      case 'Delete':
        event.preventDefault();
        onChange(null);
        updateEnteredDigits('');
        return;
      default:
        if (!/^[0-9]$/.test(event.key)) return;
    }

    event.preventDefault();
    const nextDigits = enteredDigits + event.key;
    if (nextDigits.length >= digitCount) {
      commitValue(nextDigits);
      onNext();
      return;
    }
    const parsed = Number.parseInt(nextDigits, 10);
    const minimumPossibleValue = parsed * 10 ** (digitCount - nextDigits.length);
    if (minimumPossibleValue > max) {
      commitValue(nextDigits);
      onNext();
      return;
    }
    updateEnteredDigits(nextDigits);
  };

  const displayValue =
    focused && enteredDigits
      ? enteredDigits
      : value === null
        ? placeholder
        : String(value).padStart(digitCount, '0');

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="numeric"
      role="spinbutton"
      value={displayValue}
      onChange={() => undefined}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        updateEnteredDigits('');
        onFocusedChange(true);
      }}
      onBlur={() => {
        if (enteredDigitsRef.current) commitValue(enteredDigitsRef.current);
        onFocusedChange(false);
      }}
      disabled={disabled}
      className={cn(
        'border-none bg-transparent text-center caret-transparent outline-none select-none focus:ring-0',
        'text-on-surface font-medium tabular-nums',
        fieldSize.segmentText,
        type === 'year' ? fieldSize.segmentYearWidth : fieldSize.segmentWidth,
        value === null && !enteredDigits && 'text-on-surface-variant',
        focused && 'bg-state-selected rounded-xs',
      )}
      aria-label={`${label}, ${type}`}
      aria-valuenow={value ?? undefined}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      aria-required={required || undefined}
    />
  );
}

export const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      label,
      hideLabel = false,
      disabled = false,
      required = false,
      invalid = false,
      description,
      errorMessage,
      className,
      variant = 'outlined',
      locale,
      format,
      min,
      max,
      name,
      trailingIcon,
      onFocus,
      onBlur,
      onKeyDown,
      id,
      size = 'md',
    },
    forwardedRef,
  ) => {
    const [currentValue, setCurrentValue] = useControllableState<Date | undefined>({
      value,
      defaultValue,
      onChange: onValueChange,
    });
    const generatedId = React.useId();
    const fieldId = id ?? `date-input-${generatedId}`;
    const descriptionId = description ? `${fieldId}-description` : undefined;
    const errorId = errorMessage ? `${fieldId}-error` : undefined;
    const messageId = errorMessage ? errorId : descriptionId;
    const resolvedInvalid = invalid || Boolean(errorMessage);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const monthRef = React.useRef<HTMLInputElement>(null);
    const dayRef = React.useRef<HTMLInputElement>(null);
    const yearRef = React.useRef<HTMLInputElement>(null);
    const fieldSize = getFieldSizeStyles(size);
    const segmentOrder = React.useMemo(() => resolveSegmentOrder(locale, format), [format, locale]);
    const segmentSeparator = React.useMemo(
      () => resolveSegmentSeparator(locale, format),
      [format, locale],
    );
    const [focusedSegment, setFocusedSegment] = React.useState<DateSegment | null>(null);
    const [segments, setSegments] = React.useState<DateSegmentValue>(() => ({
      month: currentValue ? currentValue.getMonth() + 1 : null,
      day: currentValue ? currentValue.getDate() : null,
      year: currentValue ? currentValue.getFullYear() : null,
    }));
    const segmentsRef = React.useRef(segments);

    React.useEffect(() => {
      const nextSegments = {
        month: currentValue ? currentValue.getMonth() + 1 : null,
        day: currentValue ? currentValue.getDate() : null,
        year: currentValue ? currentValue.getFullYear() : null,
      };
      segmentsRef.current = nextSegments;
      setSegments(nextSegments);
    }, [currentValue]);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const getSegmentRef = React.useCallback((segment: DateSegment) => {
      if (segment === 'month') return monthRef;
      if (segment === 'day') return dayRef;
      return yearRef;
    }, []);

    const focusSegment = React.useCallback(
      (segment: DateSegment) => getSegmentRef(segment).current?.focus(),
      [getSegmentRef],
    );

    const updateSegment = React.useCallback((segment: DateSegment, nextValue: number | null) => {
      const next = { ...segmentsRef.current, [segment]: nextValue };
      if (segment === 'month' || segment === 'year') {
        const maxDays = getMaxDays(next.month, next.year);
        if (next.day !== null && next.day > maxDays) next.day = maxDays;
      }
      segmentsRef.current = next;
      setSegments(next);
    }, []);

    const commitSegments = React.useCallback(() => {
      const currentSegments = segmentsRef.current;
      const allEmpty = Object.values(currentSegments).every((segment) => segment === null);
      const nextValue = allEmpty ? undefined : resolveDate(currentSegments, min, max);
      if (!isSameDay(currentValue, nextValue)) setCurrentValue(nextValue);
    }, [currentValue, max, min, setCurrentValue]);

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
      setFocusedSegment(null);
      commitSegments();
      onBlur?.(event);
    };

    return (
      <Field ref={setRefs} className={className} invalid={resolvedInvalid}>
        <div
          className={cn(
            fieldContainerVariants({ variant, error: resolvedInvalid, disabled }),
            fieldSize.containerHeight,
            'items-center',
          )}
          onBlur={handleBlur}
          onFocus={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onFocus?.(event);
          }}
          onKeyDown={onKeyDown}
          onClick={(event) => {
            if (disabled) return;
            const target = event.target;
            if (target instanceof Element && target.closest('input, button, a, [role="button"]'))
              return;
            focusSegment(segmentOrder[0] ?? 'month');
          }}
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
              const segmentMax =
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
                    onChange={(nextValue) => updateSegment(segment, nextValue)}
                    onNext={() => nextSegment && focusSegment(nextSegment)}
                    onPrevious={() => previousSegment && focusSegment(previousSegment)}
                    disabled={disabled}
                    placeholder={resolveSegmentPlaceholder(segment)}
                    min={1}
                    max={segmentMax}
                    inputRef={getSegmentRef(segment)}
                    focused={focusedSegment === segment}
                    onFocusedChange={(focused) => setFocusedSegment(focused ? segment : null)}
                    label={label}
                    required={required}
                    invalid={resolvedInvalid}
                    size={size}
                    describedBy={messageId}
                    {...(index === 0 ? { id: fieldId } : {})}
                  />
                  {index < segmentOrder.length - 1 ? (
                    <span className={cn('text-on-surface-variant', fieldSize.segmentText)}>
                      {segmentSeparator}
                    </span>
                  ) : null}
                </React.Fragment>
              );
            })}

            <FieldLabel
              htmlFor={fieldId}
              required={required}
              className={
                hideLabel
                  ? 'sr-only'
                  : getFieldLabelClasses({
                      size,
                      variant,
                      floating: true,
                      error: resolvedInvalid,
                      active: focusedSegment !== null,
                    })
              }
            >
              {label}
            </FieldLabel>
          </div>

          {trailingIcon ? (
            <span
              className={getFieldAffixClasses({
                size,
                error: resolvedInvalid,
                active: focusedSegment !== null,
                side: 'trailing',
              })}
            >
              <span className={cn(fieldSize.iconSize, 'flex items-center justify-center')}>
                {trailingIcon}
              </span>
            </span>
          ) : null}
        </div>

        {errorMessage ? <FieldError id={errorId}>{errorMessage}</FieldError> : null}
        {!errorMessage && description ? (
          <FieldDescription id={descriptionId}>{description}</FieldDescription>
        ) : null}
        {name ? <input type="hidden" name={name} value={serializeDate(currentValue)} /> : null}
      </Field>
    );
  },
);

DateInput.displayName = 'DateInput';
