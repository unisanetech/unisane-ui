import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const progressVariants = cva(
  'relative w-full overflow-hidden rounded-sm bg-surface-container-highest',
  {
    variants: {
      variant: {
        linear: 'h-1',
        circular: 'w-16 h-16',
      },
      indeterminate: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'linear',
      indeterminate: false,
    },
  },
);

export type ProgressProps = VariantProps<typeof progressVariants> & {
  value?: number;
  variant?: 'linear' | 'circular';
  indeterminate?: boolean;
  className?: string;
};

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  variant = 'linear',
  indeterminate = false,
  className,
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  if (variant === 'circular') {
    const circumference = 2 * Math.PI * 30;
    const strokeDashoffset = indeterminate
      ? undefined
      : circumference - (clampedValue / 100) * circumference;

    return (
      <div
        className={cn('relative h-16 w-16', className)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : clampedValue}
      >
        <svg className="h-full w-full" viewBox="0 0 64 64">
          <circle
            className="text-surface-container-highest"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            r="30"
            cx="32"
            cy="32"
          />
          <circle
            className={cn(
              'text-primary duration-emphasized transition-all',
              indeterminate && 'animate-spin',
            )}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            r="30"
            cx="32"
            cy="32"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              animation: indeterminate ? 'spin 1s linear infinite' : undefined,
            }}
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={cn(progressVariants({ variant, indeterminate, className }))}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : clampedValue}
    >
      <div
        className={cn(
          'bg-primary duration-emphasized h-full transition-all',
          indeterminate && 'animate-pulse',
        )}
        style={{
          width: indeterminate ? '100%' : `${clampedValue}%`,
        }}
      >
        {indeterminate && (
          <div className="bg-primary h-full w-1/3 animate-[progress-indeterminate_1.5s_ease-in-out_infinite]" />
        )}
      </div>
    </div>
  );
};
