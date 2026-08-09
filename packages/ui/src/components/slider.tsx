'use client';

import React, { useState, useRef } from 'react';
import { cn } from '../lib/utils';
import { useControllableState } from '../lib/use-controllable-state';

export interface SliderProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange'
> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  withLabel?: boolean;
  withTicks?: boolean;
  showValue?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 50,
  onValueChange,
  className,
  disabled,
  withLabel = false,
  withTicks = false,
  showValue = false,
  ...props
}) => {
  const [currentValue, setCurrentValue] = useControllableState<number>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const val = currentValue ?? defaultValue;

  const percentage = ((val - min) / (max - min)) * 100;

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setCurrentValue(newValue);
  };

  const ticks: number[] = [];
  if (withTicks && step > 0) {
    const count = Math.floor((max - min) / step);
    if (count < 50) {
      for (let i = 0; i <= count; i++) {
        ticks.push((i / count) * 100);
      }
    }
  }

  const shouldShowLabel = withLabel || showValue;

  return (
    <div
      className={cn(
        'group relative flex h-10 w-full touch-none items-center select-none',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <input
        ref={inputRef}
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        disabled={disabled}
        onChange={handleValueChange}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={val}
        aria-orientation="horizontal"
        className="absolute inset-0 z-30 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...props}
      />

      <div className="relative flex h-1 w-full items-center rounded-sm">
        <div
          className={cn(
            'absolute h-full w-full rounded-sm transition-colors',
            disabled ? 'bg-outline-weak' : 'bg-surface-container-highest',
          )}
        />

        <div
          className={cn(
            'duration-snappy absolute h-full rounded-sm transition-all',
            disabled ? 'bg-outline-muted' : 'bg-primary',
          )}
          style={{ width: `${percentage}%` }}
        />

        {withTicks &&
          ticks.map((tick, i) => (
            <div
              key={i}
              className={cn(
                'absolute z-10 h-0.5 w-0.5 rounded-full',
                tick <= percentage ? 'bg-on-primary' : 'bg-outline-medium',
              )}
              style={{ left: `${tick}%` }}
            />
          ))}
      </div>

      <div
        className="pointer-events-none absolute z-20 flex h-full items-center justify-center"
        style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
      >
        {!disabled && (
          <div
            className={cn(
              'bg-primary duration-medium absolute h-10 w-10 rounded-full transition-opacity',
              isHovered || isPressed ? 'opacity-10' : 'opacity-0',
              isPressed && 'opacity-20',
            )}
          />
        )}

        <div
          className={cn(
            'duration-medium ease-emphasized rounded-full transition-all',
            disabled
              ? 'bg-outline-muted h-3 w-3'
              : 'bg-primary size-icon-sm group-active:scale-125',
          )}
        >
          {shouldShowLabel && !disabled && (
            <div
              className={cn(
                'absolute bottom-8 left-1/2 h-7 min-w-7 -translate-x-1/2 px-2',
                'bg-inverse-surface text-inverse-on-surface text-label-small shadow-2 flex items-center justify-center rounded-sm font-medium',
                'duration-medium ease-emphasized origin-bottom transition-all',
                isHovered || isPressed
                  ? 'translate-y-0 scale-100 opacity-100'
                  : 'translate-y-2 scale-50 opacity-0',
              )}
            >
              {val}
              <div className="bg-inverse-surface absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[calc(var(--unit)/4)]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
