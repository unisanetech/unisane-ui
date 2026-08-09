'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { useControllableState } from '../lib/use-controllable-state';
import { Text } from '../primitives/text';
import { Button, type ButtonProps } from './button';
import { Dialog } from './dialog';
import { Icon } from './icon';
import { IconButton } from './icon-button';
import { Ripple } from './ripple';

export type DateRangeValue = {
  start: Date;
  end?: Date;
};

export interface DateRangePickerProps {
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onValueChange?: (value: DateRangeValue) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  min?: Date;
  max?: Date;
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  label?: string;
  triggerLabel?: React.ReactNode;
  applyLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
  size?: NonNullable<ButtonProps['size']>;
  triggerVariant?: NonNullable<ButtonProps['variant']>;
  className?: string;
  triggerClassName?: string;
}

function toDateOnly(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function startOfMonth(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function endOfMonth(value: Date) {
  return new Date(value.getFullYear(), value.getMonth() + 1, 0);
}

function addDays(value: Date, amount: number) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate() + amount);
}

function addMonths(value: Date, amount: number) {
  return new Date(value.getFullYear(), value.getMonth() + amount, 1);
}

function dateKey(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(
    value.getDate(),
  ).padStart(2, '0')}`;
}

function isSameDay(left: Date, right: Date) {
  return dateKey(left) === dateKey(right);
}

function isSameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

function isDisabledDate(value: Date, min?: Date, max?: Date) {
  const time = toDateOnly(value).getTime();
  return Boolean(
    (min && time < toDateOnly(min).getTime()) || (max && time > toDateOnly(max).getTime()),
  );
}

function clampDate(value: Date, min?: Date, max?: Date) {
  const normalized = toDateOnly(value);
  if (min && normalized < toDateOnly(min)) return toDateOnly(min);
  if (max && normalized > toDateOnly(max)) return toDateOnly(max);
  return normalized;
}

function normalizeRange(value: DateRangeValue, min?: Date, max?: Date): DateRangeValue {
  const start = clampDate(value.start, min, max);
  const end = value.end ? clampDate(value.end, min, max) : undefined;
  if (!end || end < start) return { start };
  return { start, end };
}

function monthCells(month: Date, weekStartsOn: number) {
  const leading = (month.getDay() - weekStartsOn + 7) % 7;
  const cells: Array<Date | null> = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= endOfMonth(month).getDate(); day += 1) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function weekdayLabels(locale: string | undefined, weekStartsOn: number) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const sunday = new Date(2024, 0, 7);
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(addDays(sunday, (weekStartsOn + index) % 7)),
  );
}

function RangeCalendar({
  value,
  onValueChange,
  min,
  max,
  locale,
  weekStartsOn,
}: {
  value: DateRangeValue;
  onValueChange: (value: DateRangeValue) => void;
  min?: Date;
  max?: Date;
  locale?: string;
  weekStartsOn: number;
}) {
  const initialDate = clampDate(value.end ?? value.start, min, max);
  const [currentMonth, setCurrentMonth] = React.useState(() => startOfMonth(initialDate));
  const [focusedDate, setFocusedDate] = React.useState(initialDate);
  const dayRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const monthFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
    [locale],
  );
  const dateFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'long' }),
    [locale],
  );
  const weekdays = React.useMemo(() => weekdayLabels(locale, weekStartsOn), [locale, weekStartsOn]);
  const cells = React.useMemo(
    () => monthCells(currentMonth, weekStartsOn),
    [currentMonth, weekStartsOn],
  );
  const monthLabel = monthFormatter.format(currentMonth);
  const canGoPrevious = !min || endOfMonth(addMonths(currentMonth, -1)) >= toDateOnly(min);
  const canGoNext = !max || startOfMonth(addMonths(currentMonth, 1)) <= toDateOnly(max);

  const focusDate = React.useCallback(
    (next: Date) => {
      const normalized = clampDate(next, min, max);
      setFocusedDate(normalized);
      if (!isSameMonth(normalized, currentMonth)) setCurrentMonth(startOfMonth(normalized));
      window.requestAnimationFrame(() => dayRefs.current.get(dateKey(normalized))?.focus());
    },
    [currentMonth, max, min],
  );

  const selectDate = React.useCallback(
    (next: Date) => {
      const selected = toDateOnly(next);
      if (isDisabledDate(selected, min, max)) return;
      if (value.end || selected < value.start) {
        onValueChange({ start: selected });
      } else {
        onValueChange({ start: value.start, end: selected });
      }
      setFocusedDate(selected);
    },
    [max, min, onValueChange, value.end, value.start],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, date: Date) => {
    let next: Date | undefined;
    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(date, -1);
        break;
      case 'ArrowRight':
        next = addDays(date, 1);
        break;
      case 'ArrowUp':
        next = addDays(date, -7);
        break;
      case 'ArrowDown':
        next = addDays(date, 7);
        break;
      case 'Home':
        next = addDays(date, -((date.getDay() - weekStartsOn + 7) % 7));
        break;
      case 'End':
        next = addDays(date, 6 - ((date.getDay() - weekStartsOn + 7) % 7));
        break;
      case 'PageUp':
        next = addMonths(date, -1);
        break;
      case 'PageDown':
        next = addMonths(date, 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectDate(date);
        return;
      default:
        return;
    }
    event.preventDefault();
    focusDate(next);
  };

  return (
    <div className="border-outline-soft overflow-hidden rounded-sm border">
      <div className="border-outline-weak flex h-12 items-center justify-between border-b px-2">
        <IconButton
          size="sm"
          icon={<Icon symbol="chevron_left" />}
          aria-label="Previous month"
          disabled={!canGoPrevious}
          onClick={() => setCurrentMonth((month) => startOfMonth(addMonths(month, -1)))}
        />
        <Text as="span" variant="titleSmall" className="font-semibold" aria-live="polite">
          {monthLabel}
        </Text>
        <IconButton
          size="sm"
          icon={<Icon symbol="chevron_right" />}
          aria-label="Next month"
          disabled={!canGoNext}
          onClick={() => setCurrentMonth((month) => startOfMonth(addMonths(month, 1)))}
        />
      </div>
      <div role="grid" aria-label={`${monthLabel} date range`} className="p-2">
        <div role="row" className="grid grid-cols-7">
          {weekdays.map((weekday, index) => (
            <Text
              key={`${weekday}-${index}`}
              as="span"
              variant="labelSmall"
              role="columnheader"
              className="text-on-surface-variant py-2 text-center"
            >
              {weekday}
            </Text>
          ))}
        </div>
        {Array.from({ length: cells.length / 7 }, (_, rowIndex) => (
          <div key={rowIndex} role="row" className="grid grid-cols-7 gap-y-1">
            {cells.slice(rowIndex * 7, rowIndex * 7 + 7).map((date, columnIndex) => {
              if (!date) {
                return (
                  <span
                    key={`empty-${columnIndex}`}
                    role="gridcell"
                    aria-hidden="true"
                    className="h-10"
                  />
                );
              }
              const start = isSameDay(date, value.start);
              const end = Boolean(value.end && isSameDay(date, value.end));
              const inRange = Boolean(value.end && date > value.start && date < value.end);
              const disabled = isDisabledDate(date, min, max);
              const today = isSameDay(date, new Date());
              const focusable = isSameDay(date, focusedDate);

              return (
                <button
                  key={dateKey(date)}
                  ref={(node) => {
                    const key = dateKey(date);
                    if (node) dayRefs.current.set(key, node);
                    else dayRefs.current.delete(key);
                  }}
                  type="button"
                  role="gridcell"
                  disabled={disabled}
                  aria-label={dateFormatter.format(date)}
                  aria-selected={start || end || inRange}
                  aria-current={today ? 'date' : undefined}
                  tabIndex={focusable ? 0 : -1}
                  className={cn(
                    'relative flex h-10 items-center justify-center overflow-hidden',
                    'duration-short ease-standard transition-colors',
                    'focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
                    start || end
                      ? 'bg-primary text-on-primary rounded-sm font-semibold'
                      : inRange
                        ? 'bg-secondary-container text-on-secondary-container'
                        : today
                          ? 'ring-primary text-primary rounded-sm font-medium ring-1 ring-inset'
                          : 'text-on-surface hover:bg-state-hover rounded-sm',
                    disabled && 'cursor-not-allowed opacity-38',
                  )}
                  onClick={() => selectDate(date)}
                  onFocus={() => setFocusedDate(date)}
                  onKeyDown={(event) => handleKeyDown(event, date)}
                >
                  <Ripple disabled={disabled} />
                  <Text variant="bodyMedium" className="relative z-10">
                    {date.getDate()}
                  </Text>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      open,
      defaultOpen = false,
      onOpenChange,
      min,
      max,
      locale,
      weekStartsOn = 0,
      label = 'Date range',
      triggerLabel,
      applyLabel = 'Apply',
      cancelLabel = 'Cancel',
      disabled = false,
      size = 'md',
      triggerVariant = 'outlined',
      className,
      triggerClassName,
    },
    forwardedRef,
  ) => {
    const today = React.useMemo(() => toDateOnly(new Date()), []);
    const fallback = React.useMemo(
      () => normalizeRange(defaultValue ?? { start: today, end: today }, min, max),
      [defaultValue, max, min, today],
    );
    const [selectedRange, setSelectedRange] = useControllableState<DateRangeValue>({
      value: value ? normalizeRange(value, min, max) : undefined,
      defaultValue: fallback,
      onChange: onValueChange,
    });
    const [isOpen = false, setIsOpen] = useControllableState<boolean>({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });
    const [draft, setDraft] = React.useState<DateRangeValue>(() => selectedRange ?? fallback);
    const dateFormatter = React.useMemo(
      () => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }),
      [locale],
    );
    const resolvedRange = selectedRange ?? fallback;
    const formattedRange = resolvedRange.end
      ? `${dateFormatter.format(resolvedRange.start)} – ${dateFormatter.format(resolvedRange.end)}`
      : `${dateFormatter.format(resolvedRange.start)} – Select end date`;

    const changeOpen = (next: boolean) => {
      if (next) setDraft(resolvedRange);
      setIsOpen(next);
    };

    return (
      <div className={cn('inline-flex', className)}>
        <Button
          ref={forwardedRef}
          type="button"
          size={size}
          variant={triggerVariant}
          leadingIcon={<Icon symbol="date_range" />}
          disabled={disabled}
          aria-label={`${label}: ${formattedRange}`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={triggerClassName}
          onClick={() => changeOpen(true)}
        >
          {triggerLabel ?? formattedRange}
        </Button>
        <Dialog
          open={isOpen && !disabled}
          onOpenChange={changeOpen}
          title={label}
          description="Choose the first and last day included in this range."
          mobilePresentation="fullscreen"
          className="medium:max-w-110"
          contentClassName="space-y-4"
          actions={
            <>
              <Button variant="text" size="sm" onClick={() => changeOpen(false)}>
                {cancelLabel}
              </Button>
              <Button
                size="sm"
                disabled={!draft.end}
                onClick={() => {
                  if (!draft.end) return;
                  setSelectedRange(normalizeRange(draft, min, max));
                  changeOpen(false);
                }}
              >
                {applyLabel}
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low rounded-sm px-3 py-2">
              <Text variant="labelSmall" className="text-on-surface-variant">
                Start date
              </Text>
              <Text variant="bodyMedium" className="mt-0.5 font-medium">
                {dateFormatter.format(draft.start)}
              </Text>
            </div>
            <div className="bg-surface-container-low rounded-sm px-3 py-2">
              <Text variant="labelSmall" className="text-on-surface-variant">
                End date
              </Text>
              <Text variant="bodyMedium" className="mt-0.5 font-medium">
                {draft.end ? dateFormatter.format(draft.end) : 'Select a date'}
              </Text>
            </div>
          </div>
          <RangeCalendar
            value={draft}
            onValueChange={setDraft}
            min={min}
            max={max}
            locale={locale}
            weekStartsOn={weekStartsOn}
          />
          {!draft.end ? (
            <Text variant="bodySmall" className="text-primary" aria-live="polite">
              Select an end date to complete the range.
            </Text>
          ) : null}
        </Dialog>
      </div>
    );
  },
);

DateRangePicker.displayName = 'DateRangePicker';
