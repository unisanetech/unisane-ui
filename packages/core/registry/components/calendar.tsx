'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Surface } from '@/primitives/surface';
import { Text } from '@/primitives/text';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Ripple } from '@/components/ui/ripple';

export interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
  min?: Date;
  max?: Date;
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  autoFocus?: boolean;
  'aria-label'?: string;
}

function toDateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function addMonths(date: Date, amount: number) {
  const targetMonth = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const day = Math.min(date.getDate(), endOfMonth(targetMonth).getDate());
  return new Date(targetMonth.getFullYear(), targetMonth.getMonth(), day);
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getDate() === right.getDate() &&
    left.getMonth() === right.getMonth() &&
    left.getFullYear() === right.getFullYear()
  );
}

function isSameMonth(left: Date, right: Date) {
  return left.getMonth() === right.getMonth() && left.getFullYear() === right.getFullYear();
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function isDateDisabled(date: Date, min?: Date, max?: Date) {
  const value = toDateOnly(date).getTime();
  if (min && value < toDateOnly(min).getTime()) return true;
  if (max && value > toDateOnly(max).getTime()) return true;
  return false;
}

function clampDate(date: Date, min?: Date, max?: Date) {
  if (min && date < toDateOnly(min)) return toDateOnly(min);
  if (max && date > toDateOnly(max)) return toDateOnly(max);
  return date;
}

function getMonthCells(month: Date, weekStartsOn: number) {
  const daysInMonth = endOfMonth(month).getDate();
  const leadingCells = (month.getDay() - weekStartsOn + 7) % 7;
  const cells: Array<Date | null> = Array.from({ length: leadingCells }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function getWeekdayLabels(locale: string | undefined, weekStartsOn: number) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const sunday = new Date(2024, 0, 7);
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(addDays(sunday, (weekStartsOn + index) % 7)),
  );
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      selectedDate,
      onDateSelect,
      className,
      min,
      max,
      locale,
      weekStartsOn = 0,
      autoFocus = false,
      'aria-label': ariaLabel,
    },
    forwardedRef,
  ) => {
    const initialDate = clampDate(
      selectedDate ? toDateOnly(selectedDate) : toDateOnly(new Date()),
      min,
      max,
    );
    const [currentMonth, setCurrentMonth] = React.useState(() => startOfMonth(initialDate));
    const [focusedDate, setFocusedDate] = React.useState(initialDate);
    const dayRefs = React.useRef(new Map<string, HTMLButtonElement>());
    const shouldFocusDayRef = React.useRef(autoFocus);

    React.useEffect(() => {
      if (!selectedDate) return;
      const normalized = clampDate(toDateOnly(selectedDate), min, max);
      setCurrentMonth(startOfMonth(normalized));
      setFocusedDate(normalized);
    }, [max, min, selectedDate]);

    React.useEffect(() => {
      if (!shouldFocusDayRef.current) return;
      const target = dayRefs.current.get(dateKey(focusedDate));
      if (!target) return;
      target.focus();
      shouldFocusDayRef.current = false;
    }, [currentMonth, focusedDate]);

    const monthFormatter = React.useMemo(
      () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
      [locale],
    );
    const dateFormatter = React.useMemo(
      () => new Intl.DateTimeFormat(locale, { dateStyle: 'long' }),
      [locale],
    );
    const weekdayLabels = React.useMemo(
      () => getWeekdayLabels(locale, weekStartsOn),
      [locale, weekStartsOn],
    );
    const cells = React.useMemo(
      () => getMonthCells(currentMonth, weekStartsOn),
      [currentMonth, weekStartsOn],
    );
    const monthLabel = monthFormatter.format(currentMonth);
    const canGoPrevious = !min || endOfMonth(addMonths(currentMonth, -1)) >= toDateOnly(min);
    const canGoNext = !max || startOfMonth(addMonths(currentMonth, 1)) <= toDateOnly(max);
    const selectedInMonth =
      selectedDate && isSameMonth(toDateOnly(selectedDate), currentMonth)
        ? toDateOnly(selectedDate)
        : undefined;
    const focusedInMonth = isSameMonth(focusedDate, currentMonth) ? focusedDate : undefined;
    const firstEnabledDate = cells.find(
      (cell): cell is Date => cell !== null && !isDateDisabled(cell, min, max),
    );
    const tabStop = focusedInMonth ?? selectedInMonth ?? firstEnabledDate;

    const moveFocus = React.useCallback(
      (nextDate: Date) => {
        const normalized = clampDate(toDateOnly(nextDate), min, max);
        shouldFocusDayRef.current = true;
        setFocusedDate(normalized);
        if (!isSameMonth(normalized, currentMonth)) setCurrentMonth(startOfMonth(normalized));
      },
      [currentMonth, max, min],
    );

    const selectDate = React.useCallback(
      (date: Date) => {
        if (isDateDisabled(date, min, max)) return;
        const normalized = toDateOnly(date);
        setFocusedDate(normalized);
        onDateSelect?.(normalized);
      },
      [max, min, onDateSelect],
    );

    const handleDayKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>, date: Date) => {
        let nextDate: Date | undefined;

        switch (event.key) {
          case 'ArrowLeft':
            nextDate = addDays(date, -1);
            break;
          case 'ArrowRight':
            nextDate = addDays(date, 1);
            break;
          case 'ArrowUp':
            nextDate = addDays(date, -7);
            break;
          case 'ArrowDown':
            nextDate = addDays(date, 7);
            break;
          case 'Home':
            nextDate = addDays(date, -((date.getDay() - weekStartsOn + 7) % 7));
            break;
          case 'End':
            nextDate = addDays(date, 6 - ((date.getDay() - weekStartsOn + 7) % 7));
            break;
          case 'PageUp':
            nextDate = addMonths(date, -1);
            break;
          case 'PageDown':
            nextDate = addMonths(date, 1);
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
        moveFocus(nextDate);
      },
      [moveFocus, selectDate, weekStartsOn],
    );

    return (
      <Surface
        ref={forwardedRef}
        tone="surface"
        elevation={1}
        className={cn('w-full max-w-sm overflow-hidden rounded-sm', className)}
      >
        <div className="border-outline-subtle flex items-center justify-between border-b p-4">
          <IconButton
            icon={<Icon symbol="chevron_left" />}
            onClick={() => setCurrentMonth((month) => startOfMonth(addMonths(month, -1)))}
            aria-label="Previous month"
            disabled={!canGoPrevious}
          />
          <Text as="span" variant="titleMedium" aria-live="polite">
            {monthLabel}
          </Text>
          <IconButton
            icon={<Icon symbol="chevron_right" />}
            onClick={() => setCurrentMonth((month) => startOfMonth(addMonths(month, 1)))}
            aria-label="Next month"
            disabled={!canGoNext}
          />
        </div>

        <div role="grid" aria-label={ariaLabel ?? monthLabel} className="space-y-1 p-2 pb-4">
          <div role="row" className="grid grid-cols-7 gap-1">
            {weekdayLabels.map((day, index) => (
              <div
                key={`${day}-${index}`}
                role="columnheader"
                aria-label={day}
                className="py-2 text-center"
              >
                <Text variant="labelSmall" className="text-on-surface-variant">
                  {day}
                </Text>
              </div>
            ))}
          </div>

          {Array.from({ length: cells.length / 7 }, (_, rowIndex) => (
            <div key={rowIndex} role="row" className="grid grid-cols-7 gap-1">
              {cells.slice(rowIndex * 7, rowIndex * 7 + 7).map((date, columnIndex) => {
                if (!date) {
                  return (
                    <span
                      key={`empty-${columnIndex}`}
                      role="gridcell"
                      aria-hidden="true"
                      className="aspect-square"
                    />
                  );
                }

                const selected = Boolean(selectedDate && isSameDay(date, toDateOnly(selectedDate)));
                const today = isSameDay(date, toDateOnly(new Date()));
                const disabled = isDateDisabled(date, min, max);
                const focusable = Boolean(tabStop && isSameDay(date, tabStop));

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
                    aria-selected={selected}
                    aria-current={today ? 'date' : undefined}
                    tabIndex={focusable ? 0 : -1}
                    className={cn(
                      'relative flex aspect-square items-center justify-center overflow-hidden rounded-full',
                      'duration-short ease-standard transition-colors',
                      'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      selected
                        ? 'bg-primary text-on-primary'
                        : today
                          ? 'ring-primary text-primary font-medium ring-1 ring-inset'
                          : 'text-on-surface hover:bg-state-hover',
                      disabled && 'cursor-not-allowed opacity-38',
                    )}
                    onClick={() => selectDate(date)}
                    onFocus={() => setFocusedDate(date)}
                    onKeyDown={(event) => handleDayKeyDown(event, date)}
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
      </Surface>
    );
  },
);

Calendar.displayName = 'Calendar';
