'use client';

import * as React from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from './field';
import { cn } from '../lib/utils';
import { getFieldSizeStyles, type FieldSize } from '../lib/field-size';
import {
  fieldContainerVariants,
  getFieldAffixClasses,
  getFieldHelperTextClasses,
  getFieldLabelClasses,
  type FieldShellVariant,
} from '../lib/field-shell';

type TextFieldControl = HTMLInputElement | HTMLTextAreaElement;

type TextFieldCommonProps = {
  autoResize?: boolean;
  autoResizeMaxHeight?: number;
  className?: string;
  defaultValue?: string | number;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  hideLabel?: boolean;
  invalid?: boolean;
  label: React.ReactNode;
  leadingIcon?: React.ReactNode;
  onValueChange?: (value: string) => void;
  size?: FieldSize;
  trailingIcon?: React.ReactNode;
  value?: string | number;
  variant?: FieldShellVariant;
};

type ReplacedNativeProps =
  | 'children'
  | 'className'
  | 'defaultValue'
  | 'onChange'
  | 'size'
  | 'value';

type TextFieldEvents = Omit<
  React.DOMAttributes<TextFieldControl>,
  'children' | 'dangerouslySetInnerHTML' | 'onChange'
>;

type TextFieldInputAttributes = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  ReplacedNativeProps | keyof React.DOMAttributes<HTMLInputElement>
>;

type TextFieldTextareaAttributes = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  ReplacedNativeProps | keyof React.DOMAttributes<HTMLTextAreaElement>
>;

export type TextFieldProps = TextFieldCommonProps &
  TextFieldEvents &
  (TextFieldInputAttributes | TextFieldTextareaAttributes) & {
    multiline?: boolean;
  };

export const TextField = React.forwardRef<TextFieldControl, TextFieldProps>(
  (props, forwardedRef) => {
    const {
      autoResize = false,
      autoResizeMaxHeight = 360,
      className,
      defaultValue = '',
      description,
      errorMessage,
      hideLabel = false,
      invalid = false,
      label,
      leadingIcon,
      multiline = false,
      onValueChange,
      size = 'md',
      trailingIcon,
      value,
      variant = 'outlined',
      ...nativeControlProps
    } = props;
    const inputProps = nativeControlProps as TextFieldInputAttributes & TextFieldEvents;
    const textareaProps = nativeControlProps as TextFieldTextareaAttributes & TextFieldEvents;
    const id = nativeControlProps.id;
    const disabled = nativeControlProps.disabled;
    const placeholder = nativeControlProps.placeholder;
    const required = nativeControlProps.required;
    const externalDescribedBy = nativeControlProps['aria-describedby'];
    const generatedId = React.useId();
    const fieldId = id ?? `textfield-${generatedId}`;
    const descriptionId = description ? `${fieldId}-description` : undefined;
    const errorId = errorMessage ? `${fieldId}-error` : undefined;
    const resolvedInvalid = invalid || Boolean(errorMessage);
    const messageId = errorMessage ? errorId : descriptionId;
    const describedBy = mergeIds(externalDescribedBy, messageId);
    const fieldSize = getFieldSizeStyles(size);
    const internalRef = React.useRef<TextFieldControl | null>(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(String(defaultValue));
    const currentValue = value === undefined ? uncontrolledValue : String(value);
    const hasValue = currentValue.length > 0;
    const isFloating = hideLabel || Boolean(placeholder) || isFocused || hasValue;

    const setControlRef = React.useCallback(
      (node: TextFieldControl | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    React.useLayoutEffect(() => {
      if (!multiline || !autoResize) return;
      resizeTextarea(internalRef.current, autoResizeMaxHeight);
    }, [autoResize, autoResizeMaxHeight, currentValue, multiline]);

    function handleValueChange(nextValue: string) {
      if (value === undefined) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    }

    const controlClasses = cn(
      'unisane-text-field-control text-on-surface caret-primary h-full w-full border-none bg-transparent outline-none focus:ring-0',
      'placeholder:text-on-surface-variant',
      fieldSize.horizontalPadding,
      fieldSize.valueText,
      variant === 'filled' ? fieldSize.filledInputPadding : '',
    );

    return (
      <Field className={className} invalid={resolvedInvalid}>
        <div
          className={cn(
            fieldContainerVariants({ variant, error: resolvedInvalid, disabled }),
            multiline ? 'items-start py-0' : ['items-center', fieldSize.containerHeight],
          )}
        >
          {leadingIcon ? (
            <span
              className={getFieldAffixClasses({
                size,
                error: resolvedInvalid,
                active: isFocused,
                multiline,
                side: 'leading',
              })}
            >
              <span className={cn(fieldSize.iconSize, 'flex items-center justify-center')}>
                {leadingIcon}
              </span>
            </span>
          ) : null}
          <div className="relative h-full min-w-0 flex-1">
            {multiline ? (
              <textarea
                {...textareaProps}
                ref={setControlRef as React.RefCallback<HTMLTextAreaElement>}
                id={fieldId}
                value={value}
                defaultValue={value === undefined ? defaultValue : undefined}
                aria-describedby={describedBy}
                aria-invalid={resolvedInvalid || undefined}
                className={cn(
                  controlClasses,
                  'min-h-24 resize-none',
                  fieldSize.multilinePaddingY,
                  variant === 'filled' ? fieldSize.filledTextareaPadding : '',
                )}
                onBlur={(event) => {
                  setIsFocused(false);
                  textareaProps.onBlur?.(event);
                }}
                onChange={(event) => {
                  handleValueChange(event.currentTarget.value);
                  if (autoResize) resizeTextarea(event.currentTarget, autoResizeMaxHeight);
                }}
                onFocus={(event) => {
                  setIsFocused(true);
                  textareaProps.onFocus?.(event);
                }}
              />
            ) : (
              <input
                {...inputProps}
                ref={setControlRef as React.RefCallback<HTMLInputElement>}
                id={fieldId}
                value={value}
                defaultValue={value === undefined ? defaultValue : undefined}
                aria-describedby={describedBy}
                aria-invalid={resolvedInvalid || undefined}
                className={controlClasses}
                onBlur={(event) => {
                  setIsFocused(false);
                  inputProps.onBlur?.(event);
                }}
                onChange={(event) => handleValueChange(event.currentTarget.value)}
                onFocus={(event) => {
                  setIsFocused(true);
                  inputProps.onFocus?.(event);
                }}
              />
            )}
            <FieldLabel
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
                      active: isFocused,
                      multiline,
                    })
              }
            >
              {label}
            </FieldLabel>
          </div>
          {trailingIcon ? (
            <span
              className={getFieldAffixClasses({
                size,
                error: resolvedInvalid,
                multiline,
                side: 'trailing',
              })}
            >
              <span className={cn(fieldSize.iconSize, 'flex items-center justify-center')}>
                {trailingIcon}
              </span>
            </span>
          ) : null}
        </div>
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
TextField.displayName = 'TextField';

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.filter(Boolean).join(' ');
  return merged || undefined;
}

function resizeTextarea(field: TextFieldControl | null, maxHeight: number) {
  if (!(field instanceof HTMLTextAreaElement)) return;

  field.style.height = 'auto';
  const nextHeight = Math.min(field.scrollHeight, maxHeight);
  field.style.height = `${nextHeight}px`;
  field.style.overflowY = field.scrollHeight > maxHeight ? 'auto' : 'hidden';
}
