import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing } from '@/lib/utils';
import { Icon } from '@/primitives/icon';
import { Text } from '@/primitives/text';
import { Ripple } from '@/components/ui/ripple';

interface Step {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps?: Step[];
  activeStep?: number;
  children?: React.ReactNode;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, activeStep = 0, children, className }) => {
  if (!steps || steps.length === 0) {
    return (
      <div className={cn('flex w-full items-center justify-between', className)}>{children}</div>
    );
  }

  return (
    <div className={cn('flex w-full items-start gap-0', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={`${step.label}-${index}`}
            className={cn('relative flex flex-col items-center', isLast ? 'flex-none' : 'flex-1')}
          >
            {!isLast && (
              <div
                className={cn(
                  'duration-medium absolute top-4 left-1/2 z-0 h-0.5 w-full transition-colors',
                  isCompleted ? 'bg-primary' : 'bg-outline-subtle',
                )}
              />
            )}

            <div
              className={cn(
                'text-label-small duration-emphasized z-10 flex h-8 w-8 items-center justify-center rounded-button border-2 font-medium transition-all',
                isActive && 'bg-primary border-primary text-on-primary scale-110',
                isCompleted && 'bg-primary border-primary text-on-primary',
                !isActive &&
                  !isCompleted &&
                  'bg-surface border-outline-variant text-on-surface-variant',
              )}
            >
              {isCompleted ? <Icon symbol="check" size={18} strokeWidth={4} /> : index + 1}
            </div>

            <div className="mt-4 max-w-30 px-2 text-center">
              <span
                className={cn(
                  'text-label-small block font-medium transition-colors',
                  isActive ? 'text-on-surface' : 'text-on-surface-variant',
                )}
              >
                {step.label}
              </span>
              {step.description && (
                <span className="text-label-small text-on-surface-variant mt-1 hidden leading-none font-medium @md:block">
                  {step.description}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const stepVariants = cva(
  'relative flex items-center gap-3 cursor-pointer select-none overflow-hidden rounded-button',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
      active: {
        true: '',
        false: '',
      },
      completed: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      active: false,
      completed: false,
    },
  },
);

export type StepProps = VariantProps<typeof stepVariants> & {
  stepNumber: number;
  active?: boolean;
  completed?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export const Step: React.FC<StepProps> = ({
  stepNumber,
  active,
  completed,
  orientation,
  children,
  onClick,
  className,
}) => {
  const content = (
    <>
      <Ripple />
      <div
        className={cn(
          'duration-medium ease-standard flex h-8 w-8 items-center justify-center rounded-button transition-colors',
          active
            ? 'bg-primary text-on-primary'
            : completed
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface-variant text-on-surface-variant',
        )}
      >
        <Text variant="labelLarge">{completed ? '✓' : stepNumber}</Text>
      </div>

      <div className={cn('flex-1', orientation === 'vertical' && 'mt-2 ml-0')}>{children}</div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={cn(stepVariants({ orientation, active, completed, className }), focusRing)}
        onClick={onClick}
        aria-current={active ? 'step' : undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={cn(stepVariants({ orientation, active, completed, className }))}
      aria-current={active ? 'step' : undefined}
    >
      {content}
    </div>
  );
};

export type StepLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export const StepLabel: React.FC<StepLabelProps> = ({ children, className }) => {
  return (
    <div className={className}>
      <Text variant="bodyLarge">{children}</Text>
    </div>
  );
};

export type StepDescriptionProps = {
  children: React.ReactNode;
  className?: string;
};

export const StepDescription: React.FC<StepDescriptionProps> = ({ children, className }) => {
  return (
    <div className={className}>
      <Text variant="bodyMedium" className="text-on-surface-variant">
        {children}
      </Text>
    </div>
  );
};
