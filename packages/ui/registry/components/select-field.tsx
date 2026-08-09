'use client';

import * as React from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getFieldSizeStyles, type FieldSize } from '@/lib/field-size';
import {
  getFieldHelperTextClasses,
  getFieldLabelClasses,
  type FieldShellVariant,
} from '@/lib/field-shell';
import { useControllableState } from '@/lib/use-controllable-state';

export interface SelectFieldOption {
  value: string;
  label: React.ReactNode;
  textValue?: string;
  disabled?: boolean;
}

type SelectFieldNamingProps =
  | {
      label: React.ReactNode;
      hideLabel?: boolean;
      'aria-label'?: string;
    }
  | {
      label?: never;
      hideLabel?: never;
      'aria-label': string;
    };

type SelectFieldCommonProps = {
  id?: string;
  options: SelectFieldOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  placeholder?: React.ReactNode;
  portal?: boolean;
  size?: FieldSize;
  variant?: FieldShellVariant;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  'aria-describedby'?: string;
};

export type SelectFieldProps = SelectFieldCommonProps & SelectFieldNamingProps;

export const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(
  (
    {
      'aria-describedby': externalDescribedBy,
      'aria-label': ariaLabel,
      className,
      contentClassName,
      defaultOpen = false,
      defaultValue,
      description,
      disabled = false,
      errorMessage,
      hideLabel = false,
      id,
      invalid = false,
      label,
      name,
      onOpenChange,
      onValueChange,
      open,
      options,
      placeholder = 'Select an option',
      portal = true,
      required = false,
      size = 'md',
      triggerClassName,
      value,
      variant = 'outlined',
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const fieldId = id ?? `select-field-${generatedId}`;
    const labelId = label ? `${fieldId}-label` : undefined;
    const descriptionId = description ? `${fieldId}-description` : undefined;
    const errorId = errorMessage ? `${fieldId}-error` : undefined;
    const resolvedInvalid = invalid || Boolean(errorMessage);
    const messageId = errorMessage ? errorId : descriptionId;
    const describedBy = mergeIds(externalDescribedBy, messageId);
    const fieldSize = getFieldSizeStyles(size);
    const [selectedValue, setSelectedValue] = useControllableState<string>({
      value,
      defaultValue,
      onChange: onValueChange,
    });
    const [openState, setOpenState] = useControllableState<boolean>({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });
    const isOpen = openState ?? false;
    const isFloating = hideLabel || isOpen || Boolean(selectedValue);

    return (
      <Field className={className} invalid={resolvedInvalid}>
        <Select
          value={selectedValue}
          onValueChange={setSelectedValue}
          open={isOpen}
          onOpenChange={setOpenState}
          disabled={disabled}
          required={required}
          name={name}
        >
          <div className="relative">
            <SelectTrigger
              ref={ref}
              id={fieldId}
              variant={variant}
              size={size}
              invalid={resolvedInvalid}
              aria-label={ariaLabel}
              aria-labelledby={labelId}
              aria-describedby={describedBy}
              className={triggerClassName}
            >
              <span
                className={cn(
                  'pointer-events-none flex h-full min-w-0 items-center',
                  fieldSize.horizontalPadding,
                  fieldSize.valueText,
                  variant === 'filled' && label
                    ? cn('items-end', fieldSize.filledDisplayPadding)
                    : '',
                )}
              >
                <SelectValue placeholder={isFloating || !label ? placeholder : undefined} />
              </span>
            </SelectTrigger>
            {label ? (
              <FieldLabel
                id={labelId}
                htmlFor={fieldId}
                required={required}
                className={
                  hideLabel
                    ? 'sr-only'
                    : getFieldLabelClasses({
                        size,
                        variant,
                        floating: isFloating,
                        error: resolvedInvalid,
                        active: isOpen,
                        floatingClassName:
                          variant === 'filled' ? fieldSize.filledDisplayFloatingLabel : undefined,
                      })
                }
              >
                {label}
              </FieldLabel>
            ) : null}
          </div>
          <SelectContent portal={portal} className={contentClassName}>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                textValue={option.textValue ?? getOptionTextValue(option)}
              >
                {option.label}
              </SelectItem>
            ))}
            {options.length === 0 ? (
              <div className="text-label-medium text-on-surface-variant px-3 py-3 font-medium">
                No options
              </div>
            ) : null}
          </SelectContent>
        </Select>
        {errorMessage ? (
          <FieldError id={errorId} className={getFieldHelperTextClasses(size, true)}>
            {errorMessage}
          </FieldError>
        ) : description ? (
          <FieldDescription id={descriptionId} className={getFieldHelperTextClasses(size)}>
            {description}
          </FieldDescription>
        ) : null}
      </Field>
    );
  },
);
SelectField.displayName = 'SelectField';

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.filter(Boolean).join(' ');
  return merged || undefined;
}

function getOptionTextValue(option: SelectFieldOption) {
  if (typeof option.label === 'string' || typeof option.label === 'number') {
    return String(option.label);
  }
  return option.value;
}
