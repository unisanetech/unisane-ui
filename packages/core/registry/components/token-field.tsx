'use client';

import React, {
  type ClipboardEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Chip } from '@/components/ui/chip';
import { cn } from '@/lib/utils';
import { getFieldSizeStyles, type FieldSize } from '@/lib/field-size';
import {
  fieldContainerVariants,
  getFieldAffixClasses,
  getFieldHelperTextClasses,
  getFieldLabelClasses,
  type FieldShellVariant,
} from '@/lib/field-shell';
import { useFieldState } from '@/lib/use-field-state';

type TokenFieldInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'value' | 'onChange' | 'size'
>;

export type TokenFieldProps = TokenFieldInputProps & {
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  label: string;
  variant?: FieldShellVariant;
  size?: FieldSize;
  error?: boolean;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  maxTokens?: number;
  allowDuplicates?: boolean;
  separators?: readonly string[];
  validateToken?: (token: string, values: readonly string[]) => string | null | undefined;
  normalizeToken?: (token: string) => string;
  labelClassName?: string;
  labelBg?: string;
  inputClassName?: string;
};

const DEFAULT_SEPARATORS = ['Enter', ',', ';'] as const;

export const TokenField = React.forwardRef<HTMLDivElement, TokenFieldProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      label,
      variant = 'outlined',
      size = 'md',
      error,
      helperText,
      leadingIcon,
      trailingIcon,
      maxTokens,
      allowDuplicates = false,
      separators = DEFAULT_SEPARATORS,
      validateToken,
      normalizeToken = normalizeTokenFieldToken,
      labelClassName,
      labelBg,
      inputClassName,
      className,
      id,
      disabled,
      placeholder,
      onFocus,
      onBlur,
      onKeyDown,
      onPaste,
      ...props
    },
    ref,
  ) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const tokenRefs = useRef<Array<HTMLDivElement | HTMLButtonElement | null>>([]);
    const fieldSize = getFieldSizeStyles(size);
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() => [
      ...(defaultValue ?? []),
    ]);
    const tokens = [...(isControlled ? value : uncontrolledValue)];
    const [draft, setDraft] = useState('');
    const [activeTokenIndex, setActiveTokenIndex] = useState<number | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);
    const atTokenLimit = maxTokens !== undefined && tokens.length >= maxTokens;
    const effectiveError = Boolean(error || validationMessage);
    const effectiveHelperText = validationMessage ?? helperText;
    const hasValue = tokens.length > 0 || draft.length > 0;
    const { fieldId, helperId, isFloating } = useFieldState({
      id,
      idPrefix: 'tokenfield',
      helperText: effectiveHelperText,
      active: isFocused,
      hasValue,
    });

    useEffect(() => {
      if (isControlled) return;
      setUncontrolledValue([...(defaultValue ?? [])]);
    }, [defaultValue, isControlled]);

    const commitTokens = (nextTokens: string[]) => {
      if (!isControlled) {
        setUncontrolledValue(nextTokens);
      }
      onValueChange?.(nextTokens);
    };

    const addTokens = (rawTokens: readonly string[]) => {
      setValidationMessage(null);
      const nextTokens = [...tokens];

      for (const rawToken of rawTokens) {
        const token = normalizeToken(rawToken);
        if (!token) continue;

        if (maxTokens !== undefined && nextTokens.length >= maxTokens) {
          setValidationMessage(`Add up to ${maxTokens} ${maxTokens === 1 ? 'item' : 'items'}.`);
          break;
        }

        if (!allowDuplicates && includesToken(nextTokens, token)) {
          continue;
        }

        const tokenError = validateToken?.(token, nextTokens);
        if (tokenError) {
          setValidationMessage(tokenError);
          continue;
        }

        nextTokens.push(token);
      }

      if (!arraysEqual(tokens, nextTokens)) {
        commitTokens(nextTokens);
      }
    };

    const commitDraft = () => {
      if (!draft.trim()) return;
      addTokens(splitTokenFieldInput(draft));
      setDraft('');
    };

    const setRootRef = (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const focusInput = () => {
      setActiveTokenIndex(null);
      if (!disabled) inputRef.current?.focus();
    };

    const focusToken = (index: number) => {
      if (disabled || tokens.length === 0) return;
      const boundedIndex = Math.max(0, Math.min(index, tokens.length - 1));
      setActiveTokenIndex(boundedIndex);
      window.requestAnimationFrame(() => tokenRefs.current[boundedIndex]?.focus());
    };

    const removeToken = (index: number, nextFocus: 'input' | 'previous' = 'input') => {
      setValidationMessage(null);
      const nextTokens = tokens.filter((_, tokenIndex) => tokenIndex !== index);
      commitTokens(nextTokens);

      if (nextFocus === 'previous' && nextTokens.length > 0) {
        const nextIndex = Math.min(index, nextTokens.length - 1);
        setActiveTokenIndex(nextIndex);
        window.requestAnimationFrame(() => tokenRefs.current[nextIndex]?.focus());
        return;
      }

      window.requestAnimationFrame(focusInput);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (separators.includes(event.key)) {
        event.preventDefault();
        commitDraft();
        return;
      }

      if (event.key === 'Backspace' && draft.length === 0 && tokens.length > 0) {
        event.preventDefault();
        removeToken(tokens.length - 1);
        return;
      }

      if (event.key === 'ArrowLeft' && draft.length === 0 && tokens.length > 0) {
        event.preventDefault();
        focusToken(tokens.length - 1);
      }
    };

    const handleTokenKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
      onKeyDown?.(event as KeyboardEvent<HTMLInputElement>);
      if (event.defaultPrevented) return;

      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        removeToken(index, 'previous');
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        focusToken(index - 1);
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (index >= tokens.length - 1) {
          focusInput();
          return;
        }
        focusToken(index + 1);
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        focusToken(0);
        return;
      }

      if (event.key === 'End' || event.key === 'Escape') {
        event.preventDefault();
        focusInput();
      }
    };

    const handleRootBlur = (event: FocusEvent<HTMLDivElement>) => {
      if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
        setActiveTokenIndex(null);
      }
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      onPaste?.(event);
      if (event.defaultPrevented) return;

      const pastedText = event.clipboardData.getData('text');
      const pastedTokens = splitTokenFieldInput(pastedText);
      if (pastedTokens.length <= 1) return;

      event.preventDefault();
      addTokens(pastedTokens);
      setDraft('');
    };

    return (
      <div
        ref={setRootRef}
        className={cn('relative inline-flex w-full flex-col', className)}
        onBlur={handleRootBlur}
      >
        <div
          className={cn(
            fieldContainerVariants({ variant, error: effectiveError, disabled }),
            'min-h-10 items-start py-0',
            size === 'sm' && 'min-h-8',
            size === 'lg' && 'min-h-12',
          )}
          onClick={focusInput}
        >
          {leadingIcon && (
            <span
              className={getFieldAffixClasses({
                size,
                error: effectiveError,
                active: isFocused,
                multiline: true,
                side: 'leading',
              })}
            >
              <div className={cn(fieldSize.iconSize, 'flex items-center justify-center')}>
                {leadingIcon}
              </div>
            </span>
          )}
          <div className="relative min-h-full min-w-0 flex-1">
            <div
              className={cn(
                'flex min-h-full w-full flex-wrap items-center gap-1.5',
                fieldSize.horizontalPadding,
                getTokenFieldContentPadding(size, variant),
              )}
            >
              {tokens.length ? (
                <span className="contents" role="list" aria-label={`${label} values`}>
                  {tokens.map((token, index) => (
                    <span key={`${token}:${index}`} role="listitem">
                      <Chip
                        ref={(node) => {
                          tokenRefs.current[index] = node;
                        }}
                        aria-label={`${token}. Press Delete to remove.`}
                        deleteButtonTabIndex={-1}
                        disabled={disabled}
                        label={token}
                        tabIndex={activeTokenIndex === index ? 0 : -1}
                        variant="input"
                        onDelete={() => removeToken(index)}
                        onFocus={() => setActiveTokenIndex(index)}
                        onKeyDown={(event) => handleTokenKeyDown(event, index)}
                      />
                    </span>
                  ))}
                </span>
              ) : null}
              <input
                ref={inputRef}
                id={fieldId}
                value={draft}
                disabled={disabled || atTokenLimit}
                placeholder={isFloating ? placeholder : ' '}
                aria-describedby={helperId}
                aria-invalid={effectiveError || undefined}
                className={cn(
                  'unisane-text-field-control text-on-surface caret-primary min-w-24 flex-1 border-none bg-transparent outline-none placeholder:text-on-surface-variant focus:ring-0 disabled:cursor-not-allowed',
                  fieldSize.valueText,
                  inputClassName,
                )}
                onFocus={(event) => {
                  setIsFocused(true);
                  onFocus?.(event);
                }}
                onBlur={(event) => {
                  setIsFocused(false);
                  commitDraft();
                  onBlur?.(event);
                }}
                onChange={(event) => {
                  setValidationMessage(null);
                  setDraft(event.currentTarget.value);
                }}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                {...props}
              />
            </div>
            <label
              htmlFor={fieldId}
              className={getFieldLabelClasses({
                size,
                variant,
                floating: isFloating,
                error: effectiveError,
                active: isFocused,
                multiline: true,
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
                error: effectiveError,
                multiline: true,
                side: 'trailing',
              })}
            >
              <div className={cn(fieldSize.iconSize, 'flex items-center justify-center')}>
                {trailingIcon}
              </div>
            </span>
          )}
        </div>
        {effectiveHelperText && (
          <span id={helperId} className={getFieldHelperTextClasses(size, effectiveError)}>
            {effectiveHelperText}
          </span>
        )}
      </div>
    );
  },
);

TokenField.displayName = 'TokenField';

export function normalizeTokenFieldToken(token: string) {
  return token.trim().replace(/\s+/g, ' ');
}

export function splitTokenFieldInput(value: string) {
  return value
    .split(/[\n,;]+/)
    .map(normalizeTokenFieldToken)
    .filter(Boolean);
}

function includesToken(tokens: readonly string[], token: string) {
  const normalized = token.toLocaleLowerCase();
  return tokens.some((item) => item.toLocaleLowerCase() === normalized);
}

function arraysEqual(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function getTokenFieldContentPadding(size: FieldSize, variant: FieldShellVariant) {
  if (variant === 'filled') {
    if (size === 'sm') return 'pt-5 pb-1.5';
    if (size === 'lg') return 'pt-7 pb-3';
    return 'pt-6 pb-2';
  }

  if (size === 'sm') return 'py-0';
  if (size === 'lg') return 'py-2';
  return 'py-1';
}
