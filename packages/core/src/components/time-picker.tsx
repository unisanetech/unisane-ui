'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog } from './dialog';
import { Button } from './button';
import { IconButton } from './icon-button';
import { Icon } from '@ui/primitives/icon';
import { cn } from '@ui/lib/utils';
import { useControllableState } from '@ui/lib/use-controllable-state';
import { TextField } from './text-field';

export interface TimePickerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (time: string) => void;
}

function parseTimeParts(value: string): { hours: number; minutes: number; period: 'AM' | 'PM' } {
  const [rawHours = '12', rawMinutes = '00'] = value.split(':');
  const parsedHours = Number.parseInt(rawHours, 10);
  const parsedMinutes = Number.parseInt(rawMinutes, 10);
  const normalizedHours = Number.isNaN(parsedHours) ? 12 : Math.min(Math.max(parsedHours, 0), 23);
  const normalizedMinutes = Number.isNaN(parsedMinutes)
    ? 0
    : Math.min(Math.max(parsedMinutes, 0), 59);

  return {
    hours: normalizedHours % 12 || 12,
    minutes: normalizedMinutes,
    period: (normalizedHours >= 12 ? 'PM' : 'AM'),
  };
}

function formatTimeValue(hours: number, minutes: number, period: 'AM' | 'PM') {
  let finalHours = hours;
  if (period === 'PM' && hours !== 12) finalHours += 12;
  if (period === 'AM' && hours === 12) finalHours = 0;

  if (finalHours < 0) finalHours = 0;
  if (finalHours > 23) finalHours = 23;
  let finalMinutes = minutes;
  if (finalMinutes < 0) finalMinutes = 0;
  if (finalMinutes > 59) finalMinutes = 59;

  return `${finalHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  open,
  defaultOpen = false,
  onOpenChange,
  value,
  defaultValue = '12:00',
  onValueChange,
}) => {
  const [isOpen = false, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [selectedValue = defaultValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const initialValue = parseTimeParts(selectedValue);

  const [hours, setHours] = useState(initialValue.hours);
  const [minutes, setMinutes] = useState(initialValue.minutes);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialValue.period);

  const [inputType, setInputType] = useState<'dial' | 'keyboard'>('dial');
  const [dialMode, setDialMode] = useState<'hour' | 'minute'>('hour');
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const nextValue = parseTimeParts(selectedValue);
    setHours(nextValue.hours);
    setMinutes(nextValue.minutes);
    setPeriod(nextValue.period);
    setDialMode('hour');
    setInputType('dial');
  }, [isOpen, selectedValue]);

  const getRotation = () => {
    if (dialMode === 'hour') {
      return (hours % 12) * 30;
    }
    return minutes * 6;
  };

  // Calculate value from mouse/touch position
  const getValueFromPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!dialRef.current) return null;

      const rect = dialRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = clientX - centerX;
      const y = clientY - centerY;

      // Calculate angle in degrees (0 = top, clockwise)
      let angle = Math.atan2(x, -y) * (180 / Math.PI);
      if (angle < 0) angle += 360;

      if (dialMode === 'hour') {
        // Hours: 30 degrees per hour, snap to nearest hour
        let hour = Math.round(angle / 30);
        if (hour === 0) hour = 12;
        return hour;
      } else {
        // Minutes: 6 degrees per minute, snap to nearest minute
        let minute = Math.round(angle / 6);
        if (minute === 60) minute = 0;
        return minute;
      }
    },
    [dialMode],
  );

  const handleDialInteraction = useCallback(
    (clientX: number, clientY: number) => {
      const value = getValueFromPosition(clientX, clientY);
      if (value === null) return;

      if (dialMode === 'hour') {
        setHours(value);
      } else {
        setMinutes(value);
      }
    },
    [dialMode, getValueFromPosition],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      handleDialInteraction(e.clientX, e.clientY);
    },
    [handleDialInteraction],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      handleDialInteraction(e.clientX, e.clientY);
    },
    [isDragging, handleDialInteraction],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // Auto-advance to minutes after selecting hour
      if (dialMode === 'hour') {
        setDialMode('minute');
      }
    }
  }, [isDragging, dialMode]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const touch = e.touches[0];
      if (touch) {
        handleDialInteraction(touch.clientX, touch.clientY);
      }
    },
    [handleDialInteraction],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      if (touch) {
        handleDialInteraction(touch.clientX, touch.clientY);
      }
    },
    [isDragging, handleDialInteraction],
  );

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // Auto-advance to minutes after selecting hour
      if (dialMode === 'hour') {
        setDialMode('minute');
      }
    }
  }, [isDragging, dialMode]);

  // Handle clicking on a specific number
  const handleNumberClick = useCallback(
    (value: number) => {
      if (dialMode === 'hour') {
        setHours(value);
        setDialMode('minute');
      } else {
        setMinutes(value);
      }
    },
    [dialMode],
  );

  const handleSave = () => {
    setSelectedValue(formatTimeValue(hours, minutes, period));
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} title="" contentClassName="p-0 gap-0">
      <div className="flex w-full flex-col items-center pb-4">
        <div className="w-full px-6 pt-6 pb-4">
          <span className="text-label-medium text-on-surface-variant font-medium">
            {inputType === 'dial' ? 'Select time' : 'Enter time'}
          </span>
        </div>

        <div className="mb-6 flex w-full items-center justify-center gap-2 px-6">
          {inputType === 'dial' ? (
            <>
              <div
                className={cn(
                  'text-display-large flex h-20 min-w-24 cursor-pointer items-center justify-center rounded-sm border-2 px-4 py-3 transition-colors',
                  dialMode === 'hour'
                    ? 'bg-primary-container text-on-primary-container border-transparent'
                    : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high border-transparent',
                )}
                onClick={() => setDialMode('hour')}
                role="button"
                aria-label={`Hours: ${hours}`}
                aria-pressed={dialMode === 'hour'}
              >
                {hours.toString().padStart(2, '0')}
              </div>

              <span className="text-display-large text-on-surface mb-2" aria-hidden="true">
                :
              </span>

              <div
                className={cn(
                  'text-display-large flex h-20 min-w-24 cursor-pointer items-center justify-center rounded-sm border-2 px-4 py-3 transition-colors',
                  dialMode === 'minute'
                    ? 'bg-primary-container text-on-primary-container border-transparent'
                    : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high border-transparent',
                )}
                onClick={() => setDialMode('minute')}
                role="button"
                aria-label={`Minutes: ${minutes}`}
                aria-pressed={dialMode === 'minute'}
              >
                {minutes.toString().padStart(2, '0')}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <TextField
                variant="outlined"
                className="w-24"
                label="Hour"
                type="number"
                min={1}
                max={12}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              />
              <span className="text-display-large">:</span>
              <TextField
                variant="outlined"
                className="w-24"
                label="Minute"
                type="number"
                min={0}
                max={59}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
              />
            </div>
          )}

          <div
            className="border-outline-variant bg-surface ml-3 flex h-20 shrink-0 flex-col overflow-hidden rounded-sm border"
            role="radiogroup"
            aria-label="AM/PM"
          >
            <button
              onClick={() => setPeriod('AM')}
              role="radio"
              aria-checked={period === 'AM'}
              className={cn(
                'text-label-medium hover:bg-state-hover border-outline-variant flex-1 border-b px-4 font-medium transition-colors',
                period === 'AM'
                  ? 'bg-tertiary-container text-on-tertiary-container'
                  : 'text-on-surface-variant',
              )}
            >
              AM
            </button>
            <button
              onClick={() => setPeriod('PM')}
              role="radio"
              aria-checked={period === 'PM'}
              className={cn(
                'text-label-medium hover:bg-state-hover flex-1 px-4 font-medium transition-colors',
                period === 'PM'
                  ? 'bg-tertiary-container text-on-tertiary-container'
                  : 'text-on-surface-variant',
              )}
            >
              PM
            </button>
          </div>
        </div>

        {inputType === 'dial' && (
          <div className="animate-in fade-in zoom-in-95 duration-emphasized relative mb-4 flex w-full justify-center">
            <div
              ref={dialRef}
              className="bg-surface-container-highest relative h-64 w-64 shrink-0 cursor-pointer touch-none rounded-full select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              role="listbox"
              aria-label={dialMode === 'hour' ? 'Select hour' : 'Select minute'}
            >
              <div className="bg-primary pointer-events-none absolute top-1/2 left-1/2 z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />

              <div
                className={cn(
                  'bg-primary pointer-events-none absolute top-1/2 left-1/2 z-10 h-25 w-0.5 origin-bottom',
                  isDragging ? 'transition-none' : 'duration-long ease-standard transition-transform',
                )}
                style={{
                  transform: `translate(-50%, -100%) rotate(${getRotation()}deg)`,
                }}
              >
                <div className="bg-primary border-surface absolute top-0 left-1/2 -mt-1 h-2 w-2 -translate-x-1/2 rounded-full border-2" />
                <div className="bg-primary absolute top-0 left-1/2 -mt-6 h-12 w-12 -translate-x-1/2 rounded-full opacity-20" />
                <div className="bg-primary border-surface absolute top-0 left-1/2 -mt-[calc(var(--unit)*0.75)] h-1.5 w-1.5 -translate-x-1/2 rounded-full border" />
              </div>

              {dialMode === 'hour'
                ? // Hour numbers (1-12)
                  [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
                    const angle = num * 30 - 90;
                    const rad = angle * (Math.PI / 180);
                    const x = 50 + 42 * Math.cos(rad);
                    const y = 50 + 42 * Math.sin(rad);

                    const isSelected = hours === num;

                    return (
                      <div
                        key={num}
                        role="option"
                        aria-selected={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNumberClick(num);
                        }}
                        className={cn(
                          'text-body-medium hover:bg-state-hover absolute z-30 -mt-4 -ml-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors',
                          isSelected ? 'text-on-primary font-medium' : 'text-on-surface',
                        )}
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        {num}
                      </div>
                    );
                  })
                : // Minute numbers (00, 05, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55)
                  [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((num) => {
                    const angle = num * 6 - 90;
                    const rad = angle * (Math.PI / 180);
                    const x = 50 + 42 * Math.cos(rad);
                    const y = 50 + 42 * Math.sin(rad);

                    const isSelected = minutes === num;

                    return (
                      <div
                        key={num}
                        role="option"
                        aria-selected={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNumberClick(num);
                        }}
                        className={cn(
                          'text-body-medium hover:bg-state-hover absolute z-30 -mt-4 -ml-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors',
                          isSelected ? 'text-on-primary font-medium' : 'text-on-surface',
                        )}
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        {num.toString().padStart(2, '0')}
                      </div>
                    );
                  })}
            </div>
          </div>
        )}

        <div className="mt-2 flex w-full items-center justify-between px-4">
          <IconButton
            variant="standard"
            aria-label={inputType === 'dial' ? 'Switch to keyboard' : 'Switch to clock'}
            onClick={() => setInputType(inputType === 'dial' ? 'keyboard' : 'dial')}
            icon={<Icon symbol={inputType === 'dial' ? 'keyboard' : 'schedule'} size={24} />}
          />
          <div className="flex gap-2">
            <Button variant="text" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="text" onClick={handleSave}>
              OK
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
