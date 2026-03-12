'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Surface } from '@/primitives/surface';
import { Text } from '@/primitives/text';
import { IconButton } from './icon-button';
import { Ripple } from './ripple';

const calendarVariants = cva('w-full max-w-sm rounded-sm overflow-hidden', {
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type CalendarProps = VariantProps<typeof calendarVariants> & {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
  min?: Date;
  max?: Date;
};

const MONTH_NAMES = [
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
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const isToday = (date: Date) => {
  return isSameDay(date, new Date());
};

const isDateDisabled = (date: Date, min?: Date, max?: Date) => {
  if (min && date < new Date(min.getFullYear(), min.getMonth(), min.getDate())) {
    return true;
  }
  if (max && date > new Date(max.getFullYear(), max.getMonth(), max.getDate())) {
    return true;
  }
  return false;
};

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  className,
  min,
  max,
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [focusedDay, setFocusedDay] = useState<number | null>(null);
  const dayRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (focusedDay !== null) {
      const dayEl = dayRefs.current.get(focusedDay);
      if (dayEl) {
        dayEl.focus();
      }
    }
  }, [focusedDay]);

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
    setFocusedDay(null);
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
    setFocusedDay(null);
  }, []);

  const handleDateClick = useCallback(
    (day: number) => {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      if (!isDateDisabled(newDate, min, max)) {
        onDateSelect?.(newDate);
      }
    },
    [currentMonth, min, max, onDateSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, day: number) => {
      const daysInMonth = getDaysInMonth(currentMonth);
      let newDay = day;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (day > 1) {
            newDay = day - 1;
          } else {
            handlePreviousMonth();
            const prevMonthDays = getDaysInMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
            );
            setFocusedDay(prevMonthDays);
            return;
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (day < daysInMonth) {
            newDay = day + 1;
          } else {
            handleNextMonth();
            setFocusedDay(1);
            return;
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (day > 7) {
            newDay = day - 7;
          } else {
            handlePreviousMonth();
            const prevMonthDays = getDaysInMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
            );
            setFocusedDay(prevMonthDays - (7 - day));
            return;
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (day + 7 <= daysInMonth) {
            newDay = day + 7;
          } else {
            handleNextMonth();
            setFocusedDay(day + 7 - daysInMonth);
            return;
          }
          break;
        case 'Home':
          e.preventDefault();
          newDay = 1;
          break;
        case 'End':
          e.preventDefault();
          newDay = daysInMonth;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleDateClick(day);
          return;
        default:
          return;
      }

      setFocusedDay(newDay);
    },
    [currentMonth, handlePreviousMonth, handleNextMonth, handleDateClick],
  );

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const getInitialFocusDay = () => {
    if (
      selectedDate &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    ) {
      return selectedDate.getDate();
    }
    return 1;
  };

  return (
    <Surface
      tone="surface"
      elevation={1}
      className={cn(calendarVariants({ className }))}
      role="application"
      aria-label={`Calendar, ${MONTH_NAMES[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
    >
      <div className="border-outline-variant flex items-center justify-between border-b p-4">
        <IconButton
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          }
          onClick={handlePreviousMonth}
          aria-label="Previous month"
        />

        <Text variant="titleMedium" aria-live="polite">
          {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>

        <IconButton
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          }
          onClick={handleNextMonth}
          aria-label="Next month"
        />
      </div>

      <div className="grid grid-cols-7 gap-1 p-2" role="row">
        {DAY_NAMES.map((day) => (
          <div key={day} className="py-2 text-center" role="columnheader">
            <Text variant="labelSmall" className="text-on-surface-variant">
              {day}
            </Text>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 p-2 pb-4" role="grid" aria-label="Calendar dates">
        {days.map((day, index) => {
          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="aspect-square"
                role="gridcell"
                aria-hidden="true"
              />
            );
          }

          const dateForDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isSelected = selectedDate && isSameDay(dateForDay, selectedDate);
          const isTodayDate = isToday(dateForDay);
          const isDisabled = isDateDisabled(dateForDay, min, max);
          const isFocusable =
            focusedDay === day || (focusedDay === null && day === getInitialFocusDay());

          return (
            <div key={day} className="aspect-square" role="gridcell">
              <button
                ref={(el) => {
                  if (el) {
                    dayRefs.current.set(day, el);
                  } else {
                    dayRefs.current.delete(day);
                  }
                }}
                type="button"
                disabled={isDisabled}
                className={cn(
                  'relative flex h-full w-full items-center justify-center overflow-hidden rounded-full',
                  'duration-short ease-standard transition-colors',
                  'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',

                  isSelected
                    ? 'bg-primary text-on-primary'
                    : isTodayDate
                      ? 'ring-primary text-primary font-medium ring-1 ring-inset'
                      : 'text-on-surface hover:bg-state-hover',
                  isDisabled && 'pointer-events-none cursor-not-allowed opacity-38',
                )}
                onClick={() => handleDateClick(day)}
                onKeyDown={(e) => handleKeyDown(e, day)}
                aria-label={`${MONTH_NAMES[currentMonth.getMonth()]} ${day}, ${currentMonth.getFullYear()}${isTodayDate ? ' (today)' : ''}${isSelected ? ' (selected)' : ''}`}
                aria-selected={isSelected}
                aria-disabled={isDisabled}
                tabIndex={isFocusable ? 0 : -1}
              >
                <Ripple disabled={isDisabled} />
                <Text variant="bodyMedium" className="relative z-10">
                  {day}
                </Text>
              </button>
            </div>
          );
        })}
      </div>
    </Surface>
  );
};
