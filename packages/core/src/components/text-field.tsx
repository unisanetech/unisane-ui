"use client";

import React, { useId, useState, useEffect, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ui/lib/utils";
import { getFieldSizeStyles, type FieldSize } from "@ui/lib/field-size";

const textFieldContainerVariants = cva(
  "relative flex w-full transition-all duration-snappy ease-emphasized group cursor-text",
  {
    variants: {
      variant: {
        outlined:
          "rounded-sm border border-outline-variant bg-surface hover:border-outline focus-within:border-primary! focus-within:ring-1 focus-within:ring-focus-ring",
        filled:
          "rounded-t-sm rounded-b-none border-b border-outline-variant bg-surface-container-low hover:bg-surface-container focus-within:bg-surface",
      },
      error: {
        true: "border-error focus-within:border-error hover:border-error ring-focus-ring-error",
      },
      disabled: {
        true: "opacity-38 cursor-not-allowed pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "outlined",
      error: false,
    },
  }
);

export type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> &
  VariantProps<typeof textFieldContainerVariants> & {
    label: string;
    helperText?: string;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    multiline?: boolean;
    labelClassName?: string;
    labelBg?: string;
    size?: FieldSize;
  };

export const TextField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextFieldProps
>(
  (
    {
      label,
      variant = "outlined",
      error,
      helperText,
      leadingIcon,
      trailingIcon,
      className,
      labelClassName,
      labelBg,
      size = "md",
      id,
      multiline = false,
      disabled,
      value,
      defaultValue,
      onFocus,
      onBlur,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || `textfield-${generatedId}`;
    const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const fieldSize = getFieldSizeStyles(size);
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(
      value || defaultValue || ""
    );

    useEffect(() => {
      if (value !== undefined) setInternalValue(value);
    }, [value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e as React.FocusEvent<HTMLInputElement> & React.FocusEvent<HTMLTextAreaElement>);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e as React.FocusEvent<HTMLInputElement> & React.FocusEvent<HTMLTextAreaElement>);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e as React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>);
    };

    const hasValue =
      internalValue !== undefined &&
      internalValue !== null &&
      internalValue !== "";
    const isFloating = isFocused || hasValue;

    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(internalRef.current);
        } else {
          (ref as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>).current = internalRef.current;
        }
      }
    }, [ref]);

    return (
      <div className={cn("relative inline-flex flex-col w-full", className)}>
        <div
          className={cn(
            textFieldContainerVariants({ variant, error, disabled }),
            multiline ? "items-start py-0" : ["items-center", fieldSize.containerHeight]
          )}
        >
          {leadingIcon && (
            <span
              className={cn(
                "transition-colors shrink-0 flex items-center justify-center",
                fieldSize.leadingPadding,
                multiline ? fieldSize.multilineIconOffset : "h-full",
                error
                  ? "text-error"
                  : isFocused
                  ? "text-primary"
                  : "text-on-surface-variant"
              )}
            >
              <div className={cn(fieldSize.iconSize, "flex items-center justify-center")}>
                {leadingIcon}
              </div>
            </span>
          )}
          <div className="relative flex-1 h-full min-w-0">
            {multiline ? (
              <textarea
                ref={internalRef as React.RefObject<HTMLTextAreaElement>}
                id={inputId}
                {...(value !== undefined ? { value } : { defaultValue })}
                disabled={disabled}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                className={cn(
                  "w-full h-full bg-transparent outline-none border-none focus:ring-0 text-on-surface caret-primary placeholder-transparent resize-none min-h-24",
                  fieldSize.horizontalPadding,
                  fieldSize.multilinePaddingY,
                  fieldSize.valueText,
                  variant === "filled" ? fieldSize.filledTextareaPadding : ""
                )}
                placeholder=" "
                {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              />
            ) : (
              <input
                ref={internalRef as React.RefObject<HTMLInputElement>}
                id={inputId}
                {...(value !== undefined ? { value } : { defaultValue })}
                disabled={disabled}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                className={cn(
                  "w-full h-full bg-transparent outline-none border-none focus:ring-0 text-on-surface caret-primary placeholder-transparent",
                  fieldSize.horizontalPadding,
                  fieldSize.valueText,
                  variant === "filled" ? fieldSize.filledInputPadding : ""
                )}
                placeholder=" "
                {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
              />
            )}
            <label
              htmlFor={inputId}
              className={cn(
                "absolute pointer-events-none truncate max-w-[calc(100%-calc(var(--unit)*4))] transition-all duration-medium ease-emphasized origin-left",
                fieldSize.labelLeft,
                !isFloating && [
                  fieldSize.valueText,
                  "text-on-surface-variant",
                  multiline ? fieldSize.multilineLabelTop : "top-1/2 -translate-y-1/2",
                ],
                isFloating && [
                  "text-label-small font-medium",
                  variant === "outlined" && [
                    "top-0 -translate-y-1/2 px-1 -ml-1",
                    labelBg || "bg-surface",
                    labelClassName,
                  ],
                  variant === "filled" && fieldSize.filledFloatingLabel,
                  error
                    ? "text-error"
                    : isFocused
                    ? "text-primary"
                    : "text-on-surface-variant",
                ]
              )}
            >
              {label}
            </label>
          </div>
          {trailingIcon && (
            <span
              className={cn(
                "transition-colors shrink-0 flex items-center justify-center",
                fieldSize.trailingPadding,
                multiline ? fieldSize.multilineIconOffset : "h-full",
                error ? "text-error" : "text-on-surface-variant"
              )}
            >
              <div className={cn(fieldSize.iconSize, "flex items-center justify-center")}>
                {trailingIcon}
              </div>
            </span>
          )}
        </div>
        {helperText && (
          <span
            className={cn(
              "text-label-small font-medium",
              fieldSize.helperMarginTop,
              fieldSize.helperPaddingX,
              error ? "text-error" : "text-on-surface-variant"
            )}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
TextField.displayName = "TextField";
