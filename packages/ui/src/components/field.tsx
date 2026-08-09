'use client';

import * as React from 'react';
import { Label } from '../primitives/label';
import { cn } from '../lib/utils';

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  invalid?: boolean;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, invalid = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative inline-flex w-full flex-col', className)}
      data-invalid={invalid || undefined}
      {...props}
    />
  ),
);
Field.displayName = 'Field';

export type FieldLabelProps = React.ComponentPropsWithoutRef<typeof Label>;

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => (
    <Label ref={ref} className={cn('text-on-surface', className)} {...props} />
  ),
);
FieldLabel.displayName = 'FieldLabel';

export type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-label-small text-on-surface-variant', className)} {...props} />
  ),
);
FieldDescription.displayName = 'FieldDescription';

export type FieldErrorProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, role = 'alert', ...props }, ref) => (
    <p ref={ref} role={role} className={cn('text-label-small text-error', className)} {...props} />
  ),
);
FieldError.displayName = 'FieldError';
