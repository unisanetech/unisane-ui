import React, { forwardRef } from 'react';
import { cn, focusRing } from '@/lib/utils';
import { Text } from '@/primitives/text';
import { Icon } from '@/components/ui/icon';
import { Ripple } from '@/components/ui/ripple';

export interface StepperStep {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  completed?: boolean;
  disabled?: boolean;
}

export interface StepperLabels {
  step: (position: number, total: number) => string;
  completed: string;
}

export interface StepperProps extends Omit<
  React.OlHTMLAttributes<HTMLOListElement>,
  'children' | 'onChange'
> {
  steps: StepperStep[];
  value: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  labels?: Partial<StepperLabels>;
}

const defaultLabels: StepperLabels = {
  step: (position, total) => `Step ${position} of ${total}`,
  completed: 'Completed',
};

function resolveActiveIndex(steps: StepperStep[], value: string) {
  const requestedIndex = steps.findIndex((step) => step.value === value && !step.disabled);
  if (requestedIndex >= 0) return requestedIndex;

  const firstAvailableIndex = steps.findIndex((step) => !step.disabled);
  return firstAvailableIndex >= 0 ? firstAvailableIndex : 0;
}

export const Stepper = forwardRef<HTMLOListElement, StepperProps>(
  (
    { steps, value, onValueChange, orientation = 'horizontal', labels, className, ...props },
    ref,
  ) => {
    if (steps.length === 0) return null;

    const activeIndex = resolveActiveIndex(steps, value);
    const resolvedLabels = { ...defaultLabels, ...labels };
    const interactive = onValueChange !== undefined;

    return (
      <ol
        {...props}
        ref={ref}
        className={cn(
          'm-0 flex w-full list-none p-0',
          orientation === 'horizontal' ? 'items-start' : 'flex-col',
          className,
        )}
      >
        {steps.map((step, index) => {
          const current = index === activeIndex;
          const completed = !current && (step.completed ?? index < activeIndex);
          const last = index === steps.length - 1;
          const positionLabel = resolvedLabels.step(index + 1, steps.length);
          const content = (
            <>
              {interactive && !step.disabled && <Ripple />}
              <span
                aria-hidden="true"
                className={cn(
                  'duration-medium ease-standard rounded-button relative z-10 flex h-8 w-8 shrink-0 items-center justify-center border-2 transition-all',
                  current && 'border-primary bg-primary text-on-primary scale-110',
                  completed &&
                    'border-primary-container bg-primary-container text-on-primary-container',
                  !current &&
                    !completed &&
                    'border-outline-subtle bg-surface text-on-surface-variant',
                )}
              >
                {completed ? (
                  <Icon symbol="check" size="sm" />
                ) : (
                  <Text variant="labelLarge">{index + 1}</Text>
                )}
              </span>

              <span
                className={cn(
                  'relative z-10 min-w-0',
                  orientation === 'horizontal' ? 'mt-3 max-w-30 px-2 text-center' : 'flex-1',
                )}
              >
                <span className="sr-only">
                  {positionLabel}
                  {completed ? `, ${resolvedLabels.completed}` : ''}.{' '}
                </span>
                <Text
                  as="span"
                  variant="labelLarge"
                  className={cn(
                    'block font-medium',
                    current ? 'text-on-surface' : 'text-on-surface-variant',
                  )}
                >
                  {step.label}
                </Text>
                {step.description !== undefined && (
                  <Text
                    as="span"
                    variant="labelSmall"
                    className="text-on-surface-variant mt-1 block"
                  >
                    {step.description}
                  </Text>
                )}
              </span>
            </>
          );
          const actionClassName = cn(
            'relative flex min-w-0 overflow-hidden rounded-button',
            orientation === 'horizontal'
              ? 'flex-col items-center'
              : 'w-full flex-row items-start gap-3 text-left',
            step.disabled && 'opacity-38',
            interactive && !step.disabled && cn('cursor-pointer', focusRing),
          );

          return (
            <li
              key={step.value}
              className={cn(
                'relative min-w-0',
                orientation === 'horizontal'
                  ? last
                    ? 'flex-none'
                    : 'flex-1'
                  : 'w-full pb-6 last:pb-0',
              )}
            >
              {!last && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'duration-medium absolute z-0 transition-colors',
                    orientation === 'horizontal'
                      ? 'top-4 left-1/2 h-0.5 w-full'
                      : 'top-8 bottom-0 left-[15px] w-0.5',
                    completed ? 'bg-primary' : 'bg-outline-subtle',
                  )}
                />
              )}

              {interactive ? (
                <button
                  type="button"
                  className={actionClassName}
                  disabled={step.disabled}
                  aria-current={current ? 'step' : undefined}
                  onClick={() => {
                    if (!current) onValueChange?.(step.value);
                  }}
                >
                  {content}
                </button>
              ) : (
                <div className={actionClassName} aria-current={current ? 'step' : undefined}>
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    );
  },
);

Stepper.displayName = 'Stepper';
