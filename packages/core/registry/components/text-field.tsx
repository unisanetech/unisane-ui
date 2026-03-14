"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getFieldSizeStyles, type FieldSize } from "@/lib/field-size";
import {
  fieldContainerVariants,
  getFieldAffixClasses,
  getFieldHelperTextClasses,
  getFieldLabelClasses,
  type FieldShellVariant,
} from "@/lib/field-shell";
import { useFieldState } from "@/lib/use-field-state";

export type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> &
  {
    variant?: FieldShellVariant;
    error?: boolean;
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
    const { fieldId, helperId, isFloating } = useFieldState({
      id,
      idPrefix: "textfield",
      helperText,
      active: isFocused,
      hasValue,
    });

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
            fieldContainerVariants({ variant, error, disabled }),
            multiline ? "items-start py-0" : ["items-center", fieldSize.containerHeight]
          )}
        >
          {leadingIcon && (
            <span
              className={getFieldAffixClasses({
                size,
                error: Boolean(error),
                active: isFocused,
                multiline,
                side: "leading",
              })}
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
                id={fieldId}
                {...(value !== undefined ? { value } : { defaultValue })}
                disabled={disabled}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                aria-describedby={helperId}
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
                id={fieldId}
                {...(value !== undefined ? { value } : { defaultValue })}
                disabled={disabled}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                aria-describedby={helperId}
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
              htmlFor={fieldId}
              className={getFieldLabelClasses({
                size,
                variant,
                floating: isFloating,
                error: Boolean(error),
                active: isFocused,
                multiline,
                labelBg,
                labelClassName,
              })}
            >
              {label}
            </label>
          </div>
          {trailingIcon && (
            <span
              className={getFieldAffixClasses({
                size,
                error: Boolean(error),
                multiline,
                side: "trailing",
              })}
            >
              <div className={cn(fieldSize.iconSize, "flex items-center justify-center")}>
                {trailingIcon}
              </div>
            </span>
          )}
        </div>
        {helperText && (
          <span
            id={helperId}
            className={getFieldHelperTextClasses(size, Boolean(error))}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
TextField.displayName = "TextField";
