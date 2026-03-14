'use client';

import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { getFieldSizeStyles, type FieldSize } from '@/lib/field-size';

export type FieldShellVariant = 'outlined' | 'filled';

export const fieldContainerVariants = cva(
  'relative flex w-full transition-all duration-snappy ease-emphasized group cursor-text',
  {
    variants: {
      variant: {
        outlined:
          'rounded-sm border border-outline-variant bg-surface hover:border-outline focus-within:border-primary! focus-within:ring-1 focus-within:ring-focus-ring',
        filled:
          'rounded-t-sm rounded-b-none border-b border-outline-variant bg-surface-container-low hover:bg-surface-container focus-within:bg-surface',
      },
      error: {
        true: 'border-error focus-within:border-error hover:border-error ring-focus-ring-error',
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

type FieldLabelClassOptions = {
  size?: FieldSize;
  variant?: FieldShellVariant;
  floating: boolean;
  error?: boolean;
  active?: boolean;
  multiline?: boolean;
  labelBg?: string;
  labelClassName?: string;
  restingTextClassName?: string;
};

export function getFieldLabelClasses({
  size = 'md',
  variant = 'outlined',
  floating,
  error = false,
  active = false,
  multiline = false,
  labelBg,
  labelClassName,
  restingTextClassName,
}: FieldLabelClassOptions) {
  const fieldSize = getFieldSizeStyles(size);

  return cn(
    'absolute pointer-events-none truncate max-w-[calc(100%-calc(var(--unit)*4))] transition-all duration-medium ease-emphasized origin-left',
    fieldSize.labelLeft,
    !floating && [
      restingTextClassName ?? fieldSize.valueText,
      'text-on-surface-variant',
      multiline ? fieldSize.multilineLabelTop : 'top-1/2 -translate-y-1/2',
    ],
    floating && [
      'text-label-small font-medium',
      variant === 'outlined' && ['top-0 -translate-y-1/2 px-1 -ml-1', labelBg || 'bg-surface', labelClassName],
      variant === 'filled' && fieldSize.filledFloatingLabel,
      error ? 'text-error' : active ? 'text-primary' : 'text-on-surface-variant',
    ],
  );
}

type FieldAffixClassOptions = {
  size?: FieldSize;
  error?: boolean;
  active?: boolean;
  multiline?: boolean;
  side: 'leading' | 'trailing';
};

export function getFieldAffixClasses({
  size = 'md',
  error = false,
  active = false,
  multiline = false,
  side,
}: FieldAffixClassOptions) {
  const fieldSize = getFieldSizeStyles(size);

  return cn(
    'transition-colors shrink-0 flex items-center justify-center',
    side === 'leading' ? fieldSize.leadingPadding : fieldSize.trailingPadding,
    multiline ? fieldSize.multilineIconOffset : 'h-full',
    error ? 'text-error' : active ? 'text-primary' : 'text-on-surface-variant',
  );
}

export function getFieldHelperTextClasses(size: FieldSize = 'md', error = false) {
  const fieldSize = getFieldSizeStyles(size);

  return cn(
    'text-label-small font-medium',
    fieldSize.helperMarginTop,
    fieldSize.helperPaddingX,
    error ? 'text-error' : 'text-on-surface-variant',
  );
}
